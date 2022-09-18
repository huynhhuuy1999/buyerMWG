export enum DeviceType {
	MOBILE = 'mobile',
	DESKTOP = 'desktop',
}

export enum TYPE_PRODUCT_VARIANT {
	color = 2,
	size = 3,
}

export enum PAYMENT_STATUS {
	SUCCESS = 'SUCCESS',
	FAILURE = 'FAILURE',
	CANCEL = 'CANCEL',
}

export enum PROMOTION_STATUS_SHOW {
	RUNNING = 1, //
	PAUSE = 2, //
	COMING_SOON = 3,
	END = 4, //
	PENDING = 5,
	REJECT = 6, //
	APPROVE = 7,
}

export enum VerifyType {
	CREATED_ACCOUNT = 0,
	LOGIN = 1,
	CHANGE_PHONE = 2,
	CHANGE_EMAIL = 3,
	CONFIRM_BANK = 4,
	RESET_PW = 5,
	CONFIRM_PHONE = 6,
}

export enum ConfigsLayoutMobile {
	DEFAULT = 1,
	SPEICAL = 2,
}
export enum CATEGORY_LEVEL {
	LEVEL_1 = 1,
	LEVEL_2 = 2,
	LEVEL_3 = 3,
}

export enum CATEGORY_LAYOUT_TYPE {
	OPTION_ONE = 1,
	OPTION_TWO = 2,
}
export enum TYPE_SHOW_FILTER {
	BRANCH = 1,
	COLOR = 2,
	RANGE_PRICE = 4,
	PLACE = 5,
	ORTHER = 6,
	LIST = 7,
}

export enum MODE_RUNNER {
	PUBLIC = 'public',
	PREVIEWING = 'previewing',
	PREVIEW_PROMOTION = 'preview_promotion',
}

export enum paymentStatusTypes {
	WAITING = 1,
	PROCESS = 2,
	PAID = 3,
	REFUND = 4,
}

export enum shippingStatusTypes {
	WAITING = 1,
	PREPARING = 2,
	COMPLETE = 3,
	DELIVERY = 4,
}

export enum orderStatusType {
	PENDING = 0,
	WAITING_FOR_THE_GOODS = 1,
	START_PICKING_UP_GOODS = 2,
	COMPLETE_PICK_UP = 3,
	PRINTED_NOTE = 4,
	READY_TO_DELIVER = 5,
	DELIVERY = 6,
	DELIVERED = 7,
	CANCEL = 8,
	COMPLETE = 100,
	RETURN_EXCHANGE = 999,
}

export enum KEYBOARD_EVENTS {
	pageUp = 33,
	pageDown = 34,
	end = 35,
	home = 36,
	leftArrow = 37,
	rightArrow = 39,
	upArrow = 38,
	downArrow = 40,
	escape = 27,
}

export enum PROPERTY {
	COLOR = 'Màu sắc',
	BRAND = 'brands',
	CATEGORY = 'categories',
	MAX_PRICE = 'maxPrice',
	PROPERTY = 'properties',
	PROVINCE = 'province',
	RATING = 'ratingTypes',
}

export enum TYPE_FILTER_PARAM {
	VALUE = '1',
	RANGE_VALUE = '2',
	OTHER = '3',
}

export interface PAYMENT_ONLINE_ATM {
	vpc_Amount: string;
	vpc_Command: string;
	vpc_Locale: string;
	vpc_MerchTxnRef: string;
	vpc_Merchant: string;
	vpc_Message: string;
	vpc_OrderInfo: string;
	vpc_SecureHash: string;
	vpc_TxnResponseCode: string;
	vpc_Version: number;
}

export interface PAYMENT_ONLINE_MOMO {
	amount: string;
	extraData: string;
	message: string;
	orderId: string;
	orderInfo: string;
	orderType: string;
	partnerCode: string;
	payType: string;
	requestId: string;
	responseTime: string;
	resultCode: string;
	signature: string;
	transId: string;
}

