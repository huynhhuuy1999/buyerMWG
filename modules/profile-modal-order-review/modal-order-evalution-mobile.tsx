/* eslint-disable */
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { useAppDispatch } from 'hooks';
import dynamic from 'next/dynamic';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updateMultiFile } from 'services';

import IconPicker from '@/components/IconPicker';
import ModalProductDetailMobile, {
	IOpenModalDetail,
} from '@/components/Modal/ModalProductDetailMobile';
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
	let newListImage: any = [...listMedia.listImages];
	let newListVideo: any = [...listMedia.listVideos];
	const [isOpenModal, setIsOpenModal] = useState<IOpenModalDetail>({
		defaultActiveImage: 0,
		isActive: false,
	});
	const {
		control,
		handleSubmit,
		formState: {},
	} = useForm<any>({ mode: 'onSubmit' });

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
		const file = e.target.files;

		setCheckLoadingUpload({ key: key, productId: id, isLoading: true });
		const arrFile = Object.keys(file);
		const serviceName = 'rating';
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
					setCheckLoadingUpload({ key: key, productId: id, isLoading: false });
					const newDataProduct = { ...dataRender, productInfo: newArrayProduct };
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
			case typeOrder.MERCHANT:
				const newItem = { ...item, statusRating: index + 1 };
				const newData = { ...dataRender, merchantInfo: newItem };
				dispatch(customerAction.setDataModal(newData));
				break;
			case typeOrder.PRODUCT:
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
			dataRender.merchantInfo?.listMedia?.map((itemMer: any, index: any) => {
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
			dataRender.productInfo?.map((itemProduct: any, indexProduct: number) => {
				itemProduct?.listMedia?.length &&
					itemProduct?.listMedia?.map((itemMedia: any) => {
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
			pageSize: 4,
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
					<form onSubmit={handleSubmit(onSubmitForm)} className='z-1 relative w-full'>
						<div className='w-full rounded-[8px] bg-[#ffffff] p-[16px] shadow-sm'>
							<div className=''>
								<div>
									<div className='pb-[16px]'>
										<div className='pb-[19px] text-sm font-bold'>Đánh giá Shop</div>
										<div className='flex items-center justify-center'>
											<div style={{ width: '32px', height: '32px', position: 'relative' }}>
												<ImageCustom
													src={dataRender?.merchantInfo?.pathImage || EmptyImage}
													alt='avatar'
													layout='fill'
													objectFit='contain'
												/>
											</div>

											<span className='ml-[8px] text-base font-bold'>
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
													onClick={() =>
														onClickStar(index, dataRender?.merchantInfo, typeOrder.MERCHANT)
													}
													onKeyPress={() =>
														onClickStar(index, dataRender?.merchantInfo, typeOrder.MERCHANT)
													}
													role={'button'}
													tabIndex={0}
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
										? [...new Array(5 - dataRender?.merchantInfo?.statusRating || 0)].map(
												(_, index) => (
													<div
														onClick={() =>
															onClickStar(
																index + dataRender?.merchantInfo?.statusRating || 0,
																dataRender?.merchantInfo,
																typeOrder.MERCHANT,
															)
														}
														onKeyPress={() =>
															onClickStar(
																index + dataRender?.merchantInfo?.statusRating || 0,
																dataRender?.merchantInfo,
																typeOrder.MERCHANT,
															)
														}
														role={'button'}
														tabIndex={0}
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
												),
										  )
										: null}
								</div>
								<span className='my-[12px] block text-center text-sm text-[#9F9F9F]'>
									Tuyệt vời
								</span>
							</div>
							<Controller
								control={control}
								name='content'
								render={({ field: { onChange } }) => (
									<div className='block h-auto w-full rounded-[6px] border p-0 focus:text-gray-700 focus:outline-none'>
										<IconPicker placeholder='Viết nội dung đánh giá' onChange={onChange} />
									</div>
								)}
							/>
							<div className=''>
								<span className='text-sm text-[#333333]'>Chọn/Chụp hình ảnh tải lên</span>
								<div className='my-4 w-full'>
									<div className='relative flex items-center justify-start'>
										<label
											className={`relative mx-2 flex h-[60px] w-[60px] flex-col rounded border border-dashed border-[#126BFB] hover:border-[#126BFB] hover:bg-gray-100  ${
												progress > 99 || progress < 1 ? 'bg-[#ffffff]' : 'bg-[#f5f0f0]'
											}`}
										>
											<div className='flex h-full w-full flex-col items-center justify-center pt-[17px]'>
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
												disabled={checkLoadingUpload.key === typeOrder.MERCHANT}
												name='image'
												onChange={(e) =>
													handleUpdateFile(
														e,
														dataOrder?.merchantInfo?.merchantId,
														typeOrder.MERCHANT,
													)
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

										{dataRender?.merchantInfo?.listMedia?.map(
											(imageItem: any, indexImage: number) => {
												if (indexImage + 1 < 3) {
													return (
														<label
															key={indexImage}
															className='relative mx-[6px] flex h-[60px] w-[60px] flex-col rounded  border border-dashed'
														>
															{imageItem?.type !== 'mp4' ? (
																<div
																	onClick={() => onClickImage(indexImage, typeOrder.MERCHANT)}
																	onKeyPress={() => onClickImage(indexImage, typeOrder.MERCHANT)}
																	role={'button'}
																	tabIndex={0}
																	className='flex cursor-pointer flex-col items-center justify-center pt-4'
																>
																	<img
																		className='block h-[24px] w-[24px]'
																		src={imageItem?.url}
																		alt={''}
																	/>
																</div>
															) : (
																<div
																	onClick={() => onClickImage(indexImage, typeOrder.MERCHANT)}
																	onKeyPress={() => onClickImage(indexImage, typeOrder.MERCHANT)}
																	tabIndex={0}
																	role={'button'}
																	className='relative flex h-[60px] w-[60px] cursor-pointer flex-col items-center justify-center'
																>
																	<iframe
																		className='block h-[0px] w-[60px]'
																		src={imageItem?.url}
																		title={'vuivui-iframe'}
																	/>
																	<div className='z-2 absolute h-[25px] w-[25px]'>
																		<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
																	</div>
																</div>
															)}

															<div
																onClick={() => hanldeDeleteImage(typeOrder.MERCHANT, indexImage)}
																tabIndex={0}
																role={'button'}
																onKeyPress={() => hanldeDeleteImage(typeOrder.MERCHANT, indexImage)}
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
													);
												}
											},
										)}
										{dataRender?.merchantInfo?.listMedia &&
										dataRender?.merchantInfo?.listMedia.length - 2 !== 0 &&
										dataRender?.merchantInfo?.listMedia.length - 2 > 0 ? (
											<label
												onClick={() => onClickImage(3, typeOrder.MERCHANT)}
												onKeyPress={() => onClickImage(3, typeOrder.MERCHANT)}
												tabIndex={0}
												role={'presentation'}
												className='relative mx-[6px] flex h-[60px] w-[60px] flex-col overflow-hidden  rounded border border-dashed'
											>
												<div className='absolute inset-0 bg-[#0E0E10] bg-opacity-20'></div>
												<span className='absolute top-[0px] right-0 z-10 block h-[60px] w-[60px] text-center  text-20 leading-[60px] text-white'>
													+{(dataRender?.merchantInfo?.listMedia || []).length - 2}
												</span>
											</label>
										) : null}
									</div>
									{dataRender?.merchantInfo?.isLength ? (
										<span className='text-sm text-red-600'>
											{dataRender?.merchantInfo?.isLength}
										</span>
									) : null}
									{dataRender?.merchantInfo?.isError ? (
										<span className='text-sm text-red-600'>
											{dataRender?.merchantInfo?.isError}
										</span>
									) : null}
									{dataRender?.merchantInfo?.isSuccess ? (
										<span className='text-sm text-[#33d970]'>
											{dataRender?.merchantInfo?.isSuccess}
										</span>
									) : null}
								</div>
							</div>
						</div>

						<div>
							<div className='my-[16px] text-base font-bold uppercase'>Đánh giá sản phẩm</div>
							{(dataRender?.productInfo || []).map((itemProduct: any, index: number) => (
								<div className='pb-[12px]' key={index}>
									<div className=' relative'>
										<div className='rounded-[8px] bg-[#FFFFFF] p-4 shadow-sm'>
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
														<span className='block text-[14px] font-semibold text-[#999999]'>
															{itemProduct?.productName}
														</span>
														<div>
															<div className='flex py-[8px]'>
																{[...new Array(itemProduct?.statusRating)].map((_, index) => (
																	<div
																		onClick={() =>
																			onClickStar(index, itemProduct, typeOrder.PRODUCT)
																		}
																		onKeyPress={() =>
																			onClickStar(index, itemProduct, typeOrder.PRODUCT)
																		}
																		tabIndex={0}
																		role={'button'}
																		className={`mx-2 cursor-pointer`}
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
																					onKeyPress={() =>
																						onClickStar(
																							itemProduct?.statusRating + index,
																							itemProduct,
																							typeOrder.PRODUCT,
																						)
																					}
																					tabIndex={0}
																					role={'button'}
																					key={index}
																					className={`mx-2 cursor-pointer`}
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
															<span className='block text-sm font-normal text-[#9F9F9F]'>
																Tuyệt vời
															</span>
														</div>
													</div>
												</div>
											</div>
											<div className='flex w-full items-center justify-between pt-5'>
												<div className='relative w-full'>
													<Controller
														control={control}
														name={`content${index}`}
														render={({ field: { onChange } }) => (
															<div className='block h-auto w-full border p-0 focus:text-gray-700 focus:outline-none'>
																<IconPicker
																	placeholder='Viết nội dung đánh giá'
																	onChange={onChange}
																/>
															</div>
														)}
													/>

													<div className=''>
														<div className='mt-4 w-full'>
															<div className='flex items-center justify-start'>
																<label className='relative flex h-[60px] w-[60px] flex-col rounded border border-dashed border-[#126BFB] hover:border-[#126BFB] hover:bg-gray-100'>
																	<div className='flex cursor-pointer flex-col items-center justify-center pt-[17px]'>
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
																		name={`image${index}`}
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
																{(itemProduct?.listMedia || [])?.map(
																	(imageItem: any, indexImage: number) => {
																		if (indexImage + 1 < 3) {
																			return (
																				<label
																					key={indexImage}
																					className='relative mx-[6px] flex h-[60px] w-[60px] flex-col rounded  border border-dashed'
																				>
																					{imageItem?.type !== 'mp4' ? (
																						<div
																							onClick={() =>
																								onClickImage(indexImage, typeOrder.PRODUCT)
																							}
																							onKeyPress={() =>
																								onClickImage(indexImage, typeOrder.PRODUCT)
																							}
																							tabIndex={0}
																							role={'button'}
																							className='flex cursor-pointer flex-col items-center justify-center pt-4'
																						>
																							<img
																								className='block h-[24px] w-[24px]'
																								src={imageItem?.url}
																								alt={''}
																							/>
																						</div>
																					) : (
																						<div
																							onClick={() =>
																								onClickImage(indexImage, typeOrder.PRODUCT)
																							}
																							onKeyPress={() =>
																								onClickImage(indexImage, typeOrder.PRODUCT)
																							}
																							tabIndex={0}
																							role={'button'}
																							className='relative flex h-[60px] w-[60px] cursor-pointer flex-col items-center justify-center'
																						>
																							<iframe
																								className='block h-[0px] w-[60px]'
																								src={imageItem?.url}
																								title={'vuivui-iframe'}
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
																							hanldeDeleteImage(
																								typeOrder.PRODUCT,
																								indexImage,
																								index,
																							)
																						}
																						onKeyPress={() =>
																							hanldeDeleteImage(
																								typeOrder.PRODUCT,
																								indexImage,
																								index,
																							)
																						}
																						tabIndex={0}
																						role={'button'}
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
																			);
																		}
																	},
																)}
																{itemProduct?.listMedia &&
																itemProduct?.listMedia.length - 2 > 0 &&
																itemProduct?.listMedia.length - 2 !== 0 ? (
																	<label
																		onClick={() => onClickImage(3, typeOrder.PRODUCT)}
																		onKeyPress={() => onClickImage(3, typeOrder.PRODUCT)}
																		tabIndex={0}
																		role={'presentation'}
																		className='relative mx-[6px] flex h-[60px] w-[60px] flex-col overflow-hidden  rounded border border-dashed'
																	>
																		<div className='absolute inset-0 bg-[#0E0E10] bg-opacity-20'></div>
																		<span className='absolute top-[0px] right-0 z-10 block h-[60px] w-[60px] text-center  text-20 leading-[60px] text-white'>
																			+{(itemProduct?.listMedia || []).length - 2}
																		</span>
																	</label>
																) : null}
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
													handleCancelOrder?.(typeOrder.PRODUCT, dataRender, itemProduct.productId)
												}
												onKeyPress={() =>
													handleCancelOrder?.(typeOrder.PRODUCT, dataRender, itemProduct.productId)
												}
												tabIndex={0}
												role={'button'}
												className='absolute right-[5px] top-[5px] flex h-8 w-8 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
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
						<div className='flex items-center justify-end bg-white py-[12px]'>
							<button
								className='mr-1 mb-1 rounded-[20px] border  border-solid px-6 py-2  text-base font-bold text-[#333333] transition-all duration-150 ease-linear'
								type='button'
								onClick={() => onResetData(false)}
							>
								Hủy
							</button>
							<button
								className='mr-1 mb-1 rounded-[20px] border border-solid border-[#126BFB] bg-[#126BFB]  px-6 py-2 text-base font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-[#126BFB]'
								type='submit'
							>
								Gửi đánh giá
							</button>
						</div>
					</form>
					{/* {isOpenModal && isOpenModal.isActive ? (
						<ModalProductDetailMobile
							isHidden={true}
							showModal={isOpenModal}
							activeMode={'gallary'}
							dataSource={listMedia && listMedia.listImages}
							videos={listMedia && listMedia.listVideos}
							onClose={(): void =>
								setIsOpenModal((prev: any) => ({
									...prev,
									defaultActiveImage: '',
									isActive: false,
								}))
							}
						/>
					) : null} */}
				</div>
			</div>
		);
	};

	return (
		<div
			className={`modal-mobile custom_scrollbar_none focus:outline-non fixed inset-0 z-50 flex items-center justify-center  outline-none overflow-x-hidden ${
				isModal && isModal ? 'bg-[rgba(31,30,30,0.55)]' : ''
			}  ${showModal && showModal ? 'bg-[rgba(10,9,9,0.75)]' : ''}`}
		>
			<div className={`z-100 relative my-6 mx-auto  h-full w-full max-w-3xl`}>
				<div className='relative flex w-full  flex-col rounded-[3px] border-0 bg-[#F2F2F2] shadow-lg outline-none focus:outline-none'>
					<div className=' flex h-[64px] w-full items-center justify-between rounded-t border-b border-solid border-slate-200 bg-[#F05A94] p-5'>
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

					<div className='relative z-10 flex-auto  bg-[#F2F2F2] p-3'>{renderBodyModal()}</div>
				</div>
			</div>
		</div>
	);
};
export default ModalOrder;
