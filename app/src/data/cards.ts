import deckData from './deck.json';

export interface Card {
    id: number;
    title: string;
    image: string;
    category: string;
}

export const CARDS: Card[] = deckData.map((card: any) => ({
    id: card.id,
    title: card.nombre,
    // Images are stored in public/deck/{id}.png
    image: `/deck/${card.id}.png`,
    category: card.categoria
}));
