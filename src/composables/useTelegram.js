export function useTelegram(telegram) {
    const setupTelegram = () => {
        if (telegram.isAvailable) {
            // Настраиваем навигацию
            telegram.enableBackButton(true);
            telegram.onBackButtonClicked(() => {
                router.go(-1);
            });

            // Деактивируем главную кнопку (мы используем собственную кнопку в форме)
            telegram.enableMainButton(false);
        }
    };

    const cleanupTelegram = () => {
        if (telegram.isAvailable) {
            telegram.enableBackButton(false);
        }
    };

    return {
        setupTelegram,
        cleanupTelegram
    };
}
