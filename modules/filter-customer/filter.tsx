import { Dropdown, ImageCustom } from 'components';
import { OPTION_TYPE_FILTER_MODULE, PARAM_KEY_SEARCH, TYPE_ADDRESS_GOOGLE } from 'enums';
import { useAppSelector } from 'hooks';
import { ParamSearchProduct } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useRef, useState } from 'react';
import { getProvincesApi } from 'services';
import { getLocationCurrent } from 'utils/methods';

import { dataSortDropdown } from '@/components/Dropdown/constants';
import {
	getAddressFromLocationGoogleMap,
	getListFilterInitParam,
} from '@/modules/filterProperty/logic';
import { addressSelector } from '@/store/reducers/address';

enum TYPE_SHOW_FILTER {
	BRANDS = 2,
	RANGE_PRICE = 4,
	PLACE = 5,
	CATEGORIES = 1,
	PROVINCE = 3,
}
enum TYPE_SEARCH {
	PRICE = 4,
	BRANDS = 2,
	PROVINCE = 3,
	DISTRICT = 5,
	CATEGORIES = 1,
}
const DEFAULT_COUNT = 100;
export interface IItemFilter {
	id?: number | string;
	label?: string;
	type?: number;
	typeFilterBar?: number;
}
const arrayKeyAccept = [
	PARAM_KEY_SEARCH.BRANDS,
	PARAM_KEY_SEARCH.CATEGORY,
	PARAM_KEY_SEARCH.PROVINCE,
];

const FilterBrandFavorite = dynamic(() => import('@/components/FilterSearch/FilterBrandFavorite'));
const FilterCategory = dynamic(
	() => import('@/components/FilterSearch/FilterCategory/FilterCategory'),
);
const FilterPrice = dynamic(() => import('@/components/FilterSearch/FilterPrice'));
const FilterPlace = dynamic(() => import('@/components/FilterSearch/FilterPlace'));

