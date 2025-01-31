import Property from "./Property";

export default class Land extends Property {
    constructor(props = {}) {
        super(props);
        this.landSize = props.landSize || null;
        this.soilType = props.soilType || null;
        this.purpose = props.purpose || null;
        this.category = "land";
        this.category = { name: 'Земельна ділянка', code: 'land' };
    }
}

export class LandSell extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Продаж', code: 'sell' }; // Визначаємо підкатегорію
        this.houseArea1 = props.houseArea1 || null; // Унікальна властивість для HouseSell
    }
}

export class LandRent extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Довгострокова оренда', code: 'rent' }; // Визначаємо підкатегорію
        this.houseArea2 = props.houseArea2 || null; // Унікальна властивість для HouseRent
    }
}

export class LandExchange extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Обмін', code: 'exchange' }; // Визначаємо підкатегорію
        this.houseArea3 = props.houseArea3 || null; // Унікальна властивість для HouseExchange
    }
}

export class LandRentDaily extends Land {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Короткострокова оренда', code: 'daily' }; // Визначаємо підкатегорію
        this.houseArea4 = props.houseArea4 || null; // Унікальна властивість для HouseRentDaily
    }
}
