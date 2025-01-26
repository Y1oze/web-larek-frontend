import { Component } from './component';
import { EventEmitter } from './events';
import { ensureElement } from '../../utils/utils';

export interface IModal {
	open(content: HTMLElement): void;
	close(): void;
	set content(container: HTMLElement);
}

export class Modal extends Component<IModal> implements IModal {
	protected currentModal: HTMLElement;
	protected _content: HTMLElement | undefined;
	protected buttonClose: HTMLButtonElement;

	constructor(container: HTMLElement, protected events: EventEmitter) {
		super(container);

		this.currentModal = ensureElement('.modal__container', this.container);
		this._content = ensureElement('.modal__content', this.container);
		this.buttonClose = ensureElement<HTMLButtonElement>(
			'.modal__close',
			this.container
		);

		this.buttonClose.addEventListener('click', () =>
			this.events.emit('modal:close')
		);

		this.container.addEventListener('click', () => {
			this.events.emit('modal:close');
		});

		this.currentModal.addEventListener('click', (event) => {
			event.stopPropagation();
		});
	}

	open(content: HTMLElement): void {
		this.container.classList.add('modal_active');
		this._content.replaceChildren(content);
		this.events.emit('modal:open');
	}

	close(): void {
		this.container.classList.remove('modal_active');
	}

	set content(container: HTMLElement) {
		this._content.replaceChildren(container);
	}
}
