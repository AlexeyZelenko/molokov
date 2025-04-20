<script>
import FeatureCard from './FeatureCard.vue';
import Avatar from 'primevue/avatar';

export default {
    components: {
        FeatureCard,
        Avatar
    }
};
</script>

<template>
    <section id="features" class="features-section">
        <div class="features-container">
            <div class="features-header">
                <h2 class="features-title">Чудові особливості</h2>
            </div>

            <div class="features-grid">
                <!-- Feature 1 -->
                <FeatureCard icon="pi-users" iconBg="bg-yellow-200" iconColor="text-yellow-700" title="Легкий у використанні" description="Зручний інтерфейс для швидкої роботи." gradient="rgba(253, 228, 165, 0.2), rgba(187, 199, 205, 0.2)" />

                <!-- Feature 2 -->
                <FeatureCard icon="pi-palette" iconBg="bg-cyan-200" iconColor="text-cyan-700" title="Свіжий дизайн" description="Сучасний вигляд із приємними кольорами." gradient="rgba(145, 226, 237, 0.2), rgba(251, 199, 145, 0.2)" />

                <!-- Feature 3 -->
                <FeatureCard icon="pi-map" iconBg="bg-indigo-200" iconColor="text-indigo-700" title="Аналітика" description="Отримуйте детальну статистику та звіти." gradient="rgba(145, 226, 237, 0.2), rgba(172, 180, 223, 0.2)" />

                <!-- Feature 4 -->
                <FeatureCard icon="pi-id-card" iconBg="bg-slate-200" iconColor="text-slate-700" title="Адаптивний макет" description="Ідеально працює на будь-яких пристроях." gradient="rgba(187, 199, 205, 0.2), rgba(251, 199, 145, 0.2)" />

                <!-- Feature 5 -->
                <FeatureCard icon="pi-star" iconBg="bg-orange-200" iconColor="text-orange-700" title="Списки клієнтів" description="Легко керуйте списками та контактами." gradient="rgba(187, 199, 205, 0.2), rgba(246, 158, 188, 0.2)" />

                <!-- Feature 6 -->
                <FeatureCard icon="pi-moon" iconBg="bg-pink-200" iconColor="text-pink-700" title="Темний режим" description="Комфортне використання в темний час доби." gradient="rgba(251, 199, 145, 0.2), rgba(246, 158, 188, 0.2)" />

                <!-- Feature 7 -->
                <FeatureCard icon="pi-shopping-cart" iconBg="bg-teal-200" iconColor="text-teal-700" title="Списки для клієнтів" description="Організуйте інформацію зручним способом." gradient="rgba(145, 210, 204, 0.2), rgba(160, 210, 250, 0.2)" />

                <!-- Feature 8 -->
                <FeatureCard icon="pi-globe" iconBg="bg-blue-200" iconColor="text-blue-700" title="Сучасні практики" description="Використовуємо найкращі методи розробки." gradient="rgba(145, 210, 204, 0.2), rgba(212, 162, 221, 0.2)" />

                <!-- Feature 9 -->
                <FeatureCard icon="pi-eye" iconBg="bg-purple-200" iconColor="text-purple-700" title="Конфіденційність" description="Ваші дані надійно захищені." gradient="rgba(160, 210, 250, 0.2), rgba(212, 162, 221, 0.2)" />
            </div>

            <div class="testimonial">
                <div class="testimonial-content">
                    <h3 class="testimonial-name">Сергій Молоков</h3>
                    <span class="testimonial-position">Магазин Нерухомості</span>
                    <p class="testimonial-text">“Ми допомагаємо клієнтам знайти ідеальне житло та інвестувати у нерухомість з упевненістю. Наш досвід та персональний підхід гарантують вам найкращі умови на ринку.”</p>
                    <Avatar image="/demo/images/landing/molokov-logo.webp" class="testimonial-avatar" size="xlarge" shape="circle" />
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped lang="scss">
.features-section {
    @apply py-6 px-6 lg:px-20 mt-8 mx-0 lg:mx-20;
}

.features-container {
    @apply max-w-7xl mx-auto;
}

.features-header {
    @apply col-span-12 text-center mt-20 mb-6;
}

.features-title {
    @apply text-surface-900 dark:text-surface-0 font-normal mb-2 text-4xl;
}

.features-grid {
    @apply grid grid-cols-12 gap-4;
}

.testimonial {
    @apply col-span-12 mt-20 mb-20 p-2 md:p-20;
    border-radius: 20px;
    background: linear-gradient(0deg, rgba(255, 255, 255, 0.6), rgba(255, 255, 255, 0.6)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #efe1af 0%, #c3dcfa 100%);
}

.testimonial-content {
    @apply flex flex-col justify-center items-center text-center px-4 py-4 md:py-0;
}

.testimonial-name {
    @apply text-gray-900 mb-2 text-3xl font-semibold;
}

.testimonial-position {
    @apply text-gray-600 text-2xl;
}

.testimonial-text {
    @apply text-gray-900 text-xl mt-6 max-w-4xl;
}

.testimonial-avatar {
    @apply mt-6;
}
</style>
