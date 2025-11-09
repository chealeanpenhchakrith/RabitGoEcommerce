<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-120 p-4" @click.self="$emit('cancel')">
    <div class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative">
      <div class="text-center">
        <div class="mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mx-auto text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </div>
        
        <h2 class="text-2xl font-bold text-slate-800 mb-3">Remove Item?</h2>
        <p class="text-slate-600 mb-6">Are you sure you want to remove this item from your cart?</p>
        
        <div class="flex gap-3">
          <button @click="$emit('cancel')" class="btn btn-secondary flex-1">
            Cancel
          </button>
          <button @click="$emit('confirm')" class="btn btn-error flex-1">
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineEmits } from 'vue';

defineEmits(['confirm', 'cancel']);
</script>
