import classNames from 'classnames';
import { ImageCustom, Notification } from 'components';
import { EmptyImage } from 'constants/';
import { MODE_RUNNER } from 'enums';
import { useAppSelector } from 'hooks';
import { IProductDetailProps, IPropsProductMedia } from 'models';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import { postProductLike } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';

import Portal from '@/HOCs/portal';
import { productDetailSelector } from '@/store/reducers/productDetailSlice';
import { detectUrlMedia } from '@/utils/getYoutubeId';

interface IUserInteraction {
	type: string;
	id: number;
	countTotalUserInteraction?: number;
	icon: JSX.Element;
	onLike?: () => void;
}
interface IOpenModalDetail {
	defaultActiveImage: number | '';
	isActive: boolean;
}

interface LikedProps {
	isLiked: boolean;
	total?: number;
}

interface IsActiveImageSide {
	isActiveIndex: boolean;
	idActive: number;
}

const DynamicModalProductDetail = dynamic(() => import('@/components/Modal/ModalProductDetail'), {
	loading: () => <div>Loading...</div>,
	ssr: false,
});

const MemoChildMedia: React.FC<IPropsProductMedia> = ({
	typeMedia,
	url,
	optionOther,
	isVideo,
	idHoverVariant,
	OnOpenModalDetail,
	productDetails,
}) => {
	const { query } = useRouter();

	if ((typeMedia === 1 || typeMedia === 10 || typeMedia === 2) && !isVideo) {
		return (
			<div
				className={classNames([
					'relative flex-[0_0_calc(50%_-_2px)] max-w-[calc(50%_-_2px)] h-[calc(50%_-_4px)]  group cursor-pointer rounded-[3px]',
					typeMedia === 2 && 'order-3',
					typeMedia === 10 && 'order-4',
				])}
				onClick={OnOpenModalDetail}
				onKeyPress={() => {}}
				tabIndex={0}
				role='button'
			>
				{typeMedia === 1 ? (
					<div className='absolute top-4 left-4 z-20 -translate-x-4 -translate-y-4'>
						<button className='ml-4 mt-4 w-fit rounded-full bg-[rgba(14,14,16,0.4)] p-3'>
							<div className='relative h-6 w-6'>
								<ImageCustom
									layout='fill'
									src='/static/svg/zoom-in-icon.svg'
									alt='zoon icon vuivui'
								/>
							</div>
						</button>
					</div>
				) : (
					''
				)}
				{(idHoverVariant && typeMedia === 1) || (typeMedia === 1 && query?.variationId) ? (
					<ImageCustom
						src={
							productDetails.variations.find(
								(item) => item?.variationId === (idHoverVariant ?? Number(query?.variationId)),
							)?.variationImage ?? url
						}
						alt='image product vuivui'
						className='h-full object-cover'
						height='100%'
					/>
				) : (
					<ImageCustom
						src={url || EmptyImage}
						alt='image product vuivui'
						className='h-full object-cover'
						height='100%'
					/>
				)}

				{optionOther?.isActive && optionOther.total !== 0 ? (
					<>
						<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
						<span className='absolute top-2/4 left-2/4 z-10 -translate-x-2/4 -translate-y-2/4 text-36 text-white'>
							+ {optionOther.total}
						</span>
					</>
				) : (
					<div className='inset-0 bg-[#0E0E10]/20 group-hover:absolute'></div>
				)}
			</div>
		);
	}
	if (isVideo) {
		//for videos
		return (
			<div
				className='group relative max-h-[calc(50%_-_4px)] max-w-[calc(50%_-_2px)]  flex-[0_0_calc(50%_-_2px)] cursor-pointer rounded-[3px]'
				onClick={OnOpenModalDetail}
				onKeyPress={() => {}}
				tabIndex={0}
				role='button'
			>
				<ImageCustom
					src={url || EmptyImage}
					alt='image product vuivui'
					className='object-cover'
					height='100%'
					priority
				/>
				<div className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'>
					<div className='relative h-[64px] w-[64px]'>
						<ImageCustom src='/static/svg/play-icon.svg' alt='play icon vuivui' layout='fill' />
					</div>
				</div>
			</div>
		);
	}
	return <div></div>;
};

