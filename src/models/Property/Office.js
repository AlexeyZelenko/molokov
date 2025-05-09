import Property from "./Property";
import House from "@/models/Property/House";

export default class Office extends Property {
    constructor(props = {}) {
        super(props);
        this.officeArea = props.officeArea || null;
        this.floor = props.floor || null;
        this.parking = props.parking || false;
        this.security = props.security || false;
        this.category = { name: 'Приміщення', code: 'offices' };
    }
}

export class OfficeSell extends Office {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Продаж', code: 'sell' }; // Визначаємо підкатегорію
        this.houseArea1 = props.houseArea1 || null; // Унікальна властивість для HouseSell
    }
}

export class OfficeRent extends Office {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Довгострокова оренда', code: 'rent' }; // Визначаємо підкатегорію
        this.houseArea2 = props.houseArea2 || null; // Унікальна властивість для HouseRent
    }
}

export class OfficeExchange extends Office {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Обмін', code: 'exchange' }; // Визначаємо підкатегорію
        this.houseArea3 = props.houseArea3 || null; // Унікальна властивість для HouseExchange
    }
}

export class OfficeRentDaily extends Office {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Короткострокова оренда', code: 'daily' }; // Визначаємо підкатегорію
        this.houseArea4 = props.houseArea4 || null; // Унікальна властивість для HouseRentDaily
    }
}
