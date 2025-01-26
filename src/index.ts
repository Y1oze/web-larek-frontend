import './scss/styles.scss';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/base/Modal';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CardView, CardFullView, CardCompactView,
} from './components/CardsView';
import { BasketView } from './components/BasketView';
import { OrderForm, Form } from './components/Form';
import { SuccessView } from './components/SuccessView';
import { Page } from './components/Page';
import { AppApi } from './components/AppApi';
import { ContactData } from './components/ContactData';
import { ICard } from './types';
import { BasketData, CardsData } from './components/Models';

const events = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

//поиск темплейтов
const succesTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const cardFull = new CardFullView(
	cloneTemplate(cardPreviewTemplate),
	CDN_URL,
	events
);
const basketView = new BasketView(cloneTemplate(basketTemplate), events);
const address = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new Form(cloneTemplate(contactsTemplate), events);
const success = new SuccessView(cloneTemplate(succesTemplate), events);

const cardsInfo = new CardsData(events);
const userInfo = new ContactData();
const basketData = new BasketData(events);

api
	.getList()
	.then((data) => {
		if ('items' in data) {
			cardsInfo.setCards(data.items);
		}
	})
	.catch((err) => {
		console.error('Unexpected data format', err);
	});

events.on('modal:open', () => {
	page.locked = true;
});

events.on('modal:close', () => {
	page.locked = false;
	modal.close();
});

events.on('cards:changed', () => {
	const cardsViews: HTMLElement[] = [];
	cardsInfo.getCards().forEach((cardInfo: ICard) => {
		const card = cloneTemplate<HTMLButtonElement>(cardCatalogTemplate);
		const cardView = new CardView(card, CDN_URL, events);
		cardsViews.push(cardView.render(cardInfo));
	});

	page.catalog = cardsViews;
});

events.on('basket:open', () => {
	basketView.button = basketData.getGoods() === 0;
	modal.open(basketView.render());
});

events.on('card:open', (cardId: { id: string }) => {
	api.getCard(cardId.id).then((data) => {
		modal.open(cardFull.render(data));
	});
});

events.on('basket:add', (cardId: { id: string }) => {
	api
		.getCard(cardId.id)
		.then((data) => {
			basketData.addItem(data as ICard);
		})
		.then(() => {
			events.emit('modal:close');
		})
		.catch((err) => {
			console.error('Error: ', err);
		});
});

events.on('basket:delete', (cardId: { id: string }) => {
	basketData.deleteItem(cardId.id);
});

events.on('basket:changed', () => {
	// console.log(basketData.getCards());
	page.amount = basketData.getGoods();
	basketView.button = basketData.getGoods() === 0;
	const list: HTMLElement[] = [];
	let index = 1;
	basketData.getCards().forEach((card) => {
		const compact = new CardCompactView(
			cloneTemplate(cardBasketTemplate),
			events
		);
		compact.index = index++;
		list.push(compact.render(card));
	});

	basketView.render({
		total: basketData.getTotal(),
		list: list,
	});
});

events.on('basket:buy', () => {
	userInfo._total = basketData.getTotal();
	userInfo._items = basketData.getCardsId();
	modal.content = address.render();
});

events.on('pay:way', (obj: { payment: string }) => {
	address.toggleButton(obj.payment);
	address.error = address.checkValidity();
	userInfo._payment = obj.payment;
});

events.on(
	/^.*:input/,
	(data: {
		field: string;
		address?: string;
		value?: string;
		email?: string;
		phone?: string;
	}) => {
		// console.log('Input event triggered:', data.field);
		if (data.field === 'address') {
			userInfo._address = data.address;
			address.error = address.checkValidity();
		} else if (data.field === 'email') {
			userInfo._email = data.email;
			contacts.error = contacts.checkValidity();
		} else if (data.field === 'phone') {
			userInfo._phone = data.phone;
			contacts.error = contacts.checkValidity();
		}
	}
);

events.on('order:submit', () => {
	modal.content = contacts.render();
});

events.on('contacts:submit', () => {
	modal.content = success.render({
		total: basketData.getTotal(),
	});
	api
		.sendOrder(userInfo)
		.then((data) => {
			console.log('Succesfull sending', data);
		})
		.catch((err) => console.log(err));
});

events.on('success:close', () => {
	basketData.clearBasket();
	events.emit('modal:close');
});
