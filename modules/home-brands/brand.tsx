import { InterParamsViewList as InterParams, ViewList } from 'components';
import { IBrand } from 'models';
import Link from 'next/link';
// import { useRouter } from 'next/router';
import { useState } from 'react';

import CardMerchant from '@/components/Card/CardMerchant';
import Skeleton, { CardType } from '@/components/skeleton';
import { useSuggestMerchant } from '@/hooks/useSuggestMerchants';

// const BRAND_SUGGESTION = '/thuong-hieu-goi-y/val';
// const DEFAULT_TOTAL_BRANDS = 6;
interface BrandProps {
	data: Array<IBrand>;
	isNotFetchApiAll?: boolean;
	className?: string;
	isNotHeader?: boolean;
	isNotFooter?: boolean;
	loading?: boolean;
}

const defaultParams: InterParams = {
	page: 0,
	pageSize: 8,
};

const Brand = (props: BrandProps) => {
	// const isNotHeader = useMemo(() => props.isNotHeader, [props.isNotHeader]);
	// const isNotFooter = useMemo(() => props.isNotFooter, [props.isNotFooter]);
	// const { asPath } = useRouter();
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [params, setParams] = useState<InterParams>(defaultParams);

	const { data: responseMerchants, isValidating } = useSuggestMerchant(
		'/product/suggestedmerchants',
		{
			...params,
		},
	);

	const Skeletons = (
		<div className={'bg-white mt-4 pt-8 ' + props.className}>
			<div className='container'>
				<div className={`flex ${responseMerchants?.totalRemain > 0 ? 'justify-between' : ''}`}>
					<p className='font-sfpro_semiBold text-20 text-3E3E40 '>Thương hiệu gợi ý</p>
					{responseMerchants?.totalRemain > 0 && (
						<Link href={'/thuong-hieu-goi-y'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				<div className='grid grid-cols-4 pt-6 pb-9'>
					{[...new Array(4)].map((_, index) => {
						return (
							<Skeleton
								key={index}
								cardType={CardType.square}
								type='card'
								width={255}
								height={325}
								isDescription
							></Skeleton>
						);
					})}
				</div>{' '}
			</div>
		</div>
	);
	const propsViewList = {
		setItem: (item: any) => {
			return <CardMerchant data={item} />;
		},
		setLoadingCard: () => {
			return (
				<>
					{[...new Array(8)].map((_, index) => {
						return (
							<Skeleton
								key={index}
								cardType={CardType.square}
								type='card'
								width={255}
								height={353}
								isDescription
							></Skeleton>
						);
					})}
				</>
			);
		},
	};

	return isValidating ? (
		Skeletons
	) : responseMerchants?.data?.length ? (
		<div className={'bg-white mt-4 pt-8 ' + props.className}>
			<div className='container'>
				<div className={`flex ${responseMerchants?.totalRemain > 0 ? 'justify-between' : ''}`}>
					<p className='font-sfpro_semiBold text-20 text-3E3E40 '>Thương hiệu gợi ý</p>
					{responseMerchants?.totalRemain > 0 && (
						<Link href={'/thuong-hieu-goi-y'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				<div className='hide-scrollbar container overflow-auto pt-6'>
					<ViewList
						{...propsViewList}
						loading={isValidating}
						data={responseMerchants?.data}
						pageSize={responseMerchants?.pageSize || defaultParams.pageSize}
						page={responseMerchants?.page || defaultParams.page}
						totalObject={responseMerchants?.totalRemain + responseMerchants?.data?.length}
						className={`gap-3`}
						changePage={(value: InterParams) => {
							setParams((state) => ({ ...state, page: value.page }));
						}}
						showPagination={false}
					/>
				</div>
			</div>
		</div>
	) : (
		<></>
	);
};

export default Brand;
