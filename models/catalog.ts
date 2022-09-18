export interface Hierachy {
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
	children: Hierachy[];
	displayOrder?: number;
	isEnableBuyNow?: boolean;
}

export interface SearchSuggestion {
	brandId?: number;
	brandName?: string;
	categoryId?: string;
	id?: string;
	isActived?: boolean;
	keywords?: string;
	keywordsEn?: string;
	type?: number;
	value?: string;
}
