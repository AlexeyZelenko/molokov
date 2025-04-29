<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useVuelidate } from '@vuelidate/core';
import { required, email, minLength } from '@vuelidate/validators';
import { getFunctions, httpsCallable } from 'firebase/functions';

const formData = reactive({
    name: '',
    email: '',
    subject: '',
    message: '',
    honeypot: '',      // Поле-ловушка для ботов
    timeSpent: 0,      // Отслеживание времени заполнения формы
    captchaResponse: '' // Ответ reCAPTCHA
});

const subjectOptions = [
    { name: 'Технічна проблема', value: 'technical' },
    { name: 'Питання щодо рахунку', value: 'billing' },
    { name: 'Пропозиція', value: 'suggestion' },
    { name: 'Інше', value: 'other' }
];

const rules = {
    name: { required },
    email: { required, email },
    subject: { required },
    message: { required, minLength: minLength(10) }
    // Убираем captchaResponse из валидации через Vuelidate
};

const v$ = useVuelidate(rules, formData);
const submitted = ref(false);
const loading = ref(false);
const dialogVisible = ref(false);
const success = ref(false);
const errorMessage = ref('');
const formStartTime = ref(null);
const captchaVerified = ref(false);
const simpleCaptchaAnswer = ref('');
const simpleCaptchaQuestion = ref('');
const simpleCaptchaOptions = ref([]);

// Генерация простой математической капчи
const generateSimpleCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operation = Math.random() > 0.5 ? '+' : '-';

    let correctAnswer;
    if (operation === '+') {
        simpleCaptchaQuestion.value = `${num1} + ${num2} = ?`;
        correctAnswer = num1 + num2;
    } else {
        // Убедимся, что результат всегда положительный
        if (num1 < num2) {
            simpleCaptchaQuestion.value = `${num2} - ${num1} = ?`;
            correctAnswer = num2 - num1;
        } else {
            simpleCaptchaQuestion.value = `${num1} - ${num2} = ?`;
            correctAnswer = num1 - num2;
        }
    }

    // Создаем варианты ответов (один правильный и несколько неправильных)
    const options = [correctAnswer];
    while (options.length < 4) {
        const fakeAnswer = Math.floor(Math.random() * 20) + 1;
        if (!options.includes(fakeAnswer)) {
            options.push(fakeAnswer);
        }
    }

    // Перемешиваем варианты ответов
    simpleCaptchaOptions.value = options.sort(() => Math.random() - 0.5);
};

// Проверка простой капчи
const checkSimpleCaptcha = () => {
    if (!simpleCaptchaAnswer.value) {
        return false;
    }

    const parts = simpleCaptchaQuestion.value.split(' ');
    const num1 = parseInt(parts[0]);
    const operation = parts[1];
    const num2 = parseInt(parts[2]);

    let correctAnswer;
    if (operation === '+') {
        correctAnswer = num1 + num2;
    } else {
        correctAnswer = num1 - num2;
    }

    console.log('Captcha check:', simpleCaptchaAnswer.value, correctAnswer);
    return simpleCaptchaAnswer.value === correctAnswer;
};

// Инициализация формы
onMounted(() => {
    formStartTime.value = Date.now();
    generateSimpleCaptcha();

    // Инициализация reCAPTCHA (при необходимости)
    if (window.grecaptcha) {
        window.grecaptcha.ready(() => {
            // Здесь можно выполнить предварительную проверку reCAPTCHA
        });
    }
});

const submitForm = async () => {
    submitted.value = true;

    console.log('Form submission started');

    // Проверка поля-ловушки (honeypot)
    if (formData.honeypot) {
        console.log('Обнаружен бот через honeypot');
        // Имитируем успешную отправку, но на самом деле ничего не отправляем
        loading.value = true;
        setTimeout(() => {
            success.value = true;
            loading.value = false;
            dialogVisible.value = true;
            resetForm();
        }, 1000);
        return;
    }

    // Проверка времени заполнения формы
    formData.timeSpent = (Date.now() - formStartTime.value) / 1000; // в секундах
    if (formData.timeSpent < 3) {
        console.log('Обнаружен бот через время заполнения');
        // Имитируем успешную отправку
        loading.value = true;
        setTimeout(() => {
            success.value = true;
            loading.value = false;
            dialogVisible.value = true;
            resetForm();
        }, 1000);
        return;
    }

    // Валидация формы перед проверкой капчи
    const isFormValid = await v$.value.$validate();
    if (!isFormValid) {
        console.log('Form validation failed');
        return;
    }

    // Проверка простой капчи
    if (!checkSimpleCaptcha()) {
        console.log('Captcha check failed');
        errorMessage.value = 'Неправильна відповідь на перевірочне питання';
        success.value = false;
        dialogVisible.value = true;
        return;
    }

    console.log('Form validation and captcha check passed');

    loading.value = true;

    try {
        const functions = getFunctions();
        const sendSupportMessage = httpsCallable(functions, 'sendSupportMessage');

        const data = {
            name: formData.name,
            email: formData.email,
            subject: formData.subject,
            message: formData.message,
            timeSpent: formData.timeSpent,
            timestamp: Date.now()
        };

        await sendSupportMessage(data);

        success.value = true;
        resetForm();
    } catch (error) {
        success.value = false;
        errorMessage.value = error.message || 'Невідома помилка';
        console.error('Помилка відправки:', error);
    } finally {
        loading.value = false;
        dialogVisible.value = true;
    }
};

