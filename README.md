# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и типы данных, используемые в приложении

### Карточка
```typescript
interface ICard {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number;  
  stock: number; // Количество товара на складе
}
```

### Данные карточки при начальной загрузке страницы
```typescript
type mainCard = Pick<ICard, 'category' | 'title' | 'image' | 'price'>;
```

### Данные карточки при открытии модального окна
```typescript
type modalCard = Pick<ICard, 'category' | 'title' | 'image' | 'price' | 'description'>;
```

### Данные карточки в корзине
```typescript
type basketCard = Pick<ICard, 'title' | 'price' | 'id' | 'stock'>;
```

### Интерфейс корзины с товарами
```typescript
interface IBasketData {
  cards: basketCard[];
  total: number;
  getTotal(): number;
  addItem(card: ICard): void;
  deleteItem(id: string): void;
  clearBasket(): void; // Новый метод для очистки корзины
}
```

### Интерфейс для работы с данными карточек
```typescript
interface ICardsData {
  cards: ICard[];
  setCards(cards: ICard[]): void;
  getCards(): ICard[];
  getCard(id: string): ICard;
}
```

### Интерфейс заказа
```typescript
interface IOrder {
  id: string;
  items: basketCard[];
  total: number;
  paymentMethod: string;
  deliveryAddress: string;
  email: string;
  phone: string;
  validate(): boolean; // Проверка данных заказа
}
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:
- **Слой представления** — отвечает за отображение данных на странице.
- **Слой данных** — отвечает за хранение и изменение данных.
- **Презентер** — отвечает за связь представления и данных.

### Базовый код

#### Класс `Api`
Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.

Методы:
- `get` — выполняет GET-запрос на переданный в параметрах эндпоинт и возвращает промис с объектом, которым ответил сервер.
- `post` — принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на эндпоинт, переданный как параметр при вызове метода. По умолчанию выполняется POST-запрос, но метод запроса может быть переопределен.

#### Класс `EventEmitter`
Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.

Методы, реализуемые классом:
- `on` — подписка на событие.
- `off` — снять обработчик с события.
- `emit` — инициализация события.

### Слой данных

#### Класс `BasketData`
Класс отвечает за логику и работу данных в корзине. Конструктор класса принимает инстанс брокера событий.

Поля класса:
- `cards: basketCard[]` — товары, которые добавил пользователь.
- `total: number` — стоимость всех товаров в корзине.

Методы класса:
- `getTotal(): number` — возвращает итоговую стоимость товаров.
- `addItem(card: ICard): void` — добавляет товар в корзину и уведомляет об изменении.
- `deleteItem(id: string): void` — удаляет товар из корзины и уведомляет об изменении.
- `clearBasket(): void` — очищает корзину.

#### Класс `OrderData`
Модель для работы с данными заказа. Хранит и валидирует данные заказа.

Поля класса:
- `items: basketCard[]` — товары в заказе.
- `total: number` — итоговая стоимость заказа.
- `paymentMethod: string` — метод оплаты.
- `deliveryAddress: string` — адрес доставки.
- `email: string` — email клиента.
- `phone: string` — номер телефона клиента.

Методы класса:
- `validate(): boolean` — проверяет корректность всех данных заказа.

### Классы представления

#### Класс `HeaderView`
Представление для заголовка с кнопкой корзины и счётчиком товаров.

Свойства:
- `basketButton: HTMLButtonElement` — кнопка открытия корзины.
- `itemCount: HTMLSpanElement` — количество товаров в корзине.

Методы:
- `updateItemCount(count: number): void` — обновляет счётчик товаров.

#### Класс `BasketView`
Представляет содержимое корзины.

Свойства:
- `list: HTMLUListElement` — список товаров.
- `totalElement: HTMLSpanElement` — элемент для отображения итоговой стоимости.
- `checkoutButton: HTMLButtonElement` — кнопка оформления заказа.

Методы:
- `render(items: basketCard[]): void` — отрисовывает список товаров.
- `updateTotal(total: number): void` — обновляет отображаемую стоимость.

#### Класс `Modal`
Модальное окно, которое принимает любой контент.

Свойства:
- `container: HTMLElement` — корневой элемент модального окна.
- `content: HTMLElement` — контент окна.

Методы:
- `open(content: HTMLElement): void` — открывает окно с переданным контентом.
- `close(): void` — закрывает окно.

#### Класс `ModalContent`
Базовый класс для контента модальных окон (карточка, форма, успех).

### Слой коммуникации

#### Класс `AppApi`
Клиент API для взаимодействия с сервером. Методы:
- `fetchCards(): Promise<ICard[]>` — загружает карточки с сервера.
- `sendOrder(order: IOrder): Promise<void>` — отправляет заказ на сервер.

