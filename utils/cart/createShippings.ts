import { Notification } from 'components';
import { CustomerProfile, ICartFormProps, TypeActionShippingAddress } from 'models';
import { addCustomerProfile, updateShippingCart } from 'services';

import { TypeCartPickupAddress } from '@/store/reducers/address';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

//handle submit for create address
export const handleSubmitForCreateAddress = async (
	data: Partial<ICartFormProps>,
	mutate: any,
	onAction: React.Dispatch<React.SetStateAction<TypeActionShippingAddress>>,
	cartId?: string,
	typePickupAddress?: TypeCartPickupAddress,
	onStatus?: () => void,
) => {
	try {
		const values: Partial<CustomerProfile> = {
			contactName: data.contactName,
			gender: Number(data.gender),
			provinceId: data.provinceId,
			districtId: data.districtId,
			wardId: data.wardId,
			location: {
				lat: data?.location?.lat!,
				lon: data?.location?.lon!,
			},
			address: data.address,
			pickupStoreId: data.pickupStoreId,
			mobileNumber: data.mobileNumber,
			isDefault: true,
			hourOffice: data.typeShipping === 1,
			isCompany: data.isCompany,
			companyName: data.companyName,
			companyAddress: data.companyAddress,
			companyTaxCode: data.companyTaxCode,
			paymentType: Number(data.paymentType),
		};
		typePickupAddress === 'homeDelivery' ? delete values['pickupStoreId'] : values;
		!data?.location?.lat && !data?.location?.lon ? delete values['location'] : values;

		//call api create profile customer
		const createCustomerProfile = await addCustomerProfile(values);

		const { profileId } = createCustomerProfile?.data as CustomerProfile;

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
			onStatus?.();
			Notification.Loading.remove(300);
		}
	} catch (error) {
		onAction((prev) => ({
			...prev,
			isActionActive: false,
			isActiveOrder: false,
			action: 'SUBMIT',
		}));
		onStatus?.();
		getErrorMessageInstance(error);
	}
};
