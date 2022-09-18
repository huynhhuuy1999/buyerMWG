import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage } from 'constants/';
import { KEYBOARD_EVENTS } from 'enums';
import { Product } from 'models';
import React, { createRef, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { detectUrlMedia } from 'utils/getYoutubeId';
import { Icon, IconEnum } from 'vuivui-icons';

type ModeModal = 'gallary' | 'slider';

interface IActiveImageProps {
	index: number | '';
	isActive: boolean;
}
interface IOpenModalDetail {
	defaultActiveImage: number | '';
	isActive: boolean;
}
export interface IModalProductDetail {
	onClose: React.MouseEventHandler;
	show: IOpenModalDetail;
	activeMode: ModeModal;
	dataSource: Product['images'];
	videos: Product['videos'];
	isHidden?: boolean;
}

const ModalProductDetail: React.FC<IModalProductDetail> = ({
	onClose,
	show,
	activeMode,
	dataSource,
	videos,
	isHidden,
}) => {
	const [isActiveImage, setIsActiveImage] = useState<IActiveImageProps>({
		index: '',
		isActive: false,
	});
	const [isMount, setIsMount] = useState<boolean>(false);

	const mergeData = useMemo(() => {
		return videos.length !== 0
			? [
					...dataSource,
					...videos.map((item) => {
						return { content: item.content, isVideos: Boolean(videos.length) };
					}),
			  ]
			: dataSource;
	}, [videos, dataSource]);

	const refProduct: React.MutableRefObject<React.RefObject<HTMLDivElement | any>[]> = useRef(
		mergeData && mergeData?.map(() => createRef()),
	);

	useEffect(() => {
		show.isActive && (document.body.style.overflow = 'hidden');
		setIsActiveImage((prev) => ({
			...prev,
			index: show && show.defaultActiveImage,
			isActive: show && show.isActive ? true : false,
		}));
		return () => {
			document.body.style.overflow = 'auto';
		};
	}, [show]);

	const handleActiveImage = useCallback(
		(type: string) => {
			const findIndexElementInArray = mergeData.indexOf(mergeData[isActiveImage.index]);
			let getIndexNext: any =
				isActiveImage.index && isActiveImage.index === mergeData.length // 1
					? 1
					: findIndexElementInArray + 1;

			let getIndexPrevious: any =
				isActiveImage.index === 1
					? mergeData.length
					: findIndexElementInArray !== -1
					? findIndexElementInArray - 1
					: mergeData.length - 1;

			const filterDom = refProduct.current.filter((item: any, _) => {
				const id = type === 'previous' ? getIndexPrevious : getIndexNext;
				return +item.current.dataset.id === id;
			});

			filterDom.length !== 0
				? filterDom[0].current.scrollIntoView({
						block: 'center',
						behavior: 'smooth',
				  })
				: refProduct.current
						.filter((item: any, _) => {
							return +item.current.dataset.id === 1; // reset scroll top window
						})[0]
						.current.scrollIntoView({
							block: 'center',
							behavior: 'smooth',
						});
			setIsActiveImage((prev) => ({
				...prev,
				index: type === 'previous' ? getIndexPrevious : getIndexNext,
			}));
		},
		[isActiveImage, mergeData],
	);

	const escFunction = useCallback(
		(event) => {
			if (event.keyCode === KEYBOARD_EVENTS.escape) {
				onClose(event);
			}
			if (
				event.keyCode === KEYBOARD_EVENTS.rightArrow ||
				event.keyCode === KEYBOARD_EVENTS.downArrow
			) {
				handleActiveImage('next');
			}
			if (
				event.keyCode === KEYBOARD_EVENTS.leftArrow ||
				event.keyCode === KEYBOARD_EVENTS.upArrow
			) {
				handleActiveImage('previous');
			}
		},
		[onClose, handleActiveImage],
	);

	useEffect(() => {
		document.addEventListener('keydown', escFunction);
		return () => {
			document.removeEventListener('keydown', escFunction);
		};
	}, [escFunction]);

	return (
		<React.Fragment>
			<div
				className={classNames([
					'bg-[#F1F1F1] fixed top-0 left-0 right-0 bottom-0 h-full overflow-hidden w-full z-50 animation-300',
					show.isActive ? 'opacity-100 visible' : 'opacity-0 invisible',
				])}
			>
				<button
					className='absolute top-1/2 right-20 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-md'
					onClick={(): void => handleActiveImage('next')}
				>
					<div className='p-18px flex items-center'>
						<Icon name={IconEnum.CaretRight} size={16} color={'#757575'} />
					</div>
				</button>
				<button
					onClick={(): void => handleActiveImage('previous')}
					className='absolute top-1/2 left-40 z-10 -translate-x-1/2 -translate-y-1/2 rounded-full border bg-white shadow-md'
				>
					<div className='p-18px flex items-center'>
						<Icon name={IconEnum.CaretLeft} size={16} color={'#757575'} />
					</div>
				</button>
				<div className='flex justify-between'>
					{/* render with mode modal */}
					{activeMode === 'gallary' && (
						<>
							<div className='relative my-4 ml-4 max-h-[calc(100vh_-_32px)] w-full  max-w-[80px] items-center overflow-y-scroll overflow-x-hidden scrollbar-none'>
								<div className='flex flex-auto flex-col'>
									{mergeData &&
										mergeData.map((item: any, i: number) => {
											return (
												<div
													onClick={(): void =>
														setIsActiveImage((prev) => ({ ...prev, index: i + 1 }))
													}
													onKeyPress={(): void =>
														setIsActiveImage((prev) => ({ ...prev, index: i + 1 }))
													}
													tabIndex={0}
													role={'button'}
													key={i}
													ref={refProduct.current[i] as React.RefObject<HTMLDivElement>}
													data-id={`${i + 1}`}
													className={classNames([
														'w-[80px] h-[80px] mb-3 rounded-[3px] hover:border-[#FB6E2E] border-2 animation-300 cursor-pointer last-of-type:mb-0 object-cover relative',
														isActiveImage.isActive &&
															isActiveImage.index === i + 1 &&
															`border-[#FB6E2E]`,
													])}
												>
													{(videos.length > 0 &&
														detectUrlMedia(mergeData[i].content).isYoutubeUrl) ||
													mergeData[i]?.isVideos ? (
														<>
															<ImageCustom
																src={mergeData[0].content || EmptyImage}
																alt='image product vuivui'
																className='object-contain aspect-square '
															/>
															<div className='absolute top-2/4 left-2/4 -translate-x-2/4 -translate-y-2/4'>
																<div className='relative h-[25px] w-[25px]'>
																	<ImageCustom
																		src='/static/svg/play-icon.svg'
																		alt='play icon vuivui'
																		className='object-contain'
																	/>
																</div>
															</div>
														</>
													) : isHidden ? (
														<iframe
															title='vuivui video'
															src={item.content || EmptyImage}
															frameBorder='0'
															className='h-full w-full'
														/>
													) : (
														<ImageCustom
															src={item.content || EmptyImage}
															alt='image product vuivui'
															className='object-contain w-[76px] h-[76px]'
															height='76px'
														/>
													)}
												</div>
											);
										})}
								</div>
							</div>
							<div
								className={`relative m-4 aspect-square max-h-[calc(100vh_-_32px)] w-full flex-auto flex-col overflow-hidden`}
								onWheel={(e) => {
									if (e.nativeEvent.deltaY > 0 && !isMount) {
										setIsMount(true);
										setIsActiveImage((prev) => ({
											...prev,
											index:
												Number(isActiveImage.index) + 1 > mergeData?.length
													? 1
													: Number(isActiveImage.index) + 1,
										}));
									}

									if (e.nativeEvent.deltaY < 0 && !isMount) {
										setIsMount(true);
										setIsActiveImage((prev) => ({
											...prev,
											index:
												Number(isActiveImage.index) - 1 <= 0
													? mergeData?.length
													: Number(isActiveImage.index) - 1,
										}));
									}

									setTimeout(() => {
										setIsMount(false);
									}, 250);
								}}
							>
								<span
									className='absolute bottom-4 left-[50%] z-50 inline-block -translate-x-[50%] rounded-[3px] px-1.5 py-0.5 text-16 font-normal leading-6 text-white'
									style={{ backgroundColor: 'rgba(0, 0, 0, 0.2)' }}
								>
									{isActiveImage.index}/{mergeData?.length}
								</span>
								{mergeData?.map((item, i: number) => {
									return (
										<div
											className='relative h-full w-full flex justify-center'
											key={i}
											style={{
												transition: '300ms ease all',
												transform: `translateY(-${(Number(isActiveImage.index) - 1) * 100}%)`,
											}}
										>
											{item?.isVideos ? (
												<iframe
													title='vuivui video'
													src={detectUrlMedia(item.content).url || EmptyImage}
													frameBorder='0'
													className='h-full w-full'
												></iframe>
											) : (
												<ImageCustom
													src={item.content || EmptyImage}
													alt='image product vuivui'
													className='object-contain'
													width={980}
													quality={100}
												/>
											)}
										</div>
									);
								})}
							</div>
						</>
					)}

					<div className='absolute top-0 right-0'>
						<div className='mr-4 mt-4 flex items-center'>
							<button
								className={`flex items-center mr-4 w-fit rounded-full bg-[rgba(14,14,16,0.4)] p-3 ${
									isHidden ? 'hidden' : ''
								}`}
							>
								<Icon name={IconEnum.Heart} size={24} color={'white'} />
							</button>
							<button
								className={`flex items-center mr-4 w-fit rounded-full bg-[rgba(14,14,16,0.4)] p-3 ${
									isHidden ? 'hidden' : ''
								}`}
							>
								<Icon name={IconEnum.ShareNetwork} size={24} color={'white'} fill={'white'} />
							</button>
							<button
								className='flex items-center mr-4 w-fit rounded-full bg-[rgba(14,14,16,0.4)] p-3'
								onClick={onClose}
							>
								<Icon name={IconEnum.X} size={24} color={'white'} />
							</button>
						</div>
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default React.memo(ModalProductDetail);
