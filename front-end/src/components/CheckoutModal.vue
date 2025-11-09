<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-120 p-4" @click.self="$emit('close')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
      <button 
        @click="$emit('close')" 
        class="btn btn-sm btn-circle btn-ghost absolute right-4 top-4"
      >
        ✕
      </button>

      <div v-if="!processing && !success">
        <h2 class="text-3xl font-bold text-slate-800 mb-6">Confirm Order</h2>
        
        <div class="space-y-4 mb-6">
          <div class="bg-slate-50 rounded-lg p-4">
            <p class="text-sm text-slate-600 mb-1">Order Summary</p>
            <p class="text-2xl font-bold text-slate-800">{{ totalItems }} item{{ totalItems !== 1 ? 's' : '' }}</p>
          </div>

          <div class="bg-indigo-50 rounded-lg p-4">
            <p class="text-sm text-indigo-600 mb-1">Total Amount</p>
            <p class="text-3xl font-bold text-indigo-600">${{ totalAmount.toFixed(2) }}</p>
          </div>

          <div class="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="stroke-current shrink-0 w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm">Your cart will be cleared after confirming the order.</span>
          </div>
        </div>

        <div v-if="error" class="alert alert-error mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" class="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{{ error }}</span>
        </div>

        <div class="flex gap-3">
          <button @click="$emit('close')" class="btn btn-secondary flex-1">
            Cancel
          </button>
          <button @click="confirmOrder" class="btn btn-primary flex-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
            Confirm Order
          </button>
        </div>
      </div>

      <div v-else-if="processing" class="text-center py-8">
        <span class="loading loading-spinner loading-lg text-indigo-600"></span>
        <p class="text-slate-600 mt-4">Processing your order...</p>
      </div>

      <div v-else-if="success" class="text-center py-8">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-20 w-20 mx-auto text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        
        <h3 class="text-2xl font-bold text-slate-800 mb-2">Order Confirmed!</h3>
        <p class="text-slate-600 mb-2">Your order has been successfully placed.</p>
        <p class="text-lg font-semibold text-indigo-600 mb-6">Order #{{ orderId }}</p>
        
        <div class="space-y-3">
          <button @click="viewOrders" class="btn btn-primary btn-block">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            View My Orders
          </button>
          
          <button @click="continueShopping" class="btn btn-secondary btn-block">
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';
import axios from 'axios';

const props = defineProps({
  totalAmount: {
    type: Number,
    required: true
  },
  totalItems: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['close', 'orderSuccess', 'viewOrders']);

const processing = ref(false);
const success = ref(false);
const error = ref('');
const orderId = ref(null);

const confirmOrder = async () => {
  try {
    processing.value = true;
    error.value = '';
    
    const response = await axios.post('http://localhost:3000/orders', {}, {
      withCredentials: true
    });
    
    orderId.value = response.data.order_id;
    success.value = true;
    
    // Emit success event to update cart
    emit('orderSuccess');
  } catch (err) {
    console.error('Error creating order:', err);
    error.value = err.response?.data?.error || 'Failed to create order. Please try again.';
  } finally {
    processing.value = false;
  }
};

const viewOrders = () => {
  emit('viewOrders');
  emit('close');
};

const continueShopping = () => {
  emit('close');
};
</script>
