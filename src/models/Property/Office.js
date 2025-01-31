import Property from "./Property";

export default class Office extends Property {
    constructor(props = {}) {
        super(props);
        this.officeArea = props.officeArea || null;
        this.floor = props.floor || null;
        this.parking = props.parking || false;
        this.security = props.security || false;
    }
}
