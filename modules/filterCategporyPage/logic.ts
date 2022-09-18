import {
	PARAM_KEY_SEARCH,
	TYPE_ADDRESS_GOOGLE,
	TYPE_FILTER_PARAM,
	TYPE_PROPERTY,
	TYPE_SEARCH,
	TYPE_SHOW_FILTER,
} from 'enums';
import { IResponseSearchAggregation, ProvinceTree } from 'models';
import { PropertyValueFiller, ResponseFilterProperty } from 'modules/category-page/entities';

import { IItemFilter } from './filterProperty';

export const getListFilterInitParam = (
	query: any,
	listPropertyFilter: IResponseSearchAggregation,
	listProvince: ProvinceTree[],
) => {
	let listItemFilterInit: Array<IItemFilter> = [];
	let arrKeyQuery = Object.keys(query);

	const newlistPropertyFilter = new ResponseFilterProperty(listPropertyFilter)


	arrKeyQuery.map((item) => {
		switch (item) {
			case PARAM_KEY_SEARCH.BRANDS:
				let brandParam = query[item]
				if (Array.isArray(brandParam)) {
					brandParam.map((item2: string) => {
						let index: any = newlistPropertyFilter?.brands?.findIndex(
							(itemBrand: any) => itemBrand.getId() === `${item2}`,
						);

						if (newlistPropertyFilter?.brands && index !== -1) {
							listItemFilterInit.push({
								id: item2,
								type: TYPE_SEARCH.BRAND,
								label: newlistPropertyFilter?.brands[index].name,
								typeFilterBar: TYPE_SHOW_FILTER.BRANCH,
							});
						}
					});
				} else {
					if (newlistPropertyFilter?.brands) {
						let index: any = newlistPropertyFilter.brands.findIndex(
							(item: any) => item.getId() === `${brandParam}`,
						);

						if (index !== -1) {
							listItemFilterInit.push({
								id: brandParam,
								type: TYPE_SEARCH.BRAND,
								label: newlistPropertyFilter?.brands[index].name,
								typeFilterBar: TYPE_SHOW_FILTER.BRANCH,
							});
						}
					}
				}
				break;
			case PARAM_KEY_SEARCH.FILTER:
				let filterParam = query[item];

				if (Array.isArray(filterParam)) {
					filterParam.forEach((item2: string) => {
						newlistPropertyFilter?.properties?.forEach(
							(itemm: PropertyValueFiller, indexPropery: number) => {
								let index1 = [...(itemm?.propertyValues || [])]?.findIndex(
									(itemxx) => itemxx.getId() === item2,
								);

								if (index1 !== -1) {
									listItemFilterInit.push({
										id: item2,
										label:
											[...(itemm.propertyValues || [])][index1].rangeValueType ===
												Number(TYPE_FILTER_PARAM.RANGE_VALUE)
												? [...(itemm.propertyValues || [])][index1].rangeValueName
												: [...(itemm.propertyValues || [])][index1].name,

										type: TYPE_SEARCH.ORTHER,
										typeFilterBar:
											indexPropery < 2
												? itemm.type === TYPE_PROPERTY.COLOR
													? TYPE_SHOW_FILTER.COLOR
													: itemm.id
												: TYPE_SHOW_FILTER.ORTHER,
									});
								}
							},
						);
					});
				} else {
					newlistPropertyFilter?.properties?.forEach((itemm: PropertyValueFiller, indexx: number) => {
						let posvalid = [...(itemm.propertyValues || [])]?.findIndex(
							(itemxx) => itemxx.getId() === filterParam,
						);
						if (posvalid !== -1) {
							listItemFilterInit.push({
								id: filterParam,
								label:
									[...(itemm.propertyValues || [])][posvalid].rangeValueType ===
										Number(TYPE_FILTER_PARAM.RANGE_VALUE)
										? [...(itemm.propertyValues || [])][posvalid].rangeValueName
										: [...(itemm.propertyValues || [])][posvalid].name,

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
				let provinceParam = query[item];
				let index: any = listProvince?.findIndex(
					(province: any) => province.id === Number(provinceParam),
				);

				if (index !== -1) {
					listItemFilterInit.push({
						id: Number(provinceParam),
						type: TYPE_SEARCH.PROVINCE,
						label: listProvince[index].name,
						typeFilterBar: TYPE_SHOW_FILTER.PLACE,
					});
				}
				break;
			case PARAM_KEY_SEARCH.PRICE:
				let priceParam = query[item];
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
				let paramDistrict = query[item];
				if (query[PARAM_KEY_SEARCH.PROVINCE]) {
					if (Array.isArray(paramDistrict)) {
						let indexProvinceValid = listProvince.findIndex(
							(province: any) => province.id === Number(query[PARAM_KEY_SEARCH.PROVINCE]),
						);
						if (indexProvinceValid !== -1 && listProvince.length) {
							paramDistrict.map((districtParamID: string) => {
								let indexDistrictValid = listProvince[indexProvinceValid].children.findIndex(
									(district: any) => district.id === Number(districtParamID),
								);
								if (indexDistrictValid !== -1) {
									listItemFilterInit.push({
										id: Number(districtParamID),
										label: `${listProvince[indexProvinceValid].name} > ${listProvince[indexProvinceValid].children[indexDistrictValid].name}`,
										type: TYPE_SEARCH.DISTRICT,
										typeFilterBar: TYPE_SHOW_FILTER.PLACE,
									});
								}
							});
						}
					} else {
						let indexProvinceValid = listProvince.findIndex(
							(province: any) => province.id === Number(query[PARAM_KEY_SEARCH.PROVINCE]),
						);
						if (indexProvinceValid !== -1) {
							let indexDistrictValid = listProvince[indexProvinceValid].children.findIndex(
								(district: any) => district.id === Number(paramDistrict),
							);
							if (indexDistrictValid !== -1) {
								listItemFilterInit.push({
									id: Number(paramDistrict),
									label: `${listProvince[indexProvinceValid].name} > ${listProvince[indexProvinceValid].children[indexDistrictValid].name}`,
									type: TYPE_SEARCH.DISTRICT,
									typeFilterBar: TYPE_SHOW_FILTER.PLACE,
								});
							}
						}
					}
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
