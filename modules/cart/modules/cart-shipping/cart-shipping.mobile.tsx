import classNames from 'classnames';
import { ImageCustom, RadioField } from 'components';
import { DeviceType } from 'enums';
import { useAppDispatch, useAppSelector } from 'hooks';
import {
	CartModel,
	CustomerProfile,
	GenderEnums,
	ICartFormProps,
	TypeActionShippingAddress,
} from 'models';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { ScopedMutator } from 'swr/dist/types';
import { handleChangeShipping, handleDeleteProfile } from 'utils';
import { Icon, IconEnum } from 'vuivui-icons';

import { currentUserSelector } from '@/store/reducers/authSlice';
import { cartActions } from '@/store/reducers/cartSlice';

import { AvtCharacter, Drawer } from '../../components';

interface CartShippingProps {
	dataProfiles?: CustomerProfile[] | null;
	onAction: any;
	forDevice: DeviceType;
	typeAction: TypeActionShippingAddress;
	onMutable: ScopedMutator<any>;
	dataCart?: CartModel | null;
	isShowDrawer: boolean;
	renderBtnSubmit?: React.ReactNode;
	onShowDrawer: (value: React.SetStateAction<boolean>) => void;
	isShowDrawerFullAddress: boolean;
	onShowDrawerFullAddress: (value: React.SetStateAction<boolean>) => void;
	onShowDashPageDetail: (value: React.SetStateAction<boolean>) => void;
}

const DynamicPickupAddressMobile = dynamic(
	() => import('../cart-pickupAddress/cart-pickupAddress.mobile'),
	{
		loading: () => <>Loading...</>,
		ssr: false,
	},
);

