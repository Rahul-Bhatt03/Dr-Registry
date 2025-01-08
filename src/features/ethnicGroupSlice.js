import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from './endPoints';



// Helper function to get the token
const getAuthToken = () => localStorage.getItem('token');

// Thunks for CRUD operations
export const fetchEthnicGroup = createAsyncThunk('/api/EthnicGroup/GetAll', async () => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}/EthnicGroup/GetAll`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
});

export const getEthnicGroupById = createAsyncThunk('/api/EthnicGroup/getinfo/{EthnicGroupId}', async (ethnicGroupId) => {
    const token = getAuthToken();
    const response = await axios.get(`${BASE_URL}/EthnicGroup/getinfo/${ethnicGroupId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
});

export const addEthnicGroup = createAsyncThunk('/api/EthnicGroup/addEthnicGroupInfo', async (group) => {
    const token = getAuthToken();
    const response = await axios.post(`${BASE_URL}/EthnicGroup/addEthnicGroupInfo`, group, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
});

export const updateEthnicGroup = createAsyncThunk('/api/EthnicGroup/updateEthnicGroup', async ({ id, group }) => {
    const token = getAuthToken();
    const response = await axios.put(`${BASE_URL}/EthnicGroup/updateEthnicGroup`, group, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: { id },
    });
    return response.data;
});

export const deleteEthnicGroup = createAsyncThunk('/api/EthnicGroup/deleteEthnicGroup', async (id) => {
    const token = getAuthToken();
    await axios.delete(`${BASE_URL}/EthnicGroup/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return id;
});

// Slice
const ethnicGroupsSlice = createSlice({
    name: 'ethnicGroups',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchEthnicGroup.fulfilled, (state, action) => {
                state.items = action.payload;
                state.status = 'succeeded';
            })
            .addCase(fetchEthnicGroup.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchEthnicGroup.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })
            .addCase(addEthnicGroup.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(updateEthnicGroup.fulfilled, (state, action) => {
                const index = state.items.findIndex((item) => item.id === action.payload.id);
                if (index >= 0) state.items[index] = action.payload;
            })
            .addCase(deleteEthnicGroup.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.id !== action.payload);
            });
    },
});

export default ethnicGroupsSlice.reducer;
