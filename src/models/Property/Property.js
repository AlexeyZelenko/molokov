import { serverTimestamp } from "firebase/firestore";

export default class Property {
    constructor({
                    // Base fields
                    title = "",
                    price = null,
                    description = "",
                    createdAt = null,
                    updatedAt = null,

                    // Media
                    images = [],

                    // Location and Contact
                    address = {
                        region: "",
                        area: { code: null, name: null },
                        street: "",
                        city: "",
                        markerPosition: null
                    },
                    owner = {
                        username: "",
                        phone: "",
                        message: ""
                    },
                    creator = {
                        message: "",
                        phone: "",
                    },

                    // Room Information
                    rooms = {
                        all: null,
                        bedrooms: null,
                        bathrooms: null,
                        kitchens: null
                    },

                    // Area Information
                    apartmentArea = {
                        totalArea: null,
                        livingArea: null,
                        kitchenArea: null
                    },

                    // Building Information
                    floors = {
                        floor: null,
                        totalFloors: null,
                        totalFloorsBuilding: null
                    },

                    // Features and Amenities
                    heatingType = null,
                    condition = null,
                    balconyCount = 0,
                    reconditioning = null,
                    buildingType = null,
                    utilities = [],
                    furniture = null,
                    parking = null,
                    balconyTerrace = null,
                    objectClass = null,
                    animal = false,
                    facilityReadiness = null,
                    planning = null,
                    bathroom = null,
                    communications = null,
                    infrastructure = null,
                    typeOwner = null,
                    landscape = null,
                    isPublic = true
                }) {
        // Base Properties
        this.title = title;
        this.price = price;
        this.description = description;
        this.isPublic = isPublic;
        this.createdAt = createdAt || serverTimestamp();
        this.updatedAt = updatedAt || serverTimestamp();

        // Media
        this.images = images;

        // Location and Contact
        this.address = address;
        this.owner = owner;
        this.creator = creator;

        // Room Information
        this.rooms = rooms;

        // Area Information
        this.apartmentArea = apartmentArea;

        // Building Information
        this.floors = floors;

        // Features and Amenities
        this.heatingType = heatingType;
        this.condition = condition;
        this.balconyCount = balconyCount;
        this.reconditioning = reconditioning;
        this.buildingType = buildingType;
        this.utilities = utilities;
        this.furniture = furniture;
        this.parking = parking;
        this.balconyTerrace = balconyTerrace;
        this.objectClass = objectClass;
        this.animal = animal;
        this.facilityReadiness = facilityReadiness;
        this.planning = planning;
        this.bathroom = bathroom;
        this.communications = communications;
        this.infrastructure = infrastructure;
        this.typeOwner = typeOwner;
        this.landscape = landscape;
    }

    // Media Management
    addImage(url) {
        this.images.push(url);
    }

    removeImage(url) {
        this.images = this.images.filter(image => image !== url);
    }

    // Address Management
    updateAddress(newAddress) {
        this.address = { ...this.address, ...newAddress };
    }

    updateMarkerPosition(position) {
        this.address.markerPosition = position;
    }

    // Area Management
    updateApartmentArea(newArea) {
        this.apartmentArea = { ...this.apartmentArea, ...newArea };
    }

    // Room Management
    updateRooms(newRooms) {
        this.rooms = { ...this.rooms, ...newRooms };
    }

    // Utility Management
    addUtility(utility) {
        this.utilities.push(utility);
    }

    removeUtility(utilityId) {
        this.utilities = this.utilities.filter(u => u.id !== utilityId);
    }

    // Timestamp Management
    updateTimestamp() {
        this.updatedAt = serverTimestamp();
    }

    // Data Export
    toFirestore() {
        return {
            ...this,
            updatedAt: serverTimestamp()
        };
    }

    // Validation Methods
    isValid() {
        return (
            this.title &&
            this.category &&
            this.address.city &&
            this.price !== null
        );
    }

    // Helper Methods
    getFormattedDescription() {
        return this.description
            .replace(/\n/g, '<br>')
            .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
    }

    clone() {
        return new Property(this);
    }
}
