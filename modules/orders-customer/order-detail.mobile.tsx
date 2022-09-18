import { OrderDetailsModel } from 'models';
import moment from 'moment';
import { convertDateToString, numberWithCommas } from 'utils/formatter';

interface IOrderDetailMobile {
	detail: OrderDetailsModel;
}

const OrderDetailMobile: React.FC<IOrderDetailMobile> = ({ detail }) => {
	return (
		<div className='wrapper-order-mobile'>
			<div className='mx-4 mb-6'>
				<div className='grid grid-cols-4 gap-4 items-center'>
					<div className='col-span-3 mr-1'>
						<div className='relative'>
							<input
								className='px-4 py-3 border w-full rounded-md'
								placeholder='Tìm sản phẩm, đơn hàng'
							/>
							<img
								width={20}
								height={20}
								src={'/static/images/icon-sheets/icon-search.svg'}
								alt='icon'
								className='absolute top-4 right-2'
							/>
						</div>
					</div>
					<div className='border w-full h-full flex items-center justify-center rounded-md'>
						<img src={'/static/images/icon-sheets/filter-icon.svg'} alt='icon' className='mr-1' />
						<span>Bộ lọc</span>
					</div>
				</div>
			</div>

			{detail?.details?.map((value, index) => {
				if (index === 0) {
					return (
						<div>
							<div className='bg-slate-100 px-4 py-2.5'>
								<div className='grid grid-cols-2 gap-2 items-center'>
									<div>
										<p className='mb-0 text-sm text-slate-500'>#{value?.orderId}</p>
										<p className='mb-0 text-slate-500 text-13'>
											Đặt ngày {moment(value?.createdAt).format('Do MMMM YYYY, HH:MM:ss')}
										</p>
									</div>
									<div>
										<p className='mb-0 block-text-green font-medium'>
											{value?.payment?.paymentStatusName || 'Chờ thanh toán'}
										</p>
										<p className='mb-0 text-13 text-slate-500'>
											Tổng tiền: {numberWithCommas(value?.payment?.paymentTotalWithMerchant, '.')} đ
										</p>
									</div>
								</div>
							</div>
							<div className='mx-4' key={index}>
								<div className='top-title mb-5 mt-4'>
									<p className='font-semibold'>
										Dự kiến giao {convertDateToString(value?.shipping?.estimatedDate)}
									</p>
									<p className='text-13 text-slate-400'>Chờ xác nhận từ {value?.merchant?.name}</p>
								</div>
								{value?.shipping?.items.map((item, key) => {
									return (
										<div className='block-item mb-3' key={key}>
											<div className='gird-cols-custom'>
												<div className='max-w-img'>
													<img className='w-full h-full' src={item?.variationImage} alt='item' />
												</div>
												<div className='col-span-custom'>
													<p className='block-title text-sm font-semibold mb-0.5'>
														{item?.productName}
													</p>
													<p className='block-title text-sm font-semibold mb-0.5'>
														{numberWithCommas(item?.productPrice, '.')} đ
													</p>
													{/* <p className='block-description text-ellipsis overflow-hidden whitespace-nowrap mb-0.5'>
														Bộ 4 món chăn ga gối cotton Tici cao cấp...
													</p> */}
													<p className='block-merchant-shipping mb-0.5'>
														Vận hành bởi: {value?.merchant?.name}
													</p>
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					);
				} else {
					return (
						<div className='px-4 pb-4 border-b border-solid border-gray-300' key={index}>
							<div className='top-title mb-5 mt-4'>
								<p className='font-normal block-text-green'>
									Dự kiến giao {convertDateToString(value?.shipping?.estimatedDate)}
								</p>
								<p className='text-13 text-slate-400'>Chờ xác nhận từ {value?.merchant?.name}</p>
							</div>
							{value?.shipping?.items.map((item, key) => {
								return (
									<div className='block-item mb-3' key={key}>
										<div className='gird-cols-custom'>
											<div className='max-w-img'>
												<img className='w-full h-full' src={item?.variationImage} alt='item' />
											</div>
											<div className='col-span-custom'>
												<p className='block-title text-sm font-semibold mb-0.5'>
													{item?.productName}
												</p>
												<p className='block-title text-sm font-semibold mb-0.5'>
													{numberWithCommas(item?.productPrice, '.')} đ
												</p>
												{/* <p className='block-description text-ellipsis overflow-hidden whitespace-nowrap mb-0.5'>
													Bộ 4 món chăn ga gối cotton Tici cao cấp...
												</p> */}
												<p className='block-merchant-shipping mb-0.5'>
													Vận hành bởi: {value?.merchant?.name}
												</p>
											</div>
										</div>
									</div>
								);
							})}
						</div>
					);
				}
			})}
		</div>
	);
};

export default OrderDetailMobile;
