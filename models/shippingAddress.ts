export interface ShippingPackageWithMerchant {
	id: number;
	code: string;
	name: string;
}

export interface ShippingPackageModel {
	lstData: ShippingPackageWithMerchant[];
	merchantId: number;
}

export interface IshippingAddressUser {
	province: number;
	district: number;
	ward: number;
}
