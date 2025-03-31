import { ref } from 'vue';

export function usePropertyFormState() {
    const emptyProperty = {
        title: '',
        price: null,
        rooms: {
            all: null,
            bedrooms: null,
            bathrooms: null,
            kitchens: null
        },
        houseNumber: '',
        constructionYear: null,
        heatingType: null,
        condition: null,
        balconyCount: 0,
        description: '',
        images: [],
        category: {
            code: null,
            name: ''
        },
        subcategory: {
            code: null,
            name: ''
        },
        createdAt: null,
        updatedAt: null,
        apartmentArea: {
            totalArea: null,
            livingArea: null,
            kitchenArea: null
        },
        floors: {
            floor: null,
            totalFloors: null,
            totalFloorsBuilding: null
        },
        reconditioning: null,
        buildingType: null,
        furniture: null,
        parking: null,
        balconyTerrace: null,
        objectClass: null,
        animal: false,
        facilityReadiness: null,
        isPublic: false,
        address: {
            region: null,
            city: '',
            street: '',
            markerPosition: null
        },
        creator: {
            message: ''
        }
    };

    const property = ref(structuredClone(emptyProperty));
    const formValidations = ref({
        basicInfo: false,
        area: false,
        floors: false,
        rooms: false,
        condition: false
    });

    const initializeNewProperty = (categoryCode, propertyManager) => {
        property.value = {
            ...emptyProperty,
            category: { code: categoryCode },
            subcategory: { code: 'sell', name: 'Продаж' }
        };
        propertyManager.setPropertyType(`${categoryCode}-sell`);
        property.value = propertyManager.property;
    };

    return {
        property,
        formValidations,
        initializeNewProperty,
        emptyProperty
    };
}
