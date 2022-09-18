export interface ShopInterface {
	addedProduct: boolean;
	address: string;
	avatarImage: string;
	businessSectors: string;
	code: string;
	companyName: string;
	createdAt: string;
	description: string;
	email: string;
	extra: ExtraShopInterface;
	follow: number;
	id: string;
	like: number;
	merchantId: number;
	merchantRef: string;
	mobilePhone: string;
	name: string;
	portalLink: string;
	process: number;
	profileProgress: number;
	referralLink: string;
	representativeName: string;
	representativePosition: string;
	requireNote: string;
	selled: boolean;
	status: number;
	taxCode: string;
	type: number;
	typeOfBusiness: number;
	updatedAt: string;
	urlSlug: string;
	userId: string;
	version: number;
}

export interface ExtraShopInterface {
	averageRating: number;
	lastOnline: string;
	totalFollow: number;
	totalLike: number;
	totalProduct: number;
	totalRating: number;
	totalStore: number;
	totalVisitor: number;
}

export interface ShopTemplateInterface {
	byDefaultId: any;
	createdAt: string;
	createdBy: string;
	id: string;
	isActive: boolean;
	isDelete: boolean;
	merchantId: number;
	name: string;
	sessions: SessionTemplate[];
	updatedAt: string;
	updatedBy: string;
	version: number;
}

export interface SessionTemplate {
	apiConfig: string;
	auto: boolean;
	bannerConfigs?: BannerTemplate[];
	catalogAction?: string;
	catalogImage?: string;
	categoryId?: number;
	dealSocPercent?: any;
	discountPercent?: any;
	displayOrder: number;
	filters?: any;
	hasFilter?: boolean;
	isActive?: boolean;
	name: string;
	productIds: number[];
	promotionPercent?: any;
	promotionProgram?: number;
	shopCatalogs?: any;
	sortProduct?: any;
	typeSession: number;
}

export interface BannerTemplate {
	displayOrder: number;
	name?: string;
	typeBanner?: number;
	urlAction?: string;
	urlBanner?: string;
	imageUrl?: string;
	description?: string;
	id?: number;
	objectId?: number;
	objectType?: 'string';
	type?: number;
}
export interface ParamLikeShop {
	merchantId?: number;
}
