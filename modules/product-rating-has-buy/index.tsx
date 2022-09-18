import { useComment } from 'hooks';
import dynamic from 'next/dynamic';
import { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updateMultiFile } from 'services';

import Icon from '@/components/Icon';
import ImageCustom from '@/components/ImageCustom';
import Rating from '@/components/Rating';

import MediaUpload from '../comment-box/comment-media-upload';
const DynamicSpin = dynamic(() => import('@/components/spinning'), { ssr: false });

interface IProps {
	productDetails: any;
}
const ProductRatingHasBuy: React.FC<IProps> = ({ productDetails }) => {
	const { postRatingProduct } = useComment();
	const [isShow, setIsShow] = useState<boolean>(false);
	const [progress, setProgress] = useState<number>(0);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [listMedia, setListMedia] = useState<any>([]);
	const [error, setError] = useState<string>('');
	const [value, setValue] = useState(0);

	const {
		control,
		handleSubmit,
		formState: {},
	} = useForm<any>({ mode: 'onSubmit' });

	const handleGetIndexStar = (index: number) => {
		setValue(index + 1);
		setIsShow(true);
	};
	const handleSendRating = () => {
		setValue(0);
	};
	const handleUpdateFile = (e: any) => {
		const serviceName = 'rating';
		const file = e.target.files;
		const arrayFile = Object.keys(file);

		if (arrayFile.length > 5) {
			setError('Số file vượt quá giới hạn (nhỏ hơn 6)!');
			return;
		}
		for (let i = 0; i < arrayFile.length; i++) {
			const fileSize = file?.[i].size / 1024 / 1024 < 5;
			const fileType =
				file?.[i].type === 'image/jpeg' ||
				file?.[i].type === 'image/jpg' ||
				file?.[i].type === 'image/png';
			if (!fileSize) {
				setError('Kích cỡ file quá lớn!');
				return;
			}
			if (!fileType) {
				setError('File không đúng định dạng!');
				return;
			}
		}

		let form_data: FormData = new FormData();
		for (let key in file) {
			form_data.append('files', file[key]);
		}
		setIsLoading(true);
		updateMultiFile(serviceName, form_data, (event: any) =>
			setProgress(Math.round(100 * event.loaded) / event.total),
		)
			.then((resp: any) => {
				if (Array.isArray(resp.data) && !resp.isError) {
					setListMedia(resp.data);
					setIsLoading(false);
					setError('');
				}
			})
			.catch((err: any) => {
				setIsLoading(true);
			});
	};

	const handleDeleteMedia = (path: any) => {
		const media = listMedia.filter((item: any) => item.url !== path);
		setListMedia(media);
	};

	const onSubmitForm = (data: any) => {
		let dataMedia: any = [];
		if (listMedia.length) {
			dataMedia = listMedia.map((item: any) => {
				const newItem = {
					name: item.fileName,
					description: item.fileName,
					filePath: item.url,
					mediaType: 0,
				};
				return newItem;
			});
		}
		if (data) {
			const newData = {
				waitingListId: '',
				productId: productDetails.id,
				ratingStar: value,
				comment: {
					parentCommentId: '',
					ratingId: '',
					content: data.content,
					media: dataMedia,
					targetUserId: '',
					productId: productDetails.id,
					isQuestion: false,
				},
			};
			postRatingProduct(newData).then((resp: any) => console.log(resp));
		}
	};

	return (
		<Fragment>
			<div className='relative flex flex-col items-center pt-[26px] pb-[32px]'>
				<div className='absolute right-[10px]'>
					<Icon type='icon-close' variant='dark' />
				</div>

				<div className='mt-[20px] font-sfpro_semiBold text-[16px] font-semibold normal-case'>
					Đánh giá sản phẩm
				</div>
				<span className='text-[##999999] mb-[20px] mt-[2px] block text-[12px]'>
					Hãy cho người khác biết suy nghĩ của bạn
				</span>
				<div className='flex'>
					<Rating
						typeRating='multiple'
						className='mx-[12px] h-[32px] w-[32px]'
						value={value}
						isEmpty={true}
						onGetIndexStar={handleGetIndexStar}
					/>
				</div>

				<span
					onClick={() => setIsShow(true)}
					role='button'
					tabIndex={0}
					onKeyPress={handleSendRating}
					className='mr-[14px] mt-[18px] font-sfpro_semiBold text-[16px] text-[#126BFB]'
				>
					Viết đánh giá
				</span>
			</div>
			{isShow && (
				<form onSubmit={handleSubmit(onSubmitForm)} className='z-1 relative w-full px-[16px]'>
					<Controller
						control={control}
						name='content'
						render={({ field: { onChange } }) => (
							<input
								type='text'
								onChange={onChange}
								placeholder='Chia sẻ trải nghiệm của bạn'
								className='w-[100%] border-b border-[#E0E0E0] px-[8px] py-[7px] placeholder-[14px]'
							/>
						)}
					/>

					<div className='relative flex items-center justify-start'>
						<div className='my-[16px]'>
							<label
								className={`relative mr-3 flex h-[80px] w-[80px] flex-col rounded border border-dashed border-[#F05A94] hover:border-[#126BFB] hover:bg-gray-100  ${
									progress > 99 || progress < 1 ? 'bg-[#ffffff]' : 'bg-[#F05A94]'
								}`}
							>
								<div className='flex flex-col items-center justify-center pt-7'>
									<ImageCustom
										width={24}
										height={24}
										priority
										className='w-auto'
										src={'/static/svg/vector-ad.svg'}
									/>
								</div>

								<input
									type='file'
									name='image'
									onChange={(e) => handleUpdateFile(e)}
									className='opacity-0'
									multiple
								/>
							</label>
							{error && <span className='text-[red]'>{error}</span>}
						</div>
						{isLoading && (
							<div className='absolute top-[50%] '>
								<DynamicSpin isColor='#F05A94' />
							</div>
						)}

						<div className='flex items-center justify-start'>
							{listMedia.length ? (
								listMedia.map((itemMedia: any, indexMedia: number) => {
									if (indexMedia + 1 < 4) {
										return (
											<MediaUpload
												item={itemMedia}
												handleDeleteMedia={handleDeleteMedia}
												key={indexMedia}
											/>
										);
									}
								})
							) : (
								<span className='font-sfpro_semiBold text-sm text-[#333333]'>
									Chọn/Chụp hình ảnh tải lên
								</span>
							)}
							{listMedia && listMedia?.length - 4 > 0 ? (
								<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
									<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
									<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
										+{(listMedia || []).length - 4}
									</span>
								</label>
							) : null}
						</div>
					</div>

					<div className='my-[20px] flex items-center justify-center rounded-b bg-white  pt-[12px]'>
						<button
							className='mr-1 mb-1 w-[102px] rounded-[3px] border border-solid  bg-[#DADDE1] px-6 py-2  text-base font-bold text-[#333333] transition-all duration-150 ease-linear'
							type='button'
						>
							Hủy bỏ
						</button>
						<button
							className='mr-1  mb-1 w-[102px] rounded-[3px] border border-solid border-[#F05A94] bg-[#F05A94]  px-6 py-2 text-base font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-[#F05A94]'
							type='submit'
						>
							Gửi
						</button>
					</div>
				</form>
			)}
		</Fragment>
	);
};
export default ProductRatingHasBuy;
