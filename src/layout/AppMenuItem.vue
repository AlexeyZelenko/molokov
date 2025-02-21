<script setup>
import { useLayout } from '@/layout/composables/layout';
import { onBeforeMount, ref, watch, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const { layoutState, setActiveMenuItem, toggleMenu } = useLayout();

const props = defineProps({
    item: { type: Object, default: () => ({}) },
    index: {type: Number, default: 0},
    root: {type: Boolean, default: true},
    parentItemKey: {type: String, default: null},
    user: {
        type: Object,
        default: () => ({ role: 'guest' })
    }
});

const isActiveMenu = ref(false);
const itemKey = ref(null);

// 🔹 Фильтрация элементов по ролям
const isVisible = computed(() => {
    return !props.item.roles || props.item.roles.includes(props.user?.role);
});

onBeforeMount(() => {
    itemKey.value = props.parentItemKey ? props.parentItemKey + '-' + props.index : String(props.index);
    isActiveMenu.value = layoutState.activeMenuItem === itemKey.value;
});

watch(() => layoutState.activeMenuItem, (newVal) => {
    isActiveMenu.value = newVal === itemKey.value || newVal.startsWith(itemKey.value + '-');
});

function itemClick(event, item) {
    if (item.disabled) {
        event.preventDefault();
        return;
    }

    if ((item.to || item.url) && (layoutState.staticMenuMobileActive || layoutState.overlayMenuActive)) {
        toggleMenu();
    }

    if (item.command) {
        item.command({originalEvent: event, item: item});
    }

    setActiveMenuItem(item.items ? (isActiveMenu.value ? props.parentItemKey : itemKey) : itemKey.value);
}

function checkActiveRoute(item) {
    return route.path === item.to || route.matched.some((m) => m.path === item.to.path);
}
</script>

<template>
    <li v-if="isVisible" :class="{ 'layout-root-menuitem': root, 'active-menuitem': isActiveMenu }">
        <div v-if="root && item.visible !== false" class="layout-menuitem-root-text">{{ item.label }}</div>

        <a v-if="(!item.to || item.items) && item.visible !== false" :href="item.url"
           @click="itemClick($event, item)" :class="item.class" :target="item.target" tabindex="0">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
            <i class="pi pi-fw pi-angle-down layout-submenu-toggler" v-if="item.items"></i>
        </a>

        <router-link v-if="item?.to && !item.items && item.visible !== false"
                     @click="itemClick($event, item)"
                     :class="[item.class, { 'active-route': checkActiveRoute(item) }]"
                     tabindex="0"
                     :to="item.to">
            <i :class="item.icon" class="layout-menuitem-icon"></i>
            <span class="layout-menuitem-text">{{ item.label }}</span>
        </router-link>

        <Transition v-if="item?.items && item.visible !== false" name="layout-submenu">
            <ul v-show="root ? true : isActiveMenu" class="layout-submenu">
                <app-menu-item v-for="(child, i) in item.items"
                               :key="i"
                               :index="i"
                               :item="child"
                               :parentItemKey="itemKey"
                               :user="user"
                               :root="false">
                </app-menu-item>
            </ul>
        </Transition>
    </li>
</template>
