<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold text-slate-800">My Orders</h1>
        <button @click="$emit('navigate', 'products')" class="btn btn-secondary">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Continue Shopping
        </button>
      </div>

      <!-- Empty State -->
      <div v-if="orders.length === 0 && !loading" class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <h2 class="text-2xl font-bold text-slate-700 mb-2">No Orders Yet</h2>
        <p class="text-slate-500 mb-6">Start shopping to see your orders here!</p>
        <button @click="$emit('navigate', 'products')" class="btn btn-primary">
          Browse Products
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <span class="loading loading-spinner loading-lg text-slate-700"></span>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <div v-for="order in orders" :key="order.order_id" class="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <div class="bg-slate-700 text-white p-6">
            <div class="flex justify-between items-start">
              <div>
                <h3 class="text-xl font-bold mb-2">Order #{{ order.order_id }}</h3>
                <p class="text-slate-300">{{ formatDate(order.created_at) }}</p>
              </div>
              <div class="text-right">
                <p class="text-sm text-slate-300">Total Amount</p>
                <p class="text-3xl font-bold">${{ order.total_amount.toFixed(2) }}</p>
              </div>
            </div>
            <div class="mt-4">
              <span class="badge badge-success badge-lg">{{ order.status }}</span>
            </div>
          </div>

          <div class="p-6">
            <button 
              @click="toggleOrderDetails(order.order_id)"
              class="btn btn-info btn-block mb-4"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
              {{ expandedOrders[order.order_id] ? 'Hide' : 'View' }} Order Details
            </button>

            <!-- Order Items -->
            <div v-if="expandedOrders[order.order_id]" class="space-y-4">
              <div v-if="orderDetails[order.order_id]?.loading" class="text-center py-8">
                <span class="loading loading-spinner loading-md text-slate-700"></span>
              </div>

              <div v-else-if="orderDetails[order.order_id]?.items" class="space-y-3">
                <div 
                  v-for="item in orderDetails[order.order_id].items" 
                  :key="item.order_item_id"
                  class="flex justify-between items-center p-4 bg-slate-200 rounded-lg"
                >
                  <div class="flex-1">
                    <h4 class="font-semibold text-slate-800">{{ item.product_name }}</h4>
                    <p class="text-sm text-slate-600">Quantity: {{ item.product_quantity }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-bold text-slate-800">${{ (item.product_price * item.product_quantity).toFixed(2) }}</p>
                    <p class="text-sm text-slate-500">${{ item.product_price.toFixed(2) }} each</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, defineEmits } from 'vue';
import axios from 'axios';

const emit = defineEmits(['navigate']);

const orders = ref([]);
const loading = ref(true);
const expandedOrders = ref({});
const orderDetails = ref({});

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

const toggleOrderDetails = async (orderId) => {
  expandedOrders.value[orderId] = !expandedOrders.value[orderId];
  
  if (expandedOrders.value[orderId] && !orderDetails.value[orderId]) {
    try {
      orderDetails.value[orderId] = { loading: true };
      const response = await axios.get(`http://localhost:3000/orders/${orderId}`, {
        withCredentials: true
      });
      orderDetails.value[orderId] = response.data;
    } catch (error) {
      console.error('Error fetching order details:', error);
      expandedOrders.value[orderId] = false;
    }
  }
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

onMounted(() => {
  fetchOrders();
});
</script>
