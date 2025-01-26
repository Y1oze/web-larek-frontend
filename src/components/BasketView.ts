import { Component } from "./base/component";
import { ensureElement } from '../utils/utils'
import { EventEmitter } from "./base/events";
import { Modal } from './base/Modal';

export interface IBasketView {
  set list(cards: HTMLElement[]);
  set total(value: number);
}

export class BasketView extends Component<IBasketView> {
  protected _list: HTMLUListElement;
  protected _buyButton: HTMLButtonElement;
  protected _total: HTMLSpanElement;

  constructor(container: HTMLElement, protected events: EventEmitter) {
    super(container);

    this._list = ensureElement<HTMLUListElement>('.basket__list', this.container);
    this._buyButton = ensureElement<HTMLButtonElement>('.button', this.container);
    this._total = ensureElement('.basket__price', this.container);

    this._buyButton.addEventListener('click', () => this.events.emit('basket:buy'));
  }
  
  set list(cards: HTMLElement[]) {
    this._list.replaceChildren(...cards);
  }
  
  set total(value: number) {
    this.setText(this._total, value);
  }

  set button(flag: boolean) {
    if(flag) {
      this._buyButton.disabled = true;
    } else {
      this._buyButton.disabled = false;
    }
  }
}