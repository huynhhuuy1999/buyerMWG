import { dataSortDropdown, Dropdown, Icon, ImageCustom } from 'components';
import {
	OPTION_TYPE_FILTER_MODULE,
	PARAM_KEY_SEARCH,
	TYPE_ADDRESS_GOOGLE,
	TYPE_SEARCH,
	TYPE_SHOW_FILTER,
} from 'enums';
import { useAppSelector, useSearchCount } from 'hooks';
import { ParamSearchProduct, ProvinceResponse, SearchAggregation } from 'models';
import dynamic from 'next/dynamic';
import React, { FC, useEffect, useRef, useState } from 'react';
import { getProvincesApi } from 'services';
import { getLocationCurrent } from 'utils/methods';

import {
	IFilterBrand,
	IFilterColor,
	IFilterOrther,
	IFilterPlace,
	IFilterPrice,
} from '@/components/FilterSearch';
import FilterBox from '@/components/FilterSearch/FilterBox';
import { addressTreeSelector } from '@/store/reducers/address';

import { getAddressFromLocationGoogleMap, getListFilterInitParam } from './logic';

interface IFilterProperty {
	listPropertyFilter?: SearchAggregation;
	handleSearch?: any;
	keyword?: string;
	query?: any;
	showFilter?: boolean;
	option?: OPTION_TYPE_FILTER_MODULE;
	className?: string;
	ref?: any;
	isShowFilter?: boolean;
	listProvince?: ProvinceResponse[];
	categoryId?: string | string[] | number | number[];
	page?: number;
	pageSize?: number;
	merchantId?: number;
}

export interface IItemFilter {
	id?: number | string;
	label?: string;
	type?: number;
	typeFilterBar?: number;
}
const arrayKeyAccept = [
	PARAM_KEY_SEARCH.BRANDS,
	PARAM_KEY_SEARCH.CATEGORY,
	PARAM_KEY_SEARCH.DISTRICT,
	PARAM_KEY_SEARCH.FILTER,
	PARAM_KEY_SEARCH.PROVINCE,
	PARAM_KEY_SEARCH.PRICE,
	PARAM_KEY_SEARCH.SORT,
	PARAM_KEY_SEARCH.RATING,
];

const MAX_ORTHER_FILTER_DISPLAY = 2;
const FilterBrand = dynamic(
	() => import('@/components/FilterSearch/FilterBrand'),
) as FC<IFilterBrand>;
const FilterColor = dynamic(
	() => import('@/components/FilterSearch/FilterColor'),
) as FC<IFilterColor>;
const FilterOrther = dynamic(
	() => import('@/components/FilterSearch/FilterOrther'),
) as FC<IFilterOrther>;
const FilterPlace = dynamic(
	() => import('@/components/FilterSearch/FilterPlace'),
) as FC<IFilterPlace>;
const FilterPrice = dynamic(
	() => import('@/components/FilterSearch/FilterPrice'),
) as FC<IFilterPrice>;

