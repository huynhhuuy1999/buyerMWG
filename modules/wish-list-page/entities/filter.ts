export class BaseFilter {
	[x: string]: any;
	constructor(props: any) {
		this.brands = props?.brands ?? [];
		this.categories = props?.categories ?? [];
	}
}

export class FilterProductFavorite extends BaseFilter {
	[x: string]: any;
	constructor(props: any) {
		super(props);
		this.maxPrice = props?.maxPrice ?? 1000000;
		this.minPrice = props?.minPrice ?? 0
	}
}

export class FilterMerchantFavorite extends BaseFilter {
	[x: string]: any;
	constructor(props: any) {
		super(props);
		this.place = props?.place ?? [];
	}
}
