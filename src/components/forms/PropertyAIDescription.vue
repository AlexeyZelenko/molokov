<script setup>
import { ref, computed, watch } from 'vue';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

const props = defineProps({
    property: {
        type: Object,
        required: true
    }
});

const emit = defineEmits(['generate-description']);

const toast = useToast();
const isGenerating = ref(false);
const generatedDescription = ref('');
const selectedStyle = ref('standard'); // standard, premium, emotional
const showDescription = ref(false);

// Стили описаний
const descriptionStyles = [
    { label: 'Стандартний', value: 'standard', icon: 'pi pi-home' },
    { label: 'Преміум', value: 'premium', icon: 'pi pi-star' },
    { label: 'Емоційний', value: 'emotional', icon: 'pi pi-heart' }
];

// Проверка достаточности данных для генерации описания
const canGenerateDescription = computed(() => {
    return (
        props.property && 
        props.property.title &&
        props.property.apartmentArea && 
        props.property.apartmentArea.totalArea &&
        props.property.address && 
        props.property.address.city
    );
});

// Сведения о недвижимости для AI
const propertyInfo = computed(() => {
    if (!props.property) return {};
    
    return {
        title: props.property.title || '',
        category: props.property.category?.name || '',
        subcategory: props.property.subcategory?.name || '',
        totalArea: props.property.apartmentArea?.totalArea || '',
        rooms: props.property.rooms?.bedrooms || '',
        floor: props.property.floors?.floor || '',
        totalFloors: props.property.floors?.totalFloors || '',
        cityName: props.property.address?.city?.name || '',
        regionName: props.property.address?.city?.RegionsDescription || '',
        areaName: props.property.address?.area?.name || '',
        balcony: props.property.balconyTerrace ? 'Є' : 'Немає',
        parking: props.property.parking ? 'Є' : 'Немає',
        condition: props.property.condition?.name || '',
        buildingType: props.property.buildingType?.name || '',
        price: props.property.price || ''
    };
});

// Фейковая функция генерации описания через AI (в реальном приложении здесь был бы API-запрос)
const generateAIDescription = async () => {
    isGenerating.value = true;
    try {
        // Имитация задержки API-запроса
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Генерация примера описания на основе стиля и данных объекта
        let description = '';
        const info = propertyInfo.value;
        
        if (selectedStyle.value === 'standard') {
            description = `
                <p><strong>${info.category} ${info.subcategory}</strong> загальною площею ${info.totalArea} м² в ${info.cityName}${info.areaName ? ', район ' + info.areaName : ''}.</p>
                <p>Квартира розташована на ${info.floor} поверсі ${info.totalFloors}-поверхового будинку. ${info.rooms ? 'Кількість кімнат: ' + info.rooms + '.' : ''} ${info.condition ? 'Стан: ' + info.condition + '.' : ''}</p>
                <p>Зручне розташування, розвинена інфраструктура району та гарна транспортна розв'язка роблять цей об'єкт привабливим вибором для проживання.</p>
                <p>${info.balcony === 'Є' ? 'Наявний балкон. ' : ''}${info.parking === 'Є' ? 'Є місце для паркування.' : ''}</p>
                <p>Ідеальний варіант для ${info.subcategory === 'rent' ? 'орендарів, які шукають комфортне житло' : 'тих, хто шукає нове комфортне житло'}.</p>
            `;
        } else if (selectedStyle.value === 'premium') {
            description = `
                <p><strong>ПРЕМІАЛЬНА ПРОПОЗИЦІЯ!</strong> Вишуканий ${info.category.toLowerCase()} у престижному районі ${info.cityName}${info.areaName ? ' (' + info.areaName + ')' : ''}.</p>
                <p>Розкішний життєвий простір площею ${info.totalArea} м² з продуманим плануванням та елегантним дизайном. ${info.rooms ? 'Просторі ' + info.rooms + ' кімнати створюють атмосферу неперевершеного комфорту.' : ''}</p>
                <p>Розташування на ${info.floor} поверсі ${info.totalFloors}-поверхового будинку забезпечує чудовий панорамний вигляд. ${info.condition ? 'Бездоганний ' + info.condition.toLowerCase() + ' ремонт виконаний з використанням преміальних матеріалів.' : ''}</p>
                <p>${info.balcony === 'Є' ? 'Приватна тераса ідеально підходить для ранкових сніданків і вечірніх коктейлів. ' : ''}${info.parking === 'Є' ? 'Персональне паркувальне місце в закритому паркінгу.' : ''}</p>
                <p>Ексклюзивна пропозиція для поціновувачів комфорту та статусу найвищого рівня.</p>
            `;
        } else if (selectedStyle.value === 'emotional') {
            description = `
                <p><strong>НЕЙМОВІРНА МОЖЛИВІСТЬ!</strong> Мрієте про затишну оселю з особливою атмосферою? Цей чарівний ${info.category.toLowerCase()} у ${info.cityName} чекає саме на Вас!</p>
                <p>Відчуйте тепло та комфорт у життєвому просторі площею ${info.totalArea} м², де кожен куточок наповнений світлом і позитивною енергією. ${info.rooms ? 'Затишні ' + info.rooms + ' кімнати створені для щасливих моментів з родиною та друзями.' : ''}</p>
                <p>Уявіть собі ранок з чашкою кави на ${info.floor} поверсі, споглядаючи мальовничі краєвиди міста. ${info.condition ? 'Чудовий ' + info.condition.toLowerCase() + ' ремонт створює відчуття домашнього тепла з першої хвилини.' : ''}</p>
                <p>${info.balcony === 'Є' ? 'Романтичний балкон стане вашим улюбленим місцем для відпочинку та натхнення. ' : ''}${info.parking === 'Є' ? 'Забудьте про проблеми з паркуванням – ваше місце завжди чекає на вас!' : ''}</p>
                <p>Не втрачайте шанс зробити своє життя яскравішим у цьому особливому місці! Створіть свою історію щастя разом з нами!</p>
            `;
        }
        
        generatedDescription.value = description;
        showDescription.value = true;
    } catch (error) {
        console.error('Error generating description:', error);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося згенерувати опис', life: 3000 });
    } finally {
        isGenerating.value = false;
    }
};

