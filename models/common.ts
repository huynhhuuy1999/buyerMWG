import { NextPage } from 'next';
import { AppProps } from 'next/app';
import { ReactElement, ReactNode } from 'react';

export interface LayoutProps {
	children: ReactNode;
	title?: string;
}

export type NextPageWithLayout = NextPage & {
	Layout?: (props: LayoutProps) => ReactElement;
};

export type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout;
	pageProps: any;
	userAgent: string;
};

export interface BaseResponse<T> {
	header: string;
	code: string;
	subCode: string;
	message: string;
	data: T | T[];
	isError: boolean;
	totalObject: number;
	page: number;
	pageSize: number;
	totalPage: number;
	totalRemain: number;
}

export interface ProvinceResponse {
	countryId: number;
	countryName: string;
	provinceId: number;
	provinceName: string;
	provinceCode: string;
}
export interface WardResponse {
	countryId?: number;
	countryName?: string;
	provinceId?: number;
	provinceName?: string;
	provinceCode?: string;
	districtId?: number;
	districtName?: string;
	wardId: number;
	wardName: string;
	wardCode?: string;
	districtCode?: string;
}
export interface DistrictResponse {
	countryId?: number;
	countryName?: string;
	provinceId?: number;
	provinceName?: string;
	provinceCode?: string;
	districtId: number;
	districtName: string;
	districtCode?: string;
	children?: Array<{
		wardId: number;
		wardName: string;
	}>;
}

export interface ProductImage {
	content: string;
	description: string;
	caption: string;
	type: number;
	order: number;
	isVideos: boolean;
}

export interface MerchantModel {
	avatarImage: string;
	isGuaranteed: boolean;
	merchantId: number;
	name: string;
	portalLink: string;
	warehouseId: string;
}

export interface AvatarImageModel {
	name: string;
	description: string;
	filePath: string;
	fileExtension: string;
	fullPath: string;
	mediaType: number;
}

export interface Video {
	content: string;
	description: string;
	caption: string;
	isVideos: boolean;
}

export interface FileProperties {
	name: string;
	description: string;
	filePath: string;
	fullPath: string;
	fileExtension: string;
}

export interface GeoLocation {
	lat: number;
	lon: number;
}

export interface Configs {
	order: number;
	propertyId: number;
	propertyName: string;
	type: number;
	propertyValues: PropertyValueExtension[];
}

export interface PropertyValueExtension {
	propertyValueId: string;
	propertyValueName: string;
	originalValue: string;
	value: string;
	propertyValueCustom: string;
	propertyValueImage: string;
	isDataFromServer: boolean;
	propertyValueType: number;
	propertyValueRangeId: number;
	propertyValueRangeName: string;
}

export interface ObjectAggResult {
	id: number;
	name: string;
	value: string;
}

export interface PropertyAggResult {
	id: number;
	name: string;
	type: number;
	propertyValues: ObjectAggResult[];
}
export interface QueryParams {
	page?: number;
	pageIndex?: number;
	pageSize?: number;
	parentCommentId?: string;
	query?: string;
	keyword?: string;
	fullTextSearch?: string;
	indexClick?: number;
	keywordClick?: string;
	filter?: string[];
	price?: number[];
	categoryId?: number[];
	brandIds?: string[];
	productId?: number;
	commentId?: string;
	sessionId?: string;
	variationIds?: string;
}

export interface Province {
	countryId: number;
	countryName: string;
	provinceId: number;
	provinceName: string;
	provinceCode: string;
}

export interface ProvinceTree {
	provinceId: number;
	provinceName: string;
	children: Array<{
		displayOrder?: number;
		districtId?: number;
		districtName?: string;
		code?: string;
		name: string;
	}>;
	name: string;
}

export interface PaymentMethod {
	id: number;
	image: string;
	title: string;
	sub: string;
	payDefault: boolean;
	discount: boolean;
	minAmount?: number;
	maxAmount?: number;
}
export interface Route {
	path: string;
	key: string;
	breadcrumbs: Breadcrumb | Breadcrumb[];
}

export interface Breadcrumb {
	name: string;
	urlSlug: string;
}

export interface ILocation {
	latitude?: number;
	longitude?: number;
}

export interface ProvinceParams {
	country_id?: number;
	q?: string;
	sort?: string;
}

export interface DistrictParams {
	country_id?: number;
	province_id?: number;
	q?: string;
}

export interface WardParams {
	country_id?: number;
	province_id?: number;
	district_id?: number;
	q?: string;
}

export interface IDropdownValue {
	id?: number;
	label?: string;
	selected?: boolean;
}

export interface IVersion {
	createdAt: string;
	id: string;
	updateAt: string;
	versionCategory: number;
	versionProvince: number;
	versionWarranty: number;
}

export enum BannerType {
	HOME_BANNER_TOP_RIGHT = 'HOME_BANNER_TOP_RIGHT',
	HOME_BANNER_BOTTOM_RIGHT = 'HOME_BANNER_BOTTOM_RIGHT',
}

export interface HomeSessionProps {
	data: any | any[];
}

export enum ShowCatalog {
	fromBottom = 'bottom',
	fromLeft = 'left',
	hidden = 'hidden',
	normal = 'normal',
}

export type ICartFormProps = {
	location?: {
		lat: number;
		lon: number;
	};
	gender?: number;
	companyName?: string;
	contactName?: string;
	companyAddress?: string;
	mobileNumber?: string;
	typeShipping?: number; //NOTE : this field use for hourOffices from api
	paymentType?: number;
	provinceId?: number;
	hourOffice?: boolean;
	paymentMethods?: PaymentMethod[] | null;
	districtId?: number;
	companyTaxCode: string;
	wardId?: number;
	receiveMyAddress?: boolean;
	pickupStoreId?: string;
	isCompany?: boolean;
	isLoadingCart?: boolean;
	address?: string;
	note?: string;
};
