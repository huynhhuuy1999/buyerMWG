import { QueryParams } from './common';

export interface RulesComment {
	parentCommentId?: string;
	ratingId?: string;
	content?: string;
	media?: MediaRules[];
	listCommentDetail?: any;
	targetUserId?: string;
	productId?: number;
	isQuestion?: boolean;
	listComment?: any;
	analysisComment?: any;
	id?: string;
	commentDetailById?: any;
	commentDetail?: any[];
	totalCommentParent?: number;
	dataRender?: RulesDataComment[];
	item?: any;
	dataLike?: any;
}
export interface RulesDataComment {
	commentParent?: CommentParent;
	children?: CommentParent;
	isShowInput?: Boolean;
	media?: Media;
	params?: QueryParams;
	userInfo?: any;
}
export interface MediaRules {
	name?: string;
	description?: string;
	filePath?: string;
	mediaType?: number;
}

// export interface QueryParams {
// 	parentCommentId?: string;
// 	pageSize?: number;
// 	pageIndex?: number;
// }

export interface CommentParent {
	content?: string;
	createdAt?: string;
	id?: string;
	isLike?: number;
	isQuestion?: true;
	media?: MediaRules;
	parentCommentId?: string;
	productId?: number;
	ratingId?: string;
	sumComment?: number;
	targetUserInfo?: TargetUserInfo;
	totalLike?: number;
	upadtedAt?: string;
	userInfo?: UserInfo;
	children?: any;
}

export interface TargetUserInfo {
	fullName: string;
	urlImage: string;
}
export interface UserInfo {
	userId: string;
	fullName: string;
	urlImage: string;
}

export interface Media {
	media: MediaRules[];
	key?: string;
}
