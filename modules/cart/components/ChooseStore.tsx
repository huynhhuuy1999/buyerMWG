import { ImageCustom, MessageErrors, RadioField } from 'components';
import { ICartFormProps, pickupStoreModels } from 'models';
import React, { useEffect, useState } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
interface ChooseStoreProps {
	stores?: pickupStoreModels[];
	defaultValue?: string | number;
	onClick?: (value: string | number) => void;
}

const ChooseStore: React.FC<ChooseStoreProps> = ({ stores, defaultValue, onClick }) => {
	const [value, setValue] = useState<string | number>();
	const [isShowMore, setIsShowMore] = useState<boolean>(false);
	const {
		control,
		formState: { errors },
	} = useFormContext<ICartFormProps>();

	useEffect(() => {
		if (!value && defaultValue) {
			setValue(defaultValue);
		}
	}, [defaultValue]);

	const handleOnClick = (storeId: string | number) => {
		setValue(storeId);
		onClick && onClick(storeId);
	};

	return (
		<div className='my-4 py-4'>
			{stores?.length ? (
				stores?.map((store, index) => {
					return (
						!store?.delete &&
						(!isShowMore ? index <= 2 : stores.length) && (
							<Controller
								control={control}
								name='pickupStoreId'
								render={({ field }) => (
									<div className='mb-4'>
										<div className='mb-8 h-[1px] space-x-2'>
											<div className='flex items-center'>
												<RadioField
													{...field}
													id={store?.pickupStoreId}
													name='pickupStore'
													onChange={() => {
														field.onChange(store?.pickupStoreId);
														handleOnClick(store?.pickupStoreId);
													}}
													className='mr-3 h-[22px] w-[22px]'
													styles={{ label: 'w-[22px] h-[22px] cursor-pointer relative z-10' }}
													checked={store.pickupStoreId === value}
												/>
												<div className='flex items-center gap-2'>
													<div className='flex flex-auto items-center gap-2'>
														<div
															className='relative h-8 w-8 overflow-hidden rounded-full'
															style={{
																filter:
																	'drop-shadow(0px 1px 2px rgba(97, 97, 97, 0.2)) drop-shadow(0px 2px 4px rgba(97, 97, 97, 0.2))',
															}}
														>
															<ImageCustom
																layout='fill'
																src={store?.avatarImage?.fullPath}
																alt='store logo vuivui'
															/>
														</div>

														<span className='text-ellipsis font-sfpro_semiBold text-[14px] font-semibold not-italic leading-6 tracking-[0.04px] text-[#333333] line-clamp-1'>
															{store?.name}
														</span>
													</div>
												</div>
											</div>
										</div>
										<span className='font-sfpro text-[12px] font-normal not-italic leading-[16px] tracking-[0.04px] text-[#666666]'>
											{store.fullAddress}
										</span>
										<span className='cursor-pointer font-sfpro text-[12px] font-normal not-italic leading-6 tracking-[0.04px] text-[#4527A0]'>
											(Xem bản đồ)
										</span>
										<div className='space-x-1'>
											{store.openTime && (
												<span className='font-sfpro text-[12px] font-normal not-italic leading-[16px] tracking-[0.04px] text-[#757575]'>
													Mở cửa {store?.openTime}h sáng - {store?.closeTime}h tối
												</span>
											)}
										</div>
										<MessageErrors name='pickupStoreId' errors={errors} />
									</div>
								)}
							/>
						)
					);
				})
			) : (
				<div>Nơi này hiện không có cửa hàng nào</div>
			)}
			{(stores ?? [])?.length > 3 && (
				<div
					className='cursor-pointer text-center font-sfpro text-[14px] font-normal not-italic leading-normal tracking-[0.04px] text-[#7953D2]'
					onClick={() => setIsShowMore(!isShowMore)}
					onKeyPress={() => setIsShowMore(!isShowMore)}
					tabIndex={0}
					role={'button'}
				>
					{isShowMore ? `Thu gọn` : `Xem thêm ${(stores ?? [])?.length - 3} điểm khác`}
				</div>
			)}
		</div>
	);
};

export default ChooseStore;
