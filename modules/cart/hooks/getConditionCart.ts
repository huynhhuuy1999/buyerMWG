import {
	CartBuyLaterModel,
	CartModel,
	CustomerProfile,
	PaymentMethod,
	TypeActionShippingAddress,
} from 'models';

export const getConditionCart = (
	isAction: TypeActionShippingAddress,
	dataCart?: CartModel | null,
	dataCartBuyLater?: CartBuyLaterModel | null,
	dataProfiles?: CustomerProfile[] | null,
	paymentMethod?: PaymentMethod[] | null,
) => {
	const { paymentType, paymentTotal } = dataCart?.cartPayment || {};

	const paymentCurrentSelected = paymentMethod?.find((t) => t?.id === paymentType);

	const regexHasChooseDelivery = dataCart?.cartItems?.every((t) =>
		t?.shippings?.some((ele) => ele?.isSelected),
	);
	const regexHasPaymentMethodEnable = Boolean(
		paymentCurrentSelected?.maxAmount || paymentCurrentSelected?.minAmount,
	)
		? paymentTotal! > paymentCurrentSelected?.minAmount! &&
		  paymentTotal! <= paymentCurrentSelected?.maxAmount!
		: true; //if type payment not required max min -> regex === true
	const regexCartItemNotExisted = Boolean(dataCart?.cartItems.length);
	const regexHasProfile = Boolean((dataProfiles ?? [])?.length > 0);
	const regexActionCurrentSubmit =
		Boolean(isAction.action !== 'EDIT') && Boolean(isAction.action !== 'CREATE');
	const regexHasExistedItemBuyLater = Boolean((dataCartBuyLater?.products ?? [])?.length > 0);
	const regexEmptyCartWithItemBuyLater = regexHasExistedItemBuyLater && !regexCartItemNotExisted;

	return {
		regexHasChooseDelivery,
		regexCartItemNotExisted,
		regexHasProfile,
		regexHasPaymentMethodEnable,
		regexActionCurrentSubmit,
		regexEmptyCartWithItemBuyLater,
		regexHasExistedItemBuyLater,
	};
};
