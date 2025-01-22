<script setup>
import { useLayout } from '@/layout/composables/layout';

const { toggleFilters } = useLayout();
</script>

<template>
    <div class="layout-topbar mt-20">
        <div class="layout-topbar-logo-container">
            <button class="layout-menu-button layout-topbar-action" @click="toggleFilters">
                <i class="pi pi-filter"></i>
            </button>
        </div>
    </div>
</template>
