<template>
  <div class="flex flex-wrap justify-center bg-blue-400">
    <div
      v-for="product in data"
      :key="product.id"
      class="card bg-neutral text-neutral-content w-96 mt-5 mr-5"
    >
      <div class="card-body items-center text-center">
        <h1 class="card-title">{{ product.product_name }}</h1>
        <h1>{{ product.product_category }}</h1>
        <h1>{{ product.product_price }}$</h1>
        <div class="card-actions justify-end">
          <button class="btn btn-primary">Add to cart</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from "axios";
import { ref, onMounted } from "vue";

const data = ref(null);

onMounted(() => {
  axios
    .get("http://localhost:3000/product/")
    .then((response) => {
      data.value = response.data;
    })
    .catch((error) => {
      console.error(error);
    });

  // GET product image
  //   const imgElement = document.getElementById("");
  //   axios
  //     .get(`http://localhost:3000/image/`, { responseType: "blob" })
  //     .then((response) => {
  //       let internalURL = URL.createObjectURL(response.data);
  //       imgElement.src = internalURL;
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
});
</script>
