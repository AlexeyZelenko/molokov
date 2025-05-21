<script>
import { client } from '@/services/contentful';

export default {
    data() {
        return {
            title: 'Мой блог',
            blogPosts: [],
            error: null
        };
    },
    mounted() {
        this.fetchBlogPosts();
    },
    methods: {
        async fetchBlogPosts() {
            try {
                const response = await client.getEntries({
                    content_type: 'blogPost', // ID вашего Content Type для блог-постов
                    order: '-sys.createdAt' // Необязательно: сортировка по дате создания (самые новые сверху)
                    // limit: 10, // Необязательно: ограничить количество записей
                    // 'fields.category': 'vuejs' // Необязательно: фильтрация по полю
                });
                this.blogPosts = response.items;
                console.log('Записи из Contentful:', this.blogPosts);
            } catch (error) {
                console.error('Ошибка при получении записей из Contentful:', error);
                this.error = error.message || 'Не удалось загрузить блог-посты.';
            }
        }
    }
};
</script>

<template>
    <div>
        <h1>{{ title }}</h1>
        <div v-for="post in blogPosts" :key="post.sys.id">
            <h2>{{ post.fields.title }}</h2>
            <p>{{ post.fields.excerpt }}</p>
        </div>
    </div>
</template>
