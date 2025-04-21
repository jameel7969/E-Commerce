import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_URL}/categories`;

export const fetchCategories = createAsyncThunk('categories/fetchCategories', async (_, { rejectWithValue }) => {
    try {
        const response = await axios.get(API_URL);
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createCategory = createAsyncThunk('categories/createCategory', async (categoryData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(`${API_URL}/create`, categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateCategory = createAsyncThunk('categories/updateCategory', async ({ id, categoryData }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/${id}`, categoryData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteCategory = createAsyncThunk('categories/deleteCategory', async (id, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        await axios.delete(`${API_URL}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return id;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

const categorySlice = createSlice({
    name: 'categories',
    initialState: {
        categories: [],
        loading: false,
        error: null,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        categoryAdded: (state, action) => {
            state.categories.push(action.payload);
        },
        categoryUpdated: (state, action) => {
            const index = state.categories.findIndex(category => category._id === action.payload._id);
            if (index !== -1) {
                state.categories[index] = action.payload;
            }
        },
        categoryDeleted: (state, action) => {
            state.categories = state.categories.filter(category => category._id !== action.payload);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload;
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch categories';
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.categories.push(action.payload);
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                const index = state.categories.findIndex(category => category._id === action.payload._id);
                if (index !== -1) {
                    state.categories[index] = action.payload;
                }
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.categories = state.categories.filter(category => category._id !== action.payload);
            });
    }
});

export const { clearError, categoryAdded, categoryUpdated, categoryDeleted } = categorySlice.actions;
export default categorySlice.reducer;