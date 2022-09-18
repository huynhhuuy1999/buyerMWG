import classNames from 'classnames';
import { CategoryProductCard, ImageCustom } from 'components';
import { useAppDispatch, useAppSelector, useIsomorphicLayoutEffect } from 'hooks';
import { AccountInfo, CategoryViewModel, ShowCatalog } from 'models';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { appActions, selectedCatalogSector } from 'store/reducers/appSlice';
import { catalogListSelector, catalogSuggestionSelector } from 'store/reducers/categorySlide';
import { Icon, IconEnum } from 'vuivui-icons';

import { cartSelector } from '@/store/reducers/cartSlice';

import CatalogSearch from './catalog-search';
interface ICatalogProps {
	userAuth?: AccountInfo | null;
	onOpen: () => void;
	onClose: () => void;
	isOpenCatalog: ShowCatalog;
	height?: number;
}

const CatalogCard: React.FC<{ item: CategoryViewModel; onClose: () => void; last: boolean }> = ({
	item,
	onClose,
	last,
}) => {
	const dispatch = useAppDispatch();
	const router = useRouter();
	const handleClose = () => {
		dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
	};
	return (
		<Fragment>
			<div className='flex justify-between gap-2 py-3 px-2 font-sfpro_bold text-sm font-semibold text-black'>
				<div>{item?.name}</div>
				<div
					className='float-right flex cursor-pointer pr-1 font-sfpro_semiBold text-[#126BFB]'
					onClick={() => {
						dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
						router.push(`/${item.urlSlug}`);
					}}
					onKeyPress={() => {
						dispatch(appActions.setIsShowCatalog(ShowCatalog.hidden));
						router.push(`/${item.urlSlug}`);
					}}
					tabIndex={0}
					role='button'
				>
					<span className='whitespace-nowrap'>Xem tất cả &gt;</span>
				</div>
			</div>
			<div
				className={classNames(
					'grid grid-cols-3 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 lg:grid-cols-5',
					last || item?.id === 0 ? '' : 'border-b border-b-gray-300 ',
				)}
			>
				{item?.children &&
					item.children
						.slice(0, item.urlSlug.indexOf('danh-muc-goi-y') !== -1 ? item.children.length : 6)
						.map((data, indexChil) => (
							<CategoryProductCard
								key={indexChil}
								image={data.image}
								className={classNames(['mr-1 cursor-pointer py-1 w-auto'])}
								classBg='bg-white'
								width={'auto'}
								description={data.name}
								path={`/${data.urlSlug}`}
								onClick={() => handleClose()}
								type={'CATEGORY_PRODUCT_SMALL'}
							/>
						))}
			</div>
		</Fragment>
	);
};

