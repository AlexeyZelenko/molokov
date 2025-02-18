import Property from "./Property";

export default class Garage extends Property {
    constructor(props = {}) {
        super(props);
        this.rooms = props.rooms || { all: null, bedrooms: null, bathrooms: null, kitchens: null };
        this.heatingType = props.heatingType || null;
        this.condition = props.condition || null;
        this.balconyCount = props.balconyCount || 0;
        this.apartmentArea = props.apartmentArea || { totalArea: null, livingArea: null, kitchenArea: null };
        this.floors = props.floors || { floor: null, totalFloors: null, totalFloorsBuilding: null };
        this.buildingType = props.buildingType || null;
        this.furniture = props.furniture || null;
        this.parking = props.parking || null;
        this.facilityReadiness = props.facilityReadiness || null;
        this.planning = props.planning || null;
        this.infrastructure = props.infrastructure || null;
    }
    category = { name: 'Гараж', code: 'garages' };
}

export class GarageSell extends Garage {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Продаж', code: 'sell' }; // Визначаємо підкатегорію
        this.houseArea1 = props.houseArea1 || null; // Унікальна властивість для ApartmentSell
    }
}

export class GarageRent extends Garage {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Довгострокова оренда', code: 'rent' }; // Визначаємо підкатегорію
        this.houseArea2 = props.houseArea2 || null; // Унікальна властивість для ApartmentRent
    }
}

export class GarageExchange extends Garage {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Обмін', code: 'exchange' }; // Визначаємо підкатегорію
        this.houseArea3 = props.houseArea3 || null; // Унікальна властивість для ApartmentExchange
    }
}

export class GarageRentDaily extends Garage {
    constructor(props = {}) {
        super(props); // Виклик конструктора батьківського класу
        this.subcategory = { name: 'Короткострокова оренда', code: 'daily' }; // Визначаємо підкатегорію
        this.houseArea4 = props.houseArea4 || null; // Унікальна властивість для ApartmentRentDaily
    }
}
