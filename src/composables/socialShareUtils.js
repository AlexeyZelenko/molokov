export const formatUrl = (url) => {
    try {
        const urlObj = new URL(url);
        return `${urlObj.hostname}${urlObj.pathname.slice(0, 15)}${urlObj.pathname.length > 15 ? '...' : ''}`;
    } catch {
        return url.slice(0, 30) + (url.length > 30 ? '...' : '');
    }
};

export const buildShareDescription = (property) => {
    return [
        `🏠 Кімнат: ${property.rooms?.all || 'Не вказано'} 💰 Ціна: ${property.price} USD`,
        `📏 Площа: ${property.apartmentArea?.totalArea} м²  🔝 Поверх: ${property.floors.floor}/${property.floors.totalFloors}`,
        `🏙️ Адреса: ${property.address.region.name} / ${property.address.city.name || ''} / ${property.address.area.name || ''}`,
    ].filter(Boolean).join('\n');
};

export const buildTelegramShareDescription = (property) => {
    return [
        `${property.category.name}/${property.subcategory.name}`,
        `- - - - - - - - - - - - - `,
        `🏠  Кімнат:  ${property.rooms?.all || 'Не вказано'}`,
        `💰  Ціна:    ${property.price} USD`,
        `📏  Площа:   ${property.apartmentArea?.totalArea} м²`,
        `🔝  Поверх:  ${property.floors.floor}/${property.floors.totalFloors}`,
        `🏙️  Адреса:  ${property.address.region.name} / ${property.address.city.name || ''} / ${property.address.area.name || ''}`,
    ].filter(Boolean).join('\n');
};

export const getImageUrl = (property, imageUrl) => {
    if (imageUrl) {
        return imageUrl;
    } else if (property.images && property.images.length > 0) {
        return property.images[0];
    }
    return '';
};

export const getFullImageUrl = (imageUrl) => {
    if (typeof imageUrl === 'string' && imageUrl && !imageUrl.startsWith('http')) {
        try {
            const baseUrl = window.location.origin;
            return new URL(imageUrl, baseUrl).href;
        } catch (error) {
            console.error('Error constructing full URL:', error);
            return imageUrl || ''; // Return the original or empty string on error
        }
    }
    return imageUrl || '';
};
