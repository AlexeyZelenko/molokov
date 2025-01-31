import Property from "./Property";

// Базовий клас House
export default class Commercial extends Property {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.landArea = props.landArea || null;
        this.garage = props.garage || false;
        this.pool = props.pool || false;
        this.garden = props.garden || false;
        this.category = { name: 'Будівлі', code: 'commercial' }; // Визначаємо категорію один раз
    }
}

// Клас для продажу будинків
export class CommercialSell extends Commercial {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Продаж', code: 'sell' }; // Визначаємо підкатегорію
        this.houseArea1 = props.houseArea1 || null; // Унікальна властивість для HouseSell
    }
}

// Клас для оренди будинків
export class CommercialRent extends Commercial {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Довгострокова оренда', code: 'rent' }; // Визначаємо підкатегорію
        this.houseArea2 = props.houseArea2 || null; // Унікальна властивість для HouseRent
    }
}

// Клас для обміну будинків
export class CommercialExchange extends Commercial {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Обмін', code: 'exchange' }; // Визначаємо підкатегорію
        this.houseArea3 = props.houseArea3 || null; // Унікальна властивість для HouseExchange
    }
}

// Клас для оренди будинків подобово
export class CommercialRentDaily extends Commercial {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Короткострокова оренда', code: 'daily' }; // Визначаємо підкатегорію
        this.houseArea4 = props.houseArea4 || null; // Унікальна властивість для HouseRentDaily
    }
}
