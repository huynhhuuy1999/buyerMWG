import { ArrRoutesProps, OrderModel, PaymentMethod, Product, WaittingReview } from 'models';

import { CancelOrderReason } from '@/models/customer';

export interface ordersPageProps {
	dataOrderItems?: OrderModel;
	dataProductViewed?: Product[];
	dataLiked?: Product[];
	listCancelOrder?: CancelOrderReason[];
	dataPaymentMethods?: PaymentMethod[];
	dataBrandFavorite?: { data?: any; isValid?: boolean };
	onMutate: any;
	tabStatusActive?: ArrRoutesProps | null;
	isFetchingTab?: boolean;
	dataWaitingReview?: WaittingReview[];
}

export interface FncRenderOrder {
	status: number;
	statusName: string;
}
