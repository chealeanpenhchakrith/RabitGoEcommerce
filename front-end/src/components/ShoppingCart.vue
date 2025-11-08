<template>
  <div class="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4 pt-24">
    <div class="max-w-5xl mx-auto">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-4xl font-bold text-slate-800">Shopping Cart</h1>
        <button @click="$emit('close')" class="btn btn-ghost btn-circle">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div v-if="loading" class="flex justify-center items-center min-h-[400px]">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>

      <div v-else-if="!cartItems || cartItems.length === 0" class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 mx-auto text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-2xl font-semibold text-slate-600 mb-2">Your cart is empty</h2>
        <p class="text-slate-500 mb-6">Add some products to get started!</p>
        <button @click="$emit('close')" class="btn btn-primary">
          Continue Shopping
        </button>
      </div>

      <div v-else>
        <div class="space-y-4 mb-8">
          <div
            v-for="item in cartItems"
            :key="item.product_id"
            class="bg-white rounded-xl shadow-md p-6 flex items-center gap-6 hover:shadow-lg transition-shadow"
          >
            <div class="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-linear-to-br from-blue-100 to-purple-100">
              <img 
                :src="`http://localhost:3000/image/${item.product_id}`"
                :alt="item.product_name"
                class="w-full h-full object-cover"
                @error="handleImageError"
              />
            </div>

            <div class="grow">
              <h3 class="text-xl font-semibold text-slate-800 mb-1">
                {{ item.product_name }}
              </h3>
              <span class="badge badge-primary">{{ item.product_category }}</span>
              <p class="text-2xl font-bold text-primary mt-2">
                ${{ item.product_price.toFixed(2) }}
              </p>
            </div>

            <div class="flex items-center gap-3">
              <button 
                @click="updateQuantity(item, item.product_quantity - 1)"
                :disabled="item.product_quantity <= 1"
                class="btn btn-circle btn-sm btn-outline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 12H4" />
                </svg>
              </button>
              
              <input 
                type="number" 
                v-model.number="item.product_quantity"
                @change="updateQuantity(item, item.product_quantity)"
                min="1"
                class="input input-bordered w-20 text-center font-semibold"
              />
              
              <button 
                @click="updateQuantity(item, item.product_quantity + 1)"
                class="btn btn-circle btn-sm btn-outline"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
            </div>

            <div class="text-right min-w-[100px]">
              <p class="text-sm text-slate-500 mb-1">Subtotal</p>
              <p class="text-2xl font-bold text-slate-800">
                ${{ (item.product_price * item.product_quantity).toFixed(2) }}
              </p>
            </div>

            <button 
              @click="removeFromCart(item.product_id)"
              class="btn btn-ghost btn-circle text-error hover:bg-error hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        <div class="bg-white rounded-xl shadow-lg p-8">
          <div class="space-y-4">
            <div class="flex justify-between items-center text-lg">
              <span class="text-slate-600">Subtotal</span>
              <span class="font-semibold text-slate-800">${{ subtotal.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-lg">
              <span class="text-slate-600">Tax (10%)</span>
              <span class="font-semibold text-slate-800">${{ tax.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between items-center text-lg">
              <span class="text-slate-600">Shipping</span>
              <span class="font-semibold text-slate-800">${{ shipping.toFixed(2) }}</span>
            </div>
            <div class="divider"></div>
            <div class="flex justify-between items-center text-2xl">
              <span class="font-bold text-slate-800">Total</span>
              <span class="font-bold text-primary">${{ total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="mt-8 flex gap-4">
            <button @click="$emit('close')" class="btn btn-outline flex-1">
              Continue Shopping
            </button>
            <button @click="checkout" class="btn btn-primary flex-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, computed, onMounted } from "vue";

const cartItems = ref([]);
const loading = ref(true);

const emit = defineEmits(['close', 'cartUpdated']);

onMounted(() => {
  fetchCartItems();
});

const fetchCartItems = async () => {
  loading.value = true;
  try {
    const response = await axios.get("http://localhost:3000/cart");
    cartItems.value = response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
  } finally {
    loading.value = false;
  }
};

const updateQuantity = async (item, newQuantity) => {
  if (newQuantity < 1) return;
  
  try {
    await axios.put(`http://localhost:3000/cart/${item.product_id}`, {
      product_quantity: newQuantity,
    });
    item.product_quantity = newQuantity;
    emit('cartUpdated');
  } catch (error) {
    console.error("Error updating quantity:", error);
    alert("Failed to update quantity");
  }
};

const removeFromCart = async (productId) => {
  if (!confirm("Are you sure you want to remove this item?")) return;
  
  try {
    await axios.delete(`http://localhost:3000/cart/${productId}`);
    cartItems.value = cartItems.value.filter(item => item.product_id !== productId);
    emit('cartUpdated');
  } catch (error) {
    console.error("Error removing from cart:", error);
    alert("Failed to remove item from cart");
  }
};

const subtotal = computed(() => {
  return cartItems.value.reduce((sum, item) => {
    return sum + (item.product_price * item.product_quantity);
  }, 0);
});

const tax = computed(() => subtotal.value * 0.1);
const shipping = computed(() => cartItems.value.length > 0 ? 5.99 : 0);
const total = computed(() => subtotal.value + tax.value + shipping.value);

const checkout = () => {
  alert(`Checkout - Total: $${total.value.toFixed(2)}\n\nThis is a demo. Payment processing not implemented.`);
};

const handleImageError = (event) => {
  event.target.src = 'https://via.placeholder.com/200x200?text=No+Image';
};
</script>