export const FilterProperty: React.FC<IFilterProperty> = ({
	listPropertyFilter,
	handleSearch,
	keyword,
	query,
	showFilter,
	option = OPTION_TYPE_FILTER_MODULE.DEFAULT,
	className,
	merchantId,
}) => {
	const refContainer = useRef<HTMLDivElement>(null);
	const [typeFilter, setTypeFilter] = useState<number>(0);
	const [listFilter, setListFilter] = useState<ParamSearchProduct>({});
	const [checkReload, setCheckReload] = useState(false);
	const [positionTriangle, setPositionTriangle] = useState(0);
	const [widthContainer, setWidthContainer] = useState(0);
	const [listItemFilter, setListItemFilter] = useState<{
		itemCardFilter: Array<IItemFilter>;
		listFiltered: Array<IItemFilter>;
	}>({
		itemCardFilter: [],
		listFiltered: [],
	});
	const provinceTree = useAppSelector(addressTreeSelector);

	const locationRecent = useAppSelector((state) => state.app.currentLocation);

	const { data: countx, isValidating: loadingCount } = useSearchCount({
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
		merchantId: merchantId,
	});

	useEffect(() => {
		if (refContainer.current) {
			setWidthContainer(refContainer.current.offsetWidth);
		}
	}, [refContainer]);

	useEffect(() => {
		if (query && listPropertyFilter && provinceTree) {
			setListItemFilter({
				itemCardFilter: getListFilterInitParam(query, listPropertyFilter, provinceTree),
				listFiltered: getListFilterInitParam(query, listPropertyFilter, provinceTree),
			});
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
		if (listPropertyFilter?.brands?.length)
			renderField.push({ label: 'Thương hiệu', type: TYPE_SHOW_FILTER.BRANCH });
		// if (listPropertyFilter?.categories?.length)
		// 	renderField.push({ label: 'Danh mục', type: TYPE_SHOW_FILTER.LIST });
		if (listPropertyFilter?.properties?.length) {
			listPropertyFilter.properties.forEach((element, index) => {
				if (index < MAX_ORTHER_FILTER_DISPLAY) {
					renderField.push({
						label: element.name,
						type: element.name === 'Màu sắc' ? TYPE_SHOW_FILTER.COLOR : element.id,
					});
					listPropertyFilter[`${element.id}`] = element;
				}
			});
			renderField.push(
				{ label: 'Khoảng giá', type: TYPE_SHOW_FILTER.RANGE_PRICE },
				// { label: 'Khu vực', type: TYPE_SHOW_FILTER.PLACE },
			);
			listPropertyFilter.properties.length > MAX_ORTHER_FILTER_DISPLAY &&
				renderField.push({ label: 'Bộ lọc khác', type: TYPE_SHOW_FILTER.ORTHER });
		}

		return renderField;
	};

	const handleCloseDialog = () => {
		setTypeFilter(0);
	};

	const renderFilterDropdown = () => {
		return transformFilterBar().map((item, index) => {
			const check = listItemFilter.itemCardFilter.some(
				(itemFilter) => itemFilter.typeFilterBar === item.type,
			);
			let countFilter = 0;
			if (item.label === 'Bộ lọc khác')
				countFilter = listItemFilter.itemCardFilter.filter(
					(itemFilter) => itemFilter.typeFilterBar === TYPE_SHOW_FILTER.ORTHER,
				).length;
			return (
				<div
					className={`relative mr-2 cursor-pointer rounded-3px border ${
						check ? 'border-[#F05A94]' : 'border-[#E0E0E0]'
					}  p-2`}
					key={index}
					onClick={(e) => {
						e.stopPropagation();
						handleChooseFilter(item.type);
						setPositionTriangle(e.clientX);
						if (item.type === typeFilter) {
							handleCloseDialog();
						}
					}}
					role='button'
					onKeyPress={() => {}}
					tabIndex={0}
				>
					<div className='flex items-center text-16'>
						{item.label === 'Bộ lọc khác' ? (
							<ImageCustom src={'/static/svg/iconFilter.svg'} width={20} height={20} />
						) : null}
						<span
							className={`${item.label === 'Bộ lọc khác' ? 'ml-3px' : 'mr-10px'} text-dark-333333`}
						>
							{item.label}
						</span>
						{item.label !== 'Bộ lọc khác' ? (
							// <ImageCustom width={15} height={7} src='/static/svg/arrow-down-solid.svg' />
							<ImageCustom width={15} height={7.5} src='/static/svg/chevron-down-333333.svg' />
						) : null}
					</div>
					{item.label === 'Bộ lọc khác' && countFilter !== 0 ? (
						<div className='absolute top-[-10px] right-[13px] flex h-4 w-4 items-center justify-center rounded-full bg-[#EA001B] font-sfpro_bold text-11 text-white'>
							<span>{countFilter}</span>
						</div>
					) : null}
				</div>
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
			case TYPE_SEARCH.BRAND:
				const newListBrand = value.reduce((init: any, item: IItemFilter) => {
					if (item.type === TYPE_SEARCH.BRAND) {
						return [...init, `${item.id}`];
					}
					return init;
				}, []);

				setListFilter({
					...listFilter,
					brandIds: newListBrand,
				});
				return;
			case TYPE_SEARCH.ORTHER:
				const newListOrther = value.reduce((init: any, item: IItemFilter) => {
					if (item.type === TYPE_SEARCH.ORTHER) {
						return [...init, `${item.id}`];
					}
					return init;
				}, []);

				setListFilter({
					...listFilter,
					filters: newListOrther,
				});
				return;
			case TYPE_SEARCH.DISTRICT:
				const newListDistrict = value.reduce((init: any, item: IItemFilter) => {
					if (item.type === TYPE_SEARCH.DISTRICT) {
						return [...init, item.id];
					}
					return init;
				}, []);

				setListFilter({
					...listFilter,
					districtIds: newListDistrict,
				});
				return;
			case TYPE_SEARCH.LIST:
				const newListCategory = value.reduce((init: any, item: IItemFilter) => {
					if (item.type === TYPE_SEARCH.LIST) {
						return [...init, item.id];
					}
					return init;
				}, []);

				setListFilter({
					...listFilter,
					categoryId: newListCategory,
				});
				return;
			case TYPE_SEARCH.PRICE:
				const newListPrice = value.reduce((init: any, item: IItemFilter) => {
					if (item.type === TYPE_SEARCH.PRICE) {
						return [...init, item.id];
					}
					return init;
				}, []);

				setListFilter({
					...listFilter,
					price: newListPrice.length ? newListPrice[0].split('-') : [],
				});
				return;
			case TYPE_SEARCH.RATING:
				const listRatingId = value.reduce((init: any, item: IItemFilter) => {
					if (item.type === TYPE_SEARCH.RATING) {
						const idRating = String(item?.id || '')?.slice(0, 1);
						return [...init, idRating];
					}
					return init;
				}, []);

				setListFilter({
					...listFilter,
					ratingTypes: listRatingId,
				});

				return;
			default:
				return;
		}
	};

	const handleSelectItem = (value: IItemFilter, typeSearch: number) => {
		let newListItemCard = [...listItemFilter.itemCardFilter];
		const index = listItemFilter.itemCardFilter?.findIndex((item) => item.id === value.id);

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
		setListItemFilter({ ...listItemFilter, itemCardFilter: newListItemCard });
		transformParamSearch(newListItemCard, typeSearch);
	};

	const valueDataByType = (id: number) => {
		return listPropertyFilter && listPropertyFilter[`${id}`];
	};

	const onSearch = () => {
		handleSearch(listFilter);
		setListItemFilter({ ...listItemFilter, listFiltered: listItemFilter.itemCardFilter });
		handleCloseDialog();
	};

	const getNearbyPlace = () => {
		const getPlace = () => {
			if (locationRecent.latitude && locationRecent.longitude) {
				const geocoder: any = new google.maps.Geocoder();
				const latlng = {
					lat: locationRecent.latitude,
					lng: locationRecent.longitude,
				};

				geocoder
					.geocode({ location: latlng })
					.then(async (response: { results?: Array<any> }) => {
						if (response.results?.length) {
							const address = getAddressFromLocationGoogleMap(response.results)[
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
					.catch(() => {});
			}
		};

		getLocationCurrent(getPlace);
	};

	const Triangle = () => {
		return (
			<div
				className={`absolute top-[50px]`}
				style={{ left: positionTriangle - (window.innerWidth - widthContainer) / 2 }}
			>
				<div
					className={`relative top-[-2px] z-20 h-0 w-0 border-x-[12px] 
					border-t-[1px] border-b-[15px] border-x-transparent border-t-transparent 
					border-b-[#C4C4C4] after:absolute after:top-1px after:left-[-11px] after:h-0 
					after:w-0 after:border-x-[11px] after:border-t-[1px] after:border-b-[14px] after:border-x-transparent 
					after:border-t-transparent after:border-b-white after:content-['']`}
				/>
			</div>
		);
	};

	const renderDialog = () => {
		switch (typeFilter) {
			case TYPE_SHOW_FILTER.BRANCH:
				return (
					<>
						<Triangle />
						<FilterBrand
							onClickOutside={handleCloseDialog}
							listBrand={listPropertyFilter?.brands}
							onSelect={(value) =>
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.BRAND, typeFilterBar: typeFilter },
									TYPE_SEARCH.BRAND,
								)
							}
							handleSearch={onSearch}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.BRAND);
							}}
							defaultSelected={listItemFilter.itemCardFilter}
							count={countx}
							loading={loadingCount}
						/>
					</>
				);
			case TYPE_SHOW_FILTER.LIST:
				return (
					<>
						<Triangle />
						<FilterBox
							listData={listPropertyFilter?.categories}
							count={countx}
							onClickOutside={handleCloseDialog}
							onSelect={(value) =>
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.LIST, typeFilterBar: typeFilter },
									TYPE_SEARCH.LIST,
								)
							}
							defaultSelected={listItemFilter.itemCardFilter}
							handleSearch={onSearch}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.LIST);
							}}
							loading={loadingCount}
						/>
					</>
				);
			case TYPE_SHOW_FILTER.COLOR:
				return (
					<>
						<Triangle />
						<FilterColor
							onClickOutside={handleCloseDialog}
							listColor={listPropertyFilter?.properties}
							onSelect={(value) =>
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.ORTHER, typeFilterBar: typeFilter },
									TYPE_SEARCH.ORTHER,
								)
							}
							handleSearch={onSearch}
							defaultSelected={listItemFilter.itemCardFilter}
							count={countx}
							handleCancel={(propertyId) => {
								handleCancelFilter(TYPE_SEARCH.ORTHER, propertyId);
							}}
							loading={loadingCount}
						/>
					</>
				);

			case TYPE_SHOW_FILTER.RANGE_PRICE:
				return (
					<>
						<Triangle />
						<FilterPrice
							onClickOutside={handleCloseDialog}
							count={countx}
							maxPrice={listPropertyFilter?.maxPrice}
							onSelect={(value) => {
								handleSelectItem(
									{ ...value, type: TYPE_SEARCH.PRICE, typeFilterBar: typeFilter },
									TYPE_SEARCH.PRICE,
								);
							}}
							handleSearch={onSearch}
							defaultSelected={listItemFilter.itemCardFilter}
							handleCancel={() => {
								handleCancelFilter(TYPE_SEARCH.PRICE);
							}}
							loading={loadingCount}
							className='right-0'
						/>
					</>
				);
			case TYPE_SHOW_FILTER.PLACE:
				return (
					<>
						<Triangle />
						<FilterPlace
							onClickOutside={handleCloseDialog}
							listPlace={provinceTree}
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
							count={countx}
							defaultSelected={{
								listDefault: listItemFilter.itemCardFilter.filter(
									(item) => item.type === TYPE_SEARCH.DISTRICT,
								),
								province: Number(listFilter?.provinceId || 0),
							}}
							className='right-0'
							getNearbyPlace={getNearbyPlace}
						/>
					</>
				);
			case TYPE_SHOW_FILTER.ORTHER:
				return (
					<>
						<Triangle />
						<FilterOrther
							onClickOutside={handleCloseDialog}
							listData={listPropertyFilter?.properties}
							count={countx}
							onSelect={(value, typeSearch) => {
								if (typeSearch === TYPE_SEARCH.ORTHER) {
									handleSelectItem(
										{ ...value, type: TYPE_SEARCH.ORTHER, typeFilterBar: typeFilter },
										TYPE_SEARCH.ORTHER,
									);
								} else {
									// handleSelectItem(
									// 	{ ...value, type: TYPE_SEARCH.LIST, typeFilterBar: typeFilter },
									// 	TYPE_SEARCH.LIST,
									// );
									handleSelectItem(
										{ ...value, type: typeSearch, typeFilterBar: typeFilter },
										typeSearch,
									);
								}
							}}
							defaultSelected={listItemFilter.itemCardFilter}
							handleSearch={onSearch}
							handleCancel={(listPropertyId, categoryId, typeRatingId) => {
								handleCancelFilter(TYPE_SEARCH.ORTHER, listPropertyId, categoryId, typeRatingId);
							}}
							loading={loadingCount}
							className='right-0'
							listCategory={listPropertyFilter?.categories}
						/>
					</>
				);
			default:
				if (typeFilter > 0)
					return (
						<>
							<Triangle />
							<FilterBox
								onClickOutside={handleCloseDialog}
								listData={valueDataByType(typeFilter)}
								count={countx}
								onSelect={(value) => {
									handleSelectItem(
										{ ...value, type: TYPE_SEARCH.ORTHER, typeFilterBar: typeFilter },
										TYPE_SEARCH.ORTHER,
									);
								}}
								defaultSelected={listItemFilter.itemCardFilter}
								handleSearch={onSearch}
								handleCancel={(propertyid) => {
									handleCancelFilter(TYPE_SEARCH.ORTHER, propertyid);
								}}
								loading={loadingCount}
							/>
						</>
					);
				return;
		}
	};

	// clear all filter
	const reset = () => {
		setListItemFilter({ itemCardFilter: [], listFiltered: [] });
		// setListFilter({ keyword });
		setListFilter({});
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
		const listCardSelectednew = listItemFilter.listFiltered.filter((item) => {
			if (propertyId?.length) {
				return !propertyId.includes(`${item.id}`.split(':')[0].split(/prop_/).pop() || 'x');
			}
			return type === TYPE_SEARCH.DISTRICT
				? item.type !== type && item.type !== TYPE_SEARCH.PROVINCE
				: item.type !== type;
		});
		setListItemFilter({ itemCardFilter: listCard, listFiltered: listCardSelectednew });
		transformParamSearch(listCardSelectednew, 0, true);
	};

	// click botton 'Bỏ chọn'
	const handleCancelFilter = (
		type: number,
		propertyId?: Array<string>,
		categoryId?: string[],
		typeRating?: string[],
	) => {
		handleCloseDialog();
		removeFilterByType(type, propertyId);

		switch (type) {
			case TYPE_SEARCH.BRAND:
				delete listFilter.brandIds;
				break;
			case TYPE_SEARCH.ORTHER:
				// problem here
				// let newListFilter = [...listFilter?.filters]||null
				// let categoryFitler = [...listFilter?.categoryId]||null
				let axd = { ...listFilter };

				if (listFilter?.filters?.length) {
					let newListFilter = [...listFilter?.filters];
					newListFilter = newListFilter.filter(
						(item) => !propertyId?.includes(item.split(':')[0].split(/prop_/).pop()),
					);
					axd = {
						...axd,
						filters: newListFilter,
					};
				}

				if (listFilter?.categoryId?.length) {
					if (categoryId?.length) {
						axd = {
							...axd,
							categoryId: [],
						};
						delete listFilter.categoryId;
					}
				}
				if (listFilter?.ratingTypes?.length) {
					if (typeRating?.length) {
						delete listFilter.ratingTypes;
						axd = {
							...axd,
							ratingTypes: [],
						};
					}
				}
				setListFilter(axd);

				break;
			case TYPE_SEARCH.DISTRICT:
				delete listFilter.provinceId;
				delete listFilter.districtIds;
				break;
			case TYPE_SEARCH.LIST:
				delete listFilter.categoryId;
				break;
			case TYPE_SEARCH.PRICE:
				delete listFilter.price;
				break;
			// return;
			default:
				break;
			// return;
		}
	};

	useEffect(() => {
		if (checkReload) {
			handleSearch(listFilter);
			setCheckReload(false);
		}
	}, [checkReload, listFilter]);

	// remove item filter on list filter bar
	const handleRemoveItemFilter = (item: IItemFilter, typeSearch: number) => {
		let listDistrict = listItemFilter.listFiltered.filter(
			(itemListFilter) => itemListFilter.type === TYPE_SEARCH.DISTRICT,
		);
		const listFilteredNew = listItemFilter.listFiltered.filter((itemFilter) =>
			typeSearch === TYPE_SEARCH.PROVINCE ||
			(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
				? itemFilter.type !== TYPE_SEARCH.PROVINCE && itemFilter.type !== TYPE_SEARCH.DISTRICT
				: itemFilter.id !== item.id,
		);

		setListItemFilter({
			itemCardFilter: listItemFilter.itemCardFilter.filter((itemFilter) =>
				typeSearch === TYPE_SEARCH.PROVINCE ||
				(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
					? itemFilter.type !== TYPE_SEARCH.PROVINCE && itemFilter.type !== TYPE_SEARCH.DISTRICT
					: itemFilter.id !== item.id,
			),
			listFiltered: listFilteredNew,
		});
		if (
			typeSearch === TYPE_SEARCH.PROVINCE ||
			(typeSearch === TYPE_SEARCH.DISTRICT && listDistrict.length === 1)
		) {
			let copyListFilter = { ...listFilter };
			delete copyListFilter.districtIds;
			delete copyListFilter.provinceId;
			setListFilter(copyListFilter);
			setCheckReload(true);
		} else {
			transformParamSearch(listFilteredNew, typeSearch, true);
		}
	};

	return (
		<div
			className={`container mx-auto w-screen animation-200 pb-2 ${className || ''}`}
			ref={refContainer}
		>
			{option === OPTION_TYPE_FILTER_MODULE.DEFAULT && transformFilterBar().length ? (
				<div className='flex items-center justify-between py-2'>
					<div className='relative flex items-center'>
						{renderFilterDropdown()}
						{renderDialog()}
					</div>
					<Dropdown
						placeholder='Sắp xếp'
						classNameHeader='w-[250px] h-10'
						data={dataSortDropdown}
						classNameBody='w-[259px] right-0 rounded-3px mt-10px px-0 z-10'
						prefixIcon={<ImageCustom src={'/static/svg/Sort.svg'} width={24} height={24} />}
						classNameItem={`text-14 h-10 flex justify-between items-center px-6`}
						iconSelected={<Icon type='icon-check' variant='dark' size={15} />}
						labelHeaderFixBody='Sắp xếp'
						onChange={(value) => handleSearch({ ...listFilter, sortType: value.id })}
						defaultValue={listFilter?.sortType}
					/>
				</div>
			) : null}
			{option === OPTION_TYPE_FILTER_MODULE.MODAL && showFilter ? (
				<div className='relative flex items-center'>
					{renderFilterDropdown()}
					{renderDialog()}
				</div>
			) : null}

			{listItemFilter.listFiltered.length ? (
				<div className='mt-[11px] flex flex-wrap items-center'>
					{listItemFilter.listFiltered?.map((item, index) => {
						const checkHasProvince = listItemFilter.listFiltered.some(
							(itemFilter) => itemFilter.type === TYPE_SEARCH.PROVINCE,
						);
						const checkHasDistrict = listItemFilter.listFiltered.some(
							(itemFilter) => itemFilter.type === TYPE_SEARCH.DISTRICT,
						);
						if (item.type === TYPE_SEARCH.PROVINCE) {
							if (checkHasDistrict && checkHasProvince) return;
						}
						return (
							<div
								className='relative mr-18px mb-2 flex h-7 items-center justify-center bg-F2F2F2 px-3 text-12 font-medium'
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
									<ImageCustom src='/static/svg/closeCircle.svg' width={16} height={16} priority />
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
