import classNames from 'classnames';
import { ImageCustom } from 'components';
import { orderStatusType, PAYMENT_STATUS, paymentStatusTypes } from 'enums';
import { OrderDetailsModel } from 'models';
import { useRouter } from 'next/router';

import timeConfig from '@/configs/timeConfig';
import { formatTime } from '@/utils/convertTime';

interface OrderStatus {
	dataOrderDetail?: OrderDetailsModel | null;
	paymentStatus: string;
	paymentType?: number;
	onCancel: () => void;
}

const OrderStatusMobile: React.FC<OrderStatus> = ({
	dataOrderDetail,
	paymentStatus,
	paymentType,
	onCancel,
}) => {
	const router = useRouter();

	return (
		<div className='h-fit'>
			<div className='flex items-center bg-pink-F05A94 px-3 py-4 '>
				<div className='relative mr-15px h-5 w-5'>
					<ImageCustom
						className='cursor-pointer '
						src='/static/svg/arrow-back-white.svg'
						alt='search'
						layout='fill'
					/>
				</div>

				<div className='font-sfpro text-base font-semibold text-white'>Trở về trang chủ</div>
			</div>
			<div className='bg-[#F6F6F6] px-3 py-2 text-[#999999]'>
				<div className='flex items-center justify-between'>
					<span>Mã đơn hàng</span>
					<span>{dataOrderDetail?.orderId}</span>
				</div>
			</div>
			<div className='flex flex-col p-6 text-center'>
				<div className='relative mx-auto mb-4 h-[78px] w-[78px]'>
					{paymentStatus === PAYMENT_STATUS.SUCCESS &&
						dataOrderDetail?.details?.[0]?.status !== orderStatusType.CANCEL && (
							<ImageCustom
								layout='fill'
								alt='icon order success'
								src={'/static/svg/order-success-icon.svg'}
							/>
						)}
					{paymentStatus === PAYMENT_STATUS.FAILURE && (
						<ImageCustom
							layout='fill'
							alt='icon order success'
							src={'/static/svg/failied-payment-icon.svg'}
						/>
					)}
					{dataOrderDetail?.details?.[0]?.status === orderStatusType.CANCEL && (
						<ImageCustom
							layout='fill'
							alt='icon order success'
							src={'/static/svg/cancel-order-icon.svg'}
						/>
					)}
				</div>
				<span className='font-sfpro_semiBold text-18 font-bold uppercase leading-5'>
					{dataOrderDetail?.details?.[0]?.status === orderStatusType.PENDING &&
						' Đặt hàng thành công'}
					{dataOrderDetail?.details?.[0]?.status === orderStatusType.CANCEL &&
						' Đơn hàng đã bị hủy'}
				</span>

				{paymentStatus === PAYMENT_STATUS.SUCCESS &&
				dataOrderDetail?.details?.[0]?.status !== orderStatusType.CANCEL ? (
					<span className='text-[#666666]'>
						{paymentStatus === PAYMENT_STATUS.SUCCESS && paymentType !== 6 //check has COD (6)
							? `Tổng tiền: ${dataOrderDetail?.payment?.paymentTotal.toLocaleString('it-IT')}đ`
							: `Trả tiền mặt khi nhận hàng:  ${dataOrderDetail?.payment?.paymentTotal.toLocaleString(
									'it-IT',
							  )}đ`}
						<div
							className={classNames([
								paymentStatus === PAYMENT_STATUS.SUCCESS && paymentType !== 6 ? 'mt-7' : 'mt-4',
							])}
						>
							{dataOrderDetail?.details?.[0]?.payment?.paymentStatus === paymentStatusTypes.PAID &&
							paymentType !== 6 ? (
								<span className='flex items-center justify-center text-16 text-[#009908]'>
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
								<button className='rounded-md bg-pink-F05A94 py-3 px-6 text-center font-sfpro_semiBold text-16 font-semibold text-white'>
									Thanh toán trước
								</button>
							)}
						</div>
					</span>
				) : (
					<span className='mt-1 block text-[#666666]'>
						Lý do: Người nhận đã từ chối nhận tất cả đơn hàng từ người đặt
					</span>
				)}
			</div>

			<div
				className={classNames([
					'border-y-8 border-[#F6F6F6] ',
					dataOrderDetail?.details?.[0]?.status !== orderStatusType.CANCEL ? 'py-4' : 'py-0',
				])}
			>
				{dataOrderDetail?.details?.[0]?.status !== orderStatusType.CANCEL ? (
					<div className='px-4'>
						<span className='text-14 leading-5 text-[#222B45]'>
							Dự kiến giao vào: {''}
							<span className='font-sfpro_semiBold text-16 font-semibold capitalize'>
								{formatTime(
									String(dataOrderDetail?.details?.[0]?.shipping?.estimatedDate),
									timeConfig.custom?.fullDate,
								)}
							</span>{' '}
						</span>
					</div>
				) : null}
			</div>

			<div className='border-b-8 border-[#F6F6F6] py-4'>
				<div className='px-4'>
					{dataOrderDetail?.merchants?.map((merchant, i: number) => {
						return (
							<div
								className='flex items-center gap-5 border-b border-[#EBEBEB] py-3 first-of-type:border-b-0'
								key={i}
								onClick={() => router.push('/ca-nhan/don-hang/cho-xac-nhan')}
								onKeyPress={() => router.push('/ca-nhan/don-hang/cho-xac-nhan')}
								tabIndex={0}
								role={'button'}
							>
								<div className='relative h-[40px] w-full max-w-[40px] overflow-hidden rounded-full'>
									<ImageCustom src={merchant?.avatarImage} layout={'fill'} alt={'merchant image'} />
								</div>
								<div className='flex-auto flex-col'>
									<div className='text-ellipsis font-sfpro_semiBold text-16 font-semibold leading-5 text-[#333333] line-clamp-2'>
										{merchant?.name}
									</div>
									<span>
										Tổng tiền{' '}
										{Number(
											dataOrderDetail?.details?.find((e) => e.merchantId === +merchant.merchantId)
												?.payment?.paymentTotalWithMerchant,
										)?.toLocaleString('it-IT')}
										<sup>đ</sup>
									</span>
								</div>
								<div className='text-center'>
									<div className='relative h-[25px] w-[25px]'>
										<ImageCustom
											src={'/static/svg/chevron-down.svg'}
											layout={'fill'}
											alt={'icon vuivuis'}
										/>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>

			<div className='border-b-8 border-[#F6F6F6] py-4'>
				<div className='px-4'>
					<div className='flex items-center justify-between pb-4 font-sfpro_semiBold text-16'>
						<span className='text-[#666666]'>Tổng đơn hàng</span>
						<span className='font-semibold text-[#333333]'>
							{dataOrderDetail?.payment?.paymentTotal.toLocaleString('it-IT')}
							<sup>đ</sup>
						</span>
					</div>
					<div className='flex items-center justify-between border-b border-b-[#EBEBEB] pb-4 font-sfpro_semiBold text-16'>
						<span className='text-[#666666]'>Thanh toán</span>
						<span className='font-sfpro text-[#333333]'>
							{dataOrderDetail?.details?.[0]?.payment?.paymentName}
						</span>
					</div>
				</div>
				<button
					className='w-full pt-4 text-center font-sfpro_semiBold text-16 font-semibold leading-5 text-[#126BFB]'
					onClick={() => router.push('/ca-nhan/don-hang/cho-xac-nhan')}
				>
					Xem danh sách đơn hàng
				</button>
			</div>

			{dataOrderDetail?.details?.[0]?.status !== orderStatusType.CANCEL && (
				<>
					<div className='bg-[#F6F6F6] p-4'>
						<button
							className='mb-7 w-full flex-auto rounded-md bg-[#DADDE1] py-[12px] text-center font-sfpro_semiBold font-semibold text-[#333333]'
							onClick={onCancel}
						>
							Hủy đơn hàng
						</button>
						<div className='shadow-[0px_0.1px_0.3px_rgba(0, 0, 0.1)] rounded-md bg-white p-6 text-center'>
							<div className='mb-7 rounded-md font-sfpro_semiBold text-16 font-semibold leading-5'>
								Trải nghiệm của chị Ngân khi mua đơn hàng trên VuiVui như thế nào
							</div>
							<div className='flex items-center justify-between'>
								<div className='flex items-center'>
									<div className='overflow-hidden rounded-full bg-[#F6F6F6] p-3'>
										<div className='relative h-[24px] w-[24px]'>
											<ImageCustom
												layout='fill'
												src={'/static/svg/happy-filled-icon.svg'}
												alt={'icon happy filled'}
											/>
										</div>
									</div>
									<span className='text-[#333333 font-sfpro_semiBold]'>Hài lòng</span>
								</div>
								<div className='flex items-center'>
									<div className='overflow-hidden rounded-full bg-[#F6F6F6] p-3'>
										<div className='relative h-[24px] w-[24px]'>
											<ImageCustom
												layout='fill'
												src={'/static/svg/angry-filled-icon.svg'}
												alt={'icon happy filled'}
											/>
										</div>
									</div>
									<span className='text-[#333333 font-sfpro_semiBold]'>Không Hài lòng</span>
								</div>
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
};
export default OrderStatusMobile;
