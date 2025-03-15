export const SHARE_CONFIG = {
    facebook: {
        buildUrl: (data) =>
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}`,
        icon: 'pi pi-facebook',
        label: 'Facebook'
    },
    telegram: {
        buildUrl: (data) => {
            const textWithUrl = `\n${data.descriptionPartsTelegram}`;
            return `https://t.me/share/url?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(textWithUrl)}&parse_mode=html`;
        },
        icon: 'pi pi-telegram',
        label: 'Telegram'
    },
    viber: {
        buildUrl: (data) =>
            `viber://forward?text=${encodeURIComponent(`${data.url}${data.description}`)}`,
        icon: 'pi pi-phone',
        label: 'Viber'
    },
    whatsapp: {
        buildUrl: (data) =>
            `https://api.whatsapp.com/send?text=${encodeURIComponent(`${data.description}\n\n${data.url}`)}`,
        icon: 'pi pi-whatsapp',
        label: 'WhatsApp'
    }
};
