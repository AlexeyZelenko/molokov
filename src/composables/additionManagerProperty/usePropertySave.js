import { computed, ref } from 'vue';
import { useToast } from 'primevue/usetoast';

export function usePropertySave({
                                    property,
                                    isEditMode,
                                    validateAllForms,
                                    propertyManager,
                                    updateProperty,
                                    id,
                                    category,
                                    subcategory,
                                    router
                                }) {
    const toast = useToast();

    const saving = ref(false);

    const savedProperty = ref(false);

    const formattedDescription = computed(() => {
        return property.value.description
            .replace(/\n/g, '<br>')
            .replace(/ {2,}/g, match => '&nbsp;'.repeat(match.length));
    });

    // eslint-disable-next-line vue/return-in-computed-property
    const formattedCity = computed(() => {
        return {
            ...property.value.address.city,
            name: property.value.address.city.Description,
            code: property.value.address.city.Ref,
        }

    });

    const saveProperty = async () => {
        saving.value = true;
        try {
            const isValid = await validateAllForms();
            if (!isValid) {
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: 'Перевірте форму на помилки',
                    life: 5000
                });
                return;
            }

            const propertyData = {
                ...property.value,
                address: {
                    ...property.value.address,
                    city: formattedCity.value
                },
                description: formattedDescription.value,
                updatedAt: new Date()
            };

            if (isEditMode.value) {
                await updateProperty(id, category.code, subcategory.code, propertyData);
                savedProperty.value = true;
            } else {
                await propertyManager.saveProperty();
                savedProperty.value = true;
            }

            toast.add({
                severity: 'success',
                summary: 'Оголошення збережено',
                detail: 'Оберіть дію для продовження',
                group: 'property-action',
                life: 10000
            });

        } catch (error) {
            savedProperty.value = false;
            console.error("Помилка при збереженні об'єкту:", error);
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: "Помилка збереження об'єкту",
                life: 3000
            });
            throw error;
        } finally {
            saving.value = false;
        }
    };

    const onViewProperty = () => {
        toast.removeGroup('property-action');
        router.push({ path: `/categories/${category.code}/${subcategory.code}` });
    };

    const useResetForm = (emptyProperty) => {
        const propertyType = `${property.value.category.code}-${property.value.subcategory.code}`;
        propertyManager.resetForm(propertyType);
        property.value = { ...emptyProperty };
        savedProperty.value = false;
        toast.removeGroup('property-action');

        window.scroll(0, 0);

        toast.add({
            severity: 'info',
            summary: 'Нове оголошення',
            detail: 'Форма очищена для створення нового оголошення',
            life: 3000
        });

        return false;
    };

    return {
        saving,
        saveProperty,
        onViewProperty,
        useResetForm,
        savedProperty
    };
}
