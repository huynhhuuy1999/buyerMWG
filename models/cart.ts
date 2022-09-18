import { MerchantModel, PaymentMethod, ProvinceResponse } from 'models';

import { DeviceType } from '../enums';
import { ProductVariation } from './product';
import { CustomerProfile } from './profile';

export interface CartItemsInitData {
	itemsLength: number;
}

export enum GenderEnums {
	Male = 1,
	Female = 2,
}

export type TypeModesCartProduct = 'CART_BUY_NOW' | 'CART_BUY_LATER';

export type Actions = 'EDIT' | 'CREATE' | 'RESELECT' | 'REMOVE' | 'SUBMIT' | 'DELETE';

export interface OrderResultResponse {
	orderId: string;
	payUrl: string;
	deeplink: string;
	transactionId: string;
	ipv4: string;
}

export interface TypeActionShippingAddress {
	action: Actions;
	isActionActive: boolean;
	isActiveOrder?: boolean;
	id?: string | null;
}

interface IsLoadingPropsCart {
	cartBuyNow?: boolean;
	cartBuyLater?: boolean;
}
export interface ICartPageProps {
	dataCart?: CartModel | null;
	dataCartBuyLater?: CartBuyLaterModel | null;
	onMutable?: any;
	onAction?: React.Dispatch<React.SetStateAction<TypeActionShippingAddress>>;
	dataVouchers?: voucherCartProps[];
	hasIsOutOfStock?: boolean;
	dataProfiles?: CustomerProfile[] | null;
	paymentMethod?: PaymentMethod[];
	dataProvinces?: ProvinceResponse[];
	isLoading?: IsLoadingPropsCart;
	forDevice?: DeviceType;
}

export interface CartMerchantPaymentsItem {
	merchantId: number;
	paymentPrice: number;
}
export interface CartPayment {
	paymentType: number;
	paymentName: string;
	paymentTotal: number;
	merchantPayments: CartMerchantPaymentsItem[];
	isInvoice: boolean;
	invoice: {
		companyName: string;
		taxCode: string;
		address: string;
	};
	vuivuiVoucherDiscount: number;
	shippingFeeTotal: number;
	discountTotal: number;
}

export interface CartPromotionItems {
	price: number;
	numberUsedEachCustomer: number;
	pricePromote: number;
	promotionId: string;
	promotionTypeName: string;
	promotionType: number;
}

export interface CartVariantItems {
	merchantId: number;
	productId: number;
	brandId: number;
	variationId: number;
	isLimitPromotionNumber: boolean;
	productName: string;
	categoryUrlSlug: string;
	urlSlug: string;
	configDetailLayout: string;
	reservationId: string;
	variationImage: string;
	propertyValueId1: number;
	propertyValueName1: string;
	propertyValueId2: number;
	warehouseId: string;
	propertyValueName2: string;
	productPriceOriginal: number;
	productPrice: number;
	isOutOfStock: boolean;
	productQuantity: number;
	variations: ProductVariation[];
	itemPromotions: CartPromotionItems[];
	categoryId: number;
}

export interface ShippingItems {
	deliveryTypeCode: string;
	deliveryTypeName: string;
	distance: number;
	isSelected: true;
	isSupport: false;
	merchantId: number;
	partnerCode: string;
	partnerName: string;
	profileMerchant: null;
	sortIndex: number;
	timeCommitment: string;
	timeCommitmentFormula: string;
	timeCommitmentFormulaFrom: number;
	timeCommitmentFormulaTo: number;
	totalPay: number;
}

export interface voucherCartProps {
	voucherId: string;
	programName: string;
	voucherType: number;
	validUntil: string;
	discountValue: number;
	minOrderAmount: number;
	isEligible: boolean;
	isApply: true;
}

export interface BrandItem {
	brandId: number;
	logo: string;
	name: string;
	urlSlug: string;
}

export interface CartItems {
	items: CartVariantItems[];
	paymentPrice: number;
	merchantVoucherIds: string[];
	merchant: MerchantModel;
	merchantPaymentTotal: number;
	merchantVoucherDiscount: number;
	brand: BrandItem;
	shippings: ShippingItems[];
}

export interface CartModel {
	cartId: string;
	customerId: string;
	customerName: string;
	cartItems: CartItems[];
	cartShipping: CustomerProfile;
	newCartId: number;
	note: string;
	cartPayment: CartPayment;
	vouchers: voucherCartProps[];
	vuiVuiVoucherIds: string[];
}

export interface CartBuyLaterModel {
	customerId: string;
	products: CartVariantItems[];
	updatedAt: string;
	createdAt: string;
}

export interface IUpdateQuantityProduct {
	merchanId: number;
	productId: number;
	variationId: number;
	sku: string;
	quantity: number;
	categoryId: number;
	type: number;
	cartId: string;
}
