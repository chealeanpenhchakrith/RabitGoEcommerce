<template>
  <div class="bg-white shadow-lg rounded-xl p-6 mb-8">
    <h2 class="text-2xl font-bold text-slate-800 mb-4 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
      Categories
    </h2>
    <div class="flex flex-wrap gap-3">
      <button
        @click="selectCategory('All')"
        :class="[
          'btn btn-lg font-semibold transition-all duration-200',
          selectedCategory === 'All' 
            ? 'btn-primary text-white shadow-lg' 
            : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 border-slate-300'
        ]"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        All Products
      </button>
      <button
        v-for="category in categories"
        :key="category"
        @click="selectCategory(category)"
        :class="[
          'btn btn-lg font-semibold transition-all duration-200',
          selectedCategory === category 
            ? 'btn-primary text-white shadow-lg' 
            : 'bg-slate-100 text-slate-700 hover:bg-indigo-100 hover:text-indigo-700 border-slate-300'
        ]"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    required: true,
    default: () => []
  },
  modelValue: {
    type: String,
    default: 'All'
  }
});

const emit = defineEmits(['update:modelValue']);

const selectedCategory = ref(props.modelValue);

const selectCategory = (category) => {
  selectedCategory.value = category;
  emit('update:modelValue', category);
};
</script>
