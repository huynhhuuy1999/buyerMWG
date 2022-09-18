import classNames from 'classnames';
import { Head } from 'components';
import { TITLE } from 'constants/';
import { WishListMerchantsMobile, WishListProductsMobile } from 'modules';
import { useRouter } from 'next/router';
import React from 'react';

const WishListPageMobile = () => {
	const route = useRouter();

	const title: string = route.query.merchant ? 'Nhà bán yêu thích' : 'Sản phẩm yêu thích';
	const titleDomain = `${route.query.merchant ? TITLE.RECOMMEND_SHOP : TITLE.LIKED} | ${
		process.env.NEXT_PUBLIC_DOMAIN_TITLE
	}`;
	return (
		<>
			<Head title={titleDomain}></Head>
			<p className={classNames(' text-[#333333] uppercase text-[18px] font-sfpro_bold')}>{title}</p>
			<div className={`bg-[#FFFFFF] p-[16px]`}>
				{route.query.merchant ? <WishListMerchantsMobile /> : <WishListProductsMobile />}
			</div>
		</>
	);
};

export default WishListPageMobile;
