export function usePropertyValidation(forms) {
    const validateAllForms = async () => {
        const validations = await Promise.all(
            Object.values(forms).map(form => form.value?.validate?.())
        );

        return validations
            .filter(v => v !== undefined)
            .every(v => v === true);
    };

    const handleValidation = (formName, isValid) => {
        forms.validations.value[formName] = isValid;
    };

    return {
        validateAllForms,
        handleValidation
    };
}
