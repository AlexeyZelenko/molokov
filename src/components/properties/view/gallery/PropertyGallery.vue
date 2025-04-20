<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { galleriaResponsiveOptions } from './constants';

defineProps({
    images: {
        type: Array,
        required: true
    }
});

const responsiveOptions = ref(galleriaResponsiveOptions);

const galleria = ref();
const activeIndex = ref(0);
const showThumbnails = ref(false);
const fullScreen = ref(false);
const isAutoPlay = ref(true);

const toggleAutoSlide = () => {
    isAutoPlay.value  = !isAutoPlay.value ;
};
const onThumbnailButtonClick = () => {
    showThumbnails.value  = !showThumbnails.value ;
};

const toggleFullScreen = () => {
    if (fullScreen.value ) {
        closeFullScreen();
    } else {
        openFullScreen();
    }
};
const onFullScreenChange = () => {
    fullScreen.value  = !fullScreen.value ;
};
const openFullScreen = () => {
  try {
    let elem = galleria.value.$el;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else {
      console.warn('Fullscreen API is not supported in this browser.');
      // Optionally show a message to the user
    }
  } catch (error) {
    console.error('Error entering fullscreen:', error);
    // Optionally handle the error (e.g., show a message)
  }
};
const closeFullScreen = () => {
  try {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else {
      console.warn('Fullscreen API is not supported in this browser.');
    }
  } catch (error) {
    console.error('Error exiting fullscreen:', error);
  }
};
const bindDocumentListeners = () => {
    document.addEventListener('fullscreenchange', onFullScreenChange);
    document.addEventListener('mozfullscreenchange', onFullScreenChange);
    document.addEventListener('webkitfullscreenchange', onFullScreenChange);
    document.addEventListener('msfullscreenchange', onFullScreenChange);
};
const unbindDocumentListeners = () => {
    document.removeEventListener('fullscreenchange', onFullScreenChange);
    document.removeEventListener('mozfullscreenchange', onFullScreenChange);
    document.removeEventListener('webkitfullscreenchange', onFullScreenChange);
    document.removeEventListener('msfullscreenchange', onFullScreenChange);
};

const fullScreenIcon = computed(() => {
    return `pi ${fullScreen.value ? 'pi-window-minimize' : 'pi-window-maximize'}`;
});
const slideButtonIcon = computed(() => {
    return `pi ${isAutoPlay.value ? 'pi-pause' : 'pi-play'}`;
});

// Image loading handling
const onImageLoad = (image) => {
  // Mark image as loaded immediately when it's actually loaded
  image.loaded = true;
};
const isLoading = ref(false);

// Handle active image change
const onActiveIndexChange = (index) => {
  activeIndex.value = index;
  isLoading.value = true;
  
  // Reset loading state after a short delay
  setTimeout(() => {
    isLoading.value = false;
  }, 300);
};

onMounted(() => {    
    bindDocumentListeners();
});
</script>

<template>
    <div class="shadow-lg">
        <Galleria
            ref="galleria"
            v-model:activeIndex="activeIndex"
            :value="images"
            :responsiveOptions="responsiveOptions"
            :numVisible="5"
            containerStyle="max-width: 760px; border: none; height: 100%"
            :showItemNavigators="true"
            :showItemNavigatorsOnHover="false"
            :showThumbnails="showThumbnails"
            :circular="true"
            :previewIcon="'pi pi-search'"
            :zoomInDisabled="true"
            :zoomOutDisabled="true"
            :autoPlay="isAutoPlay"
            :transitionInterval="3000"
            :changeItemOnIndicatorHover="true"
            @active-index-change="onActiveIndexChange"                                         
            :pt="{
                root: {
                    class: [{ 'flex flex-col': fullScreen }]
                },
                content: {
                    class: ['relative', { 'flex-1 justify-center': fullScreen }]
                },
                thumbnails: 'absolute w-full left-0 bottom-0',
                indicator: 'absolute w-full left-0 bottom-0'                
            }"
        >       
            <template #item="slotProps">                
                <div class="relative w-full h-full">
                <!-- Loading indicator -->
                <div v-if="!slotProps.item.loaded || isLoading" class="w-full h-full absolute inset-0 flex items-center justify-center bg-black/30 z-1">
                    <i class="pi pi-spin pi-spinner text-3xl text-white"></i>
                </div>
                
                <!-- Image -->
                <img
                    @load="onImageLoad(slotProps.item)"
                    :src="slotProps.item.url || slotProps.item"
                    :alt="slotProps.item.title || 'Gallery image'"
                    :style="{ 
                    width: !fullScreen ? '100%' : '',
                    height: fullScreen ? '100%' : '400px',                    
                    display: !slotProps.item.loaded && isLoading ? 'none' : 'block' 
                    }"
                    class="galleria-item-image mx-auto"
                />
        </div>
            </template>
            <template #thumbnail="slotProps">
                <div class="grid gap-1 justify-center transition duration-300 cursor-pointer hover:opacity-70 mx-1">
                    <img
                        :src="slotProps.item.url || slotProps.item"
                        :alt="slotProps.item.title"
                        width="100" style="display: block; height: 60px; object-fit: cover; border-radius: 5px; border: 1px solid #ccc;" />
                </div>
            </template>
            <template #footer>
                <div class="flex items-stretch bg-black text-white h-10">
                    <button v-tooltip="'Показати всі зображення'" type="button" @click="onThumbnailButtonClick" class="bg-transparent border-none rounded-none hover:bg-white/10 text-white inline-flex justify-center items-center cursor-pointer px-3">                        
                        <i class="pi pi-th-large"></i>
                    </button>
                    <button v-tooltip="'Автоматична прокрутка'" type="button" @click="toggleAutoSlide" class="bg-transparent border-none rounded-none hover:bg-white/10 text-white inline-flex justify-center items-center cursor-pointer px-3"><i :class="slideButtonIcon"></i></button>
                    <span v-tooltip="'Поточне зображення'" v-if="images" class="flex items-center gap-4 ml-3">
                        <span class="text-sm">{{ activeIndex + 1 }}/{{ images.length }}</span>
                        <span class="font-bold text-sm">{{ images[activeIndex].title }}</span>
                        <span class="text-sm">{{ images[activeIndex].alt }}</span>
                    </span>
                    <button type="button" @click="toggleFullScreen" class="bg-transparent border-none rounded-none hover:bg-white/10 text-white inline-flex justify-center items-center cursor-pointer px-3 ml-auto">
                        <span v-if="!fullScreen">ПОВНИЙ ЕКРАН</span>
                        <span v-else>ЗМЕНШИТИ ЕКРАН</span>
                        <i :class="fullScreenIcon" class="ml-2"></i>
                    </button>
                </div>
            </template>            
        </Galleria>        
    </div>
</template>

<style scoped>
.galleria-item-image {
  object-fit: cover;
  /* height: 300px;  */
  /* max-height: 100%; */
}
:deep(.p-galleria-thumbnails-content) {
    display: flex;
    flex-direction: row;
    background: rgba(69, 69, 69, 0.5);    
}

:deep(.p-galleria-nav-button) {
    color: white;
    background: rgba(69, 69, 69, 0.5);
    
    &:hover {
        background: rgba(69, 69, 69, 0.7);
    }
    
}

:deep(.p-galleria-nav-button) {
  color: white;
  background: rgba(69, 69, 69, 0.5);
  border-radius: 50%;
  margin: 0 0.5rem;
  z-index: 10;
}

:deep(.p-galleria-nav-button:hover) {
  background: rgba(69, 69, 69, 0.7);
}

:deep(.p-galleria-item-wrapper) {
  position: relative;
}
</style>