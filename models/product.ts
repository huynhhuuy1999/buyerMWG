import { MODE_RUNNER } from 'enums';
import React from 'react';

import { Configs, ProductImage, PropertyAggResult, Video } from './common';
import { ShopInterface } from './shop';

//------------------promotions--------------
export interface ProductItemPromotion {
	isSubscribed: boolean;
	moduleType: number;
	promotionId: string;
	title: string;
	startDate: string;
	endDate: string;
	totalQuantity: number;
	status: number;
	quantity: number;
	price: number;
	pricePromote: number;
	discountValue: number;
	subItem: [];
	invoices: [];
	promotionDealSock: IDealShock[];
}

export interface ProductPromotions {
	variationId: number;
	productId: number;
	promotions: ProductItemPromotion[];
}

export interface ProductPromotionsES {
	moduleType: number;
	productPromotion: ProductItemPromotion;
	promotionTypeName: string;
	pricePromote: number;
	price: number;
	discountValue: number;
	discountValueUpTo: number;
	productId: number;
	isSubscribed: boolean;
	promotionId: string;
	variationId: number;
	startDate: string;
	endDate: string;
	subItem: ProductItemPromotion[];
	titlePromotion: string[];
	title: string;
	promotionDealSock: IDealShock;
	status?: number;
	configRemainQuantity?: number;
	totalQuantity: number;
}
//---------------end promotion --------------

//---------------merchant--------------------
export interface ProductMerchantModel {
	id: string;
	merchantId: number;
	userId: string;
	name: string;
	avatarImage: string;
	address: string;
	type: number;
	portalLink: string;
	isGuaranteed: boolean;
	lastOnline: string;
}
//---------------end merchant----------------

//-------------shipping----------------
export interface ProductShippingFrom {
	content: string;
	description: string;
	caption: string;
}

export interface ProductShippingTo {
	content: string;
	description: string;
	caption: string;
}
//-------------end shipping-------------

//-------------ProductProperties-------
export interface ProductProperties {
	order: number;
	propertyId: number;
	propertyValueId: number;
	partnerPropertyId: number;
	type: number;
	propertyCustom: string;
	propertyValueCustom: string;
	isSystemProperty: boolean;
	imageUrl: string;
	isVariantConfig: boolean;
	propertyValueType: number;
	propertyValueRangeId: number;
	propertyValueRangeName: string;
	isVariationConfig: boolean;
	propertyOriginalValue: string;
	propertyName: string;
	displayOrder: number;
}
//-------------end ProductProperties-------

//-------------variants------------
export interface VariantConfigs {
	isSingleVariation: boolean;
	configs: Configs[];
}

export interface ComboVarianModel {
	variantId: number;
	quantity: number;
}

export interface ProductVariation {
	variationId: number;
	sku: string;
	price: number;
	priceStatus: number;
	propertyValueId1: number;
	propertyValueName1: string;
	propertyValue1Type: number;
	propertyValue1RangeId: number;
	propertyValue1RangeName: string;
	propertyValueId2: number;
	propertyValueName2: string;
	propertyValue2Type: number;
	propertyValue2RangeId: number;
	propertyValue2RangeName: string;
	variationImage: string;
	quantities: WareHouse[];
	totalQuantity: number;
	quantitySold: number;
	isEnabled: boolean;
	promotions: ProductItemPromotion[];
	productId?: number;
}

export interface WareHouse {
	warehouseId: string;
	warehouseName: string;
	warehouseAddress: string;
	provinceId: number;
	districtId: number;
	quantity: number;
}

export interface VarianPromotion {
	discountValue: number;
	quantity: number;
	numberUsedEachCustomer: number;
	productId: number;
	variantId: number;
	sku: string;
	pricePromote: number;
	image: string;
}
//-------------end variants-------------

//--------warranty----------------
export interface ProductWarranty {
	warrantyId: number;
	warrantyPolicy: string;
	warrantyForm: number[];
}
//--------end warranty------------

//---------custom-----------
export interface IMerchantSearch {
	docCount?: number;
	id?: number;
	value?: string;
	name?: string;
	averageRating?: number;
	portalLink?: string;
	totalRating?: number;
	type?: number;
}

export interface Property {
	id?: number;
	name?: string;
	value?: string;
	docCount?: number;
	rangeValueId?: number;
	rangeValueName?: string;
	rangeValueType?: number;
}

export interface IPropertyOrther extends Property {
	// propertyRangeValues?: Array<Property>;
	propertyValues?: Array<Property>;
}

export interface PropertyValue {
	propertyValues?: Array<Property>;
	type?: number;
	id?: number;
	name?: string;
	docCount: number;
	// propertyRangeValues?: Array<Property>;
}

