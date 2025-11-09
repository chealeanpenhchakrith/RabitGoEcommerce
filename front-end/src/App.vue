<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import ProductCard from "./components/ProductCard.vue";
import ShoppingCart from "./components/ShoppingCart.vue";
import Navbar from "./components/Navbar.vue";
import Footer from "./components/Footer.vue";
import LoginModal from "./components/LoginModal.vue";
import Profile from "./components/Profile.vue";
import Orders from "./components/Orders.vue";

// Configure axios to send cookies
axios.defaults.withCredentials = true;

const showCart = ref(false);
const showLogin = ref(false);
const cartItems = ref([]);
const currentView = ref('products');
const searchQuery = ref('');
const user = ref(null);

const cartCount = computed(() => {
  return cartItems.value.reduce((sum, item) => sum + item.product_quantity, 0);
});

// Check if user is authenticated
const checkAuth = async () => {
  try {
    const response = await axios.get("http://localhost:3000/auth/me");
    user.value = response.data.user;
    fetchCartCount();
  } catch (error) {
    user.value = null;
    console.log("User not authenticated");
  }
};

const fetchCartCount = async () => {
  if (!user.value) return;
  
  try {
    const response = await axios.get("http://localhost:3000/cart");
    cartItems.value = response.data;
  } catch (error) {
    console.error("Error fetching cart count:", error);
  }
};

onMounted(() => {
  checkAuth();
});

const openCart = () => {
  if (!user.value) {
    showLogin.value = true;
    return;
  }
  showCart.value = true;
  fetchCartCount();
};

const closeCart = () => {
  showCart.value = false;
};

const openLogin = () => {
  showLogin.value = true;
};

const closeLogin = () => {
  showLogin.value = false;
};

const handleLoginSuccess = (userData) => {
  user.value = userData;
  fetchCartCount();
};

const handleLogout = async () => {
  try {
    await axios.post("http://localhost:3000/auth/logout");
    user.value = null;
    cartItems.value = [];
    currentView.value = 'products';
  } catch (error) {
    console.error("Error logging out:", error);
  }
};

const handleCartUpdated = () => {
  fetchCartCount();
};

const handleProductAdded = () => {
  if (!user.value) {
    showLogin.value = true;
    return;
  }
  fetchCartCount();
};

const navigate = (view) => {
  currentView.value = view;
  searchQuery.value = ''; // Reset search when navigating
  showCart.value = false; // Close cart when navigating
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
};

const handleSearch = (query) => {
  searchQuery.value = query;
  if (currentView.value !== 'products') {
    currentView.value = 'products'; // Navigate to products page when searching
  }
  showCart.value = false; // Close cart when searching
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
};

const handleViewOrders = () => {
  currentView.value = 'orders';
  showCart.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' }); // Scroll to top
};
</script>

<template>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <Navbar 
      :cartCount="cartCount" 
      :user="user"
      @openCart="openCart"
      @navigate="navigate"
      @search="handleSearch"
      @openLogin="openLogin"
      @logout="handleLogout"
    />
    
    <main v-if="!showCart" class="grow">
      <ProductCard 
        v-if="currentView === 'products'" 
        @productAdded="handleProductAdded"
        :searchQuery="searchQuery"
        :isAuthenticated="!!user"
      />

      <Profile
        v-else-if="currentView === 'profile'"
        :user="user"
        :cartCount="cartCount"
        @navigate="navigate"
        @openCart="openCart"
        @logout="handleLogout"
      />

      <Orders
        v-else-if="currentView === 'orders'"
        @navigate="navigate"
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

    <main v-else class="grow">
      <ShoppingCart 
        @close="closeCart"
        @cartUpdated="handleCartUpdated"
        @viewOrders="handleViewOrders"
      />
    </main>

    <Footer v-if="!showCart" class="mt-auto" />

    <LoginModal 
      v-if="showLogin"
      @close="closeLogin"
      @login-success="handleLoginSuccess"
    />
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
