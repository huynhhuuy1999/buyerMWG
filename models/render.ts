export interface BackgroundImage {
	center: boolean;
	cover: boolean;
	fullWidth: boolean;
	repeat: boolean;
	url: string;
}

export interface Src {
	url: string;
	width: string | number;
	height: string | number;
	maxWidth?: string;
	autoWidth?: boolean;
}

export interface Href {
	name: string;
	values: {
		href: string;
		target: string;
	};
}

export interface Menu {
	items: {
		key: string;
		link: Href;
		text: string;
	}[];
}

export interface Border {
	borderTopWidth?: string;
	borderTopColor?: string;
	borderTopStyle?: string;
	borderRightWidth?: string;
	borderRightColor?: string;
	borderRightStyle?: string;
	borderBottomWidth?: string;
	borderBottomColor?: string;
	borderBottomStyle?: string;
	borderLeftWidth?: string;
	borderLeftColor?: string;
	borderLeftStyle?: string;
}

export interface FontFamily {
	defaultFont: boolean;
	label: string;
	url: string;
	value: string;
}

export interface ButtonColor {
	color: string;
	backgroundColor: string;
	hoverColor: string;
	hoverBackgroundColor: string;
}

export interface ResponseProperties<T> {
	code: string;
	message: string;
	data: T;
	is_error?: boolean;
	isError?: boolean;
	total_object?: number;
	totalObject?: number;
	page?: number;
	pageSize?: number;
	totalPage?: number;
	headers?: any;
	isEmpty?: boolean;
}

export interface Pagination {
	page: number;
	pageSize: number;
	totalObject: number;
	totalPage: number;
}

export interface RowValues {
	displayCondition: null | string;
	columns: boolean;
	backgroundColor: string;
	columnsBackgroundColor: string;
	backgroundImage: {
		url: string;
		fullWidth: boolean;
		repeat: boolean;
		center: boolean;
		cover: boolean;
		width?: number | string;
		height?: number | string;
	};
	backgroundRepeat?: string;
	backgroundPosition?: string;
	padding: string;
	anchor: string;
	hideDesktop: boolean;
	_meta: {
		htmlID: string;
		htmlClassNames: string;
	};
	selectable: boolean;
	draggable: boolean;
	duplicatable: boolean;
	deletable: boolean;
	hideable: boolean;
	hideMobile: boolean;
	noStackMobile: boolean;
}

export interface ColumnValues {
	_meta?: {
		htmlID: string;
		htmlClassNames: string;
	};
	border?: Record<string, unknown>;
	padding?: string;
	backgroundColor?: string;
}

export interface ContentValues {
	containerPadding?: string;
	anchor?: string;
	menu?: {
		items: {
			key: string;
			link: {
				name: string;
				values: {
					href: string;
					target: string;
				};
			};
			text: string;
		}[];
	};
	href?: {
		name: string;
		values: {
			href: string;
			target: string;
		};
	};
	fontFamily?: {
		label?: string;
		value?: string;
		url?: string;
		defaultFont?: boolean;
	};
	src?: Src;
	border?: Border;
	action?: {
		name: string;
		values: {
			href: string;
			target: string;
		};
	};
	linkStyle?: {
		inherit: boolean;
		linkColor: string;
		linkHoverColor: string;
		linkUnderline: boolean;
		linkHoverUnderline: boolean;
	};
	buttonColors?: {
		color: string;
		backgroundColor: string;
		hoverColor: string;
		hoverBackgroundColor: string;
	};
	size?: {
		autoWidth: boolean;
		width: string;
	};
	borderRadius?: string;
	text?: string;
	lineHeight?: string;
	color?: string;
	altText?: string;
	width?: string;
	textAlign?: string;
	fontSize?: string;
	textColor?: string;
	linkColor?: string;
	align?: string;
	layout?: string;
	separator?: string;
	padding?: string;
	hideDesktop?: boolean;
	displayCondition?: null | string;
	_meta?: {
		htmlID: string;
		htmlClassNames: string;
	};
	_override?: {
		mobile: {
			src?: {
				maxWidth: string;
				autoWidth: boolean;
			};
			textAlign?: string;
		};
	};
	selectable?: boolean;
	draggable?: boolean;
	duplicatable?: boolean;
	deletable?: boolean;
	hideable?: boolean;
	hideMobile?: boolean;
	calculatedWidth?: number | string;
	calculatedHeight?: number | string;
	voucher?: {
		actionName: string;
		tag: number[];
		title: string;
		expiredDate: string;
		image: string;
		altText: string;
		voucherId: string;
		minOrder: number;
	};
}

