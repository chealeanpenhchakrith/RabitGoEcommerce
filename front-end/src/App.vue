<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from "./components/ProductCard.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";

const showCart = ref(false);
const cartItems = ref([]);
const currentView = ref('products');
const searchQuery = ref('');

const cartCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.product_quantity, 0);
});

const fetchCartCount = async () => {
  try {
    const response = await axios.get("http://localhost:3000/cart");
    cartItems.value = response.data;
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
};

onMounted(() => {
  fetchCartCount();
});

const openCart = () => {
  showCart.value = true;
  fetchCartCount();
};

const closeCart = () => {
  showCart.value = false;
};

const handleCartUpdated = () => {
  fetchCartCount();
};

const handleProductAdded = () => {
  fetchCartCount();
};

const navigate = (view) => {
  currentView.value = view;
  searchQuery.value = ''; // Reset search when navigating
};

const handleSearch = (query) => {
  searchQuery.value = query;
  if (currentView.value !== 'products') {
    currentView.value = 'products'; // Navigate to products page when searching
  }
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <Navbar 
      :cartCount="cartCount" 
      @openCart="openCart"
      @navigate="navigate"
      @search="handleSearch"
    />
    
    <main v-if="!showCart" class="grow">
      <ProductCard 
        v-if="currentView === 'products'" 
        @productAdded="handleProductAdded"
        :searchQuery="searchQuery"
      />
      
      <div v-else-if="currentView === 'about'" class="max-w-4xl mx-auto py-16 px-4">
        <h1 class="text-4xl font-bold text-slate-800 mb-6">About Us</h1>
        <p class="text-lg text-slate-600 mb-4">Welcome to ShopHub, your one-stop e-commerce destination!</p>
        <p class="text-slate-600">We provide the best products at the best prices with exceptional customer service.</p>
      </div>
      
      <div v-else-if="currentView === 'contact'" class="max-w-4xl mx-auto py-16 px-4">
        <h1 class="text-4xl font-bold text-slate-800 mb-6">Contact Us</h1>
        <p class="text-lg text-slate-600 mb-4">Get in touch with us for any questions or concerns.</p>
        <div class="space-y-4 mt-8">
          <div class="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            <span class="text-slate-700">contact@shophub.com</span>
          </div>
          <div class="flex items-center gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span class="text-slate-700">+1 (555) 123-4567</span>
          </div>
        </div>
      </div>
    </main>

    <Footer v-if="!showCart" class="mt-auto" />

    <div v-if="showCart" class="fixed inset-0 bg-black bg-opacity-50 z-40 overflow-y-auto">
      <ShoppingCart 
        @close="closeCart"
        @cartUpdated="handleCartUpdated"
      />
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
