import classNames from 'classnames';
import { Drawer, ImageCustom, PopupSort, Spin } from 'components';
import { PARAM_KEY_SEARCH, PROPERTY, TYPE_SEARCH } from 'enums';
import { useAppSelector, useIsomorphicLayoutEffect, useProductSearch } from 'hooks';
import { ParamSearchProduct, SearchAggregation } from 'models';
import { IItemFilter, LogicProperty } from 'modules';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';

import { addressTreeSelector } from '@/store/reducers/address';
interface IFilterPropertyMobile {
	listPropertyFilter?: SearchAggregation;
	handleSearch?: any;
	keyword?: string;
	query?: any;
	categoryId?: any;
}

const FilterBrandMobile = dynamic(() => import('@/components/FilterSearch/FilterBrandMobile'));
const FilterBoxMobile = dynamic(() => import('@/components/FilterSearch/FilterBoxMobile'));
// const FilterColorMobile = dynamic(() => import('@/components/FilterSearch/FilterColorMobile'));
const FilterPriceMobile = dynamic(() => import('@/components/FilterSearch/FilterPriceMobile'));
const FilterPlaceMobile = dynamic(() => import('@/components/FilterSearch/FilterPlaceMobile'));

const arrayKeyAccept = [
	PARAM_KEY_SEARCH.BRANDS,
	PARAM_KEY_SEARCH.CATEGORY,
	PARAM_KEY_SEARCH.DISTRICT,
	PARAM_KEY_SEARCH.FILTER,
	PARAM_KEY_SEARCH.PROVINCE,
	PARAM_KEY_SEARCH.PRICE,
];

