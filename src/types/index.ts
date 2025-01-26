export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}

export type mainCard = Pick<
	ICard,
	'category' | 'title' | 'image' | 'price' | 'id'
>;

export type modalCard = Pick<
	ICard,
	'category' | 'title' | 'image' | 'price' | 'description' | 'id'
>;

export type basketCard = Pick<ICard, 'title' | 'price' | 'id'>;

export interface IBasketData {
	setTotal(): void;
	getTotal(): number;
	getGoods(): number;
	addItem(card: ICard): void;
	deleteItem(id: string): void;
	clearBasket(): void;
}

export interface ICardsData {
	setCards(cards: ICard[]): void;
	getCards(): ICard[];
	getCard(id: string): ICard;
}

export interface IModalForm {
	inputList: HTMLInputElement[];
	checkValidation(): boolean;
	setValid(isValid: boolean): void;
}

export interface IModalSuccess {
	_total: HTMLParagraphElement;
	button: HTMLButtonElement;
	total: number;
}
