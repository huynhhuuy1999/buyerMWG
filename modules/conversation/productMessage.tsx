import React from 'react';

const ProductMessage: React.FC = () => {
	return (
		<div className='grid grid-cols-12'>
			<div className='col-span-11 col-start-2'>
				<div className='bg-F5F5F5 p-4'>
					<div className='border-b border-666666 pb-3 text-14 font-normal uppercase not-italic leading-normal tracking-0.0025em'>
						Sản phẩm yêu cầu đổi/trả (ngày 12-10-2021)
					</div>
					<div className='border-b border-666666'>
						<div>
							<div className='flex justify-between border-b border-D8D8D8 py-4 last:border-b-0'>
								<img
									className='h-12 w-12 lg:h-24 lg:w-24'
									src='https://testcdn.vuivui.com/merchant/2022/1/21/7c512d60-e1ed-4c80-88c5-f26f1cda55a3/-72jaIz 34.png'
									alt='Product 1'
								/>
								<div className='grow pl-0 lg:pl-14'>
									<div className='flex flex-col'>
										<span className='text-14 font-normal not-italic leading-normal tracking-0.0025em text-3E3E40'>
											Bàn chảy điện Oral-B
										</span>
										<span className='text-12 font-normal not-italic leading-1.3 tracking-0.0025em text-6E6E70'>
											Đầu Precision
										</span>
										<span className='text-14 font-semibold not-italic leading-normal tracking-0.0025em text-272728'>
											100.000<sup>đ</sup>
										</span>
									</div>
								</div>
								<span className='text-14 font-semibold not-italic leading-normal tracking-0.0025em text-472F92'>
									Số lượng đổi trả x1
								</span>
							</div>
							<div className='flex justify-between border-b border-D8D8D8 py-4 last:border-b-0'>
								<img
									className='h-12 w-12 lg:h-24 lg:w-24'
									src='https://testcdn.vuivui.com/merchant/2022/1/21/301deeea-aec2-4fb0-b135-1d80d995df12/-72jaIz 36.png'
									alt='Product 2'
								/>
								<div className='grow pl-0 lg:pl-14'>
									<div className='flex flex-col'>
										<span className='text-14 font-normal not-italic leading-normal tracking-0.0025em text-3E3E40'>
											Đầu thay bàn chảy điện Oral-B
										</span>
										<span className='text-12 font-normal not-italic leading-1.3 tracking-0.0025em text-6E6E70'>
											Đầu Precision
										</span>
										<span className='text-14 font-semibold not-italic leading-normal tracking-0.0025em text-272728'>
											50.000<sup>đ</sup>
										</span>
									</div>
								</div>
								<span className='text-14 font-semibold not-italic leading-normal tracking-0.0025em text-472F92'>
									Số lượng đổi trả x2
								</span>
							</div>
						</div>
						<div className='mb-4 text-12 font-medium not-italic leading-tight text-link'>
							Xem thêm 2 sản phẩm Đổi/Trả khác
						</div>
					</div>
					<div className='grid grid-cols-12 gap-3 lg:gap-5'>
						<div className='col-span-5 my-1 lg:my-2'>
							<span className='text-12 font-semibold not-italic leading-1.3 text-272728'>
								Lý do:{' '}
							</span>
							<span>Không vừa ý vì sản phẩm không giống mô tả</span>
						</div>
						<div className='col-span-7'>
							<div className='flex flex-wrap'>
								<img
									className='m-1 h-10 w-10 lg:m-2 lg:h-20 lg:w-20'
									src='https://testcdn.vuivui.com/merchant/2022/1/21/88da11a0-0e09-4c8a-a715-ee84e6c771ad/Rectangle 142805.png'
									alt='Product review'
								/>
								<img
									className='m-1 h-10 w-10 lg:m-2 lg:h-20 lg:w-20'
									src='https://testcdn.vuivui.com/merchant/2022/1/21/88da11a0-0e09-4c8a-a715-ee84e6c771ad/Rectangle 142805.png'
									alt='Product review'
								/>
								<img
									className='m-1 h-10 w-10 lg:m-2 lg:h-20 lg:w-20'
									src='https://testcdn.vuivui.com/merchant/2022/1/21/88da11a0-0e09-4c8a-a715-ee84e6c771ad/Rectangle 142805.png'
									alt='Product review'
								/>
							</div>
						</div>
					</div>
				</div>
				<div className='m-3'>
					Phí giao nhận phát sinh
					<span className='ml-1 text-18 font-semibold not-italic leading-normal text-EA001B'>
						18.000<sup>đ</sup>
					</span>
				</div>
			</div>
		</div>
	);
};

export default ProductMessage;
