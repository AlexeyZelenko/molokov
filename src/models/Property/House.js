import Property from "./Property";

// Базовий клас House
export default class House extends Property {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.landArea = props.landArea || null;
        this.garage = props.garage || false;
        this.pool = props.pool || false;
        this.garden = props.garden || false;
        this.category = "houses"; // Визначаємо категорію один раз
    }
}

// Клас для продажу будинків
export class HouseSell extends House {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = 'sell'; // Визначаємо підкатегорію
        this.houseArea1 = props.houseArea1 || null; // Унікальна властивість для HouseSell
    }
}

// Клас для оренди будинків
export class HouseRent extends House {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = 'rent'; // Визначаємо підкатегорію
        this.houseArea2 = props.houseArea2 || null; // Унікальна властивість для HouseRent
    }
}

// Клас для обміну будинків
export class HouseExchange extends House {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = 'exchange'; // Визначаємо підкатегорію
        this.houseArea3 = props.houseArea3 || null; // Унікальна властивість для HouseExchange
    }
}

// Клас для оренди будинків подобово
export class HouseRentDaily extends House {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = 'daily'; // Визначаємо підкатегорію
        this.houseArea4 = props.houseArea4 || null; // Унікальна властивість для HouseRentDaily
    }
}
