import { IVersion } from 'models';
import { useEffect, useState } from 'react';
import { getVersion } from 'services';
import {
	addressActions,
	addressTreeSelector,
	fetchProvinceTree,
	versionAddressSelector,
} from 'store/reducers/address';
import {
	categoryActions,
	getAllCategoryRequest,
	getCatalogRequest,
	shortenAllSelector,
	versionCategorySelector,
} from 'store/reducers/categorySlide';

import { useAppDispatch, useAppSelector } from '.';

export function useVersion() {
	const dispatch = useAppDispatch();
	const [version, setVersion] = useState<IVersion>();
	const versionCategory = useAppSelector(versionCategorySelector);
	const versionProvince = useAppSelector(versionAddressSelector);

	const shortenCategory = useAppSelector(shortenAllSelector);
	const provinceTree = useAppSelector(addressTreeSelector);

	const [hasCategory, setHasCategory] = useState(true);
	const [hasAddress, setHasAddress] = useState(true);

	const checkVersion = async () => {
		let { data } = await getVersion();
		setVersion(data);
	};

	useEffect(() => {
		if (version) {
			setHasCategory(
				Boolean(versionCategory === version.versionCategory && shortenCategory?.length),
			);
			setHasAddress(Boolean(versionProvince === version.versionProvince && provinceTree?.length));
			dispatch(categoryActions.setVersion(version.versionCategory));
			dispatch(addressActions.setVersion(version.versionProvince));
		}
	}, [version]);

	useEffect(() => {
		if (!hasAddress) {
			dispatch(fetchProvinceTree());
		}
	}, [hasAddress]);

	useEffect(() => {
		if (!hasCategory) {
			dispatch(getAllCategoryRequest());
			dispatch(getCatalogRequest());
		}
	}, [hasCategory]);

	return {
		checkVersion,
		hasCategory,
		hasAddress,
		versionCategory,
		versionProvince,
		provinceTree,
		shortenCategory,
	};
}
