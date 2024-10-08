import Vue from 'vue';
import Vuex from 'vuex';
import productsData from '@/assets/products.json'; 

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    products: productsData,
  },
  mutations: {
    ADD_PRODUCT(state, product) {
      state.products.push(product);
    },
    EDIT_PRODUCT(state, updatedProduct) {
      const index = state.products.findIndex(p => p.id === updatedProduct.id);
      if (index !== -1) {
        Vue.set(state.products, index, updatedProduct);
      }
    },
    DELETE_PRODUCT(state, productId) {
      state.products = state.products.filter(p => p.id !== productId);
    },
  },
  actions: {
    addProduct({ commit }, product) {
      commit('ADD_PRODUCT', product);
    },
    editProduct({ commit }, product) {
      commit('EDIT_PRODUCT', product);
    },
    deleteProduct({ commit }, productId) {
      commit('DELETE_PRODUCT', productId);
    },
  },
  getters: {
    filteredProducts: (state) => (searchProduct) => {
      if (!searchProduct) return state.products;
      return state.products.filter(p =>
        p.name.toLowerCase().includes(searchProduct.toLowerCase())
      );
    },
  },
});