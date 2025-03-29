import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useToast } from 'primevue/usetoast';

export function usePropertyFirestore() {
    const toast = useToast();

    const loadProperty = async (id, category, subcategory) => {
        try {
            const propertyRef = doc(db, `properties/${category}/${subcategory}`, id);
            const propertyDoc = await getDoc(propertyRef);

            if (propertyDoc.exists()) {
                return propertyDoc.data(); // Обновляем ref
            } else {
                toast.add({
                    severity: 'error',
                    summary: 'Помилка',
                    detail: 'Об\'єкт не знайдений',
                    life: 3000
                });
            }
        } catch (error) {
            console.error('Помилка при завантаженні об\'єкту:', error);
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Не вдалося завантажити об\'єкт',
                life: 3000
            });
        }
    };

    const updateProperty = async (id, category, subcategory, data) => {
        try {
            await updateDoc(doc(db, `properties/${category}/${subcategory}`, id), data);
            return true;
        } catch (error) {
            console.error('Error updating property:', error);
            toast.add({
                severity: 'error',
                summary: 'Помилка',
                detail: 'Не вдалося оновити об\'єкт',
                life: 3000
            });
            return false;
        }
    };

    return {
        loadProperty,
        updateProperty
    };
}
