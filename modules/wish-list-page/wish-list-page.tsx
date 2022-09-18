import classNames from 'classnames';
import { Head } from 'components';
import { TITLE } from 'constants/';
import { WishListMerchants, WishListProducts } from 'modules';
import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

const WishListPage = () => {
	const route = useRouter();
	const isPageMerchant: boolean = useMemo(() => !!route.query.merchant, [route.query]);
	const title: string = isPageMerchant ? 'Nhà bán yêu thích' : 'Sản phẩm yêu thích';
	const titleDomain = `${isPageMerchant ? TITLE.RECOMMEND_SHOP : TITLE.LIKED} | ${
		process.env.NEXT_PUBLIC_DOMAIN_TITLE
	}`;
	return (
		<>
			<Head title={titleDomain}></Head>
			<p className={classNames(' pb-[16px] text-[#333333] uppercase text-[18px] font-sfpro_bold')}>
				{title}
			</p>
			<div className={`min-h-[calc(100vh_-_127px)] rounded-md bg-[#FFFFFF] p-[16px]`}>
				{isPageMerchant ? <WishListMerchants /> : <WishListProducts />}
			</div>
		</>
	);
};

export default WishListPage;
