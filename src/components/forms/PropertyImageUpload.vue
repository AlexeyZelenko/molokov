<template>
    <div class="field col-12">
        <label>Фотографії</label>
        <div class="field col-12">
            <FileUpload
                name="advanced"
                @uploader="onUpload"
                :multiple="true"
                accept="image/*"
                :maxFileSize="10000000"
                customUpload
                chooseLabel="Обрати"
                uploadLabel="Завантажити"
                cancelLabel="Скасувати"
            >
                <template #empty>
                    <span>Перетягніть файли сюди, щоб завантажити.</span>
                </template>
            </FileUpload>

            <div v-if="images?.length" class="flex flex-wrap">
                <div
                    v-for="(imageUrl, index) in images"
                    :key="imageUrl"
                    class="col-3 relative m-4"
                >
                    <img
                        :src="imageUrl"
                        class="w-full h-auto object-cover"
                        style="height: 100px; width: 100px"
                    />
                    <Button
                        icon="pi pi-trash"
                        class="absolute top-0 right-0 p-button-danger p-button-rounded"
                        @click="$emit('remove', imageUrl)"
                        style="margin-top: -25px"
                    />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    images: {
        type: Array,
        default: () => []
    }
});

const emit = defineEmits(['upload', 'remove']);

const onUpload = (event) => {
    emit('upload', event.files);
};
</script>