export interface PromotionInfo {
	discountValue?: number;
	moduleType?: number;
	price?: number;
	pricePromote?: number;
	productId?: number;
	variationId?: number;
	titlePromotion?: Array<string>;
	promotionDealSock?: IDealShock;
}

export interface IProductSearch {
	id: number;
	averageRating?: number;
	title: string;
	description: string;
	content: string;
	urlSlug: string;
	images: ProductImage[];
	videos: Video[];
	status: number;
	updatedStatusAt: string;
	condition: number;
	availability: number;
	availabilityDate: string;
	expirationDate: string;
	price: number;
	priceTo: number;
	categoryIds: number[];
	categoryId: number;
	categoryName: string;
	madeinId: number;
	brandId: number;
	brandName: string;
	isLike: boolean;
	modelId: number;
	modelName: string;
	shippingWeight: number;
	shippingLength: number;
	shippingWidth: number;
	shippingHeight: number;
	shippingFrom: ProductShippingFrom;
	shippingFromIds: number[];
	shippingTo: ProductShippingTo;
	shippingToIds: number[];
	createdAt: string;
	updatedAt: string;
	sku: string;
	merchantId: number;
	properties: ProductProperties[];
	variations: ProductVariation[];
	variationConfigs: VariantConfigs;
	isValid: boolean;
	importTaskId: number;
	hasWarranty: boolean;
	warranty: ProductWarranty;
	comboVariations: ComboVarianModel[];
	productType: number;
	statusBeforeDelete: number;
	statusReviewing: number;
	statusReviewingUpdatedAt: string;
	statusReviewingDescription: string;
	feeShip?: number;
	merchant?: ProductMerchantModel;
	averageStar?: number;
	promotions: Array<PromotionInfo>;
	categoryUrlSlug?: string;
	propertyFeatured?: Array<string>;
	layoutType?: number;
	totalRating?: number;
	totalComment?: number;
	totalLike?: number;
	totalShare?: number;
	totalSold?: number;
	totalStock?: number;
}

export interface ParamSearchProduct {
	keyword?: string | any;
	filters?: any;
	price?: any;
	categoryId?: any;
	brandIds?: any;
	isValid?: boolean;
	isFlashSale?: boolean;
	flashSaleStatus?: number;
	provinceId?: number;
	districtIds?: any;
	ratingTypes?: any;
	pageIndex?: number | string;
	pageSize?: number | string;
	productIds?: Array<number>;
	sortType?: number;
	merchantId?: number | string;
	tabs?: any;
	slug_extend?: any;
}

export interface SearchAggregation {
	brands?: Array<Property>;
	categories?: Array<Property>;
	properties?: Array<PropertyValue>;
	maxPrice?: number;
	minPrice?: number;
	priceStep?: number;
}

export type ConditionReturnData = {
	productHasPromotion: boolean | string;
	productNormal?: boolean | string;
	singleVariant?: boolean | string;
	productHasDealShock?: boolean | string;
};

export interface IProductDetailProps {
	productDetails: Product;
	ratingStar?: any;
	mode?: MODE_RUNNER;
	infoMerchant?: ShopInterface;
	options?: {
		params: { typeSimilar?: ProductViewES[]; typeAlsoView?: ProductViewES[] };
		isActive: boolean;
		isValidating?: boolean;
		totalRemainAlsoView?: number;
	};
}
// export type TypeMedia = 'mainImage' | 'sellingPoints' | 'video' | 'otherImage';
export type TypeMedia = 1 | 2 | 3 | 10;

export interface IPropsProductMedia {
	typeMedia?: TypeMedia;
	url: string;
	idHoverVariant?: number;
	productDetails: Product;
	isVideo?: boolean;
	optionOther?: {
		isActive: boolean;
		total: any;
	};
	OnOpenModalDetail?: React.MouseEventHandler;
}

export interface ProductAggResult {
	brands: ProductAggResult[];
	categories: ProductAggResult[];
	properties: PropertyAggResult[];
}

// export interface ParamSearchProduct {
// 	keyword?: string;
// 	filters?: any;
// 	price?: Array<number>;
// 	categoryId?: any;
// 	brandIds?: any;
// 	isValid?: boolean;
// 	isFlashSale?: boolean;
// 	flashSaleStatus?: number;
// 	provinceId?: number;
// 	districtIds?: any;
// 	ratingTypes?: Array<number>;
// 	pageIndex?: number;
// 	pageSize?: number;
// }
//---------------end custom----------------------

