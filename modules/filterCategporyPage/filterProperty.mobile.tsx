import classNames from 'classnames';
import { Drawer, ImageCustom, PopupSort, Spin, ToggleBtn } from 'components';
import { PARAM_KEY_SEARCH, PROPERTY, TYPE_SEARCH } from 'enums';
import { useAppSelector, useIsomorphicLayoutEffect, useProductSearch } from 'hooks';
import { IResponseSearchAggregation, ParamSearchProduct } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import {
	IFilterBoxMobile,
	IFilterColorMobile,
	// IFilterPlaceMobile,
	IFilterPriceMobile,
	IFilterRatingMobile,
} from '@/components/FilterCategories';
import { IFilterBrandMobile } from '@/components/FilterSearch';
import { addressTreeSelector } from '@/store/reducers/address';

import { IItemFilter } from './filterProperty';
import { getListFilterInitParam } from './logic';

interface IFilterPropertyMobile {
	listPropertyFilter?: IResponseSearchAggregation;
	handleSearch?: any;
	keyword?: string;
	query?: any;
}

const FilterBrandMobile = dynamic(
	() => import('@/components/FilterCategories/FilterBrandMobile'),
) as React.FC<IFilterBrandMobile>;
const FilterBoxMobile = dynamic(
	() => import('@/components/FilterCategories/FilterBoxMobile'),
) as React.FC<IFilterBoxMobile>;
const FilterColorMobile = dynamic(
	() => import('@/components/FilterCategories/FilterColorMobile'),
) as React.FC<IFilterColorMobile>;
const FilterPriceMobile = dynamic(
	() => import('@/components/FilterCategories/FilterPriceMobile'),
) as React.FC<IFilterPriceMobile>;
// const FilterPlaceMobile = dynamic(
// 	() => import('@/components/FilterCategories/FilterPlaceMobile'),
// ) as React.FC<IFilterPlaceMobile>;
const FilterRatingMobile = dynamic(
	() => import('@/components/FilterCategories/FilterRatingMobile'),
) as React.FC<IFilterRatingMobile>;

const arrayKeyAccept = [
	PARAM_KEY_SEARCH.BRANDS,
	PARAM_KEY_SEARCH.CATEGORY,
	PARAM_KEY_SEARCH.DISTRICT,
	PARAM_KEY_SEARCH.FILTER,
	PARAM_KEY_SEARCH.PROVINCE,
	PARAM_KEY_SEARCH.PRICE,
	PARAM_KEY_SEARCH.SORT,
];

