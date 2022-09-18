import { Notification } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAuth, useIsomorphicLayoutEffect } from 'hooks';
import Link from 'next/link';
import { useRef } from 'react';
import { logoutClient, truncateString } from 'utils';
import { Icon, IconEnum } from 'vuivui-icons';

import { authActions } from '@/store/reducers/authSlice';
import { cartActions } from '@/store/reducers/cartSlice';

interface ITabs {
	path: string;
	tab: string;
	activeIcon: React.ReactNode;
	prefix: string;
	icon: React.ReactNode;
}
interface TabsProps {
	path: string;
	expression?: any;
}
export const Sidebar = (props: TabsProps) => {
	const ref_sidebar: any = useRef();
	const dispatch = useAppDispatch();
	const tabSettings: ITabs[] = [
		{
			tab: 'Danh sách đơn hàng',
			prefix: '13',
			path: '/ca-nhan/don-hang/cho-xac-nhan',
			activeIcon: (
				<Icon name={IconEnum.FileText} size={18} className='mt-[2px]' color={'primary'} />
			),
			icon: (
				<Icon
					name={IconEnum.FileText}
					size={18}
					className='mt-[2px]'
					color={props.path === '/ca-nhan/don-hang/cho-xac-nhan' ? 'primary' : '#333333'}
				/>
			),
		},
		// {
		// 	tab: 'Thông báo',
		// 	prefix: '13',
		// 	path: 'notifications',
		// 	icon: <Icon src={'/static/svg/notification.svg'} layout='fill' />,
		// },
		{
			tab: 'Danh sách chờ đánh giá',
			prefix: '13',
			path: '/ca-nhan/danh-gia',
			activeIcon: <Icon name={IconEnum.Star} size={18} className='mt-[2px]' color={'primary'} />,
			icon: (
				<Icon
					name={IconEnum.Star}
					size={18}
					className='mt-[2px]'
					color={props.path === '/ca-nhan/danh-gia' ? 'primary' : '#333333'}
				/>
			),
		},
		{
			tab: 'Sản phẩm đã xem',
			prefix: '',
			path: '/ca-nhan/san-pham-da-xem',
			activeIcon: <Icon name={IconEnum.Eye} size={18} className='mt-[2px]' color={'primary'} />,
			icon: (
				<Icon
					name={IconEnum.Eye}
					size={18}
					className='mt-[2px]'
					color={props.path === '/ca-nhan/san-pham-da-xem' ? 'primary' : '#333333'}
				/>
			),
		},
		{
			tab: 'Sản phẩm yêu thích',
			prefix: '',
			path: '/ca-nhan/san-pham-yeu-thich',
			activeIcon: <Icon name={IconEnum.Package} size={18} className='mt-[2px]' color={'primary'} />,
			icon: (
				<Icon
					name={IconEnum.Package}
					size={18}
					className='mt-[2px]'
					color={props.path === '/ca-nhan/san-pham-yeu-thich' ? 'primary' : '#333333'}
				/>
			),
		},
		{
			tab: 'Nhà bán yêu thích',
			prefix: '',
			path: '/ca-nhan/nha-ban-yeu-thich',
			activeIcon: (
				<Icon name={IconEnum.Storefront} size={18} className='mt-[2px]' color={'primary'} />
			),
			icon: (
				<Icon
					name={IconEnum.Storefront}
					size={18}
					className='mt-[2px]'
					color={props.path === '/ca-nhan/nha-ban-yeu-thich' ? 'primary' : '#333333'}
				/>
			),
		},
	];
	const { currentUser } = useAuth();

	const sideBarElement = useRef<HTMLDivElement | any>(null);
	const tempElement = useRef<HTMLDivElement | any>(null);

	useIsomorphicLayoutEffect(() => {
		sideBarElement.current = window?.document?.getElementById('sidebar');
		tempElement.current = window?.document?.getElementById('temp');
	}, []);

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			const position: number = window.scrollY;
			if (position <= 60) {
				['transition', 'ease-out', 'origin-top-left', 'duration-200'].map((item) =>
					sideBarElement.current?.classList?.add(item),
				);
				tempElement.current?.classList?.add('hidden');
				sideBarElement.current?.classList?.remove('sidebar-scroll');
			} else {
				sideBarElement.current?.classList?.add('sidebar-scroll');
				tempElement.current?.classList?.remove('hidden');
			}
		};
		window.addEventListener('scroll', handleScrollWindow);
		return () => {
			window.removeEventListener('scroll', handleScrollWindow);
		};
	}, []);

	const handleLogout = () => {
		Notification.Confirm.show(
			'Đăng xuất ngay',
			'Bạn có muốn đăng xuất không ?',
			'Đồng ý',
			'Không',
			async () => {
				Notification.Loading.custom();
				await logoutClient();
				await dispatch(cartActions.reset());
				await dispatch(authActions.reset());
				Notification.Loading.remove();
				window.location.replace('/');
			},
			async () => {},
		);
	};

	return (
		<>
			<div id='temp' className='hidden'></div>
			<div ref={ref_sidebar} id='sidebar' className={'z-[8] w-[228px]'}>
				<div
					style={{ maxHeight: 'calc(100vh - 120px)' }}
					className='relative mx-auto mb-[20px] rounded-6px bg-white pt-[10px] pb-[1px] text-center shadow-profileCard'
				>
					<div className='relative mx-auto h-20 w-20 cursor-pointer'>
						<img
							alt='Avatar'
							src={currentUser?.avatarImage?.fullPath ?? EmptyImage}
							className='h-20 w-20 object-cover'
							width={80}
							height={80}
						/>
					</div>
					<div className='mt-[10px] font-sfpro_bold text-lg font-semibold text-danger-7C254A'>
						{currentUser?.fullName ? truncateString(currentUser?.fullName, 15) : `[Chưa cập nhật]`}
					</div>
					<Link href='/ca-nhan/chinh-sua-thong-tin'>
						<div className='flex cursor-pointer items-center justify-center'>
							<span className='text-[#666666]'>Chỉnh sửa hồ sơ</span>
							<div className='relative ml-1 h-4 w-4'>
								<Icon name='PencilSimple' size={18} color='#666666' />
							</div>
						</div>
					</Link>
					<ul className='mx-5 mt-6 mb-60 space-y-6 text-left text-14 font-normal not-italic leading-normal tracking-0.0025em '>
						{tabSettings.map((item: ITabs, index: number) => (
							<Link href={item.path} key={index}>
								<div
									className={`group flex cursor-pointer items-start transition-all duration-150 hover:text-F05A94 lg:items-center ${
										item.path === props.path ? 'text-F05A94' : ''
									}`}
									role='button'
									key={index}
								>
									{item.icon && (
										<>
											<div className='relative mr-2.5 block h-18px w-18px group-hover:hidden'>
												{item.icon}
											</div>
											<div className='relative mr-2.5 hidden h-18px w-18px group-hover:block'>
												{item.activeIcon}
											</div>
										</>
									)}
									{item.tab}
								</div>
							</Link>
						))}
					</ul>
					<div className='absolute bottom-0 left-0 flex w-full'>
						<button
							className='mx-auto px-5 py-3 text-3E3E40 hover:text-F05A94'
							onClick={handleLogout}
						>
							Đăng xuất
						</button>
					</div>
				</div>
			</div>
		</>
	);
};