// Копирование описания в буфер обмена
const copyDescription = () => {
    // Создаем временный div для правильного копирования HTML-содержимого
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = generatedDescription.value;
    
    // Получаем текст без HTML-тегов
    const textToCopy = tempDiv.textContent || tempDiv.innerText || '';
    
    // Копируем в буфер обмена
    navigator.clipboard.writeText(textToCopy).then(() => {
        toast.add({ severity: 'success', summary: 'Успішно', detail: 'Опис скопійовано в буфер обміну', life: 3000 });
    }).catch((err) => {
        console.error('Failed to copy description:', err);
        toast.add({ severity: 'error', summary: 'Помилка', detail: 'Не вдалося скопіювати опис', life: 3000 });
    });
};

// Использование сгенерированного описания
const useDescription = () => {
    emit('generate-description', generatedDescription.value);
    toast.add({ severity: 'success', summary: 'Успішно', detail: 'Опис додано до об\'єкта', life: 3000 });
    showDescription.value = false;
};
</script>

<template>
    <div class="card flex flex-col items-center gap-4 w-full mb-4">
        <div class="font-semibold text-xl w-full flex justify-between items-center">
            <span>AI-генерація опису об'єкта</span>
            <div class="flex gap-2">
                <Button 
                    v-tooltip.bottom="'Згенерувати опис'"
                    icon="pi pi-bolt" 
                    severity="info" 
                    outlined 
                    @click="generateAIDescription"
                    :loading="isGenerating"
                    :disabled="!canGenerateDescription || isGenerating"
                />
            </div>
        </div>
        
        <div v-if="!canGenerateDescription && !showDescription" class="w-full p-4 border-round bg-blue-50 text-blue-700">
            <i class="pi pi-info-circle mr-2"></i>
            <span>Заповніть основні поля об'єкта для генерації опису (назва, площа, локація)</span>
        </div>
        
        <div v-if="!showDescription" class="w-full">
            <div class="flex flex-wrap gap-3 mb-3">
                <div class="font-semibold">Оберіть стиль опису:</div>
                <div class="flex gap-2">
                    <Button 
                        v-for="style in descriptionStyles" 
                        :key="style.value"
                        :icon="style.icon"
                        :label="style.label"
                        :outlined="selectedStyle !== style.value"
                        @click="selectedStyle = style.value"
                        :class="{ 'p-button-primary': selectedStyle === style.value }"
                        size="small"
                    />
                </div>
            </div>
        </div>
        
        <div v-if="showDescription" class="w-full">
            <Accordion :activeIndex="0">
                <AccordionTab header="Згенерований опис">
                    <div class="flex justify-end gap-2 mb-2">
                        <Button 
                            icon="pi pi-copy" 
                            label="Копіювати" 
                            severity="secondary" 
                            outlined 
                            @click="copyDescription"
                            size="small"
                        />
                        <Button 
                            icon="pi pi-check" 
                            label="Використати" 
                            severity="success" 
                            @click="useDescription"
                            size="small"
                        />
                        <Button 
                            icon="pi pi-times" 
                            label="Скасувати" 
                            severity="danger" 
                            text 
                            @click="showDescription = false"
                            size="small"
                        />
                    </div>
                    <div class="p-3 border-round bg-gray-50 prose max-w-full" v-html="generatedDescription"></div>
                </AccordionTab>
            </Accordion>
        </div>
        
        <Toast />
    </div>
</template>

<style scoped>
.prose {
    font-family: var(--font-family);
    line-height: 1.6;
}
</style> 