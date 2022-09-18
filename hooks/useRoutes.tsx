import { Route } from 'models';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { selectedCatalogSector } from '@/store/reducers/appSlice';
import { productBreadcrumbSelector } from '@/store/reducers/productDetailSlice';

export const useRoutes = () => {
	const { pathname } = useRouter();
	const [breadcrumbs, setBreadcrumbs] = useState<Route[]>([]);
	const catalogs = useSelector(selectedCatalogSector);
	const product = useSelector(productBreadcrumbSelector);

	const dynamicSlugExtend = useMemo(() => {
		return catalogs.map((catalog) => ({ name: catalog?.name, urlSlug: catalog?.urlSlug }));
	}, [catalogs]);

	const dynamicProductSlug = useMemo(() => {
		return { name: product?.name || '', urlSlug: product?.urlSlug || '' };
	}, [product]);

	const routerList: Route[] = [
		{
			path: '',
			key: 'home',
			breadcrumbs: { name: 'Trang chủ', urlSlug: '/' },
		},
		{
			path: '[slug_extend]',
			key: 'slug-extend',
			breadcrumbs: dynamicSlugExtend,
		},
		{
			path: '[product_slug]',
			key: 'product-slug',
			breadcrumbs: dynamicProductSlug,
		},
	];

	useEffect(() => {
		let routes: Route[] = [];
		let slugs: string[] = [];
		pathname.split('/').forEach((query) => {
			slugs.push(query);
		});
		slugs.forEach((slug) => {
			const route: Route | undefined = routerList.find((route: Route) => route.path === slug);
			if (route) routes.push(route);
		});
		setBreadcrumbs(routes);

		return () => {
			slugs = [];
			routes = [];
		};
	}, [pathname, catalogs, product]);

	return { breadcrumbs };
};
