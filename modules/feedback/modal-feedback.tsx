import { yupResolver } from '@hookform/resolvers/yup';
import { ImageCustom, ModalProductDetail, Notification } from 'components';
import { useComment } from 'hooks';
import dynamic from 'next/dynamic';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { updateMultiFile } from 'services';
import * as yup from 'yup';

import ShowMedia from './show-media';

const DynamicSpin = dynamic(() => import('@/components/spinning'), { ssr: false });

const ContentSchema = yup.object().shape({
	content: yup.string().required('Nội dung không được để trống').trim(),
});
interface Iprops {
	isOpen: boolean;
	onShowModal: (isOpen: boolean) => void;
}
const maxLength = 250;
const ModalFeedback: React.FC<Iprops> = ({ isOpen, onShowModal }) => {
	const { postReportError } = useComment();

	const refModal = useRef<HTMLDivElement>(null);
	const [listMedia, setListMedia] = useState<any>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [lengthContent, setLengthContent] = useState<number>(0);
	const [error, setError] = useState<string>('');
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

	const {
		control,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<any>({ mode: 'onSubmit', resolver: yupResolver(ContentSchema) });

	const handleUpdateFile = (e: any) => {
		const serviceName = 'rating';
		const file = e.target.files;
		const arrayFile = Object.keys(file);

		if (arrayFile.length > 4) {
			Notification.Info.default(`Số file vượt quá giới hạn (tối đa 5)!`, 'ERROR', 2000);
			return;
		}
		for (let i = 0; i < arrayFile.length; i++) {
			const fileSizeImage = file?.[i].size / 1024 / 1024 < 5;
			const fileSizeVideo = file?.[i].size / 1024 / 1024 < 30;

			const fileTypeImage =
				file?.[i].type === 'image/jpeg' ||
				file?.[i].type === 'image/jpg' ||
				file?.[i].type === 'image/png';

			const fileTypeVideo = file?.[i].type === 'video/mp4';
			if (!fileTypeVideo && !fileTypeImage) {
				Notification.Info.default(
					`File không đúng định dạng(.jpg, .png, .jepg, .mp4)!`,
					'ERROR',
					2000,
				);
				return;
			}

			if (fileTypeVideo && !fileSizeVideo) {
				Notification.Info.default(
					`File không được vượt quá dung lượng 3MB đối với hình ảnh và 30MB đối với video!`,
					'ERROR',
					2000,
				);
				return;
			}
			if (fileTypeImage && !fileSizeImage) {
				Notification.Info.default(
					`File không được vượt quá dung lượng 3MB đối với hình ảnh và 30MB đối với video!`,
					'ERROR',
					2000,
				);
				return;
			}
		}

		let form_data: FormData = new FormData();
		for (let key in file) {
			form_data.append('files', file[key]);
		}
		setIsLoading(true);

		updateMultiFile(serviceName, form_data, (event: any) => {})
			.then((resp: any) => {
				if (Array.isArray(resp.data) && !resp.isError) {
					const newData = resp.data.map((item: any) => {
						const typeFile = item.fileName.split('.');
						return { ...item, type: typeFile[1] };
					});

					setListMedia([...listMedia, ...newData]);
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

	const handleCancel = () => {
		onShowModal(false);
		setValue('content', '');
		setListMedia([]);
		setLengthContent(0);
	};
	const handleChangeValue = (e: any) => {
		setLengthContent(e.target.value.length);
	};

	const onSubmitForm = async (data: any) => {
		let dataMedia: any = [];
		if (listMedia.length) {
			listMedia.map((item: any) => {
				dataMedia.push(item.url);
			});
		}
		if (data) {
			const newData = {
				content: data.content,
				files: dataMedia || [],
			};
			try {
				const dataResp = await postReportError(newData);
				if (dataResp.payload && !dataResp.payload.isError) {
					onShowModal(false);
					Notification.Info.default(`Gửi thông tin thành công!`, 'SUCCESS', 4000);
				} else {
					Notification.Info.default(`Gửi thông tin thất bại!`, 'ERROR', 4000);
				}
			} catch (error) {
				Notification.Info.default(`Gửi thông tin thất bại!`, 'ERROR', 4000);
			}

			setValue('content', '');
			setListMedia([]);
			setLengthContent(0);
		}
	};
	const handleShowMedia = (index: number) => {
		listMedia.map((itemMedia: any) => {
			if (itemMedia.type === 'mp4') {
				newListVideo.push({ content: itemMedia.url, type: 1, order: 1 });
			} else {
				newListImage.push({ content: itemMedia.url, type: 1, order: 1 });
			}
		});
		setMediaModal({ listImages: newListImage, listVideos: newListVideo });

		setIsOpenModal({
			defaultActiveImage: index + 1,
			isActive: true,
		});
	};

	return (
		<div
			className={`custom_scrollbar_none focus:outline-none fixed inset-0 z-[51] flex items-center justify-center outline-none overflow-x-hidden ${
				isOpen ? 'bg-[rgba(0,0,0,0.7)]' : ''
			}`}
		>
			<div className={`relative z-10 my-6 mx-auto h-full  w-[100%] min-w-[640px] max-w-3xl`}>
				<div className='relative top-[20%] flex w-full flex-col border-0 outline-none focus:outline-none !opacity-100'>
					<div
						ref={refModal}
						className='z-1 relative top-[-5px] flex-auto rounded-[6px] bg-white p-6'
					>
						<div className='relative flex flex-col items-center  pb-[32px]'>
							<div className='mt-[20px] font-sfpro_semiBold text-[25px] font-semibold normal-case'>
								Gửi thông tin lỗi
							</div>
						</div>

						<form onSubmit={handleSubmit(onSubmitForm)} className='z-1 relative w-full px-[16px]'>
							<Controller
								control={control}
								name='content'
								render={({ field: { value, onChange } }) => (
									<textarea
										rows={7}
										cols={50}
										value={value}
										maxLength={maxLength}
										onChange={(e) => {
											onChange(e);
											handleChangeValue(e);
										}}
										placeholder='Nhập thông tin lỗi...'
										className='w-[100%] border border-[#00000073] px-[8px] py-[7px] placeholder-[12px]'
									/>
								)}
							/>
							<span className='absolute right-[15px] top-[-25px] text-[14px] text-[#00000073]'>
								{lengthContent} / {maxLength} kí tự
							</span>
							<span className='block text-[14px] text-[red]'>
								{errors && errors.content?.message}
							</span>
							<div className='relative flex items-center justify-start'>
								<div className='my-[16px]'>
									<label
										className={`relative mr-3 flex h-[80px] w-[80px] flex-col rounded border border-dashed border-[#F05A94] hover:border-[#126BFB] hover:bg-gray-100  ${
											isLoading ? 'pointer-events-none' : 'pointer-events-auto'
										}`}
									>
										<div
											className={`flex flex-col items-center justify-center pt-7 ${
												isLoading ? 'hidden' : 'block'
											}`}
										>
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
											disabled={isLoading}
											onChange={(e) => handleUpdateFile(e)}
											className='opacity-0'
											multiple
										/>
										{isLoading && (
											<div className='absolute top-[33%] right-[34%]'>
												<DynamicSpin isColor='#F05A94' />
											</div>
										)}
									</label>

									{error && <span className='text-[14px] text-[red]'>{error}</span>}
								</div>

								<div className='flex items-center justify-start'>
									{listMedia.length ? (
										listMedia.map((itemMedia: any, indexMedia: number) => {
											if (indexMedia + 1 < 5) {
												return (
													<ShowMedia
														item={itemMedia}
														handleDeleteMedia={handleDeleteMedia}
														key={indexMedia}
														index={indexMedia}
														handleShowMedia={handleShowMedia}
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

							<div className='flex items-center justify-end rounded-b bg-white  pt-[12px]'>
								<button
									onClick={() => handleCancel()}
									style={{ width: '80px', textAlign: 'center' }}
									className='mr-1  mb-1 w-[102px] rounded-[3px] border border-solid border-[#F05A94] bg-[#ffffff]  px-6 py-2 text-base font-bold text-[#F05A94] shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-[#F05A94]'
								>
									Hủy
								</button>
								<button
									disabled={lengthContent > 0 ? false : true}
									className={`mr-1  mb-1 w-[102px] rounded-[3px] bg-[#F05A94]  px-6 py-2 text-base font-bold text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-lg focus:outline-none active:bg-[#F05A94] ${
										lengthContent === 0
											? 'pointer-events-none border border-[#F05A94]/50 bg-[#F05A94]/70'
											: 'border-[#F05A94] bg-[#F05A94]'
									}`}
									type='submit'
								>
									Gửi
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
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
	);
};
export default ModalFeedback;
