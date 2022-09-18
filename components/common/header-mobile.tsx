import classNames from 'classnames';
import { useAppDispatch, useAppSelector, useAuth, useIsomorphicLayoutEffect } from 'hooks';
import { AccountInfo, ShowCatalog } from 'models';
import { CatalogMobile } from 'modules';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { memo, useRef, useState } from 'react';
import { appActions, showCatalogSector } from 'store/reducers/appSlice';

// import { AccountInfo } from '@/models/auth';
import { cartSelector } from '@/store/reducers/cartSlice';
import { getHistorySearchRequest, getSearchTrendingRequest } from '@/store/reducers/trackingSlice';

// const CatalogMobile = dynamic(() => import('@/modules/catalog/catalog.mobile'), { ssr: false });
const SearchMobile = dynamic(() => import('@/components/common/search-mobile'), {
	ssr: false,
}) as React.FC<any>;
const DashBarLeft = dynamic(() => import('@/modules/dash-bar-left/dashBarLeft.mobile'), {
	ssr: false,
}) as React.FC<any>;
const HeaderMobile: React.FC = () => {
	const dispatch = useAppDispatch();
	const [isScrollDown, setIsScrollDown] = useState<boolean>(false);
	const [isOpenDashBar, setIsOpenDashBar] = useState<boolean>(false);
	const [isFocus, setIsFocus] = useState<boolean>(false);
	// const [userAuth, setUserAuth] = useState<AccountInfo | null>();
	const totalItemCart = useAppSelector(cartSelector);
	const router = useRouter();
	const isOpenCatalog = useAppSelector(showCatalogSector);
	const [userAuth, setUserAuth] = useState<AccountInfo | null>();
	const { currentUser } = useAuth();
	const [clientHeight, setClientHeight] = useState<number>(0);
	const [isClosing, setIsClosing] = useState(false);
	const leftCatalog: any = useRef(null);

	let prevPosition: number = 0;

	const headerRefElement = useRef<any>();

	useIsomorphicLayoutEffect(() => {
		headerRefElement.current = window.document.getElementById('header-session-mobile');
		leftCatalog.current = window.document.getElementById('left-catalog');
	}, []);

	useIsomorphicLayoutEffect(() => {
		setUserAuth(currentUser);
	}, [currentUser]);

	useIsomorphicLayoutEffect(() => {
		dispatch(
			getSearchTrendingRequest({
				pageIndex: 0,
				pageSize: 5,
			}),
		);
		dispatch(
			getHistorySearchRequest({
				pageIndex: 0,
				pageSize: 5,
			}),
		);
	}, [router]);

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
		if (headerRefElement) {
			const handleScrollWindow = () => {
				const position: number = window.scrollY;
				if (position <= 60) {
					headerRefElement.current?.classList.add('showRisingDown');
					setIsScrollDown(false);
				} else if (position > prevPosition && position > 60) {
					headerRefElement.current?.classList.remove('showRisingDown');
					setIsScrollDown(true);
				} else {
					headerRefElement.current?.classList.add('showRisingDown');
					setIsScrollDown(false);
				}
				prevPosition = position;
			};
			window.addEventListener('scroll', handleScrollWindow);
			return () => {
				window.removeEventListener('scroll', handleScrollWindow);
			};
		}
	}, [headerRefElement.current]);

	// useEffect(() => {
	// 	setUserAuth(currentUser);
	// }, [currentUser]);

	let timeout: any = null;

	const onOpen = () => {
		clearTimeout(timeout);
		document.body.style.overflow = 'hidden';
		dispatch(appActions.setIsShowCatalog(ShowCatalog.fromLeft));
	};

	const onClose = () => {
		document.body.style.overflow = 'scroll';

		timeout = setTimeout(() => {
			dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
			setIsClosing(false);
		}, 300);
	};

	useIsomorphicLayoutEffect(() => {
		if (isClosing && leftCatalog.current) {
			leftCatalog.current?.classList.remove('animation-catalog-l-to-r');
			leftCatalog.current?.classList.add('animation-catalog-hidden-to-l');
			onClose();
		}
	}, [isClosing, leftCatalog.current]);

	useIsomorphicLayoutEffect(() => {
		if (isOpenCatalog === ShowCatalog.fromLeft && leftCatalog.current) {
			leftCatalog.current?.classList.remove('animation-catalog-hidden-to-l');
			leftCatalog.current?.classList.add('animation-catalog-l-to-r');
			// setTimeout(() => {
			// 	dispatch(appActions.setIsShowCatalog(ShowCatalog.fromLeft));
			// 	setIsClosing(false);
			// }, 300);
		}
	}, [isOpenCatalog, leftCatalog.current]);

	return (
		<header className='relative w-full'>
			<div
				id='header-session-mobile'
				className={classNames([
					isScrollDown && !isFocus ? 'hidden' : '',
					isFocus || isOpenDashBar ? 'bg-[#F05A94]' : '',
					'fixed top-0 flex items-end h-[64px] px-1 pt-1 pb-2 transition-all duration-500 w-screen z-50 bg-[#F05A94] focus-visible:outline-none',
				])}
			>
				<SearchMobile
					isOpenDashBar={isOpenDashBar}
					setIsOpenDashBar={setIsOpenDashBar}
					isFocus={isFocus}
					setIsFocus={setIsFocus}
					totalItemCart={totalItemCart}
				/>
			</div>
			<div
				className={classNames([
					isOpenDashBar ? 'overflow-y-hidden overscroll-y-contain' : 'hidden',
					isScrollDown ? '' : 'top-0',
					'fixed w-full top-0 z-[51] h-full focus-visible:outline-none',
				])}
			>
				<DashBarLeft onOpen={onOpen} setIsOpenDashBar={setIsOpenDashBar} isOpen={isOpenDashBar} />
			</div>
			<div
				id='left-catalog'
				className={classNames([
					isOpenCatalog === ShowCatalog.fromLeft ? 'z-[100] w-screen' : 'hidden',
					'transition-all duration-300 ease-in-out ',
					'items-center bg-transparent fixed bottom-[56px]',
				])}
				style={{ height: `${clientHeight - 126}px` }}
			>
				<CatalogMobile
					onOpen={onOpen}
					onClose={onClose}
					userAuth={userAuth}
					isOpenCatalog={isOpenCatalog}
					height={clientHeight}
				/>
			</div>
		</header>
	);
};
export default memo(HeaderMobile);
