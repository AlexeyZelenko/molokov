<script setup>
import {useLayout} from '@/layout/composables/layout';
import {computed, onMounted, ref, watch} from 'vue';
import {useAnalyticsStore} from '@/store/analytics';

const analyticsStore = useAnalyticsStore();
const {getPrimary, getSurface, isDarkTheme} = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

// Получаем данные из store
const sell = computed(() => analyticsStore.properties['sell'] || []);

// Вычисляем количество квартир по комнатам
const apartmentCounts = computed(() => {
    const counts = {
        1: 0,
        2: 0,
        3: 0,
        4: 0
    };

    if (!sell.value) return counts;

    sell.value.forEach(apartment => {
        const roomCount = apartment.rooms?.all;
        if (roomCount >= 1 && roomCount <= 4) {
            counts[roomCount]++;
        }
    });

    return counts;
});

function setChartData() {
    const documentStyle = getComputedStyle(document.documentElement);

    return {
        labels: ['1 кімната', '2 кімнати', '3 кімнати', '4 кімнати'],
        datasets: [
            {
                type: 'bar',
                label: 'Кількість квартир',
                backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
                data: [
                    apartmentCounts.value[1],
                    apartmentCounts.value[2],
                    apartmentCounts.value[3],
                    apartmentCounts.value[4]
                ],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                barThickness: 32
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `Кількість: ${context.raw} кв.`;
                    }
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: textMutedColor
                },
                grid: {
                    color: 'transparent',
                    borderColor: 'transparent'
                }
            },
            y: {
                ticks: {
                    color: textMutedColor,
                    stepSize: 1
                },
                grid: {
                    color: borderColor,
                    borderColor: 'transparent',
                    drawTicks: false
                }
            }
        }
    };
}

// Обновляем график при изменении темы
watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

// Обновляем график при изменении данных
watch(apartmentCounts, () => {
    chartData.value = setChartData();
}, {deep: true});

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div v-if="sell.length" class="card">
        <div class="font-semibold text-xl mb-4">Квартири для продажу (кімнат)</div>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80"/>
    </div>
</template>
