import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceType } from 'enums';
import { CategoryViewModel, ILocation, ShowCatalog } from 'models';
import { RootState } from 'store';

export interface AppState {
	language: string;
	device: DeviceType;
	isIOSDevice: boolean;
	layout: string;
	isShowCatalog: ShowCatalog;
	selectedCatalog: CategoryViewModel[];
	currentLocation: ILocation;
}

const initialState: AppState = {
	language: 'vi',
	device: DeviceType.DESKTOP,
	layout: 'default',
	isShowCatalog: ShowCatalog.hidden,
	selectedCatalog: [],
	currentLocation: {},
	isIOSDevice: false,
};
let tempSelectedCatalog: CategoryViewModel[];
let checkSelected: boolean = false;
const listSlug = (node: CategoryViewModel[]) => {
	if (node) tempSelectedCatalog = node;
};

const childCatalogRecursion = (
	child: CategoryViewModel[],
	urlSlug: string,
	nodeTree: CategoryViewModel[],
) => {
	child?.find((item: CategoryViewModel) => {
		if (!checkSelected) {
			if (item.level < nodeTree.length) {
				nodeTree.splice(item.level - 1, nodeTree.length - item.level);
			}
			nodeTree[item.level - 1] = item;
			if (item.urlSlug === urlSlug) {
				listSlug(nodeTree);
				checkSelected = true;
				return true;
			}
			childCatalogRecursion(item.children, urlSlug, nodeTree);
		}
		return false;
	});
};

const appSlice = createSlice({
	name: 'app',
	initialState,
	reducers: {
		setLanguage(state, action: PayloadAction<string>) {
			state.language = action.payload;
		},
		setDeviceType(state, action: PayloadAction<DeviceType>) {
			state.device = action.payload;
		},
		setIOSDevice(state, action: PayloadAction<boolean>) {
			state.isIOSDevice = action.payload;
		},
		setIsShowCatalog(state, action: PayloadAction<ShowCatalog>) {
			state.isShowCatalog = action.payload;
		},
		getSelectedCatalog(
			state,
			action: PayloadAction<{ catalog: CategoryViewModel[]; urlSlug: string }>,
		) {
			const { catalog, urlSlug } = action.payload;
			checkSelected = false;
			childCatalogRecursion(catalog, urlSlug, []);
			state.selectedCatalog = tempSelectedCatalog || [];
		},
		setCurrentLocation(state, action: PayloadAction<{ latitude: number; longitude: number }>) {
			const { latitude, longitude } = action.payload;
			if (latitude && longitude) {
				state.currentLocation = {
					latitude,
					longitude,
				};
			}
		},
	},
});

// Action
export const appActions = appSlice.actions;
export const showCatalogSector = (state: RootState) => state.app.isShowCatalog;
export const deviceTypeSelector = (state: RootState) => state.app.device;
export const isIOSDeviceSelector = (state: RootState) => state.app.isIOSDevice;
export const selectedCatalogSector = (state: RootState) => state.app.selectedCatalog;
export const currentLocationSelector = (state: RootState) => state.app.currentLocation;
// Reducer
const appReducer = appSlice.reducer;

export default appReducer;
