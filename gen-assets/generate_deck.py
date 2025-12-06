# /// script
# requires-python = ">=3.11"
# dependencies = [
#     "google-genai",
#     "python-dotenv",
#     "rich",
#     "pillow",
# ]
# ///
import os
import json
import time
import argparse
import base64
from pathlib import Path
from typing import List, Dict, Optional
from dotenv import load_dotenv
from google import genai
from google.genai import types
from PIL import Image
from rich.console import Console
from rich.progress import Progress, SpinnerColumn, TextColumn, BarColumn
from rich.panel import Panel
from rich.table import Table

# --- Configuración ---
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

ACTIVE_TEXT_MODEL = "gemini-3-pro-preview"
ACTIVE_IMAGE_MODEL = "gemini-3-pro-image-preview"

OUTPUT_BASE = Path("output")
OUTPUT_CARDS = OUTPUT_BASE / "cards"

OUTPUT_BASE.mkdir(parents=True, exist_ok=True)
OUTPUT_CARDS.mkdir(parents=True, exist_ok=True)

console = Console()

def print_banner():
    banner = """
    [bold yellow]
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║   🏃‍♂️ T E M P O   -   D E C K   G E N E R A T O R 🏃‍♀️        ║
    ║            (Road & Trail Edition)                            ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
    [/bold yellow]
    [cyan]Using Models: {text_model} & {image_model}[/cyan]
    """.format(text_model=ACTIVE_TEXT_MODEL, image_model=ACTIVE_IMAGE_MODEL)
    console.print(banner)

# Visual Identity System Prompt (Extracted from UI references)
STYLE_PROMPT = """
ESTILO VISUAL (OBLIGATORIO):
- TÉCNICA: Ilustración estilo "Lotería Mexicana" vintage (like traditional Lotería cards), imitando grabado en linóleo (linocut) o xilografía coloreada a mano.
- TRAZO: Líneas negras orgánicas, de grosor variable, con imperfecciones de tinta y texturas de impresión.
- COLOR: Colores estilo "acuarela" o "tinta diluida", desaturados y cálidos (Terracota, Mostaza, Verde Oliva, Azul Petróleo), aplicados con ligeros desajustes (el color se sale un poco de la línea).
- TEXTURA: Papel texturizado, beige/crema antiguo, con manchas de envejecimiento.
- COMPOSICIÓN: MACRO / EXTREME CLOSE-UP. El objeto principal es enorme y PUEDE CORTARSE POR LOS BORDES (FULL BLEED / Crop).
- BORDES INFINITOS: El fondo texturizado debe llegar hasta el borde del archivo. PROHIBIDO dibujar líneas perimetrales o marcos de contención. Imagina que es un recorte de una hoja más grande.
- SIN TEXTO: NO escribas el nombre. Solo se permite texto si es parte natural del objeto (ej. número en dorsal).
"""

def validate_env():
    if not API_KEY:
        console.print(Panel("[bold red]ERROR: GEMINI_API_KEY no encontrada en .env[/bold red]", expand=False))
        exit(1)
    console.print("[green]✓ Environment loaded successfully.[/green]")

def get_client():
    return genai.Client(api_key=API_KEY)


