import { AvatarImageModel } from './common';

export interface pickupStoreModels {
	avatarImage: AvatarImageModel;
	images: AvatarImageModel[];
	location: {
		lat: number;
		lon: number;
	};
	extra: object;
	pickupStoreId: string;
	name: string;
	code: string;
	provinceId: number;
	districtId: number;
	wardId: number;
	address: string;
	province: string;
	district: string;
	ward: string;
	fullAddress: string;
	mobilePhone: string;
	description: string;
	openTime: number;
	closeTime: number;
	status: number;
	delete: boolean;
	updatedBy: string;
	updatedAt: string;
	createdBy: string;
	createdAt: string;
	version: number;
}