export enum TYPE_DISCOUNT {
	FLASH_SALE = 1,
	DISCOUNT = 2,
	FREESHIP = 3,
	GIFT = 4,
	EXTRA_DISCOUNT = 5, // mua kèm giảm thêm
	INVOICE = 6,
}

export enum TYPE_SEARCH {
	PRICE = 1,
	BRAND = 2,
	PROVINCE = 3,
	DISTRICT = 4,
	ORTHER = 5,
	LIST = 6,
	RATING = 7,
}

export enum PANEL_TYPE_SEARCH {
	SUGGESTION = 'Suggestion',
	REQUEST = 'Request',
	SEARCHING = 'Searching',
}

export enum PARAM_KEY_SEARCH {
	BRANDS = 'brandIds',
	CATEGORY = 'categoryId',
	FILTER = 'filters',
	PROVINCE = 'provinceId',
	DISTRICT = 'districtIds',
	PRICE = 'price',
	SORT = 'sortType',
	RATING = 'ratingTypes',
}

export enum OPTION_TYPE_FILTER_MODULE {
	DEFAULT = 1,
	MODAL = 2,
}

export enum TYPE_LAYOUT_CARD {
	TECHNICAL = 1,
	CLOTHES = 2,
	GROCERIES = 3,
	DEFAULT = 4,
}

export enum TYPE_PROPERTY {
	COLOR = 2,
	SIZE = 3,
}

export enum TYPE_ADDRESS_GOOGLE {
	PROVINCE = 'administrative_area_level_1',
	DISTRICT = 'administrative_area_level_2',
	WARD = 'administrative_area_level_3',
	NUM_STREET = 'street_number',
	NAME_STREET = 'route',
}

export enum TYPE_SORT_FILTER {
	SOLEST = 1,
	PROMOTION = 2,
	NEWEST = 3,
	PRICE_INCREASE = 4,
	PERCENT_DISCOUNT = 5,
	LIKEST = 6,
}

export enum CHAT_TYPE {
	TEXT = 'Text',
	MESSAGE = 'Message',
	CONVERSATION = 'Conversation',
	MEDIA = 'Media',
	REACTION = 'Reaction',
	TYPING = 'Typing',
	SEEN = 'Seen',
	ORDER = 'Order',
}

export enum CHAT_STATUS {
	SENT = 0,
	RECEIVED = 1,
	SEEN = 2,
	UNSEEN = 6,
}

export enum TYPE_ADD_CART {
	UPDATE = 0,
	INCREMENT = 1,
}

export enum CALL_EVENT {
	OFFER_EVENT = 'offer-event',
	ANSWER_EVENT = 'answer-event',
	BYE_EVENT = 'bye-event',
	ICE_CANDIDATE_EVENT = 'ice-candidate-event',
}

export enum CALL_TYPE {
	OFFER = 'offer',
	ANSWER = 'answer',
}

export enum MODULE_CHAT {
	CLOSE_ALL = 'close_all',
	CREATE = 'create',
	CALLING = 'calling',
	IS_ACCEPT = 'is_accept',
	LIST_CONVERSATION = 'list_chat',
	CHAT_ORDER = 'chat_order',
	CHAT_MODULE = 'chat_module',
}
export enum contentTypes {
	ROW = 'row',
	SOCIAL = 'social',
	DIVIDER = 'divider',
	BUTTON = 'button',
	IMAGE = 'image',
	MENU = 'menu',
	TEXT = 'text',
	HTML = 'html',
	PRODUCTS = 'products',
	VOUCHER = 'voucher',
	SLIDER = 'slider',
	VIDEO = 'video',
	HEADING = 'heading',
	TIMER = 'timer',
	COLUMN = 'column',
}

export enum STATUS_PROMOTION {
	RUNNING = 1,
	PAUSE = 2,
	COMING_SOON = 3,
	END = 4,
	PENDING = 5,
	REJECT = 6,
	APPROVE = 7,
}