const FilterCustomer: React.FC<any> = ({
	listPropertyFilter,
	handleSearch,
	keyword,
	query,
	option = OPTION_TYPE_FILTER_MODULE.DEFAULT,
	className,
}) => {
	const [typeFilter, setTypeFilter] = useState<number>(0);
	const [listFilter, setListFilter] = useState<ParamSearchProduct>({ keyword: keyword });
	const [_, setCheckReload] = useState(false);
	const locationRecent = useAppSelector((state) => state.app.currentLocation);

	const [positionTriangle, setPositionTriangle] = useState(0);
	const [listItemFilter, setListItemFilter] = useState<{
		itemCardFilter: Array<IItemFilter>;
		listFiltered: Array<IItemFilter>;
	}>({
		itemCardFilter: [],
		listFiltered: [],
	});
	const refContainer: any = useRef(null);
	const {
		data: { province: listProvince },
	} = useAppSelector(addressSelector);

	useEffect(() => {
		if (query && listPropertyFilter && listProvince) {
			setListItemFilter({
				itemCardFilter: getListFilterInitParam(query, listPropertyFilter, listProvince),
				listFiltered: getListFilterInitParam(query, listPropertyFilter, listProvince),
			});
			setFilterListWithDefaultParam(query);
		}
	}, [query, listPropertyFilter, listProvince]);

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
	const handleChooseFilter = (value: number) => {
		setTypeFilter(value);
	};

	const transformFilterBar = () => {
		let renderField = [];
		if (
			listPropertyFilter?.brands?.length === 0 &&
			listPropertyFilter.categories?.length === 0 &&
			listPropertyFilter.properties?.length === 0
		)
			return [];

		renderField.push(
			{ label: 'Ngành hàng', type: TYPE_SHOW_FILTER.CATEGORIES },
			{ label: 'Thương hiệu', type: TYPE_SHOW_FILTER.BRANDS },
		);
		if (listPropertyFilter.place !== undefined)
			renderField.push({ label: 'Khu vực', type: TYPE_SHOW_FILTER.PLACE });
		listPropertyFilter?.place;
		if (listPropertyFilter.maxPrice !== undefined)
			renderField.push({ label: 'Khoảng giá', type: TYPE_SHOW_FILTER.RANGE_PRICE });
		return renderField;
	};

	const handleCloseDialog = () => setTypeFilter(0);

	const renderFilterDropdown = () => {
		return transformFilterBar().map((item, index) => {
			let check = listItemFilter.itemCardFilter.some(
				(itemFilter) => itemFilter.typeFilterBar === item.type,
			);

			return (
				<button
					className={`relative mr-2 cursor-pointer rounded-3px border ${
						check ? 'border-[#F05A94]' : 'border-[#E0E0E0]'
					}  p-2 `}
					key={index}
					onClick={(e) => {
						handleChooseFilter(item.type);
						setPositionTriangle(e.clientX);
					}}
				>
					<div className='flex items-center text-16'>
						<span className='mr-3px text-dark-333333'>{item.label}</span>
						<ImageCustom width={15} height={7} src='/static/svg/arrow-down-solid.svg' />
					</div>
				</button>
			);
		});
	};

	const transformParamSearch = (
		value: Array<IItemFilter>,
		typeSearch: number,
		checkReload?: boolean,
	) => {
		if (checkReload) {
			setCheckReload(true);
		}

		switch (typeSearch) {
			case TYPE_SEARCH.BRANDS:
				let newListBrand = value?.filter((item) => item.type === TYPE_SEARCH.BRANDS);
				setListFilter({
					...listFilter,
					brandIds: newListBrand?.map((item) => `${item.id}`),
				});
				return;

			case TYPE_SEARCH.DISTRICT:
				let newListDistrict: any = value?.filter((item) => item.type === TYPE_SEARCH.DISTRICT);
				setListFilter({
					...listFilter,
					districtIds: newListDistrict?.map((item: any) => item.id),
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

	const handleSelectItem = (value: IItemFilter, typeSearch: number) => {
		let newListItemCard = [...listItemFilter.itemCardFilter];
		let index = listItemFilter.itemCardFilter?.findIndex((item) => item.id === value.id);

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
		if (typeSearch === TYPE_SEARCH.CATEGORIES) {
			setListFilter((state) => ({
				...state,
				brands: newListItemCard.filter((t) => t.type === TYPE_SEARCH.CATEGORIES),
			}));
		}
		setListItemFilter({ ...listItemFilter, itemCardFilter: newListItemCard });
		transformParamSearch(newListItemCard, typeSearch);
	};

	const getNearbyPlace = () => {
		const getPlace = () => {
			if (locationRecent.latitude && locationRecent.longitude) {
				const geocoder: any = new google.maps.Geocoder();
				let latlng = {
					lat: locationRecent.latitude,
					lng: locationRecent.longitude,
				};

				geocoder
					.geocode({ location: latlng })
					.then(async (response: { results?: Array<any> }) => {
						if (response.results?.length) {
							let address = getAddressFromLocationGoogleMap(response.results)[
								TYPE_ADDRESS_GOOGLE.PROVINCE
							];
							if (address) {
								const province = await getProvincesApi({
									q: address,
								});

								if (province.data && province.data.length) {
									setListFilter({ ...listFilter, provinceId: province.data[0].provinceId });
									setListItemFilter({
										...listItemFilter,
										itemCardFilter: listItemFilter.itemCardFilter.filter(
											(item) => item.type !== TYPE_SEARCH.DISTRICT,
										),
									});
								}
							}
						}
					})
					.catch((e: any) => {});
			}
		};
		getLocationCurrent(getPlace);
	};
	const onSearch = () => {
		// console.log('onSearch');
		// handleSearch(listFilter);
		// setListItemFilter({ ...listItemFilter, listFiltered: listItemFilter.itemCardFilter });
		// handleCloseDialog();
	};

	const Triangle = () => {
		return (
			<div
				className={`absolute top-[50px]`}
				style={{
					left: positionTriangle - (window.innerWidth - refContainer?.current.offsetWidth) / 4,
				}}
			>
				<div
					className={`relative top-[-2px] z-20 h-0 w-0 border border-x-[12px] 
				border-b-[15px] border-x-transparent border-b-[#C4C4C4]
				after:absolute after:top-1px after:left-[-11px] after:h-0 after:w-0 after:border after:border-x-[11px] 
				after:border-b-[14px] after:border-x-transparent after:border-b-white after:content-['']`}
				/>
			</div>
		);
	};

	const renderDialog = () => {
		switch (typeFilter) {
			case TYPE_SHOW_FILTER.BRANDS:
				return (
					<>
						<Triangle />
						<FilterBrandFavorite
							className='w-[700px]'
							onClickOutside={handleCloseDialog}
							listBrand={listPropertyFilter?.brands}
							onSelect={(value) =>
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.BRANDS, typeFilterBar: typeFilter },
									TYPE_SEARCH.BRANDS,
								)
							}
							handleSearch={onSearch}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.BRANDS);
							}}
							defaultSelected={listItemFilter.itemCardFilter}
							count={DEFAULT_COUNT}
						/>
					</>
				);
			case TYPE_SHOW_FILTER.CATEGORIES:
				return (
					<>
						<Triangle />
						<FilterCategory
							className='w-[700px]'
							onClickOutside={handleCloseDialog}
							listCategory={listPropertyFilter?.categories}
							onSelect={(value) =>
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.CATEGORIES, typeFilterBar: typeFilter },
									TYPE_SEARCH.CATEGORIES,
								)
							}
							handleSearch={onSearch}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.CATEGORIES);
							}}
							defaultSelected={listItemFilter.itemCardFilter}
							count={listPropertyFilter?.categories.length}
						/>
					</>
				);
			case TYPE_SHOW_FILTER.RANGE_PRICE:
				return (
					<>
						<Triangle />
						<FilterPrice
							className='left-0 w-[700px]'
							onClickOutside={handleCloseDialog}
							count={DEFAULT_COUNT}
							maxPrice={1000000}
							onSelect={(value) => {
								// handleSelectItem(
								// 	{ ...value, type: TYPE_SEARCH.PRICE, typeFilterBar: typeFilter },
								// 	TYPE_SEARCH.PRICE,
								// );
							}}
							handleSearch={onSearch}
							defaultSelected={listItemFilter.itemCardFilter}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.PRICE);
							}}
						/>
					</>
				);
			case TYPE_SHOW_FILTER.PLACE:
				return (
					<>
						<Triangle />
						<FilterPlace
							onClickOutside={handleCloseDialog}
							listPlace={listProvince as any}
							getProvince={(value) => {
								let cardFilter = listItemFilter.itemCardFilter.filter(
									(item) =>
										item.type !== TYPE_SEARCH.DISTRICT && item.type !== TYPE_SEARCH.PROVINCE,
								);
								if (value.id !== 0) {
									setListFilter({ ...listFilter, provinceId: value.id });
									cardFilter.push({
										id: value.id,
										label: value.label,
										type: TYPE_SEARCH.PROVINCE,
										typeFilterBar: TYPE_SHOW_FILTER.PLACE,
									});
									setListItemFilter({ ...listItemFilter, itemCardFilter: cardFilter });
									delete listFilter.districtIds;
								} else {
									setListItemFilter({ ...listItemFilter, itemCardFilter: cardFilter });
									let newListFilter = { ...listFilter };
									delete newListFilter.districtIds;
									delete newListFilter.provinceId;
									setListFilter(newListFilter);
								}
							}}
							onSelect={(value) => {
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.DISTRICT, typeFilterBar: typeFilter },
									TYPE_SEARCH.DISTRICT,
								);
							}}
							handleSearch={onSearch}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.DISTRICT);
							}}
							count={DEFAULT_COUNT}
							defaultSelected={{
								listDefault: listItemFilter.itemCardFilter.filter(
									(item) => item.type === TYPE_SEARCH.DISTRICT,
								),
								province: Number(listFilter?.provinceId || 0),
							}}
							className='left-0'
							getNearbyPlace={getNearbyPlace}
						/>
					</>
				);
		}
	};
	// clear all filter
	const reset = () => {
		setListItemFilter({ itemCardFilter: [], listFiltered: [] });
		setListFilter({ keyword });
		handleSearch({});
	};

	// setlist filter and change query param
	const removeFilterByType = (type: number, propertyId?: Array<string>) => {
		const listCard = listItemFilter.itemCardFilter.filter((item) => {
			if (propertyId?.length) {
				return !propertyId.includes(`${item.id}`.split(':')[0].split(/prop_/).pop() || 'x');
			}
			return type === TYPE_SEARCH.DISTRICT
				? item.type !== type && item.type !== TYPE_SEARCH.PROVINCE
				: item.type !== type;
		});
		const newListCardSelected = listItemFilter.listFiltered.filter((item) => {
			if (propertyId?.length) {
				return !propertyId.includes(`${item.id}`.split(':')[0].split(/prop_/).pop() || 'x');
			}
			return type === TYPE_SEARCH.DISTRICT
				? item.type !== type && item.type !== TYPE_SEARCH.PROVINCE
				: item.type !== type;
		});
		setListItemFilter({ itemCardFilter: listCard, listFiltered: newListCardSelected });
		transformParamSearch(newListCardSelected, 0, true);
	};

	// click botton 'Bỏ chọn'
	const handleCancelFilter = (type: number, propertyId?: Array<string>) => {
		removeFilterByType(type, propertyId);
		handleCloseDialog();
		switch (type) {
			case TYPE_SEARCH.BRANDS:
				delete listFilter.brandIds;
				return;
			case TYPE_SEARCH.DISTRICT:
				delete listFilter.provinceId;
				delete listFilter.districtIds;
				return;
			case TYPE_SEARCH.PRICE:
				delete listFilter.price;
				return;
			default:
				return;
		}
	};

	// remove item filter on list filter bar
	const handleRemoveItemFilter = (item: IItemFilter, typeSearch: number) => {};

	const render = () => {
		// <div className={`container mb-8 mx-auto `}>

		return (
			<div
				className={`container pb-2 mx-auto  animation-200 ${className || ''}`}
				ref={refContainer}
			>
				{option === OPTION_TYPE_FILTER_MODULE.DEFAULT && transformFilterBar().length ? (
					<div className='flex items-center justify-between py-4 px-3'>
						<div className='relative flex items-center'>
							{renderFilterDropdown()}
							{renderDialog()}
						</div>

						<Dropdown
							placeholder='Được mua nhiều nhất'
							classNameHeader='w-[200px] h-10'
							data={dataSortDropdown}
							classNameBody='w-[259px] right-0 rounded-3px mt-10px px-0'
							prefixIcon={<ImageCustom src={'/static/svg/Sort.svg'} width={24} height={24} />}
							classNameItem={`text-14 h-10 flex justify-between items-center px-6`}
							iconSelected={
								<ImageCustom src={'/static/svg/checkBlack.svg'} width={15} height={10} />
							}
							labelHeaderFixBody='Được mua nhiều nhất'
							// onChange={(value) => sortProduct(value)}
						/>
					</div>
				) : null}

				{listItemFilter.listFiltered.length ? (
					<div className='mt-9px flex items-center'>
						{listItemFilter.listFiltered?.map((item, index) => {
							let checkHasProvince = listItemFilter.listFiltered.some(
								(itemFilter) => itemFilter.type === TYPE_SEARCH.PROVINCE,
							);
							let checkHasDistrict = listItemFilter.listFiltered.some(
								(itemFilter) => itemFilter.type === TYPE_SEARCH.DISTRICT,
							);
							if (item.type === TYPE_SEARCH.PROVINCE) {
								if (checkHasDistrict && checkHasProvince) return;
							}
							return (
								<div
									className='relative mr-18px flex h-7 items-center justify-center bg-F2F2F2 px-3 text-12 font-medium'
									key={index}
								>
									{item.label}
									<div
										className='absolute -right-2 -top-2 cursor-pointer'
										onClick={() => handleRemoveItemFilter(item, item.type || 0)}
										tabIndex={0}
										role='button'
										onKeyPress={() => handleRemoveItemFilter(item, item.type || 0)}
									>
										<ImageCustom
											src='/static/svg/closeCircle.svg'
											width={16}
											height={16}
											priority
										/>
									</div>
								</div>
							);
						})}
						<span
							className='cursor-pointer text-009ADA'
							onClick={reset}
							tabIndex={0}
							role='button'
							onKeyPress={reset}
						>
							Xoá bộ lọc
						</span>
					</div>
				) : null}
			</div>
		);
	};

	return render();
};
export default React.memo(FilterCustomer);