const FilterCustomerMobile: React.FC<IFilterPropertyMobile> = ({
	listPropertyFilter,
	keyword,
	handleSearch,
	query,
	categoryId = [],
}) => {
	const [listFilter, setListFilter] = useState<ParamSearchProduct>({});
	const route = useRouter();
	const [listFilterSelected, setListFilterSelected] = useState<IItemFilter[]>([]);
	const [isShow, setIsShow] = useState<boolean>(false);
	const filterElement = useRef<HTMLDivElement>(null);
	const [isScrollDown, setIsScrollDown] = useState<boolean>(false);

	const { data: countX, isValidating } = useProductSearch('/product/searchresultcount', {
		keyword,
		brandIds: (listFilter || [])?.brandIds?.map((item: any) => item),
		isValid: true,
		provinceId: listFilter?.provinceId,
		districtIds: (listFilter || [])?.districtIds?.map((item: any) => item),
		filters: (listFilter || [])?.filters?.map((item: any) => item),
		categoryId,
		price: (listFilter || [])?.price?.map((item: any) => item),
	});

	const arrayProperty: any = listPropertyFilter
		? [...Object.keys(listPropertyFilter), PROPERTY.PROVINCE]
		: [];

	const provinceTree = useAppSelector(addressTreeSelector);

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
			//  filterElement?.current?.classList?.add('hidden');
			// } else {
			//  filterElement?.current?.classList?.remove('hidden');
			// }
		};

		window.addEventListener('scroll', handleScrollWindow);

		return () => window.removeEventListener('scroll', handleScrollWindow);
	}, []);

	useEffect(() => {
		if (query && listPropertyFilter && provinceTree) {
			setListFilterSelected(
				LogicProperty.getListFilterInitParam(query, listPropertyFilter, provinceTree),
			);
			setFilterListWithDefaultParam(query);
		}
	}, [query, listPropertyFilter, provinceTree]);

	const setFilterListWithDefaultParam = (query: any) => {
		let value = {};
		let arrKeyParam = Object.keys(query);

		arrKeyParam.map((item: any) => {
			if (arrayKeyAccept.includes(item)) {
				value = {
					...value,
					[item]: [query[item]],
				};
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
						title='Loại nghành hàng'
						onSelect={(value) =>
							handleSelectItem({ ...value, type: TYPE_SEARCH.LIST }, TYPE_SEARCH.LIST)
						}
						defaultSelected={listFilterSelected}
					/>
				);
			// case PROPERTY.PROPERTY:
			// 	return listPropertyFilter?.properties?.map((item, indexProperty) => {
			// 		return item.name === PROPERTY.COLOR ? (
			// 			<FilterColorMobile
			// 				listColor={item}
			// 				key={`${indexProperty}a`}
			// 				title={item.name}
			// 				onSelect={(value) =>
			// 					handleSelectItem({ ...value, type: TYPE_SEARCH.ORTHER }, TYPE_SEARCH.ORTHER)
			// 				}
			// 				defaultSelected={listFilterSelected}
			// 			/>
			// 		) : (
			// 			<FilterBoxMobile
			// 				listData={item}
			// 				key={`${indexProperty}b`}
			// 				title={item.name}
			// 				onSelect={(value) =>
			// 					handleSelectItem({ ...value, type: TYPE_SEARCH.ORTHER }, TYPE_SEARCH.ORTHER)
			// 				}
			// 				defaultSelected={listFilterSelected}
			// 			/>
			// 		);
			// 	});
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
							listDefault: listFilterSelected.filter((item) => item.type === TYPE_SEARCH.DISTRICT),
							province: Number(listFilter?.provinceId || 0),
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
		handleSearch({});
	};

	// const handleRemoveItemFilter = (item: IItemFilter, typeSearch: number) => {
	// 	let listDistrict = listFilterSelected.filter(
	// 		(itemListFilter) => itemListFilter.type === TYPE_SEARCH.DISTRICT,
	// 	);
	// 	const listFilteredNew = listFilterSelected.filter((itemFilter) =>
	// 		typeSearch === TYPE_SEARCH.PROVINCE ||
	// 		(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
	// 			? itemFilter.type !== TYPE_SEARCH.PROVINCE && itemFilter.type !== TYPE_SEARCH.DISTRICT
	// 			: itemFilter.id !== item.id,
	// 	);

	// 	setListFilterSelected(listFilteredNew);

	// 	if (
	// 		typeSearch === TYPE_SEARCH.PROVINCE ||
	// 		(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
	// 	) {
	// 		let copyListFilter = { ...listFilter };
	// 		delete copyListFilter.districtIds;
	// 		delete copyListFilter.provinceId;
	// 		setListFilter(copyListFilter);
	// 	} else {
	// 		transformParamSearch(listFilteredNew, typeSearch);
	// 	}
	// };

	return (
		<div className={'pb-8'}>
			<div
				className={classNames([
					'fixed left-[16px] right-[16px] z-10 py-2 bg-white mt-[30px] border-b',
					isScrollDown ? 'hidden' : 'block',
				])}
				ref={filterElement}
			>
				<div className={`flex justify-between`}>
					<div
						className='flex items-center'
						onClick={() => setIsShow(true)}
						role='button'
						onKeyPress={() => setIsShow(true)}
						tabIndex={0}
					>
						<ImageCustom src={'/static/svg/iconFilter.svg'} width={24} height={24} />
						<span className='text-14'>Bộ lọc</span>
					</div>
					<PopupSort
						className='absolute right-0 top-5'
						onChange={(value) => handleSearch({ ...listFilter, sortType: value })}
						defaultValue={Number(route?.query?.sortType)}
					/>
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
				<div className='mb-14 max-h-[70vh] overflow-y-auto px-[10px] overflow-x-hidden'>
					{arrayProperty.map((property: any, index: number) => {
						return renderProperty(property, index);
					})}
				</div>
				{/* <div className='fixed bottom-12 flex w-full overflow-x-auto bg-white px-10px py-3'>
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
								className='mr-6px flex min-w-max items-center rounded-[20px] bg-[#F7F5FE] px-2 py-1 text-16 text-333333'
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
				</div> */}
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
export default FilterCustomerMobile;