export interface BodyValues {
	backgroundColor: string;
	backgroundImage: {
		url: string;
		fullWidth: boolean;
		repeat: boolean;
		center: boolean;
		cover: boolean;
	};
	borderRadius: string;
	contentAlign: string;
	contentVerticalAlign: string;
	contentWidth: string;
	fontFamily: FontFamily;
	linkStyle: {
		body: boolean;
		linkColor: string;
		linkHoverColor: string;
		linkUnderline: boolean;
		linkHoverUnderline: boolean;
	};
	popupBackgroundColor: string;
	popupBackgroundImage: {
		url: string;
		fullWidth: boolean;
		repeat: boolean;
		center: boolean;
		cover: boolean;
	};
	popupCloseButton_action: {
		name: string;
		attrs: {
			onClick: string;
		};
	};
	popupCloseButton_backgroundColor: string;
	popupCloseButton_borderRadius: string;
	popupCloseButton_iconColor: string;
	popupCloseButton_margin: string;
	popupCloseButton_position: string;
	popupHeight: string;
	popupOverlay_backgroundColor: string;
	popupPosition: string;
	popupWidth: string;
	preheaderText: string;
	textColor: string;
	_meta: { htmlID: string; htmlClassNames: string };
}
export interface IRequestUploader {
	service_name: string; //product
	product_id: number; //1
}

export interface BodyRender {
	id: string;
	rows: RowRender[];
	values: BodyValues;
	location: {
		collection: string;
		id: string;
	};
}

export interface RowRender {
	id: string;
	cells: number[];
	columns: ColumnRender[];
	values: RowValues;
	location: {
		collection: string;
		id: string;
	};
}

export interface ColumnRender {
	id: string;
	contents: ContentRender[];
	values: ColumnValues;
	location: {
		collection: string;
		id: string;
	};
}

export interface ContentRender {
	id: string;
	type: string;
	location: {
		collection: string;
		id: string;
	};
	values: ContentValues;
}

export interface BodyDesign {
	rows: string[];
	values: BodyValues;
	location: {
		collection: string;
		id: string;
	};
	id: string;
}

export interface RowDesign {
	cells: number[];
	columns: string[];
	values: RowValues;
	location: {
		collection: string;
		id: string;
	};
	id: string;
}

export interface ColumnDesign {
	contents: string[];
	values: ColumnValues;
	location: {
		collection: string;
		id: string;
	};
	id: string;
}
export interface ContentDesign {
	type: string;
	values: ContentValues;
	location: {
		collection: string;
		id: string;
	};
	id: string;
}

export interface IdCounters {
	u_row: number;
	u_column: number;
	u_content_menu?: number;
	u_content_text?: number;
	u_content_image?: number;
	u_content_button?: number;
	u_content_social?: number;
	u_content_divider?: number;
}

export interface UsageCounters {
	u_content_divider: number;
	u_content_menu: number;
	u_content_image: number;
	u_content_text: number;
	u_content_button: number;
	u_content_social: number;
	u_column: number;
	u_row: number;
	u_body: number;
	u_page: number;
}

export interface DesignData {
	idCounters: IdCounters;
	usageCounters: UsageCounters;
	contents: Record<string, ContentDesign>;
	columns: Record<string, ColumnDesign>;
	rows: Record<string, RowDesign>;
	bodies: Record<string, BodyDesign>;
	schemaVersion: number;
}
