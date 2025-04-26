import axios from 'axios';

const olxApiRegions = 'https://getolxregions-ngadaglvca-uc.a.run.app';
const olxApiCities = 'https://getolxcities-ngadaglvca-uc.a.run.app';
const olxApiCityDetails = 'https://getolxcitydetails-ngadaglvca-uc.a.run.app';
const olxTokenUrl = 'https://getolxtoken-ngadaglvca-uc.a.run.app';
let isLoading = false;

async function getOlxToken() {
    try {
        const tokenResponse = await axios.get(olxTokenUrl);
        return tokenResponse.data.access_token;
    } catch (error) {
        console.error('Error fetching OLX token:', error);
        throw new Error('Failed to fetch OLX token');
    }
}

export async function fetchOlxRegions() {
    isLoading = true;
    try {
        const accessToken = await getOlxToken();
        const regionsResponse = await axios.get(olxApiRegions, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return regionsResponse.data.data;
    } catch (error) {
        console.error('Error fetching OLX regions:', error);
        throw new Error('Failed to fetch OLX regions');
    } finally {
        isLoading = false;
    }
}

export async function fetchOlxCities(offset) {
    isLoading = true;
    try {
        const accessToken = await getOlxToken();
        const citiesResponse = await axios.get(`${olxApiCities}?offset=${offset}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return citiesResponse.data.data;
    } catch (error) {
        console.error('Error fetching OLX cities:', error);
        throw new Error('Failed to fetch OLX cities');
    } finally {
        isLoading = false;
    }
}

export async function fetchOlxCityDetails(cityId) {
    isLoading = true;
    try {
        const accessToken = await getOlxToken();
        const cityDetailsResponse = await axios.get(`${olxApiCityDetails}?cityId=${cityId}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return cityDetailsResponse.data.data;
    } catch (error) {
        console.error('Error fetching OLX city details:', error);
        throw new Error('Failed to fetch OLX city details');
    } finally {
        isLoading = false;
    }
}
