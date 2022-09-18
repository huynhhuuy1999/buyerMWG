import { TYPE_FILTER_PARAM } from 'enums';
import {
	IFilterBrand,
	IFilterCategory,
	IFilterMerchant,
	IFilterProperty,
	IFilterPropertyValue,
	IResponseSearchAggregation,
} from 'models';

type EmtypeFalsy = null | undefined;

const MAX_VALUE_MONEY = 1000000;
const VALUE_STEP_MONEY = 100000;
const DEFAULT_EMPTY_VALUE = {
	string: '',
	number: 0,
	boolean: false,
	array: [],
	object: {},
};

export class ResponseFilterProperty {
	[x: string]: any;

	constructor(props: EmtypeFalsy | IResponseSearchAggregation) {
		this.brands =
			props?.brands?.map((t: IFilterBrand) => new BrandFilter(t)) ?? DEFAULT_EMPTY_VALUE.array;
		this.properties =
			props?.properties?.map((t: IFilterProperty) => new PropertiesFiller(t)) ??
			DEFAULT_EMPTY_VALUE.array;
		this.maxPrice = props?.maxPrice ?? MAX_VALUE_MONEY;
		this.priceStep = props?.priceStep ?? VALUE_STEP_MONEY;
		this.categories =
			props?.categories?.map((cate: IFilterCategory) => new FilterCategory(cate)) ??
			DEFAULT_EMPTY_VALUE.array;
		this.merchants =
			props?.merchants.map((item: IFilterMerchant) => new FilterMerchant(item)) ??
			DEFAULT_EMPTY_VALUE.array;
	}
}

export class BrandFilter {
	[x: string]: any;
	constructor(props: EmtypeFalsy | IFilterBrand) {
		this.docCount = props?.docCount ?? DEFAULT_EMPTY_VALUE.number;
		this.id = props?.id ?? DEFAULT_EMPTY_VALUE.number;
		this.name = props?.name ?? DEFAULT_EMPTY_VALUE.string;
		this.rangeValueId = props?.rangeValueId ?? DEFAULT_EMPTY_VALUE.number;
		this.rangeValueName = props?.rangeValueName ?? DEFAULT_EMPTY_VALUE.string;
		this.rangeValueType = props?.rangeValueType ?? TYPE_FILTER_PARAM.VALUE;
		this.value = props?.value ?? DEFAULT_EMPTY_VALUE.string;
	}
	getId(): string {
		if (this.rangeValueType === TYPE_FILTER_PARAM.RANGE_VALUE) {
			return `${this.rangeValueId}#${TYPE_FILTER_PARAM.RANGE_VALUE}`;
		}
		return `${this.id}#${TYPE_FILTER_PARAM.VALUE}`;
	}

	getName(): string {
		return this.rangeValueType === TYPE_FILTER_PARAM.RANGE_VALUE ? this.rangeValueName : this.name;
	}
}
export class PropertiesFiller {
	[x: string]: any;
	constructor(props: EmtypeFalsy | IFilterProperty) {
		this.docCount = props?.docCount ?? DEFAULT_EMPTY_VALUE.number;
		this.id = props?.id ?? DEFAULT_EMPTY_VALUE.number;
		this.name = props?.name ?? DEFAULT_EMPTY_VALUE.string;
		this.propertyValues =
			props?.propertyValues?.map(
				(t: IFilterPropertyValue) => new PropertyValueFiller(t, this.id),
			) || new PropertyValueFiller(null);
		this.type = props?.type ?? 0;
	}
}

export class PropertyValueFiller {
	[x: string]: any;
	constructor(
		props: EmtypeFalsy | IFilterPropertyValue,
		parentId: number = DEFAULT_EMPTY_VALUE.number,
	) {
		this.docCount = props?.docCount ?? DEFAULT_EMPTY_VALUE.number;
		this.id = props?.id ?? DEFAULT_EMPTY_VALUE.number;
		this.rangeValueId = props?.rangeValueId ?? DEFAULT_EMPTY_VALUE.number;
		this.name = props?.name ?? DEFAULT_EMPTY_VALUE.string;
		this.rangeValueName = props?.rangeValueName ?? DEFAULT_EMPTY_VALUE.string;
		this.rangeValueType = props?.rangeValueType ?? TYPE_FILTER_PARAM.VALUE;
		this.parentId = parentId;
		this.value = props?.value ?? DEFAULT_EMPTY_VALUE.string;
	}
	getId() {
		if (this.rangeValueType === TYPE_FILTER_PARAM.RANGE_VALUE) {
			return `prop_${this.parentId}:[${this.rangeValueId}#${this.rangeValueType}]`;
		}
		return `prop_${this.parentId}:[${this.id}#${this.rangeValueType}]`;
	}
	getName() {
		return this.rangeValueType === Number(TYPE_FILTER_PARAM.RANGE_VALUE)
			? this.rangeValueName
			: this.name;
	}
}

export class FilterCategory {
	[x: string]: any;
	constructor(props: EmtypeFalsy | IFilterCategory) {
		this.id = props?.id ?? DEFAULT_EMPTY_VALUE.number;
		this.name = props?.name ?? DEFAULT_EMPTY_VALUE.string;
		this.value = props?.value ?? DEFAULT_EMPTY_VALUE.string;
		this.docCount = props?.docCount ?? DEFAULT_EMPTY_VALUE.number;
	}
}

export class FilterMerchant {
	[x: string]: any;
	constructor(props: EmtypeFalsy | IFilterMerchant) {
		this.id = props?.id ?? DEFAULT_EMPTY_VALUE.number;
		this.name = props?.name ?? DEFAULT_EMPTY_VALUE.string;
		this.value = props?.value ?? DEFAULT_EMPTY_VALUE.string;
		this.docCount = props?.docCount ?? DEFAULT_EMPTY_VALUE.number;
		this.type = props?.type ?? DEFAULT_EMPTY_VALUE.number;
		this.portalLink = props?.portalLink ?? DEFAULT_EMPTY_VALUE.number;
		this.totalRating = props?.totalRating ?? DEFAULT_EMPTY_VALUE.number;
		this.averageRating = props?.averageRating ?? DEFAULT_EMPTY_VALUE.number;
	}
}
