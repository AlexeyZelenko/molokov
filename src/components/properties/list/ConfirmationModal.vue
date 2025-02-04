<template>
    <ConfirmDialog
            :breakpoints="{'960px': '75vw', '640px': '100vw'}"
            :style="{ width: '450px' }"
        >
            <template #message="slotProps">
                <div class="flex flex-column align-items-center p-3">
                    <i
                        :class="slotProps.message.icon"
                        class="text-6xl text-primary mr-2 pt-4"
                    ></i>
                    <h4 class="text-xl font-bold mb-3 p-2">
                        {{ slotProps.message.header }}
                    </h4>
                    <p class="text-center p-2">
                        {{ slotProps.message.message }}
                    </p>
                </div>
            </template>
        </ConfirmDialog>
</template>

<script>
import ConfirmDialog from "primevue/confirmdialog";
import {useConfirm} from "primevue/useconfirm";
</script>