const RenderTypeMedia = React.memo(MemoChildMedia);

const ProductMedia: React.FC<IProductDetailProps> = ({
	productDetails,
	mode,
	infoMerchant,
}: IProductDetailProps) => {
	// 1 -> main image
	// 2 -> selling points
	// 3 -> video
	// 10 -> other
	const idHoverVariant = useAppSelector(productDetailSelector);
	const [isActiveImageSlide, setIsActiveImageSlide] = useState<IsActiveImageSide>({
		idActive: 0,
		isActiveIndex: false,
	});

	const mergeData = useMemo(() => {
		return productDetails?.videos?.length !== 0
			? [
					...productDetails?.videos?.map((item) => {
						return { content: item.content, isVideos: Boolean(productDetails?.videos?.length) };
					}),
					...productDetails?.images,
			  ]
			: productDetails?.images;
	}, [productDetails?.videos, productDetails?.images]);

	const [isLiked, setIsLiked] = useState<LikedProps>({
		isLiked: Boolean(productDetails?.isLike === 1),
		total: productDetails?.totalLike!,
	});
	const { query } = useRouter();

	useEffect(() => {
		const regexIndex = mergeData?.findIndex(
			(ele) =>
				productDetails.variations.find(
					(item) => item?.variationId === (idHoverVariant ?? Number(query?.variationId)),
				)?.variationImage === ele?.content,
		);

		setIsActiveImageSlide((prev) => ({
			...prev,
			idActive: regexIndex > 0 ? regexIndex : 0,
			isActiveIndex: Boolean(regexIndex),
		}));
	}, [idHoverVariant, query?.variationId]);

	useEffect(() => {
		setIsLiked((prev) => ({
			...prev,
			total: productDetails?.totalLike!,
			isLiked: Boolean(productDetails?.isLike === 1),
		}));
	}, [productDetails?.id]);

	const [isOpenModalDetail, setIsOpenModalDetail] = useState<IOpenModalDetail>({
		defaultActiveImage: '',
		isActive: false,
	});

	const userInteractionData: IUserInteraction[] = [
		{
			id: 1,
			type: 'Thích',
			countTotalUserInteraction: isLiked?.total,
			icon: (
				<Icon
					name={IconEnum.Heart}
					size={22}
					fill={isLiked.isLiked ? '#DF0707' : '#757575'}
					color={isLiked.isLiked ? '#DF0707' : 'transparent'}
				/>
			),
			onLike: async () => {
				setIsLiked((prev) => ({
					...prev,
					isLiked: !isLiked?.isLiked,
					total: !isLiked?.isLiked ? isLiked?.total! + 1 : isLiked?.total! - 1,
				}));
				try {
					const resLiked = await postProductLike({ productId: productDetails?.id });
					Notification.Info.default(
						`${
							resLiked?.data?.isLike === 1
								? 'Thêm thành công vào mục yêu thích'
								: 'Xóa thành công khỏi mục yêu thích'
						}`,
						'SUCCESS',
						3000,
					);
				} catch (error) {
					Notification.Info.default('Xin vui lòng thử lại', 'ERROR', 3000);
					setIsLiked((prev) => ({
						...prev,
						total: Number(isLiked?.total) - 1,
						isLiked: !isLiked?.isLiked,
					}));
				}
			},
		},
		{
			id: 2,
			type: 'Bình luận',
			countTotalUserInteraction: productDetails?.totalComment ?? 0,
			icon: <Icon name={IconEnum.ChatText} size={22} fill={'#757575'} color={'white'} />,
		},
		{
			id: 3,
			type: 'Chia sẻ',
			countTotalUserInteraction: productDetails?.totalShare ?? 0,
			icon: <Icon name={IconEnum.ShareNetwork} size={22} fill={'#757575'} color={'#757575'} />,
		},
	];

	return (
		<div className='top-[70px] m-auto w-full' style={{ position: 'sticky' }}>
			<div className='relative font-sfpro'>
				{productDetails && (
					<>
						{mergeData?.length < 4 ? (
							<div className='flex flex-nowrap overflow-hidden relative'>
								<div
									className='absolute right-5 top-[50%] cursor-pointer translate-y-[50%] z-[10] flex h-[35px] w-[35px] items-center justify-center rounded-full border border-E7E7E8 bg-white'
									onClick={() =>
										setIsActiveImageSlide((prev) => ({
											...prev,
											idActive:
												isActiveImageSlide.idActive + 1 === mergeData?.length
													? 0
													: isActiveImageSlide.idActive + 1,
											isActiveIndex: true,
										}))
									}
									tabIndex={0}
									role={'button'}
									onKeyPress={() =>
										setIsActiveImageSlide((prev) => ({
											...prev,
											idActive:
												isActiveImageSlide.idActive + 1 === mergeData?.length
													? 0
													: isActiveImageSlide.idActive + 1,
											isActiveIndex: true,
										}))
									}
								>
									<Icon name={IconEnum.CaretRight} size={22} color={'#757575'} />
								</div>
								{mergeData?.map((item, index: any) => {
									return (
										<div
											className='relative aspect-square h-[calc(100vh_-_160px)] w-full cursor-pointer'
											key={index}
											style={{
												// transition: '300ms ease all',
												transform: `translateX(-${
													isActiveImageSlide?.idActive === index
														? index * 100
														: index + 1 === mergeData?.length
														? 100
														: (index + 1) * 100
												}%)`,
											}}
										>
											{item?.isVideos ? (
												<iframe
													title={'vuivui video'}
													src={detectUrlMedia(item.content)?.url}
													allow='autoplay'
													frameBorder='0'
													className='h-full w-full bg-[#ededed]'
												></iframe>
											) : (
												<ImageCustom
													src={item.content}
													alt='video vuivui'
													className='object-contain'
													onClick={(): void =>
														setIsOpenModalDetail((prev) => ({
															...prev,
															defaultActiveImage:
																productDetails.videos.length !== 0 && index + 1 === 3
																	? productDetails.images.length + 1
																	: index + 1,
															isActive: true,
														}))
													}
												/>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div
								className={'flex h-[calc(100vh_-_130px)] flex-wrap justify-between overflow-hidden'}
							>
								{productDetails.images
									.sort((a, b) => a.type - b.type)
									.map((img: any, index: number) => {
										return (
											index + 1 <= 4 && (
												<RenderTypeMedia
													OnOpenModalDetail={(): void =>
														setIsOpenModalDetail((prev) => ({
															...prev,
															defaultActiveImage:
																productDetails.videos.length !== 0 && index + 1 === 3
																	? productDetails.images.length + 1
																	: index + 1,
															isActive: true,
														}))
													}
													productDetails={productDetails}
													idHoverVariant={idHoverVariant}
													url={
														productDetails.videos.length !== 0 && index + 1 === 3
															? productDetails.images[0].content
															: img.content
													}
													typeMedia={img.type}
													key={index}
													isVideo={productDetails.videos.length !== 0 && index + 1 === 3 && true}
													optionOther={{
														isActive: index + 1 === 4 && true,
														total: productDetails.images.length - (index + 1),
													}}
												/>
											)
										);
									})}
							</div>
						)}

						{/* user action */}
						<div
							className={classNames([
								'flex items-center justify-between p-4 relative',
								[MODE_RUNNER.PREVIEWING, MODE_RUNNER.PREVIEW_PROMOTION]?.includes(mode!)
									? 'pointer-events-none -z-10'
									: '',
							])}
						>
							{userInteractionData?.map((item, i: number) => (
								<div
									className='group gap-2 flex flex-auto cursor-pointer'
									key={i}
									onClick={item?.onLike}
									onKeyPress={item?.onLike}
									tabIndex={0}
									role={'button'}
								>
									<div
										className={classNames([
											'animation-300 relative w-auto',
											item.id === 1
												? 'group-hover:filterRedColor'
												: 'group-hover:filterPrimaryColor',
										])}
									>
										{item.icon}
									</div>
									<span
										className={classNames([
											'animation-300 block group-hover:text-pink-F05A94',
											isLiked.isLiked && item.id === 1 && 'text-pink-F05A94',
										])}
									>
										{item.type} ({item?.countTotalUserInteraction})
									</span>
								</div>
							))}
							{/* info merchant */}
							<div className='group flex max-w-[35%] flex-[35%] cursor-pointer items-center justify-end gap-2'>
								<div className='relative h-[30px] w-full max-w-[30px] overflow-hidden rounded-full'>
									<ImageCustom
										src={productDetails?.merchant?.avatarImage}
										alt='merchant vuivui'
										layout='fill'
										objectFit='cover'
									/>
								</div>
								<a className='block text-ellipsis text-14 text-primary-009ADA line-clamp-1'>
									{productDetails.merchant.name}
								</a>
								{Number(infoMerchant?.extra?.averageRating) > 0 ? (
									<>
										<img
											src='/static/svg/star-product.svg'
											alt='star'
											className='object-cover h-[18px] w-full max-w-[18px]'
										/>
										<span className='px-1'>{infoMerchant?.extra?.averageRating}</span>
									</>
								) : null}

								<img
									src='/static/svg/Info.svg'
									alt='star'
									className='object-cover h-[18px] w-full max-w-[18px]'
								/>

								{/* popup info small */}
								<div
									className={classNames([
										'group-hover:opacity-100 group-hover:visible opacity-0 z-[50] invisible shadow-md absolute text-333333 top-[70%] right-0 animation-300',
									])}
								>
									<div className='relative h-full rounded-[3px] border bg-white p-3'>
										<div className='absolute -top-3 right-0 z-20 inline-block w-8 overflow-hidden'>
											<div className='border- h-[12px] w-[12px] origin-bottom-left rotate-45 border bg-white'></div>
										</div>
										<div className='flex items-center'>
											<div>
												<span className='inline-block pr-[3px] font-sfpro_semiBold text-14 font-semibold'>
													{infoMerchant?.extra?.totalProduct}
												</span>
												<span className='text-14 text-dark-666666'>sản phẩm</span>
											</div>
											<span className='block px-4'> | </span>
											<div>
												<span className='inline-block pr-[3px] font-sfpro_semiBold text-14 font-semibold'>
													{infoMerchant?.extra?.totalStore}
												</span>
												<span className='text-14 text-dark-666666'>chi nhánh</span>
											</div>
										</div>
										<span className='block py-3 pt-1.5 text-14 font-normal leading-5 text-dark-666666'>
											Đổi trả trong vòng 14 ngày
										</span>

										<div className='flex items-center'>
											<Link href={`/${productDetails?.merchant?.portalLink}`}>
												<div className='mr-1.5 block cursor-pointer text-14 text-primary-009ADA'>
													Xem chi tiết
												</div>
											</Link>
											<div className='mr-1.5 block cursor-pointer pl-4 text-14 text-primary-009ADA'>
												Chat
											</div>
											<div className='mr-1.5 flex cursor-pointer items-center pl-4 text-14 text-primary-009ADA'>
												<span>Gọi</span>
												<div className='relative ml-2 h-[8px] w-[15px] px-1.5 '>
													<ImageCustom
														src='/static/svg/chevron-down-00ADA.svg'
														alt='star'
														layout='fill'
													/>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
			{isOpenModalDetail.isActive ? (
				<Portal>
					<DynamicModalProductDetail
						show={isOpenModalDetail}
						activeMode={'gallary'}
						dataSource={productDetails.images}
						videos={productDetails.videos.length !== 0 ? productDetails.videos : []}
						onClose={(): void =>
							setIsOpenModalDetail((prev) => ({ ...prev, defaultActiveImage: '', isActive: false }))
						}
					/>
				</Portal>
			) : (
				''
			)}
		</div>
	);
};

export default ProductMedia;
