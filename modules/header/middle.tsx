import { useAppDispatch, useAppSelector, useAuth } from 'hooks';
import { ShowCatalog } from 'models';
import dynamic from 'next/dynamic';
import React, { Fragment, useEffect, useRef } from 'react';

import { appActions, showCatalogSector } from '@/store/reducers/appSlice';
interface ICatalogProps {
	userAuth: any;
	onClose: () => void;
}
interface ISearchRequestProps {
	textSearch?: string;
}
const Catalog = dynamic(() => import('@/modules/catalog/catalog'), {
	ssr: false,
}) as React.FC<ICatalogProps>;
const Search = dynamic(() => import('@/components/common/search')) as React.FC<ISearchRequestProps>;
const MiddleHeader: React.FC = () => {
	const isOpenCatalog = useAppSelector(showCatalogSector);
	const dispatch = useAppDispatch();
	const { currentUser } = useAuth();
	const catalogRef = useRef<HTMLDivElement>(null);
	const clickRef = useRef<HTMLDivElement>(null);
	useEffect(() => {
		const handleClickOutside = (event: any) => {
			if (
				catalogRef.current &&
				!catalogRef.current.contains(event.target) &&
				clickRef.current &&
				!clickRef.current.contains(event.target) &&
				isOpenCatalog !== ShowCatalog.hidden
			) {
				onClose();
			}
		};
		document.addEventListener('click', handleClickOutside);

		return () => {
			document.removeEventListener('click', handleClickOutside);
		};
	}, [catalogRef, isOpenCatalog]);

	let timeout: any = null;
	const onOpen = () => {
		clearTimeout(timeout);
		dispatch(appActions.setIsShowCatalog(ShowCatalog.normal));
	};

	const onClose = () => {
		timeout = setTimeout(() => {
			dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
		}, 100);
	};

	const handleControlCatalog = () => {
		isOpenCatalog === ShowCatalog.hidden ? onOpen() : onClose();
	};
	return (
		<Fragment>
			<div className='relative' style={{ flex: 1 }}>
				<div className={`flex h-11 items-center rounded-md bg-white`}>
					<div
						className={`ml-1 flex cursor-pointer items-center whitespace-nowrap rounded-l-[4px] bg-[#FDEBF2] p-1`}
						tabIndex={0}
						role='button'
						ref={clickRef}
						onClick={() => {
							handleControlCatalog();
						}}
						onKeyPress={() => {
							handleControlCatalog();
						}}
					>
						<div className='h-4 w-4 bg-[url("/static/svg/list-950135.svg")]' />
						<span className='px-1 text-base font-normal not-italic leading-normal tracking-[0.04px] text-[#950135]'>
							Danh mục
						</span>
						<div className='h-3 w-3 bg-[url("/static/svg/chevron-down-bold-950135.svg")]' />
					</div>
					<Search />
				</div>
			</div>
			<div className='absolute left-0 top-[54px] flex w-full justify-center' ref={catalogRef}>
				<Catalog onClose={onClose} userAuth={currentUser} />
			</div>
		</Fragment>
	);
};

export default MiddleHeader;
