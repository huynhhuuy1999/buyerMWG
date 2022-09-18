import classNames from 'classnames';
import { ImageCustom } from 'components';
import { PAYMENT_STATUS } from 'enums';
import { useAppCart, useAppSelector, usePayment, useRetryPayment } from 'hooks';
import { OrderDetails } from 'models';
import { CancelOrder, OrderStatus } from 'modules';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { setPaymentMethodHelpers } from 'utils/setPaymentMethodHelpers';

import Portal from '@/HOCs/portal';
import { ChoosePayment } from '@/modules/cart/components';
import { listCancelOrderSelector } from '@/store/reducers/customerSlice';

interface ShowModalCancelProps {
	isActiveRetryPayment: boolean;
	isActiveCancelOrder: boolean;
	stateOrder: OrderDetails | null;
}

const Payment = () => {
	const router = useRouter();
	const { cartId } = useAppCart();
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isShowModalCancelOrder, setIsShowModalCancelOrder] = useState<ShowModalCancelProps>({
		isActiveRetryPayment: false,
		isActiveCancelOrder: false,
		stateOrder: null,
	});

	const listCancelOrder = useAppSelector(listCancelOrderSelector);
	const {
		isShowBlock,
		newCartIdForCOD,
		newCartIdPaymentOnline,
		orderIdThisOrder,
		orderResult,
		paymentStatusMess,
		onMutate,
		isValidating,
		paymentStatus,
		setIsShowBlock,
	} = usePayment();

	const { onSubmit, methods, paymentMethod, counter, isShowPopupPayment } = useRetryPayment({
		blockingState: isShowBlock,
		newCartId: newCartIdPaymentOnline ?? newCartIdForCOD,
		paymentStatus,
		setBlocking: setIsShowBlock,
	});

	return (
		<>
			{newCartIdForCOD ? (
				<Portal>
					<OrderStatus
						timeout={5000}
						isOpen={true}
						info={{
							estimatedDate: orderResult?.details?.[0]?.shipping?.estimatedDate!,
							newCartId: newCartIdPaymentOnline ?? newCartIdForCOD,
							orderId: orderIdThisOrder,
							orderStatus: orderResult?.details?.[0]?.status!,
							paymentStatus,
							isValidating,
						}}
					/>
				</Portal>
			) : (
				<>
					{isShowBlock.isActive && Boolean(paymentStatus === PAYMENT_STATUS.FAILURE) ? (
						<FormProvider {...methods}>
							<div className='alignCenterScreen__fixed scrollbar-global overflow-hidden bg-[#F1F1F1] w-full h-full'>
								<div className='relative flex-col shadow-lg alignCenterScreen__absolute flex gap-6 justify-center border p-4 bg-white border-[#EBEBEB] max-w-[70%] rounded-lg'>
									<div className='bg-[#FFF5F9] py-4 text-center text-14 leading-5 text-[#333333] rounded-lg'>
										Sau <span className='font-sfpro_semiBold'>{counter} giây</span> nếu chị Ngân
										không thanh toán lại VuiVui xin phép giao hàng bằng hình thức trả tiền mặt
									</div>
									<div className='flex gap-6 items-center'>
										<div className='max-w-[50%] flex-[50%]'>
											<div className='relative mx-auto mb-8 h-28 w-28'>
												<ImageCustom
													src='/static/svg/failed-payment-icon.svg'
													alt='order vuivui'
													layout='fill'
												/>
											</div>
											<div className='mx-auto flex w-full flex-col text-center'>
												<span className='mb-3 block font-sfpro_bold text-18 leading-6'>
													Thanh toán qua {isShowBlock.paramsPayment?.[0]?.namePayment} thất bại!
												</span>
												<span className='mb-1.5 block text-14 leading-6 text-[#666666]'>
													Vui lòng kiểm tra kết nối hoặc thử lại
												</span>
												<div className='flex flex-col text-14 mt-6 leading-6 text-[#666666]'>
													<Link href={`/ca-nhan/don-hang/${orderResult?.orderId}`}>
														<div className='cursor-pointer hover:text-pink-F05A94'>
															Xem chi tiết đơn hàng
														</div>
													</Link>
													<Link href={`/`}>
														<div className='cursor-pointer hover:text-pink-F05A94'>
															Trở về trang chủ
														</div>
													</Link>
												</div>
												<div
													className={classNames([
														'w-full h-auto flex gap-2 items-center',
														isLoading ? 'cursor-not-allowed' : '',
													])}
												>
													<button
														className={classNames([
															'px-auto mx-auto mt-4 w-[60%] rounded-full border border-pink-F05A94 hover:bg-opacity-90 animation-200 py-2 font-sfpro_semiBold text-14 text-white bg-pink-F05A94 shadow-md',
															isLoading ? 'pointer-events-none opacity-80' : '',
														])}
														onClick={methods.handleSubmit(onSubmit)}
													>
														Thử thanh toán lại
													</button>
													<button
														className={classNames([
															'px-auto mx-auto mt-4 w-[60%] rounded-full border border-[#EDF1F7] py-2 font-sfpro_semiBold text-14 text-[#333333] shadow-md',
														])}
														onClick={() =>
															setIsShowModalCancelOrder((prev) => ({
																...prev,
																isActiveCancelOrder: true,
																stateOrder: orderResult?.details?.[0]!,
															}))
														}
													>
														Hủy đơn hàng
													</button>
												</div>
											</div>
										</div>

										<div className='mb-6 space-y-[10px]'>
											<h3 className='mt-6 mb-[10px] font-sfpro_bold text-16 font-semibold leading-6'>
												Chọn hình thức thanh toán khác
											</h3>
											<ChoosePayment
												disabled={
													paymentMethod?.find(
														(t: any) =>
															t?.maxAmount <= Number(isShowBlock.paramsPayment?.[0]?.amount),
													)?.id
												}
												defaultValue={
													paymentMethod?.find((k) => isShowBlock.paramsPayment?.[0]?.id === k.id)
														?.id
												}
												loading={isLoading}
												onClick={(typePaymentMethod) =>
													typePaymentMethod &&
													setPaymentMethodHelpers(
														cartId ?? '',
														{ paymentType: typePaymentMethod },
														setIsLoading,
													)
												}
											/>
										</div>
									</div>
								</div>
							</div>

							<CancelOrder
								isOpen={isShowModalCancelOrder?.isActiveCancelOrder}
								onCancel={() =>
									setIsShowModalCancelOrder((prev) => ({
										...prev,
										isActiveCancelOrder: false,
										stateOrder: null,
									}))
								}
								onMutate={onMutate}
								optionReasons={listCancelOrder}
								stateOrder={isShowModalCancelOrder?.stateOrder}
							/>
						</FormProvider>
					) : (
						<Portal>
							<OrderStatus
								timeout={5000}
								isOpen={isShowPopupPayment}
								info={{
									estimatedDate: orderResult?.details?.[0]?.shipping?.estimatedDate!,
									newCartId: newCartIdPaymentOnline ?? newCartIdForCOD,
									orderId: isShowBlock?.paramsPayment?.[0]?.orderId ?? router?.query?.orderPayment,
									orderStatus: orderResult?.details?.[0]?.status!,
									paymentStatus,
									message: paymentStatusMess,
									isValidating,
								}}
							/>
						</Portal>
					)}
				</>
			)}
		</>
	);
};

export default Payment;
