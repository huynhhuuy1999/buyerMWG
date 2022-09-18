import classNames from 'classnames';
import { ImageCustom, Notification } from 'components';
import { REGEX_IMAGE } from 'constants/';
import { useAppDispatch, useAuth, useIsomorphicLayoutEffect } from 'hooks';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { memo, useRef, useState } from 'react';
import { logoutClient, truncateString } from 'utils';
import { Icon, IconEnum } from 'vuivui-icons';

import { authActions } from '@/store/reducers/authSlice';
import { cartActions } from '@/store/reducers/cartSlice';

// import Notification from '../notifications';

interface IDashBarProps {
	onOpen: () => void;
	isOpen: boolean;
	setIsOpenDashBar: React.Dispatch<React.SetStateAction<boolean>>;
}
const DashBarLeft: React.FC<IDashBarProps> = ({ onOpen, setIsOpenDashBar, isOpen }) => {
	const dispatch = useAppDispatch();

	const navBarLeft: any = useRef(null);

	const [isClosing, setIsClosing] = useState(false);

	const router = useRouter();

	const { currentUser: userAuth } = useAuth();

	useIsomorphicLayoutEffect(() => {
		navBarLeft.current = window.document.getElementById('navbar-left');
	});

	useIsomorphicLayoutEffect(() => {
		if (isClosing && navBarLeft.current) {
			navBarLeft.current?.classList.remove('animation-l-to-r');
			navBarLeft.current?.classList.add('animation-hidden-to-l');
			setTimeout(() => {
				setIsClosing(false);
				setIsOpenDashBar(false);
			}, 200);
		}
	}, [isClosing, navBarLeft.current]);

	useIsomorphicLayoutEffect(() => {
		if (isOpen && navBarLeft.current) {
			navBarLeft.current?.classList.remove('animation-hidden-to-l');
			navBarLeft.current?.classList.add('animation-l-to-r');
			setTimeout(() => {
				setIsOpenDashBar(true);
				setIsClosing(false);
			}, 300);
		}
	}, [isOpen, navBarLeft.current]);

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
		<div className='flex h-screen w-full bg-[#0E0E1066]'>
			<div id='navbar-left' className={classNames('h-full w-3/4 fixed left-0 opacity-100')}>
				{userAuth && (
					<div className='bg-[#F05A94]'>
						<div
							className='flex h-16 w-full cursor-pointer items-center px-3'
							role='button'
							tabIndex={0}
							onClick={() => {
								router.push('/ca-nhan/don-hang/cho-xac-nhan');
							}}
							onKeyPress={() => {
								router.push('/ca-nhan/don-hang/cho-xac-nhan');
							}}
						>
							<ImageCustom
								priority
								width={40}
								height={40}
								alt={userAuth.fullName}
								src={
									userAuth?.avatarImage?.fullPath && REGEX_IMAGE.test(userAuth.avatarImage.fullPath)
										? userAuth.avatarImage.fullPath
										: '/static/images/avatar_default.png'
								}
								className='inline-block h-8 w-8 rounded-full'
							/>
							<span className='min-w-[40%] px-2 text-base text-white'>
								{/* {userAuth.fullName} */}
								{userAuth?.fullName ? truncateString(userAuth?.fullName, 15) : `[Chưa cập nhật]`}
							</span>
							<Icon name='icon-chevron-right' color='#fff' size={22}></Icon>
						</div>
					</div>
				)}
				<div className='h-full bg-white p-3 text-base'>
					<div
						className='mb-4 flex cursor-pointer items-center space-x-3'
						role='button'
						tabIndex={0}
						onClick={onOpen}
						onKeyPress={onOpen}
					>
						<Icon name={IconEnum.ArrowBendDownRight} color='black' size={24} className='mt-[2px]' />
						<span>Danh mục</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.Book} color='black' size={24} className='mt-[2px]' />
						<span>Chính sách đổi trả</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.Question} color='black' size={24} className='mt-[2px]' />
						<span>Câu hỏi thường gặp</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.Cube} color='black' size={24} className='mt-[2px]' />
						<span>Đăng ký bán hàng</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.Cube} color='black' size={24} className='mt-[2px]' />
						<span>Quản lý gian hàng</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.WarningCircle} color='black' size={24} className='mt-[2px]' />
						<span>Giới thiệu công ty</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.Headset} color='black' size={24} className='mt-[2px]' />
						<span>Liên hệ</span>
					</div>
					<div className='mb-4 flex cursor-pointer items-center space-x-3'>
						<Icon name={IconEnum.GearSix} color='black' size={24} className='mt-[2px]' />
						<span>Cài đặt</span>
					</div>
					<Link href={''} passHref>
						<div
							tabIndex={-1}
							role={'button'}
							className='mb-3 flex cursor-pointer items-center space-x-3'
							onClick={() => {
								handleLogout();
							}}
							onKeyPress={() => {
								handleLogout();
							}}
						>
							<Icon name={IconEnum.SignOut} color='black' size={24} className='mt-[2px]' />
							<span>Đăng xuất</span>
						</div>
					</Link>
				</div>
			</div>
			<div
				className='z-100 fixed right-0 h-full w-1/4 opacity-60 overflow-y-hidden'
				role={'button'}
				tabIndex={0}
				onClick={() => {
					document.body.style.overflow = 'scroll';
					setIsClosing(true);
				}}
				onKeyPress={() => {
					document.body.style.overflow = 'scroll';
					setIsClosing(true);
				}}
			></div>
		</div>
	);
};
export default memo(DashBarLeft);
