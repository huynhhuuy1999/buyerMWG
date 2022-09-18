import { EmptyProduct, ImageCustom } from 'components';
import { orderStatusType, paymentStatusTypes } from 'enums';
import { useAppDispatch } from 'hooks';
import isArray from 'lodash/isArray';
import { ArrRoutesProps, OrderDetails, OrderModel, PaymentMethod } from 'models';
import { CancelOrder } from 'modules';
import Link from 'next/link';
import React, { useState } from 'react';
import { formatTime } from 'utils/convertTime';

import timeConfig from '@/configs/timeConfig';
import { CancelOrderReason } from '@/models/customer';
import { customerAction } from '@/store/reducers/customerSlice';

import ChatOrders from '../conversation/chatOrders';
import RetryPayment from './common/RetryPayement';
import { RenderOrderStatus } from './components';

interface AttributesOrderItem {
	orderItems?: OrderModel['orders'];
	onMutate: any;
	listCancelOrder?: CancelOrderReason[];
	dataPaymentMethods?: PaymentMethod[];
	tabStatusActive?: ArrRoutesProps | null;
	isLoadingMore?: boolean;
}

interface ShowModalProps {
	isActiveRetryPayment: boolean;
	isActiveCancelOrder: boolean;
	stateOrder: OrderDetails | null;
}

