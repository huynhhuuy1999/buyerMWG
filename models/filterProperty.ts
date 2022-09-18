export interface IResponseSearchAggregation {

    brands: IFilterBrand[];
    merchants: IFilterMerchant[];
    categories: IFilterCategory[];
    properties: IFilterProperty[];
    priceStep: number;
    maxPrice: number;


}

export interface IFilterProperty {
    id: number;
    name: string;
    type: number;
    propertyValues: IFilterPropertyValue[];
    docCount: number;
}

export interface IFilterPropertyValue {
    id: number;
    name: string;
    rangeValueId?: number;
    rangeValueName?: string;
    rangeValueType: number;
    value: string;
    docCount: number;
    getId?: () => string;
    getName?: () => string;
}

export interface IFilterCategory {
    id: number;
    name: string;
    value: string;
    docCount: number;
}

export interface IFilterMerchant {
    id: number;
    type: number;
    name: string;
    value: string;
    docCount: number;
    portalLink: string;
    totalRating: number;
    averageRating: number;
}

export interface IFilterBrand {
    id: number;
    name: string;
    rangeValueType: number;
    rangeValueId: number;
    rangeValueName: string;
    value: string;
    docCount: number;
    getId: () => string;
    getName: () => string;
}
