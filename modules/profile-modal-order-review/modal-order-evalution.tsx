/* eslint-disable */
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch } from 'hooks';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updateMultiFile } from 'services';

import IconPicker from '@/components/IconPicker';
import ModalProductDetail from '@/components/Modal/ModalProductDetail';
import {
	customerAction,
	getListOrderEvalutions,
	updateListOrderEvalutions,
} from '@/store/reducers/customerSlice';

const DynamicSpin = dynamic(() => import('@/components/spinning'), { ssr: false });
interface RulesProps {
	onChange: (show: boolean) => void;
	isModal?: boolean;
	dataOrder?: any;
	pageIndex?: number;
	handleCancelOrder?: (key: number, waitingListId: string, productId: number) => void;
}
interface RulesMedia {
	mediaType: number;
	name: string;
	description: string;
	filePath: string;
}

interface CheckLoading {
	key: number;
	productId: number;
	isLoading: boolean;
}
const typeOrder = {
	MERCHANT: 1,
	PRODUCT: 2,
};
const ModalOrder: React.FC<RulesProps> = ({
	onChange,
	isModal,
	dataOrder,
	handleCancelOrder,
	pageIndex,
}) => {
	let objMerchant: any = {
		ratingStar: 0,
		comment: {
			content: '',
			media: [
				{
					name: '',
					description: '',
					filePath: '',
					mediaType: 0,
				},
			],
		},
	};
	let objProduct: any = {
		productId: 0,
		ratingStar: 0,
		comment: {
			parentCommentId: '',
			ratingId: '',
			content: '',
			media: [
				{
					name: '',
					description: '',
					filePath: '',
					mediaType: 0,
				},
			],
			targetUserId: '',
			productId: 0,
			isQuestion: true,
		},
	};
	const dispatch = useAppDispatch();

	const [dataRender, setDataRender] = useState<any>({});
	const [showModal, setShowModal] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [checkLoadingUpload, setCheckLoadingUpload] = useState<CheckLoading>({
		key: 0,
		productId: 0,
		isLoading: false,
	});

	const [listMedia, setListMedia] = useState<any>({
		listImages: [],
		listVideos: [],
	});

	const [isOpenModal, setIsOpenModal] = useState<any>({
		defaultActiveImage: 0,
		isActive: false,
	});
	let newListImage: any = [...listMedia.listImages];
	let newListVideo: any = [...listMedia.listVideos];
	const {
		control,
		handleSubmit,
		formState: {},
	} = useForm<any>({ mode: 'onSubmit' });

	useEffect(() => {
		if (!showModal) {
			setListMedia({ listImages: [], listVideos: [] });
			newListImage = [];
			newListVideo = [];
		}
	}, [showModal]);

	useEffect(() => {
		dataOrder && setDataRender(dataOrder);
		setCheckLoadingUpload({ key: 0, productId: 0, isLoading: false });
	}, [dataOrder]);

	const onClickImage = (index: number, key: number, indexDetail: number = 0) => {
		switch (key) {
			case typeOrder.MERCHANT:
				let newArrayMedia = dataRender?.merchantInfo?.listMedia;
				newArrayMedia.length &&
					newArrayMedia.forEach((itemMedia: any) => {
						if (itemMedia.type === 'mp4') {
							newListVideo.push({ content: itemMedia.url, type: 1, order: 1 });
						} else {
							newListImage.push({ content: itemMedia.url, type: 1, order: 1 });
						}
					});
				setListMedia({ listImages: newListImage, listVideos: newListVideo });
				break;
			case typeOrder.PRODUCT:
				let newArrayPro = dataRender?.productInfo?.[indexDetail];
				newArrayPro?.listMedia?.map((itemMedia: any) => {
					if (itemMedia.type === 'mp4') {
						newListVideo.push({ content: itemMedia.url, order: 1, type: 1 });
					} else {
						newListImage.push({ content: itemMedia.url, order: 1, type: 1 });
					}
				});

				setListMedia({ listImages: newListImage, listVideos: newListVideo });
				break;

			default:
				break;
		}
		setShowModal(true);
		setIsOpenModal({
			defaultActiveImage: index + 1,
			isActive: true,
		});
	};
	const hanldeDeleteImage = (key: number, index: number, productId: number = 0) => {
		switch (key) {
			case typeOrder.MERCHANT:
				let itemRemoveMer = [...dataRender.merchantInfo?.listMedia];
				itemRemoveMer?.splice(index, 1);
				const newDataMer = {
					...dataRender,
					merchantInfo: {
						...dataRender.merchantInfo,
						isSuccess: '',
						isError: '',
						listMedia: itemRemoveMer,
					},
				};
				dispatch(customerAction.setDataModal(newDataMer));
				break;
			case typeOrder.PRODUCT:
				let itemRemovePro = [...dataRender.productInfo?.[productId]?.listMedia];
				itemRemovePro?.splice(index, 1);
				const newProduct = dataRender.productInfo.map((itemPro: any, indexPro: Number) => {
					if (indexPro === productId) {
						return { ...itemPro, isSuccess: '', isError: '', listMedia: itemRemovePro };
					} else return itemPro;
				});
				const newDataPro = {
					...dataRender,
					productInfo: newProduct,
				};
				dispatch(customerAction.setDataModal(newDataPro));
				break;

			default:
				break;
		}
	};
	const handleUpdateFile = (e: any, id: number, key: number) => {
		let fileSize: number = 0;
		let fileType: string = '';
		const serviceName = 'rating';
		const file = e.target.files;
		const arrFile = Object.keys(file);

		setCheckLoadingUpload({ key: key, productId: id, isLoading: true });
		for (let i = 0; i < arrFile.length; i++) {
			fileSize = file?.[i].size / 1024 / 1024;
			fileType = file?.[i].type;
		}
		if (arrFile.length > 6) {
			switch (key) {
				case typeOrder.MERCHANT:
					const newData = {
						...dataRender,
						merchantInfo: {
							...dataRender.merchantInfo,
							isLength: 'Tối đa 6 ảnh hoặc video!',
						},
					};
					dispatch(customerAction.setDataModal(newData));
					break;
				case typeOrder.PRODUCT:
					const newArrayProduct =
						dataRender &&
						dataRender?.productInfo.map((item: any, index: number) => {
							if (item.productId === id) {
								return {
									...item,
									isLength: 'Tối đa chọn 6 ảnh hoặc video!',
								};
							}
							return item;
						});
					const newDataProduct = { ...dataRender, productInfo: newArrayProduct };
					dispatch(customerAction.setDataModal(newDataProduct));
					break;
				default:
					break;
			}
			return;
		}
		if (
			!(
				fileType === 'image/svg+xml' ||
				fileType === 'image/jpg+xml' ||
				fileType === 'image/jpeg+xml' ||
				fileType === 'video/mp4'
			)
		) {
			switch (key) {
				case typeOrder.MERCHANT:
					const newData = {
						...dataRender,
						merchantInfo: {
							...dataRender.merchantInfo,
							isSuccess: '',
							isLength: '',
							isError: 'File ảnh hoặc video không đúng định dạng!',
						},
					};
					setCheckLoadingUpload({ key: key, productId: id, isLoading: false });
					dispatch(customerAction.setDataModal(newData));
					break;
				case typeOrder.PRODUCT:
					const newArrayProduct =
						dataRender &&
						dataRender?.productInfo.map((item: any, index: number) => {
							if (item.productId === id) {
								return {
									...item,
									isSuccess: '',
									isLength: '',
									isError: 'File ảnh hoặc video không đúng định dạng!',
								};
							}
							return item;
						});
					const newDataProduct = { ...dataRender, productInfo: newArrayProduct };
					setCheckLoadingUpload({ key: key, productId: id, isLoading: false });
					dispatch(customerAction.setDataModal(newDataProduct));
					break;
				default:
					break;
			}
			return;
		}
		if (!(fileSize < 5)) {
			switch (key) {
				case typeOrder.MERCHANT:
					const newData = {
						...dataRender,
						merchantInfo: {
							...dataRender.merchantInfo,
							isError: 'Kích cỡ ảnh hoặc video quá lớn!',
						},
					};
					setCheckLoadingUpload({ key: key, productId: id, isLoading: false });
					dispatch(customerAction.setDataModal(newData));
					break;
				case typeOrder.PRODUCT:
					const newArrayProduct =
						dataRender &&
						dataRender?.productInfo.map((item: any, index: number) => {
							if (item.productId === id) {
								return {
									...item,
									isError: 'Kích cỡ ảnh hoặc video quá lớn!',
								};
							}
							return item;
						});
					setCheckLoadingUpload({ key: key, productId: id, isLoading: false });
					const newDataProduct = { ...dataRender, productInfo: newArrayProduct };
					dispatch(customerAction.setDataModal(newDataProduct));
					break;
				default:
					break;
			}
			return;
		}
		let form_data: FormData = new FormData();
		for (let key in file) {
			form_data.append('files', file[key]);
		}

		updateMultiFile(serviceName, form_data, (event: any) =>
			setProgress(Math.round(100 * event.loaded) / event.total),
		)
			.then((resp: any) => {
				if (resp.data && !resp.isError) {
					const newDataResponse = resp.data.map((item: any) => {
						const name = item.fileName.split('.');

						return { ...item, type: name[1] };
					});
					switch (key) {
						case typeOrder.MERCHANT:
							const newData = {
								...dataRender,
								merchantInfo: {
									...dataRender.merchantInfo,
									isSuccess: 'Tải ảnh hoặc video thành công!',
									isError: '',
									isLength: '',
									listMedia: [...(dataRender.merchantInfo?.listMedia ?? []), ...newDataResponse],
								},
							};
							dispatch(customerAction.setDataModal(newData));
							break;
						case typeOrder.PRODUCT:
							const newArrayProduct =
								dataRender &&
								dataRender?.productInfo.map((item: any, index: number) => {
									if (item.productId === id) {
										return {
											...item,
											isSuccess: 'Tải ảnh hoặc video thành công!',
											isError: '',
											isLength: '',
											listMedia: [
												...(dataRender.productInfo?.[index].listMedia ?? []),
												...newDataResponse,
											],
										};
									}
									return item;
								});
							const newDataProduct = { ...dataRender, productInfo: newArrayProduct };
							dispatch(customerAction.setDataModal(newDataProduct));
							break;
						default:
							break;
					}
				}
			})
			.catch((err: any) => {});
	};

	const onClickStar = (index: number, item: any, key: number) => {
		switch (key) {
			case 1:
				const newItem = { ...item, statusRating: index + 1 };
				const newData = { ...dataRender, merchantInfo: newItem };
				dispatch(customerAction.setDataModal(newData));
				break;
			case 2:
				const newDataProduct = dataRender?.productInfo.map((itemPro: any) => {
					if (itemPro.productId === item.productId) {
						return { ...itemPro, statusRating: index + 1 };
					}
					return itemPro;
				});
				const newDataRender = { ...dataRender, productInfo: newDataProduct };
				dispatch(customerAction.setDataModal(newDataRender));
				break;
			default:
				break;
		}
	};

	const onResetData = (status: boolean) => {
		onChange(status);
	};

	const onSubmitForm = (data: any) => {
		let mediaMerchant: RulesMedia[] = [];
		let mediaProduct: RulesMedia[] = [];
		let listProduct: any = [];
		dataRender.merchantInfo?.listMedia?.length &&
			dataRender.merchantInfo?.listMedia?.forEach((itemMer: any, index: any) => {
				const newMedia = {
					mediaType: 0,
					name: itemMer.fileName,
					description: itemMer.fileName,
					filePath: itemMer.url,
				};
				mediaMerchant.push(newMedia);
			});

		objMerchant = {
			ratingStar: dataRender.merchantInfo?.statusRating,
			comment: {
				content: data.content,
				media: mediaMerchant,
			},
		};
		dataRender &&
			dataRender.productInfo?.forEach((itemProduct: any, indexProduct: number) => {
				itemProduct?.listMedia?.length &&
					itemProduct?.listMedia?.forEach((itemMedia: any) => {
						const newMedia = {
							mediaType: 0,
							description: itemMedia.fileName,
							name: itemMedia.fileName,
							filePath: itemMedia.url,
						};
						mediaProduct.push(newMedia);
					});
				objProduct = {
					...objProduct,
					productId: itemProduct.productId,
					ratingStar: itemProduct.statusRating,
					comment: {
						...objProduct.comment,
						media: mediaProduct,
						content: data?.content + `${indexProduct}`,
						productId: itemProduct.productId,
					},
				};
				listProduct.push(objProduct);
			});

		const dataSubmit: any = {
			waitingListId: dataOrder?.waitingListId,
			merchants: objMerchant,
			products: listProduct,
		};
		const params = {
			pageIndex: pageIndex,
			pageSize: 8,
		};
		dataSubmit &&
			dispatch(updateListOrderEvalutions(dataSubmit)).then((resp: any) => {
				if (resp && resp.type === 'rating/waitinglist/fulfilled') {
					dispatch(getListOrderEvalutions(params));
				}
			});

		onChange(false);
	};

	const renderBodyModal = () => {
		return (
			<div>
				<div>
					<div>
						<div className='flex items-center justify-between border-b border-dashed pb-[16px]'>
							<div className='text-base font-bold uppercase'>Đánh giá shop</div>
							<div className='flex items-center justify-between'>
								<div style={{ width: '32px', height: '32px', position: 'relative' }}>
									<ImageCustom
										src={dataRender?.merchantInfo?.pathImage || EmptyImage}
										alt='avatar'
										layout='fill'
										objectFit='contain'
									/>
								</div>

								<span className='ml-[8px] text-base font-bold uppercase'>
									{dataOrder?.merchantInfo?.name}
								</span>
							</div>
							<div></div>
						</div>
					</div>

					<div className='flex items-center justify-center'>
						{[...new Array(dataRender?.merchantInfo?.statusRating)].length
							? [...new Array(dataRender?.merchantInfo?.statusRating)].map((_, index) => (
									<div
										onClick={() => onClickStar(index, dataRender?.merchantInfo, typeOrder.MERCHANT)}
										className={`m-4 cursor-pointer`}
										key={index}
									>
										<ImageCustom
											src='/static/svg/vector-pink.svg'
											alt='star'
											width={32}
											height={32}
										/>
									</div>
							  ))
							: null}

						{[...new Array(5 - dataRender?.merchantInfo?.statusRating || 0)].length
							? [...new Array(5 - dataRender?.merchantInfo?.statusRating || 0)].map((_, index) => (
									<div
										onClick={() =>
											onClickStar(
												index + dataRender?.merchantInfo?.statusRating || 0,
												dataRender?.merchantInfo,
												typeOrder.MERCHANT,
											)
										}
										key={index}
										className={`m-4 cursor-pointer`}
									>
										<ImageCustom
											src='/static/svg/vector.svg'
											alt='star'
											width={32}
											height={32}
											key={index}
										/>
									</div>
							  ))
							: null}
					</div>
					<span className='block text-center text-sm text-[#666666]'>Tuyệt vời</span>
				</div>
				<div className='flex w-full items-center justify-between py-5'>
					<form onSubmit={handleSubmit(onSubmitForm)} className='z-1 relative w-full'>
						<Controller
							control={control}
							name='content'
							render={({ field: { onChange } }) => (
								<div className='block h-auto w-full border p-0 focus:text-gray-700 focus:outline-none'>
									<IconPicker onChange={onChange} placeholder='Viết nội dung đánh giá' />
								</div>
							)}
						/>

						<div className=''>
							<span className='text-sm text-[#333333]'>Chọn/Chụp hình ảnh tải lên</span>
							<div className='m-4 w-full'>
								<div className='flex items-center justify-start'>
									<label
										className={`relative mx-2 flex h-[80px] w-[80px] flex-col rounded border border-dashed border-[#126BFB] hover:border-[#126BFB] hover:bg-gray-100  ${
											progress > 99 || progress < 1 ? 'bg-[#ffffff]' : 'bg-[#f5f0f0]'
										}`}
									>
										<div className='flex flex-col items-center justify-center pt-7'>
											<ImageCustom
												width={24}
												height={24}
												priority
												className='w-auto'
												src={'/static/svg/vector-add.svg'}
											/>
										</div>

										<input
											type='file'
											disabled={checkLoadingUpload.key === 1 ? true : false}
											name='image'
											onChange={(e) =>
												handleUpdateFile(e, dataOrder?.merchantInfo?.merchantId, typeOrder.MERCHANT)
											}
											className='opacity-0'
											multiple
										/>
										{checkLoadingUpload.key === typeOrder.MERCHANT ? (
											<div className='absolute '>
												<DynamicSpin size='middle' isColor='#E0EBFD' />
											</div>
										) : null}
									</label>
									{dataRender?.merchantInfo
										? dataRender?.merchantInfo?.listMedia?.map(
												(imageItem: any, indexImage: number) => (
													<label
														key={indexImage}
														className='relative mx-[6px] flex h-[80px] w-[80px] flex-col rounded  border border-dashed'
													>
														{imageItem?.type !== 'mp4' ? (
															<div
																onClick={() => onClickImage(indexImage, typeOrder.MERCHANT)}
																className='flex cursor-pointer flex-col items-center justify-center pt-7'
															>
																<img className='block h-[24px] w-[24px]' src={imageItem?.url}></img>
															</div>
														) : (
															<div
																onClick={() => onClickImage(indexImage, typeOrder.MERCHANT)}
																className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'
															>
																<iframe className='block h-[80px] w-[80px]' src={imageItem?.url} />
																<div className='z-2 absolute h-[25px] w-[25px]'>
																	<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
																</div>
															</div>
														)}

														<div
															onClick={() => hanldeDeleteImage(typeOrder.MERCHANT, indexImage)}
															className='absolute right-[-10px] top-[-10px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
														>
															<ImageCustom
																src='/static/svg/icon-close-order.svg'
																alt='close'
																width={11}
																height={11}
															/>
														</div>
													</label>
												),
										  )
										: null}
								</div>
								{dataRender?.merchantInfo?.isLength ? (
									<span className='text-sm text-red-600'>{dataRender?.merchantInfo?.isLength}</span>
								) : null}
								{dataRender?.merchantInfo?.isError ? (
									<span className='text-sm text-red-600'>{dataRender?.merchantInfo?.isError}</span>
								) : null}
								{dataRender?.merchantInfo?.isSuccess ? (
									<span className='text-sm text-[#33d970]'>
										{dataRender?.merchantInfo?.isSuccess}
									</span>
								) : null}
							</div>
						</div>
						<div>
							<div className='mb-[12px] text-base font-bold uppercase'>Đánh giá sản phẩm</div>
							{(dataRender?.productInfo || []).map((itemProduct: any, indexPro: number) => (
								<div className='py-[14px]' key={indexPro}>
									<div className='relative rounded-[3px] border bg-[#F8F8F8] py-4 px-5'>
										<div className='rounded-md border border-[#F8F8F8] bg-[#FFFFFF] p-4'>
											<div className='flex items-center justify-between'>
												<div className='flex items-center justify-start'>
													<ImageCustom
														src={itemProduct?.variantImage || EmptyImage}
														alt='avatar'
														width={82}
														height={82}
														objectFit='cover'
													/>

													<div className='ml-[10px]'>
														<span className='block text-base font-semibold text-[#333333]'>
															{itemProduct?.productName}
														</span>
														<span className='block text-sm font-normal text-[#666666]'>
															Chi tiết
														</span>
													</div>
												</div>
												<div>
													<div className='flex'>
														{[...new Array(itemProduct?.statusRating)].map((_, index) => (
															<div
																onClick={() => onClickStar(index, itemProduct, typeOrder.PRODUCT)}
																className={`mx-[2px] cursor-pointer`}
																key={index}
															>
																<ImageCustom
																	src='/static/svg/vector-pink.svg'
																	alt='star'
																	width={24}
																	height={24}
																/>
															</div>
														))}
														{[...new Array(5 - itemProduct?.statusRating)].length
															? ([...new Array(5 - itemProduct?.statusRating)] || []).map(
																	(_, index) => (
																		<div
																			onClick={() =>
																				onClickStar(
																					itemProduct?.statusRating + index,
																					itemProduct,
																					typeOrder.PRODUCT,
																				)
																			}
																			key={index}
																			className={`mx-[2px] cursor-pointer`}
																		>
																			<ImageCustom
																				src='/static/svg/vector.svg'
																				alt='star'
																				width={24}
																				height={24}
																				key={index}
																			/>
																		</div>
																	),
															  )
															: null}
													</div>
													<span className='block text-sm font-normal text-[#666666]'>
														Tuyệt vời
													</span>
												</div>
											</div>
											<div className='flex w-full items-center justify-between pt-5'>
												<div className='relative w-full'>
													<Controller
														control={control}
														name={`content${indexPro}`}
														render={({ field: { onChange } }) => (
															<div className='custom_icon_picker block h-auto w-full border p-0 focus:text-gray-700 focus:outline-none'>
																<IconPicker
																	onChange={onChange}
																	placeholder='Viết nội dung đánh giá'
																/>
															</div>
														)}
													/>

													<div className=''>
														<div className='mt-4 w-full'>
															<div className='flex items-center justify-start'>
																<label className='relative flex h-[80px] w-[80px] flex-col rounded border border-dashed border-[#126BFB] hover:border-[#126BFB] hover:bg-gray-100'>
																	<div className='flex cursor-pointer flex-col items-center justify-center  pt-7'>
																		<ImageCustom
																			width={24}
																			height={24}
																			priority
																			className='w-auto'
																			src={'/static/svg/vector-add.svg'}
																		/>
																	</div>
																	<input
																		onChange={(e) =>
																			handleUpdateFile(e, itemProduct.productId, typeOrder.PRODUCT)
																		}
																		disabled={
																			checkLoadingUpload.key === typeOrder.PRODUCT &&
																			checkLoadingUpload.productId === itemProduct.productId
																		}
																		type='file'
																		name={`image${indexPro}`}
																		multiple
																		className='opacity-0'
																	/>
																	{checkLoadingUpload.key === typeOrder.PRODUCT &&
																	checkLoadingUpload.productId === itemProduct.productId ? (
																		<div className='absolute'>
																			<DynamicSpin size='middle' isColor='#E0EBFD' />
																		</div>
																	) : null}
																</label>
																{(itemProduct?.listMedia || []).map(
																	(imageItem: any, indexImage: number) => (
																		<label
																			key={indexImage}
																			className='relative mx-2 flex h-[80px] w-[80px] flex-col rounded  border border-dashed'
																		>
																			{imageItem?.type !== 'mp4' ? (
																				<div
																					onClick={() =>
																						onClickImage(indexImage, typeOrder.PRODUCT, indexPro)
																					}
																					className='flex cursor-pointer flex-col items-center justify-center pt-7'
																				>
																					<img
																						className='block h-[24px] w-[24px]'
																						src={imageItem?.url}
																					></img>
																				</div>
																			) : (
																				<div
																					onClick={() =>
																						onClickImage(indexImage, typeOrder.PRODUCT, indexPro)
																					}
																					className='relative flex h-[80px] w-[80px] cursor-pointer flex-col  items-center justify-center'
																				>
																					<iframe
																						className='block h-[80px] w-[80px]'
																						src={imageItem?.url}
																					/>
																					<div className='z-2 absolute h-[25px] w-[25px]'>
																						<img
																							src='/static/svg/play-icon.svg'
																							alt='play icon vuivui'
																						/>
																					</div>
																				</div>
																			)}

																			<div
																				onClick={() =>
																					hanldeDeleteImage(typeOrder.PRODUCT, indexImage, indexPro)
																				}
																				className='absolute right-[-10px] top-[-10px] flex h-6 w-6 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
																			>
																				<ImageCustom
																					src='/static/svg/icon-close-order.svg'
																					alt='close'
																					width={11}
																					height={11}
																				/>
																			</div>
																		</label>
																	),
																)}
															</div>
															{itemProduct.isLength ? (
																<span className='text-sm text-red-600'>
																	{itemProduct?.isLength}
																</span>
															) : null}
															{itemProduct.isError ? (
																<span className='text-sm text-red-600'>{itemProduct.isError}</span>
															) : null}
															{itemProduct?.isSuccess ? (
																<span className='text-sm text-[#33d970]'>
																	{itemProduct?.isSuccess}
																</span>
															) : null}
														</div>
													</div>
												</div>
											</div>
											<div
												onClick={() =>
													handleCancelOrder?.(typeOrder.PRODUCT, dataOrder, itemProduct.productId)
												}
												className='absolute right-[2px] top-[2px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
											>
												<ImageCustom
													src='/static/svg/icon-close-order.svg'
													alt='close'
													width={15}
													height={15}
												/>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
						<div className='flex items-center justify-end rounded-b border-t border-solid border-slate-200 bg-white pt-[12px]'>
							<button
								className='mr-1 mb-1 rounded-[3px] border  border-solid px-6 py-2  text-base font-bold text-[#333333] transition-all duration-150 ease-linear'
								type='button'
								onClick={() => onResetData(false)}
							>
								Hủy
							</button>
							<button
								className='mr-1 mb-1 rounded-[3px] border border-solid border-[#126BFB] bg-[#126BFB]  px-6 py-2 text-base font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-[#126BFB]'
								type='submit'
							>
								Gửi đánh giá
							</button>
						</div>
					</form>
					{isOpenModal && isOpenModal.isActive ? (
						<ModalProductDetail
							isHidden={true}
							show={isOpenModal}
							activeMode={'gallary'}
							dataSource={listMedia && listMedia.listImages}
							videos={listMedia && listMedia.listVideos}
							onClose={(): void =>
								setIsOpenModal((prev: any) => {
									setShowModal(false);
									return {
										...prev,
										defaultActiveImage: '',
										isActive: false,
									};
								})
							}
						/>
					) : null}
				</div>
			</div>
		);
	};

	return (
		<div
			className={` custom_scrollbar_none focus:outline-non  fixed inset-0 z-50  flex items-center justify-center  outline-none overflow-x-hidden ${
				isModal && isModal ? 'bg-[rgba(31,30,30,0.55)]' : ''
			}  ${showModal && showModal ? 'bg-[rgba(10,9,9,0.75)]' : ''}`}
		>
			<div className={`relative z-10 my-6 mx-auto  h-full w-[836px] max-w-3xl`}>
				<div className=' relative  top-[10%] left-[-10%] flex w-full flex-col rounded-[3px] border-0 shadow-lg outline-none focus:outline-none'>
					<div className='z-100 fixed top-[10px] flex h-[64px] w-[768px] items-center justify-between rounded-t border-b border-solid border-slate-200 bg-[#F05A94] p-5'>
						<span className='text-lg font-bold uppercase text-white'>Đánh giá</span>
						<button
							className='float-right ml-auto border-0 p-1 text-3xl font-semibold leading-[4px] outline-none focus:outline-none'
							onClick={() => onChange(false)}
						>
							<ImageCustom
								src='/static/svg/icon-close-order.svg'
								alt='close'
								width={14}
								height={14}
							/>
						</button>
					</div>

					<div className='z-1 relative top-[-5px] flex-auto bg-white p-6'>{renderBodyModal()}</div>
				</div>
			</div>
		</div>
	);
};
export default ModalOrder;
