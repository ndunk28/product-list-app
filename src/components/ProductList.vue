<template>
  <div>
    <b-container>
      <div class="product-title p-2 mt-3 pt-3">
        <b-row>
          <b-col cols="8">
            <h3>Product List</h3>
          </b-col>
          <b-col class="text-right">
            <b-button variant="primary" @click="showProductModal">Add Product</b-button>
          </b-col>
        </b-row>
      </div>

      <div class="product-search p-2 mb-2">
        <b-row>
          <b-col cols="6">
            <b-form-input type="search" v-model="searchProduct" placeholder="Typing to search..."  />
          </b-col>
        </b-row>
      </div>

      <div class="product-list p-2 mb-2">
        <b-row>
          <b-col v-for="product in filteredProducts" :key="product.id" md="4" class="mb-4">
            <b-card
              :title="product.name"
              :sub-title="'$' + product.price"
              :img-src="product.image"
              img-alt="Image"
              img-top
              class="text-center"
            >
              <b-card-text>{{ product.description }}</b-card-text>
              <template #footer>
                <b-button variant="primary" @click="editProduct(product)">Edit</b-button>
                <b-button variant="danger" class="ml-2" @click="confirmDelete(product.id)">Delete</b-button>
              </template>
            </b-card>
          </b-col>
          <b-col v-if="!filteredProducts.length" md="12" class="mb-4 text-center">
            <p>No Data</p>
          </b-col>
        </b-row>
      </div>

      <b-modal class="add-edit-modal" v-model="isModalVisible" :title="titleModal" hide-footer>
        <b-form @submit.prevent="saveProduct">
          <b-form-group label="Name">
            <b-form-input v-model="productForm.name" required></b-form-input>
          </b-form-group>
          <b-form-group label="Price">
            <b-form-input v-model="productForm.price" required type="number"></b-form-input>
          </b-form-group>
          <b-form-group label="Description">
            <b-form-textarea v-model="productForm.description" required rows="3"></b-form-textarea>
          </b-form-group>
          <b-form-group label="Image">
            <div class="d-flex mb-3">
              <b-form-file ref="file-input" @change="onImageChange" accept="image/*" class="w-auto flex-grow-1"></b-form-file>
              <b-button v-if="productForm.image" variant="danger" class="ml-3" @click="clearImage">Clear image</b-button>
            </div>
            <b-img v-if="productForm.image" :src="productForm.image" class="mb-3" fluid block rounded></b-img>
          </b-form-group>
          <b-row>
            <b-col cols="6">
              <b-button block type="submit" variant="success" :disabled="isSaveDisabled">Save</b-button>
            </b-col>
            <b-col cols="6">
              <b-button block variant="secondary" class="ml-2" @click="hideProductModal()">Cancel</b-button>
            </b-col>
          </b-row>
        </b-form>
      </b-modal>

      <b-modal class="confirm-delete-modal" v-model="isDeleteModalVisible" title="Confirm Delete" hide-footer>
        <div class="d-block text-center">
          <p>Are you sure you want to delete this product?</p>
          <b-button variant="danger" @click="deleteProduct">Yes, Delete</b-button>
          <b-button variant="secondary" class="ml-2" @click="cancelDelete()">Cancel</b-button>
        </div>
      </b-modal>
    </b-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      searchProduct: '',
      isModalVisible: false,
      isDeleteModalVisible: false,
      productDeleteId: null,
      productForm: {
        id: null,
        name: '',
        price: 0,
        description: '',
        image: null,
      },
      originalProduct: null,
    };
  },
  computed: {
    titleModal(){
      if (this.productForm.id) {
        return 'Edit Product'
      } else {
        return 'Add Product'
      }
    },
    filteredProducts() {
      return this.$store.getters.filteredProducts(this.searchProduct);
    },
    isSaveDisabled() {
      if (!this.originalProduct) return false;

      const { name, price, description, image } = this.productForm;
      const original = this.originalProduct;

      return (
        name === original.name &&
        price === original.price &&
        description === original.description &&
        image === original.image
      );
    }
  },
  methods: {
    showProductModal() {
      this.productForm = { id: null, name: '', price: '', description: '', image: null };
      this.isModalVisible = true;
    },
    hideProductModal(){
      this.isModalVisible = false;
    },
    saveProduct() {
      if (this.productForm.id) {
        this.$store.dispatch('editProduct', this.productForm);
      } else {
        this.productForm.id = Math.ceil(Math.random()*1000000);
        this.$store.dispatch('addProduct', this.productForm);
      }
      this.isModalVisible = false;
    },
    editProduct(product) {
      this.productForm = { ...product };
      this.originalProduct = { ...product }; 
      this.isModalVisible = true;
    },
    confirmDelete(productId) {
      this.productDeleteId = productId;
      this.isDeleteModalVisible = true;
    },
    cancelDelete(){
      this.isDeleteModalVisible = false;
    },
    deleteProduct() {
      if (this.productDeleteId !== null) {
        this.$store.dispatch('deleteProduct', this.productDeleteId);
        this.isDeleteModalVisible = false;
        this.productDeleteId = null;
      }
    },
    onImageChange(event) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.productForm.image = e.target.result;
      };
      reader.readAsDataURL(file);
    },
    clearImage() {
      this.productForm.image = null;
      this.$refs['file-input'].reset();
    },
  },
};
</script>