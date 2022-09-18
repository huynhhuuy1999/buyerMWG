import classNames from 'classnames';
import { Icon, ImageCustom } from 'components';
import { useAppDispatch, useAppSelector } from 'hooks';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import {
	deletedHistorySearchRequest,
	listHistorySelector,
	listTrendSelector,
	trackingSearchKeywordRequest,
	trackingSearchResultRequest,
	trackingSearchSuggestionRequest,
} from '@/store/reducers/trackingSlice';
interface ISearchRequestProps {
	textSearch?: string;
	onClick: (text: string, index: number) => void;
}
interface ISearchSuggestProps {
	recentList: string[];
	listTrending: string[];
	onClick: (text: string) => void;
	onRemove: (text: string) => void;
}
const SearchRequest = dynamic(
	() => import('@/modules/search/searchRequest'),
) as React.FC<ISearchRequestProps>;
const SearchSuggest = dynamic(() => import('@/modules/search/searchSuggest'), {
	ssr: false,
}) as React.FC<ISearchSuggestProps>;

const Search: React.FC = () => {
	const router = useRouter();
	const dispatch = useAppDispatch();
	const searchRef = useRef<HTMLInputElement>(null);
	const clickRef = useRef<HTMLDivElement>(null);

	const [textSearch, setTextSearch] = useState<string>('');
	const [text, setText] = useState<string>('');
	const [active, setActive] = useState<boolean>(false);
	const [display, setDisplay] = useState(false);
	// const [isClicker, setIsClicker] = useState(false);
	// const [isFocus, setIsFocus] = useState<boolean>(false);
	const listHistory = useAppSelector(listHistorySelector);
	const listTrend = useAppSelector(listTrendSelector);

	useEffect(() => {
		const keySearch = router.query.k;
		if (keySearch) {
			setTextSearch(keySearch.toString());
			setActive(true);
		}
	}, [router.query.k]);

	useEffect(() => {
		const onClickOutSide = (event: any) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target) &&
				clickRef.current &&
				!clickRef.current.contains(event.target) &&
				display
			) {
				setDisplay(false);
			}
		};
		document.addEventListener('click', onClickOutSide);
		return () => {
			document.removeEventListener('click', onClickOutSide);
		};
	}, [searchRef, display]);

	const handleInputSearch = (event: any) => {
		setDisplay(true);
		const { value } = event.target;
		setActive(!!value);
		setTextSearch(value);
		if (!value) {
			setText(value);
		}
	};

	useEffect(() => {
		let timeoutSearch = setTimeout(() => {
			if (textSearch) {
				setText(textSearch);
			} else {
				setActive(false);
			}
		}, 300);
		return () => {
			clearTimeout(timeoutSearch);
		};
	});

	const renderSearchPane = () => {
		switch (active) {
			case true:
				return <SearchRequest textSearch={text} onClick={onClickRequest} />;
			case false:
				return (
					<SearchSuggest
						recentList={listHistory}
						listTrending={listTrend}
						onClick={onClickSuggest}
						onRemove={onRemove}
					/>
				);
		}
	};

	const handleSearching = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key == 'Enter' && textSearch) {
			const payload = { keyword: textSearch };
			dispatch(trackingSearchKeywordRequest(payload));
			setDisplay(false);
			searchRef.current?.blur();
			router.push('/tim-kiem?k=' + decodeURIComponent(textSearch).replaceAll(' ', '+'), undefined, {
				shallow: true,
			});
		}
	};

	const onClickSuggest = (text: string) => {
		if (text) {
			const payload = { keyword: text };
			dispatch(trackingSearchResultRequest(payload));
			router.push('/tim-kiem?k=' + decodeURIComponent(text).replaceAll(' ', '+'), undefined, {
				shallow: true,
			});
		}
	};

	const onClickRequest = (text: string, index: number) => {
		if (text) {
			const payload = { keyword: textSearch, indexClick: index, keywordClick: text };
			dispatch(trackingSearchSuggestionRequest(payload));
			router.push('/tim-kiem?k=' + decodeURIComponent(text).replaceAll(' ', '+'), undefined, {
				shallow: true,
			});
		}
	};

	const onRemove = (text: string) => {
		if (text && listHistory.length) {
			const payload = {
				keyword: text,
			};
			dispatch(deletedHistorySearchRequest(payload));
		}
	};

	return (
		<>
			<span className={`${active ? 'flex' : 'hidden'} mx-1 cursor-pointer`}>
				<ImageCustom
					width={24}
					height={24}
					className={`ml-2 h-5 w-auto`}
					src='/static/svg/search-9f9f9f.svg'
				/>
			</span>
			<input
				className='ml-2 grow appearance-none text-ellipsis text-base font-normal not-italic leading-normal tracking-[0.04px] text-[#666666] placeholder:text-[#9F9F9F] focus:outline-none'
				placeholder='Bạn tìm mua gì hôm nay ở VuiVui?'
				onFocus={() => {
					setDisplay(true);
				}}
				name='search'
				id='search'
				ref={searchRef}
				autoComplete='off'
				value={textSearch}
				onChange={(event) => handleInputSearch(event)}
				onKeyPress={(event) => handleSearching(event)}
			/>
			<span className='relative right-3 flex h-auto w-auto cursor-pointer'>
				<Icon
					type={active ? 'icon-close-circle' : 'icon-search'}
					size={24}
					onClick={() => {
						if (active) {
							setTextSearch('');
							setDisplay(false);
							setActive(false);
						}
					}}
					onKeyPress={() => {
						if (active) {
							setTextSearch('');
							setDisplay(false);
							setActive(false);
						}
					}}
					variant='gray'
				/>
			</span>
			<div
				className={classNames([
					display ? 'opacity-100 z-50 max-h-[75vh]' : 'opacity-0 hidden',
					'transition-all duration-500',
					'absolute bg-white rounded my-4 w-fill w-moz top-[34px] px-3 shadow-xl overflow-y-auto custom_scrollbar overscroll-y-contain',
				])}
				ref={clickRef}
			>
				<div className='text-black' role='menu' tabIndex={0}>
					{renderSearchPane()}
				</div>
			</div>
		</>
	);
};

export default Search;
