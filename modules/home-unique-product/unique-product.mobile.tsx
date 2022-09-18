import { ProductCard, Skeleton } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector, useUniqueProduct } from 'hooks';
import { Product } from 'models';
import { useEffect, useState } from 'react';
import { homeTracking } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';

import { productActions, sessionIdSelector } from '@/store/reducers/productSlice';

const UniqueProductMobile = (props: any) => {
	const dispatch = useAppDispatch();
	const sessionId = useAppSelector(sessionIdSelector).unique;
	const [prod, setProd] = useState<any>([]);

	const { data, totalRemain, loading } = useUniqueProduct(
		props.data,
		{
			pageIndex: 0,
			pageSize: 6,
			sessionId: sessionId,
		},
		prod?.length === 0,
	);

	const [total, setTotal] = useState<number>(0);

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

	useEffect(() => {
		if (Array.isArray(data) && data?.length) {
			setProd(data);
			sessionId !== data[0]?.sessionId &&
				dispatch(productActions.setSessionId({ unique: data[0]?.sessionId }));
		}
		if (totalRemain) setTotal(totalRemain);
	}, [data]);

	return (!loading && Array.isArray(data) && data?.length) || prod?.length ? (
		<div className='mt-[6px] bg-white pt-7 pb-6'>
			<h2 className='container mb-2 pb-4 text-16 text-3E3E40'>Sản phẩm độc đáo</h2>
			{(Array.isArray(data) && data?.length) || prod?.length ? (
				<>
					<div className='mx-auto grid max-w-[360px] grid-flow-col grid-cols-3  grid-rows-2 gap-2'>
						<div className='col-span-2 row-span-2 row-start-1 row-end-3 flex h-full w-full self-center'>
							{Array.isArray(data)
								? data?.slice(0, 1)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											key={index}
											animation={false}
											description={item.description}
											price={item.price}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											onClick={() => {
												homeTracking(7);
											}}
											classNameImage='rounded-md w-full h-full'
											className='h-full w-full place-content-center'
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='224px'
											height='224px'
										/>
								  ))
								: prod?.length > 0 &&
								  prod?.slice(0, 1)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											key={index}
											// description={item.description}
											animation={false}
											price={item.price}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											onClick={() => {
												homeTracking(7);
											}}
											type={ProductCard.ProductType.uniqueProduct}
											classNameImage='rounded-md w-full h-full'
											className='h-full w-full place-content-center'
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='224px'
											height='224px'
										/>
								  ))}
						</div>
						<div className='row-span-2 gap-2'>
							{Array.isArray(data)
								? data?.slice(1, 2)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											classNameImage='rounded-md'
											animation={false}
											key={index}
											onClick={() => {
												homeTracking(7);
											}}
											// description={item.description}
											price={item.price}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='108px'
											height='108px'
										/>
								  ))
								: prod?.length > 0 &&
								  prod?.slice(1, 2)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											classNameImage='rounded-md'
											key={index}
											// description={item.description}
											animation={false}
											price={item.price}
											onClick={() => {
												homeTracking(7);
											}}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='108px'
											height='108px'
										/>
								  ))}
							{Array.isArray(data) &&
								data?.slice(2, 3)?.map((item: Product, index: number) => (
									<ProductCard.ProductCard
										classNameImage='rounded-md'
										key={index}
										// description={item.description}
										price={item.price}
										animation={false}
										image={
											item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
										}
										type={ProductCard.ProductType.uniqueProduct}
										onClick={() => {
											homeTracking(7);
										}}
										className='mt-4'
										path={
											item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
										}
										width='108px'
										height='108px'
									/>
								))}
						</div>
					</div>
					<div className='mx-auto mt-4 grid max-w-[360px] grid-flow-col grid-cols-3  grid-rows-2 gap-2'>
						<div className='row-span-2 gap-4'>
							{Array.isArray(data)
								? data?.slice(3, 4)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											classNameImage='rounded-md'
											key={index}
											animation={false}
											// description={item.description}
											price={item.price}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											onClick={() => {
												homeTracking(7);
											}}
											type={ProductCard.ProductType.uniqueProduct}
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='108px'
											height='108px'
										/>
								  ))
								: prod?.length > 0 &&
								  prod?.slice(3, 4)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											classNameImage='rounded-md'
											key={index}
											// description={item.description}
											price={item.price}
											animation={false}
											onClick={() => {
												homeTracking(7);
											}}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='108px'
											height='108px'
										/>
								  ))}
							{Array.isArray(data)
								? data?.slice(4, 5)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											classNameImage='rounded-md'
											key={index}
											// description={item.description}
											animation={false}
											price={item.price}
											onClick={() => {
												homeTracking(7);
											}}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											className='mt-4'
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='108px'
											height='108px'
										/>
								  ))
								: prod?.length > 0 &&
								  prod?.slice(4, 5)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											classNameImage='rounded-md'
											key={index}
											animation={false}
											onClick={() => {
												homeTracking(7);
											}}
											// description={item.description}
											price={item.price}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											className='mt-4'
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='108px'
											height='108px'
										/>
								  ))}
						</div>
						<div className='col-span-2 row-span-2 row-start-1 row-end-3 flex h-full w-full self-center'>
							{Array.isArray(data)
								? data?.slice(5, 6)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											key={index}
											// description={item?.title}
											animation={false}
											price={item?.price}
											onClick={() => {
												homeTracking(7);
											}}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											classNameImage='rounded-md w-full h-full'
											className='h-full w-full place-content-center'
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='224px'
											height='224px'
										/>
								  ))
								: prod?.length > 0 &&
								  prod?.slice(5, 6)?.map((item: Product, index: number) => (
										<ProductCard.ProductCard
											key={index}
											onClick={() => {
												homeTracking(7);
											}}
											animation={false}
											// description={item?.title}
											price={item?.price}
											image={
												item?.variations?.length ? item?.variations[0]?.variationImage : EmptyImage
											}
											type={ProductCard.ProductType.uniqueProduct}
											classNameImage='rounded-md w-full h-full'
											className='h-full w-full place-content-center'
											path={
												item?.categoryUrlSlug ? `/${item?.categoryUrlSlug}/${item?.urlSlug}` : '#'
											}
											width='224px'
											height='224px'
										/>
								  ))}
						</div>
					</div>
				</>
			) : (
				Skeletons
			)}

			{total > 0 && (
				<p className='mt-14px flex items-center justify-center text-14 text-009ADA'>
					Xem thêm ({total})
					<Icon name={IconEnum.CaretRight} size={10} color='#009ada' />
				</p>
			)}
		</div>
	) : (
		<></>
	);
};

export default UniqueProductMobile;
