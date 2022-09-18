// import { homeTracking } from 'services';
import { InterParamsViewList, Skeleton, ViewList } from 'components';
import { useSuggestMerchant } from 'hooks';
import { IBrand } from 'models';
// import { useRouter } from 'next/router';
import { useState } from 'react';
interface BrandProps {
	data: Array<IBrand>;
	isNotFetchApiAll?: boolean;
	className?: string;
	isNotHeader?: boolean;
	isNotFooter?: boolean;
	loading?: boolean;
}
import CardMerchant from 'components/Card/CardMerchant';
import { useRouter } from 'next/router';
import { Icon, IconEnum } from 'vuivui-icons';

const defaultParams: InterParamsViewList = {
	page: 0,
	pageSize: 6,
};

const BrandMobile = (props: BrandProps) => {
	// eslint-disable-next-line react-hooks/rules-of-hooks
	// const { data } = (props.isNotFetchApiAll ? props : useBrand(props.data)) || [];
	// const { asPath } = useRouter();
	const [params, setParams] = useState<InterParamsViewList>(defaultParams);
	const route = useRouter();

	const { data: responseMerchants, isValidating } = useSuggestMerchant(
		'/product/suggestedmerchants',
		{
			...params,
		},
	);

	// const Skeletons = (
	// 	<div className='grid grid-cols-3 gap-2 pb-9 pt-6'>
	// 		{[...new Array(6)].map((_, index) => {
	// 			return (
	// 				<Skeleton
	// 					isDescription
	// 					key={index}
	// 					center
	// 					cardType={CardType.circle}
	// 					type='card'
	// 					width={108}
	// 					height={108}
	// 				></Skeleton>
	// 			);
	// 		})}
	// 	</div>
	// );

	// const [prod, setProd] = useState<any>([]);

	// useEffect(() => {
	// 	if (Array.isArray(data) && data?.length) setProd(data);
	// }, [data]);

	const propsViewList = {
		setItem: (item: any) => {
			return <CardMerchant data={item} />;
		},
		setLoadingCard: () => {
			return (
				<>
					{[...new Array(4)].map((_, index) => {
						return (
							<Skeleton.Skeleton
								key={index}
								cardType={Skeleton.CardType.square}
								type='card'
								width={255}
								height={347}
							></Skeleton.Skeleton>
						);
					})}
				</>
			);
		},
	};

	return !isValidating && !!responseMerchants?.data?.length ? (
		<div className='my-[6px] bg-white py-4 px-2'>
			<p className='mb-4 text-16 text-3E3E40'>Thương hiệu gợi ý</p>
			<div className='hide-scrollbar overflow-auto'>
				<ViewList
					{...propsViewList}
					loading={isValidating}
					data={responseMerchants?.data}
					pageSize={responseMerchants?.pageSize || defaultParams.pageSize}
					page={responseMerchants?.page || defaultParams.page}
					totalObject={responseMerchants?.totalRemain + responseMerchants?.data?.length}
					className={`gap-3`}
					changePage={(value: InterParamsViewList) => {
						setParams((state) => ({ ...state, page: value.page }));
					}}
					isOverFlow
					showPagination={false}
				/>
			</div>
			{responseMerchants?.totalRemain > 0 && (
				<p
					className='mt-14px flex items-center justify-center text-14 text-009ADA'
					onClick={() => route.push('/thuong-hieu-goi-y')}
					onKeyPress={() => route.push('/thuong-hieu-goi-y')}
					tabIndex={0}
					role='none'
				>
					Xem thêm ({responseMerchants?.totalRemain})
					<Icon name={IconEnum.CaretRight} size={10} color='#009ada' />
				</p>
			)}
		</div>
	) : (
		<></>
	);
};

export default BrandMobile;
