import {
	PARAM_KEY_SEARCH,
	TYPE_ADDRESS_GOOGLE,
	TYPE_FILTER_PARAM,
	TYPE_PROPERTY,
	TYPE_SEARCH,
	TYPE_SHOW_FILTER,
} from 'enums';
import { SearchAggregation } from 'models';

import { ProvinceTree } from '@/models/common';

import { IItemFilter } from './filterProperty';

export const getListFilterInitParam = (
	query: any,
	listPropertyFilter: SearchAggregation,
	listProvince: ProvinceTree[] | any[],
) => {
	let listItemFilterInit: Array<IItemFilter> = [];
	const arrKeyQuery = Object.keys(query);
	arrKeyQuery.map((item) => {
		switch (item) {
			case PARAM_KEY_SEARCH.BRANDS:
				let brandParam = query[item];
				if (Array.isArray(brandParam)) {
					brandParam.map((item2: string) => {
						const index: any = listPropertyFilter?.brands?.findIndex((itemBrand) =>
							itemBrand.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
								? `${itemBrand.id}#${itemBrand.rangeValueType}` === `${item2}`
								: `${itemBrand.rangeValueId}#${itemBrand.rangeValueType}` === `${item2}`,
						);
						if (listPropertyFilter?.brands && index !== -1) {
							listItemFilterInit.push({
								id: item2,
								type: TYPE_SEARCH.BRAND,
								label: listPropertyFilter?.brands[index].name,
								typeFilterBar: TYPE_SHOW_FILTER.BRANCH,
							});
						}
					});
				} else {
					const index: any = listPropertyFilter?.brands?.findIndex((item) => {
						return item.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
							? `${item.id}#${item.rangeValueType}` === `${brandParam}`
							: `${item.rangeValueId}#${item.rangeValueType}` === `${brandParam}`;
					});
					if (listPropertyFilter?.brands && index !== -1) {
						listItemFilterInit.push({
							id: brandParam,
							type: TYPE_SEARCH.BRAND,
							label: listPropertyFilter?.brands[index].name,
							typeFilterBar: TYPE_SHOW_FILTER.BRANCH,
						});
					}
				}

				break;
			case PARAM_KEY_SEARCH.CATEGORY:
				const categoryParam = query[item];
				if (Array.isArray(categoryParam)) {
					categoryParam.map((item2: string) => {
						const index: any = listPropertyFilter?.categories?.findIndex(
							(item) => `${item.id}` === item2,
						);

						if (listPropertyFilter?.categories && index !== -1) {
							listItemFilterInit.push({
								id: Number(item2),
								type: TYPE_SEARCH.LIST,
								label: listPropertyFilter?.categories[index].name,
								typeFilterBar: TYPE_SHOW_FILTER.ORTHER,
							});
						}
					});
				} else {
					const index: any = listPropertyFilter?.categories?.findIndex((item) => {
						return `${item.id}` === categoryParam;
					});
					if (listPropertyFilter?.categories && index !== -1) {
						listItemFilterInit.push({
							id: Number(categoryParam),
							type: TYPE_SEARCH.LIST,
							label: listPropertyFilter?.categories[index].name,
							typeFilterBar: TYPE_SHOW_FILTER.ORTHER,
						});
					}
				}
				break;
			case PARAM_KEY_SEARCH.FILTER:
				const filterParam = query[item];
				if (Array.isArray(filterParam)) {
					filterParam.map((item2: string) => {
						listPropertyFilter?.properties?.forEach((itemm, indexPropery) => {
							const index1 = [...(itemm?.propertyValues || [])]?.findIndex((itemxx) =>
								itemxx.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
									? `prop_${itemm.id}:[${itemxx.id}#${itemxx.rangeValueType}]` === item2
									: `prop_${itemm.id}:[${itemxx.rangeValueId}#${itemxx.rangeValueType}]` === item2,
							);

							if (index1 !== -1) {
								listItemFilterInit.push({
									id: item2,
									label:
										[...(itemm.propertyValues || [])][index1].rangeValueType ===
										Number(TYPE_FILTER_PARAM.VALUE)
											? [...(itemm.propertyValues || [])][index1].name
											: [...(itemm.propertyValues || [])][index1].rangeValueName,
									type: TYPE_SEARCH.ORTHER,
									typeFilterBar:
										indexPropery < 2
											? itemm.type === TYPE_PROPERTY.COLOR
												? TYPE_SHOW_FILTER.COLOR
												: itemm.id
											: TYPE_SHOW_FILTER.ORTHER,
								});
							}
						});
					});
				} else {
					listPropertyFilter?.properties?.forEach((itemm, indexx) => {
						const posvalid = [...(itemm.propertyValues || [])]?.findIndex((itemxx) =>
							itemxx.rangeValueType === Number(TYPE_FILTER_PARAM.VALUE)
								? `prop_${itemm.id}:[${itemxx.id}#${itemxx.rangeValueType}]` === filterParam
								: `prop_${itemm.id}:[${itemxx.rangeValueId}#${itemxx.rangeValueType}]` ===
								  filterParam,
						);

						if (posvalid !== -1) {
							listItemFilterInit.push({
								id: filterParam,
								label:
									[...(itemm.propertyValues || [])][posvalid].rangeValueType ===
									Number(TYPE_FILTER_PARAM.VALUE)
										? [...(itemm.propertyValues || [])][posvalid].name
										: [...(itemm.propertyValues || [])][posvalid].rangeValueName,
								type: TYPE_SEARCH.ORTHER,
								typeFilterBar:
									indexx < 2
										? itemm.type === TYPE_PROPERTY.COLOR
											? TYPE_SHOW_FILTER.COLOR
											: itemm.id
										: TYPE_SHOW_FILTER.ORTHER,
							});
						}
					});
				}
				break;

			case PARAM_KEY_SEARCH.PROVINCE:
				const provinceParam = query[item];
				const index: any = listProvince?.findIndex(
					(province: ProvinceTree) => province.provinceId === Number(provinceParam),
				);

				if (index !== -1) {
					listItemFilterInit.push({
						id: Number(provinceParam),
						type: TYPE_SEARCH.PROVINCE,
						label: listProvince[index].provinceName,
						typeFilterBar: TYPE_SHOW_FILTER.PLACE,
					});
				}
				break;
			case PARAM_KEY_SEARCH.PRICE:
				const priceParam = query[item];
				if (priceParam.length > 1) {
					listItemFilterInit.push({
						id: `${priceParam[0]}-${priceParam[1]}`,
						type: TYPE_SEARCH.PRICE,
						label: `${priceParam[0]} - ${priceParam[1]}`,
						typeFilterBar: TYPE_SHOW_FILTER.RANGE_PRICE,
					});
				}
				break;
			case PARAM_KEY_SEARCH.DISTRICT:
				const paramDistrict = query[item];
				if (query[PARAM_KEY_SEARCH.PROVINCE]) {
					if (Array.isArray(paramDistrict)) {
						const indexProvinceValid = listProvince.findIndex(
							(province) => province.provinceId === Number(query[PARAM_KEY_SEARCH.PROVINCE]),
						);
						if (indexProvinceValid !== -1 && listProvince.length) {
							paramDistrict.map((districtParamID: string) => {
								const indexDistrictValid = listProvince[indexProvinceValid].children.findIndex(
									(district: any) => district.districtId === Number(districtParamID),
								);
								if (indexDistrictValid !== -1) {
									listItemFilterInit.push({
										id: Number(districtParamID),
										label: `${listProvince[indexProvinceValid].provinceName} > ${listProvince[indexProvinceValid].children[indexDistrictValid].districtName}`,
										type: TYPE_SEARCH.DISTRICT,
										typeFilterBar: TYPE_SHOW_FILTER.PLACE,
									});
								}
							});
						}
					} else {
						const indexProvinceValid = listProvince.findIndex(
							(province: ProvinceTree) =>
								province.provinceId === Number(query[PARAM_KEY_SEARCH.PROVINCE]),
						);
						if (indexProvinceValid !== -1) {
							const indexDistrictValid = listProvince[indexProvinceValid].children.findIndex(
								(district: any) => district.districtId === Number(paramDistrict),
							);
							if (indexDistrictValid !== -1) {
								listItemFilterInit.push({
									id: Number(paramDistrict),
									label: `${listProvince[indexProvinceValid].provinceName} > ${listProvince[indexProvinceValid].children[indexDistrictValid].districtName}`,
									type: TYPE_SEARCH.DISTRICT,
									typeFilterBar: TYPE_SHOW_FILTER.PLACE,
								});
							}
						}
					}
				}

				break;
			case PARAM_KEY_SEARCH.RATING:
				const ratingParam = query[item];
				if (Array.isArray(ratingParam)) {
					ratingParam.map((item2: string) => {
						listItemFilterInit.push({
							id: Number(item2) + 'sao',
							type: TYPE_SEARCH.RATING,
							label: `${item2} sao`,
							typeFilterBar: TYPE_SHOW_FILTER.ORTHER,
						});
					});
				} else {
					listItemFilterInit.push({
						id: Number(ratingParam) + 'sao',
						type: TYPE_SEARCH.RATING,
						label: `${ratingParam} sao`,
						typeFilterBar: TYPE_SHOW_FILTER.ORTHER,
					});
				}
				break;
			default:
				break;
		}
	});
	return listItemFilterInit;
};

export const getAddressFromLocationGoogleMap = (listResGoogle: any) => {
	const { PROVINCE, DISTRICT, WARD, NUM_STREET, NAME_STREET } = TYPE_ADDRESS_GOOGLE;

	let ADDRESS_DETAILS = [PROVINCE, DISTRICT, WARD, NUM_STREET, NAME_STREET];

	let address = {
		[PROVINCE]: '',
		[DISTRICT]: '',
		[WARD]: '',
		[NUM_STREET]: '',
		[NAME_STREET]: '',
	};

	if (listResGoogle.length > 0) {
		listResGoogle.forEach((item: any) => {
			item.address_components.forEach((component: any) => {
				if (!ADDRESS_DETAILS.length) {
					return;
				}

				if (ADDRESS_DETAILS.includes(component.types[0])) {
					address = {
						...address,
						[component.types[0]]: component.long_name,
					};

					const keyIndex = ADDRESS_DETAILS.indexOf(component.types[0]);
					ADDRESS_DETAILS.splice(keyIndex, 1);
				}
			});
		});
	}
	return address;
};
