import * as contentful from 'contentful';

export const client = contentful.createClient({
    space: 'vb9isbom9vw0', // Замените на ваш Space ID
    accessToken: 'MFWZ0zT4CZFQgyFHy-7613n1_B3BcdvZoL5rlx9jPGI' // Замените на ваш Delivery API access token
});
