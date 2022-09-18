import classNames from 'classnames';
import { ImageCustom, RadioField, Skeleton } from 'components';
import { useAppDispatch } from 'hooks';
import { CartModel, CustomerProfile, GenderEnums, TypeActionShippingAddress } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { ScopedMutator } from 'swr/dist/types';
import { handleChangeShipping, handleDeleteProfile } from 'utils';

import { cartActions } from '@/store/reducers/cartSlice';

import { AvtCharacter } from '../../components';
interface CartShippingProps {
	dataProfiles?: CustomerProfile[] | null;
	onAction: any;
	typeAction: TypeActionShippingAddress;
	onMutable: ScopedMutator<any>;
	dataCart?: CartModel | null;
}

const DynamicPickupAddress = dynamic(() => import('../cart-pickupAddress/cart-pickupAddress'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const CartShipping: React.FC<CartShippingProps> = ({
	dataCart,
	dataProfiles,
	typeAction,
	onMutable,
	onAction,
}) => {
	const [isFullAddress, setIsFullAddress] = useState<number>(0);
	const [isMount, setIsMount] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const { profileId, gender, contactName, mobileNumber } =
		(dataCart?.cartShipping as CustomerProfile) || {};

	useEffect(() => {
		!Boolean(profileId) &&
			(dataProfiles ?? [])?.length > 0 &&
			setTimeout(() => {
				setIsMount(true);
			}, 2000);
	}, []);

	const FormRegist: React.FC<{ dataProfiles?: CustomerProfile[] | null }> = ({ dataProfiles }) => {
		return (
			<div className='mb-2 space-y-4'>
				<div
					className={classNames([
						'flex justify-between',
						!profileId && !dataProfiles?.length && 'flex-col',
					])}
				>
					<div className='flex items-center justify-between'>
						<span className='font-sfpro_bold text-16 font-semibold leading-6 tracking-[0.04px] text-black'>
							Thông tin nhận hàng
						</span>
					</div>

					{!dataProfiles?.length && !profileId ? (
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
									}}
									onClick={() => {
										onAction('CREATE');
									}}
									tabIndex={0}
									role='button'
								>
									Thêm mới thông tin nhận hàng
								</span>
							</div>
						</div>
					) : (
						<div
							className='flex cursor-pointer items-center space-x-1'
							onKeyPress={() => onAction('CREATE')}
							onClick={() => onAction('CREATE')}
							tabIndex={0}
							role='button'
						>
							<img
								className='h-auto w-4'
								src='/static/svg/plus-circle-4834d6.svg'
								alt='vuivui icon'
							/>
							<span className='font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#f05a94]'>
								Thêm địa chỉ mới
							</span>
						</div>
					)}
				</div>
				{profileId && (dataProfiles ?? []).length > 1 ? (
					<div className='relative z-[10] space-y-[6px] rounded-[6px] bg-[#F2F2F2] p-3'>
						{dataProfiles?.map((item, i: number) => {
							const targetSelectShipping = dataProfiles?.find(
								(item) => item.profileId === profileId,
							);

							return (
								(!isFullAddress
									? targetSelectShipping?.profileId === item?.profileId
									: isFullAddress >= i) && (
									<div className='flex items-center' key={i}>
										<RadioField
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
											styles={{ label: 'w-[22px] h-[22px] cursor-pointer relative z-10' }}
											className={classNames([
												!item?.receiveMyAddress ? 'min-h-[172px]' : 'min-h-[130px]',
											])}
										/>
										<div className='relative z-[10] space-y-[6px] bg-[#F2F2F2] p-3'>
											<div className='mb-3 flex items-center justify-start gap-2'>
												{item?.pickupStore?.avatarImage?.fullPath ? (
													<div className='relative h-[46PX] w-[46PX] max-w-[46px] flex-[46px] overflow-hidden rounded-full'>
														<ImageCustom
															src={item?.pickupStore?.avatarImage?.fullPath}
															alt='avatar'
															layout='fill'
															className='h-full w-full object-cover'
														/>
													</div>
												) : (
													<AvtCharacter
														name={item?.contactName}
														sizes={'large'}
														color={'white'}
														fonts={{ bold: true, uppercase: true }}
														backgroundColor={'#FB6E2E'}
													/>
												)}
												{!item?.receiveMyAddress ? (
													<div className='font-semibold_semiBold text-[16] max-w-[calc(100%_-_46px)] flex-[calc(100%_-_46px)] space-x-1 font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
														<span>{item?.pickupStore?.name}</span>
														<span>{item?.pickupStore?.address}</span>
													</div>
												) : (
													<div className='font-semibold_semiBold text-[16] max-w-[calc(100%_-_46px)] flex-[calc(100%_-_46px)] space-x-1 font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
														<span>{item?.gender === GenderEnums.Male ? 'Anh' : 'Chị'}</span>
														<span>
															{item?.contactName} - {item?.mobileNumber}
														</span>
													</div>
												)}
											</div>
											<div className='text-justify font-sfpro text-[14px] font-normal not-italic leading-[1.4] text-black'>
												{item?.fullAddress
													?.split(',')
													?.filter((ele) => ele)
													?.join(', ')}
											</div>
											{!item?.receiveMyAddress ? (
												<span className='font-semibold_semiBold text-[16] font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
													{item?.contactName} - {item?.mobileNumber}
												</span>
											) : null}
											<div className='flex justify-between'>
												{(dataProfiles ?? []).length > 1 && !isFullAddress ? (
													<span
														className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#126BFB]'
														onClick={() => setIsFullAddress((dataProfiles ?? [])?.length)}
														tabIndex={0}
														role={'button'}
														onKeyPress={() => setIsFullAddress((dataProfiles ?? [])?.length)}
													>
														Giao đến địa chỉ khác
													</span>
												) : null}

												<div
													className='group flex cursor-pointer items-center space-x-1'
													onKeyPress={() => onAction('EDIT', item?.profileId)}
													onClick={() => onAction('EDIT', item?.profileId)}
													tabIndex={0}
													role='button'
												>
													<img
														className='h-auto w-4'
														src='/static/svg/edit-icon-new.svg'
														alt='vuivui pencil'
													/>
													<span className='animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#6F6D6F] group-hover:text-pink-F05A94'>
														Sửa
													</span>
												</div>
												{profileId !== item.profileId && (
													<div
														className='group ml-4 flex cursor-pointer items-center space-x-1'
														onKeyPress={() => {
															onAction('DELETE');
															handleDeleteProfile(item?.profileId, profileId, onMutable);
														}}
														onClick={() => {
															onAction('DELETE');
															handleDeleteProfile(item?.profileId, profileId, onMutable);
														}}
														tabIndex={0}
														role='button'
													>
														<img
															className='h-auto w-3'
															src='/static/svg/icon-trash.svg'
															alt='vuivui pencil'
														/>
														<span className='animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#6F6D6F] group-hover:text-red-500'>
															Xóa
														</span>
													</div>
												)}
											</div>
										</div>
									</div>
								)
							);
						})}
					</div>
				) : null}

				{profileId && (dataProfiles ?? []).length === 1 ? (
					<div className='relative z-[10] space-y-[6px] rounded-[6px] bg-[#F2F2F2] p-3'>
						<div className='mb-3 flex items-center justify-start gap-3'>
							{dataProfiles?.[0]?.pickupStore?.avatarImage?.fullPath ? (
								<div className='relative h-[46PX] w-[46PX] max-w-[46px] flex-[46px] overflow-hidden rounded-full'>
									<ImageCustom
										src={dataProfiles?.[0]?.pickupStore?.avatarImage?.fullPath}
										alt='avatar'
										layout='fill'
										className='h-full w-full object-cover'
									/>
								</div>
							) : (
								<AvtCharacter
									name={dataProfiles?.[0]?.contactName!}
									sizes={'large'}
									color={'white'}
									fonts={{ bold: true, uppercase: true }}
									backgroundColor={'#FB6E2E'}
								/>
							)}
							{!dataProfiles?.[0]?.receiveMyAddress ? (
								<div className='font-semibold_semiBold text-[16] max-w-[calc(100%_-_46px)] flex-[calc(100%_-_46px)] space-x-1  pl-2 font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
									<span>{dataProfiles?.[0]?.pickupStore?.name}</span>
									<span>{dataProfiles?.[0]?.pickupStore?.address}</span>
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
							{dataProfiles?.[0]?.fullAddress
								?.split(',')
								?.filter((ele) => ele)
								?.join(', ')}
						</div>
						{!dataProfiles?.[0]?.receiveMyAddress ? (
							<span className='font-semibold_semiBold text-[16] font-sfpro_bold font-bold not-italic leading-[1.4] text-[#333333]'>
								{contactName} - {mobileNumber}
							</span>
						) : null}
						<div className='flex justify-start'>
							{(dataProfiles ?? []).length > 1 ? (
								<span className='font-sfpro_semiBold text-[14px] font-semibold not-italic leading-normal tracking-[0.04px] text-[#126BFB]'>
									Giao đến địa chỉ khác
								</span>
							) : null}

							<div
								className='group flex cursor-pointer items-center space-x-1'
								onKeyPress={() => onAction('EDIT', dataProfiles?.[0]?.profileId)}
								onClick={() => onAction('EDIT', dataProfiles?.[0]?.profileId)}
								tabIndex={0}
								role='button'
							>
								<img
									className='h-auto w-4'
									src='/static/svg/edit-icon-new.svg'
									alt='vuivui pencil'
								/>
								<span className='animation-300 font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#6F6D6F] group-hover:text-pink-F05A94'>
									Sửa
								</span>
							</div>
						</div>
					</div>
				) : null}

				{!Boolean(profileId) && (dataProfiles ?? [])?.length > 0 && !isMount ? (
					<div className='relative z-[10] space-y-[6px] rounded-[6px] bg-[#F2F2F2] p-3'>
						<Skeleton.Skeleton lines={2} type='comment' />
					</div>
				) : null}
			</div>
		);
	};

	return (
		<>
			{typeAction.isActionActive ? (
				<DynamicPickupAddress dataCart={dataCart} typeAction={typeAction} />
			) : (
				<FormRegist dataProfiles={dataProfiles} />
			)}
		</>
	);
};

export default CartShipping;
