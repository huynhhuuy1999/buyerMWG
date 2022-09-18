import { AvatarImageModel, Product } from './index';

export interface ProfileProps {
	data: {
		dataProductViewed?: Product[];
	};
}

export interface PersonalProfile {
	dataProductViewed?: Product[];
}

export interface PickupStore {
	address: string;
	avatarImage: AvatarImageModel;
	closeTime: number;
	code: string;
	createdAt: string;
	createdBy: string;
	delete: boolean;
	description: string;
	district: string;
	districtId: number;
	fullAddress: string;
	mobilePhone: string;
	name: string;
	openTime: number;
	pickupStoreId: string;
	images: AvatarImageModel[];
	location: { lat: number; lon: number };
	province: string;
	provinceId: number;
	status: number;
	updatedAt: string;
	updatedBy: string;
	version: number;
	ward: string;
	wardId: number;
}

export interface CustomerProfile {
	profileId: string;
	customerId: string;
	contactName: string;
	gender: number;
	provinceId: number;
	districtId: number;
	wardId: number;
	address: string;
	province: string;
	district: string;
	ward: string;
	fullAddress: string;
	mobileNumber: string;
	isDefault: boolean;
	email: string;
	isCompany: boolean;
	companyName: string;
	companyAddress: string;
	companyTaxCode: string;
	hourOffice: boolean;
	pickupStoreId: string;
	receiveMyAddress: boolean;
	status: number;
	paymentType: number;
	location: {
		lat: number;
		lon: number;
	};
	updatedAt: string;
	createdAt: string;
	version: number;
	pickupStore: PickupStore;
}
