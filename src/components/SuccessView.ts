import { Component } from './base/component';
import { ensureElement } from '../utils/utils';
import { EventEmitter } from './base/events';
import { IModalSuccess } from '../types/index';

export class SuccessView extends Component<IModalSuccess> {
	_total: HTMLParagraphElement;
	button: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this._total = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this.button = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);

		this.button.addEventListener('click', () =>
			this.events.emit('success:close')
		);
	}

	set total(value: number) {
		this.setText(this._total, `Списано ${value} синапсов`);
	}
}
