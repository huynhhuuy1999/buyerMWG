import classNames from 'classnames';
import { ImageCustom } from 'components';
import Link from 'next/link';
import React from 'react';

export type SettingsProps = {
	icon?: JSX.Element;
	tab: string;
	url: string;
	prefix?: string;
	isDisabled?: boolean;
	key: string;
};

interface ISidebar {
	className?: string;
	children?: React.ReactNode;
}

const SidebarDesktop: React.FC<ISidebar> = ({ children, className }: ISidebar) => {
	const settings: SettingsProps[] = [
		{
			key: '2',
			tab: 'Danh sách đơn hàng',
			prefix: '13',
			url: '/ca-nhan/don-hang/cho-xac-nhan',
			icon: <ImageCustom alt='icon' src={'/static/svg/order-history.svg'} layout='fill' />,
		},
		{
			key: '3',
			tab: 'Danh sách chờ đánh giá',
			prefix: '13',
			isDisabled: true,
			url: '/ca-nhan/danh-gia',
			icon: <ImageCustom alt='icon' src={'/static/svg/star-none-raking.svg'} layout='fill' />,
		},
		{
			key: '4',
			tab: 'Sản phẩm đã xem',
			prefix: '',
			url: '/ca-nhan/san-pham-da-xem',
			icon: <ImageCustom alt='icon' src={'/static/svg/view-on-icon.svg'} layout='fill' />,
		},
		{
			key: '5',
			tab: 'Sản phẩm yêu thích',
			prefix: '',
			url: '/ca-nhan/san-pham-yeu-thich',
			icon: <ImageCustom alt='icon' src={'/static/svg/wishlist-icon.svg'} layout='fill' />,
		},
		{
			key: '6',
			tab: 'Nhà bán yêu thích',
			prefix: '',
			url: '/ca-nhan/nha-ban-yeu-thich',
			isDisabled: true,
			icon: <ImageCustom alt='icon' src={'/static/svg/store-wishlist-icon.svg'} layout='fill' />,
		},
	];

	return (
		<div className={className}>
			{children}
			<div className='relative overflow-hidden'>
				<div className='fixed mx-auto max-h-[calc(100vh_-_56px)] w-auto rounded-6px bg-white px-4 py-5 text-center shadow-profileCard'>
					<Link href={'/ca-nhan'}>
						<a>
							<div className='relative mx-auto h-20 w-20 cursor-pointer'>
								<ImageCustom
									layout='fill'
									alt='Avatar'
									src={'/static/images/mockup/mockup_avtar_big.png'}
									objectFit='cover'
								/>
							</div>
							<h1 className='font-sfpro_bold text-lg font-semibold text-danger-7C254A'>
								Võ thị kim ngân
							</h1>
						</a>
					</Link>
					<div className='flex items-center justify-center'>
						<span>Chỉnh sửa hồ sơ</span>
						<div className='relative ml-1 h-4 w-4'>
							<ImageCustom
								layout='fill'
								src={'/static/svg/icon-edit-profile--desktop.svg'}
								alt='iconEditProfile'
							/>
						</div>
					</div>
					<div className='mx-5 mt-6 mb-[calc(100%_-_69px)] space-y-6 text-left text-14 font-normal not-italic leading-normal tracking-0.0025em'>
						{settings &&
							settings.map((item, i: number) =>
								!item.isDisabled ? (
									<Link href={item.url} key={i}>
										<a
											className={classNames([
												'flex items-start lg:items-center cursor-pointer hover:text-F05A94 transform transition-all duration-150',
											])}
											key={item.key}
										>
											{item.icon && (
												<div className='relative mr-2.5 h-[24px] w-[24px]'>{item.icon}</div>
											)}
											{item.tab}
										</a>
									</Link>
								) : (
									<div
										className={'flex cursor-not-allowed items-start grayscale lg:items-center'}
										key={item.key}
									>
										{item.icon && (
											<div className='relative mr-2.5 h-[24px] w-[24px]'>{item.icon}</div>
										)}
										{item.tab}
									</div>
								),
							)}
					</div>
					<div className='flex'>
						<button className='mx-auto px-5 py-3 text-3E3E40 hover:text-F05A94'>Đăng xuất</button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SidebarDesktop;