export interface Product {
	configDetailLayout: number;
	id: number;
	hasDiscountRunning: boolean;
	hasPromotionRunning: boolean;
	title: string;
	description: string;
	merchant: ProductMerchantModel;
	content: string;
	averageRating: number;
	urlSlug: string;
	firstVariationPromotions: ProductPromotions;
	images: ProductImage[];
	isLike: number;
	totalComment: number;
	videos: Video[];
	status: number;
	isEnableBuyNow: boolean;
	updatedStatusAt: string;
	condition: number;
	availability: number;
	availabilityDate: string;
	expirationDate: string;
	price: number;
	priceTo: number;
	categoryIds: number[];
	categoryId: number;
	categoryName: string;
	madeinId: number;
	brandId: number;
	brandName: string;
	modelId: number;
	modelName: string;
	shippingWeight: number;
	shippingLength: number;
	shippingWidth: number;
	shippingHeight: number;
	shippingFrom: ProductShippingFrom;
	shippingFromIds: number[];
	shippingTo: ProductShippingTo;
	shippingToIds: number[];
	createdAt: string;
	updatedAt: string;
	sku: string;
	merchantId: number;
	properties: ProductProperties[];
	variations: ProductVariation[];
	variationConfigs: VariantConfigs;
	isValid: boolean;
	importTaskId: number;
	hasWarranty: boolean;
	warranty: ProductWarranty;
	comboVariations: ComboVarianModel[];
	productType: number;
	statusBeforeDelete: number;
	statusReviewing: number;
	statusReviewingUpdatedAt: string;
	statusReviewingDescription: string;
	feeShip?: number;
	averageStar?: number;
	promotions: Array<PromotionInfo>;
	categoryUrlSlug?: string;
	variantImage?: any;
	totalLike?: number;
	totalShare?: number;
	totalSold?: number;
	totalStock?: number;
}

export interface IMerchantSearch {
	docCount?: number;
	id?: number;
	value?: string;
	name?: string;
}
export interface ProductViewES {
	id: number;
	title: string;
	merchant: ProductMerchantModel;
	promotions: ProductPromotionsES[];
	totalSold: number;
	feeShip: number;
	isLike: boolean;
	layoutType?: number;
	averageStar: number;
	averageRating: number;
	totalStock?: number;
	totalComment: number;
	availability: number;
	availabilityDate: string;
	expirationDate: string;
	price: number;
	priceTo: number;
	categoryIds: number[];
	categoryFullPath: number[];
	categoryId: number;
	partnerCategoryId: number;
	categoryName: string;
	merchantId: number;
	madeinId: number;
	brandId: number;
	partnerBrandId: number;
	brandName: string;
	modelId: number;
	modelName: string;
	sku: string;
	variations: ProductVariation[];
	variationConfigs: VariantConfigs;
	isValid: boolean;
	urlSlug: string;
	importTaskId: number;
	hasWarranty: boolean;
	warranty: ProductWarranty;
	isEnableBuyNow: boolean;
	brandRangeType: number;
	brandRangeId: number;
	brandRangeName: string;
	sessionId: string;
	comboVariations: number[];
	productType: number;
	AverageRating: number;
	categoryUrlSlug: string;
	totalRating: number;
	propertyFeatured: Array<string>;
	isPromoteStarted?: boolean;
}

export interface ParamLikeProduct {
	productId?: number;
	content?: string;
	evnShare?: number;
	merchantId?: number;
}

export interface IProductVariation {
	id?: number;
	productTitle?: string;
	variations?: ProductVariation[];
	variationConfigs?: VariantConfigs;
	promotions?: Array<{
		promotions: ProductItemPromotion[];
		productId?: number;
		variationId?: number;
	}>;
	merchantId?: number;
	categoryId?: number;
	productType?: number;
	brandId?: number;
	urlSlug?: string;
	categoryUrlSlug?: string;
}

export interface IDetailVariationProduct {
	productId?: number;
	variationId?: number;
	discountValue?: number;
	titlePromotion?: string[];
	promotionDealSock?: IDealShock;
	price?: number;
	pricePromote?: number;
	moduleType?: number;
	sku?: string;
	propertyValueId1?: number;
	propertyValueName1?: string;
	propertyValueId2?: number;
	propertyValueName2?: string;
	variationImage?: string;
	quantities?: IQuantity[];
	totalQuantity?: number;
	isEnabled?: boolean;
}

export interface IDealShock {
	variationId?: number;
	title?: string;
	totalQuantity?: number;
	price?: number;
	pricePromote?: number;
	discountValue?: number;
	slot?: number[];
	startDate?: string;
	endDate?: string;
	quantity?: number;
	configRemainQuantity?: number;
	remainDuration?: number;
}

export interface IQuantity {
	warehouseId?: string;
	warehouseName?: string;
	warehouseAddress?: string;
	provinceId?: number;
	districtId?: number;
	combineProvinceIdDistrictId?: string;
	quantity?: number;
}
