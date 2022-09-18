export interface InterParamsViewList {
	page?: number;
	pageIndex?: number;
	pageSize: number;
}

export interface InterPagingViewList extends InterParamsViewList {
	totalObject?: number;
}
export interface PropsViewList {
	data: Array<any>;
	pageSize: number;
	page: number;
	loading: boolean;
	ref?: any;
	setItem: Function;
	totalObject: number;
	className?: string;
	changePage?: Function;
	setLoadingCard: Function;
	isOverFlow?: boolean;
	showPagination?: boolean;
}

export * from './ViewList';
export { default as ViewListMobile } from './ViewList.mobile';
