import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccountInfo, LoginData, LoginPayload } from 'models';
import { getSelfInfoApi, loginApi, logoutApi } from 'services';
import { RootState } from 'store';

export interface AuthState {
	isLoading: boolean;
	isLoggedIn: boolean;
	currentUser?: AccountInfo | null;
	roles: string[];
	userId: string;
}

const initialState: AuthState = {
	isLoading: false,
	isLoggedIn: false,
	currentUser: null,
	roles: [],
	userId: '',
};

export const loginRequest = createAsyncThunk('/account/login', async (data: LoginPayload) => {
	const response = await loginApi(data);
	if (response?.error) {
		return Promise.reject(response.error);
	}
	return response;
});

export const getSelfInfoRequest = createAsyncThunk('/customer/self', async () => {
	const response = await getSelfInfoApi();
	return response.data;
});

export const logoutRequest = createAsyncThunk('/account/logout', async () => {
	await logoutApi();
});

const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		reset: (state: AuthState) => {
			state.currentUser = null;
		},
		setLoginRoles: (state: any, action: PayloadAction<any>) => {
			state.roles = action.payload?.roles;
			state.userId = action.payload?.userId;
		},
		updateSelfInfoRequest: (state: any, action: PayloadAction<AccountInfo>) => {
			const tempUser: AccountInfo = action.payload;
			const idName =
				tempUser?.id.length > 6 ? tempUser?.id?.substring(tempUser?.id.length - 6) : tempUser?.id;

			state.currentUser = {
				...tempUser,
				fullName: tempUser?.fullName || `Cá nhân [${idName?.toUpperCase()}]` || 'Cá nhân',
			};
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(loginRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(loginRequest.fulfilled, (state, action: PayloadAction<LoginData>) => {
				state.isLoading = false;
				state.isLoggedIn = true;
			})
			.addCase(loginRequest.rejected, (state) => {
				state.isLoading = false;
				state.isLoggedIn = false;
			})
			.addCase(getSelfInfoRequest.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getSelfInfoRequest.fulfilled, (state, action: PayloadAction<AccountInfo>) => {
				state.isLoading = false;
				state.isLoggedIn = true;

				const tempUser: AccountInfo = action.payload;
				const idName =
					tempUser?.id.length > 6 ? tempUser?.id.substring(tempUser?.id.length - 6) : tempUser?.id;

				state.currentUser = {
					...tempUser,
					fullName: tempUser?.fullName || `Cá nhân [${idName?.toUpperCase()}]` || 'Cá nhân',
				};
			})
			.addCase(getSelfInfoRequest.rejected, (state) => {
				state.isLoading = false;
				state.isLoggedIn = false;
			})
			.addCase(logoutRequest.pending, (state) => {
				state.isLoggedIn = false;
				state.currentUser = undefined;
			});
	},
});

// Action
export const authActions = authSlice.actions;

// Selector
export const isLoadingSelector = (state: RootState) => state.auth.isLoading;

export const isLoggedInSelector = (state: RootState) => state.auth.isLoggedIn;

export const currentUserSelector = (state: RootState) => state.auth.currentUser;

export const rolesSelector = (state: RootState) => state.auth.roles;

export const userIdSelector = (state: RootState) => state.auth.userId;

// Reducer
const authReducer = authSlice.reducer;

export default authReducer;
