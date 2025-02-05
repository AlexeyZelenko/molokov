<template>
    <div class="card flex justify-center">
        <Toast style="position: fixed; top: 70px" position="top-center" group="headless" @close="visibleRef = false">
            <template #container="{ message }">
                <section class="flex flex-col p-4 gap-4 w-full bg-primary/70 rounded-xl">
                    <div class="flex items-center gap-5">
                        <i class="pi pi-cloud-upload text-white dark:text-black text-2xl"></i>
                        <span class="font-bold text-base text-white dark:text-black">{{ message.summary }}</span>
                    </div>
                    <div class="flex flex-col gap-2">
                        <ProgressBar
                            :value="progress"
                            :showValue="false"
                            :style="{ height: '4px' }" pt:value:class="!bg-primary-50 dark:!bg-primary-900" class="!bg-primary/80"
                        ></ProgressBar>
                        <label class="text-sm font-bold text-white dark:text-black">{{ progress }}% завантаження</label>
                    </div>
                </section>
            </template>
        </Toast>
    </div>
</template>

<script setup>
import { defineProps, defineEmits, onMounted, ref, onUnmounted, computed } from 'vue';
import { useToast } from 'primevue/usetoast';

const toast = useToast();

defineProps({
    visible: {
        type: Boolean,
        default: false
    }
});

const visibleRef = ref(false);

const visible = computed({
    get: () => visibleRef.value,
    set: (value) => {
        if (!value) {
            clearInterval(interval.value);
            toast.removeGroup('headless');
        }
        visibleRef.value = value;
    }
});

const interval = ref(null);
const progress = ref(0);

onMounted(() => {
    if (!visibleRef.value) {
        toast.add({
            severity: 'custom',
            summary: 'Обробка файлів...',
            group: 'headless',
            styleClass: 'backdrop-blur-lg rounded-2xl'
        });
        visibleRef.value = true;
        progress.value = 5;

        if (interval.value) {
            clearInterval(interval.value);
        }

        interval.value = setInterval(() => {
            let increment = Math.max(5, (100 - progress.value) / 5); // Чем ближе к 100, тем меньше шаг
            progress.value = Math.min(progress.value + increment, 100);

            if (progress.value >= 100) {
                clearInterval(interval.value);
                toast.removeGroup('headless');
            }
        }, 150); // Интервал уменьшен для более плавного отображения
    }
});

defineEmits(['close']);

onUnmounted(() => {
    if (interval.value) {
        clearInterval(interval.value);
    }
});
</script>

<style scoped>
.p-toast {
    position: absolute;
    top: 150px;
}
</style>
