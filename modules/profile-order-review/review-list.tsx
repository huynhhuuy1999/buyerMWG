import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch, useAppSelector } from 'hooks';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useState } from 'react';

import Pagination from '@/components/Pagination';
import Skeleton, { CardType } from '@/components/skeleton';
import {
	cancelListOrderEvalutions,
	customerAction,
	dataModalSelector,
	getListOrderEvalutions,
	listOrderEvalutionSelector,
} from '@/store/reducers/customerSlice';

const Skeletons = (
	<div className='flex items-center justify-between'>
		{[...new Array(4)].map((_, index) => {
			return (
				<div className='max-w-[25%] flex-[25%] px-2' key={index}>
					<Skeleton cardType={CardType.square} type='card' width={'100%'} height={400} />
				</div>
			);
		})}
	</div>
);
const DynamicEmpty = dynamic(() => import('@/components/common/emptyProduct'), { ssr: false });
const DynamicModalOrder = dynamic(
	() => import('../profile-modal-order-review/modal-order-evalution'),
	{ ssr: false, loading: () => Skeletons },
);
const pageSize: number = 8;
const ReviewList: React.FC = () => {
	const dispatch = useAppDispatch();
	const listOrderEvalution = useAppSelector(listOrderEvalutionSelector);
	const dataModal = useAppSelector(dataModalSelector);
	const [dataOrder, setDataOrder] = useState<any>();
	const [isModal, setIsModal] = useState<boolean>(false);
	const [totalObj, setTotalObj] = useState<number>(0);
	const [pageIndex, setPageIndex] = useState<number>(0);

	useEffect(() => {
		listOrderEvalution.totalObject && setTotalObj(listOrderEvalution.totalObject);
	}, [listOrderEvalution.totalObject]);

	useEffect(() => {
		if (dataModal) setDataOrder(dataModal);
	}, [dataModal]);

	const handleGetDetailItem = (item: any) => {
		setIsModal(true);
		dispatch(customerAction.setDataModal(item));
	};
	useEffect(() => {
		const params = {
			pageIndex: pageIndex,
			pageSize: pageSize,
		};
		dispatch(getListOrderEvalutions(params));
	}, []);
	useEffect(() => {
		const params = {
			pageIndex: pageIndex,
			pageSize: pageSize,
		};
		if (pageIndex === 0) {
			dispatch(getListOrderEvalutions(params));
		} else {
			dispatch(getListOrderEvalutions(params));
		}
	}, [pageIndex]);

	const handleCancelOrder = (key: number, itemProduct: any, productId: number = 0) => {
		let itemUpdateModal = { ...dataModal };
		let dataCancel: any = {
			productId: productId,
			waitingListId: itemProduct?.waitingListId,
			typeCancel: key,
		};
		const params = {
			pageIndex: pageIndex,
			pageSize: pageSize,
		};
		switch (key) {
			case 1:
				dispatch(cancelListOrderEvalutions(dataCancel)).then(() =>
					dispatch(getListOrderEvalutions(params)),
				);

				break;
			case 2:
				itemUpdateModal?.productInfo.length > 1 &&
					itemUpdateModal?.productInfo.forEach((item: any, index: number) => {
						let newArr: any[] = itemUpdateModal?.productInfo;
						if (item.productId === productId) {
							let arr = [...newArr];
							arr.splice(index, 1);
							itemUpdateModal = { ...itemUpdateModal, productInfo: arr };

							dispatch(customerAction.setDataModal(itemUpdateModal));
							dispatch(cancelListOrderEvalutions(dataCancel)).then(() =>
								dispatch(getListOrderEvalutions(params)),
							);
						}
					});
				break;

			default:
				break;
		}
	};
	return (
		<>
			<div className='shadow-[rgba(14, 14, 16, 0.06)] rounded-md h-auto bg-white py-[25px] px-[30px]'>
				{listOrderEvalution?.data?.length ? (
					<div className='mb-3 grid grid-cols-4 gap-x-7 gap-y-9 bg-white'>
						{listOrderEvalution.data.length
							? listOrderEvalution.data.map((itemOrder: any, index: number) => (
									<div key={index} className='flex items-center justify-center'>
										<div className='relative flex w-full flex-col rounded-md border border-[#cdcdcd]'>
											<div className='absolute right-[-17px] top-[-17px] flex h-8 w-8 cursor-poonClick={() => handleCancelOrder?.(typeOrder.MERCHANT, itemOrder)}inter items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'>
												<ImageCustom
													src='/static/svg/icon-close-order.svg'
													alt='close'
													width={15}
													height={15}
												/>
											</div>
											<Link href={`/`}>
												<div className='align-center flex cursor-pointer justify-start p-3'>
													<img
														className='block h-[32px] w-[32px] object-fill'
														alt='icon close'
														src={itemOrder?.merchantInfo?.pathImage}
													/>
													<span className='ml-1 block text-[14px] leading-loose text-[#333333]'>
														{itemOrder?.merchantInfo?.name}
													</span>
												</div>
											</Link>

											<div
												className={`grid h-[182px] w-full overflow-hidden ${
													itemOrder?.productInfo?.length > 1 ? 'grid-cols-2' : 'grid-cols-1'
												}  `}
											>
												{(itemOrder?.productInfo || []).map((itemProduct: any, index: number) =>
													index < 5 ? (
														<Link key={index} href={`/`}>
															<div
																className={`relative ${
																	itemOrder?.productInfo.length === 2 ? 'h-[50%]' : 'h-full'
																}  group order-4 flex-5/10  cursor-pointer items-center justify-center border  border-[#807a7a0a]`}
															>
																<img
																	className='block w-full object-cover p-2'
																	alt=''
																	src={itemProduct?.variationImage || EmptyImage}
																/>
																<div className='inset-0 z-10 bg-[#0E0E10]/20 group-hover:absolute'></div>
															</div>
														</Link>
													) : (
														<Link href={`/`}>
															<div
																className='z-100  absolute bottom-[57px] right-[26px]'
																key={index}
															>
																<span className=' text-36 text-[#d83a3a]'>
																	+{itemOrder?.productInfo.length - 3}
																</span>
															</div>
														</Link>
													),
												)}
											</div>

											<div
												onClick={() => handleGetDetailItem?.(itemOrder)}
												onKeyPress={() => handleGetDetailItem?.(itemOrder)}
												tabIndex={0}
												role={'button'}
												className='align-center flex justify-center'
											>
												{[...new Array(5)].map((_, index) => (
													<div className={`my-[10px] mx-[2px] cursor-pointer`} key={index}>
														<ImageCustom
															src='/static/svg/vector.svg'
															alt='star'
															width={24}
															height={24}
															key={index}
														/>
													</div>
												))}
											</div>
										</div>
									</div>
							  ))
							: null}
					</div>
				) : (
					<DynamicEmpty content='Danh sách chờ đánh giá trống' height='h-auto' />
				)}

				{isModal && dataOrder && (
					<DynamicModalOrder
						isModal={isModal}
						dataOrder={dataOrder ? dataOrder : null}
						onChange={(isShow) => setIsModal(isShow)}
						handleCancelOrder={handleCancelOrder}
					/>
				)}
				<div>
					<Pagination
						pageSize={pageSize}
						totalObject={totalObj}
						page={pageIndex}
						onChange={(page, pageSize) => {
							setPageIndex(page);
						}}
					/>
				</div>
			</div>
		</>
	);
};

export default ReviewList;
