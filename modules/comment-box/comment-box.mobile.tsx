import 'moment/locale/vi';

import classNames from 'classnames';
import { CommentForm, ImageCustom } from 'components';
import { MODE_RUNNER } from 'enums';
import { useComment, useIsomorphicLayoutEffect } from 'hooks';
import { IProductDetailProps, RulesComment, RulesDataComment } from 'models';
import moment from 'moment';
import dynamic from 'next/dynamic';
import { memo, useEffect, useRef, useState } from 'react';
import { updateMultiFile } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';

moment.locale('vi'); // global locale moment
const _ = require('lodash');

const DynamicSpin = dynamic(() => import('@/components/spinning'), { ssr: false });
interface RulesParams {
	parentCommentId?: string;
	pageIndex: number;
	pageSize: number;
}

const CommentBoxMobile: React.FC<IProductDetailProps> = ({ productDetails, mode }) => {
	const { postComment, getTotalComments, postLike, getCommentDetail, totalComment } = useComment();

	const [listMedia, setListMedia] = useState<any>([]);

	const [idResponse, setIdResponse] = useState<any>('question');

	const [isLoadingDetail, setIsLoadingDetail] = useState<boolean>(false);

	const [isLoadingSeeMore, setIsLoadingSeeMore] = useState<any>({
		id: '',
		isLoading: false,
	});

	const [clicked, setClicked] = useState<number>(0);

	const [statusLike, setStatusLike] = useState({
		id: '',
		isLike: false,
	});

	const commentElement = useRef<any>(null);

	const [userInfo, setUserInfo] = useState<string>('');

	const [dataRender, setDataRender] = useState<RulesDataComment[]>([]);

	const [params, setParams] = useState<RulesParams>({
		pageIndex: 0,
		pageSize: 10,
	});

	const [paramsDetail, setCommentDetail] = useState<RulesParams>({
		parentCommentId: '',
		pageIndex: 0,
		pageSize: 1,
	});

	useIsomorphicLayoutEffect(() => {
		if (commentElement) {
			commentElement.current = window.document.getElementById('comment-form');
		}
	}, [dataRender]);

	useIsomorphicLayoutEffect(() => {
		clicked > 0 &&
			window.scrollTo({
				top:
					(commentElement.current &&
						commentElement.current?.getBoundingClientRect().top +
							window.pageYOffset +
							-window.innerHeight +
							120) ||
					0,
				behavior: 'smooth',
			});
	}, [clicked]);

	useEffect(() => {
		listMedia.length && setIsLoadingDetail(false);
	}, [listMedia]);

	useEffect(() => {
		if (params) {
			const paramDispath = { ...params, productId: productDetails.id || 0 };
			getTotalComments(paramDispath).then((resp: any) => {
				if (resp.payload?.listComment?.length) {
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
					setIsLoadingSeeMore({ id: '', isLoading: false });
					setDataRender(
						dataRender.map((item: any, index: number) => {
							if (item.commentParent.id === paramsDetail.parentCommentId) {
								const newArr = [...item.children, ...resp.payload];
								newObj = { ...item, children: newArr };
								return { ...newObj };
							} else return item;
						}),
					);
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

	const handleDeleteMedia = (path: string) => {
		const newListMedia: any = listMedia.filter((itemMedia: any) => itemMedia.url !== path);
		setListMedia(newListMedia);
	};

	const handleUpdateMedia = (e: any, id: string = '') => {
		const file = e.target.files;

		setIsLoadingDetail(true);

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
					setListMedia([...listMedia, ...newData]);
				}
			})
			.catch((err: any) => {
				// console.log('err', err);
			});
	};
	const onSubmitForm = (data: any, id: any) => {
		let newObjectMedia: any = {};
		let newListMedia: any = [];

		if (listMedia.length) {
			listMedia.map((itemMedia: any) => {
				newObjectMedia = {
					name: itemMedia.fileName,
					description: itemMedia.type,
					filePath: itemMedia.url,
					mediaType: 0,
				};
				newListMedia.push(newObjectMedia);
			});
		}
		// else {
		// 	dataRender.map((itemData: any) => {
		// 		if (itemData.commentParent.id === id) {
		// 			if (itemData.media.length) {
		// 				itemData.media.map((itemMedia: any) => {
		// 					newObjectMedia = {
		// 						name: itemMedia.fileName,
		// 						description: itemMedia.type,
		// 						filePath: itemMedia.url,
		// 						mediaType: 0,
		// 					};
		// 					newListMedia.push(newObjectMedia);
		// 				});
		// 			}
		// 		}
		// 	});
		// }

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
		setListMedia([]);
	};

	const onClickShowInput = (item: any, key: number) => {
		setUserInfo(item.userInfo.fullName);
		setClicked(clicked + 1);
		let newId = '';
		switch (key) {
			case 1:
				newId = item.id;
				break;
			case 2:
				newId = item.parentCommentId;
				break;
			default:
				break;
		}
		setIdResponse(newId);
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

	const RenderComment: React.FC<any> = ({ item }) => {
		const { commentParent, children } = item;
		return (
			<div className='border-b py-[24px]'>
				<div className=' rounded-md p-[4px]'>
					<div className='flex items-center pb-1'>
						<div className='flex items-center'>
							<div className='flex items-center'>
								{commentParent?.userInfo?.urlImage && (
									<div className='relative mr-[5px] max-h-[40px] h-full w-[40px] '>
										<ImageCustom
											className='w-full rounded-[50%] object-cover'
											width={40}
											height={40}
											alt='test vui vui'
											src={commentParent?.userInfo?.urlImage}
										/>
									</div>
								)}
								<div className=''>
									<p className='ml-[2px] mb-[0px] block font-sfpro_semiBold text-sm text-[#000000]'>
										{commentParent?.userInfo?.fullName && commentParent.userInfo?.fullName}
									</p>
									<div>
										<div className='items-centeritems-center flex'>
											<div className='mr-[1.5px] flex items-center'>
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
											<span className='ml-[7px] text-[10px] font-medium leading-5 text-[#999999]'>
												{commentParent && moment(commentParent.createdAt).fromNow()}
											</span>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
				<div className='py-[8px]'>
					<span className='ml-[2px] block text-sm text-[#333333]'>{commentParent?.content}</span>
				</div>
				<div className='flex items-center justify-start rounded-md'>
					{(commentParent?.media || []).map(
						(itemMedia: any, index: number) =>
							index + 1 < 5 && (
								<label
									key={index}
									className='relative my-2 mr-3 flex h-[80px] w-[80px] flex-col  rounded border border-dashed'
								>
									{itemMedia?.description !== 'mp4' ? (
										<div className='flex h-full w-full cursor-pointer flex-col items-center justify-center'>
											<img
												className='block h-full w-full'
												src={itemMedia?.filePath}
												alt='test vui vui'
											></img>
										</div>
									) : (
										<div className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'>
											<iframe
												className='block h-[80px] w-[80px]'
												src={itemMedia?.filePath}
												title='video'
											/>
											<div className='z-2 absolute h-[25px] w-[25px]'>
												<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
											</div>
										</div>
									)}
								</label>
							),
					)}
					{_.isNaN(_.isEmpty(commentParent.media)) &&
					_.isInteger(commentParent.media.length - 5) ? (
						<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
							<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
							<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
								+{(commentParent?.media || []).length - 5}
							</span>
						</label>
					) : null}
				</div>
				<div className='flex items-center justify-start py-2'>
					<button
						onClick={() => handleButtonLike(commentParent, 1)}
						className='mr-4 flex items-center'
					>
						<div className='relative h-[14px] w-5 pr-1'>
							{commentParent?.isLike ? (
								<Icon name={IconEnum.ThumbsUp} size={14} color='primary' />
							) : (
								<Icon name={IconEnum.ThumbsUp} size={14} color='dark' />
							)}
						</div>
						<span
							className={`block text-[14px] ${
								commentParent.isLike ? 'text-[#F05A94]' : 'text-[#999999]'
							}`}
						>
							Hữu ích {commentParent?.isLike ? `(${commentParent.totalLike})` : ''}
						</span>
					</button>
					<button style={{ color: 'rgba(0, 0, 0, 0.54)' }} className='flex items-center	'>
						<div className='relative h-[20px] w-[28px] pr-1'>
							<ImageCustom src='/static/svg/comment.svg' alt='like' layout='fill' />
						</div>
						<span
							onClick={() => onClickShowInput(commentParent, 1)}
							className='text-[14px] text-[#999999]'
							onKeyPress={() => {}}
							role='none'
							tabIndex={0}
						>
							Thảo luận
						</span>
					</button>
				</div>

				{/* Render commentReply */}

				<div className='pl-6'>
					{(children || []).map((itemChild: any, index: number) => (
						<div className='rounded-md' key={index}>
							<div className='py-[8px] pl-2'>
								<div className='align-center justify-content-start flex'>
									<div className='mr-2 h-[24px] w-[24px]'>
										<ImageCustom
											className='w-full rounded-[50%]'
											width={24}
											height={24}
											alt='test vui vui'
											src={itemChild?.userInfo?.urlImage || '/static/images/empty-img.png'}
										/>
									</div>
									<span className='text-[rounded-md] mr-2 block font-sfpro_semiBold text-sm text-[#000000]'>
										{itemChild?.userInfo?.fullName || 'Hack'}
									</span>
									<span className='ml-[10px] block text-12 font-medium leading-5 text-[#999999]'>
										{moment(itemChild?.createAt).fromNow()}
									</span>
								</div>
								<div className='flex py-[8px]'>
									<span className='mx-[2px] block font-sfpro_semiBold text-[#000000]'>
										@{(itemChild?.userInfo?.fullName && itemChild?.userInfo?.fullName) || 'Hack'}
									</span>

									<span className='block text-[#333333]'>{itemChild?.content}</span>
								</div>

								<div className='mt-1'>
									<div className='flex items-center justify-start'>
										{(itemChild?.media || []).map(
											(itemMedia: any, index: number) =>
												index + 1 < 5 && (
													<label
														key={index}
														className='relative my-2 mr-3 flex h-[80px] w-[80px] flex-col  rounded border border-dashed'
													>
														{itemMedia?.description !== 'mp4' ? (
															<div className='flex h-full w-full cursor-pointer flex-col items-center justify-center'>
																<img
																	className='block h-full w-full'
																	src={itemMedia?.filePath}
																	alt='test vui vui'
																></img>
															</div>
														) : (
															<div className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'>
																<iframe
																	className='block h-[80px] w-[80px]'
																	src={itemMedia?.filePath}
																	title='video'
																/>
																<div className='z-2 absolute h-[25px] w-[25px]'>
																	<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
																</div>
															</div>
														)}
													</label>
												),
										)}
										{_.isNaN(_.isEmpty(itemChild.media)) &&
										_.isInteger(itemChild.media.length - 5) ? (
											<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
												<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
												<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
													+{(itemChild?.media || []).length - 5}
												</span>
											</label>
										) : null}
									</div>
								</div>
								<div className='flex items-center justify-start pt-1'>
									<button
										onClick={() => handleButtonLike(itemChild, 2)}
										className='mr-4 flex items-center'
									>
										<div className='relative h-[14px] w-5'>
											{itemChild?.isLike ? (
												<Icon name={IconEnum.ThumbsUp} size={14} color='primary' />
											) : (
												<Icon name={IconEnum.ThumbsUp} size={14} color='gray' />
											)}
										</div>
										<span
											className={`block text-[14px] ${
												itemChild.isLike ? 'text-[#F05A94]' : 'text-[#999999]'
											} `}
										>
											Hữu ích {+itemChild?.totalLike ? `(${itemChild?.totalLike})` : ''}
										</span>
									</button>
									<button
										onClick={() => onClickShowInput(itemChild, 2)}
										style={{ color: 'rgba(0, 0, 0, 0.54)' }}
										className='ml-[15px] flex items-center'
									>
										<div className='relative h-[20px] w-[28px]'>
											<ImageCustom src='/static/svg/comment.svg' alt='like' layout='fill' />
										</div>
										<span className='text-[14px] text-[#0000008A]'>Thảo luận</span>
									</button>
								</div>
							</div>
						</div>
					))}
				</div>

				{/* Show input detail */}

				{isLoadingSeeMore.id === commentParent.id && isLoadingSeeMore.isLoading ? (
					<div className='mt-5'>
						<DynamicSpin isColor='#cdcdcd' />
					</div>
				) : null}

				{/* Show see more detail */}

				{children && commentParent?.sumComment - children?.length > 0 ? (
					<div
						className='mb-2 flex items-center pl-8'
						onClick={() => handleSeeMoreDetail(children.at(-1)?.parentCommentId)}
						onKeyPress={() => {}}
						role='button'
						tabIndex={0}
					>
						{/* <ImageCustom src='/static/svg/reply.svg' alt='like' width={24} height={24} /> */}
						<div className='flex cursor-pointer py-1 font-sfpro_bold text-14 leading-5 text-[#333333]'>
							Xem
							<span className='mx-[2px] block'>{commentParent.sumComment - children.length}</span>
							thảo luận khác
						</div>
					</div>
				) : null}
			</div>
		);
	};
	return (
		<div
			className={classNames([
				'relative mt-4 px-3',
				[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
					'pointer-events-none',
			])}
		>
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
			{dataRender?.length < totalComment?.analysisComment?.totalCommentInProduct && (
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
						Xem
						<span className='mx-[2px] block'>
							{totalComment &&
								totalComment?.analysisComment?.totalCommentInProduct - dataRender.length}
						</span>
						thảo luận khác
					</div>
				</div>
			)}
			{userInfo && (
				<div className='flex py-[3px] text-sm'>
					Trả lời:
					<span className='ml-[2px] block font-sfpro_bold text-[#000000]'> @{userInfo}</span>
				</div>
			)}
			{isLoadingDetail ? (
				<div className='mx-4'>
					<DynamicSpin isColor='#cdcdcd' />
				</div>
			) : null}
			<div className='flex items-center justify-start'>
				{listMedia && listMedia.length
					? listMedia.map((itemMedia: any, indexMedia: number) => {
							if (indexMedia + 1 < 5) {
								return (
									<label
										key={indexMedia}
										className='relative m-2 flex h-[80px] w-[80px] flex-col rounded  border border-dashed'
									>
										{itemMedia?.type !== 'mp4' ? (
											<div className='flex cursor-pointer flex-col items-center justify-center'>
												<img
													className='block h-[80px] w-[80px]'
													src={itemMedia?.url}
													alt='test vui vui'
												></img>
											</div>
										) : (
											<div className='relative flex h-[80px] w-[80px] cursor-pointer flex-col items-center justify-center'>
												<iframe
													className='block h-[80px] w-[80px]'
													src={itemMedia?.url}
													title='video'
												/>
												<div className='z-2 absolute h-[25px] w-[25px]'>
													<img src='/static/svg/play-icon.svg' alt='play icon vuivui' />
												</div>
											</div>
										)}

										<div
											onClick={() => handleDeleteMedia(itemMedia?.url)}
											onKeyPress={() => {}}
											role='button'
											tabIndex={0}
											className='absolute right-[-10px] top-[-10px] flex h-5 w-5 cursor-pointer items-center justify-center rounded-[50%] bg-[rgba(143,155,179,0.7)]'
										>
											<ImageCustom
												src='/static/svg/icon-close-order.svg'
												alt='close'
												width={10}
												height={10}
											/>
										</div>
									</label>
								);
							}
					  })
					: null}
				{_.isNaN(_.isEmpty(listMedia)) && _.isInteger(listMedia.length - 5) ? (
					<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
						<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
						<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
							+{(listMedia || []).length - 5}
						</span>
					</label>
				) : null}
			</div>
			<div
				id='comment-form'
				className={classNames([
					[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!) &&
						'pointer-events-none',
				])}
			>
				<CommentForm
					id={idResponse}
					title='Đặt câu hỏi về sản phẩm'
					onSubmitForm={onSubmitForm}
					handleUpdateMedia={handleUpdateMedia}
				/>
			</div>
		</div>
	);
};

export default memo(CommentBoxMobile);
