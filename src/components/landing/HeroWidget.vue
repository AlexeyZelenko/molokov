<script setup lang="ts">
import HomeSearch from '@/components/forms/BlockSearchHomePage.vue';
</script>

<template>
    <div class="relative">
      <div id="hero" class="flex flex-col z-0 relative">
        <div class="hero-container flex flex-col items-center justify-start text-center pb-96">
          <h1 class="text-4xl font-bold leading-tight md:text-6xl p-2">
            <span class="font-light block text-white sm-4 md:text-6xl">Сучасний інструмент для рієлторів!</span>
            <span class="text-3xl font-light block text-white mb-4 md:text-5xl mt-4">Легко знаходьте та керуйте об'єктами!</span>
          </h1>
          <p class="font-normal text-2xl leading-normal md:mt-4 text-gray-50 p-2">
            Ефективний пошук, управління та угоди в одному місці...
          </p>
        </div>
      </div>  
      
      <div class="hero-search-container absolute left-1/2 transform -translate-x-1/2 -bottom-50 z-7 w-full">
        <HomeSearch />
      </div>
    </div>
  </template>
  

  <style scoped lang="scss">
  #hero {    
    
  
    .text-6xl {
      font-size: 36px;
    }
  
    .text-2xl {
      font-size: 20px;
    }
  }
  
  .hero-search-container {
    padding: 0 important;
    // чтобы HomeSearch красиво "выплыл"
    margin-top: 10px;

    @media (max-width: 768px) {
      margin-top: -320px;
    }   
  }
  </style>
  
