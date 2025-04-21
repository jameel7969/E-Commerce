import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/roles';

export const fetchRoles = createAsyncThunk('roles/fetchRoles', async (_, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const createRole = createAsyncThunk('roles/createRole', async (roleData, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(API_URL + '/create', roleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const updateRole = createAsyncThunk('roles/updateRole', async ({ id, roleData }, { rejectWithValue }) => {
    try {
        const token = localStorage.getItem('token');
        const response = await axios.put(`${API_URL}/${id}`, roleData, {
            headers: { Authorization: `Bearer ${token}` }
        });
        return response.data;
    } catch (error) {
        return rejectWithValue(error.response.data);
    }
});

export const deleteRole = createAsyncThunk('roles/deleteRole', async (id, { rejectWithValue }) => {
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

const rolesSlice = createSlice({
    name: 'roles',
    initialState: {
        roles: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRoles.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchRoles.fulfilled, (state, action) => {
                state.loading = false;
                state.roles = action.payload;
            })
            .addCase(fetchRoles.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch roles';
            })
            .addCase(createRole.fulfilled, (state, action) => {
                state.roles.push(action.payload);
            })
            .addCase(updateRole.fulfilled, (state, action) => {
                const index = state.roles.findIndex(role => role._id === action.payload._id);
                if (index !== -1) {
                    state.roles[index] = action.payload;
                }
            })
            .addCase(deleteRole.fulfilled, (state, action) => {
                state.roles = state.roles.filter(role => role._id !== action.payload);
            });
    },
});

export default rolesSlice.reducer;