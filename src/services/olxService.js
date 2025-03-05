import axios from "axios";

const olxApiRegions = "https://getolxregions-ngadaglvca-uc.a.run.app";
const olxTokenUrl = "https://getolxtoken-ngadaglvca-uc.a.run.app";

let isLoading = false;
export async function fetchOlxRegions() {
    isLoading = true; // Set loading state to true
    try {
        console.log("Fetching OLX access token...");
        const tokenResponse = await axios.get(olxTokenUrl);
        console.log("OLX token response:", tokenResponse.data);
        const accessToken = tokenResponse.data.access_token;

        console.log("Fetching OLX regions...");
        const adsResponse = await axios.get(olxApiRegions, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });

        console.log("OLX regions response:", adsResponse.data);
        return adsResponse.data.data; // Assuming data is in adsResponse.data.data
    } catch (error) {
        console.error("Error fetching OLX regions:", error);
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
            if (error.response.status === 401) {
                // Handle unauthorized error (e.g., token expired)
                this.error = "Сессия истекла. Пожалуйста, авторизуйтесь снова.";
            } else {
                this.error = "Ошибка при получении объявлений.";
            }
        } else {
            this.error = "Ошибка сети.";
        }
    } finally {
        isLoading = false; // Set loading state to false
    }
}
