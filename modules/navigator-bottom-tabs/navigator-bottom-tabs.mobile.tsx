import classNames from 'classnames';
import { useAppDispatch, useAppSelector, useAuth, useIsomorphicLayoutEffect } from 'hooks';
import { AccountInfo, ShowCatalog } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { Icon,IconEnum } from 'vuivui-icons';

import { appActions, showCatalogSector } from '@/store/reducers/appSlice';

const CatalogMobile = dynamic(() => import('modules/catalog/catalog.mobile'), {
	ssr: false,
}) as React.FC<any>;

interface IFooterIcon {
	id: number;
	label: string;
	icon: IconEnum;
	active: boolean;
	path?: string;
}

const NavigatorBottomTab = () => {
	const dispatch = useAppDispatch();
	const { push } = useRouter();
	const [_, setIsScrollDown] = useState(false);
	let prevPosition = 0;

	const footerRef = useRef<HTMLElement | null>(null);

	const isOpenCatalog = useAppSelector(showCatalogSector);

	const { asPath } = useRouter();

	const { currentUser } = useAuth();

	const [isClosing, setIsClosing] = useState(false);

	const [clientHeight, setClientHeight] = useState<number>(0);

	const [userAuth, setUserAuth] = useState<AccountInfo | null>();

	const bottomCatalog: any = useRef(null);

	useIsomorphicLayoutEffect(() => {
		footerRef.current = window.document.getElementById('footer-session');
		bottomCatalog.current = window.document.getElementById('bottom-catalog');
	}, []);

	useIsomorphicLayoutEffect(() => {
		setUserAuth(currentUser);
	}, [currentUser]);

	useIsomorphicLayoutEffect(() => {
		if (footerRef.current) {
			const handleScrollWindow = () => {
				const position: number = window.scrollY;
				if (position <= 60) {
					setIsScrollDown(false);
					footerRef.current?.classList.add('showRisingUp');
				} else if (position > prevPosition && position > 60) {
					footerRef.current?.classList.remove('showRisingUp');
					setIsScrollDown(true);
				} else {
					footerRef.current?.classList.add('showRisingUp');
					setIsScrollDown(false);
				}
				prevPosition = position;
			};
			window.addEventListener('scroll', handleScrollWindow);
			return () => {
				window.removeEventListener('scroll', handleScrollWindow);
			};
		}
	}, [footerRef.current]);

	const [footerSessions, setFooterSession] = useState<IFooterIcon[]>([
		{
			id: 0,
			label: 'Trang chủ',
			icon: IconEnum.HouseSimple,
			active: true,
			path: '/',
		},
		{
			id: 1,
			label: 'Danh mục',
			icon: IconEnum.SquaresFour,
			active: false,
		},
		{
			id: 2,
			label: 'LiveStream',
			icon: IconEnum.MonitorPlay,
			active: false,
			path: '/live-stream',
		},
		{
			id: 3,
			label: 'Tin nhắn',
			icon: IconEnum.ChatCircleText,
			active: false,
			path: '/chat',
		},
		{
			id: 4,
			label: 'Cá nhân',
			icon: IconEnum.User,
			active: false,
			path: '/ca-nhan/don-hang/cho-xac-nhan',
		},
	]);

	useEffect(() => {
		setFooterSession(
			footerSessions.map((o: IFooterIcon) => {
				if (o.path === asPath) {
					return {
						...o,
						active: true,
					};
				}
				return {
					...o,
					active: false,
				};
			}),
		);
		dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
	}, [asPath]);

	let timeout: any = null;

	const onOpen = () => {
		clearTimeout(timeout);
		document.body.style.overflow = 'hidden';
		dispatch(appActions.setIsShowCatalog(ShowCatalog.fromBottom));
	};

	const onClose = () => {
		document.body.style.overflow = 'scroll';

		timeout = setTimeout(() => {
			dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
			setIsClosing(false);
		}, 300);
	};

	const handleChangeTabs = (item: IFooterIcon) => {
		if (item.id === 1) {
			onOpen();
		} else {
			onClose();
			item?.path && push(item?.path);
		}
		setFooterSession(
			footerSessions.map((o: IFooterIcon) => {
				if (o.id === item.id) {
					return {
						...o,
						active: true,
					};
				}
				return {
					...o,
					active: false,
				};
			}),
		);
	};

	useIsomorphicLayoutEffect(() => {
		function handleResize() {
			// Set window width/height to state
			setClientHeight(
				Math.max(document?.documentElement?.clientHeight || 0, window.innerHeight || 0),
			);
		}
		// Add event listener
		window.addEventListener('resize', handleResize);
		// Call handler right away so state gets updated with initial window size
		handleResize();
		// Remove event listener on cleanup
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useIsomorphicLayoutEffect(() => {
		if (isClosing && bottomCatalog.current) {
			bottomCatalog.current?.classList.remove('animation-b-to-t');
			bottomCatalog.current?.classList.add('animation-hidden-to-b');
			onClose();
		}
	}, [isClosing, bottomCatalog.current]);

	return (
		<div
			className={classNames(
				isOpenCatalog === ShowCatalog.fromBottom ? 'fixed top-0' : '',
				'z-[100]',
			)}
		>
			<div
				id='bottom-catalog'
				className={classNames([
					isOpenCatalog === ShowCatalog.fromBottom ? 'z-50 w-screen animation-b-to-t' : 'hidden',
					'transition-all duration-300 ease-in-out ',
					'items-center bg-transparent fixed bottom-[56px]',
				])}
				style={{ height: `${clientHeight - 126}px` }}
			>
				<CatalogMobile
					onOpen={onOpen}
					onClose={() => setIsClosing(true)}
					userAuth={userAuth}
					isOpenCatalog={isOpenCatalog}
					height={clientHeight}
				/>
			</div>
			<div
				style={{
					boxShadow:
						isOpenCatalog === ShowCatalog.hidden
							? '0px -0.1px 0.3px rgba(0, 0, 0, 0.1), 0px -1px 2px rgba(0, 0, 0, 0.1)'
							: '',
				}}
				className={classNames(
					'bg-white grid grid-cols-5 pt-[12px] w-[100vw] z-[51] focus-visible:outline-none pb-3 hide-nav-bar',
					'fixed bottom-0',
				)}
			>
				{footerSessions.map((item: IFooterIcon, index: number) => {
					return (
						<div
							key={index}
							className='flex cursor-pointer flex-col items-center justify-between place-self-center focus-visible:outline-none'
							tabIndex={0}
							role='menu'
							onClick={() => handleChangeTabs(item)}
							onKeyPress={() => handleChangeTabs(item)}
						>
							<Icon
								name={item.icon}
								color={item.active ? 'primary' : 'gray'}
								size={20}
								className='mt-[0px] ml-[-1px]'
							/>
							<p
								className={classNames(
									item.active ? 'text-[#F05A94]' : 'text-[#666]',
									'text-12 mt-[2px]',
								)}
							>
								{item.label}
							</p>
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default NavigatorBottomTab;
