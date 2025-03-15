import { computed } from 'vue';
import { SHARE_CONFIG } from './socialShareConfig';
import { formatUrl, buildShareDescription, buildTelegramShareDescription, getImageUrl, getFullImageUrl } from './socialShareUtils';


export function useSocialShare(props, toast) {
    // Utility functions
    const formatUrl = (url) => {
        try {
            const urlObj = new URL(url);
            return `${urlObj.hostname}${urlObj.pathname.slice(0, 15)}${urlObj.pathname.length > 15 ? '...' : ''}`;
        } catch {
            return url.slice(0, 30) + (url.length > 30 ? '...' : '');
        }
    };

    // Share metadata computation
    const shareMetaData = computed(() => {
        const defaultImage = '/images/apartments.webp';
        const { property, title, adUrl, imageUrl } = props;
        const urlFindProperty = `/${property.category.code}/${property.subcategory.code}/${property.idProperty}`;
        const newUrl = new URL(urlFindProperty, window.location.origin).href;

        const descriptionParts = buildShareDescription(property);
        let imageFullUrl = getFullImageUrl(getImageUrl(property, imageUrl));

        if (!imageFullUrl) {
            imageFullUrl = new URL(defaultImage, window.location.origin).href;
        }
        const descriptionPartsTelegram = buildTelegramShareDescription(property);

        return {
            title,
            description: descriptionParts,
            image: imageFullUrl,
            url: newUrl || adUrl,
            formattedUrl: formatUrl(adUrl),
            descriptionPartsTelegram
        };
    });

    // Share functionality
    const shareContent = (platform) => {
        try {
            const config = SHARE_CONFIG[platform];
            if (!config) throw new Error(`Unsupported platform: ${platform}`);

            const url = config.buildUrl(shareMetaData.value);
            window.open(url, '_blank', 'width=600,height=400');
        } catch (error) {
            showToast('error', 'Помилка', `Неможливо поділитися через ${platform}`);
            console.error(`Share error (${platform}):`, error);
        }
    };

    const showToast = (severity, summary, detail) => {
        toast.add({
            severity,
            summary,
            detail,
            life: 3000
        });
    };

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(props.adUrl);
            showToast('success', 'Копіювання', 'Посилання скопійоване в буфер обміну');
        } catch (error) {
            showToast('error', 'Помилка', 'Неможливо скопіювати посилання');
        }
    };

    // Share items for the speed dial
    const shareItems = computed(() => [
        ...Object.entries(SHARE_CONFIG).map(([platform, config]) => ({
            label: config.label,
            icon: config.icon,
            command: () => shareContent(platform)
        })),
        {
            label: 'Копіювати посилання',
            icon: 'pi pi-copy',
            command: copyLink
        }
    ]);

    // Telegram specific share
    const shareProductTelegramWebApp = () => {
        console.log('Share product');
        const property = props.property;

        const descriptionParts = [
            `Подивіться на цей об'єкт: ${props.property.title} - ${props.property.price} $`,
            `🏠 Кімнат: ${property.rooms?.all || 'Не вказано'} 💰 Ціна: ${property.price} USD`,
            `📏 Площа: ${property.apartmentArea?.totalArea} м²  🔝 Поверх: ${property.floors.floor}/${property.floors.totalFloors}`,
            `🏙️ Адреса: ${property.address.region.name} / ${property.address.city.name || ''} / ${property.address.area.name || ''}/n`,
        ].filter(Boolean).join('\n');

        const text = descriptionParts;
        const url = props.adUrl;

        // Используем Telegram WebApp API для шаринга, если доступно
        telegram.shareContent(text, url);
    };

    return {
        shareMetaData,
        shareItems,
        shareProductTelegramWebApp
    };
}
