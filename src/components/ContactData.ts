interface IContactData {
	_payment: string;
	_email: string;
	_phone: string;
	_address: string;
	_total: number;
	_items: string[];
}

export class ContactData implements IContactData {
	protected payment: string;
	protected email: string;
	protected phone: string;
	protected address: string;
	protected total: number;
	protected items: string[];

	set _payment(value: string) {
		this.payment = value;
	}

	set _email(value: string) {
		this.email = value;
	}

	set _phone(value: string) {
		this.phone = value;
	}

	set _address(value: string) {
		this.address = value;
	}

	set _total(value: number) {
		this.total = value;
	}

	set _items(value: string[]) {
		this.items = value;
	}
}