def generate_card_list(client, limit: int) -> List[Dict]:
    deck_path = OUTPUT_BASE / "deck.json"
    existing_cards = []
    
    # Check for existing deck (Single Source of Truth)
    if deck_path.exists():
        console.print(Panel(f"[bold green]FASE 1: CEREBRO (Cargando Deck Existente)[/bold green]", expand=False))
        try:
            with open(deck_path, 'r', encoding='utf-8') as f:
                existing_cards = json.load(f)
            console.print(f"[green]✓ Deck cargado de {deck_path} ({len(existing_cards)} cartas).[/green]")
            
            if len(existing_cards) >= limit:
                 return existing_cards[:limit]
            
            console.print(f"[yellow]! Solicitadas {limit} cartas, pero hay {len(existing_cards)}. Generando {limit - len(existing_cards)} adicionales...[/yellow]")
            
        except Exception as e:
            console.print(f"[yellow]! Error leyendo deck ({e}). Regenerando todo...[/yellow]")
            existing_cards = []

    # Calculate how many NEW cards needed
    needed = limit - len(existing_cards)
    start_id = len(existing_cards) + 1
    
    console.print(Panel(f"[bold cyan]FASE 1: EL CEREBRO (Generando {needed} Cartas Adicionales)[/bold cyan]", expand=False))
    
    # Context of existing names to avoid duplicates
    existing_names = ", ".join([c['nombre'] for c in existing_cards])

    prompt = f"""
    Eres un experto en cultura de correr (maratón y ultramaratón) y folclore mexicano. 
    Tienes una lista de cartas ya existentes: {existing_names}.
    Genera un JSON con una lista de exactamente {needed} NUEVOS objetos O PERSONAJES únicos para la baraja de lotería temática "Road & Trail". 
    
    REGLAS IMPORTANTES DE GENERACIÓN:
    1. **DISTRIBUCIÓN DE CATEGORÍAS**: Intenta que la distribución final de cartas (incluyendo las existentes) sea equilibrada entre "Road", "Trail" y "Ambos".
    2. **PERSONAJES (OBLIGATORIO)**: Al menos el 50% de las cartas generadas DEBEN ser PERSONAJES o ARQUETIPOS humanos (e.g. "LA VOCERA", "EL QUE VOMITA", "EL DE LAS BAJADAS", "LA ULTRA", "EL VOLUNTARIO"). No solo objetos.
    3. **NO REPETIR**: No uses nombres que ya existan en la lista proporcionada.
    
    Comienza los IDs a partir de {start_id}.
    
    CONTEXTO VISUAL PARA DESCRIPCIONES (Visual Prompt Description):
    {STYLE_PROMPT}
    
    Cada objeto debe tener la siguiente estructura:
    {{
        "id": numero,
        "nombre": "EL [NOMBRE]" o "LA [NOMBRE]" (Español),
        "categoria": "Road", "Trail" o "Ambos",
        "visual_prompt_description": "Description of the SUBJECT ONLY (pose, action, elements) fitting the Lotería theme. DO NOT repeat the general art style description here (it will be added programmatically). If it's a PERSONA, describe the humor/situation."
    }}

    Devuelve SOLAMENTE el JSON raw.
    """

    with console.status("[bold green]Brainstorming con Gemini...[/bold green]", spinner="dots"):
        try:
            response = client.models.generate_content(
                model=ACTIVE_TEXT_MODEL,
                contents=prompt,
                config=types.GenerateContentConfig(
                    response_mime_type="application/json",
                )
            )
            
            try:
                # Try parsing carefully
                if hasattr(response, 'parsed') and response.parsed:
                    new_cards = response.parsed
                else:
                    text = response.text
                    if text.strip().startswith("```json"):
                        text = text.replace("```json", "").replace("```", "")
                    new_cards = json.loads(text)
            except Exception as e:
                 console.print(f"[yellow]! Parsing error ({e}). Raw text: {response.text[:100]}...[/yellow]")
                 raise e

            if not new_cards:
                raise ValueError("Model returned empty list or None")

            # Normalize IDs if model messed up
            for i, card in enumerate(new_cards):
                card['id'] = start_id + i

            # Append and Save to SINGLE source of truth
            # We enforce removing 'image_path' if it accidentally crept in from previous logic or model
            clean_new_cards = [{k: v for k, v in c.items() if k != 'image_path'} for c in new_cards]
            
            full_list = existing_cards + clean_new_cards
            
            with open(deck_path, 'w', encoding='utf-8') as f:
                json.dump(full_list, f, indent=4, ensure_ascii=False)

            console.print(f"[green]✓ Deck actualizado con {len(clean_new_cards)} nuevas cartas (Total: {len(full_list)}). Guardado en {deck_path}.[/green]")
            return full_list

        except Exception as e:
            console.print(f"[bold red]Error generando lista: {e}[/bold red]")
            exit(1)

