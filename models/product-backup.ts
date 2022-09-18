import React from 'react';

import { AvatarImageModel, Configs, ProductImage, PropertyAggResult, Video } from './common';

export type ConditionReturnData = {
	productHasPromotion: boolean | string;
	productNormal?: boolean | string;
	singleVariant?: boolean | string;
	productHasDealShock?: boolean | string;
};

export interface IProductDetailProps {
	productDetails: Product;
	ratingStar?: any;
	options?: {
		params: { typeSimilar?: Product[]; typeAlsoView?: Product[] };
		isActive: boolean;
	};
}
// export type TypeMedia = 'mainImage' | 'sellingPoints' | 'video' | 'otherImage';
export type TypeMedia = 1 | 2 | 3 | 10;
export interface IPropsProductMedia {
	typeMedia?: TypeMedia;
	url: string;
	isVideo?: boolean;
	optionOther?: {
		isActive: boolean;
		total: any;
	};
	OnOpenModalDetail?: React.MouseEventHandler;
}

export interface Product {
	configDetailLayout: number;
	id: number;
	title: string;
	categoryUrlSlug: string;
	description: string;
	merchant: ProductMerchantModel;
	content: string;
	averageRating: number;
	urlSlug: string;
	promotions: ProductPromotions[];
	images: ProductImage[];
	isLike: boolean;
	totalComment: number;
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
	totalSold?: number;
}

export interface PromotionInfo {
	discountValue?: number;
	moduleType?: number;
	price?: number;
	pricePromote?: number;
	productId?: number;
	variationId?: number;
}

export interface MerchantProduct {
	id?: number;
	name?: string;
	merchantId?: number;
	avatarImage?: IAvatarImage;
	address?: string;
	type?: number;
}

export interface IAvatarImage {
	name?: string;
	description?: string;
	filePath?: string;
	fileExtension?: string;
}

export interface Merchant {
	address: string;
	avatarImage: {
		description: string;
		fileExtension: string;
		filePath: string;
		name: string;
	};
	id: string;
	merchantId: number;
	name: string;
	type: number;
}

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
	propertyOriginalValue: string;
	propertyName: string;
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
}

export interface WareHouse {
	warehouseId: string;
	warehouseName: string;
	warehouseAddress: string;
	provinceId: number;
	districtId: number;
	quantity: number;
}

export interface VariantConfigs {
	isSingleVariation: boolean;
	configs: Configs[];
}

export interface ComboVarianModel {
	variantId: number;
	quantity: number;
}

export interface ProductWarranty {
	warrantyId: number;
	warrantyPolicy: string;
	warrantyForm: number[];
}

export interface ProductAggResult {
	brands: ProductAggResult[];
	categories: ProductAggResult[];
	properties: PropertyAggResult[];
}

export interface ProductMerchantModel {
	id: string;
	merchantId: number;
	userId: string;
	name: string;
	avatarImage: AvatarImageModel;
	address: string;
	type: number;
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

export interface ProductPromotion {
	variants: VarianPromotion[];
	productId: number;
	brandId: number;
	categoryId: number;
	productName: string;
	sku: string;
	discountValueUpTo: number;
	pricePromote: number;
}
export interface ProductPromotions {
	moduleType: number;
	productPromotion: ProductPromotion;
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
	subItem: ProductPromotion[];
	titlePromotion: string;
	title: string;
}

export interface ProductUpdateModel {
	id: number;
	title: string;
	description: string;
	content: string;
	urlSlug: string;
	images: ProductImage[];
	videos: Video[];
	status: number;
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
	hasWarranty: boolean;
	warranty: ProductWarranty;
	updatedStatusAt: string;
	statusBeforeDelete: number;
	comboVariations: ComboVarianModel[];
	productType: number;
}

export interface ProductViewES {
	id: number;
	title: string;
	merchant: ProductMerchantModel;
	promotions: ProductPromotions[];
	totalSold: number;
	feeShip: number;
	isLike: number;
	averageStar: number;
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
}

export interface ParamSearchProduct {
	keyword?: string;
	filters?: any;
	price?: Array<number>;
	categoryId?: any;
	brandIds?: any;
	isValid?: boolean;
	isFlashSale?: boolean;
	flashSaleStatus?: number;
	provinceId?: number;
	districtIds?: any;
	ratingTypes?: Array<number>;
	pageIndex?: number;
	pageSize?: number;
}

export interface SearchAggregation {
	brands?: Array<Property>;
	categories?: Array<Property>;
	properties?: Array<PropertyValue>;
	maxPrice?: number;
}

export interface Property {
	id?: number;
	name?: string;
	value?: string;
	docCount?: number;
}

export interface PropertyValue {
	propertyValues?: Array<Property>;
	type?: number;
	id?: number;
	name?: string;
	docCount: number;
	propertyRangeValues?: Array<Property>;
}

export interface IProductSearch {
	id: number;
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
	merchant?: MerchantProduct;
	averageStar?: number;
	promotions: Array<PromotionInfo>;
	categoryUrlSlug?: string;
}

export interface IMerchantSearch {
	docCount?: number;
	id?: number;
	value?: string;
	name?: string;
}

export interface IPropertyOrther extends Property {
	propertyRangeValues?: Array<Property>;
	propertyValues?: Array<Property>;
}
