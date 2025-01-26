import { Component } from './base/component';
import { IEvents } from './base/events';
import { ensureElement } from '../utils/utils';

interface IPage {
	catalog: HTMLElement[];
	locked: boolean;
	amount: HTMLSpanElement;
}

export class Page extends Component<IPage> {
	protected _gallery: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _amount: HTMLSpanElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._gallery = ensureElement<HTMLElement>('.gallery');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>(
			'.header__basket'
		) as HTMLButtonElement;
		this._amount = ensureElement('.header__basket-counter', this._basket);

		this._basket.addEventListener('click', () =>
			this.events.emit('basket:open')
		);
	}

	set catalog(items: HTMLElement[]) {
		this._gallery.replaceChildren(...items);
	}

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}

	set amount(value: number) {
		this.setText(this._amount, value);
	}
}
