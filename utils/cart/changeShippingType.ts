import { CartItems } from 'models';
import { updateSelectShippngType } from 'services';

import { OptionsProps } from '@/modules/cart/components/Dropdown';
import getErrosMessageInstance from '@/utils/getErrorMessageInstance';

export const handleChangeShippingType = async (
	typeCode: string,
	shippingArr: CartItems,
	cartId: string,
	onLoading: (value: boolean) => void,
	mutate?: any,
	onChangeState?: {
		onFailed?: React.Dispatch<React.SetStateAction<OptionsProps>>;
		idOld: string;
	},
) => {
	const targetShippingWithCode = shippingArr?.shippings?.find(
		(t) => t.deliveryTypeCode === typeCode,
	);
	onLoading(true);
	try {
		await updateSelectShippngType(cartId, {
			deliveryTypeCode: targetShippingWithCode?.deliveryTypeCode!,
			merchantId: shippingArr?.merchant?.merchantId,
			partnerCode: targetShippingWithCode?.partnerCode!,
			brandId: shippingArr?.brand?.brandId,
			deliveryTypeName: targetShippingWithCode?.deliveryTypeName!,
			partnerName: targetShippingWithCode?.partnerName!,
			warehouseId: shippingArr?.merchant?.warehouseId,
		});
		mutate &&
			mutate({
				method: 'GET',
				url: `/cart/${cartId}`,
			});
		onLoading(false);
	} catch (error) {
		const targetShippingWithCodeOld = shippingArr?.shippings?.find(
			(t) => t.deliveryTypeCode === onChangeState?.idOld,
		);

		onLoading(false);
		onChangeState?.onFailed?.({
			label: targetShippingWithCodeOld?.deliveryTypeName,
			value: targetShippingWithCodeOld?.deliveryTypeCode,
		});
		getErrosMessageInstance(error);
	}
};
