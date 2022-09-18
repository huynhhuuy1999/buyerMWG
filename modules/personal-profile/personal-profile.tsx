import classNames from 'classnames';
import { ImageCustom } from 'components';
import { PersonalProfile } from 'models';

import ProductCard from '@/components/Card/ProductCard';

interface IrenderBlockProps {
	children?: React.ReactNode;
	title: string;
	viewPrefix?: string;
	className?: string;
	borderLabelBottom?: boolean;
}

const PersonalProfile: React.FC<PersonalProfile> = ({ dataProductViewed }) => {
	const RenderBlockCard: React.FC<IrenderBlockProps> = ({
		children,
		title,
		viewPrefix,
		className,
		borderLabelBottom = true,
		...rest
	}: IrenderBlockProps) => {
		return (
			<div
				className={classNames(['bg-white shadow-shadow-profileCard rounded-6px', className])}
				{...rest}
			>
				<div
					className={classNames([
						'flex justify-between items-center pt-4 pb-6 px-4',
						!borderLabelBottom ? '' : 'border-b border-dark-666666',
					])}
				>
					<h1 className='font-sfpro_bold text-lg font-bold uppercase leading-7 text-333333'>
						{title}
					</h1>
					<span className='block cursor-pointer text-1A94FF'>{viewPrefix}</span>
				</div>
				{children}
			</div>
		);
	};
	return (
		<>
			<div className={'flex items-center justify-between pt-4 pb-6'}>
				<h1 className='font-sfpro_bold text-lg font-bold uppercase leading-7 text-333333'>
					Danh sách đơn hàng
				</h1>
				<span className='block cursor-pointer text-1A94FF'>Xem tất cả đơn hàng (7)</span>
			</div>

			{[...new Array(3)].map((_, i: number) => (
				<div className='shadow-shadow-profileCard rounded-6px bg-white p-6' key={i}>
					<div className='flex items-center justify-between border-b border-dashed border-[#D8D8D8] pb-4'>
						<div className='flex items-center'>
							<div className='relative mr-2 h-[40px] w-[40px] rounded-full'>
								<ImageCustom
									layout='fill'
									src={'/static/images/avatar_default.png'}
									objectFit='contain'
								/>
							</div>
							<h3 className='font-sfpro_bold text-16 font-bold uppercase leading-6'>
								Điện máy xanh
							</h3>
							<span className='ml-3 block text-14 leading-5 text-[#666666]'>
								Mã đơn hàng: #2515016{' '}
							</span>
						</div>
						<span className='block text-14 leading-5 text-[#666666]'>Mã đơn hàng: #2515016 </span>
					</div>
					<div className='flex justify-between py-4'>
						<div className='flex pr-4'>
							<div className='relative h-[90px] w-[90px]'>
								<ImageCustom
									src='https://testcdn.vuivui.com/guest/temp/tui-xach-nu/BL03/balo-nang-dong-batino-da.jpg'
									layout='fill'
								/>
							</div>
							<div className='relative h-[90px] w-[90px]'>
								<ImageCustom
									src='https://testcdn.vuivui.com/guest/temp/tui-xach-nu/BL03/balo-nang-dong-batino-da.jpg'
									layout='fill'
								/>
							</div>
							<div className='flex flex-col'>
								<span className='font-sfpro_bold text-16 font-bold uppercase leading-6'>
									10.000.000d
								</span>
								<div className='flex items-center'>
									<span className='text-14 leading-5 text-[#666666]'>Đã thanh toán</span>
									<div className='relative h-[16px] w-[16px]'>
										<ImageCustom layout='fill' src={'/static/svg/verify-icon.svg'} />
									</div>
								</div>
								<span className='mt-2 block cursor-pointer text-1A94FF'>Xem chi tiết</span>
							</div>
						</div>
						<div className='flex-auto'>
							<h3 className='font-sfpro_bold text-16 font-bold uppercase leading-6'>
								<span className='text-FF7A00'>Chờ xác nhận</span> từ Điện máy xanh
							</h3>
							<span className='text-14 leading-5 text-[#666666]'>
								Dự kiến giao vào Thứ sáu, ngày 17/3/2022{' '}
							</span>
						</div>
						<span>
							<button className='rounded-6px border border-black/10 py-1.5 px-2.5 text-[#333333] outline-none transition-all duration-300 hover:border-1A94FF/90 hover:text-1A94FF/90'>
								Hủy đơn
							</button>
						</span>
					</div>
					<span className='block pb-4 text-14 leading-5 text-[#666666]'>
						Được Đổi/ Trả nếu <span className='font-sfpro_semiBold'>không vừa ý</span> trong X ngày
						tới (người mua chịu phí chuyển hàng Đổi/Trả).{' '}
						<span className='font-sfpro_semiBold'>Xem chi tiết</span>
					</span>
					<div className='border-t border-dashed border-[#D8D8D8] pt-4'>
						<div className='relative'>
							<div className='overflow-hidden rounded-md border border-[#E0E0E0]'>
								<input
									type='text'
									className='w-9/12 py-2.5 px-3 text-black text-opacity-60 outline-none'
									placeholder='Chat với shop ngay'
								/>
								<div className='absolute top-2/4 right-0 flex h-full translate-x-0 -translate-y-2/4 pr-4'>
									<div className='relative  mr-2 cursor-pointer pr-[20px]'>
										<ImageCustom
											src='/static/svg/icon-picture-dark.svg'
											alt='icon-smile'
											layout='fill'
										/>
									</div>
									<div className='relative  mr-2 cursor-pointer pr-[20px]'>
										<ImageCustom
											src='/static/svg/icon-smile-dark.svg'
											alt='iconPicture'
											layout='fill'
										/>
									</div>
									<div className='relative cursor-pointer pr-[20px]'>
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
				</div>
			))}

			{dataProductViewed && dataProductViewed?.length > 0 ? (
				<RenderBlockCard
					title='Sản phẩm đã xem'
					viewPrefix='Xem tất cả'
					borderLabelBottom={false}
					className='mt-4'
				>
					{/* product card */}
					<div className='relative grid grid-cols-6 gap-2 px-4 pb-5'>
						<button className='absolute top-1/2 right-0 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-md'>
							<div className='h-w-3 relative w-3 p-18px '>
								<ImageCustom
									src='/static/svg/chevron-right-3e3e40.svg'
									alt='vuivui'
									layout='fill'
								/>
							</div>
						</button>
						<button className='absolute top-1/2 left-8 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-md'>
							<div className='h-w-3 relative w-3 rotate-180 p-18px'>
								<ImageCustom
									src='/static/svg/chevron-right-3e3e40.svg'
									alt='vuivui'
									layout='fill'
								/>
							</div>
						</button>
						{dataProductViewed?.splice(0, 5).map((item, i: number) => (
							<ProductCard
								key={i}
								image={item?.variations && item?.variations[0]?.variationImage}
								isDealShock={true}
								percentDiscount={item?.promotions && item?.promotions?.[0].discountValue}
								width='171px'
								height='171px'
								// left={
								// 	item?.variations &&
								// 	item?.variations[0]?.quantities &&
								// 	item?.variations[0]?.quantities[0]?.quantity - (item?.totalSold ?? 0)
								// }
								price={
									item?.promotions?.length > 0
										? item.promotions[0]?.pricePromote
											? item.promotions[0]?.pricePromote
											: item?.price
										: item?.price
								}
								priceDash={item?.promotions?.length > 0 ? item.promotions[0]?.price : ''}
								path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
								className='mx-auto'
								classPrice='font-sfpro_semiBold'
								classNameImage='rounded-tr-2xl'
							/>
						))}
					</div>
				</RenderBlockCard>
			) : null}

			{/* <RenderBlockCard
				title='Sản phẩm, thương hiệu yêu thích'
				viewPrefix='Xem tất cả'
				borderLabelBottom={false}
				className='mt-4'
			>
				<div className='grid grid-cols-6 gap-2 px-4 pb-5 relative'>
					<button className='bg-white z-10 rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 right-0 border shadow-md'>
						<div className='relative w-3 h-w-3 p-18px '>
							<ImageCustom src='/static/svg/chevron-right-3e3e40.svg' alt='vuivui' layout='fill' />
						</div>
					</button>
					<button className='bg-white z-10 rounded-full absolute transform -translate-x-1/2 -translate-y-1/2 top-1/2 left-8 border shadow-md'>
						<div className='relative w-3 h-w-3 p-18px transform rotate-180'>
							<ImageCustom src='/static/svg/chevron-right-3e3e40.svg' alt='vuivui' layout='fill' />
						</div>
					</button>
					{MOCKUP.map((item: any, i: number) => (
						<ProductCard
							image={item.img}
							isHeart={item?.isHeart}
							key={i}
							classNameImage='max-h-[130px]'
						/>
					))}
				</div>
			</RenderBlockCard> */}
		</>
	);
};

export default PersonalProfile;
