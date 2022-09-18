import { CustomerProfile } from 'models';
import React from 'react';
import { updateShippingCart } from 'services';
import { ScopedMutator } from 'swr/dist/types';

import { addressActions } from '@/store/reducers/address';
import getErrosMessageInstance from '@/utils/getErrorMessageInstance';

export const handleChangeShipping = async (
	cartId: string | undefined,
	profileId: string,
	onMutable: ScopedMutator<any>,
	dispatch: React.Dispatch<any>,
	onLoading?: (value: boolean) => void,
) => {
	onLoading?.(true);
	try {
		const dataChangeShipping = await updateShippingCart(cartId, profileId);
		const profileHasChanged = dataChangeShipping?.data?.profile as CustomerProfile;

		await onMutable({
			method: 'GET',
			url: `/cart/${cartId}`,
		});
		dispatch(
			addressActions.setProvince({
				id: profileHasChanged?.provinceId,
				name: profileHasChanged?.province,
			}),
		);
		dispatch(
			addressActions.setDistrict({
				id: profileHasChanged?.districtId,
				name: profileHasChanged?.district,
			}),
		);
		dispatch(
			addressActions.setWard({ id: profileHasChanged?.wardId, name: profileHasChanged?.ward }),
		);
		onLoading?.(false);
	} catch (error) {
		onLoading?.(false);
		getErrosMessageInstance(error);
	}
};
