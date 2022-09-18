import { InputField, Map, MessageErrors, RadioField, SelectField } from 'components';
import { DeviceType } from 'enums';
import { CartModel, GenderEnums, ICartFormProps } from 'models';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { AppDispatch } from 'store';
import { useLocationUser } from 'utils';

import { PositionMapProps } from '@/components/GoogleMap/types';
import Portal from '@/HOCs/portal';
import { Address, addressActions } from '@/store/reducers/address';

import { Drawer } from '../../components';
import { DeliveryTimeEnums } from '../../types';

interface CartDeliveryProps {
	dataAddress: Address;
	onChange: AppDispatch;
	dataCart?: CartModel | null;
	renderBtnSubmit?: React.ReactNode;
}

const CartDelivery: React.FC<CartDeliveryProps> = ({
	dataAddress,
	onChange,
	dataCart,
	renderBtnSubmit,
}) => {
	const {
		control,
		formState: { errors },
		getValues,
		resetField,
		setValue,
		reset,
	} = useFormContext<ICartFormProps>();

	const [deliveryTime, setDeliveryTime] = useState<DeliveryTimeEnums>(1);
	const [isShowMap, setIsShowMap] = useState<boolean>(false);
	const { position } = useLocationUser();
	const refButton = useRef<HTMLDivElement | any>();

	useEffect(() => {
		getValues('typeShipping') && setDeliveryTime(getValues('typeShipping')!);
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

	const scrollToBottom = () => {
		setTimeout(() => {
			refButton.current?.scrollIntoView({ behavior: 'smooth' });
		}, 300);
	};

	useEffect(() => {
		scrollToBottom();
	}, [getValues]);

	return (
		<>
			<div className='px-4 pb-20'>
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
						className='border-[#126BFB] flex-auto border rounded-md justify-center py-2.5 px-2 font-sfpro text-[14px] font-normal not-italic leading-normal whitespace-nowrap tracking-[0.04px] flex items-center text-[#126BFB]'
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
						<Drawer
							isOpen={isShowMap}
							direction='RIGHT'
							className={'hide-scrollbar overflow-auto'}
							height={'h-[100vh]'}
							setIsOpen={() => {}}
						>
							<div className='h-[100vh]'>
								<Map
									defaultLatlng={{
										lat: getValues('location')?.lat!,
										lng: getValues('location')?.lon!,
									}}
									mapContainerStyle={{ width: '100%', height: '100vh' }}
									onShow={(val) => setIsShowMap(val)}
									deviceType={DeviceType.MOBILE}
									onConfirm={({ ids, streetNumber, latlng }) => {
										setValue('location', { lat: latlng?.lat, lon: latlng?.lng });
										setValue('provinceId', ids.provinceId, { shouldDirty: true });
										onChange(
											addressActions.setProvince({
												id: ids.provinceId,
											}),
										);
										setValue('districtId', ids.districtId, { shouldDirty: true });
										onChange(
											addressActions.setDistrict({
												id: ids.districtId,
											}),
										);
										setValue('wardId', ids.wardId, { shouldDirty: true });
										onChange(
											addressActions.setWard({
												id: ids.wardId,
											}),
										);
										setValue('address', streetNumber, { shouldDirty: true });
									}}
								/>
							</div>
						</Drawer>
					</Portal>
				) : null}
				<p className='pt-4 pb-2 text-14 text-[#999999]'>Hoặc tìm siêu thị theo</p>
				<div className='space-y-5'>
					<div className='flex gap-2'>
						<InputField
							id='searchAddress'
							type='text'
							label='Tìm siêu thị'
							size='medium'
							typeStyleForms={{ labelInsideBorder: true, animation: true }}
							style={{ input: 'bg-white min-h-[58px]' }}
							suffixIcon={<img src='/static/svg/search-store-icon.svg' alt='' />}
						/>

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
										scrollToBottom();
									}}
									className={'flex-auto'}
									validationMessage={<MessageErrors name='provinceId' errors={errors} />}
									options={(dataAddress.data?.provinceTree || [])?.map((item) => {
										return { name: item.provinceName, value: item.provinceId };
									})}
								/>
							)}
							name='provinceId'
							control={control}
						/>
					</div>

					{getValues('provinceId') ? (
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
										scrollToBottom();
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
					) : null}

					{getValues('districtId') && getValues('provinceId') ? (
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
										scrollToBottom();
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
					) : null}

					{getValues('provinceId') && getValues('districtId') && getValues('wardId') ? (
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
										scrollToBottom();
									}}
									validationMessage={<MessageErrors name='address' errors={errors} />}
									typeStyleForms={{ labelInsideBorder: true, animation: true }}
									className='relative'
								/>
							)}
							name='address'
							control={control}
						/>
					) : null}

					{getValues('provinceId') &&
					getValues('districtId') &&
					getValues('wardId') &&
					getValues('address') ? (
						<div className='grid grid-cols-2 gap-x-2 pb-5'>
							<Controller
								render={({ field }) => (
									<div
										className={`relative flex min-h-[40px] items-center justify-evenly space-x-1 overflow-hidden rounded-md border border-solid p-1 ${
											Boolean(deliveryTime === DeliveryTimeEnums.WorkingHours)
												? 'border-[#FEBEF2] bg-[#F7F5FE] text-[#f05a94]'
												: 'border-[#EFEDFC] text-[#3E3E40]'
										}`}
										onClick={() => {
											field.onChange(DeliveryTimeEnums.WorkingHours);
											setDeliveryTime(DeliveryTimeEnums.WorkingHours);
										}}
										onKeyPress={() => {
											field.onChange(DeliveryTimeEnums.WorkingHours);
											setDeliveryTime(DeliveryTimeEnums.WorkingHours);
										}}
										tabIndex={0}
										role='button'
									>
										{Boolean(deliveryTime === DeliveryTimeEnums.WorkingHours) && (
											<div className='absolute -top-1px -right-1px'>
												<div className='h-0 w-0 border-t-18px border-l-18px border-t-[#F05A94] border-l-transparent' />
												<img
													src='/static/svg/iconCheck.svg'
													className='absolute top-2px right-2px h-9px w-7px'
													alt=''
												/>
											</div>
										)}
										<RadioField
											{...field}
											id='typeShipping1'
											label='Giao giờ hành chính'
											reverseRadio
											hidden
											checked={Boolean(deliveryTime === DeliveryTimeEnums.WorkingHours)}
											styles={{
												label:
													'text-14 text-center flex w-full justify-center cursor-pointer text-ellipsis line-clamp-1',
											}}
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
										className={`relative flex min-h-[40px] items-center justify-evenly space-x-1 rounded-md border border-solid p-1 ${
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
										{Boolean(deliveryTime === DeliveryTimeEnums.AllTime) && (
											<div className='absolute -top-1px -right-1px'>
												<div className='h-0 w-0 border-t-18px border-l-18px border-t-[#F05A94] border-l-transparent' />
												<img
													src='/static/svg/iconCheck.svg'
													className='absolute top-2px right-2px h-9px w-7px'
													alt=''
												/>
											</div>
										)}
										<RadioField
											{...field}
											id='typeShipping2'
											label='Giao các khung giờ'
											reverseRadio
											hidden
											checked={Boolean(deliveryTime === DeliveryTimeEnums.AllTime)}
											styles={{
												label:
													'text-14 text-center flex w-full justify-center cursor-pointer text-ellipsis line-clamp-1',
											}}
											value={DeliveryTimeEnums.AllTime}
										/>
									</div>
								)}
								name='typeShipping'
								control={control}
							/>
						</div>
					) : null}
				</div>
				<MessageErrors name='typeShipping' errors={errors} />
			</div>
			<div className='fixed bottom-0 z-[29] w-full px-4'>{renderBtnSubmit}</div>
			<div ref={refButton}></div>
		</>
	);
};

export default CartDelivery;
