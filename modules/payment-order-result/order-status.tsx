import classNames from 'classnames';
import { ImageCustom } from 'components';
import { CART_ID } from 'constants/';
import { orderStatusType, PAYMENT_STATUS } from 'enums';
import { useAppDispatch } from 'hooks';
import cookies from 'js-cookie';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import timeConfig from '@/configs/timeConfig';
import { cartActions } from '@/store/reducers/cartSlice';
import { formatTime } from '@/utils/convertTime';
interface OrderStatusProps {
	isOpen: boolean;
	timeout: number;
	info: {
		orderId: string;
		paymentStatus: PAYMENT_STATUS;
		newCartId: string;
		orderStatus: orderStatusType;
		estimatedDate: string;
		message?: string;
		isValidating?: boolean;
	};
}

const OrderStatus: React.FC<OrderStatusProps> = ({ isOpen, timeout, info }) => {
	const { newCartId, orderId, paymentStatus, orderStatus, estimatedDate } = info || {};
	const router = useRouter();
	const [counter, setCounter] = useState<number>(timeout / 1000);
	const dispatch = useAppDispatch();

	useEffect(() => {
		let timer = setInterval(() => {
			Boolean(
				((paymentStatus && orderId) || (paymentStatus && orderId && newCartId)) &&
					!info?.isValidating,
			) &&
				setCounter((counter) => {
					const updatedCounter = counter - 1;
					if (updatedCounter === 0) {
						cookies.set(CART_ID, newCartId!, {
							domain:
								process.env.NODE_ENV === 'production'
									? process.env.NEXT_PUBLIC_ENDPOINT_NAME
									: undefined,
							sameSite: 'lax',
							expires: 31536000,
							httpOnly: false,
						});
						dispatch(cartActions.reset());
						clearInterval(timer);
						router.push('/ca-nhan/don-hang/cho-xac-nhan');
					}
					return updatedCounter;
				});
		}, 1000);
		return () => clearInterval(timer);
	}, [paymentStatus, orderId, newCartId, info?.isValidating]);

	return (
		<div
			className={classNames([
				'bg-[#F1F1F1] alignCenterScreen__fixed overflow-hidden z-50 animation-300 w-full h-full ',
			])}
		>
			<div className='alignCenterScreen__fixed align-center m-auto flex h-full w-full justify-center rounded-md shadow-xl'>
				<div className='flex flex-col justify-center text-center'>
					{isOpen && !info?.isValidating ? (
						<>
							<div className='relative mx-auto h-16 w-16'>
								{paymentStatus === PAYMENT_STATUS.SUCCESS ? (
									<ImageCustom
										layout='fill'
										alt='icon order success'
										src={'/static/svg/order-success-icon.svg'}
									/>
								) : (
									<ImageCustom
										layout='fill'
										alt='icon order success'
										src={'/static/svg/cancel-order-icon.svgg'}
									/>
								)}
							</div>
							<h3 className='mt-2 mb-4 font-sfpro_bold text-18 leading-6'>
								{info?.message ?? (
									<>
										{orderStatus === orderStatusType.PENDING && 'Đặt hàng thành công'}
										{orderStatus === orderStatusType.CANCEL && 'Đơn hàng đã bị hủy'}
									</>
								)}
							</h3>
							<span>
								Chuyển tới trang cá nhân sau :{' '}
								<span className='font-sfpro_semiBold font-bold'>{counter}s</span>
							</span>
							{orderStatus !== orderStatusType.CANCEL ? (
								<div className='px-4'>
									<span className='text-14 leading-5 text-[#222B45]'>
										Dự kiến giao vào: {''}
										<span className='font-sfpro_semiBold text-16 font-semibold capitalize'>
											{formatTime(String(estimatedDate), timeConfig.custom?.fullDate)}
										</span>{' '}
									</span>
								</div>
							) : null}
						</>
					) : (
						<span>Xin vui lòng chờ trong giây lát...</span>
					)}
				</div>
			</div>
		</div>
	);
};
export default OrderStatus;
