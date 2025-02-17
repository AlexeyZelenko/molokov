<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed, onMounted, ref, watch } from 'vue';
import { useAnalyticsStore } from '@/store/analytics';

const analyticsStore = useAnalyticsStore();
const { getPrimary, getSurface, isDarkTheme } = useLayout();

const chartData = ref(null);
const chartOptions = ref(null);

const sell = computed(() => analyticsStore.properties['sell'] || []);

const priceStats = computed(() => {
    const stats = {
        1: { min: Infinity, max: 0, avg: 0, count: 0, sum: 0},
        2: {min: Infinity, max: 0, avg: 0, count: 0, sum: 0},
        3: {min: Infinity, max: 0, avg: 0, count: 0, sum: 0},
        4: {min: Infinity, max: 0, avg: 0, count: 0, sum: 0}
    };

    if (!sell.value) return stats;

    sell.value.forEach(apartment => {
        const rooms = apartment.rooms?.all;
        const price = apartment.price;

        if (rooms >= 1 && rooms <= 4 && price) {
            stats[rooms].min = Math.min(stats[rooms].min, price);
            stats[rooms].max = Math.max(stats[rooms].max, price);
            stats[rooms].sum += price;
            stats[rooms].count++;
        }
    });

    Object.keys(stats).forEach(rooms => {
        if (stats[rooms].count > 0) {
            stats[rooms].avg = Math.round(stats[rooms].sum / stats[rooms].count);
        }
        if (stats[rooms].min === Infinity) {
            stats[rooms].min = 0;
        }
    });

    return stats;
});

function setChartData() {
    return {
        labels: ['1 кімната', '2 кімнати', '3 кімнати', '4 кімнати'],
        datasets: [
            {
                type: 'bar',
                label: 'Мінімальна ціна',
                backgroundColor: '#2ECC71', // Яркий зеленый
                data: [
                    priceStats.value[1].min,
                    priceStats.value[2].min,
                    priceStats.value[3].min,
                    priceStats.value[4].min
                ],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                barThickness: 20
            },
            {
                type: 'bar',
                label: 'Середня ціна',
                backgroundColor: '#3498DB', // Яркий синий
                data: [
                    priceStats.value[1].avg,
                    priceStats.value[2].avg,
                    priceStats.value[3].avg,
                    priceStats.value[4].avg
                ],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                barThickness: 20
            },
            {
                type: 'bar',
                label: 'Максимальна ціна',
                backgroundColor: '#E74C3C', // Яркий красный
                data: [
                    priceStats.value[1].max,
                    priceStats.value[2].max,
                    priceStats.value[3].max,
                    priceStats.value[4].max
                ],
                borderRadius: {
                    topLeft: 8,
                    topRight: 8
                },
                barThickness: 20
            }
        ]
    };
}

function setChartOptions() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        plugins: {
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    color: textColor,
                    usePointStyle: true,
                    font: {
                        weight: 500
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
                    }
                }
            }
        },
        scales: {
            x: {
                stacked: false,
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    }
                },
                grid: {
                    display: false,
                    drawBorder: false
                }
            },
            y: {
                stacked: false,
                ticks: {
                    color: textColorSecondary,
                    font: {
                        weight: 500
                    },
                    callback: function (value) {
                        return value.toLocaleString();
                    }
                },
                grid: {
                    color: surfaceBorder,
                    drawBorder: false
                }
            }
        }
    };
}

watch([getPrimary, getSurface, isDarkTheme], () => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});

watch(priceStats, () => {
    chartData.value = setChartData();
}, {deep: true});

onMounted(() => {
    chartData.value = setChartData();
    chartOptions.value = setChartOptions();
});
</script>

<template>
    <div v-if="sell.length" class="card">
        <div class="font-semibold text-xl mb-4">Аналіз цін квартир</div>
        <Chart type="bar" :data="chartData" :options="chartOptions" class="h-80"/>
    </div>
</template>
