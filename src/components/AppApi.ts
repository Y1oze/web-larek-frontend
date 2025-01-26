import { ICard } from '../types';
import { ContactData } from './ContactData';
import { Api } from './base/api';

interface IAppApi {
	getList(): Promise<ICard[] | object>;
}

type ApiListResponse<T> = {
	total: number;
	items: T[];
};

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;
	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	getList(): Promise<ApiListResponse<ICard> | object> {
		return this.get(`/product`);
	}

	getCard(value: string): Promise<ICard | object> {
		return this.get(`/product/${value}`);
	}

	sendOrder(obj: ContactData) {
		return this.post(`/order`, obj, 'POST');
	}
}
