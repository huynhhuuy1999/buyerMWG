import { ShopInterface } from './shop';

export interface OrderCustomer {
	customerId: string;
	customerName: string;
	phone: number;
}

export interface ArrRoutesProps {
	key: number;
	route: string;
	OrderStatuses: number | number[];
}
export interface OrderPayment {
	orderId: string;
	transactionId: string;
	paymentType: number;
	paymentName: string;
	paymentTotal: number;
	discount: number;
	memo: string;
	updatedAt: string;
	createdAt: string;
}

export interface OrderPaymentDetails {
	orderId: string;
	orderSubId: string;
	merchantId: number;
	paymentStatus: number;
	paymentStatusName: string;
	paymentTotal: number;
	paymentTotalWithMerchant: string;
	paymentType: number;
	paymentName: string;
	createAt: string;
	updateAt: string;
}

export interface OrderShippingItems {
	productNo: number;
	categoryId: number;
	productId: number;
	variationId: number;
	productName: string;
	productQuantity: number;
	variationImage: string;
	productPrice: number;
	propertyValueId1: number;
	propertyValueName1: string;
	propertyValueId2: number;
	propertyValueName2: string;
	promotionTypes: [number];
}

export interface OrderDetails {
	orderId: string;
	subOrderId: string;
	merchantId: number;
	cartId: string;
	siblingOrderDetailIds: string[];
	customer: OrderCustomer;
	payment: OrderPaymentDetails;
	shipping: {
		transactionShippingId: string;
		orderId: string;
		orderSubId: string;
		merchantId: number;
		merchantName: string;
		merchantImage: string;
		shipingToName: string;
		estimatedDate: string;
		toProvinceId: number;
		toProvinceCity: string;
		toDistrictId: number;
		toDistrict: string;
		toWardId: number;
		toWard: string;
		ToFullAddress: string;
		toZipCode: string;
		toPhoneNumber: string;
		memo: string;
		status: number;
		partnerName: string;
		partnerCode: string;
		deliveryId: string;
		orderDeliveryRefId: string;
		shippingType: string;
		shippingTypeName: string;
		shippingFee: number;
		items: OrderShippingItems[];
		updatedAt: string;
		createdAt: string;
	};
	merchant: ShopInterface;
	cancelled: {
		cancelReason: string;
		cancelledAt: string;
		cancelledBy: string;
		cancelledNote: string;
		statusBeforeCancelled: string;
		statusBeforeCancelledName: string;
	};
	status: number;
	statusName: string;
	memo: string;
	isExtend: true;
	extendDay: number;
	processingDeadline: string;
	createdAt: string;
	updateAt: string;
}

export interface OrderModel {
	orders: {
		orderId: string;
		customer: OrderCustomer;
		subOrderIds: string[];
		cartId: string;
		merchants: OrderMerchantDetail[];
		payment: OrderPayment;
		createdAt: string;
		updateAt: string;
		details: OrderDetails[];
	}[];
	orderStatusCount: {
		allOrder: number;
		cancelOrder: number;
		completeOrder: number;
		completePickUp: number;
		deliveryOrder: number;
		extensionOfTimeToPrepareGoods: number;
		lateDelivery: number;
		pendingOrder: number;
		printedNote: number;
		readyToDeliver: number;
		startPickingUpGoods: number;
		waitingForPacking: number;
		waitingForTheGoodsOrder: number;
	};
	totalRecord: number;
	remainRecord: number;
}
export interface OrderStatusDetails {
	merchantIdAndStatus: string;
	merchantIdAndPaymentStatus: string;
	merchantIdAndShippingStatus: string;
	orderSubId: string;
	merchantId: number;
	orderId: string;
	orderStatus: number;
	statusUpdatedAt: string;
	paymentStatus: number;
	paymentStatusUpdatedAt: null;
	shippingStatus: number;
	shippingStatusUpdatedAt: null;
	createdAt: string;
	memo: string;
	isExtend: boolean;
	extendDay: number;
	processingDeadline: string;
}