const OrderListItem: React.FC<AttributesOrderItem> = ({
	orderItems,
	onMutate,
	listCancelOrder,
	isLoadingMore,
	dataPaymentMethods,
	tabStatusActive,
}) => {
	const [isShowModal, setIsShowModal] = useState<ShowModalProps>({
		isActiveRetryPayment: false,
		isActiveCancelOrder: false,
		stateOrder: null,
	});
	const dispatch = useAppDispatch();

	return (
		<React.Fragment>
			{(orderItems ?? [])?.length > 0 ? (
				orderItems?.map((orders, i: number) => {
					return (
						<div
							className='shadow-shadow-profileCard mb-4 rounded-6px bg-white p-6 last-of-type:mb-0'
							key={i}
						>
							<div className='flex items-center justify-between border-b border-dashed border-[#D8D8D8] pb-4'>
								<div className='flex items-center'>
									<span className='block text-14 leading-5 text-[#666666]'>
										Mã đơn hàng: #{orders?.orderId}{' '}
									</span>
								</div>
								<span className='block text-14 leading-5 text-[#666666]'>
									Ngày đặt hàng:{' '}
									<span className='capitalize'>
										{formatTime(orders?.createdAt, timeConfig.custom?.dayMothYearh)}
									</span>
								</span>
							</div>
							{orders?.details
								?.filter((ele) =>
									isArray(tabStatusActive?.OrderStatuses)
										? tabStatusActive?.OrderStatuses?.includes(ele?.status)
										: ele?.status === tabStatusActive?.OrderStatuses,
								)
								?.map((order, index: number) => {
									return (
										<div key={index}>
											<div className='flex py-4'>
												<div className='flex pr-4'>
													{order?.shipping?.items?.map((d, i: number) => {
														return (
															i + 1 <= 2 && (
																<div className='relative mr-2 block w-[90px] h-[90px]' key={i}>
																	<ImageCustom
																		src={d?.variationImage}
																		layout='fixed'
																		width={90}
																		className={'object-cover'}
																		height={90}
																	/>
																	{order?.shipping?.items?.length > 2 && i + 1 === 2 && (
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
													<div className='flex flex-col whitespace-nowrap'>
														<span className='font-sfpro_bold text-16 font-bold uppercase leading-6'>
															{Number(order?.payment?.paymentTotalWithMerchant).toLocaleString(
																'it-IT',
															)}{' '}
															<sup className='lowercase'>đ</sup>
														</span>
														{order?.payment?.paymentStatus === paymentStatusTypes.PAID ? (
															<div className='flex items-center'>
																<span className='text-14 leading-5 text-[#009908]'>
																	Đã thanh toán
																</span>
																<div className='relative h-[16px] w-[16px]'>
																	<ImageCustom
																		layout='fill'
																		src={'/static/svg/verify-order-icon.svg'}
																	/>
																</div>
															</div>
														) : (
															<div className='flex items-center'>
																<span className='text-14 leading-5 text-[#666666]'>
																	Chưa thanh toán
																</span>
															</div>
														)}

														<Link href={`/ca-nhan/don-hang/${order.subOrderId}`}>
															<span className='mt-2 block cursor-pointer font-sfpro_semiBold font-semibold text-[#126BFB]'>
																Xem chi tiết{' '}
																{Boolean(order?.shipping?.items?.length > 1) &&
																	`(${order?.shipping?.items?.length})`}
															</span>
														</Link>
													</div>
												</div>
												<div className='flex-auto pr-2'>
													<div className='flex items-center gap-[6px] font-sfpro_bold text-16 font-bold uppercase leading-6'>
														<span className='whitespace-nowrap text-FF7A00'>
															{
																<RenderOrderStatus
																	status={order?.status}
																	statusName={order?.statusName}
																/>
															}
														</span>{' '}
														từ{' '}
														<div className='group relative'>
															<span className='overflow-hidden line-clamp-1 break-all'>
																<span className='cursor-pointer text-ellipsis text-[#333333]'>
																	{order?.status !== orderStatusType.CANCEL
																		? order?.merchant?.name
																		: order?.cancelled?.cancelledBy ?? 'Người dùng'}
																</span>
															</span>
															<div className='animation-200 invisible absolute rounded-md bg-black/80 p-1 text-12 normal-case text-white opacity-0 group-hover:visible group-hover:opacity-100'>
																<span>
																	{order?.status !== orderStatusType.CANCEL
																		? order?.merchant?.name
																		: order?.cancelled?.cancelledBy ?? 'Người dùng'}
																</span>
															</div>
														</div>
														<ImageCustom
															className='object-cover h-[40px] max-w-[40px] w-full overflow-hidden rounded-full'
															src={order?.merchant?.avatarImage}
															width={'100%'}
															height={40}
														/>
													</div>
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
												<div className='flex-auto flex justify-end'>
													{order?.status === orderStatusType.CANCEL ? (
														<span>
															<button className='rounded-6px border border-F05A94/10 bg-F05A94 py-1.5 px-2.5 text-white outline-none'>
																Mua lại
															</button>
														</span>
													) : (
														<div className='flex flex-col gap-3 whitespace-nowrap'>
															{order?.payment?.paymentStatus === paymentStatusTypes.PAID ||
															[
																orderStatusType.WAITING_FOR_THE_GOODS,
																orderStatusType.START_PICKING_UP_GOODS,
																orderStatusType.COMPLETE_PICK_UP,
																orderStatusType.PRINTED_NOTE,
																orderStatusType.READY_TO_DELIVER,
																orderStatusType.COMPLETE,
																orderStatusType.DELIVERED,
															]?.some((s) => s === order?.status) ? null : (
																<span
																	onClick={() => {
																		dispatch(customerAction.setRetryPayment(true));
																		setIsShowModal((prev) => ({
																			...prev,
																			isActiveRetryPayment: true,
																			stateOrder: order,
																		}));
																	}}
																	tabIndex={0}
																	role={'button'}
																	onKeyPress={() => {
																		dispatch(customerAction.setRetryPayment(true));
																		setIsShowModal((prev) => ({
																			...prev,
																			isActiveRetryPayment: true,
																			stateOrder: order,
																		}));
																	}}
																>
																	<button className='w-full rounded-6px border border-F05A94/10 bg-pink-F05A94 py-1.5 px-2.5 text-white outline-none'>
																		Đổi hình thức thanh toán
																	</button>
																</span>
															)}

															{[
																orderStatusType.WAITING_FOR_THE_GOODS,
																orderStatusType.START_PICKING_UP_GOODS,
																orderStatusType.COMPLETE_PICK_UP,
																orderStatusType.PRINTED_NOTE,
																orderStatusType.READY_TO_DELIVER,
																orderStatusType.COMPLETE,
																orderStatusType.DELIVERED,
															]?.some((s) => s === order?.status) ? null : (
																<span
																	className='flex justify-end'
																	onClick={() =>
																		setIsShowModal((prev) => ({
																			...prev,
																			isActiveCancelOrder: true,
																			stateOrder: order,
																		}))
																	}
																	tabIndex={0}
																	role={'button'}
																	onKeyPress={() => {}}
																>
																	<button className='w-full rounded-6px border border-black/10 py-1.5 px-2.5 text-[#333333] outline-none transition-all duration-300 hover:border-red-500/90 hover:text-red-500/90'>
																		Hủy đơn
																	</button>
																</span>
															)}
														</div>
													)}
												</div>
											</div>
										</div>
									);
								})}
							<span className='block pb-4 text-14 leading-5 text-[#666666]'>
								Được Đổi/ Trả nếu <span className='font-sfpro_semiBold'>không vừa ý</span> trong X
								ngày tới (người mua chịu phí chuyển hàng Đổi/Trả).{' '}
								<span className='font-sfpro_semiBold'>Xem chi tiết</span>
							</span>

							<div className='border-t border-dashed border-[#D8D8D8] pt-4'>
								<ChatOrders merchant={orders.details[0].merchant} />
							</div>

							<RetryPayment
								isOpen={Boolean(isShowModal?.isActiveRetryPayment && dataPaymentMethods?.length)}
								onCancel={() =>
									setIsShowModal((prev) => ({
										...prev,
										isActiveRetryPayment: false,
										stateOrder: null,
									}))
								}
								defaultValue={isShowModal?.stateOrder?.payment?.paymentType}
								StateOrder={isShowModal?.stateOrder}
								paymentMethod={dataPaymentMethods}
							/>

							<CancelOrder
								isOpen={isShowModal?.isActiveCancelOrder}
								onCancel={() =>
									setIsShowModal((prev) => ({
										...prev,
										isActiveCancelOrder: false,
										stateOrder: null,
									}))
								}
								optionReasons={listCancelOrder}
								onMutate={onMutate}
								stateOrder={isShowModal?.stateOrder}
							/>
						</div>
					);
				})
			) : (
				<EmptyProduct title='Bạn không có hóa đơn nào cả, mua sắm ngay nhé !' height={'!h-full'} />
			)}
		</React.Fragment>
	);
};

export default OrderListItem;
