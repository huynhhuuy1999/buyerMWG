// import { GeoLocation, AvatarImageModel } from './common';

export interface CategoryConfig {
	displayColumn: number;
	isBuyNow: boolean;
	layoutType: number;
}

export interface Category {
	children: any;
	id: number;
	name: string;
	shortName: string;
	urlSlug: string;
	parentId: number;
	hasChildren: boolean;
	title: string;
	description: string;
	image: string;
	tag: string;
	displayOrder: number;
	isEnableBuyNow: boolean;
	level: number;
	configs: CategoryConfig;
}

export type CategoryCreateOrUpdateCommand = {
	id: number;
	name: string;
	shortName: string;
	urlSlug: string;
	parentId: number;
	hasChildren: boolean;
	title: string;
	description: string;
	image: string;
	tag: string;
	displayOrder: number;
	isEnableBuyNow: boolean;
	level: number;
	readOnly: true;
	configs: CategoryConfig;
};

export type CategoryViewModel = {
	id: number;
	level: number;
	name: string;
	nameEn: string;
	shortName: string;
	shortNameEn: string;
	title: string;
	titleEn: string;
	urlSlug: string;
	description: string;
	descriptionEn: string;
	image: string;
	tag: string;
	tagEn: string;
	children: Array<any>;
	displayOrder: number;
	isEnableBuyNow: boolean;
	last?: boolean;
};

export interface ServiceCategory {
	id: number;
	image: string;
	name: string;
	parentId: number;
	urlSlug: string;
}

export interface BannerSlides {
	description: string;
	displayOrder: number;
	id: number;
	imageUrl: string;
	objectId: number;
	objectType: string;
	type: string;
}
