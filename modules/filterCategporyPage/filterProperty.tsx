import classNames from 'classnames';
import { ImageCustom } from 'components';
import {
	OPTION_TYPE_FILTER_MODULE,
	PARAM_KEY_SEARCH,
	TYPE_ADDRESS_GOOGLE,
	TYPE_SEARCH,
	TYPE_SHOW_FILTER,
} from 'enums';
import { useAppSelector, useProductSearch } from 'hooks';
import { IFilterCategory, ParamSearchProduct } from 'models';
import dynamic from 'next/dynamic';
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getProvincesApi } from 'services';
import { getLocationCurrent } from 'utils/methods';

import {
	IFilterBrand,
	IFilterColor,
	IFilterOther,
	IFilterPlace,
	IFilterPrice,
} from '@/components/FilterCategories';
import FilterBox from '@/components/FilterCategories/FilterBox';
import { addressTreeSelector } from '@/store/reducers/address';

import { getAddressFromLocationGoogleMap, getListFilterInitParam } from './logic';

interface IFilterProperty {
	listPropertyFilter: any;
	handleSearch: any;
	keyword?: string;
	query: any;

	option?: OPTION_TYPE_FILTER_MODULE;
	className?: string;

	page: number;
	pageSize: number;
	sortToolBar?: () => void;
	isShowFilter: boolean;
	ref?: any;
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
];

const LIMIT_FILTER_BOX = 16;

const MAX_OTHER_FILTER_DISPLAY = 2;
const FilterBrand = dynamic(
	() => import('@/components/FilterCategories/FilterBrand'),
) as React.FC<IFilterBrand>;
const FilterColor = dynamic(
	() => import('@/components/FilterCategories/FilterColor'),
) as React.FC<IFilterColor>;
const FilterOther = dynamic(
	() => import('@/components/FilterCategories/FilterOther'),
) as React.FC<IFilterOther>;
const FilterPlace = dynamic(
	() => import('@/components/FilterCategories/FilterPlace'),
) as React.FC<IFilterPlace>;
const FilterPrice = dynamic(
	() => import('@/components/FilterCategories/FilterPrice'),
) as React.FC<IFilterPrice>;

