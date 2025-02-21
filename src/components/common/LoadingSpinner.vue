<template>
    <div
        :class="[
            'loading-spinner-container',
            { 'fullscreen': fullscreen }
        ]"
    >
        <div class="spinner-wrapper">
            <div
                class="spinner"
                :style="{
                    width: size + 'px',
                    height: size + 'px',
                    borderWidth: thickness + 'px'
                }"
            />
            <span
                v-if="message"
                class="spinner-message"
                :style="{ color: textColor }"
            >
                {{ message }}
            </span>
        </div>
    </div>
</template>

<script setup>
defineProps({
    size: {
        type: Number,
        default: 40
    },
    thickness: {
        type: Number,
        default: 4
    },
    color: {
        type: String,
        default: 'var(--primary-color, #3B82F6)'
    },
    textColor: {
        type: String,
        default: 'var(--text-color, #374151)'
    },
    message: {
        type: String,
        default: ''
    },
    fullscreen: {
        type: Boolean,
        default: false
    }
});
</script>

<style scoped>
.loading-spinner-container {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1rem;
}

.loading-spinner-container.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(255, 255, 255, 0.9);
    z-index: 9999;
}

.spinner-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.spinner {
    border-style: solid;
    border-color: v-bind(color) transparent transparent transparent;
    border-radius: 50%;
    animation: spin 1s cubic-bezier(0.5, 0, 0.5, 1) infinite;
}

.spinner-message {
    font-size: 0.875rem;
    text-align: center;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}
</style>
