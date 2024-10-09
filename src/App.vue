<template>
  <div id="app">
    <header-list />
    <product-list />
  </div>
</template>

<script>
import ProductList from './components/ProductList.vue';

export default {
  components: {
    ProductList
  }
};
</script>