import { MODE_RUNNER, PROMOTION_STATUS_SHOW, TYPE_DISCOUNT, TYPE_PRODUCT_VARIANT } from 'enums';
import { Product, ProductItemPromotion, ProductVariation } from 'models';

export interface FncListVariationsProps {
	type: TYPE_PRODUCT_VARIANT;
	value: ProductVariation;
	disabled?: boolean; //for out of stock
}
export interface FncTagTypePromotion {
	promotionType: TYPE_DISCOUNT;
	discountValue: number;
	mode?: MODE_RUNNER;
}

export interface FncBlockCountDownPromotion {
	dateForPromotion: {
		startDate: string;
		endDate: string;
		remainDuration: number;
	};
	mode?: MODE_RUNNER;
	info?: ProductItemPromotion;
	promotionType: TYPE_DISCOUNT;
	isEnabledWithTimeSlot: PROMOTION_STATUS_SHOW;
}

export type TypeAddCartWithMultiQuantity = 'plus' | 'minus';

export interface FncPriceTypePromotion {
	promotionType: TYPE_DISCOUNT;
	firstData: boolean;
	selectedData: string;
	dataSource: any;
	status?: PROMOTION_STATUS_SHOW;
	mode?: MODE_RUNNER;
}

export interface FncBlockBuyNow {
	idVariant: number | null | undefined;
	disableBuy?: boolean;
	productDetails: Product;
	isValidSubmit: boolean;
	cartId: string;
	ref?: any;
	scrollToVariant?: any;
	onSubmit?: () => void;
	mode?: MODE_RUNNER;
	forMobile?: {
		isMobile?: boolean;
		isChangeLayoutBuyNow?: boolean;
	};
}

export interface DataSelectedVariantProps {
	propertyValueId1?: number;
	propertyValueId2?: number;
}
