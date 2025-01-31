import * as yup from 'yup';

export const PROPERTY_TYPES = {
    APARTMENT_RENT: 'apartment-rent',
    APARTMENT_SALE: 'apartment-sale',
    HOUSE_RENT: 'house-rent',
    HOUSE_SALE: 'house-sell',
    HOUSE_EXCHANGE: 'house-exchange'
};

const baseValidationSchema = {
    title: yup.string().required('Назва обов\'язкова'),
    category: yup.object().required('Виберіть тип нерухомості'),
    subcategory: yup.object().required('Виберіть мету використання'),
    address: yup.object().shape({
        region: yup.object().required('Виберіть область'),
        city: yup.mixed().required('Місто обов\'язкове'),
        street: yup.string(),
        area: yup.object().nullable(),
        markerPosition: yup.object().nullable()
    }),
    description: yup.string(),
    images: yup.array().min(1, 'Додайте хоча б одне фото'),
    public: yup.boolean()
};

const roomsValidation = {
    rooms: yup.object().shape({
        all: yup.number().required('Вкажіть кількість кімнат').min(1),
        bedrooms: yup.number().required('Вкажіть кількість спалень').min(1),
        bathrooms: yup.number().required('Вкажіть кількість ванних кімнат').min(1),
        kitchens: yup.number().required('Вкажіть кількість кухонь').min(1)
    })
};

const areaValidation = {
    apartmentArea: yup.object().shape({
        totalArea: yup.number().required('Вкажіть загальну площу').min(1),
        livingArea: yup.number().required('Вкажіть житлову площу').min(1),
        kitchenArea: yup.number().required('Вкажіть площу кухні').min(1)
    })
};

export const getValidationSchema = (propertyType) => {
    const baseSchema = { ...baseValidationSchema };

    switch (propertyType) {
        case PROPERTY_TYPES.APARTMENT_SALE:
        case PROPERTY_TYPES.HOUSE_SALE:
            return {
                ...baseSchema,
                ...roomsValidation,
                ...areaValidation,
                priceUSD: yup.number().required('Вкажіть ціну').min(1)
            };
        case PROPERTY_TYPES.APARTMENT_RENT:
        case PROPERTY_TYPES.HOUSE_RENT:
            return {
                ...baseSchema,
                ...roomsValidation,
                ...areaValidation,
                priceUSD: yup.object().shape({
                    monthly: yup.number().required('Вкажіть ціну оренди').min(1),
                    deposit: yup.number()
                })
            };
        default:
            return baseSchema;
    }
};
