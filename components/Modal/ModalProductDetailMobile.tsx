import classNames from 'classnames';
import { ImageCustom, Notification } from 'components';
import { EmptyImage } from 'constants/';
import { useAppSelector, useIsomorphicLayoutEffect, useLastElement } from 'hooks';
import { Product, ProductProperties } from 'models';
import moment from 'moment';
import { useRouter } from 'next/router';
import React, { MutableRefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { postProductLike } from 'services';
import { cartSelector } from 'store/reducers/cartSlice';
import { detectUrlMedia } from 'utils/getYoutubeId';
import { Icon, IconEnum } from 'vuivui-icons';

type ModeModal = 'gallary' | 'slider' | 'fastPreview';

interface IActiveImageProps {
	index: number;
	isActive: boolean;
}
export interface IOpenModalDetail {
	defaultActiveImage: number;
	isActive: boolean;
}
interface SpecsFastPreview {
	imgBackground: string;
	dataProperties: Product['properties'];
	onClick: () => void;
}
interface IModalProductDetail {
	onClose?: React.MouseEventHandler;
	onClick: React.Dispatch<React.SetStateAction<IOpenModalDetail>>;
	showModal: IOpenModalDetail;
	activeMode: ModeModal;
	extraData: Product;
	dataSpecs: Product['content'];
	dataProperties: Product['properties'];
	dataSource: Product['images'];
	dataMerchant: Product['merchant'];
	videos: Product['videos'];
	isHidden?: boolean;
}

interface IUserInteraction {
	prefixNumber: number;
	icon: JSX.Element;
	onLike?: () => void;
	id: number;
}
interface LikedProps {
	isLiked: boolean;
	total?: number;
}

const ProductSpecsFastPreview = React.forwardRef(
	({ imgBackground, dataProperties, onClick }: SpecsFastPreview, ref: any) => {
		return (
			<div
				ref={ref}
				id={String(2)}
				onClick={onClick}
				onKeyPress={onClick}
				tabIndex={0}
				role='button'
				className='relative mx-auto aspect-square max-h-[100vh] w-full first-of-type:mt-4 last-of-type:mb-0'
				style={{
					background:
						'linear-gradient(90deg, rgba(255,255,255, 0.8) 100%), rgba(255,255,255, 0.8) 100%)',
				}}
			>
				<ImageCustom
					src={imgBackground ?? EmptyImage}
					alt='image vuivui'
					width={'100%'}
					height={'100%'}
					priority
					className='mx-auto object-cover blur-[1px] brightness-[0.8]'
				/>

				<div className='absolute top-0 z-10 flex justify-between px-4 py-8'>
					<div className='flex flex-wrap justify-between'>
						<div className='flex w-full max-w-[45%] flex-[50%] font-sfpro_bold text-24 font-semibold leading-9 text-white'>
							Đặc điểm nổi bật
						</div>
						{(dataProperties || []).map((property: ProductProperties, index: number) => {
							return (
								property.propertyOriginalValue && (
									<div
										className='mt-4 flex max-w-[calc(50%_-_15px)] flex-[50%] flex-col'
										key={index}
									>
										<div className='text-12 text-[#F3F3F3]'>{property.propertyName}</div>
										<div className='pt-1 pb-3 font-sfpro_bold text-white'>
											{property.propertyOriginalValue}
										</div>
										<div className='w-full border border-white'></div>
									</div>
								)
							);
						})}
					</div>
				</div>
			</div>
		);
	},
);

const ModalProductDetailMobile: React.FC<IModalProductDetail> = ({
	onClose,
	onClick,
	showModal,
	dataSpecs,
	activeMode,
	dataMerchant,
	dataProperties,
	dataSource,
	extraData,
	videos,
	isHidden,
}) => {
	const [isLiked, setIsLiked] = useState<LikedProps>({
		isLiked: Boolean(extraData?.isLike === 1),
		total: extraData?.totalLike!,
	});

	useEffect(() => {
		setIsLiked((prev) => ({
			...prev,
			total: extraData?.totalLike!,
			isLiked: Boolean(extraData?.isLike === 1),
		}));
	}, [extraData?.id]);

	const userActionAndSocialMedia: IUserInteraction[] = [
		// {
		// 	id: 1,
		// 	prefixNumber: 0,
		// 	icon: (
		// 		<Link href={`/${dataMerchant.portalLink}`}>
		// 			<a className='relative flex flex-col justify-center w-[28px] h-full max-h-[28px] overflow-hidden'>
		// 				<ImageCustom
		// 					src={dataMerchant?.avatarImage}
		// 					alt='star'
		// 					width={64}
		// 					height={64}
		// 					className={'overflow-hidden object-cover rounded-full border border-[#E0E0E0]'}
		// 				/>
		// 			</a>
		// 		</Link>
		// 	),
		// },
		{
			id: 1,
			prefixNumber: isLiked?.total!,
			onLike: async () => {
				setIsLiked((prev) => ({
					...prev,
					isLiked: !isLiked?.isLiked,
					total: !isLiked?.isLiked ? isLiked?.total! + 1 : isLiked?.total! - 1,
				}));
				try {
					const resLiked = await postProductLike({ productId: extraData?.id });
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
			icon: (
				<Icon
					name={IconEnum.Heart}
					color={isLiked.isLiked ? '#DF0707' : '#333333'}
					fill={isLiked.isLiked ? '#DF0707' : 'transparent'}
					size={24}
				/>
			),
		},
		{
			id: 2,
			prefixNumber: extraData?.totalShare ?? 0,
			icon: (
				<div className='w-5 h-5 overflow-hidden'>
					<img src='/static/svg/icon-share-new.svg' alt='' />
				</div>
			),
		},
	];
	const [isActiveImage, setIsActiveImage] = useState<IActiveImageProps>({
		index: 1,
		isActive: false,
	});

	const [touchStart, setTouchStart] = useState(null);
	const [touchEnd, setTouchEnd] = useState(null);
	const [srcGif, setSrcGif] = useState<string>('/static/svg/ic_scroll.gif');
	const [isHiddenTouch, setIsHiddenTouch] = useState<boolean>(false);
	const router = useRouter();
	const cartState = useAppSelector(cartSelector);
	const observer: MutableRefObject<any> = useRef();

	const mergeData = useMemo(() => {
		return videos.length !== 0
			? [
					...videos.map((item) => {
						return { content: item.content, isVideos: Boolean(videos.length) };
					}),
					...dataSource,
			  ]
			: dataSource;
	}, [videos, dataSource]);

	useIsomorphicLayoutEffect(() => {
		showModal.isActive && (document.body.style.overflow = 'hidden');
		setIsActiveImage((prev) => ({
			...prev,
			index: showModal && showModal.defaultActiveImage,
			isActive: showModal && showModal.isActive ? true : false,
		}));
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [showModal.isActive]);

	const RefElementScroll = useCallback((node) => {
		observer.current = new IntersectionObserver(
			(entries) => {
				if (observer.current) observer.current.disconnect();
				if (
					entries?.[0]?.isIntersecting ||
					(entries?.[0]?.intersectionRatio === 0 && isActiveImage.index === mergeData?.length + 1)
				) {
					setIsActiveImage((prev) => ({ ...prev, index: +entries?.[0]?.target?.id }));
				}
			},
			{
				threshold: 0.4,
			},
		);

		if (node) observer?.current?.observe(node);
	}, []);

	const { lastElementRef: RefElementTouch } = useLastElement(
		false,
		isActiveImage.index >= 2 || isActiveImage.index === 2,
		() => setIsHiddenTouch(true),
	);

	const handleChangeModeButton = (isPreviewModal: boolean, event: any) => {
		//fast preview -> go back
		//preview -> close modal
		!isPreviewModal ? router.back() : onClose?.(event);
	};

	const minSwipeDistance = 50;

	const onTouchStart = (e: any) => {
		setTouchEnd(null); // otherwise the swipe is fired even with usual touch events
		setTouchStart(e.targetTouches[0].clientY);
	};
	const onTouchMove = (e: any) => setTouchEnd(e.targetTouches[0].clientY);

	const onTouchEnd = () => {
		if (!touchStart || !touchEnd) return;
		const distance = touchStart - touchEnd;
		const isDownSwipe = distance > minSwipeDistance;
		const isUpSwipe = distance < minSwipeDistance;
		if (isDownSwipe && showModal?.isActive && isActiveImage?.index + 1 <= mergeData?.length) {
			setIsActiveImage((prev) => ({
				...prev,
				index: isActiveImage?.index + 1,
			}));
		}
		if (isUpSwipe && showModal?.isActive && isActiveImage?.index - 1 !== 0) {
			setIsActiveImage((prev) => ({
				...prev,
				index: isActiveImage?.index - 1,
			}));
		}
	};

	useIsomorphicLayoutEffect(() => {
		let refreshGif = setInterval(() => {
			setSrcGif(`/static/svg/ic_scroll.gif?x=${moment().valueOf()}`);
			isActiveImage.index && clearInterval(refreshGif);
		}, 2200);
		return () => clearInterval(refreshGif);
	}, []);

	return (
		<React.Fragment>
			<div className='visible fixed top-0 z-[60] flex w-full justify-between'>
				<button
					className='ml-4 mt-4 h-10 w-10 rounded-full bg-[#FFFFFF]/70'
					onClick={(event) => handleChangeModeButton(showModal.isActive, event)}
				>
					<div className='flex justify-center rounded-full'>
						<Icon name={IconEnum.ArrowLeft} color={'#333333'} size={24} />
					</div>
				</button>
				<div className='flex-auto justify-end gap-2 flex mr-4'>
					{userActionAndSocialMedia.map((icon, i: number) => (
						<button
							key={i}
							onClick={() => icon?.onLike?.()}
							className='relative mt-4 rounded-full bg-[#FFFFFF]/70 h-[40px] w-[40px] flex justify-center items-center'
						>
							{icon.icon}
						</button>
					))}
					{cartState.total > 0 && (
						<button
							className='relative mt-4 rounded-full bg-[#FFFFFF]/70 h-[40px] w-[40px] flex justify-center items-center'
							onClick={() => router.push('/gio-hang')}
						>
							<Icon size={24} name={IconEnum.ShoppingCart} color={'#333333'} />
							<div
								className='py-auto absolute top-0 rounded-[10px] bg-[#DF0707] w-auto min-w-[22px] h-[22px] font-sfpro_bold text-[11px] font-bold text-white'
								style={{ right: '-10px' }}
							>
								<div className='flex items-center justify-center h-full px-2'>
									{cartState.total <= 99 ? cartState.total : 99}{' '}
									{cartState.total > 99 ? <sup>+</sup> : ''}
								</div>
							</div>
						</button>
					)}
				</div>
			</div>

			<div
				className={classNames([
					showModal.isActive ? 'fixed max-h-[88vh]' : 'absolute max-h-[70vh]',
					'left-4 z-[30] h-auto',
				])}
				style={{ right: '16px', top: '100%' }}
			>
				{mergeData.length > 1 && !showModal?.isActive && (
					<div
						className={classNames([
							'absolute bottom-0 z-10 ml-4 mb-10 w-max',
							isHiddenTouch ? 'opacity-0 pointer-events-none invisible' : 'opacity-100',
						])}
						ref={RefElementTouch}
					>
						<div
							className={
								'flex h-[44px] w-[44px] justify-center overflow-hidden rounded-full bg-[#0E0E10]/20'
							}
						>
							<img src={srcGif} alt={'gif vuivui'} className={'w-[32px] h-auto'} />
						</div>

						<div className='relative mt-3 rounded bg-[#0E0E10] bg-opacity-[80] px-2 py-1 text-14 text-white'>
							Vuốt lên để xem ảnh
							<div className='absolute -top-3 left-4 z-20 inline-block w-8 overflow-hidden'>
								<div className='h-[12px] w-[12px] origin-bottom-left rotate-45 bg-[#0E0E10]/80'></div>
							</div>
						</div>
					</div>
				)}

				{showModal?.isActive ? null : (
					<>
						<span
							className={classNames([
								'absolute left-0 z-50 inline-block rounded-full px-2 py-0.5 text-16 font-normal leading-6 text-white',
								showModal?.isActive ? 'top-[calc(100%_-_82px)]' : 'bottom-4',
							])}
							style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
						>
							{isActiveImage.index}/{mergeData?.length + 2}
						</span>

						{extraData?.averageStar !== 0 && extraData?.averageRating !== 0 && (
							<span
								className={classNames([
									'absolute right-0 z-50 inline-block rounded-full px-2 py-[6px] text-16 font-normal leading-6 text-[#333333]',
									showModal?.isActive ? 'top-[calc(100%_-_82px)]' : 'bottom-4',
								])}
								style={{ backgroundColor: 'rgba(255, 255, 255, 0.7)' }}
							>
								<div className='flex items-center text-[13px] font-sfpro_semiBold font-medium'>
									<div className='flex items-center pr-[6px]'>
										<span>{extraData?.averageStar}</span>
										<div className='relative h-4 w-4 px-1 pl-[3px]'>
											<ImageCustom src='/static/svg/star-product.svg' alt='star' layout='fill' />
										</div>
									</div>
									<span>({extraData?.averageRating})</span>
								</div>
							</span>
						)}
					</>
				)}
			</div>
			<div
				className={classNames([
					'bg-white fixed top-0 bottom-0 right-0 h-full w-full z-[20] animation-300',
					!showModal.isActive &&
						'relative mx-auto mb-4 aspect-square h-full max-h-[80vh] w-full first-of-type:mt-4 last-of-type:mb-0 overflow-auto hide-scrollbar',
					showModal.isActive || activeMode === 'fastPreview' ? 'left-0' : 'left-[100%]',
				])}
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
			>
				{/* render with mode modal */}
				{activeMode === 'gallary' && mergeData && isActiveImage.index && isActiveImage.isActive && (
					<div className={`flex w-full flex-col`}>
						{isHidden &&
							mergeData?.map((item: any, i: number) => {
								return (
									<div
										className='relative mb-4 aspect-square h-full flex-auto last-of-type:mb-0'
										key={i}
									>
										{item.typeFile === 'mp4' ? (
											<iframe
												title={'vuivui video'}
												src={item.content || EmptyImage}
												frameBorder='0'
												className='h-full w-full'
											></iframe>
										) : (
											<img
												alt=''
												className='w-full object-cover'
												src={item.content || EmptyImage}
											/>
										)}
									</div>
								);
							})}
					</div>
				)}

				{activeMode === 'fastPreview' && (
					<>
						{showModal.isActive ? (
							<div className='inset-0 fixed z-[20] overflow-hidden visible'>
								{mergeData?.map((item, index: number) => {
									return (
										<div
											className='mx-auto flex h-full max-h-[100vh] w-full flex-col justify-center bg-white last-of-type:mb-0'
											key={index}
											style={{
												transition: '300ms ease all',
												transform: `translateY(-${(Number(isActiveImage.index) - 1) * 100}%)`,
											}}
										>
											{item?.isVideos ? (
												<>
													{detectUrlMedia(item.content)?.isYoutubeUrl ||
													detectUrlMedia(item.content)?.isFacebookUrl ||
													detectUrlMedia(item.content)?.isTikTokUrl ? (
														<iframe
															title={'vuivui video'}
															src={
																`${detectUrlMedia(item.content).url}${
																	detectUrlMedia(item.content)?.isYoutubeUrl
																		? '?autoplay=1&autohide=1&modestbranding=1&showinfo=0&loop=1&rel=0'
																		: ''
																}` || EmptyImage
															}
															allow='autoplay'
															frameBorder='0'
															className='h-full w-full'
														></iframe>
													) : (
														<video
															className='h-full aspect-square w-full object-cover'
															loop
															muted
															autoPlay
														>
															<source src={detectUrlMedia(item.content).url} />
														</video>
													)}
												</>
											) : (
												<div className='relative h-full w-auto'>
													<ImageCustom
														src={item.content}
														alt='image product vuivui'
														width={'100%'}
														height={'100%'}
														className={'object-cover mx-auto'}
													/>
												</div>
											)}
										</div>
									);
								})}
							</div>
						) : (
							<div className='relative aspect-square h-full w-full'>
								{mergeData?.map((item, index: number) => {
									return index !== 1 ? (
										<div
											className='mx-auto h-auto min-h-[250px] aspect-square w-full last-of-type:mb-0'
											key={index}
											id={String(index + 1)}
											ref={RefElementScroll}
											onClick={() =>
												onClick((prev) => ({
													...prev,
													defaultActiveImage: 1,
													isActive: true,
												}))
											}
											onKeyPress={() =>
												onClick((prev) => ({
													...prev,
													defaultActiveImage: 1,
													isActive: true,
												}))
											}
											tabIndex={0}
											role='button'
										>
											{item?.isVideos ? (
												<>
													{detectUrlMedia(item.content)?.isYoutubeUrl ||
													detectUrlMedia(item.content)?.isFacebookUrl ||
													detectUrlMedia(item.content)?.isTikTokUrl ? (
														<iframe
															title={'vuivui video'}
															src={
																`${detectUrlMedia(item.content).url}${
																	detectUrlMedia(item.content)?.isYoutubeUrl
																		? '?autoplay=1&autohide=1&modestbranding=1&showinfo=0&loop=1&rel=0'
																		: ''
																}` || EmptyImage
															}
															allow='autoplay'
															frameBorder='0'
															className='h-full w-full'
														></iframe>
													) : (
														<video
															className='h-full aspect-square w-full object-cover'
															loop
															muted
															autoPlay
														>
															<source src={detectUrlMedia(item.content).url} />
														</video>
													)}
												</>
											) : (
												<div className='relative h-full w-auto '>
													<ImageCustom
														src={item.content}
														alt='image product vuivui'
														layout='responsive'
														width={'100%'}
														height={'100%'}
														className={'object-cover mx-auto'}
													/>
												</div>
											)}
										</div>
									) : (
										<ProductSpecsFastPreview
											imgBackground={item.content}
											key={index}
											onClick={() =>
												onClick((prev) => ({
													...prev,
													defaultActiveImage: 1,
													isActive: true,
												}))
											}
											ref={RefElementScroll}
											dataProperties={dataProperties}
										/>
									);
								})}

								{/* description */}
								<div
									className='mb-2 border-y-4 border-[#E0E0E0] px-2.5 py-4'
									id={String(mergeData.length + 1)}
									ref={RefElementScroll}
								>
									<div className='mb-4 text-[#999999]'>Chi tiết sản phẩm</div>
									<div dangerouslySetInnerHTML={{ __html: dataSpecs }} className='text-14 '></div>
								</div>
								<div
									className='px-2.5 py-4'
									id={String(mergeData.length + 2)}
									ref={RefElementScroll}
								>
									<div className='pb-[14px] text-[#999999]'>
										Bạn có hài lòng với chất lượng bộ hình vừa xem?
									</div>
									<div className='flex items-center'>
										<div className='mr-10 flex items-center'>
											<div className='relative h-[20px] w-[20px]'>
												<ImageCustom
													src='/static/svg/icon-like-outline.svg'
													layout='fill'
													alt='icon like outline'
												/>
											</div>
											<span>(5)</span>
										</div>
										<div className='flex items-center'>
											<div className='relative h-[20px] w-[20px]'>
												<ImageCustom
													src='/static/svg/icon-unlike-outline.svg'
													layout='fill'
													alt='icon unlike outline'
												/>
											</div>
											<span>(5)</span>
										</div>
									</div>
								</div>
							</div>
						)}
					</>
				)}
			</div>
		</React.Fragment>
	);
};

export default ModalProductDetailMobile;
