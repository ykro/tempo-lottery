# Asset Generation 🎨

Este directorio contiene los scripts para generar la baraja de la Lotería Tempo utilizando Google Gemini (Modelos `gemini-3-pro-preview` para texto y `gemini-3-pro-image-preview` para imágenes).

## Scripts

### `generate_deck.py`

El cerebro creativo. Este script:
1.  Mantiene una "fuente de verdad" en `output/deck.json`.
2.  Genera nuevas cartas si se le pide un límite mayor (`--limit N`).
3.  Genera las imágenes correspondientes en `output/cards/`.

### Uso

```bash
# Generar/Completar la baraja hasta 54 cartas
uv run generate_deck.py --limit 54

# Solo generar el JSON (sin imágenes)
uv run generate_deck.py --limit 54 --deck-only
```

## Prompt Engineering

El script utiliza un prompt sofisticado para garantizar:
- Estilo "Lotería Vintage" (Linocut/Woodblock).
- Full Bleed (Sin bordes).
- Ausencia de texto en las imágenes.
