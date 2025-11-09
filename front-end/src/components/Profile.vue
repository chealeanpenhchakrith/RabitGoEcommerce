<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-4xl mx-auto">
      <h1 class="text-4xl font-bold text-slate-800 mb-8">My Profile</h1>

      <div class="grid gap-6">
        <!-- User Information Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="flex items-center gap-6 mb-8">
            <div class="w-24 h-24 rounded-full bg-linear-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white text-4xl font-bold">
              {{ user?.username?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h2 class="text-3xl font-bold text-slate-800">{{ user?.username }}</h2>
              <p class="text-slate-600">{{ user?.email }}</p>
              <span class="badge badge-success mt-2">Active Account</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="grid grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Username</label>
              <input 
                type="text" 
                :value="user?.username" 
                disabled
                class="input input-bordered w-full bg-slate-100 text-slate-800"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
              <input 
                type="email" 
                :value="user?.email" 
                disabled
                class="input input-bordered w-full bg-slate-100 text-slate-800"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">Client ID</label>
              <input 
                type="text" 
                :value="user?.user_id" 
                disabled
                class="input input-bordered w-full bg-slate-100 text-slate-800 font-mono"
              />
            </div>
          </div>
        </div>

        <!-- Account Statistics Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-2xl font-bold text-slate-800 mb-6">Account Statistics</h3>
          
          <div v-if="loading" class="text-center py-8">
            <span class="loading loading-spinner loading-lg text-indigo-600"></span>
          </div>

          <div v-else class="grid grid-cols-2 gap-6">
            <div class="text-center p-6 bg-linear-to-br from-indigo-50 to-purple-50 rounded-lg">
              <div class="text-4xl font-bold text-indigo-600 mb-2">{{ cartCount }}</div>
              <div class="text-slate-600">Items in Cart</div>
            </div>

            <div class="text-center p-6 bg-linear-to-br from-green-50 to-emerald-50 rounded-lg">
              <div class="text-4xl font-bold text-green-600 mb-2">{{ totalOrders }}</div>
              <div class="text-slate-600">Total Orders</div>
            </div>

            <div class="col-span-2 text-center p-6 bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg">
              <div class="text-4xl font-bold text-blue-600 mb-2">${{ totalSpent.toFixed(2) }}</div>
              <div class="text-slate-600">Total Spent</div>
            </div>
          </div>
        </div>

        <!-- Quick Actions Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-2xl font-bold text-slate-800 mb-6">Quick Actions</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <button @click="$emit('openCart')" class="btn btn-primary btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              View Cart ({{ cartCount }})
            </button>

            <button @click="$emit('navigate', 'products')" class="btn btn-secondary btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Continue Shopping
            </button>

            <button @click="$emit('navigate', 'orders')" class="btn btn-info btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Order History
            </button>

            <button @click="$emit('logout')" class="btn btn-error btn-lg">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>

        <!-- Security Card -->
        <div class="bg-white rounded-xl shadow-lg p-8">
          <h3 class="text-2xl font-bold text-slate-800 mb-6">Security & Privacy</h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <div>
                  <div class="font-semibold text-slate-800">Password Protected</div>
                  <div class="text-sm text-slate-600">Your account is secured with encrypted password</div>
                </div>
              </div>
              <span class="badge badge-success">Active</span>
            </div>

            <div class="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div class="flex items-center gap-3">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <div class="font-semibold text-slate-800">Session Active</div>
                  <div class="text-sm text-slate-600">Your session will expire in 24 hours</div>
                </div>
              </div>
              <span class="badge badge-info">24h</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed, ref, onMounted } from 'vue';
import axios from 'axios';

const props = defineProps({
  user: {
    type: Object,
    required: true
  },
  cartCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['navigate', 'openCart', 'logout']);

const orders = ref([]);
const loading = ref(true);

const fetchOrders = async () => {
  try {
    loading.value = true;
    const response = await axios.get('http://localhost:3000/orders', {
      withCredentials: true
    });
    orders.value = response.data;
  } catch (error) {
    console.error('Error fetching orders:', error);
  } finally {
    loading.value = false;
  }
};

const totalOrders = computed(() => {
  return orders.value.length;
});

const totalSpent = computed(() => {
  return orders.value.reduce((sum, order) => sum + order.total_amount, 0);
});

onMounted(() => {
  fetchOrders();
});
</script>