def generate_image(client, card: Dict, style_prompt: str, retries=1) -> Optional[str]:
    output_filename = f"{card['id']}.png"
    output_path = OUTPUT_CARDS / output_filename
    
    if output_path.exists():
        return str(output_path)

    # Combined visual prompt
    # Combined visual prompt
    visual_prompt = f"""
    **ART STYLE (Apply to whole image):**
    {style_prompt}
    
    **SUBJECT:**
    {card['visual_prompt_description']}
    
    **TEXT INSTRUCTION:**
    DO NOT write the name of the card ("{card['nombre']}") as a title or label.
    Text is ONLY allowed if it appears naturally on the object (e.g. numbers on a bib, text on a sign).
    
    High quality.
    """

    for attempt in range(retries + 1):
        try:
            # Using generate_content as requested for image generation
            response = client.models.generate_content(
                model=ACTIVE_IMAGE_MODEL,
                contents=visual_prompt,
                config=types.GenerateContentConfig(
                    image_config=types.ImageConfig(
                        aspect_ratio="3:4",
                    ),
                )
            )
            
            # Handling response - expecting bytes in inline_data or similar
            # The SDK often returns the image binary directly or wrapped
            if response.parts:
                for part in response.parts:
                    if part.inline_data:
                         img_data = base64.b64decode(part.inline_data.data) if isinstance(part.inline_data.data, str) else part.inline_data.data
                         with open(output_path, "wb") as f:
                             f.write(img_data)
                         time.sleep(2) # Rate limit politeness after generation
                         return str(output_path)
            
            # Fallback for some SDK versions where response itself might handle saving or have different structure
            # But relying on parts > inline_data is standard for multimodal download
            
        except Exception as e:
            if attempt < retries:
                time.sleep(2)
                continue
            console.print(f"[red]Error generando imagen para {card['nombre']}: {e}[/red]")
            return None
    return None

def main():
    parser = argparse.ArgumentParser(description="Tempo Deck Generator")
    parser.add_argument("--limit", "-n", type=int, default=54, help="Number of cards to generate (default: 54)")
    parser.add_argument("--deck-only", action="store_true", help="Generate only the card list (deck.json) without images")
    args = parser.parse_args()

    print_banner()
    validate_env()
    
    client = get_client()
    
    # Check for Reference and get Style (HARDCODED NOW)
    # style_prompt = analyze_style_reference(client) 
    style_prompt = STYLE_PROMPT

    # Fase 1
    cards = generate_card_list(client, args.limit)
    
    # Fase 2
    if args.deck_only:
        console.print(Panel("[bold yellow]FASE 2: EL ARTISTA (Saltada por --deck-only)[/bold yellow]", expand=False))
    else:
        console.print(Panel("[bold cyan]FASE 2: EL ARTISTA (Generando Imágenes)[/bold cyan]", expand=False))
        
        # deck_path = OUTPUT_BASE / "deck.json" (Already defined/implied, but we assume 'cards' is the master list now)
        deck_path = OUTPUT_BASE / "deck.json"

        with Progress(
        SpinnerColumn(),
        TextColumn("[progress.description]{task.description}"),
        BarColumn(),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        ) as progress:
            task = progress.add_task("[green]Pintando cartas...", total=len(cards))
            
            for i, card in enumerate(cards):
                progress.update(task, description=f"Pintando: {card['nombre']}")
                
                # Check filesystem directly for ID.png
                img_filename = f"{card['id']}.png"
                img_path = OUTPUT_CARDS / img_filename
                
                if img_path.exists():
                     progress.advance(task)
                     continue

                generated_path = generate_image(client, card, style_prompt)
                # We do NOT save the path to deck.json as requested
                
                progress.advance(task) 

    # Fase 3 (Summary only)
    console.print(Panel("[bold cyan]FASE 3: EL ARCHIVERO (Resumen)[/bold cyan]", expand=False))
    
    # Resumen
    table = Table(title=f"Resumen de Baraja Tempo ({len(cards)} cartas)")
    table.add_column("ID", justify="right")
    table.add_column("Nombre", style="magenta")
    table.add_column("Categoría", style="green")
    table.add_column("Imagen", style="cyan")
    
    for card in cards: 
        img_check = OUTPUT_CARDS / f"{card['id']}.png"
        status = "[green]✓[/green]" if img_check.exists() else "[red]Missing[/red]"
        table.add_row(str(card['id']), card['nombre'], card['categoria'], status)
        
    console.print(table)
    console.print(f"[bold green]✓ Proceso completado. Assets guardados en {OUTPUT_BASE}[/bold green]")

if __name__ == "__main__":
    main()