export const FilterPropertyMobile: React.FC<IFilterPropertyMobile> = ({
	listPropertyFilter,
	keyword,
	handleSearch,
	query,
}) => {
	const [listFilter, setListFilter] = useState<ParamSearchProduct>({});
	const route = useRouter();
	const [listFilterSelected, setListFilterSelected] = useState<IItemFilter[]>([]);
	const [isShow, setIsShow] = useState<boolean>(false);
	const filterElement = useRef<HTMLDivElement>(null);
	const filterScrollElement = useRef<any>();
	const [isScrollDown, setIsScrollDown] = useState<boolean>(false);
	const [isCheckVip, setIsCheckVip] = useState<boolean>(false);
	const [checkHeight, setCheckHeight] = useState<number>(0);

	const { data: countX, isValidating } = useProductSearch(
		listPropertyFilter?.categories?.length ? '/product/searchresultcount' : '',
		listPropertyFilter?.categories?.length
			? {
					keyword,
					brandIds: (listFilter || [])?.brandIds?.map((item: any) => item),
					isValid: true,
					provinceId: listFilter?.provinceId,
					districtIds: (listFilter || [])?.districtIds?.map((item: any) => item),
					filters: (listFilter || [])?.filters?.map((item: any) => item),
					categoryId: listPropertyFilter?.categories.map((cate) => cate.id),
					price: (listFilter || [])?.price?.map((item: any) => item),
					ratingTypes: (listFilter || [])?.ratingTypes?.map((item: any) => item),
			  }
			: {},
	);

	const arrayProperty: any = listPropertyFilter
		? // [...Object.keys(listPropertyFilter), PROPERTY.PROVINCE, PROPERTY.RATING]
		  [...Object.keys(listPropertyFilter), PROPERTY.RATING]
		: [];

	const provinceTree = useAppSelector(addressTreeSelector);

	let prevPosition: number = 0;
	useIsomorphicLayoutEffect(() => {
		filterScrollElement.current = window.document.getElementById('filter-mobile');
		// leftCatalog.current = window.document.getElementById('left-catalog');
	}, []);

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			if (filterScrollElement) {
				const position: number = window.scrollY;
				if (position <= 60) {
					filterScrollElement.current?.classList.add('showRisingDown');
					setIsScrollDown(false);
				} else if (position > prevPosition && position > 60) {
					filterScrollElement.current?.classList.remove('showRisingDown');
					setIsScrollDown(true);
				} else {
					filterScrollElement.current?.classList.add('showRisingDown');
					setIsScrollDown(false);
				}
				prevPosition = position;
			}
		};

		window.addEventListener('scroll', handleScrollWindow);

		return () => window.removeEventListener('scroll', handleScrollWindow);
	}, [filterScrollElement.current]);

	useEffect(() => {
		if (query && listPropertyFilter && provinceTree) {
			const data = getListFilterInitParam(query, listPropertyFilter, provinceTree);
			setListFilterSelected(data);
			setFilterListWithDefaultParam(query);
		}
	}, [query, listPropertyFilter, provinceTree]);

	useEffect(() => {
		setCheckHeight(window.innerHeight);
	}, []);

	const setFilterListWithDefaultParam = (query: any) => {
		let value = {};
		let arrKeyParam = Object.keys(query);

		arrKeyParam.map((item: any) => {
			if (arrayKeyAccept.includes(item)) {
				if (Array.isArray(query[item])) {
					value = {
						...value,
						[item]: query[item],
					};
				} else {
					value = {
						...value,
						[item]: [query[item]],
					};
				}
			}
		});

		setListFilter(value);
	};

	const handleSelectItem = (value: IItemFilter, typeSearch: number) => {
		let newListItemCard = [...listFilterSelected];
		let index = listFilterSelected?.findIndex((item) => item.id === value.id);

		if (typeSearch === TYPE_SEARCH.PRICE) {
			let listWithoutPrice = newListItemCard.filter((item) => item.type !== TYPE_SEARCH.PRICE);
			listWithoutPrice.push(value);
			newListItemCard = listWithoutPrice;
		} else {
			if (index !== -1) {
				newListItemCard.splice(index, 1);
			} else {
				newListItemCard.push(value);
			}
		}
		setListFilterSelected(newListItemCard);
		transformParamSearch(newListItemCard, typeSearch);
	};

	const transformParamSearch = (value: Array<IItemFilter>, typeSearch: number) => {
		switch (typeSearch) {
			case TYPE_SEARCH.BRAND:
				let newListBrand = value?.filter((item) => item.type === TYPE_SEARCH.BRAND);
				setListFilter({
					...listFilter,
					brandIds: newListBrand?.map((item) => `${item.id}`),
				});
				return;
			case TYPE_SEARCH.ORTHER:
				let newListOrther = value?.filter((item) => item.type === TYPE_SEARCH.ORTHER);
				setListFilter({
					...listFilter,
					filters: newListOrther?.map((item) => `${item.id}`),
				});
				return;
			case TYPE_SEARCH.DISTRICT:
				let newListDistrict: any = value?.filter((item) => item.type === TYPE_SEARCH.DISTRICT);
				setListFilter({
					...listFilter,
					districtIds: newListDistrict?.map((item: any) => item.id),
				});
				return;
			case TYPE_SEARCH.LIST:
				let newListCategory: any = value?.filter((item) => item.type === TYPE_SEARCH.LIST);
				setListFilter({
					...listFilter,
					categoryId: newListCategory?.map((item: any) => item.id),
				});
				return;
			case TYPE_SEARCH.PRICE:
				let newListPrice: any = value?.filter((item) => item.type === TYPE_SEARCH.PRICE);

				setListFilter({
					...listFilter,
					price: newListPrice.length ? newListPrice[0].id.split('-') : [],
				});
				return;
			case TYPE_SEARCH.RATING:
				let newListRating: any = value?.filter((item) => item.type === TYPE_SEARCH.RATING);
				setListFilter({
					...listFilter,
					ratingTypes: newListRating?.map((item: any) => item.id),
				});
				return;
			default:
				return;
		}
	};

	const handleSearchData = () => {
		handleSearch(listFilter);
		setIsShow(false);
	};

	const renderProperty = (key: string, index: number) => {
		switch (key) {
			case PROPERTY.BRAND:
				return (
					<FilterBrandMobile
						listBrand={listPropertyFilter?.brands}
						key={index}
						className='mt-10px'
						onSelect={(value) =>
							handleSelectItem({ ...value, type: TYPE_SEARCH.BRAND }, TYPE_SEARCH.BRAND)
						}
						defaultSelected={listFilterSelected}
					/>
				);
			case PROPERTY.PROPERTY:
				return listPropertyFilter?.properties?.map((item, indexProperty) => {
					return item.name === PROPERTY.COLOR ? (
						<FilterColorMobile
							listColor={item}
							key={`${indexProperty}a`}
							title={item.name}
							onSelect={(value) =>
								handleSelectItem({ ...value, type: TYPE_SEARCH.ORTHER }, TYPE_SEARCH.ORTHER)
							}
							defaultSelected={listFilterSelected}
						/>
					) : (
						<FilterBoxMobile
							listData={item}
							key={`${indexProperty}b`}
							title={item.name}
							onSelect={(value) =>
								handleSelectItem({ ...value, type: TYPE_SEARCH.ORTHER }, TYPE_SEARCH.ORTHER)
							}
							defaultSelected={listFilterSelected}
						/>
					);
				});
			case PROPERTY.MAX_PRICE:
				return (
					<FilterPriceMobile
						priceStep={listPropertyFilter?.priceStep}
						title='Khoảng giá'
						defaultSelected={listFilterSelected}
						maxPrice={listPropertyFilter?.maxPrice}
						onSelect={(value) => {
							handleSelectItem({ ...value, type: TYPE_SEARCH.PRICE }, TYPE_SEARCH.PRICE);
						}}
						key={index}
					/>
				);
			case PROPERTY.RATING:
				return (
					<FilterRatingMobile
						key={index}
						title='Đánh giá'
						onSelect={(value) =>
							handleSelectItem({ ...value, type: TYPE_SEARCH.RATING }, TYPE_SEARCH.RATING)
						}
						defaultSelected={listFilterSelected}
					/>
				);
			// case PROPERTY.PROVINCE:
			// 	return (
			// 		<FilterPlaceMobile
			// 			title='Nơi bán'
			// 			listPlace={provinceTree}
			// 			getProvince={(value) => {
			// 				let cardFilter = listFilterSelected.filter(
			// 					(item) => item.type !== TYPE_SEARCH.DISTRICT && item.type !== TYPE_SEARCH.PROVINCE,
			// 				);
			// 				if (value.id !== 0) {
			// 					setListFilter({ ...listFilter, provinceId: value.id });
			// 					cardFilter.push({
			// 						id: value.id,
			// 						label: value.label,
			// 						type: TYPE_SEARCH.PROVINCE,
			// 					});
			// 					setListFilterSelected(cardFilter);
			// 					delete listFilter.districtIds;
			// 				} else {
			// 					setListFilterSelected(cardFilter);
			// 					let newListFilter = { ...listFilter };
			// 					delete newListFilter.districtIds;
			// 					delete newListFilter.provinceId;
			// 					setListFilter(newListFilter);
			// 				}
			// 			}}
			// 			onSelect={(value) => {
			// 				handleSelectItem({ ...value, type: TYPE_SEARCH.DISTRICT }, TYPE_SEARCH.DISTRICT);
			// 			}}
			// 			defaultSelected={{
			// 				listDefault: listFilterSelected.filter((item) => item.type === TYPE_SEARCH.DISTRICT),
			// 				province: Number(listFilter?.provinceId || 0),
			// 			}}
			// 			key={index}
			// 		/>
			// 	);
			default:
				break;
		}
	};

	const handleClearFilter = () => {
		setListFilterSelected([]);
		handleSearch({});
	};

	const handleRemoveItemFilter = (item: IItemFilter, typeSearch: number) => {
		let listDistrict = listFilterSelected.filter(
			(itemListFilter) => itemListFilter.type === TYPE_SEARCH.DISTRICT,
		);
		const listFilteredNew = listFilterSelected.filter((itemFilter) =>
			typeSearch === TYPE_SEARCH.PROVINCE ||
			(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
				? itemFilter.type !== TYPE_SEARCH.PROVINCE && itemFilter.type !== TYPE_SEARCH.DISTRICT
				: itemFilter.id !== item.id,
		);

		setListFilterSelected(listFilteredNew);

		if (
			typeSearch === TYPE_SEARCH.PROVINCE ||
			(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
		) {
			let copyListFilter = { ...listFilter };
			delete copyListFilter.districtIds;
			delete copyListFilter.provinceId;
			setListFilter(copyListFilter);
		} else {
			transformParamSearch(listFilteredNew, typeSearch);
		}
	};

	return (
		//
		<div id='filter-mobile' className={'pb-8'}>
			<div
				ref={filterElement}
				className={classNames([
					' fixed w-full z-10 border-b bg-white mt-[64px] ',
					isScrollDown ? 'hidden' : 'block',
				])}
			>
				<div className=' flex justify-start'>
					<div className='w-[50%] border-r '>
						<div
							className='flex items-center py-3 pl-10px'
							onClick={() => setIsShow(true)}
							role='button'
							onKeyPress={() => setIsShow(true)}
							tabIndex={0}
						>
							<ImageCustom src={'/static/svg/iconFilter.svg'} width={24} height={24} />
							<div className='relative'>
								<span className='text-14'>Bộ lọc</span>
								<span className='absolute top-[-7px] right-[-12px] text-center leading-4 w-4 h-4 text-white rounded-full bg-[#fc5506] text-xs'>
									{listFilterSelected.length}
								</span>
							</div>
						</div>
					</div>
					<div className='py-2 pr-10px'>
						<PopupSort
							className={'absolute left-[-100%] top-10'}
							onChange={(value) => {
								if (value) {
									handleSearch({ ...listFilter, sortType: value });
								} else {
									delete listFilter.sortType;
									handleSearch({ ...listFilter });
								}
							}}
							defaultValue={Number(route?.query?.sortType ?? false)}
						/>
					</div>
				</div>
			</div>

			<Drawer isOpen={isShow} setIsOpen={(value) => setIsShow(value)}>
				<div className='flex h-45px items-center justify-between bg-[#F1F1F1] px-10px text-18'>
					<span>Bộ lọc</span>
					<ImageCustom
						src={'/static/svg/Close.svg'}
						width={24}
						height={24}
						onClick={() => setIsShow(false)}
					/>
				</div>
				<div className='h-[6px] w-full bg-[#DADDE1]' />
				<div className='flex items-center justify-between p-4'>
					<div className='flex items-center'>
						<ImageCustom src={'/static/svg/logoVip.svg'} width={24} height={24} />
						<span className='ml-4'>Chính sách đổi trả VIP</span>
					</div>

					<ToggleBtn isChecked={isCheckVip} setChecked={(value) => setIsCheckVip(value)} />
				</div>
				<div className='h-[6px] w-full bg-[#DADDE1]' />
				<div
					className={classNames([
						'overflow-y-auto px-[10px] overflow-x-hidden transition-all',
						checkHeight > 670 ? 'max-h-[70vh]' : 'max-h-[60vh]',
						listFilterSelected.length ? 'mb-20' : 'mb-0',
					])}
				>
					{arrayProperty.map((property: any, index: number) => {
						return renderProperty(property, index);
					})}
				</div>
				{listFilterSelected.length && (
					<div className={'fixed bottom-12 flex w-full overflow-x-auto bg-white px-[10px] py-3'}>
						{listFilterSelected.map((itemFilter, index) => {
							let checkHasProvince = listFilterSelected.some(
								(itemFilter) => itemFilter.type === TYPE_SEARCH.PROVINCE,
							);
							let checkHasDistrict = listFilterSelected.some(
								(itemFilter) => itemFilter.type === TYPE_SEARCH.DISTRICT,
							);
							if (itemFilter.type === TYPE_SEARCH.PROVINCE) {
								if (checkHasDistrict && checkHasProvince) return;
							}
							return (
								<div
									className='mr-6px flex min-w-max items-center rounded-[20px] bg-[#FEF5F9] px-2 py-1 text-16 text-333333'
									key={index}
									role='button'
									onKeyPress={() => {}}
									tabIndex={0}
								>
									<span className='mr-2px '>{itemFilter.label}</span>

									<ImageCustom
										src='/static/svg/Close.svg'
										width={18}
										height={18}
										priority
										onClick={(e) => {
											e.stopPropagation();
											handleRemoveItemFilter(itemFilter, itemFilter.type || 0);
										}}
									/>
								</div>
							);
						})}
					</div>
				)}
				<div className='fixed bottom-0 left-0 flex h-12 w-full '>
					<button
						className='flex-1 bg-[#FFF] text-16 text-[#333333] shadow-[0_0_7px_#E5E5E5]'
						onClick={handleClearFilter}
					>{`Xoá & cài lại bộ lọc`}</button>

					<button
						disabled={!countX?.data}
						className={`flex-1 bg-[#F05A94] text-16 text-white `}
						onClick={handleSearchData}
					>
						{isValidating ? <Spin /> : `Xem ${countX?.data} kết quả`}
					</button>
				</div>
			</Drawer>
		</div>
	);
};
