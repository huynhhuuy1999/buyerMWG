import { updatePaymentMethodSelected } from 'services';
import { ScopedMutator } from 'swr/dist/types';

export const setPaymentMethodHelpers = async (
	cartId: string,
	params: {
		paymentType: string | number;
		paymentName?: string;
		hasVatInvoice?: true;
		companyName?: string;
		taxCode?: string;
		invoiceAddress?: string;
		sameAsTheShippingAddress?: boolean;
	},
	onLoading: (val: boolean) => void,
	onMutable?: ScopedMutator<any>,
	onFailed?: () => void,
) => {
	onLoading(true);
	try {
		await updatePaymentMethodSelected(cartId, {
			paymentType: Number(params.paymentType),
		});
		await onMutable?.({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		onLoading(false);
	} catch (error) {
		onFailed?.();
		onLoading(false);
	}
};
