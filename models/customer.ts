export interface QueryParams {
	pageIndex?: number;
	pageSize?: number;
}

export interface CancelOrderReason {
	key: number;
	value: string;
}

export interface MerchantInfo {
	merchantId?: number;
	name?: string;
	pathImage?: string;
	statusRating?: number;
}

export interface ProductInfo {
	productId?: number;
	productName?: string;
	variantImage?: string;
	statusRating?: number;
}
export interface Customer {
	subOrderId?: string;
	userId?: string;
	merchantInfo: MerchantInfo;
	productInfo: ProductInfo;
	status?: number;
	createdAt?: string;
	updateAt?: string;
	waitingListId?: string;
	productId?: number;
	ratingStar?: number;
	name?: string;
	description?: string;
	filePath?: string;
	mediaType?: number;
	parentCommentId?: string;
	ratingId?: string;
	content?: string;
	targetUserId?: string;
	isQuestion?: boolean;
	merchants?: any;
	products?: any;
	totalObject?: number;
}

export interface MediaRules {
	name?: string;
	description?: string;
	filePath?: string;
	mediaType?: number;
}

export interface CommentRules {
	content?: string;
	media?: MediaRules;
}
export interface CustomerCancel {
	productId?: number;
	waitingListId?: string;
	typeCancel?: number;
}

export interface FileUpload {
	fullPath: string;
	filePath: string;
	fileName: string;
	fileExtension: string;
	base64: string;
}
