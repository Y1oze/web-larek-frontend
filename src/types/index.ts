import { IEvents } from '../components/base/events';
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price: number;
}
export type mainCard = Pick<ICard, 'category' | 'title' | 'image' | 'price'>;
export type modalCard = Pick<
	ICard,
	'category' | 'title' | 'image' | 'price' | 'description'
>;
export type basketCard = Pick<ICard, 'title' | 'price' | 'id'>;
export interface IBasketData {
	cards: basketCard[];
	goods: number;
	total: number;
	setTotal(): number;
	getTotal(): number;
	getGoods(): number;
	addItem(card: ICard): void;
	deleteItem(id: string): void;
}
export interface ICardsData {
	cards: ICard[];
	setCards(cards: ICard[]): void;
	getCards(): ICard[];
	getCard(id: string): ICard;
}
export interface ICardView {
	_image: HTMLImageElement;
	_category: HTMLSpanElement;
	_title: HTMLHeadingElement;
	_price: HTMLSpanElement;
}
export interface ICardCompactView {
	_title: HTMLSpanElement;
	_price: HTMLSpanElement;
	deleteButton: HTMLButtonElement;
	_id: string;
	deleteBasket(basket: IBasketData, id: string): void;
}
export interface IModal {
	currentModal: HTMLElement;
	content: HTMLElement;
	events: IEvents;
	buttonClose: HTMLButtonElement;
	open(content: HTMLElement, events: IEvents): void;
	close(): void;
}
export type ICardFullView = ICardView & {
	addButton: HTMLButtonElement;
	_description: HTMLParagraphElement;
	addBasket(basket: IBasketData, card: ICard): void;
};
export interface IBasketView {
	cardsContainer: HTMLUListElement;
	buyButton: HTMLButtonElement;
	_total: HTMLSpanElement;
}
export interface IModalForm {
	inputList: HTMLInputElement[];
	checkValidation(): boolean;
	setValid(isValid: boolean): void;
}
export interface IModalSuccess {
	_total: HTMLParagraphElement;
	button: HTMLButtonElement;
}
