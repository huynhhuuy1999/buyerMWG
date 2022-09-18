import { InputField, MessageErrors, RadioField } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks';
import { CartModel, GenderEnums, ICartFormProps, TypeActionShippingAddress } from 'models';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { addressActions, addressSelector } from '@/store/reducers/address';

import { Tabs } from '../../components';

interface CartDeliveryProps {
	dataCart?: CartModel | null;
	typeAction: TypeActionShippingAddress;
	renderBtnSubmit?: React.ReactNode;
}

const DynamicCartDeliveryMobile = dynamic(
	() => import('../../modules/cart-delivery/cart-delivery.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const DynamicPickupInStoreMobile = dynamic(
	() => import('../cart-pickupStore/cart-pickupStore.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const CartPickupAddressMobile: React.FC<CartDeliveryProps> = ({
	dataCart,
	typeAction,
	renderBtnSubmit,
}) => {
	const {
		control,
		formState: { errors },
		getValues,
	} = useFormContext<ICartFormProps>();
	const dispatch = useAppDispatch();
	const selectedAddressState = useAppSelector(addressSelector);
	const addressState = useAppSelector(addressSelector);

	const tabSettings = [
		{
			title: 'Giao tận nơi',
			key: 'homeDelivery',
			width: '30%',
		},
		{
			title: 'Nhận tại cửa hàng Bách Hoá Xanh, Thế Giới Di Động,...',
			key: 'pickUpInStore',
			// width: 50,
		},
	];

	useEffect(() => {
		if (typeAction.action === 'EDIT') {
			dispatch(
				addressActions.setProvince({
					id: getValues('provinceId'),
					name: addressState.names.province,
				}),
			);
			dispatch(
				addressActions.setDistrict({
					id: getValues('districtId'),
					name: addressState.names.district,
				}),
			);
			dispatch(addressActions.setWard({ id: getValues('wardId'), name: addressState.names.ward }));
		} else {
			dispatch(addressActions.reset());
		}
	}, [typeAction.action, dispatch, getValues]);

	return (
		<div className='mb-8 max-h-[calc(100vh_-_134px)] z-[20] mt-[45px] space-y-4'>
			<div className='space-y-4 p-4'>
				<span className='font-sfpro_semiBold text-[16px] font-semibold not-italic leading-normal tracking-[0.04px] text-black'>
					Người nhận hàng
				</span>
				<div className='flex space-x-5'>
					<div className='h-[16px] max-w-[20%] flex-[20%] space-x-2'>
						<Controller
							render={({ field }) => (
								<RadioField
									{...field}
									id='male'
									label='Anh'
									onChange={(e) => {
										field.onChange(e);
									}}
									checked={Boolean(Number(field.value) === GenderEnums.Male)}
									value={GenderEnums.Male}
								/>
							)}
							name='gender'
							control={control}
						/>
					</div>
					<div className='h-[16px] max-w-[20%] flex-[20%] space-x-2'>
						<Controller
							render={({ field }) => (
								<RadioField
									{...field}
									id='female'
									label='Chị'
									onChange={(e) => {
										field.onChange(e);
									}}
									checked={Boolean(Number(field.value) === GenderEnums.Female)}
									value={GenderEnums.Female}
								/>
							)}
							name='gender'
							control={control}
						/>
					</div>
				</div>
				<MessageErrors name='gender' errors={errors} />
				<div className='grid grid-cols-2 gap-x-2'>
					<Controller
						render={({ field }) => (
							<InputField
								{...field}
								id='contactName'
								label='Họ và tên'
								type='text'
								validationMessage={<MessageErrors name='contactName' errors={errors} />}
								typeStyleForms={{ labelInsideBorder: true, animation: true }}
								className='relative'
							/>
						)}
						defaultValue={''}
						name='contactName'
						control={control}
					/>
					<Controller
						render={({ field }) => (
							<InputField
								{...field}
								id='mobileNumber'
								label='Số điện thoại'
								type='tel'
								validationMessage={<MessageErrors name='mobileNumber' errors={errors} />}
								typeStyleForms={{ labelInsideBorder: true, animation: true }}
								className='relative'
							/>
						)}
						name='mobileNumber'
						control={control}
					/>
				</div>
			</div>
			<div className='space-y-4'>
				<span className='px-4 font-sfpro_semiBold text-[16px] font-semibold not-italic leading-normal tracking-[0.04px] text-black'>
					Địa chỉ nhận hàng
				</span>
				<Tabs tabs={tabSettings}>
					<DynamicCartDeliveryMobile
						key='homeDelivery'
						onChange={dispatch}
						dataAddress={selectedAddressState}
						dataCart={dataCart}
						renderBtnSubmit={renderBtnSubmit}
					/>
					<DynamicPickupInStoreMobile
						key='pickUpInStore'
						dataAddress={selectedAddressState}
						dataCart={dataCart}
						onChange={dispatch}
						renderBtnSubmit={renderBtnSubmit}
					/>
				</Tabs>
			</div>
		</div>
	);
};

export default CartPickupAddressMobile;
