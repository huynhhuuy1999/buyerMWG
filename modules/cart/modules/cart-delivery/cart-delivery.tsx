import { InputField, Map, MessageErrors, RadioField, SelectField } from 'components';
import { CartModel, GenderEnums, ICartFormProps } from 'models';
import { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AppDispatch } from 'store';
import { useLocationUser } from 'utils';

import { PositionMapProps } from '@/components/GoogleMap/types';
import Portal from '@/HOCs/portal';
import { Address, addressActions } from '@/store/reducers/address';

enum DeliveryTimeEnums {
	WorkingHours = 1,
	AllTime = 2,
}

interface CartDeliveryProps {
	dataAddress: Address;
	onChange: AppDispatch;
	dataCart?: CartModel | null;
}

const CartDelivery: React.FC<CartDeliveryProps> = ({ dataAddress, onChange, dataCart }) => {
	const {
		control,
		formState: { errors },
		getValues,
		resetField,
		reset,
	} = useFormContext<ICartFormProps>();

	// 1. delivery WorkingHours // 2. delivery AllTime
	const [deliveryTime, setDeliveryTime] = useState<DeliveryTimeEnums>();
	const [isShowMap, setIsShowMap] = useState<boolean>(false);
	const { position } = useLocationUser();

	useEffect(() => {
		setDeliveryTime(getValues('typeShipping'));
	}, [getValues]);

	const handleSetAddressFromMap = ({ ids, streetNumber, latlng }: PositionMapProps) => {
		reset(
			{
				...getValues(),
				location: { lat: latlng?.lat, lon: latlng?.lng },
				districtId: ids.districtId,
				wardId: ids?.wardId,
				provinceId: ids?.provinceId,
				address: streetNumber,
			},
			{ keepDefaultValues: true },
		);
		onChange(
			addressActions.setProvince({
				id: ids.provinceId,
			}),
		);
		onChange(
			addressActions.setDistrict({
				id: ids.districtId,
			}),
		);
		onChange(
			addressActions.setWard({
				id: ids.wardId,
			}),
		);
	};

	return (
		<div className='space-y-5'>
			<div className='flex gap-2'>
				<div
					className='flex items-center space-x-2 border-[#126BFB] border rounded-md py-2.5 px-2'
					onClick={() => handleSetAddressFromMap(position)}
					onKeyPress={() => handleSetAddressFromMap(position)}
					tabIndex={0}
					role={'button'}
				>
					<div className='relative aspect-square flex items-center h-full w-5 cursor-pointer'>
						<img alt='location' src='/static/svg/GPS_NEW.svg' width={20} height={20} />
					</div>
					<span className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#126BFB]'>
						Điền địa chỉ dựa vào vị trí hiện tại của{' '}
						{dataCart?.cartShipping?.gender === GenderEnums.Male ? 'Anh' : 'Chị'}{' '}
						{dataCart?.cartShipping?.contactName}
					</span>
				</div>
				<div
					className='border-[#126BFB] border rounded-md py-2.5 px-2 font-sfpro text-[14px] font-normal not-italic leading-normal whitespace-nowrap tracking-[0.04px] flex items-center text-[#126BFB]'
					onClick={() => setIsShowMap(!isShowMap)}
					onKeyPress={() => setIsShowMap(!isShowMap)}
					tabIndex={0}
					role={'button'}
				>
					Bản đồ
				</div>
			</div>
			{isShowMap ? (
				<Portal>
					<Map
						// defaultLatlng={{ lat: getValues('location')?.lat!, lng: getValues('location')?.lon! }}
						onShow={(val) => setIsShowMap(val)}
						onConfirm={(position) => handleSetAddressFromMap(position)}
					/>
				</Portal>
			) : null}
			<Controller
				render={({ field }) => (
					<SelectField
						id='provinceId'
						label='Tỉnh / Thành phố'
						{...field}
						typeStyleForms={{ labelInsideBorder: true }}
						suffixIcon={<span></span>}
						onChange={(e) => {
							field.onChange(e);
							onChange(
								addressActions.setProvince({
									id: Number(e.target.value),
									name: e.target.selectedOptions?.[0]?.label,
								}),
							);
							resetField('districtId', { keepDirty: false, defaultValue: 0 });
							resetField('wardId', { keepDirty: false, defaultValue: 0 });
						}}
						validationMessage={<MessageErrors name='provinceId' errors={errors} />}
						options={(dataAddress.data?.provinceTree || [])?.map((item) => {
							return { name: item.provinceName, value: item.provinceId };
						})}
					/>
				)}
				name='provinceId'
				control={control}
			/>

			<div className='grid grid-cols-2 gap-x-2'>
				<Controller
					render={({ field }) => (
						<SelectField
							{...field}
							id='districtId'
							label='Quận / Huyện'
							typeStyleForms={{ labelInsideBorder: true }}
							suffixIcon={<span></span>}
							onChange={(e) => {
								field.onChange(e);
								onChange(
									addressActions.setDistrict({
										id: Number(e.target.value),
										name: e.target.selectedOptions?.[0]?.label,
									}),
								);
								resetField('wardId', { keepDirty: false, defaultValue: 0 });
							}}
							validationMessage={<MessageErrors name='districtId' errors={errors} />}
							options={(dataAddress.data?.district || []).map((item) => {
								return { name: item.districtName, value: item.districtId };
							})}
						/>
					)}
					name='districtId'
					control={control}
				/>
				<Controller
					render={({ field }) => (
						<SelectField
							{...field}
							id='wardId'
							label='Phường / Xã'
							typeStyleForms={{ labelInsideBorder: true }}
							suffixIcon={<span></span>}
							onChange={(e) => {
								field.onChange(e);
								onChange(
									addressActions.setWard({
										id: Number(e.target.value),
										name: e.target.selectedOptions?.[0]?.label,
									}),
								);
							}}
							validationMessage={<MessageErrors name='wardId' errors={errors} />}
							options={(dataAddress.data?.ward || []).map((item) => {
								return { name: item.wardName, value: item.wardId };
							})}
						/>
					)}
					name='wardId'
					control={control}
				/>
			</div>
			<Controller
				render={({ field }) => (
					<InputField
						{...field}
						id='address'
						label='Địa chỉ chi tiết'
						type='text'
						onChange={(e) => {
							field.onChange(String(e.target.value));
							onChange(addressActions.setAddressDetails(e.target.value));
						}}
						validationMessage={<MessageErrors name='address' errors={errors} />}
						typeStyleForms={{ labelInsideBorder: true, animation: true }}
						className='relative'
					/>
				)}
				name='address'
				control={control}
			/>

			<div className='grid grid-cols-2 gap-x-2'>
				<Controller
					render={({ field }) => (
						<div
							className={`flex min-h-[51px] items-center justify-evenly space-x-1 rounded-md border border-solid p-3 ${
								Boolean(deliveryTime === DeliveryTimeEnums.WorkingHours)
									? 'border-[#FEBEF2] bg-[#F7F5FE] text-[#f05a94]'
									: 'border-[#EFEDFC] text-[#3E3E40]'
							}`}
							onClick={() => {
								field.onChange(DeliveryTimeEnums.WorkingHours);
								setDeliveryTime(DeliveryTimeEnums.WorkingHours);
							}}
							onKeyPress={(e) => {
								field.onChange(DeliveryTimeEnums.WorkingHours);
								setDeliveryTime(DeliveryTimeEnums.WorkingHours);
							}}
							tabIndex={0}
							role='button'
						>
							<RadioField
								{...field}
								id='typeShipping1'
								label='Giao giờ hành chính'
								reverseRadio
								checked={Boolean(deliveryTime === DeliveryTimeEnums.WorkingHours)}
								styles={{ label: 'text-14 pr-7 cursor-pointer' }}
								value={DeliveryTimeEnums.WorkingHours}
							/>
						</div>
					)}
					name='typeShipping'
					control={control}
				/>

				<Controller
					render={({ field }) => (
						<div
							className={`flex min-h-[51px] items-center justify-evenly space-x-1 rounded-md border border-solid p-3 ${
								Boolean(deliveryTime === DeliveryTimeEnums.AllTime)
									? 'border-[#FEBEF2] bg-[#F7F5FE] text-[#f05a94]'
									: 'border-[#EFEDFC] text-[#3E3E40]'
							}`}
							onClick={() => {
								field.onChange(DeliveryTimeEnums.AllTime);
								setDeliveryTime(DeliveryTimeEnums.AllTime);
							}}
							onKeyPress={() => {
								field.onChange(DeliveryTimeEnums.AllTime);
								setDeliveryTime(DeliveryTimeEnums.AllTime);
							}}
							tabIndex={0}
							role='button'
						>
							<RadioField
								{...field}
								id='typeShipping2'
								label='Giao các khung giờ'
								reverseRadio
								checked={Boolean(deliveryTime === DeliveryTimeEnums.AllTime)}
								styles={{ label: 'text-14 pr-8 cursor-pointer' }}
								value={DeliveryTimeEnums.AllTime}
							/>
						</div>
					)}
					name='typeShipping'
					control={control}
				/>
			</div>
			<MessageErrors name='typeShipping' errors={errors} />
		</div>
	);
};

export default CartDelivery;
