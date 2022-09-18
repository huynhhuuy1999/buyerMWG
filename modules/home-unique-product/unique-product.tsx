import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useUniqueProduct } from 'hooks';
import { Product } from 'models';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';
import { productActions, sessionIdSelector } from 'store/reducers/productSlice';

// import { useEffect, useState } from 'react';

const UniqueProduct = (props: any) => {
	const dispatch = useAppDispatch();
	const sessionId = useAppSelector(sessionIdSelector).unique;
	const [prod, setProd] = useState<any>([]);

	const { data, loading } = useUniqueProduct(
		props.data,
		{
			pageIndex: 0,
			pageSize: 6,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	const Skeletons = (
		<div className='grid grid-cols-1 bg-white'>
			{[...new Array(1)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						width={360}
						height={360}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	const Skeletons_4 = (
		<div className='grid grid-cols-2 gap-14px bg-white'>
			{[...new Array(4)].map((_, index) => {
				return (
					<Skeleton.Skeleton
						key={index}
						cardType={Skeleton.CardType.square}
						type='card'
						width={172}
						height={172}
					></Skeleton.Skeleton>
				);
			})}
		</div>
	);

	useEffect(() => {
		if (Array.isArray(data) && data?.length) {
			setProd(data);
			sessionId !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ unique: data[0]?.sessionId }));
		}
	}, [data]);

	return (!loading && Array.isArray(data) && data?.length) || prod?.length ? (
		<div className={`mt-4 bg-white pt-7 pb-4`}>
			<div className='container'>
				<div className={`flex ${data?.length ? 'justify-between' : ''}`}>
					<h2 className='font-sfpro_semiBold text-20 font-bold text-3E3E40 '>Sản phẩm độc đáo</h2>
					{data?.length > 0 && (
						<Link href={'/'}>
							<p className='cursor-pointer self-center font-sfpro_semiBold text-16 hover:opacity-80'>
								Xem tất cả {`>`}
							</p>
						</Link>
					)}
				</div>
				{Array.isArray(data) && data?.length ? (
					<div>
						<div className='grid grid-cols-3 gap-4 pb-4 pt-6'>
							{data?.slice(0, 1).map((item: Product, index: number) => (
								<ProductCard.ProductCard
									classNameImage='rounded-md'
									key={index}
									description={item?.title}
									price={item?.price}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									type={ProductCard.ProductType.uniqueProduct}
									onClick={() => {
										homeTracking(7);
									}}
									width={360}
									height={360}
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
									className='h-full justify-center'
								/>
							))}
							<div className='grid grid-cols-2 gap-14px'>
								{data?.slice(1, 5).map((item: Product, index: number) => (
									<ProductCard.ProductCard
										classNameImage='rounded-md'
										key={index}
										description={item?.title}
										price={item?.price}
										image={
											item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
										}
										onClick={() => {
											homeTracking(7);
										}}
										type={ProductCard.ProductType.uniqueProduct}
										width={172}
										height={172}
										path={
											item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
										}
									/>
								))}
							</div>
							{data?.slice(5, 6).map((item: Product, index: number) => (
								<ProductCard.ProductCard
									classNameImage='rounded-md'
									key={index}
									description={item?.title}
									price={item?.price}
									onClick={() => {
										homeTracking(7);
									}}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									type={ProductCard.ProductType.uniqueProduct}
									width={360}
									height={360}
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
									className='h-full justify-center'
								/>
							))}
						</div>
					</div>
				) : prod?.length > 0 ? (
					<div>
						<div className='grid grid-cols-3 gap-4 pb-4 pt-6'>
							{prod?.slice(0, 1).map((item: Product, index: number) => (
								<ProductCard.ProductCard
									classNameImage='rounded-md'
									key={index}
									description={item?.title}
									price={item?.price}
									onClick={() => {
										homeTracking(7);
									}}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									type={ProductCard.ProductType.uniqueProduct}
									width={360}
									height={360}
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
									className='h-full justify-center'
								/>
							))}
							<div className='grid grid-cols-2 gap-14px'>
								{prod?.slice(1, 5).map((item: Product, index: number) => (
									<ProductCard.ProductCard
										classNameImage='rounded-md'
										key={index}
										description={item?.title}
										price={item?.price}
										image={
											item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
										}
										onClick={() => {
											homeTracking(7);
										}}
										type={ProductCard.ProductType.uniqueProduct}
										width={172}
										height={172}
										path={
											item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
										}
									/>
								))}
							</div>
							{prod?.slice(5, 6).map((item: Product, index: number) => (
								<ProductCard.ProductCard
									classNameImage='rounded-md'
									key={index}
									description={item?.title}
									onClick={() => {
										homeTracking(7);
									}}
									price={item?.price}
									image={
										item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
									}
									type={ProductCard.ProductType.uniqueProduct}
									width={360}
									height={360}
									path={item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'}
									className='h-full justify-center'
								/>
							))}
						</div>
					</div>
				) : (
					<div>
						<div className='grid grid-cols-3 gap-4 pb-9 pt-6'>
							{Skeletons}
							{Skeletons_4}
							{Skeletons}
						</div>
					</div>
				)}
			</div>
		</div>
	) : (
		<></>
	);
};

export default UniqueProduct;
