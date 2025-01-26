import { ICard } from '../types';
import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';

abstract class Card extends Component<ICard> {
	protected _title: HTMLHeadingElement;
	protected _price: HTMLSpanElement;
	protected _id: string;

	set title(value: string) {
		this.setText(this._title, value);
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, 'Бесценно');
		} else {
			this.setText(this._price, value + ' синапсов');
		}
	}

	set id(value: string) {
		this._id = value;
	}
}

abstract class CardFull extends Card {
	protected _category: HTMLSpanElement;
	protected _image: HTMLImageElement;
	protected CDN_URL: string;

	set category(value: string) {
		this._category.classList.remove(
			'card__category_soft',
			'card__category_additional',
			'card__category_other',
			'card__category_button',
			'card__category_hard'
		);

		this.setText(this._category, value);
		switch (value) {
			case 'софт-скил':
				this._category.classList.add('card__category_soft');
				break;
			case 'дополнительное':
				this._category.classList.add('card__category_additional');
				break;
			case 'другое':
				this._category.classList.add('card__category_other');
				break;
			case 'кнопка':
				this._category.classList.add('card__category_button');
				break;
			case 'хард-скил':
				this._category.classList.add('card__category_hard');
				break;
			default:
				this._category.classList.add('card__category_soft');
				break;
		}
	}

	set image(value: string) {
		this.setImage(
			this._image,
			this.CDN_URL + value,
			'Изображение товара: ' + this._title.textContent
		);
	}
}

export class CardCompactView extends Card {
	protected deleteButton: HTMLButtonElement;
	protected _index: HTMLSpanElement;

	constructor(container: HTMLButtonElement, protected events: EventEmitter) {
		super(container);

		this._index = ensureElement('.basket__item-index', this.container);
		this.deleteButton = ensureElement<HTMLButtonElement>(
			'.basket__item-delete',
			this.container
		);
		this._title = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this.container
		);
		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);

		this.deleteButton.addEventListener('click', () =>
			this.events.emit('basket:delete', { id: this._id })
		);
	}

	set index(value: number) {
		this.setText(this._index, value);
	}
}

export class CardView extends CardFull {
	constructor(
		container: HTMLButtonElement,
		protected CDN_URL: string,
		protected events: EventEmitter
	) {
		super(container);

		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			this.container
		);
		this._title = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this.container
		);
		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);

		this.container.addEventListener('click', () =>
			this.events.emit('card:open', { id: this._id })
		);
	}
}

export class CardFullView extends CardFull {
	protected _description: HTMLParagraphElement;
	protected addButton: HTMLButtonElement;

	constructor(
		container: HTMLButtonElement,
		protected CDN_URL: string,
		protected events: EventEmitter
	) {
		super(container);
		this.addButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);
		this._image = ensureElement<HTMLImageElement>(
			'.card__image',
			this.container
		);
		this._category = ensureElement<HTMLSpanElement>(
			'.card__category',
			this.container
		);
		this._title = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this.container
		);
		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);
		this._description = ensureElement<HTMLParagraphElement>(
			'.card__text',
			this.container
		);

		this.addButton.addEventListener('click', () =>
			this.events.emit('basket:add', { id: this._id })
		);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	override set price(value: number) {
		if (value === null) {
			this.addButton.disabled = true;
			this.setText(this._price, 'Бесценно');
		} else {
			this.addButton.disabled = false;
			this.setText(this._price, value + ' синапсов');
		}
	}
}