const CartShipping: React.FC<CartShippingProps> = ({
	dataCart,
	dataProfiles,
	typeAction,
	onMutable,
	isShowDrawer,
	onAction,
	onShowDrawer,
	renderBtnSubmit,
	isShowDrawerFullAddress,
	onShowDashPageDetail,
	onShowDrawerFullAddress,
}) => {
	const { reset } = useFormContext<ICartFormProps>();

	const [isFullAddress, setIsFullAddress] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const {
		profileId,
		gender,
		contactName,
		mobileNumber,
		pickupStoreId,
		fullAddress,
		pickupStore,
		receiveMyAddress,
	} = (dataCart?.cartShipping as CustomerProfile) || {};

	const authSelector = useAppSelector(currentUserSelector);
	const PHONE_NUMBER_HAS_CONFIRMED = Boolean(authSelector?.phoneNumberConfirmed);

	const InformationDefault: React.FC<{ dataProfiles?: CustomerProfile[] | null }> = ({
		dataProfiles,
	}) => {
		return (
			<div className='mb-2 space-y-4'>
				<div className={classNames(['flex justify-between', !profileId && 'flex-col'])}>
					<div className='flex w-full items-center justify-between'>
						<span className='font-sfpro_bold text-16 font-semibold leading-6 tracking-[0.04px] text-black'>
							Thông tin nhận hàng
						</span>
						{profileId && (
							<span className='text-14 text-[#999999]'>
								{pickupStoreId ? 'Nhận tại cửa hàng' : 'Giao tận nơi'}
							</span>
						)}
					</div>

					{!dataProfiles?.length && (
						<div className='mx-auto flex cursor-pointer items-center space-x-1 pt-4'>
							<div className='relative h-[56px] w-[56px]'>
								<ImageCustom
									src={'/static/svg/empty-profile.icon.svg'}
									alt={'empty profile icon'}
									layout={'fill'}
								/>
							</div>
							<div className='flex flex-col'>
								<div className='font-sfpro_semiBold text-[#666666]'>Danh sách trống</div>
								<span
									className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#126BFB]'
									onKeyPress={() => {
										onAction('CREATE');
										onShowDrawer(true);
									}}
									onClick={() => {
										onAction('CREATE');
										onShowDrawer(true);
									}}
									tabIndex={0}
									role='button'
								>
									Thêm mới thông tin nhận hàng
								</span>
							</div>
						</div>
					)}
				</div>

				{profileId && (
					<div className='relative z-[10] space-y-[12px] rounded-md bg-[#F6F6F6] p-4'>
						<div className='mb-3 flex items-center justify-start gap-2'>
							{pickupStore?.avatarImage?.fullPath ? (
								<div className='relative h-[46PX] w-[46PX] max-w-[46px] flex-[46px] overflow-hidden rounded-full'>
									<ImageCustom
										src={pickupStore?.avatarImage?.fullPath}
										alt='avatar'
										layout='fill'
										className='h-full w-full object-cover'
									/>
								</div>
							) : (
								<AvtCharacter
									name={contactName}
									sizes={'large'}
									color={'white'}
									fonts={{ bold: true, uppercase: true }}
									backgroundColor={'#FB6E2E'}
								/>
							)}

							{!receiveMyAddress ? (
								<div className='font-semibold_semiBold text-[16] max-w-[calc(100%_-_46px)] flex-[calc(100%_-_46px)] space-x-1 font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
									<span>{pickupStore?.name}</span>
									<span>{pickupStore?.address}</span>
								</div>
							) : (
								<div className='font-semibold_semiBold text-[16] max-w-[calc(100%_-_46px)] flex-[calc(100%_-_46px)] space-x-1 font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
									<span>{gender === GenderEnums.Male ? 'Anh' : 'Chị'}</span>
									<span>
										{contactName} - {mobileNumber}
									</span>
								</div>
							)}
						</div>
						<div className='text-justify font-sfpro text-[14px] font-normal not-italic leading-[1.4] text-black'>
							{fullAddress
								.split(',')
								.filter((ele) => ele)
								.join(', ')}
						</div>
						{!receiveMyAddress ? (
							<div className='font-semibold_semiBold text-[16] font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
								<span>
									{gender === GenderEnums.Male ? 'Anh' : 'Chị'} {contactName} - {mobileNumber}
								</span>
							</div>
						) : null}
						<div className='flex items-center justify-between'>
							<span
								className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#126BFB]'
								onKeyPress={() => {
									onShowDrawerFullAddress(true);
									onShowDrawer(true);
								}}
								onClick={() => {
									onShowDrawerFullAddress(true);
									onShowDrawer(true);
								}}
								tabIndex={0}
								role='button'
							>
								Giao đến địa chỉ khác
							</span>

							<div
								className='group flex cursor-pointer items-center space-x-1'
								onKeyPress={() => {
									onAction('EDIT', profileId);
									onShowDrawer(true);
								}}
								onClick={() => {
									onAction('EDIT', profileId);
									onShowDrawer(true);
								}}
								tabIndex={0}
								role='button'
							>
								<img
									className='h-auto w-4'
									src='/static/svg/edit-icon-new.svg'
									alt='vuivui pencil'
								/>
								<span className='animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#999999] group-hover:text-pink-F05A94'>
									Sửa
								</span>
							</div>
						</div>
					</div>
				)}
			</div>
		);
	};

	const handleCloseDrawerFullAddress = () => {
		onAction('SUBMIT');
		onShowDrawer(false);
		setTimeout(() => {
			onShowDrawerFullAddress(false);
		}, 1000);
		if (!PHONE_NUMBER_HAS_CONFIRMED) {
			onShowDashPageDetail(false);
			reset();
		}
	};

	return (
		<>
			<Drawer
				isOpen={isShowDrawer}
				direction='BOTTOM'
				className={'hide-scrollbar z-[30] h-[calc(100%_-_56px)] overflow-auto'}
				setIsOpen={() => onShowDrawer(false)}
			>
				<div className='flex w-full items-center gap-3 border-b fixed bg-white z-[30] border-[#f2f2f2f2] px-3 py-2.5'>
					{typeAction.action === 'EDIT' && !isShowDrawerFullAddress && (
						<div
							className='relative h-5 w-5'
							tabIndex={0}
							onClick={() => {
								onShowDrawerFullAddress(true);
							}}
							onKeyPress={() => {
								onShowDrawerFullAddress(true);
							}}
							role='button'
						>
							<ImageCustom
								className='cursor-pointer '
								src='/static/svg/arrow-left.svg'
								alt='search'
								layout='fill'
							/>
						</div>
					)}
					{typeAction.action === 'CREATE' && !isShowDrawerFullAddress && (
						<div
							className={'relative h-5 w-5'}
							tabIndex={0}
							onClick={handleCloseDrawerFullAddress}
							onKeyPress={handleCloseDrawerFullAddress}
							role='button'
						>
							<Icon name={IconEnum.X} size={20} />
						</div>
					)}

					{isShowDrawerFullAddress && (
						<div
							className={'relative h-5 w-5'}
							tabIndex={0}
							onClick={handleCloseDrawerFullAddress}
							onKeyPress={handleCloseDrawerFullAddress}
							role='button'
						>
							<ImageCustom
								className='cursor-pointer '
								src='/static/svg/Close.svg'
								alt='search'
								layout='fill'
							/>
						</div>
					)}

					<div
						className={classNames([
							'flex items-center',
							typeAction.action === 'EDIT' && 'flex-auto',
						])}
					>
						<div className='font-sfpro text-base text-[#333333]'>
							{!isShowDrawerFullAddress && typeAction.action === 'CREATE' && 'Thêm địa chỉ mới'}

							{typeAction.action === 'EDIT' && !isShowDrawerFullAddress && 'Chỉnh sửa địa chỉ'}

							{isShowDrawerFullAddress &&
								`Chọn địa chỉ khác ${
									(dataProfiles ?? []).length > 0 ? `(${(dataProfiles ?? []).length})` : ''
								} `}
						</div>
					</div>
				</div>
				{isShowDrawerFullAddress ? (
					<>
						<div className='hide-scrollbar h-full max-h-fit overflow-auto px-4 mt-[45px]'>
							{dataProfiles?.map((item, i: number) => {
								const targetSelectShipping = dataProfiles?.find(
									(item) => item.profileId === profileId,
								);

								return (
									(!isFullAddress ? i < 3 : dataProfiles.length) && (
										<RadioField
											key={i}
											id={item?.profileId}
											checked={Boolean(targetSelectShipping?.profileId === item?.profileId)}
											name={'profileSelected'}
											onChange={() =>
												typeAction.action !== 'DELETE' &&
												handleChangeShipping(
													dataCart?.cartId,
													item.profileId,
													onMutable,
													dispatch,
													(loading) => dispatch(cartActions.isLoading(loading)),
												)
											}
											className='h-[120px] border-b border-[#EBEBEB] last-of-type:border-b-0'
											render={
												<div className='relative z-[10] p-3'>
													<div className='font-semibold_semiBold text-[16] mb-[4px] space-x-1 font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
														<span>{item?.gender === GenderEnums.Male ? 'Anh' : 'Chị'}</span>
														<span>
															{item?.contactName} - {item?.mobileNumber}
														</span>
													</div>
													<div className='text-justify font-sfpro text-[14px] font-normal not-italic leading-[1.4] text-black'>
														{item?.fullAddress
															?.split(',')
															?.filter((ele) => ele)
															?.join(', ')}
														{item.hourOffice ? '(Giao giờ hành chánh)' : '(Tất cả khung giờ)'}
													</div>
													<div className='mt-3 flex justify-start gap-3'>
														<div
															className='group flex cursor-pointer items-center space-x-1'
															onKeyPress={() => {
																onAction('EDIT', item?.profileId);
																onShowDrawerFullAddress(false);
															}}
															onClick={() => {
																onAction('EDIT', item?.profileId);
																onShowDrawerFullAddress(false);
															}}
															tabIndex={0}
															role='button'
														>
															<img
																className='h-auto w-4'
																src='/static/svg/edit-icon-new.svg'
																alt='vuivui pencil'
															/>
															<span className='animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#999999] group-hover:text-pink-F05A94'>
																Sửa
															</span>
														</div>
														{profileId !== item.profileId && (
															<div
																className='group ml-4 flex cursor-pointer items-center space-x-1'
																onKeyPress={() => {
																	onAction('DELETE');
																	handleDeleteProfile(item?.profileId, profileId ?? '', onMutable);
																}}
																onClick={() => {
																	onAction('DELETE');
																	handleDeleteProfile(item?.profileId, profileId ?? '', onMutable);
																}}
																tabIndex={0}
																role='button'
															>
																<img
																	className='h-auto w-3'
																	src='/static/svg/icon-trash.svg'
																	alt='vuivui pencil'
																/>
																<span className='animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#666666] group-hover:text-red-500'>
																	Xóa
																</span>
															</div>
														)}
													</div>
												</div>
											}
										/>
									)
								);
							})}

							{dataProfiles?.length && Number(dataProfiles?.length) > 3 && (
								<div
									className='py-4 font-sfpro_semiBold font-semibold text-[#333333]'
									onClick={() => setIsFullAddress(!isFullAddress)}
									onKeyPress={() => setIsFullAddress(!isFullAddress)}
									tabIndex={0}
									role={'button'}
								>
									{isFullAddress
										? 'Thu gọn'
										: `Xem ${Number(dataProfiles?.length) - 3} thêm địa chỉ khác`}
								</div>
							)}
						</div>

						<div
							className='bottom-0 z-[20] border-t-8 border-[#F6F6F6]'
							style={{ position: 'sticky' }}
						>
							<div className='flex w-[100%] items-center gap-2 border-t border-[#EBEBEB] bg-white px-4 py-[8px]'>
								<div
									className='flex flex-auto items-center justify-center gap-2 rounded-md bg-[#FB6E2E] py-[14px] text-center text-white'
									onKeyPress={() => {
										onAction('CREATE');
										setTimeout(() => {
											onShowDrawerFullAddress(false);
										}, 500);
									}}
									onClick={() => {
										onAction('CREATE');
										setTimeout(() => {
											onShowDrawerFullAddress(false);
										}, 500);
									}}
									tabIndex={0}
									role='button'
								>
									<Icon name={IconEnum.PlusCircle} color={'#FB6E2E'} fill={'white'} />
									<span>Thêm địa chỉ nhận hàng mới</span>
								</div>
							</div>
						</div>
					</>
				) : (
					<DynamicPickupAddressMobile
						dataCart={dataCart}
						typeAction={typeAction}
						renderBtnSubmit={renderBtnSubmit}
					/>
				)}
			</Drawer>
			<InformationDefault dataProfiles={dataProfiles} />
		</>
	);
};

export default CartShipping;
