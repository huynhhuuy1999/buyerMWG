import { IProductSearch, ProductViewES } from './product';
export interface IParamsBrands {
	page: number;
	pageSize: number;
}
export interface ParamSearchBrand {
	keyword: string;
	page: number;
	pageSize: number;
}
export interface IBrand {
	id: number;
	name: string;
	urlSlug: string;
	description: string;
	tags: string;
	image: string;
	brandRangeId: number;
	type?: number;
}

export interface IBrandCategory {
	id: number;
	categoryId: number;
	brandId: number;
	displayOrder: number;
}

export interface IBrandCategoryCreateOrUpdateCommand {
	id: number;
	categoryId: number;
	brandId: number;
	displayOrder: number;
}

export interface IBrandCreateOrUpdateCommand {
	id: number;
	name: string;
	urlSlug: string;
	description: string;
	tags: string;
	image: string;
	brandRangeId: number;
}

export interface IBrandsMerchant {
	merchantId: number;
	brands: IBrand[];
}

export interface IBrandViewES {
	toTalProduct: number;
	toTalStore: number;
	toTalLike: number;
	typicalProducts: ProductViewES[];
	id: number;
	name: string;
	urlSlug: string;
	description: string;
	tags: string;
	image: string;
	brandRangeId: number;
}

export interface IBrandSuggest {
	avatarImage?: IAvartar;
	isLiked?: boolean;
	merchantId?: number;
	minPrice?: number;
	name?: string;
	portalLink?: string;
	products?: IProductSearch[];
	sessionId?: string;
	totalLike?: number;
	totalProduct?: number;
	totalRating?: number;
	type?: number;
	warehouseImage?: string;
	averageRating?: number;
}

export interface IAvartar {
	description?: string;
	fileExtension?: string;
	filePath?: string;
	name?: string;
}
