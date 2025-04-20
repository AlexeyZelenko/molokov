<script>
export default {
    props: {
        icon: String,
        iconBg: String,
        iconColor: String,
        title: String,
        description: String,
        gradient: String
    }
};
</script>

<template>
    <div class="feature-card">
        <div class="feature-gradient">
            <div class="feature-content">
                <div class="flex items-center justify-between">
                    <div class="feature-icon" :class="iconBg">
                        <i class="pi" :class="['pi-fw', icon, iconColor, '!text-2xl']"></i>
                    </div>
                    <h5 class="feature-title">{{ title }}</h5>
                </div>
                <span class="feature-description">{{ description }}</span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.feature-card {
    @apply col-span-12 md:col-span-12 lg:col-span-4 p-0 lg:pr-8 lg:pb-8 mt-6 lg:mt-0;
}

.feature-gradient {
    height: 160px;
    padding: 2px;
    border-radius: 10px;
    background: linear-gradient(90deg, v-bind(gradient)), linear-gradient(180deg, v-bind(gradient));
}

.feature-content {
    @apply p-4 bg-surface-0 dark:bg-surface-900 h-full rounded-lg;
}

.feature-icon {
    @apply flex items-center justify-center mb-4;
    width: 3.5rem;
    height: 3.5rem;
    border-radius: 10px;
}

.feature-title {
    @apply text-surface-900 dark:text-surface-0 text-xl font-semibold;
}

.feature-description {
    @apply text-surface-600 dark:text-surface-200 text-lg mt-4;
    @apply text-surface-600 dark:text-surface-200;
}
</style>
