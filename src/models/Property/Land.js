import Property from "./Property";

export default class Land extends Property {
    constructor(props = {}) {
        super(props);
        this.landSize = props.landSize || null;
        this.soilType = props.soilType || null;
        this.category = "land";
        this.category = { name: 'Земельна ділянка', code: 'land' };
    }
}

export class LandSell extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Продаж', code: 'sell' }; // Визначаємо підкатегорію
    }
}

export class LandRent extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Довгострокова оренда', code: 'rent' }; // Визначаємо підкатегорію
    }
}

export class LandExchange extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Обмін', code: 'exchange' }; // Визначаємо підкатегорію
    }
}

export class LandRentDaily extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Короткострокова оренда', code: 'daily' }; // Визначаємо підкатегорію
    }
}
