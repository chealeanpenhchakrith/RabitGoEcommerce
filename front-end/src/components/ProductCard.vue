<template>
  <div class="bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-7xl mx-auto">
      <h1 class="text-4xl font-bold text-center mb-8 text-slate-800">
        Our Products
      </h1>
      
      <CategoryFilter 
        v-if="categories.length > 0"
        :categories="categories"
        v-model="selectedCategory"
      />

      <div v-if="searchQuery" class="mb-4 text-center">
        <p class="text-lg text-slate-600">
          Search results for: <span class="font-semibold text-indigo-600">"{{ searchQuery }}"</span>
          <span class="ml-2 text-slate-500">({{ filteredProducts.length }} {{ filteredProducts.length === 1 ? 'product' : 'products' }} found)</span>
        </p>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <div
          v-for="product in filteredProducts"
          :key="product.product_id"
          class="group relative bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden"
        >
          <div class="relative h-64 bg-linear-to-br from-blue-100 to-purple-100 overflow-hidden">
            <div class="absolute inset-0 flex items-center justify-center">
              <img 
                :src="`http://localhost:3000/image/${product.product_id}`"
                :alt="product.product_name"
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                @error="handleImageError"
              />
            </div>
            <div class="absolute top-3 left-3">
              <span class="badge badge-primary badge-lg">
                {{ product.product_category }}
              </span>
            </div>
          </div>

          <div class="p-6">
            <h2 class="text-xl font-semibold text-slate-800 mb-2 line-clamp-2 min-h-14">
              {{ product.product_name }}
            </h2>
            
            <div class="flex items-center justify-between mb-4">
              <span class="text-3xl font-bold text-primary">
                ${{ product.product_price.toFixed(2) }}
              </span>
            </div>

            <button 
              @click="addToCart(product)"
              class="btn btn-primary w-full group-hover:btn-accent transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      <div v-if="!data" class="flex justify-center items-center min-h-[400px]">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="filteredProducts.length === 0" class="text-center py-12">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-xl text-slate-500">
          {{ searchQuery ? `No products found for "${searchQuery}"` : 'No products available' }}
        </p>
        <p class="text-slate-400 mt-2">Try adjusting your search or filters</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted, defineEmits, computed, defineProps } from "vue";
import CategoryFilter from "./CategoryFilter.vue";

const props = defineProps({
  searchQuery: {
    type: String,
    default: ''
  }
});

const data = ref(null);
const selectedCategory = ref('All');
const emit = defineEmits(['productAdded']);

const categories = computed(() => {
  if (!data.value) return [];
  const uniqueCategories = [...new Set(data.value.map(p => p.product_category))];
  return uniqueCategories;
});

const filteredProducts = computed(() => {
  if (!data.value) return [];
  
  let products = data.value;
  
  if (selectedCategory.value !== 'All') {
    products = products.filter(p => p.product_category === selectedCategory.value);
  }
  
  if (props.searchQuery && props.searchQuery.trim()) {
    const query = props.searchQuery.toLowerCase();
    products = products.filter(p => 
      p.product_name.toLowerCase().includes(query) ||
      p.product_category.toLowerCase().includes(query)
    );
  }
  
  return products;
});

onMounted(() => {
  axios
    .get("http://localhost:3000/product/")
    .then((response) => {
      data.value = response.data;
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
    });
});

const addToCart = (product) => {
  axios
    .post("http://localhost:3000/cart", {
      product_id: product.product_id,
      product_name: product.product_name,
      product_price: product.product_price,
      product_category: product.product_category,
      product_quantity: 1,
    })
    .then(() => {
      const toast = document.createElement('div');
      toast.className = 'alert alert-success fixed top-20 right-4 w-96 z-50 shadow-lg';
      toast.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span>${product.product_name} added to cart!</span>
      `;
      document.body.appendChild(toast);
      
      setTimeout(() => {
        toast.remove();
      }, 3000);
      
      emit('productAdded');
    })
    .catch((error) => {
      console.error("Error adding to cart:", error);
      alert("Failed to add product to cart");
    });
};

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
};
</script>
