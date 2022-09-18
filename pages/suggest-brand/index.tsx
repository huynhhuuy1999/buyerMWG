import { Head, InterParamsViewList } from 'components';
import { DeviceType } from 'enums';
import { DefaultLayout, DefaultLayoutMobile } from 'layouts';
import { GetServerSideProps, NextPage } from 'next';
import { wrapper } from 'store';
import { detectCrawler, fetchingDataServer } from 'utils';

import { SuggestBrandModule, SuggestBrandModuleMobile } from '@/modules/suggestBrandModule';

interface ISuggestBrand {
	deviceType?: DeviceType;
	data: {
		listMerchantSuggest?: any;
	};
}

const defaultParams: InterParamsViewList = {
	page: 0,
	pageSize: 10,
};

const SuggestBrand: NextPage<ISuggestBrand> = ({ deviceType, data }) => {
	return (
		<>
			<Head title={`Thương hiệu gợi ý | ${process.env.NEXT_PUBLIC_DOMAIN_TITLE}`} />
			{deviceType === DeviceType.MOBILE ? (
				<DefaultLayoutMobile>
					<SuggestBrandModuleMobile data={data.listMerchantSuggest} />
				</DefaultLayoutMobile>
			) : (
				<DefaultLayout>
					<SuggestBrandModule data={data.listMerchantSuggest} />
				</DefaultLayout>
			)}
		</>
	);
};

export const getServerSideProps: GetServerSideProps | any = wrapper.getServerSideProps(
	(store) => async (ctx: any) => {
		const { req, res, query } = ctx;
		const deviceType = store?.getState()?.app?.device;
		const isDetecting = detectCrawler(req?.headers?.['user-agent']);
		const seoBotHeaders = req.headers?.['seo-bot-request'];
		if (seoBotHeaders || isDetecting || query?.bot_crawler === 'true') {
			try {
				res.setHeader('Cache-Control', 'public, s-maxage=10, stale-while-revalidate=59');
				const listMerchantSuggest = await fetchingDataServer({
					method: 'GET',
					url: `/product/suggestedmerchants`,
					configs: {
						req,
						params: defaultParams,
					},
				});
				return {
					props: {
						data: {
							listMerchantSuggest,
						},
						deviceType,
					},
				};
			} catch (error) {
				return {
					props: {
						data: {
							listMerchantSuggest: {},
						},
						deviceType,
					},
				};
			}
		}
		return {
			props: {
				data: {
					listMerchantSuggest: {},
				},
				deviceType,
			},
		};
	},
);

export default SuggestBrand;
