// composables/useErrorHandler.js
import { useToast } from 'primevue/usetoast';

export function useErrorHandler() {
    const toast = useToast();

    const handleError = (error) => {
        console.error('Component loading error:', error);

        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load component',
            life: 3000
        });
    };

    return {
        handleError
    };
}
