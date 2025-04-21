import { configureStore } from '@reduxjs/toolkit';
import rolesReducer from './redux/roles/rolesSlice';
import authReducer from './redux/auth/authSlice';
import productReducer from './redux/products/productSlice';
import categoryReducer from './redux/categories/categorySlice';

export const store = configureStore({
  reducer: {
    roles: rolesReducer,
    auth: authReducer,
    products: productReducer,
    categories: categoryReducer,
  },
});