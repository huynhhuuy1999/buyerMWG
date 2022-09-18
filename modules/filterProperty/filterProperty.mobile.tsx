import classNames from 'classnames';
import { Drawer, ImageCustom, PopupSort, ToggleBtn } from 'components';
import { PARAM_KEY_SEARCH, PROPERTY, TYPE_SEARCH } from 'enums';
import { useAppSelector, useIsomorphicLayoutEffect, useSearchCount } from 'hooks';
import { ParamSearchProduct, SearchAggregation } from 'models';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import {
	IFilterBoxMobile,
	IFilterBrandMobile,
	IFilterColorMobile,
	IFilterPlaceMobile,
	IFilterPriceMobile,
	IFilterRatingMobile,
} from '@/components/FilterSearch';
import { addressTreeSelector } from '@/store/reducers/address';

import { IItemFilter } from './filterProperty';
import { getListFilterInitParam } from './logic';

interface IFilterPropertyMobile {
	listPropertyFilter?: SearchAggregation;
	handleSearch?: any;
	keyword?: string;
	query?: any;
}

const FilterBrandMobile = dynamic(
	() => import('@/components/FilterSearch/FilterBrandMobile'),
) as React.FC<IFilterBrandMobile>;
const FilterBoxMobile = dynamic(
	() => import('@/components/FilterSearch/FilterBoxMobile'),
) as React.FC<IFilterBoxMobile>;
const FilterColorMobile = dynamic(
	() => import('@/components/FilterSearch/FilterColorMobile'),
) as React.FC<IFilterColorMobile>;
const FilterPriceMobile = dynamic(
	() => import('@/components/FilterSearch/FilterPriceMobile'),
) as React.FC<IFilterPriceMobile>;
const FilterPlaceMobile = dynamic(
	() => import('@/components/FilterSearch/FilterPlaceMobile'),
) as React.FC<IFilterPlaceMobile>;
const FilterRatingMobile = dynamic(
	() => import('@/components/FilterSearch/FilterRatingMobile'),
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
	const provinceTree = useAppSelector(addressTreeSelector);
	const route = useRouter();

	const [listFilter, setListFilter] = useState<ParamSearchProduct>({});
	const [listFilterSelected, setListFilterSelected] = useState<IItemFilter[]>([]);
	const [isShow, setIsShow] = useState<boolean>(false);
	const [isScrollDown, setIsScrollDown] = useState<boolean>(false);
	const [isCheckVip, setIsCheckVip] = useState<boolean>(false);
	const filterElement = useRef<HTMLDivElement>(null);
	const [checkHeight, setCheckHeight] = useState<number>(0);

	const { data: countx } = useSearchCount({
		keyword,
		brandIds: (listFilter || [])?.brandIds?.map((item: any) => item),
		isValid: true,
		provinceId: listFilter?.provinceId,
		districtIds: (listFilter || [])?.districtIds?.map((item: any) => item),
		filters: (listFilter || [])?.filters?.map((item: any) => item),
		categoryId: (listFilter || [])?.categoryId?.map((item: any) => item),
		price: (listFilter || [])?.price?.map((item: any) => item),
		sortType: (listFilter || [])?.sortType,
		ratingTypes: (listFilter || [])?.ratingTypes?.map((item: any) => item),
	});

	const quantitySearch = useMemo(() => {
		return countx;
	}, [countx]);

	const arrayProperty: any = listPropertyFilter
		? // ? [...Object.keys(listPropertyFilter), PROPERTY.PROVINCE, PROPERTY.RATING]
		  [...Object.keys(listPropertyFilter), PROPERTY.RATING]
		: [];

	let prevPosition: number = 0;

	useIsomorphicLayoutEffect(() => {
		const handleScrollWindow = () => {
			const position: number = window.scrollY;
			// const top = filterElement?.current?.getBoundingClientRect().top;
			if (position > prevPosition && position !== 0) {
				setIsScrollDown(true);
			} else {
				setIsScrollDown(false);
			}
			prevPosition = position;

			// if (filterElement && position > 60) {
			// 	filterElement?.current?.classList?.add('hidden');
			// } else {
			// 	filterElement?.current?.classList?.remove('hidden');
			// }
		};

		window.addEventListener('scroll', handleScrollWindow);

		return () => window.removeEventListener('scroll', handleScrollWindow);
	}, []);

	useEffect(() => {
		if (query && listPropertyFilter && provinceTree) {
			setListFilterSelected(getListFilterInitParam(query, listPropertyFilter, provinceTree));
			setFilterListWithDefaultParam(query);
		}
	}, [query, listPropertyFilter, provinceTree]);

	const setFilterListWithDefaultParam = (query: any) => {
		let value = {};
		const arrKeyParam = Object.keys(query);

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

	useEffect(() => {
		setCheckHeight(window.innerHeight);
	}, []);

	const handleSelectItem = (value: IItemFilter, typeSearch: number) => {
		let newListItemCard = [...listFilterSelected];
		const index = listFilterSelected?.findIndex((item) => item.id === value.id);

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
		setIsShow(false);
		handleSearch(listFilter);
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
			case PROPERTY.CATEGORY:
				return (
					<FilterBoxMobile
						listData={listPropertyFilter?.categories}
						key={index}
						title='Loại sản phẩm'
						onSelect={(value) =>
							handleSelectItem({ ...value, type: TYPE_SEARCH.LIST }, TYPE_SEARCH.LIST)
						}
						defaultSelected={listFilterSelected}
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
						title='Khoảng giá'
						defaultSelected={listFilterSelected}
						maxPrice={listPropertyFilter?.maxPrice}
						onSelect={(value) => {
							handleSelectItem({ ...value, type: TYPE_SEARCH.PRICE }, TYPE_SEARCH.PRICE);
						}}
						key={index}
					/>
				);
			case PROPERTY.PROVINCE:
				return (
					<FilterPlaceMobile
						title='Nơi bán'
						listPlace={provinceTree}
						getProvince={(value) => {
							let cardFilter = listFilterSelected.filter(
								(item) => item.type !== TYPE_SEARCH.DISTRICT && item.type !== TYPE_SEARCH.PROVINCE,
							);
							if (value.id !== 0) {
								setListFilter({ ...listFilter, provinceId: value.id });
								cardFilter.push({
									id: value.id,
									label: value.label,
									type: TYPE_SEARCH.PROVINCE,
								});
								setListFilterSelected(cardFilter);
								delete listFilter.districtIds;
							} else {
								setListFilterSelected(cardFilter);
								let newListFilter = { ...listFilter };
								delete newListFilter.districtIds;
								delete newListFilter.provinceId;
								setListFilter(newListFilter);
							}
						}}
						onSelect={(value) => {
							handleSelectItem({ ...value, type: TYPE_SEARCH.DISTRICT }, TYPE_SEARCH.DISTRICT);
						}}
						defaultSelected={{
							listDefault: listFilterSelected.filter((item) => {
								return item.type === TYPE_SEARCH.DISTRICT;
							}),
							province: Number(listFilter?.provinceId || 0),
						}}
						key={index}
					/>
				);

			case PROPERTY.RATING:
				return (
					<FilterPriceMobile
						title='Khoảng giá'
						defaultSelected={listFilterSelected}
						maxPrice={listPropertyFilter?.maxPrice}
						onSelect={(value) => {
							handleSelectItem({ ...value, type: TYPE_SEARCH.PRICE }, TYPE_SEARCH.PRICE);
						}}
						key={index}
					/>
				);
			default:
				break;
		}
	};

	const handleClearFilter = () => {
		setListFilterSelected([]);
		setListFilter({});
		// handleSearch({});
		// setIsShow(false);
	};

	const handleRemoveItemFilter = (item: IItemFilter, typeSearch: number) => {
		const listDistrict = listFilterSelected.filter(
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
		<div className={'pb-8'}>
			<div
				className={classNames([
					'fixed w-full px-10px z-10 bg-white mt-[64px] border-b transition-[display] duration-100',
					isScrollDown ? 'hidden' : 'block',
				])}
				ref={filterElement}
			>
				<div className={`flex justify-start items-center`}>
					<div
						className='flex w-[calc(50%_+_1px)] items-center border-r py-2'
						onClick={() => setIsShow(true)}
						role='button'
						onKeyPress={() => setIsShow(true)}
						tabIndex={0}
					>
						<ImageCustom src={'/static/svg/iconFilter.svg'} width={24} height={24} />
						<span className='text-14'>Bộ lọc</span>
					</div>
					<div className='w-[calc(50%_-_1px)] pr-10px'>
						<PopupSort
							className='absolute left-[-100%]  top-10'
							onChange={(value) => handleSearch({ ...listFilter, sortType: value })}
							defaultValue={Number(route?.query?.sortType)}
						/>
					</div>
				</div>
			</div>

			<Drawer isOpen={isShow} setIsOpen={(value) => setIsShow(value)}>
				<div className='flex h-[56px] items-center justify-between bg-[#FFF] px-[20px] text-18'>
					<div className='flex items-center'>
						<ImageCustom
							src={'/static/svg/Close.svg'}
							width={20}
							height={20}
							onClick={() => setIsShow(false)}
						/>
						<span className='ml-[17px] text-16'>Bộ lọc</span>
					</div>
					<ImageCustom src={'/static/svg/iconFilter.svg'} width={24} height={24} />
				</div>

				<div
					className={classNames([
						'mb-14 overflow-y-auto  pb-5 overflow-x-hidden',
						checkHeight > 670 ? 'max-h-[70vh]' : 'max-h-[65vh] ',
					])}
				>
					<div className='h-[6px] w-full bg-[#DADDE1]' />
					<div className='flex items-center justify-between p-4'>
						<div className='flex items-center'>
							<ImageCustom src={'/static/svg/logoVip.svg'} width={24} height={24} />
							<span className='ml-4'>Chính sách đổi trả VIP</span>
						</div>

						<ToggleBtn isChecked={isCheckVip} setChecked={(value) => setIsCheckVip(value)} />
					</div>
					<div className='h-[6px] w-full bg-[#DADDE1]' />
					<div className='px-[10px]'>
						{arrayProperty.map((property: any, index: number) => {
							return renderProperty(property, index);
						})}
					</div>
				</div>
				{listFilterSelected.length ? (
					<div className='fixed bottom-12 flex w-full overflow-x-auto bg-white px-10px py-3'>
						{listFilterSelected.map((itemFilter, index) => {
							const checkHasProvince = listFilterSelected.some(
								(itemFilter) => itemFilter.type === TYPE_SEARCH.PROVINCE,
							);
							const checkHasDistrict = listFilterSelected.some(
								(itemFilter) => itemFilter.type === TYPE_SEARCH.DISTRICT,
							);
							if (itemFilter.type === TYPE_SEARCH.PROVINCE) {
								if (checkHasDistrict && checkHasProvince) return;
							}
							return (
								<div
									className='mr-6px flex min-w-max items-center rounded-[20px] bg-[#FFF5F9] px-2 py-1 text-16 text-333333'
									key={index}
									role='button'
									onKeyPress={() => {}}
									tabIndex={0}
								>
									<span className='mr-2px '>{itemFilter.label}</span>
									<ImageCustom
										src={'/static/svg/xoa.svg'}
										width={16}
										height={16}
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
				) : null}

				<div className='fixed bottom-0 left-0 flex h-12 w-full shadow-[0_0px_4px_0px_rgba(0,0,0,0.2)]'>
					<button
						className='flex-1 bg-[#EEEFFF] text-16 text-[#333333]'
						onClick={handleClearFilter}
					>{`Xoá & cài lại bộ lọc`}</button>
					<button
						className={`flex-1 bg-[#F05A94] text-16 text-white ${
							countx?.data === 0 ? 'bg-[#F05A94]/[0.7]' : ''
						}`}
						onClick={handleSearchData}
						disabled={countx === 0}
					>
						Xem {quantitySearch} kết quả
					</button>
				</div>
			</Drawer>
		</div>
	);
};
