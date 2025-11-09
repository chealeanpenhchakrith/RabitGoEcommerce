<template>
  <div class="fixed inset-0 backdrop-blur-sm bg-white/30 flex items-center justify-center z-120 p-4">
    <div class="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
      <button 
        @click="$emit('close')" 
        class="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div v-if="mode === 'login'" class="space-y-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-slate-800 mb-2">Welcome Back!</h2>
          <p class="text-slate-600">Login to access your account</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input 
              v-model="loginForm.username"
              type="text" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              v-model="loginForm.password"
              type="password" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your password"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Login</span>
            <span v-else>Logging in...</span>
          </button>
        </form>

        <div class="text-center">
          <p class="text-slate-600">
            Don't have an account? 
            <button 
              @click="switchMode('register')" 
              class="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </div>

      <div v-else class="space-y-6">
        <div class="text-center">
          <h2 class="text-3xl font-bold text-slate-800 mb-2">Create Account</h2>
          <p class="text-slate-600">Join us today!</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Username</label>
            <input 
              v-model="registerForm.username"
              type="text" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Choose a username"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input 
              v-model="registerForm.email"
              type="email" 
              required
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input 
              v-model="registerForm.password"
              type="password" 
              required
              minlength="6"
              class="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              placeholder="Choose a password (min. 6 characters)"
            />
          </div>

          <div v-if="error" class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {{ error }}
          </div>

          <button 
            type="submit"
            :disabled="loading"
            class="w-full bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!loading">Create Account</span>
            <span v-else>Creating account...</span>
          </button>
        </form>

        <div class="text-center">
          <p class="text-slate-600">
            Already have an account? 
            <button 
              @click="switchMode('login')" 
              class="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, defineEmits } from 'vue';
import axios from 'axios';

const emit = defineEmits(['close', 'login-success']);

const mode = ref('login');
const loading = ref(false);
const error = ref('');

const loginForm = ref({
  username: '',
  password: ''
});

const registerForm = ref({
  username: '',
  email: '',
  password: ''
});

const switchMode = (newMode) => {
  mode.value = newMode;
  error.value = '';
  loginForm.value = { username: '', password: '' };
  registerForm.value = { username: '', email: '', password: '' };
};

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('http://localhost:3000/auth/login', loginForm.value, {
      withCredentials: true
    });
    
    emit('login-success', response.data.user);
    emit('close');
  } catch (err) {
    error.value = err.response?.data?.error || 'Login failed. Please try again.';
  } finally {
    loading.value = false;
  }
};

const handleRegister = async () => {
  loading.value = true;
  error.value = '';

  try {
    const response = await axios.post('http://localhost:3000/auth/register', registerForm.value, {
      withCredentials: true
    });
    
    emit('login-success', response.data.user);
    emit('close');
  } catch (err) {
    error.value = err.response?.data?.error || 'Registration failed. Please try again.';
  } finally {
    loading.value = false;
  }
};
</script>