export interface OrderMerchantDetail {
	id: string;
	merchantId: number;
	merchantRef: string;
	userId: string;
	name: string;
	code: string;
	companyName: string;
	representativeName: string;
	representativePosition: string;
	portalLink: string;
	referralLink: string;
	urlSlug: string;
	address: string;
	email: string;
	mobilePhone: string;
	avatarImage: string;
	typeOfBusiness: number;
	businessSectors: string;
	account: {
		fullName: string;
		gender: number;
		mobilePhone: string;
	};
	googleId: null;
	zaloId: null;
	profileProgress: number;
	type: number;
	status: number;
	statusShop: number;
	process: number;
	statusManagement: number;
	requireNote: string;
	selled: false;
	addedProduct: true;
	description: string;
	updatedAt: string;
	createdAt: string;
	version: number;
}

export interface TimelineOrderDetail {
	statusName: string;
	status: string;
	driverName: string;
	driverPhone: string;
	driverLicensePlates: string;
	deliveryId: string;
	type: number;
	dateTime: string;
}

export interface OrderShippingDetails {
	transactionShippingId: string;
	orderId: string;
	orderSubId: string;
	merchantId: number;
	merchantName: string;
	merchantImage: string;
	shipingToName: string;
	estimatedDate: string;
	toProvinceId: number;
	toProvinceCity: string;
	toDistrictId: number;
	toDistrict: string;
	toWardId: number;
	toWard: string;
	toFullAddress: string;
	toZipCode: string;
	toPhoneNumber: string;
	memo: string;
	status: number;
	partnerName: string;
	partnerCode: string;
	deliveryId: string;
	orderDeliveryRefId: string;
	shippingType: string;
	shippingTypeName: string;
	shippingToGenderName: string;
	shipingToGender: number;
	shippingFee: number;
	updatedAt: string;
	createdAt: string;
	items: OrderShippingItems[];
}

export interface orderItemDetail {
	productNo: number;
	categoryId: number;
	productId: number;
	variationId: number;
	productName: string;
	productQuantity: number;
	variationImage: string;
	productPrice: number;
	propertyValueId1: number;
	propertyValueName1: string;
	propertyValueId2: number;
	propertyValueName2: string;
	promotionTypes: [number];
}

export interface OrderCustomerDetail {
	customerId: string;
	customerName: string;
	customerGender: string;
	phone: number;
}

export interface OrderCancelledDetail {
	cancelledBy: string;
	cancelledNote: string;
	statusBeforeCancelled: number;
	statusBeforeCancelledName: string;
	cancelledAt: string;
	cancelReason: number;
}

export interface OrderItemDetails {
	orderId: string;
	subOrderId: string;
	merchantId: number;
	merchantName: string;
	merchantImage: string;
	items: orderItemDetail[];
	createdAt: string;
	cartId: string;
	siblingOrderDetailIds: [string];
	customer: OrderCustomerDetail;
	payment: OrderPaymentDetails;
	shipping: OrderShippingDetails;
	status: number;
	statusName: string;
	memo: string;
	merchantDiscount: number;
	merchantVouchers: string[];
	readyToDeliverAt: string;
	additionalCharges: { type: number; name: string; value: number }[];
	isExtend: true;
	extendDay: number;
	processingDeadline: string;
	updateAt: string;
	merchant: OrderMerchantDetail;
	cancelled: OrderCancelledDetail;
}
export interface OrderDetailsModel {
	orderId: string;
	createdAt: string;
	updateAt: string;
	cartId: string;
	payment: OrderPaymentDetails;
	customer: OrderCustomerDetail;
	subOrderIds: [number];
	status: number;
	merchantIds: [string];
	merchants: OrderMerchantDetail[];
	details: OrderItemDetails[];
}

export interface WaittingReview {
	waitingListId: string;
	subOrderId: string;
	userId: string;
	merchantInfo: {
		merchantId: number;
		name: string;
		pathImage: string;
		statusRating: number;
	};
	productInfo: {
		productId: number;
		productName: string;
		variationImage: string;
		statusRating: number;
	}[];
	status: number;
	createdAt: Date;
	updateAt: Date;
}