const CatalogMobile: React.FC<ICatalogProps> = ({ onOpen, onClose, height }) => {
	const catalog = useAppSelector(catalogListSelector);
	const catalogSuggestion = useAppSelector(catalogSuggestionSelector);
	const router = useRouter();
	const dispatch = useAppDispatch();
	const [catalogList, setCatalogList] = useState<CategoryViewModel[]>([]);
	const [selectedItem, setSelectedItem] = useState<CategoryViewModel[]>(catalogList?.[0]?.children);
	const [isSelectedNav, setSelectedNav] = useState<number>(catalogList?.[0]?.id);
	const [selectedIndex, setSelectedIndex] = useState<number>(0);
	const [textSearch, setTextSearch] = useState<string>('');
	const [textValue, setTextValue] = useState<string>('');
	const [isSearch, setIsSearch] = useState<boolean>(false);
	const [catalogSearch, setCatalogSearch] = useState<(CategoryViewModel | undefined)[]>([]);
	const selectedSector = useAppSelector(selectedCatalogSector);

	const listCatalogElement = useRef<HTMLDivElement>(null);
	const catalogRef = useRef<HTMLDivElement>(null);
	const totalItemCart = useAppSelector(cartSelector);
	const searchRef = useRef<HTMLInputElement>(null);
	const paneRef = useRef<HTMLDivElement>(null);

	const handleSelectNavBar = (item: CategoryViewModel) => {
		const selectTimeOut = setTimeout(() => {
			if (item.id !== isSelectedNav) {
				setSelectedNav(item.id);
				setSelectedItem(item.children);
			}
		}, 200);
		return () => clearTimeout(selectTimeOut);
	};

	const handlerOnClose = () => {
		const closeTimeOut = setTimeout(() => {
			setTextSearch('');
			setTextValue('');
			if (isSearch) {
				setIsSearch(false);
				if (textSearch) {
					onClose();
				}
			} else {
				onClose();
			}
		}, 300);
		return () => clearTimeout(closeTimeOut);
	};

	const handlerBack = () => {
		const closeTimeOut = setTimeout(() => {
			setTextSearch('');
			setTextValue('');
			if (isSearch) {
				setIsSearch(false);
			} else {
				onClose();
			}
		}, 200);
		return () => clearTimeout(closeTimeOut);
	};

	useMemo(() => {
		if (catalogSuggestion) {
			setCatalogList([catalogSuggestion, ...(catalog || [])]);
		} else {
			setCatalogList(catalog);
		}
	}, [catalog, catalogSuggestion]);

	useEffect(() => {
		const timeOut = setTimeout(() => {
			const catalogTree = catalogList
				.map((item) => {
					const child = item.children
						.map((itemChild: CategoryViewModel) => {
							const children = itemChild.children.filter(
								(itemChildren: CategoryViewModel) =>
									itemChildren && itemChildren.name.indexOf(textSearch) !== -1,
							);
							if (
								(itemChild && itemChild.name.indexOf(textSearch) !== -1) ||
								(children && children.length > 0)
							) {
								return { ...itemChild, children: [...children] || [] };
							}
						})
						.filter((x) => x);
					if (item.name.indexOf(textSearch) !== -1 || (child && child.length > 0)) {
						return { ...item, children: [...child] || [] };
					}
				})
				.filter((item) => item);
			setTextValue(textSearch);
			setCatalogSearch(catalogTree);
		}, 300);
		return () => clearTimeout(timeOut);
	}, [catalogList, textSearch]);

	const urlSlug = router.query.slug_extend ? router.query.slug_extend : undefined;

	useEffect(() => {
		dispatch(appActions.getSelectedCatalog({ catalog: catalog, urlSlug: urlSlug as string }));
	}, [catalog, dispatch, urlSlug]);

	useEffect(() => {
		if (
			selectedSector &&
			selectedSector.length &&
			urlSlug &&
			selectedSector?.[selectedSector?.length - 120]?.urlSlug === urlSlug
		) {
			setSelectedItem(selectedSector?.[0]?.children);
			setSelectedNav(selectedSector?.[0]?.id);
		} else {
			setSelectedItem(catalogList?.[0]?.children);
			setSelectedNav(catalogList?.[0]?.id);
		}
	}, [catalogList, selectedSector, urlSlug]);

	useIsomorphicLayoutEffect(() => {
		if (listCatalogElement.current !== null) {
			if (selectedIndex > 5) {
				listCatalogElement.current?.scroll({ top: height, behavior: 'smooth' });
			}
			if (selectedIndex <= 5) {
				listCatalogElement.current?.scroll({ top: 0, behavior: 'smooth' });
			}
		}
	}, [listCatalogElement.current, selectedIndex]);

	useEffect(() => {
		const timeOut = setTimeout(() => {
			if (catalogRef.current) {
				catalogRef.current.scrollTo({ top: 0, behavior: 'smooth' });
			}
		}, 100);
		return () => clearTimeout(timeOut);
	}, [selectedItem]);

	useEffect(() => {
		const handleCloseSearch = (event: any) => {
			if (paneRef.current && !paneRef.current.contains(event?.target) && isSearch) {
				setIsSearch(false);
			}
		};
		document.addEventListener('click', handleCloseSearch);
		return () => document.removeEventListener('click', handleCloseSearch);
	}, []);
	return (
		<div className='z-[51] flex flex-col'>
			<div className='fixed top-0 z-[51] flex w-screen border-none bg-[#F05A94] p-1 py-2'>
				<div className='z-[51] flex h-[48px] w-full items-center space-x-2 rounded-md bg-white px-2'>
					<Icon
						name={IconEnum.ArrowLeft}
						onKeyPress={handlerBack}
						onClick={handlerBack}
						color='#999'
						size={24}
						className='mx-1 mt-[2px]'
					/>
					<input
						placeholder='Danh mục sản phẩm'
						ref={searchRef}
						value={textSearch}
						onFocus={() => setIsSearch(true)}
						// onBlur={handlerBack}
						onChange={(event) => setTextSearch(event?.target?.value)}
						className='h-[48px] w-full appearance-none text-ellipsis text-base font-normal not-italic leading-normal tracking-[0.04px] text-[#666666] placeholder:text-[#9F9F9F] focus:outline-none'
					/>
					<div className='relative ml-2 flex h-8'>
						<Icon
							name={textValue ? IconEnum.XCircle : IconEnum.MagnifyingGlass}
							onKeyPress={() => {
								if (textValue) {
									setTextSearch('');
									setTextValue('');
								} else {
									setIsSearch(true);
									searchRef.current?.focus();
								}
							}}
							onClick={() => {
								if (textValue) {
									setTextSearch('');
									setTextValue('');
								} else {
									setIsSearch(true);
									searchRef.current?.focus();
								}
							}}
							color='#999'
							size={24}
							className='mt-1 ml-[-8px]'
						/>
						<Link href={'/gio-hang'}>
							<div className='relative mx-auto ml-4 mr-1'>
								<Icon
									name={IconEnum.ShoppingCartSimple}
									color='#999'
									size={24}
									className='mt-1 ml-[-8px]'
								/>
								{totalItemCart.total > 0 && (
									<div className='absolute top-[10px] right-1 translate-x-1/2 -translate-y-1/2 rounded-[20px] bg-[#EA001B] px-[4px] py-0 text-[10px] font-bold not-italic tracking-[0.96px] text-white'>
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
						</Link>
					</div>
					{/* <div className='relative ml-2 flex h-8'>
						<ImageCustom src='/static/svg/mic.svg' width={24} height={24} />
					</div>
					<div className='relative ml-2 flex h-8'>
						<ImageCustom src='/static/svg/camera-outline.svg' width={24} height={24} />
					</div> */}
				</div>
			</div>
			{isSearch ? (
				<div className='h-screen' ref={paneRef}>
					<div
						className={classNames('col-span-2 py-2 mt-[-6px] overflow-y-auto bg-[#FFFFFF]')}
						style={{ height: `${(height || 0) - 116}px` }}
					>
						{(catalogSearch || []).length > 0 && textValue ? (
							(catalogSearch || []).map((item, index) => (
								<CatalogSearch
									catalogSearch={item}
									textSearch={textValue}
									key={index}
									onClose={handlerOnClose}
								/>
							))
						) : (
							<div className='flex items-center justify-center pt-10'>Không có kết quả</div>
						)}
					</div>
				</div>
			) : (
				<div className='z-[100] mt-[-6px] grid grid-cols-7 border-none bg-[#FFFFFF] lg:space-x-4'>
					<div
						ref={listCatalogElement}
						className={classNames('col-span-2 overflow-y-auto bg-[#FFFFFF] hide-scrollbar')}
						style={{ height: `${(height || 0) - 126}px` }}
					>
						<div className=''>
							{catalogList?.length &&
								catalogList?.map((item: CategoryViewModel, index: number) => (
									<div key={index} className={'flex items-center pr-1'}>
										<div
											className={classNames([
												item.id === isSelectedNav
													? 'text-FFFFFF bg-[#F05A94] mr-[-4px]'
													: 'bg-[#ededed] mr-[12px]',
												index === catalog?.length ? '' : 'border-b border-gray-300',
												'min-h-[76px] transform flex items-center p-2 justify-center text-center w-full cursor-pointer text-13',
											])}
											role='menu'
											tabIndex={index}
											onClick={() => {
												handleSelectNavBar(item);
												setSelectedIndex(index);
											}}
											onKeyPress={() => handleSelectNavBar(item)}
										>
											{item.name}
										</div>
										{item.id === isSelectedNav && (
											<div className='ml-[-8px] flex justify-start'>
												<ImageCustom
													priority
													width={24}
													height={24}
													src='/static/svg/arrow_right_7953D2.svg'
													className='w-6'
													alt=''
												/>
											</div>
										)}
									</div>
								))}
						</div>
					</div>
					<div
						ref={catalogRef}
						className={classNames('col-span-5 overflow-y-auto bg-[#FFFFFF]')}
						style={{ height: `${(height || 0) - 127}px` }}
					>
						<div className='w-full pr-4'>
							{selectedItem &&
								selectedItem.map((item, index) => (
									<CatalogCard
										last={index === selectedItem?.length - 1}
										item={item}
										key={index}
										onClose={handlerOnClose}
									/>
								))}
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default React.memo(CatalogMobile);
