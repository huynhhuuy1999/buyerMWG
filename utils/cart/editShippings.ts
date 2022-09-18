import { Notification } from 'components';
import { CustomerProfile, ICartFormProps, TypeActionShippingAddress } from 'models';
import React from 'react';
import { editCustomerProfile, updateShippingCart } from 'services';

import { TypeCartPickupAddress } from '@/store/reducers/address';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export const handleSubmitForEditAddress = async (
	data: Partial<ICartFormProps>,
	profileId: string,
	mutate: any,
	onAction: React.Dispatch<React.SetStateAction<TypeActionShippingAddress>>,
	cartId?: string,
	typePickupAddress?: TypeCartPickupAddress,
) => {
	try {
		//call api create profile customer
		const values: Partial<CustomerProfile> = {
			contactName: data.contactName,
			gender: Number(data.gender),
			provinceId: data.provinceId,
			districtId: data.districtId,
			wardId: data.wardId,
			address: data.address,
			mobileNumber: data.mobileNumber,
			hourOffice: data.typeShipping === 1,
			location: {
				lat: data?.location?.lat!,
				lon: data?.location?.lon!,
			},
			isCompany: data.isCompany,
			companyName: data.companyName,
			pickupStoreId: data.pickupStoreId,
			companyAddress: data.companyAddress,
			companyTaxCode: data.companyTaxCode,
			paymentType: Number(data.paymentType),
		};
		typePickupAddress === 'homeDelivery' ? delete values['pickupStoreId'] : values;
		!data?.location?.lat && !data?.location?.lon ? delete values['location'] : values;

		editCustomerProfile(values, profileId);

		const mutateShippingCart = await updateShippingCart(cartId, profileId);

		if (mutateShippingCart.data) {
			await mutate({
				url: '/profile',
				method: 'GET',
			});
			await mutate({
				method: 'GET',
				url: `/cart/${cartId}`,
			});
			onAction((prev) => ({
				...prev,
				isActionActive: false,
				isActiveOrder: true,
				action: 'SUBMIT',
			}));
			Notification.Loading.remove(300);
		}
		return Notification.Loading.remove(300);
	} catch (error) {
		getErrorMessageInstance(error);
	}
};