const resetForm = () => {
    formData.name = '';
    formData.email = '';
    formData.subject = '';
    formData.message = '';
    formData.honeypot = '';
    simpleCaptchaAnswer.value = '';
    submitted.value = false;
    formStartTime.value = Date.now();
    generateSimpleCaptcha();
};

const closeDialog = () => {
    dialogVisible.value = false;
};
</script>

<template>
    <div class="support-form">
        <h2>Зв'язатися з підтримкою</h2>

        <form @submit.prevent="submitForm">
            <!-- Поле-ловушка для ботов (скрыто от обычных пользователей) -->
            <div class="honeypot-field">
                <input type="text" v-model="formData.honeypot" tabindex="-1" autocomplete="off" />
            </div>

            <div class="p-field mb-3">
                <label for="name" class="block font-bold mb-2">Ваше ім'я</label>
                <InputText id="name" v-model="formData.name" :class="{ 'p-invalid': v$.name.$invalid && submitted }" class="w-full" autocomplete="name" />
                <small v-if="v$.name.$invalid && submitted" class="p-error">Будь ласка, введіть ваше ім'я</small>
            </div>

            <div class="p-field mb-3">
                <label for="email" class="block font-bold mb-2">Електронна пошта</label>
                <InputText id="email" v-model="formData.email" :class="{ 'p-invalid': v$.email.$invalid && submitted }" class="w-full" autocomplete="email" />
                <small v-if="v$.email.$invalid && submitted" class="p-error">Будь ласка, введіть правильну електронну пошту</small>
            </div>

            <div class="p-field mb-3">
                <label for="subject" class="block font-bold mb-2">Тема</label>
                <Dropdown id="subject" v-model="formData.subject" :options="subjectOptions" optionLabel="name" optionValue="value" placeholder="Оберіть тему звернення" :class="{ 'p-invalid': v$.subject.$invalid && submitted }" class="w-full" />
                <small v-if="v$.subject.$invalid && submitted" class="p-error">Будь ласка, оберіть тему</small>
            </div>

            <div class="p-field mb-3">
                <label for="message" class="block font-bold mb-2">Повідомлення</label>
                <Textarea id="message" v-model="formData.message" rows="5" :class="{ 'p-invalid': v$.message.$invalid && submitted }" class="w-full" />
                <small v-if="v$.message.$invalid && submitted" class="p-error">Будь ласка, введіть ваше повідомлення (мінімум 10 символів)</small>
            </div>

            <!-- Простая капча -->
            <div class="p-field mb-3">
                <label class="block font-bold mb-2">Перевірка безпеки</label>
                <div class="captcha-container">
                    <p class="mb-2">{{ simpleCaptchaQuestion }}</p>
                    <div class="captcha-options">
                        <div v-for="(option, index) in simpleCaptchaOptions" :key="index" class="captcha-option">
                            <RadioButton :inputId="`captcha-option-${index}`" name="captchaOption" :value="option" v-model="simpleCaptchaAnswer" />
                            <label :for="`captcha-option-${index}`" class="ml-2">{{ option }}</label>
                        </div>
                    </div>
                </div>
                <small v-if="submitted && !simpleCaptchaAnswer" class="p-error">Будь ласка, виберіть відповідь</small>
            </div>

            <div class="flex justify-content-end">
                <Button type="submit" label="Надіслати" icon="pi pi-send" :loading="loading" />
            </div>
        </form>

        <Dialog v-model:visible="dialogVisible" :modal="true" header="Результат">
            <div v-if="success" class="text-center">
                <i class="pi pi-check-circle text-green-500 text-5xl mb-3"></i>
                <h3>Дякуємо!</h3>
                <p>Ваше повідомлення успішно надіслано. Ми зв'яжемося з вами найближчим часом.</p>
            </div>
            <div v-else class="text-center">
                <i class="pi pi-times-circle text-red-500 text-5xl mb-3"></i>
                <h3>Помилка!</h3>
                <p>На жаль, виникла помилка при відправленні. Будь ласка, спробуйте пізніше.</p>
                <p class="text-sm text-gray-600">{{ errorMessage }}</p>
            </div>
            <template #footer>
                <Button label="OK" @click="closeDialog" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
.support-form {
    max-width: 600px;
    padding: 2rem;
    background-color: #f8f9fa;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    margin: 50px auto;
}

h2 {
    color: #2c3e50;
    margin-bottom: 1.5rem;
    text-align: center;
}

/* Скрытое поле-ловушка для ботов */
.honeypot-field {
    position: absolute;
    left: -9999px;
    visibility: hidden;
    opacity: 0;
    height: 0;
    width: 0;
    z-index: -1;
}

/* Стили для капчи */
.captcha-container {
    background-color: #edf2f7;
    padding: 1rem;
    border-radius: 6px;
    border: 1px solid #e2e8f0;
}

.captcha-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
}

.captcha-option {
    display: flex;
    align-items: center;
}
</style>
