import { computed } from 'vue';
import { usePropertiesStore } from '@/store/propertiesCategories';

export function useAddressFilters(filters) {
    const storeCategories = usePropertiesStore();

    const processAddressField = (field) => {
        let filteredProperties = storeCategories.properties;
        console.log("filteredProperties", filteredProperties);

        if (field === 'area' && filters?.value['address.city.code']) {
            filteredProperties = filteredProperties.filter(
                (property) => property.address?.city?.code === filters.value['address.city.code']
            );
        }

        if (field === 'city' && filters?.value['address.region.code']) {
            filteredProperties = filteredProperties.filter(
                (property) => property.address?.region?.code === filters.value['address.region.code']
            );
        }

        const values = filteredProperties
            .map((property) => property.address?.[field])
            .flat()
            .filter((value) => value && value.code);

        const uniqueMap = new Map();
        values.forEach((val) => {
            if (!uniqueMap.has(val.code)) {
                uniqueMap.set(val.code, val);
            }
        });

        return Array.from(uniqueMap.values()).sort((a, b) => a.name.localeCompare(b.name));
    };

    const region = computed(() => processAddressField('region'));
    const city = computed(() => processAddressField('city'));
    const area = computed(() => processAddressField('area'));

    return { region, city, area };
}
