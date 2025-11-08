<template>
  <nav class="navbar bg-linear-to-r from-indigo-600 to-purple-600 shadow-lg sticky top-0 z-50 px-4">
    <div class="navbar-start">
      <div class="dropdown">
        <div tabindex="0" role="button" class="btn btn-ghost btn-lg lg:hidden text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-white rounded-box w-52">
          <li><a @click="$emit('navigate', 'products')" class="text-slate-700 hover:bg-indigo-100 py-3">Products</a></li>
          <li><a @click="$emit('navigate', 'about')" class="text-slate-700 hover:bg-indigo-100 py-3">About</a></li>
          <li><a @click="$emit('navigate', 'contact')" class="text-slate-700 hover:bg-indigo-100 py-3">Contact</a></li>
        </ul>
      </div>
      <a @click="$emit('navigate', 'products')" class="btn btn-ghost text-2xl font-bold text-white hover:bg-white/10 px-4 py-3 h-auto">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        ShopHub
      </a>
    </div>
    
    <div class="navbar-center hidden lg:flex items-center gap-4">
      <div class="form-control">
        <div class="relative">
          <input 
            type="text" 
            v-model="searchQuery"
            @input="handleSearchInput"
            @keyup.enter="handleSearch"
            placeholder="Search products..." 
            class="input input-bordered bg-white/20 text-white placeholder-white/70 border-white/30 focus:bg-white/30 w-64 pr-10" 
          />
          <button 
            @click="handleSearch"
            class="absolute right-2 top-1/2 -translate-y-1/2 text-white hover:text-white/80"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>
      </div>
      
      <ul class="menu menu-horizontal px-1">
        <li><a @click="$emit('navigate', 'products')" class="font-semibold text-white hover:bg-white/10 text-base px-4 py-3">Products</a></li>
        <li><a @click="$emit('navigate', 'about')" class="font-semibold text-white hover:bg-white/10 text-base px-4 py-3">About</a></li>
        <li><a @click="$emit('navigate', 'contact')" class="font-semibold text-white hover:bg-white/10 text-base px-4 py-3">Contact</a></li>
      </ul>
    </div>
    
    <div class="navbar-end gap-3">
      <div class="form-control md:hidden">
        <input 
          type="text" 
          v-model="searchQuery"
          @input="handleSearchInput"
          @keyup.enter="handleSearch"
          placeholder="Search..." 
          class="input input-bordered input-sm bg-white/20 text-white placeholder-white/70 border-white/30 focus:bg-white/30 w-32" 
        />
      </div>
      
      <button @click="$emit('openCart')" class="btn btn-ghost btn-lg btn-circle relative text-white hover:bg-white/10">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
        <span v-if="cartCount > 0" class="badge badge-sm bg-red-500 border-none absolute -top-1 -right-1 text-white font-bold">
          {{ cartCount }}
        </span>
      </button>
      
      <div class="dropdown dropdown-end">
        <div tabindex="0" role="button" class="btn btn-ghost btn-lg btn-circle text-white hover:bg-white/10">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <ul tabindex="0" class="menu menu-sm dropdown-content mt-3 z-1 p-2 shadow bg-white rounded-box w-52">
          <li><a class="text-slate-700 hover:bg-indigo-100 py-3">Profile</a></li>
          <li><a class="text-slate-700 hover:bg-indigo-100 py-3">Orders</a></li>
          <li><a class="text-slate-700 hover:bg-indigo-100 py-3">Settings</a></li>
          <li><a class="text-slate-700 hover:bg-indigo-100 py-3">Logout</a></li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, defineProps, defineEmits } from 'vue';

defineProps({
  cartCount: {
    type: Number,
    default: 0
  }
});

const emit = defineEmits(['navigate', 'openCart', 'search']);

const searchQuery = ref('');

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim());
  }
};

const handleSearchInput = (event) => {
  searchQuery.value = event.target.value;
  if (searchQuery.value.trim()) {
    emit('search', searchQuery.value.trim());
  } else {
    emit('search', ''); // Reset search when input is empty
  }
};
</script>
