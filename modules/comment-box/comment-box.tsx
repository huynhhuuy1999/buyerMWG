import 'moment/locale/vi';

import classNames from 'classnames';
import { Icon, ImageCustom } from 'components';
import { MODE_RUNNER } from 'enums';
import { useComment } from 'hooks';
import { IProductDetailProps, Media, RulesComment, RulesDataComment } from 'models';
import moment from 'moment';
import { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Fragment, memo, useEffect, useState } from 'react';
import { updateMultiFile } from 'services';

import CommentForm from '@/components/CommentInput';
import ModalProductDetail from '@/components/Modal/ModalProductDetail';

import MediaUpload from './comment-media-upload';
import CommentReply from './comment-reply';
import ShowMedia from './comment-show-media';
moment.locale('vi'); // global locale moment
const _ = require('lodash');

const DynamicSpin = dynamic(() => import('@/components/spinning'), { ssr: false });

interface RulesParams {
	parentCommentId?: string;
	pageIndex: number;
	pageSize: number;
}
interface RulesLoading {
	key?: string;
	isLoading: boolean;
	id?: string;
}
const CommentBox: NextPage<IProductDetailProps> = ({ productDetails, mode }) => {
	const {
		postComment,
		getTotalComments,
		postLike,
		getCommentDetail,
		postMedia,
		totalComment,
		mediaClone,
	} = useComment();

	const [statusLike, setStatusLike] = useState({
		id: '',
		isLike: false,
	});
	const [dataRender, setDataRender] = useState<RulesDataComment[]>([]);

	const [listMedia, setListMedia] = useState<Media>({ key: '', media: [] });

	const [isLoadingDetail, setIsLoadingDetail] = useState<RulesLoading>({
		key: '',
		isLoading: false,
	});

	const [isLoadingSeeMore, setIsLoadingSeeMore] = useState<RulesLoading>({
		id: '',
		isLoading: false,
	});

	const [params, setParams] = useState<RulesParams>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [paramsDetail, setCommentDetail] = useState<RulesParams>({
		parentCommentId: '',
		pageIndex: 0,
		pageSize: 1,
	});

	const [mediaModal, setMediaModal] = useState<any>({
		listImages: [],
		listVideos: [],
	});

	const [isOpenModal, setIsOpenModal] = useState<any>({
		defaultActiveImage: 0,
		isActive: false,
	});

	let newListImage: any = [...mediaModal.listImages];

	let newListVideo: any = [...mediaModal.listVideos];

	useEffect(() => {
		if (mediaClone) {
			if (mediaClone.key !== 'question') {
				const newData = dataRender.map((itemData: any) => {
					if (itemData.commentParent.id === mediaClone.key) {
						return { ...itemData, media: [...itemData.media, ...mediaClone.media] };
					} else return itemData;
				});
				setDataRender(newData);
			} else {
				setListMedia({ key: mediaClone.key, media: [...listMedia.media, ...mediaClone.media] });
			}
		}
		setIsLoadingDetail({ key: 'question', isLoading: false });
	}, [mediaClone.media]);

	useEffect(() => {
		if (params) {
			const paramDispath = { ...params, productId: productDetails.id || 0 };
			getTotalComments(paramDispath).then((resp: any) => {
				if (resp?.payload?.listComment?.length) {
					const newData = resp.payload.listComment.map((itemComment: any) => {
						if (itemComment?.children?.length) {
							return {
								...itemComment,
								params: { pageIndex: 0, pageSize: 1 },
								media: [],
								isShowInput: false,
								userInfo: {},
							};
						} else return { ...itemComment, media: [], isShowInput: false, userInfo: {} };
					});
					setDataRender([...dataRender, ...newData]);
					setIsLoadingDetail({ key: '', isLoading: false });
					setIsLoadingSeeMore({ id: '', isLoading: false });
				}
			});
		}
	}, [params]);

	useEffect(() => {
		if (paramsDetail && paramsDetail.parentCommentId) {
			getCommentDetail(paramsDetail).then((resp: any) => {
				if (resp.payload?.length) {
					let newObj: any = {};
					const newData = dataRender.map((item: any) => {
						if (item.commentParent?.id === paramsDetail.parentCommentId) {
							const newArr = [...item?.children, ...resp.payload];
							newObj = { ...item, children: newArr };
							return { ...newObj };
						} else return item;
					});
					setIsLoadingSeeMore({ id: '', isLoading: false });
					setDataRender(newData);
				}
			});
		}
	}, [paramsDetail]);

	const handleSeeMoreDetail = (parentId: string) => {
		let newParamDetail: any = { ...paramsDetail };
		const newData = dataRender.map((item: any) => {
			if (item.commentParent.id === parentId) {
				newParamDetail = {
					parentCommentId: parentId,
					...item.params,
					pageIndex: item.params.pageIndex + 1,
				};
				return { ...item, params: { ...item.params, pageIndex: item.params.pageIndex + 1 } };
			} else return item;
		});
		setIsLoadingSeeMore({ isLoading: true, id: parentId });
		setDataRender(newData);
		setCommentDetail(newParamDetail);
	};

	const handleDeleteMedia = (path: string, key: number) => {
		switch (key) {
			case 1:
				const newListMedia: any = listMedia.media.filter(
					(itemMedia: any) => itemMedia.url !== path,
				);
				const newMedia = { key: 'question', media: newListMedia };
				setListMedia(newMedia);
				break;
			case 2:
				const newData = dataRender.map((itemData: any) => {
					const newMedia = itemData.media.filter((itemMedia: any) => itemMedia.url !== path);
					return { ...itemData, media: newMedia };
				});
				setDataRender(newData);
				break;
			default:
				break;
		}
	};

	const handleUpdateMedia = (e: any, id: string = '') => {
		const file = e.target.files;

		setIsLoadingDetail({ key: id, isLoading: true });

		let form_data: FormData = new FormData();
		for (let key in file) {
			form_data.append('files', file[key]);
		}
		const serviceName = 'rating';
		let newData: any = [];
		updateMultiFile(serviceName, form_data, (event: any) => {})
			.then((resp: any) => {
				if (Array.isArray(resp.data) && !resp.isError) {
					newData = resp.data.map((item: any) => {
						const typeFile = item.fileName.split('.');
						return { ...item, type: typeFile[1] };
					});
					const newDataUpdate = { key: id, media: newData };
					postMedia(newDataUpdate);
				}
			})
			.catch((err: any) => {
				// console.log('err', err);
			});
	};

	const onSubmitForm = (data: any, id: any) => {
		let newObjectMedia: any = {};
		let newListMedia: any = [];
		if (id === 'question') {
			listMedia.media.length &&
				listMedia.media.map((itemMedia: any) => {
					newObjectMedia = {
						name: itemMedia.fileName,
						description: itemMedia.type,
						filePath: itemMedia.url,
						mediaType: 0,
					};
					newListMedia.push(newObjectMedia);
				});
		} else {
			dataRender.map((itemData: any) => {
				if (itemData.commentParent.id === id) {
					if (itemData.media.length) {
						itemData.media.map((itemMedia: any) => {
							newObjectMedia = {
								name: itemMedia.fileName,
								description: itemMedia.type,
								filePath: itemMedia.url,
								mediaType: 0,
							};
							newListMedia.push(newObjectMedia);
						});
					}
				}
			});
		}

		const dataSubmit: RulesComment = {
			parentCommentId: id !== 'question' ? id : '',
			ratingId: '',
			content: data?.[id],
			media: newListMedia || [],
			targetUserId: '',
			productId: productDetails.id || 0,
			isQuestion: id !== 'question' ? false : true,
		};

		dataSubmit && (dataSubmit.content || dataSubmit?.media?.length);
		postComment(dataSubmit);
		setListMedia({ key: '', media: [] });
	};

	const onClickShowInput = (item: any, key: number) => {
		switch (key) {
			case 1:
				const newDataOne = dataRender.map((itemData: any) => {
					if (itemData.commentParent.id === item.id) {
						return {
							...itemData,
							isShowInput: true,
							userInfo: { userName: item.userInfo.fullName },
						};
					} else return itemData;
				});
				setDataRender(newDataOne);
				break;
			case 2:
				const newDataTwo = dataRender.map((itemData: any) => {
					if (itemData.commentParent.id === item.parentCommentId) {
						return {
							...itemData,
							isShowInput: true,
							userInfo: { userName: item.userInfo.fullName },
						};
					} else return itemData;
				});
				setDataRender(newDataTwo);
				break;
			default:
				break;
		}
	};

	const handleButtonLike = (itemComment: any, key: number) => {
		if (itemComment.id) {
			setStatusLike({ id: itemComment.id, isLike: !statusLike.isLike });
			const data = {
				commentId: itemComment.id,
			};
			postLike(data).then((resp: any) => {
				if (resp.meta.requestStatus === 'fulfilled') {
					switch (key) {
						case 1:
							const newData = dataRender.map((itemData: any) => {
								if (itemData.commentParent.id === resp.payload.commentId) {
									return {
										...itemData,
										commentParent: {
											...itemData.commentParent,
											isLike: itemData.commentParent.isLike === 0 ? 1 : 0,
											totalLike:
												itemData.commentParent.isLike === 0
													? itemData.commentParent.totalLike + 1
													: itemData.commentParent.totalLike - 1,
										},
									};
								}
								return itemData;
							});

							setDataRender(newData);
							break;
						case 2:
							const newDataA: any = dataRender.map((itemData: any) => {
								if (itemData.children && itemData.children.length) {
									const newChild = itemData?.children?.map((itemChild: any) => {
										if (itemChild.id === resp.payload.commentId) {
											return {
												...itemChild,
												isLike: itemChild.isLike === 0 ? 1 : 0,
												totalLike:
													itemChild.isLike === 0
														? itemChild.totalLike + 1
														: itemChild.totalLike - 1,
											};
										}
										return itemChild;
									});

									return {
										...itemData,
										children: newChild,
									};
								}
								return itemData;
							});

							setDataRender(newDataA);
							break;
						default:
							break;
					}
				}
			});
		}
	};

	const handleShowMedia = (item: any, index: number, key: number) => {
		switch (key) {
			case 1:
				dataRender.map((itemData: any) => {
					if (itemData.commentParent.id === item.id && itemData.commentParent.media.length) {
						itemData.commentParent.media.forEach((itemMedia: any) => {
							if (itemMedia.type === 'mp4') {
								newListVideo.push({ content: itemMedia.filePath, type: 1, order: 1 });
							} else {
								newListImage.push({ content: itemMedia.filePath, type: 1, order: 1 });
							}
						});
						return;
					}
				});
				setMediaModal({ listImages: newListImage, listVideos: newListVideo });
				break;
			case 2:
				dataRender.map((itemData: any) => {
					if (itemData?.children?.length) {
						itemData.children.forEach((itemChild: any) => {
							if (itemChild.id === item.id) {
								itemChild.media.forEach((itemMedia: any) => {
									if (itemMedia.type === 'mp4') {
										newListVideo.push({ content: itemMedia.filePath, type: 1, order: 1 });
									} else {
										newListImage.push({ content: itemMedia.filePath, type: 1, order: 1 });
									}
								});
							}
						});
					}
				});
				setMediaModal({ listImages: newListImage, listVideos: newListVideo });
				break;

			default:
				break;
		}
		setIsOpenModal({
			defaultActiveImage: index + 1,
			isActive: true,
		});
	};

	const RenderComment: React.FC<RulesComment> = ({ item }) => {
		const { commentParent, children, media, isShowInput, userInfo } = item;
		return (
			<div>
				<div className='rounded-md bg-[#F6F6F6] px-[12px] py-[8px]'>
					<div className='item-center flex pb-2'>
						<div className='mr-[1.5px] flex '>
							{commentParent &&
								[...new Array(5)].map((_, indexStar: number) =>
									indexStar > 0 ? (
										<div className='relative h-4 w-[16px]' key={indexStar}>
											<ImageCustom
												src='/static/svg/star_nobg.svg'
												alt='star background'
												width={16}
												height={16}
												layout='fill'
											/>
										</div>
									) : (
										<div className='relative h-4 w-[16px]' key={indexStar}>
											<ImageCustom
												src='/static/svg/star-product.svg'
												alt='star'
												width={16}
												height={16}
												layout='fill'
											/>
										</div>
									),
								)}
						</div>

						<span className='ml-[7px] text-12 font-medium leading-5 text-[#999999]'>
							{commentParent && moment(commentParent.createdAt).fromNow()}
						</span>
					</div>

					<div className='flex'>
						<div className='align-center flex'>
							{commentParent?.userInfo?.urlImage && (
								<div className='relative mr-[10px] h-[24px] w-[24px] '>
									<ImageCustom
										className='w-full rounded-[50%]'
										width={24}
										height={24}
										alt='test vui vui'
										src={commentParent?.userInfo?.urlImage || '/static/images/empty-img.png'}
									/>
								</div>
							)}

							<p className='ml-[2px] mb-[0px] block font-sfpro_semiBold text-sm text-[#000000]'>
								{commentParent?.userInfo?.fullName && commentParent.userInfo?.fullName}:
							</p>

							<span className='ml-[2px] block font-sfpro text-sm'> {commentParent?.content}</span>
						</div>
					</div>
				</div>
				<div className='flex items-center justify-start'>
					{(commentParent?.media || []).map(
						(itemMedia: any, index: number) =>
							index + 1 < 5 && (
								<ShowMedia
									media={commentParent}
									item={itemMedia}
									index={index}
									handleShowMedia={handleShowMedia}
								/>
							),
					)}
					{_.isNaN(_.isEmpty(commentParent?.media)) &&
					_.isInteger(commentParent?.media.length - 5) ? (
						<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
							<div className='absolute inset-0 bg-[#0E0E10] bg-opacity-20'></div>
							<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
								+{(commentParent?.media || []).length - 5}
							</span>
						</label>
					) : null}
				</div>
				<div className='my-[8px] flex items-center justify-start border-y py-4'>
					<button
						onClick={() => handleButtonLike(commentParent, 1)}
						className='mr-4 flex items-center'
					>
						<div className='relative h-[14px] w-5 pr-1'>
							{commentParent?.isLike ? (
								<Icon type='icon-thumb-up' size={15} variant='primary' />
							) : (
								<Icon type='icon-thumb-up' size={15} variant='dark' />
							)}
						</div>
						<span className={`block text-[14px] ${commentParent.isLike ? 'text-[#f05a94]' : ''}`}>
							Hữu ích {commentParent?.totalLike ? `(${commentParent.totalLike})` : ''}
						</span>
					</button>
					<button style={{ color: 'rgba(0, 0, 0, 0.54)' }} className='flex items-center	'>
						<div className='relative h-[20px] w-[28px] pr-1'>
							<ImageCustom src='/static/svg/comment.svg' alt='like' layout='fill' />
						</div>
						<span
							onClick={() => onClickShowInput(commentParent, 1)}
							onKeyPress={() => {}}
							role='button'
							tabIndex={0}
							className='text-[14px] text-[#0000008A]'
						>
							Phản hồi
						</span>
					</button>
				</div>

				{/* Render commentReply */}

				<div className='pl-8'>
					{(children || []).map((itemChild: any, index: number) => (
						<CommentReply
							data={itemChild}
							handleButtonLike={handleButtonLike}
							handleShowMedia={handleShowMedia}
							onClickShowInput={onClickShowInput}
							key={index}
						/>
					))}
				</div>

				{/* Show input detail */}

				{isShowInput && isShowInput ? (
					<div className='mt-2 pl-8'>
						<div className='flex text-sm'>
							Trả lời: <span className='ml-[2px] block text-[#f05a94]'> @{userInfo.userName}</span>
						</div>

						<CommentForm
							id={commentParent?.id}
							title='Nhập phản hồi...'
							onSubmitForm={onSubmitForm}
							handleUpdateMedia={handleUpdateMedia}
						/>
					</div>
				) : null}
				{isLoadingDetail.key === commentParent.id && isLoadingDetail.isLoading ? (
					<div className='mt-5'>
						<DynamicSpin isColor='#cdcdcd' />
					</div>
				) : null}
				{/* Render Media selected */}

				{media && (
					<div className='pl-8'>
						<div className='flex items-center justify-start'>
							{media && media.length
								? media.map((itemMedia: any, indexMedia: number) => {
										if (indexMedia + 1 < 5) {
											return (
												<MediaUpload
													item={itemMedia}
													handleDeleteMedia={handleDeleteMedia}
													key={indexMedia}
												/>
											);
										}
								  })
								: null}
							{_.isNaN(_.isEmpty(media)) && _.isInteger(media.length - 5) ? (
								<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
									<div className='absolute inset-0 bg-[#0E0E10] bg-opacity-20'></div>
									<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
										+{(media || []).length - 5}
									</span>
								</label>
							) : null}
						</div>
					</div>
				)}

				{isLoadingSeeMore.id === commentParent.id && isLoadingSeeMore.isLoading ? (
					<div className='mt-5'>
						<DynamicSpin isColor='#cdcdcd' />
					</div>
				) : null}
				{/* Show see more detail */}
				{children && commentParent?.sumComment - children?.length > 0 ? (
					<div
						className='mb-3 flex items-center pl-8'
						onKeyPress={() => {}}
						role='button'
						tabIndex={0}
						onClick={() => handleSeeMoreDetail(children.at(-1)?.parentCommentId)}
					>
						<div className='mr-[15px] mb-[7px] font-sfpro_bold'>
							<Icon type='icon-curved-arrow-right' size={14} variant='dark' />
						</div>

						<div className='flex cursor-pointer font-sfpro_bold text-14 leading-5 text-[#333333]'>
							Xem thêm
							<span className='mx-[2px] block'>{commentParent.sumComment - children.length}</span>
							đánh giá/hỏi đáp khác
						</div>
						<div className='relative ml-2 h-[5px] w-[10px]'>
							<ImageCustom src='/static/svg/chevron-down-00ADA.svg' alt='star' layout='fill' />
						</div>
					</div>
				) : null}
			</div>
		);
	};

	return (
		<Fragment>
			<div
				className={classNames([
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
						'pointer-events-none',
				])}
			>
				<CommentForm
					id='question'
					title='Đặt câu hỏi về sản phẩm'
					onSubmitForm={onSubmitForm}
					handleUpdateMedia={handleUpdateMedia}
				/>
				{isLoadingDetail.key === 'question' && isLoadingDetail.isLoading ? (
					<div className='my-2'>
						<DynamicSpin isColor='#cdcdcd' />
					</div>
				) : null}
				<div className='flex items-center justify-start'>
					{listMedia.key === 'question' && listMedia.media && listMedia.media.length
						? listMedia.media.map((itemMedia: any, indexMedia: number) => {
								if (indexMedia + 1 < 5) {
									return (
										<MediaUpload
											item={itemMedia}
											handleDeleteMedia={handleDeleteMedia}
											key={indexMedia}
										/>
									);
								}
						  })
						: null}
					{_.isNaN(_.isEmpty(listMedia.media)) && _.isInteger(listMedia?.media.length - 5) ? (
						<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
							<div className='absolute inset-0 bg-[#0E0E10] bg-opacity-20'></div>
							<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
								+{(listMedia.media || []).length - 5}
							</span>
						</label>
					) : null}
				</div>
				{/* comment user */}
				{/* map data Comment */}
				{(dataRender || []).map((itemComment: any, index: number) => (
					<div key={index}>
						<RenderComment item={itemComment} />
					</div>
				))}
				{!isLoadingSeeMore.id && isLoadingSeeMore.isLoading ? (
					<div className='mt-5'>
						<DynamicSpin isColor='#cdcdcd' />
					</div>
				) : null}
				{dataRender?.length < totalComment?.analysisComment?.totalCommentInProduct ? (
					<div
						className='flex items-center'
						onClick={() => {
							setParams({ ...params, pageIndex: params.pageIndex + 1 }),
								setIsLoadingSeeMore({ isLoading: true, id: '' });
						}}
						onKeyPress={() => {}}
						role='button'
						tabIndex={0}
					>
						<div className='flex cursor-pointer py-2 font-sfpro_bold text-14 leading-5 text-[#333333]'>
							Xem thêm
							<span className='mx-[2px] block'>
								{totalComment &&
									totalComment?.analysisComment?.totalCommentInProduct - dataRender.length}
							</span>
							đánh giá/hỏi đáp khác
						</div>
						<div className='relative ml-2 h-[5px] w-[10px]'>
							<ImageCustom src='/static/svg/chevron-down-00ADA.svg' alt='star' layout='fill' />
						</div>
					</div>
				) : null}
				{isOpenModal && isOpenModal.isActive ? (
					<ModalProductDetail
						isHidden={true}
						show={isOpenModal}
						activeMode={'gallary'}
						dataSource={mediaModal && mediaModal.listImages}
						videos={mediaModal && mediaModal.listVideos}
						onClose={(): void =>
							setIsOpenModal((prev: any) => {
								setMediaModal({ listImages: [], listVideos: [] });
								newListImage = [];
								newListVideo = [];
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
		</Fragment>
	);
};

export default memo(CommentBox);
