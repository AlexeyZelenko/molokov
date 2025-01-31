import Property from "./Property";

export default class Land extends Property {
    constructor(props = {}) {
        super(props);
        this.landSize = props.landSize || null;
        this.soilType = props.soilType || null;
        this.purpose = props.purpose || null;
        this.category = "land";
        this.subcategory = props.subcategory || "sale"; // продажа, аренда, обмен, посуточно
    }
}
