import { ImageCustom } from 'components';
import { orderStatusType, paymentStatusTypes } from 'enums';
import { OrderModel } from 'models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';
import { formatTime } from 'utils/convertTime';

import timeConfig from '@/configs/timeConfig';

import { RenderOrderStatus } from './components';
import { handleCancelOrder } from './utils';

export interface AttributesOrderItem {
	orderItems: OrderModel | undefined;
	onMutate: any;
	isLoadingMore?: boolean;
}

const OrderListItem: React.FC<AttributesOrderItem> = ({ orderItems, onMutate, isLoadingMore }) => {
	const router = useRouter();
	return (
		<div className='py-4'>
			{(orderItems?.orders ?? [])
				?.filter((_, index) => (!isLoadingMore ? index + 1 <= 5 : orderItems?.orders?.length))
				?.map((orders, index: number) => {
					return (
						<div
							className='border-b border-[#EBEBEB] px-3 py-6 first-of-type:pt-0 last-of-type:border-none'
							key={index}
						>
							{orders?.details?.map((order, index: number) => {
								return (
									<div className='mb-4' key={index}>
										<div className='flex items-center gap-3'>
											<div className='relative h-[48px] w-full max-w-[48px] overflow-hidden rounded-full border border-[#E0E0E0]'>
												<ImageCustom src={order?.shipping?.merchantImage} layout={'fill'} />
											</div>
											<div className='flex w-fit flex-col font-sfpro_semiBold text-14 leading-5'>
												<span className='text-ellipsis line-clamp-2'>
													{order?.shipping?.merchantName}
												</span>
												<span className='font-sfpro text-[#999999]'>
													Tổng đơn:{' '}
													{Number(order?.payment?.paymentTotalWithMerchant)?.toLocaleString(
														'it-IT',
													)}
													đ
												</span>
											</div>
											{order?.payment?.paymentStatus === paymentStatusTypes.PAID &&
											order?.payment?.paymentType !== 6 ? (
												<span className='flex flex-auto items-center justify-end whitespace-nowrap text-14 text-[#009908]'>
													Đã thanh toán{' '}
													<div className='relative h-[16px] w-[16px]'>
														<ImageCustom
															src={'/static/svg/verify-order-icon.svg'}
															alt={'icon verify vuivui'}
															layout='fill'
														/>
													</div>
												</span>
											) : (
												<>
													{order?.status !== orderStatusType.CANCEL ? (
														<span className='flex flex-auto items-center justify-end whitespace-nowrap text-14 text-[#666666]'>
															Chưa thanh toán
														</span>
													) : null}
												</>
											)}
										</div>
										<div className='pl-8'>
											{/* render Images */}
											<div className='relative flex items-center pt-4'>
												{order?.shipping?.items?.map((d, i: number) => {
													return (
														i + 1 <= 2 && (
															<div
																style={{ left: i + 1 > 1 ? `-${30 * i}px` : '' }}
																className={
																	'relative h-[77px] w-[77px] overflow-hidden rounded-full border border-[#E0E0E0]'
																}
																key={i}
															>
																<ImageCustom
																	src={d.variationImage}
																	layout='fill'
																	alt={d.productName}
																	objectFit={'cover'}
																/>
																{order?.shipping?.items?.length > 2 &&
																	i + 1 === 2 &&
																	order?.shipping?.items?.length - (i + 1) !== 0 && (
																		<div className='absolute top-0 h-full w-full bg-[#0E0E10]/60 text-white'>
																			<div className='mx-auto flex h-full w-max items-center'>
																				+{order?.shipping?.items?.length - (i + 1)}
																			</div>
																		</div>
																	)}
															</div>
														)
													);
												})}
												<Link href={`/ca-nhan/don-hang/${order.subOrderId}`}>
													<span
														className='relative mt-2 block cursor-pointer font-sfpro_semiBold font-semibold text-[#126BFB]'
														style={{
															left:
																order?.shipping?.items?.length > 1
																	? `-15px`
																	: order?.shipping?.items?.length === 1
																	? '15px'
																	: '',
														}}
													>
														Xem chi tiết{' '}
														{Boolean(order?.shipping?.items?.length > 1) &&
															`${order?.shipping?.items?.length}`}
													</span>
												</Link>
											</div>

											<div className='mt-4 flex border-b border-[#E0E0E0] pb-4'>
												<div className='flex-auto'>
													<h3 className='text-ellipsis font-sfpro_bold text-16 font-bold normal-case leading-6 line-clamp-1'>
														<span className='text-FF7A00'>
															{
																<RenderOrderStatus
																	status={order?.status}
																	statusName={order?.statusName}
																/>
															}
														</span>{' '}
														từ{' '}
														<span className='text-[#333333]'>
															{order?.status !== orderStatusType.CANCEL
																? order?.merchant?.name
																: order?.cancelled?.cancelledBy ?? 'Người dùng'}
														</span>
													</h3>
													<span className='text-14 leading-5 text-[#666666]'>
														Dự kiến giao vào {''}
														<span className='capitalize'>
															{formatTime(
																order?.shipping?.estimatedDate,
																timeConfig.custom?.fullDate,
															)}
														</span>{' '}
													</span>
												</div>
												{order?.status === orderStatusType.CANCEL ? (
													<div className='flex w-full max-w-[30%] flex-[0_0_30%] items-center justify-end'>
														<span>
															<button className='rounded-6px border border-[#126BFB]/10 bg-[#126BFB] py-1.5 px-2.5 text-white outline-none'>
																Mua lại
															</button>
														</span>
													</div>
												) : (
													<span className='max-w-[30%] flex-[0_0_30%]'>
														<button
															className='w-full rounded-6px border border-black/10 py-1.5 px-2.5 text-[#333333] outline-none transition-all duration-300 line-clamp-1 hover:border-red-500/90 hover:text-red-500/90'
															onClick={() =>
																handleCancelOrder(
																	order?.orderId,
																	order?.shipping?.orderSubId,
																	onMutate,
																	() => router.push('/ca-nhan/don-hang'),
																)
															}
														>
															Hủy đơn
														</button>
													</span>
												)}
											</div>
										</div>

										<div className='relative mt-3 pl-8'>
											<div className='overflow-hidden rounded-full bg-[#F6F6F6] text-[#999999]'>
												<input
													type='text'
													className='w-9/12 bg-[#F6F6F6] py-2.5 px-3 text-black text-opacity-60 outline-none'
													placeholder='Chat với shop ngay'
												/>
												<div className='absolute top-2/4 right-0 flex h-full translate-x-0 -translate-y-2/4 pr-4'>
													<div className='relative mr-2 cursor-pointer flex items-center'>
														<ImageCustom
															src='/static/svg/icon-picture-dark.svg'
															alt='icon-smile'
															layout='fill'
														/>
													</div>
													<div className='relative  mr-2 cursor-pointer flex items-center'>
														<ImageCustom
															src='/static/svg/icon-smile-dark.svg'
															alt='iconPicture'
															layout='fill'
														/>
													</div>
													<div className='relative cursor-pointer flex items-center'>
														<ImageCustom
															src='/static/svg/icon-send-message-dark.svg'
															alt='iconMessage'
															layout='fill'
														/>
													</div>
												</div>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					);
				})}
		</div>
	);
};

export default OrderListItem;
