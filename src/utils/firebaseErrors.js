const firebaseErrors = {
    'auth/wrong-password': 'Невірний пароль',
    'auth/user-not-found': 'Користувача з такою електронною поштою не знайдено',
    'auth/email-already-in-use': 'Ця електронна пошта вже використовується',
    'auth/invalid-email': 'Невірний формат електронної пошти',
    'auth/weak-password': 'Пароль повинен містити принаймні 6 символів',
    'auth/too-many-requests': 'Забагато невдалих спроб. Спробуйте пізніше',
    'auth/network-request-failed': 'Помилка мережі. Перевірте підключення',
    'auth/invalid-credential': 'Невірні облікові дані',
    'auth/operation-not-allowed': 'Операція не дозволена',
    'auth/popup-closed-by-user': 'Вікно авторизації було закрито',
    'auth/unauthorized-domain': 'Неавторизований домен',
    'auth/user-disabled': 'Цей обліковий запис відключено',
    'auth/user-token-expired': 'Сесія закінчилася. Увійдіть знову',
    'auth/web-storage-unsupported': 'Веб-сховище не підтримується вашим браузером',
    'auth/invalid-verification-code': 'Невірний код підтвердження',
    'auth/invalid-verification-id': 'Невірний ідентифікатор підтвердження',
    'auth/missing-verification-code': 'Відсутній код підтвердження',
    'auth/missing-verification-id': 'Відсутній ідентифікатор підтвердження',
    'auth/quota-exceeded': 'Перевищено квоту запитів. Спробуйте пізніше',
    // 'default': 'Сталася помилка. Спробуйте ще раз'
};

export const getFirebaseErrorMessage = (errorCode) => {
    // Extract error code from the full error message if needed
    const code = errorCode.includes(':')
        ? errorCode.split('Firebase: Error (')[1].split(').')[0]
        : errorCode;

    return firebaseErrors[code] || firebaseErrors.default;
};
