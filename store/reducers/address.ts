import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DistrictResponse, ProvinceResponse, ProvinceTree, WardResponse } from 'models';
import { getDistrict, getProvinces, getWard } from 'services';
import { RootState } from 'store';

export enum AddressActionsEnum {
	province = 'address/fetchProvinceList',
	district = 'address/fetchDistrictWithId',
	ward = 'address/fetchWardWithId',
	provinceTree = 'address/fetchProvinceTree',
}

export const fetchProvince = createAsyncThunk(AddressActionsEnum.province, async () => {
	const response = await getProvinces();
	return response.data;
});
export const fetchDistrictWithId = createAsyncThunk(
	AddressActionsEnum.district,
	async (idProvince: number) => {
		const response = await getDistrict(idProvince);
		return response.data;
	},
);
export const fetchWardWithId = createAsyncThunk(
	AddressActionsEnum.ward,
	async ({ idProvince, idDistrict }: { idProvince: number; idDistrict: number }) => {
		const response = await getWard(idProvince, idDistrict);
		return response.data;
	},
);
export const fetchProvinceTree = createAsyncThunk(AddressActionsEnum.provinceTree, async () => {
	const response = await getProvinces();
	if (response?.isError) {
		return Promise.reject(response.error);
	}
	return response.data;
});

export enum enumCartPickupAddress {
	homeDelivery = 'homeDelivery',
	pickUpInStore = 'pickUpInStore',
}

export type TypeCartPickupAddress = 'homeDelivery' | 'pickUpInStore';

export interface Address {
	data: {
		province: ProvinceResponse[];
		district: DistrictResponse[];
		ward: WardResponse[];
		provinceTree: ProvinceTree[];
	};
	ids: {
		province: number;
		district: number;
		ward: number;
	};
	names: {
		province: string;
		district: string;
		ward: string;
		addressDetails: string;
	};
	typePickupAddress: TypeCartPickupAddress;
	version: number;
}

export interface PayloadAddress {
	payload: { id: number; name: string };
}

const initialState: Address = {
	data: {
		province: [],
		district: [],
		ward: [],
		provinceTree: [],
	},
	ids: {
		province: 0,
		district: 0,
		ward: 0,
	},
	names: {
		province: '',
		district: '',
		ward: '',
		addressDetails: '',
	},
	typePickupAddress: 'homeDelivery',
	version: 0,
};

const addressSlice = createSlice({
	name: 'address',
	initialState,
	reducers: {
		reset: (state: Address) => {
			state.ids.district = 0;
			state.ids.ward = 0;
			state.ids.province = 0;
			state.data.district = [];
			state.data.ward = [];
		},
		setProvince: (state, action) => {
			state.ids.province = action.payload.id;
			state.names.province = action.payload.name;
			state.data.district =
				(action.payload &&
					state.data.provinceTree.find((e) => e.provinceId === action.payload.id)?.children) ??
				[];
			state.ids.district = 0;
			state.names.district = '';
			state.data.ward = [];
			state.ids.ward = 0;
			state.names.ward = '';
		},
		setDistrict: (state, action) => {
			state.ids.district = action.payload.id;
			state.names.district = action.payload.name;
			state.data.ward =
				(action.payload &&
					state.data.district.find((e) => e.districtId === action.payload.id)?.children) ??
				[];
			state.ids.ward = 0;
			state.names.ward = '';
		},
		setWard: (state, action) => {
			state.ids.ward = action.payload.id;
			state.names.ward = action.payload.name;
		},
		setAddressDetails: (state, action) => {
			state.names.addressDetails = action.payload;
		},
		setVersion: (state, action) => {
			state.version = action.payload;
		},
		setActiveTypePickupAddress: (state: Address, action) => {
			state.typePickupAddress = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchProvince.fulfilled, (state, action: PayloadAction<ProvinceResponse[]>) => {
				state.data.province = action.payload;
			})
			.addCase(
				fetchDistrictWithId.fulfilled,
				(state, action: PayloadAction<DistrictResponse[]>) => {
					state.data.district = action.payload;
				},
			)
			.addCase(fetchWardWithId.fulfilled, (state, action: PayloadAction<WardResponse[]>) => {
				state.data.ward = action.payload;
			})
			.addCase(fetchProvinceTree.fulfilled, (state, action: PayloadAction<ProvinceTree[]>) => {
				state.data.provinceTree = action.payload;
			});
	},
});

export const addressActions = addressSlice.actions;

export const addressSelector = (state: RootState) => state.address;
export const versionAddressSelector = (state: RootState) => state.address.version;
export const addressTreeSelector = (state: RootState) => state.address.data.provinceTree;

const addressReducers = addressSlice.reducer;

export default addressReducers;
