import { ICard, ICardsData, IBasketData, basketCard } from '../types';
import { EventEmitter } from './base/events';

export class CardsData implements ICardsData {
	protected cards: ICard[];
	constructor(protected events: EventEmitter) {}

	setCards(cards: ICard[]): void {
		this.cards = cards;
		this.events.emit('cards:changed');
	}

	getCards(): ICard[] {
		return this.cards;
	}

	getCard(id: string): ICard {
		return this.cards.find((elem) => elem.id === id) as ICard;
	}
}

export class BasketData implements IBasketData {
	protected cards: basketCard[] = [];
	protected ids: string[] = [];
	protected goods: number;
	protected total: number;

	constructor(protected events: EventEmitter) {}

	setTotal(): void {
		this.total = this.cards.reduce(
			(accumulator, currentValue) => accumulator + currentValue.price,
			0
		);
	}

	getCards(): basketCard[] {
		return this.cards;
	}

	getTotal(): number {
		return this.total | 0;
	}

	getGoods(): number {
		return this.cards.length;
	}

	getCardsId() {
		this.cards.forEach((card) => {
			this.ids.push(card.id);
		});

		return this.ids;
	}

	addItem(card: ICard): void {
		this.cards.push(card);
		this.setTotal();
		this.events.emit('basket:changed');
	}

	deleteItem(id: string): void {
		this.cards = this.cards.filter((card) => card.id !== id);
		this.setTotal();
		this.events.emit('basket:changed');
	}

	clearBasket(): void {
		this.cards = [];
		this.cards.length = 0;
		this.events.emit('basket:changed');
	}
}