export const FilterProperty: React.FC<IFilterProperty> = React.forwardRef(
	(
		{
			listPropertyFilter,
			handleSearch,
			keyword,
			query,
			option = OPTION_TYPE_FILTER_MODULE.DEFAULT,
			className = '',
			page,
			pageSize,
			sortToolBar,
			isShowFilter,
		},
		ref,
	) => {
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

		const { data: countx, isValidating: loadingCount } = useProductSearch(
			'/product/searchresultcount',

			{
				keyword,
				brandIds: (listFilter || [])?.brandIds?.map((item: string) => item),
				isValid: true,
				// isFlashSale: false,
				// flashSaleStatus: 1,
				provinceId: listFilter?.provinceId,
				districtIds: (listFilter || [])?.districtIds?.map((item: string) => item),
				filters: (listFilter || [])?.filters?.map((item: string) => item),
				categoryId: listPropertyFilter.categories.map((cate: IFilterCategory) => cate.id),
				price: (listFilter || [])?.price?.map((item: number | string) => item),
				pageIndex: page,
				pageSize,
			},
			{ isPaused: () => !listPropertyFilter.categories.length },
		);

		useImperativeHandle(ref, () => ({
			closeModalFilter: () => setTypeFilter(-1),
			isHidden: (val: boolean) => val || false,
		}));

		useEffect(() => {
			if (refContainer.current) {
				setWidthContainer(refContainer.current.offsetWidth);
			}
		}, [refContainer]);

		useEffect(() => {
			if (!!query && listPropertyFilter?.maxPrice && !!provinceTree) {
				setListItemFilter({
					itemCardFilter: getListFilterInitParam(query, listPropertyFilter, provinceTree),
					listFiltered: getListFilterInitParam(query, listPropertyFilter, provinceTree),
				});
				setFilterListWithDefaultParam(query);
			}
		}, [query, listPropertyFilter, provinceTree]);

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

			if (listPropertyFilter?.brands?.length)
				renderField.push({ label: 'Thương hiệu', type: TYPE_SHOW_FILTER.BRANCH });

			listPropertyFilter?.properties?.length &&
				listPropertyFilter.properties.forEach(
					(element: { name: string; id: any }, index: number) => {
						if (index < MAX_OTHER_FILTER_DISPLAY) {
							renderField.push({
								label: element.name,
								type: element.name === 'Màu sắc' ? TYPE_SHOW_FILTER.COLOR : element.id,
							});
							listPropertyFilter[`${element.id}`] = element;
						}
					},
				);
			renderField.push(
				{ label: 'Khoảng giá', type: TYPE_SHOW_FILTER.RANGE_PRICE },
				{ label: 'Khu vực', type: TYPE_SHOW_FILTER.PLACE },
			);
			listPropertyFilter?.properties?.length > MAX_OTHER_FILTER_DISPLAY &&
				renderField.push({ label: 'Bộ lọc khác', type: TYPE_SHOW_FILTER.ORTHER });

			return renderField;
		};

		const handleCloseDialog = () => setTypeFilter(0);

		const renderFilterDropdown = () => {
			return transformFilterBar().map((item, index) => {
				if (!item?.label) return;

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
						className={classNames(
							className,
							`relative mr-2 cursor-pointer rounded-3px border ${
								check ? 'border-[#F05A94]' : 'border-[#E0E0E0]'
							}  p-2`,
						)}
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
								className={`${
									item.label === 'Bộ lọc khác' ? 'ml-3px' : 'mr-10px'
								} text-dark-333333`}
							>
								{item.label}
							</span>
							{item.label !== 'Bộ lọc khác' ? (
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
			setListItemFilter({ ...listItemFilter, itemCardFilter: newListItemCard });
			transformParamSearch(newListItemCard, typeSearch);
		};

		const valueDataByType = (id: number) => {
			return listPropertyFilter && listPropertyFilter[`${id}`];
		};

		const onSearch = () => {
			handleSearch(listFilter);
			setListItemFilter(
				(state: { itemCardFilter: Array<IItemFilter>; listFiltered: Array<IItemFilter> }) => ({
					...state,
					listFiltered: listItemFilter.itemCardFilter,
				}),
			);
			handleCloseDialog();
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
								count={countx?.data}
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
								count={countx?.data}
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
								count={countx?.data}
								minPrice={listPropertyFilter?.minPrice}
								maxPrice={listPropertyFilter?.maxPrice}
								priceStep={listPropertyFilter?.priceStep}
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
								className={listPropertyFilter.properties.length ? 'right-0' : 'left-0'}
							/>
						</>
					);
				case TYPE_SHOW_FILTER.PLACE:
					return (
						<>
							<Triangle />
							<FilterPlace
								onClickOutside={handleCloseDialog}
								listPlace={[]}
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
								count={countx?.data}
								defaultSelected={{
									listDefault: listItemFilter.itemCardFilter.filter(
										(item) => item.type === TYPE_SEARCH.DISTRICT,
									),
									province: Number(listFilter?.provinceId || 0),
								}}
								className={listPropertyFilter.properties.length ? 'right-0' : 'left-0'}
								getNearbyPlace={getNearbyPlace}
							/>
						</>
					);
				case TYPE_SHOW_FILTER.ORTHER:
					return (
						<>
							<Triangle />
							<FilterOther
								limitBox={LIMIT_FILTER_BOX}
								onClickOutside={handleCloseDialog}
								listData={listPropertyFilter?.properties}
								count={countx?.data}
								onSelect={(value, typeSearch) => {
									if (typeSearch === TYPE_SEARCH.ORTHER) {
										handleSelectItem(
											{ ...value, type: TYPE_SEARCH.ORTHER, typeFilterBar: typeFilter },
											TYPE_SEARCH.ORTHER,
										);
									} else {
										handleSelectItem(
											{ ...value, type: TYPE_SEARCH.LIST, typeFilterBar: typeFilter },
											TYPE_SEARCH.LIST,
										);
									}
								}}
								defaultSelected={listItemFilter.itemCardFilter}
								handleSearch={onSearch}
								handleCancel={(listPropertyId) => {
									handleCancelFilter(TYPE_SEARCH.ORTHER, listPropertyId);
								}}
								loading={loadingCount}
								className={listPropertyFilter.properties.length ? 'right-0' : 'left-0'}
							/>
						</>
					);
				default:
					if (typeFilter > 0)
						return (
							<>
								<Triangle />
								<FilterBox
									limitBox={LIMIT_FILTER_BOX}
									onClickOutside={handleCloseDialog}
									listData={valueDataByType(typeFilter)}
									count={countx?.data}
									onSelect={(value) => {
										handleSelectItem(
											{ ...value, type: TYPE_SEARCH.ORTHER, typeFilterBar: typeFilter },
											TYPE_SEARCH.ORTHER,
										);
									}}
									defaultSelected={listItemFilter.itemCardFilter}
									handleSearch={onSearch}
									handleCancel={(propertyId) => {
										handleCancelFilter(TYPE_SEARCH.ORTHER, propertyId);
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

		// setList filter and change query param
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

		// click bottom 'cancel choose'
		const handleCancelFilter = (type: number, propertyId?: Array<string>) => {
			removeFilterByType(type, propertyId);
			handleCloseDialog();
			switch (type) {
				case TYPE_SEARCH.BRAND:
					delete listFilter.brandIds;
					return;
				case TYPE_SEARCH.ORTHER:
					if (listFilter?.filters?.length) {
						let newListFilter = [...listFilter.filters];
						newListFilter = newListFilter.filter(
							(item) => !propertyId?.includes(item.split(':')[0].split(/prop_/).pop()),
						);
						setListFilter({
							...listFilter,
							filters: newListFilter,
						});
					}
					return;
				case TYPE_SEARCH.DISTRICT:
					delete listFilter.provinceId;
					delete listFilter.districtIds;
					return;
				case TYPE_SEARCH.LIST:
					delete listFilter.categoryId;
					return;
				case TYPE_SEARCH.PRICE:
					delete listFilter.price;
					return;
				default:
					return;
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
				let cloneListFilter = { ...listFilter };
				delete cloneListFilter.districtIds;
				delete cloneListFilter.provinceId;
				setListFilter(cloneListFilter);
				setCheckReload(true);
			} else {
				transformParamSearch(listFilteredNew, typeSearch, true);
			}
		};

		return (
			<div
				className={`animation-200 container mx-auto w-screen ${className || ''}`}
				ref={refContainer}
			>
				{option === OPTION_TYPE_FILTER_MODULE.DEFAULT && transformFilterBar().length ? (
					<div className='flex items-center justify-between py-4'>
						<div className='relative flex items-center '>
							{renderFilterDropdown()}
							{renderDialog()}
						</div>

						{/* <div className='flex items-center border rounded-3px border-[#E0E0E0] p-2'>
						<ImageCustom src={'/static/svg/Sort.svg'} priority width={24} height={24} />
						<span>Được mua nhiều nhất</span>
					</div> */}

						{sortToolBar?.()}
					</div>
				) : null}
				{option === OPTION_TYPE_FILTER_MODULE.MODAL && isShowFilter ? (
					<div className='relative flex w-max items-center'>
						{renderFilterDropdown()}
						{renderDialog()}
					</div>
				) : null}

				{listItemFilter.listFiltered.length && isShowFilter ? (
					<div className='mt-[11px] flex flex-wrap items-center '>
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
									className='relative mr-14px mt-10px flex h-7 items-center justify-center whitespace-nowrap bg-F2F2F2 px-3 text-12 font-medium '
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
							className='cursor-pointer whitespace-nowrap text-009ADA'
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
	},
);
