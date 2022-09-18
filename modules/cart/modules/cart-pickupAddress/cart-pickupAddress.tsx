import { InputField, MessageErrors, RadioField } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks';
import { CartModel, GenderEnums, ICartFormProps,TypeActionShippingAddress  } from 'models';
import dynamic from 'next/dynamic';
import { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { addressActions, addressSelector, enumCartPickupAddress } from '@/store/reducers/address';

import { Tabs } from '../../components';

interface CartDeliveryProps {
	dataCart?: CartModel | null;
	typeAction: TypeActionShippingAddress;
}

const DynamicCartDelivery = dynamic(() => import('../../modules/cart-delivery/cart-delivery'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicPickupInStore = dynamic(() => import('../cart-pickupStore/cart-pickupStore'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const CartPickupAddress: React.FC<CartDeliveryProps> = ({ dataCart, typeAction }) => {
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
			key: enumCartPickupAddress.homeDelivery,
			width: '30%',
		},
		{
			title: 'Nhận tại cửa hàng Bách Hoá Xanh, Thế Giới Di Động,...',
			key: enumCartPickupAddress.pickUpInStore,
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
		<div className='mb-8 space-y-4'>
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
			<div className='space-y-4'>
				<span className='font-sfpro_semiBold text-[16px] font-semibold not-italic leading-normal tracking-[0.04px] text-black'>
					Địa chỉ nhận hàng
				</span>
				<Tabs
					tabs={tabSettings}
					defaultActiveKey={
						getValues('pickupStoreId')
							? enumCartPickupAddress.pickUpInStore
							: enumCartPickupAddress.homeDelivery
					}
				>
					<DynamicCartDelivery
						key='homeDelivery'
						onChange={dispatch}
						dataAddress={selectedAddressState}
						dataCart={dataCart}
					/>
					<DynamicPickupInStore
						key='pickUpInStore'
						dataAddress={selectedAddressState}
						dataCart={dataCart}
						onChange={dispatch}
					/>
				</Tabs>
			</div>
		</div>
	);
};

export default CartPickupAddress;
