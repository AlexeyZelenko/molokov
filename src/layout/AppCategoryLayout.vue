<script setup>
import AppFooter from './AppFooter.vue';
import AppCategoriesMenu from './properties/Menu.vue';
import AppTopbar from './AppTopbar.vue';
import { computed, ref, watch } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import AppSidebar from '@/layout/AppSidebar.vue';
import Breadcrumb from '@/components/Breadcrumb.vue';
import { usePropertiesStore } from '@/store/propertiesCategories';

const { layoutConfig, layoutState, isSidebarActive } = useLayout();
const isFiltersActive = ref(false);
const outsideClickListener = ref(null);
const filtersOutsideClickListener = ref(null);

const componentStore = usePropertiesStore();
const filtersLength = computed(() => {
    const length = Object.keys(componentStore.filters).length;
    return length > 0 ? String(length) : null;
});

watch(isSidebarActive, (newVal) => {
    if (newVal) {
        bindOutsideClickListener();
    } else {
        unbindOutsideClickListener();
    }
});

const containerClass = computed(() => {
    return {
        'layout-overlay': layoutConfig.menuMode === 'overlay',
        'layout-static': layoutConfig.menuMode === 'static',
        'layout-static-inactive': layoutState.staticMenuDesktopInactive && layoutConfig.menuMode === 'static',
        'layout-overlay-active': layoutState.overlayMenuActive,
        'layout-mobile-active': layoutState.staticMenuMobileActive,
        'filters-active': isFiltersActive.value
    };
});

function bindOutsideClickListener() {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                layoutState.overlayMenuActive = false;
                layoutState.staticMenuMobileActive = false;
                layoutState.menuHoverActive = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
}

function unbindOutsideClickListener() {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener);
        outsideClickListener.value = null;
    }
}

function isOutsideClicked(event) {
    const sidebarEl = document.querySelector('.layout-sidebar');
    const topbarEl = document.querySelector('.layout-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
}

// Следим за фильтрами
watch(isFiltersActive, (newVal) => {
    if (newVal) {
        bindFiltersOutsideClickListener();
    } else {
        unbindFiltersOutsideClickListener();
    }
});

function unbindFiltersOutsideClickListener() {
    if (filtersOutsideClickListener.value) {
        document.removeEventListener('click', filtersOutsideClickListener.value);
        filtersOutsideClickListener.value = null;
    }
}
function isFiltersOutsideClicked(event) {
    const filtersEl = document.querySelector('.filters-sidebar');
    const filtersButtonEl = document.querySelector('.filters-button');
    const filtersContentEl = document.querySelector('.filters-sidebar *');

    // Проверяем, был ли клик внутри контента фильтров
    if (event.target.closest('.filters-sidebar')) {
        return false;
    }

    return !(filtersEl.isSameNode(event.target) || filtersEl.contains(event.target) || filtersButtonEl.isSameNode(event.target) || filtersButtonEl.contains(event.target));
}

function toggleFilters() {
    isFiltersActive.value = !isFiltersActive.value;
}

// Обработчики для фильтров
function bindFiltersOutsideClickListener() {
    if (!filtersOutsideClickListener.value) {
        filtersOutsideClickListener.value = (event) => {
            const filtersSidebar = document.querySelector('.filters-sidebar');
            const filtersButton = document.querySelector('.filters-button');

            // Если клик внутри фильтров - игнорируем
            if (filtersSidebar) {
                return;
            }

            // Если клик по кнопке фильтров - игнорируем
            if (filtersButton && filtersButton.contains(event.target)) {
                return;
            }

            // В остальных случаях закрываем
            isFiltersActive.value = false;
        };
        document.addEventListener('click', filtersOutsideClickListener.value);
    }
}

function closeFilters() {
    isFiltersActive.value = false;
}

function handleSidebarClick(event) {
    event.stopPropagation();
}
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <app-sidebar></app-sidebar>
        <Button
            label="ФІЛЬТРИ"
            raised icon="pi pi-filter"
            :badge="filtersLength"
            class="filters-button p-button"
            @click="toggleFilters"
        />

        <div class="layout-main-container">
            <div class="layout-main">
                <div class="filters-sidebar animate-fadein p-shadow-2 p-sidebar-right" :class="{ active: isFiltersActive }" @click.stop="handleSidebarClick" role="complementary" aria-label="Фільтри" :inert="!isFiltersActive">
                    <slot name="filters">
                        <app-categories-menu
                            @close-filters="closeFilters"
                        ></app-categories-menu>
                    </slot>
                </div>
                <Breadcrumb />
                <router-view></router-view>
            </div>            
        </div>        
    </div>
</template>

<style scoped>
.filters-button {
    position: fixed;
    right: 5px;
    top: 100px;
    z-index: 999;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.filters-sidebar {
    position: fixed;
    right: -300px;
    top: 0;
    width: 300px;
    height: 100%;
    background: var(--surface-overlay); /* используем переменную темы */
    box-shadow:
        0 2px 4px -1px rgba(0, 0, 0, 0.2),
        0 4px 5px 0 rgba(0, 0, 0, 0.14),
        0 1px 10px 0 rgba(0, 0, 0, 0.12);
    transition: right 0.3s ease;
    z-index: 1000;
    padding: 1rem;
}

.filters-sidebar.active {
    right: 0;
    height: 100vh;
    overflow: auto;
}

/* Затемнение фона при открытых фильтрах */
.filters-active .layout-mask {
    display: block;
    background-color: rgba(0, 0, 0, 0.4);
}

/* Добавляем стили для скроллбара в темной теме */
.dark .filters-sidebar::-webkit-scrollbar {
    width: 10px;
}

.dark .filters-sidebar::-webkit-scrollbar-track {
    background: var(--surface-ground);
}

.dark .filters-sidebar::-webkit-scrollbar-thumb {
    background: var(--surface-section);
    border-radius: 5px;
}
</style>
