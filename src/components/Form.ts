import { Component } from './base/component';
import { ensureElement, ensureAllElements } from '../utils/utils';
import { EventEmitter } from './base/events';
import { IModalForm } from '../types/index';

export class Form extends Component<IModalForm> {
	protected inputList: HTMLInputElement[];
	protected _error: HTMLSpanElement;
	protected _submit: HTMLButtonElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'.submit_button',
			this.container
		);
		this.inputList = ensureAllElements('.form__input', this.container);
		this._error = ensureElement<HTMLSpanElement>(
			'.form__errors',
			this.container
		);
		this.setupInputListeners();

		this._submit.addEventListener('click', (evt: MouseEvent) => {
			evt.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});
	}

	protected setupInputListeners() {
		this.inputList.forEach((input) => {
			input.addEventListener('input', () => {
				this.events.emit(`${input.name}:input`, {
					field: input.name,
					[input.name]: input.value,
				});
			});
		});
	}

	checkValidity() {
		return this.inputList.every((input) => input.validity.valid);
	}

	set error(flag: boolean) {
		if (!flag) {
			this._submit.disabled = true;
			this.setText(this._error, 'Заполните поле');
		} else {
			this._submit.disabled = false;
			this.setText(this._error, '');
		}
	}
}

export class OrderForm extends Form {
	protected payOnlineButton: HTMLButtonElement;
	protected payOnReceiptButton: HTMLButtonElement;

	constructor(
		protected container: HTMLFormElement,
		protected events: EventEmitter
	) {
		super(container, events);

		this.payOnlineButton = ensureElement<HTMLButtonElement>(
			'.button_online',
			this.container
		);
		this.payOnReceiptButton = ensureElement<HTMLButtonElement>(
			'.button_cash',
			this.container
		);

		this.payOnReceiptButton.addEventListener('click', () => {
			this.events.emit('pay:way', { payment: 'cash' });
		});

		this.payOnlineButton.addEventListener('click', () => {
			this.events.emit('pay:way', { payment: 'online' });
		});
	}

	protected hasPayment(): boolean {
		return (
			this.payOnlineButton.classList.contains('button_alt') &&
			this.payOnReceiptButton.classList.contains('button_alt')
		);
	}

	override checkValidity(): boolean {
		return super.checkValidity() && !this.hasPayment();
	}

	toggleButton(way: string) {
		if (way === 'cash') {
			this.payOnReceiptButton.classList.remove('button_alt');
			if (!this.payOnlineButton.classList.contains('button_alt')) {
				this.payOnlineButton.classList.add('button_alt');
			}
		} else if (way === 'online') {
			this.payOnlineButton.classList.remove('button_alt');
			if (!this.payOnReceiptButton.classList.contains('button_alt')) {
				this.payOnReceiptButton.classList.add('button_alt');
			}
		}
	}
}
