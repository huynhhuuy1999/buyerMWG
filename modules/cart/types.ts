import { CartVariantItems, ProductVariation, VariantConfigs } from 'models';

export interface ConditionRenderBlockBuyNow {
	hasProfile?: boolean;
	hasChooseDelivery?: boolean;
	hasPaymentTypeEnable?: boolean;
	activeActionCurrentSubmit?: boolean;
	hasExistedBuyLater?: boolean;
	cartItemNotExisted?: boolean;
}

export type ButtonBuyNowProps = ConditionRenderBlockBuyNow;

export interface VariationConfigsAll {
	id: number;
	variations: ProductVariation[];
	variationConfigs: VariantConfigs;
}

export enum MODE_ADD_CART {
	drawer = 'drawer',
	default = 'default',
}

export interface ItemUpdateQuantityProps {
	merchantId: number;
	productId: number;
	variationId: number;
	quantity: number;
	cartId: string;
	brandId: number;
	reservationId?: string;
}

export interface SuccessOrdersProps {
	isActive: boolean;
	orderId: string;
}

export enum DeliveryTimeEnums {
	WorkingHours = 1,
	AllTime = 2,
}

export interface VerifyOTPProps {
	phoneNumber: string;
	isActive?: boolean;
	gender: number;
	contactName: string;
	verifyId: number;
	type: string;
}

export interface IframeProps {
	title: string;
	isActive: boolean;
	callbackUrl: string;
	orderId: string;
}

export interface ProductOutofStockProps {
	isActiveDrawer: boolean;
	isOutofStock: boolean;
	isConfirm: boolean;
	dataOutOfStock?: CartVariantItems[];
}
