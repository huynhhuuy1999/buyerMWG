import classNames from 'classnames';
import { PANEL_TYPE_SEARCH } from 'enums/';
// import { ImageCustom } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import { CartState } from 'store/reducers/cartSlice';
import {
	listHistorySelector,
	listTrendSelector,
	trackingSearchKeywordRequest,
	trackingSearchResultRequest,
	trackingSearchSuggestionRequest,
} from 'store/reducers/trackingSlice';
import { Icon, IconEnum } from 'vuivui-icons';

import { appActions, selectedCatalogSector } from '@/store/reducers/appSlice';
import { catalogListSelector } from '@/store/reducers/categorySlide';

const SearchRequestMobile = dynamic(
	() => import('@/modules/search/searchRequest.mobile'),
) as React.FC<any>;
const SearchSuggestMobile = dynamic(() => import('@/modules/search/searchSuggest.mobile'), {
	ssr: false,
}) as React.FC<any>;

interface ISearchProps {
	isOpenDashBar: boolean;
	setIsOpenDashBar: (flag: boolean) => void;
	setIsFocus: (flag: boolean) => void;
	isFocus: boolean;
	totalItemCart: CartState;
}
const SearchMobile: React.FC<ISearchProps> = ({
	isOpenDashBar,
	setIsOpenDashBar,
	setIsFocus,
	isFocus,
	totalItemCart,
}: ISearchProps) => {
	const [textSearch, setTextSearch] = useState<string>('');
	const [active, setActive] = useState<string>('');
	const [display, setDisplay] = useState<boolean>(false);
	const [isHomePage, setIsHomePage] = useState<boolean>(false);
	const [placeholder, setPlaceholder] = useState<string>('');
	const [showName, setShowName] = useState<string>('');

	const searchRef: { current: NodeJS.Timeout | null } = useRef(null);
	const router = useRouter();
	const dispatch = useAppDispatch();

	const catalog = useAppSelector(catalogListSelector);
	const selectedCatalog = useAppSelector(selectedCatalogSector);
	const listHistory = useAppSelector(listHistorySelector);
	const listTrend = useAppSelector(listTrendSelector);

	useEffect(() => {
		if (router.asPath && router.asPath === '/') {
			setIsHomePage(true);
		} else {
			setIsHomePage(false);
		}
		const keySearch = router.query.k;
		if (keySearch) {
			setTextSearch(keySearch.toString());
			setActive(PANEL_TYPE_SEARCH.REQUEST);
		} else {
			setActive(PANEL_TYPE_SEARCH.SUGGESTION);
		}
	}, [dispatch, router.asPath, router.query.k]);

	useEffect(() => {
		const urlSlug = router.query.slug_extend ? router.query.slug_extend : undefined;
		setDisplay(false);
		if (urlSlug) {
			dispatch(appActions.getSelectedCatalog({ catalog: catalog, urlSlug: urlSlug as string }));
		}
	}, [catalog, dispatch, router]);

	useEffect(() => {
		if (isHomePage) {
			setPlaceholder('Bạn tìm mua gì ở VuiVui?');
		} else {
			setPlaceholder(
				selectedCatalog?.[selectedCatalog.length - 1]?.title
					? 'Tìm trong ' + selectedCatalog?.[selectedCatalog.length - 1]?.name.toLowerCase()
					: 'Bạn tìm mua gì ở VuiVui?',
			);
		}
	}, [isHomePage, selectedCatalog]);

	const onSearch = (event: any) => {
		if (searchRef.current) {
			clearTimeout(searchRef.current);
		}
		searchRef.current = setTimeout(() => {
			setDisplay(true);
			const { value } = event.target;
			setTextSearch(value);
			if (value) {
				setActive(PANEL_TYPE_SEARCH.REQUEST);
			} else {
				if (isHomePage) {
					setDisplay(true);
					setActive(PANEL_TYPE_SEARCH.SUGGESTION);
				} else {
					setDisplay(false);
				}
			}
		}, 300);
	};

	const renderSearchPane = () => {
		switch (active) {
			case PANEL_TYPE_SEARCH.REQUEST:
				return <SearchRequestMobile textSearch={textSearch} onClick={onClickRequest} />;
			case PANEL_TYPE_SEARCH.SUGGESTION:
				return (
					<SearchSuggestMobile
						recentList={listHistory}
						onClick={onClickSuggest}
						listTrending={listTrend}
						onRemove={onRemove}
					/>
				);
		}
	};

	const handlePushRouter = (search: string) => {
		let url: string = 'tim-kiem';
		if (isHomePage || !selectedCatalog?.[selectedCatalog.length - 1]?.urlSlug) {
			url = 'tim-kiem';
		} else {
			url = selectedCatalog?.[selectedCatalog.length - 1]?.urlSlug;
		}
		router.push(`/${url}?k=${decodeURIComponent(search.trim()).replaceAll(' ', '+')}`, undefined, {
			shallow: true,
		});
	};

	const handleSearching = (event: any) => {
		if (event.key == 'Enter' && event.target?.value) {
			const search: string = event.target?.value;
			setDisplay(false);
			const payload = { keyword: search.trim() };
			dispatch(trackingSearchKeywordRequest(payload));
			handlePushRouter(search.trim());
		}
	};

	const handleOnFocusSearch = () => {
		setIsFocus(true);
		if (!isHomePage && selectedCatalog?.[selectedCatalog.length - 1]?.id && !display) {
			if (router.query.k) {
				setShowName('');
			} else {
				setShowName(selectedCatalog?.[selectedCatalog.length - 1]?.name);
			}
		} else {
			setShowName('');
		}
		setDisplay(true);
	};

	const onClickSuggest = (text: string) => {
		setDisplay(false);
		if (text) {
			const payload = { keyword: text };
			dispatch(trackingSearchResultRequest(payload));
			handlePushRouter(text);
		}
	};

	const onClickRequest = (text: string, index: number) => {
		setDisplay(false);
		if (text) {
			const payload = { keyword: textSearch, indexClick: index, keywordClick: text };
			dispatch(trackingSearchSuggestionRequest(payload));
			handlePushRouter(text);
		}
	};

	const onRemove = (text: string) => {
		// if (text && listResult.length) {
		// 	setIsClicker(true);
		// 	localStorage.setItem(
		// 		'recent-list',
		// 		JSON.stringify(listResult.filter((item: any) => item.keyword !== text)),
		// 	);
		// }
	};

	return (
		<div className='w-full rounded-md bg-white shadow-xl'>
			<div className='flex h-12 w-full items-center rounded-md border-black bg-white px-3'>
				<div
					className='mx-1 flex w-[30px] cursor-pointer items-center'
					role='button'
					tabIndex={0}
					onClick={() => {
						if (isHomePage || display) {
							if (display) {
								setDisplay(false);
								setActive(PANEL_TYPE_SEARCH.SUGGESTION);
								setIsFocus(false);
							} else {
								setIsOpenDashBar(!isOpenDashBar);
							}
						} else {
							router.back();
						}
					}}
					onKeyPress={() => {
						if (isHomePage || display) {
							if (display) {
								setDisplay(false);
								setActive(PANEL_TYPE_SEARCH.SUGGESTION);
								setIsFocus(false);
							} else {
								setIsOpenDashBar(!isOpenDashBar);
							}
						} else {
							setDisplay(false);
							setActive(PANEL_TYPE_SEARCH.SUGGESTION);
							setIsFocus(false);
							router.back();
						}
					}}
				>
					<Icon
						name={!isHomePage || display ? IconEnum.ArrowLeft : IconEnum.List}
						className='mt-[2px] ml-[-4px]'
						size={24}
						color='#999'
					/>
				</div>
				<input
					className='w-full appearance-none text-ellipsis text-base font-normal not-italic leading-normal tracking-[0.04px] text-[#666666] placeholder:text-[#9F9F9F] focus:outline-none'
					id='search'
					name='search'
					autoComplete='off'
					placeholder={placeholder}
					defaultValue={textSearch}
					onFocus={() => handleOnFocusSearch()}
					onChange={(event) => onSearch(event)}
					onKeyPress={(event) => handleSearching(event)}
				/>
				{showName ? (
					<div className='relative flex w-[150px] flex-nowrap items-center justify-start truncate text-12 rounded-md border border-blue-500 bg-blue-500 p-2 text-white'>
						<p className='truncate'>{showName}</p>
						<Icon
							name={IconEnum.XCircle}
							color='#fff'
							size={20}
							onClick={() => {
								setShowName('');
								document.getElementById('search')?.focus();
							}}
						/>
					</div>
				) : (
					<></>
				)}
				<div
					className={classNames([
						'flex items-center justify-end px-2',
						isHomePage ? 'min-w-[120px]' : 'min-w-[80px]',
					])}
				>
					<div
						className='relative flex h-7 place-items-center'
						tabIndex={0}
						role='button'
						onClick={() => {
							if (active) {
								setActive(PANEL_TYPE_SEARCH.SUGGESTION);
								setTextSearch('');
								setDisplay(false);
								setIsFocus(false);
							}
						}}
						onKeyPress={() => {
							if (active) {
								setActive(PANEL_TYPE_SEARCH.SUGGESTION);
								setTextSearch('');
								setDisplay(false);
								setIsFocus(false);
							}
						}}
					>
						<Icon
							name={active ? IconEnum.MagnifyingGlass : IconEnum.XCircle}
							className='-ml-2 mt-[2px] items-center'
							size={24}
							color='#999'
						/>
					</div>
					{/* {isHomePage && ( */}
					<>
						{/* <div className='relative ml-2 flex h-7 place-items-center'>
								<div className='bg-[url("/static/svg/mic.svg")] bg-cover w-5 h-5 items-center'></div>
							</div>
							<div className='relative ml-2 flex h-7 place-items-center'>
								<div className='bg-[url("/static/svg/camera-outline.svg")] bg-cover w-5 h-5 items-center'></div>
							</div> */}

						<div
							role={'button'}
							tabIndex={0}
							onKeyDown={() => {
								return;
							}}
							onClick={() => router.push('/gio-hang')}
							className='relative ml-2 flex h-7'
						>
							<Icon
								name={IconEnum.ShoppingCartSimple}
								size={24}
								className='-mr-2 mt-[2px]'
								color='#999'
							/>
							{totalItemCart.total > 0 && (
								<div className='absolute top-2 right-[-4px] translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[#EA001B] px-[4px] py-0 text-[10px] font-bold not-italic tracking-[0.96px] text-white'>
									{totalItemCart.total > 99 ? (
										<>
											99
											<sup>+</sup>
										</>
									) : (
										totalItemCart.total
									)}
								</div>
							)}
						</div>
					</>
					{/* )} */}
				</div>
			</div>
			<div
				className={classNames([
					display ? 'opacity-100 z-50' : 'opacity-0 hidden',
					display && isHomePage ? 'h-[calc(100vh-110px)]' : 'h-screen',
					'transition-all duration-500',
					'fixed bg-white rounded mb-1 mt-2 w-screen px-1 overflow-y-auto overscroll-y-contain left-[0px]',
				])}
			>
				<div className='w-full text-black'>{renderSearchPane()}</div>
			</div>
		</div>
	);
};

export default SearchMobile;
