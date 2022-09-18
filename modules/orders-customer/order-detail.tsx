import { ImageCustom, Skeleton } from 'components';
import { orderStatusType } from 'enums';
import { GenderEnums, OrderDetailsModel, TimelineOrderDetail } from 'models';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import timeConfig from '@/configs/timeConfig';
import { formatTime } from '@/utils/convertTime';

import { RenderOrderStatus } from './components';

interface IOrderDetail {
	detail?: OrderDetailsModel;
	timeline?: TimelineOrderDetail[];
}

const LoadingSkeleton = () => {
	return (
		<div className='shadow-shadow-profileCard mb-4 rounded-6px bg-white p-6 last-of-type:mb-0'>
			<div className='border-b border-dashed border-[#D8D8D8] pb-4'>
				<Skeleton.Skeleton type='text' />
			</div>
			<div className='flex justify-between py-4'>
				<div className='flex pr-4'>
					<Skeleton.Skeleton
						cardType={Skeleton.CardType.square}
						type='card'
						width={110}
						height={110}
					/>
				</div>
				<div className='flex-auto'>
					<span className='text-14 leading-5 text-[#666666]'>
						<Skeleton.Skeleton type='comment' lines={1} />
					</span>
				</div>
			</div>
		</div>
	);
};

const OrderDetail: React.FC<IOrderDetail> = ({ detail, timeline }) => {
	const router = useRouter();
	const subOrderId = router.query?.status_orders as string;

	const memoDataDetail = useMemo(() => {
		return detail?.details?.find((e) => e.subOrderId === subOrderId);
	}, [detail?.details, subOrderId]);

	return (
		<>
			{memoDataDetail?.shipping?.items?.length ? (
				<div>
					<div className='my-[7px] rounded-t-[6px] bg-[#fff] px-[22px] py-[15px] font-sfpro_semiBold text-[24px]'>
						Thông tin đơn hàng
					</div>
					<div className='my-[7px] rounded-[6px] bg-[#fff] px-[22px] text-[24px]'>
						<div className='flex items-center flex-wrap justify-between border-b-2 border-dotted border-[#D8D8D8] py-[22px]'>
							<div className='flex items-center'>
								<div className='relative mr-[10px] h-[40px] w-[40px] '>
									<ImageCustom
										className='w-full rounded-[50%]'
										width={40}
										height={40}
										alt='test vui vui'
										src={memoDataDetail?.merchant?.avatarImage!}
									/>
								</div>

								<span className='mb-[0px] block font-sfpro_semiBold text-sm uppercase text-[#000000]'>
									{memoDataDetail?.merchant?.name}
								</span>
							</div>

							<span className='ml-[2px] mb-[0px] block  text-[14px] text-[#666666]'>
								Mã đơn hàng: #{memoDataDetail?.subOrderId}
							</span>
							<span className='ml-[2px] mb-[0px] block  text-[14px] text-[#666666]'>
								Ngày đặt hàng:{' '}
								{formatTime(memoDataDetail?.createdAt!, timeConfig.custom?.dayMothYearh)}
							</span>
							<div>
								<div className='flex items-center'>
									<span className='ml-[2px] mb-[0px] block font-sfpro_semiBold  text-[16px] text-[#FB6E2E] whitespace-nowrap'>
										<RenderOrderStatus
											status={memoDataDetail?.status}
											statusName={memoDataDetail?.statusName}
										/>
									</span>
									<span className='ml-[2px] mb-[0px] block font-sfpro_semiBold text-[16px] text-[#333333]'>
										từ{' '}
										{memoDataDetail?.status !== orderStatusType.CANCEL
											? memoDataDetail?.merchant?.name
											: memoDataDetail?.cancelled?.cancelledBy ?? 'Người dùng'}
									</span>
								</div>

								<span className='ml-[2px] mb-[0px] block  text-[14px] text-[#666666]'>
									Dự kiến vào{' '}
									{formatTime(
										String(memoDataDetail?.shipping?.estimatedDate)!,
										timeConfig.custom?.fullDate,
									)}
								</span>
							</div>
						</div>

						<div className='bg-[#fff]'>
							{memoDataDetail?.shipping?.items?.map((product, index: number) => (
								<div
									className='flex items-center border-b-2 border-[#E0E0E0] py-[22px] last-of-type:border-b-transparent'
									key={index}
								>
									<div className='relative mr-[10px] h-[60px] w-[60px] '>
										<ImageCustom
											className='w-full rounded-[50%]'
											width={60}
											height={60}
											objectFit={'cover'}
											alt='test vui vui'
											src={product?.variationImage}
										/>
									</div>

									<div className='w-full'>
										<div className='flex items-center justify-between'>
											<span className='mb-[0px] block text-sm uppercase text-[#000000]'>
												{product?.productName}
											</span>
											<button className='cursor-pointer rounded-[6px] border px-[10px] py-1 text-[14px] text-[#333333] opacity-90 hover:opacity-100'>
												Hủy đơn
											</button>
										</div>
										<div className='grid grid-cols-10'>
											<span className='col-span-4 mb-[0px] block font-sfpro_semiBold text-[18px] text-[#000000]'>
												{product?.productPrice?.toLocaleString('it-IT')} đ
											</span>
											<div className='col-span-6 flex items-center'>
												<span className='mb-[0px] block px-[7px] text-sm text-[#828282]'>
													Màu: <span className='text-[#000000]'>{product?.propertyValueName1}</span>
												</span>
												{product?.hasOwnProperty('propertyValueName2') ? (
													<span className='mb-[0px] block border-x border-[#BDBDBD] px-[7px] text-sm text-[#828282]'>
														Size:{' '}
														<span className='text-[#000000]'>{product?.propertyValueName2}</span>
													</span>
												) : null}
												<span className='mb-[0px] block px-[7px] text-sm text-[#828282]'>
													Số lượng:{' '}
													<span className='text-[#000000]'>{product?.productQuantity}</span>
												</span>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>

					<div className='bg-[#fff] py-[22px] px-[14px]'>
						<div className='flex items-center justify-between'>
							<span className='block text-[18px] text-[#4F4F4F]'>Tạm tính:</span>
							<span className='block font-sfpro_semiBold text-[16px] text-[#000000]'>
								{memoDataDetail?.shipping?.items
									?.reduce((prevNew: any, currNew: any) => {
										return prevNew + currNew.productPrice * currNew.productQuantity;
									}, 0)
									?.toLocaleString('it-IT')}{' '}
								đ
							</span>
						</div>
						{memoDataDetail?.additionalCharges?.map((ele, index: number) => (
							<div className='flex items-center justify-between' key={index}>
								<span className='block text-[18px] text-[#4F4F4F]'>{ele?.name}</span>
								<span className='block font-sfpro_semiBold text-[16px] text-[#000000]'>
									{ele?.value?.toLocaleString('it-IT')} đ
								</span>
							</div>
						))}

						<div className='flex items-center justify-between'>
							<span className='block text-[18px] text-[#4F4F4F]'>Tổng tiền:</span>
							<span className='block font-sfpro_semiBold text-[20px] font-bold text-[#000000]'>
								{(
									+memoDataDetail?.payment?.paymentTotalWithMerchant -
									memoDataDetail?.merchantDiscount +
									memoDataDetail?.shipping?.shippingFee
								)?.toLocaleString('it-IT')}{' '}
								đ
							</span>
						</div>
						<span className='flex w-full justify-end text-[16px] text-[#828282]'>
							(Giá bán đã bao gồm thuế VAT)
						</span>
					</div>

					<div className='my-[7px] bg-[#fff] py-[22px] px-[14px]'>
						<span className='block font-sfpro_semiBold text-[18px] text-[#000000]'>
							Thông tin nhận hàng
						</span>
						<span className='block text-[16px] text-[#000000]'>
							{memoDataDetail?.shipping?.shipingToGender === GenderEnums.Male ? 'Anh' : 'Chị'}{' '}
							{memoDataDetail?.shipping?.shipingToName}
						</span>
						<span className='block text-[16px] text-[#828282]'>
							{memoDataDetail?.shipping?.toPhoneNumber}
						</span>
						<span className='block text-[16px] text-[#828282]'>
							{memoDataDetail?.shipping?.toFullAddress
								.split(',')
								.filter((ele) => ele)
								.join(', ')}
						</span>
					</div>

					<div className='my-[7px] bg-[#fff] py-[22px] px-[14px]'>
						<span className='block font-sfpro_semiBold text-[18px] text-[#000000]'>
							Phương thức giao hàng
						</span>
						<span className='block text-[16px] text-[#828282]'>Giao tận nơi</span>
					</div>

					<div className='my-[7px] flex items-center justify-between bg-[#fff] py-[22px] px-[14px]'>
						<div>
							<span className='block font-sfpro_semiBold text-[18px] text-[#000000]'>
								Phương thức thanh toán
							</span>
							<span className='block text-[16px] text-[#828282]'>
								{memoDataDetail?.payment?.paymentName}
							</span>
						</div>
						<span className='block text-[18px] text-[#009ADA]'>Thay đổi</span>
					</div>

					<div className='my-[7px] bg-[#fff] py-[22px] px-[14px]'>
						<span className='block font-sfpro_semiBold text-[18px] text-[#000000]'>
							Ngày nhận hàng (dự kiến)
						</span>
						<span className='block text-[16px] text-[#828282]'>
							<span className='normal-case'>
								{formatTime(
									String(memoDataDetail?.shipping?.estimatedDate),
									timeConfig.custom?.dayMonthWithTime,
								)}
							</span>
						</span>
					</div>

					<div className='my-[7px] bg-[#fff] py-[22px] px-[14px]'>
						<span className='block font-sfpro_semiBold text-[18px] text-[#000000]'>
							Nhận hàng trước{' '}
							<span className='uppercase text-[#FB6E2E]'>
								{formatTime(
									String(memoDataDetail?.shipping?.estimatedDate),
									timeConfig.custom?.fullDate,
								)}
							</span>
						</span>
						<span className='mb-2 inline-block text-16 text-[#6E6E70]'>
							Vận chuyển bởi - {memoDataDetail?.shipping?.partnerName}
						</span>
						{timeline?.map((time, index: number) => (
							<div key={index}>
								<span className='z-1 relative rounded-[6px] border bg-[#ffffff] px-[15px] py-[5px] font-sfpro_semiBold text-[20px] text-[#444444] '>
									{formatTime(time?.dateTime, timeConfig.custom?.dayMonthYearWithDash)}
								</span>
								<div className='ml-[80px] border-l-2 border-dotted border-[#cdcdcd] pl-[20px]'>
									<div className='box-content-order pt-[24px]  pb-[10px]'>
										<span className='ml-[40px] font-sfpro_bold text-[18px] text-[#444444]'>
											{formatTime(time?.dateTime, timeConfig.custom?.timeWithDetailHour)}
										</span>
										<div className='pt-[20px]'>
											<div
												className='grid grid-cols-2 rounded-[10px] py-[10px] px-[33px] '
												style={{
													boxShadow:
														'0px 0.1px 0.3px 0.1px rgba(243, 243, 245, 0.7), 0px 0px 2px 2px rgba(243, 243, 245, 0.7)',
												}}
											>
												<div className='col-span-1'>
													<span className='block text-[18px] text-[#000000]'>
														{time?.statusName}
													</span>
													{+time?.status === orderStatusType?.DELIVERY ? (
														<>
															<span className='block text-[18px] text-[#6E6E70]'>
																Tên tài xế: {time?.driverName}
															</span>
															<div className='flex items-center justify-between'>
																<span className='block text-[18px] text-[#6E6E70]'>
																	Số điện thoại:
																</span>
																<span className='block text-[18px] text-[#009ADA]'>
																	{time?.driverPhone}
																</span>
															</div>
															<span className='block text-[18px] text-[#6E6E70]'>
																Biển số xe: {time?.driverLicensePlates}
															</span>
															<span className='block text-[18px] text-[#6E6E70]'>
																Mã vận đơn: {time?.deliveryId}
															</span>{' '}
														</>
													) : null}
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						))}
					</div>

					<div className='mt-[18px] flex items-center justify-between'>
						<button className='flex w-[49%] items-center justify-center rounded-[4px] border border-[#E0E0E0] bg-[#fff] px-[10px] py-[5px] text-center'>
							Hủy đơn hàng
						</button>
						<button className='flex w-[49%] items-center justify-center rounded-[4px] border border-[#E0E0E0] bg-[#fff] px-[10px] py-[5px] text-center'>
							Liên hệ người bán
						</button>
					</div>
				</div>
			) : (
				<div>
					<LoadingSkeleton />
				</div>
			)}
		</>
	);
};

export default OrderDetail;
