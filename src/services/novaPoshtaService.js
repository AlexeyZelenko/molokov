import axios from 'axios';

const API_KEY = '4c67e63d2df6b72cf0bbbafef4771787'; // Замініть на свій API ключ

const novaPoshtaApi = axios.create({
    baseURL: 'https://api.novaposhta.ua/v2.0/json/'
});

export const getAreas = async () => {
    const payload = {
        apiKey: API_KEY,
        modelName: 'AddressGeneral',
        calledMethod: 'getAreas',
        methodProperties: {}
    };

    try {
        const response = await novaPoshtaApi.post('', payload);
        console.log('Полученные области:', response.data.data);
        return response.data.data;
    } catch (error) {
        console.error('Помилка при отриманні областей:', error);
        throw error;
    }
};

export const getSettlements = async (params) => {
    const payload = {
        apiKey: API_KEY,
        modelName: 'AddressGeneral',
        calledMethod: 'getSettlements',
        methodProperties: {
            ...params,
            Warehouse: params.Warehouse || '1'
        }
    };

    try {
        const response = await novaPoshtaApi.post('', payload);
        return response.data.data;
    } catch (error) {
        console.error('Помилка при отриманні населених пунктів:', error);
        throw error;
    }
};
