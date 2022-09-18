import { yupResolver } from '@hookform/resolvers/yup';
import classNames from 'classnames';
import { ImageCustom, InputField, MessageErrors, Notification, RadioField } from 'components';
import { EmptyImage, REGEX_EMAIL, REGEX_PHONE_NUMBER } from 'constants/';
import { useAppDispatch, useAppSelector, useIsomorphicLayoutEffect } from 'hooks';
import { debounce } from 'lodash';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { ChangeEvent, Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { updateInfoCustomer, uploadAvatarCustomer } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';
import * as yup from 'yup';

import DatePicker from '@/components/DatePickerMobile';
import { authActions, currentUserSelector } from '@/store/reducers/authSlice';

import Drawer from './components/Drawer';
import ModalPreviewAvatar from './components/ModalPreviewAvatar';

const DynamicVerifyPhoneMobile = dynamic(() => import('./verify-phone.mobile'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicVerifyOTPMobile = dynamic(() => import('./verify-otp.mobile'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

export type IFormInputs = {
	fullName?: string;
	phone?: string;
	email?: string;
	dateOfBirth?: string;
	gender?: string | number;
	avatarImage?: {
		description?: string;
		filePath?: string;
		fullPath?: string;
		fileExtension?: string;
	};
};

const InfoSchema = yup.object().shape({
	phone: yup
		.string()
		.matches(REGEX_PHONE_NUMBER, 'Số điện thoại không đúng định dạng')
		.nullable(true),
	fullName: yup
		.string()
		.trim('Họ và tên không được bắt đầu và kết thúc bằng khoảng trắng')
		.strict(true)
		.required('Họ và tên bắt buộc')
		.min(3, 'Họ và tên tối thiểu 3 kí tự')
		.max(50, 'Họ và tên tối đa 50 kí tự')
		.nullable(true),
	gender: yup.string().nullable(true),
	dateOfBirth: yup
		.string()
		.nullable(true)
		.test('valid-date', 'Ngày sinh phải là ngày trong quá khứ', (value) => {
			const todayDate = moment(moment(), 'DD-MM-YYYY');
			const checkDate = moment(value, 'DD-MM-YYYY');
			if (todayDate.isBefore(checkDate)) {
				return false;
			}
			return true;
		})
		.test(
			'valid-date-1',
			'Ngày sinh không hợp lệ. Ngày sinh phải theo đúng format dd/mm/yyyy',
			(value) => {
				if (!value) return true;
				if (!moment(value, 'DD/MM/YYYY', true).isValid()) {
					return false;
				}
				return true;
			},
		),
	email: yup
		.string()
		// .matches(REGEX_EMAIL, 'Email không đúng định dạng')
		.nullable(true)
		.test('valid-email', 'Email không đúng định dạng', (value) => {
			if (!value) return true;
			if (!REGEX_EMAIL.test(value)) {
				return false;
			}
			return true;
		}),
	avatarImage: yup.object().shape({
		name: yup.string().nullable(true),
		description: yup.string().nullable(true),
		filePath: yup.string().nullable(true),
		fullPath: yup.string().nullable(true),
		fileExtension: yup.string().nullable(true),
	}),
});

const defaultValue: IFormInputs = {
	fullName: '',
	phone: '',
	email: '',
	dateOfBirth: '',
	gender: '',
	avatarImage: {
		description: '',
		filePath: '',
		fullPath: '',
		fileExtension: '',
	},
};

const EditMobilePage = () => {
	const currentUser = useAppSelector(currentUserSelector);
	const [clientHeight, setClientHeight] = useState<number>(0);
	const [isDropdownAvatar, setIsDropdownAvatar] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const [isShowVerifyInfo, setIsShowVerifyInfo] = useState<boolean>(false);
	const [isShowVerifyOTP, setIsShowVerifyOTP] = useState<any>({
		phoneNumber: '',
		isActive: false,
		type: '',
		verifyId: 0,
	});
	const [isSaving, setIsSaving] = useState<boolean | undefined>(undefined);
	const [showAvatar, setShowAvatar] = useState(false);
	const [isOpen, setIsOpen] = useState(false);

	const dispatch = useAppDispatch();

	useIsomorphicLayoutEffect(() => {
		function handleResize() {
			setClientHeight(
				Math.max(document?.documentElement?.clientHeight || 0, window.innerHeight || 0),
			);
		}

		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

	const {
		control,
		handleSubmit,
		setValue,
		reset,
		formState: { errors, isDirty },
	} = useForm<IFormInputs>({
		mode: 'onChange',
		resolver: yupResolver(InfoSchema),
		defaultValues: defaultValue,
	});

	useEffect(() => {
		reset({
			fullName: currentUser?.fullName,
			phone: currentUser?.mobilePhone,
			email: currentUser?.email,
			dateOfBirth: currentUser?.birthDay ? moment(currentUser?.birthDay).format('DD/MM/YYYY') : '',
			gender: `${currentUser?.gender}`,
			avatarImage: currentUser?.avatarImage,
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [currentUser?.mobilePhone]);

	useEffect(() => {
		if (isDropdownAvatar) {
			const handleClickOutside = (event: any) => {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsDropdownAvatar(false);
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [ref, isDropdownAvatar]);

	const onSubmit = async (formData: IFormInputs) => {
		try {
			setIsSaving(true);
			const response = await updateInfoCustomer({
				fullName: formData?.fullName,
				gender: formData?.gender ? +formData?.gender : 0,
				email: formData?.email,
				mobilePhone: formData?.phone,
				avatarImage: formData?.avatarImage,
				birthDay: formData?.dateOfBirth,
			});

			if (!response.isError && response.data) {
				dispatch(authActions.updateSelfInfoRequest(response.data));

				await delay(800);
				setIsSaving(false);
			}
		} catch (error) {
			await delay(800);
			setIsSaving(false);
		}
	};

	const watchedData = useWatch({
		control: control,
		// name: 'phone',
		defaultValue: defaultValue,
	});

	// eslint-disable-next-line react-hooks/exhaustive-deps
	const debouncedSave = useCallback(
		debounce(() => {
			handleSubmit(onSubmit)();
		}, 1000),
		[],
	);

	useEffect(() => {
		if (isDirty) {
			debouncedSave();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [watchedData, isDirty]);

	const handleUploadAvatar = (event: ChangeEvent<HTMLInputElement>) => {
		const fileList = event.target.files;

		if (!fileList) return;

		const { type, size } = fileList[0];
		const fileType = type === 'image/jpeg' || type === 'image/jpg' || type === 'image/png';
		const fileSize = size / 1024 / 1024 < 5;

		if (!fileType) {
			Notification.Info.default('File không đúng định dạng', 'ERROR', 3000);
			return;
		}

		if (!fileSize) {
			Notification.Info.default('Hình ảnh tối đa 5MB', 'ERROR', 3000);
			return;
		}

		const formData: FormData = new FormData();
		formData.append('file', fileList[0]);

		uploadAvatarCustomer(formData)
			.then((resp: any) => {
				if (resp.data && !resp.isError) {
					const { description, filePath, fullPath, fileExtension } = resp.data;
					setValue(
						'avatarImage',
						{ description, filePath, fullPath, fileExtension },
						{ shouldDirty: true },
					);
				} else {
					Notification.Info.default('Upload thất bại!', 'ERROR', 3000);
				}
			})
			.catch((err: any) => {
				Notification.Info.default('Upload thất bại!', 'ERROR', 3000);
			});
	};

	const handleVerifySuccess = (data: any) => {
		setValue('phone', data.phone, { shouldDirty: true });
	};

	const handleRemoveAvatar = () => {
		setIsDropdownAvatar(false);
		setValue(
			'avatarImage',
			{
				description: '',
				fileExtension: 'image/png',
				filePath: '/merchant/2022/5/31/cbbb99cd-4a7a-478f-b5e7-f9c5d90c2cca/avatar_default.png',
				fullPath:
					'https://testcdn.vuivui.com/merchant/2022/5/31/cbbb99cd-4a7a-478f-b5e7-f9c5d90c2cca/avatar_default.png',
			},
			{ shouldDirty: true },
		);
	};

	const handleToggle = (value: boolean) => {
		setIsOpen(value);
	};

	const handleThemeToggle = () => {
		setIsOpen(true);
	};

	const handleSelect = (nextTime: any) => {
		setValue('dateOfBirth', moment(nextTime).format('DD/MM/YYYY'), { shouldDirty: true });
		setIsOpen(false);
	};

	return (
		<Fragment>
			<Link href='/ca-nhan/don-hang/cho-xac-nhan' replace>
				<div className='flex items-center bg-white px-3 py-4 ' tabIndex={0} role='button'>
					<div className='relative mr-15px h-5 w-5'>
						<ImageCustom
							className='cursor-pointer '
							src='/static/svg/arrow-left.svg'
							alt='search'
							layout='fill'
						/>
					</div>

					<div className='font-sfpro text-base font-semibold'>Cập nhật thông tin</div>
				</div>
			</Link>

			<form
				onSubmit={(e) => {
					e.preventDefault();
				}}
			>
				<div
					className={`flex flex-col bg-[#F6F6F6] pt-[80px]`}
					style={{ height: `calc(${clientHeight}px - 56px)`, minHeight: '610px' }}
				>
					<div className='relative mx-3 rounded-[8px] bg-white py-6 px-3'>
						<Controller
							render={({ field }) => (
								<Fragment>
									<div
										// eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values
										className='absolute -top-[64px] left-2/4 mx-auto h-[102px] w-[102px] -translate-x-2/4 overflow-hidden rounded-full ring-4 ring-[#F1F1F1]'
									>
										<ImageCustom
											src={field?.value || EmptyImage}
											alt='avatar'
											height={102}
											width={102}
											className='h-full w-full object-cover'
										/>
									</div>

									{field?.value &&
									field?.value !==
										'https://testcdn.vuivui.com/merchant/2022/5/31/cbbb99cd-4a7a-478f-b5e7-f9c5d90c2cca/avatar_default.png' ? (
										<>
											<div
												className='absolute left-[calc(50%+40px)] top-[5px] mx-auto h-[36px] w-[36px] -translate-x-2/4 overflow-hidden rounded-full bg-white ring-4 ring-[#F1F1F1]'
												onClick={() => setIsDropdownAvatar(true)}
												onKeyPress={() => setIsDropdownAvatar(true)}
												tabIndex={0}
												role='button'
											>
												<Icon
													name={IconEnum.Camera}
													size={24}
													className='mt-[6px] ml-[6px]'
													color='#999999'
												/>
											</div>

											<div
												className={classNames([
													'absolute top-[42px] left-[calc(50%-64px)] z-[21] mt-2 w-[200px] origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none',
													isDropdownAvatar
														? 'transition-transform duration-150 origin-top '
														: 'scale-y-0 origin-top',
												])}
												ref={ref}
											>
												<div className='py-1' role='none'>
													<button
														onClick={() => {
															setShowAvatar(true);
															setIsDropdownAvatar(false);
														}}
														className='block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
													>
														Xem ảnh đại diện
													</button>
													<label
														htmlFor='uploadAvatar'
														className='block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
													>
														Cập nhật ảnh đại diện
													</label>
													<button
														onClick={() => handleRemoveAvatar()}
														className='block w-full cursor-pointer px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100'
													>
														Xoá ảnh đại diện
													</button>
												</div>
											</div>
										</>
									) : (
										<label
											htmlFor='uploadAvatar'
											className='absolute left-[calc(50%+40px)] top-[5px] mx-auto h-[36px] w-[36px] -translate-x-2/4 overflow-hidden rounded-full bg-white ring-4 ring-[#F1F1F1]'
										>
											<Icon
												name={IconEnum.Camera}
												size={24}
												className='mt-[6px] ml-[6px]'
												color='#999999'
											/>
										</label>
									)}
								</Fragment>
							)}
							name='avatarImage.fullPath'
							control={control}
						/>
						<input
							type='file'
							className='hidden'
							id='uploadAvatar'
							accept='.jpg, .jpeg, .png'
							onChange={handleUploadAvatar}
							style={{ display: 'none' }}
						/>

						{/* eslint-disable-next-line tailwindcss/enforces-negative-arbitrary-values */}
						<div className='absolute -top-[80px] right-[0] flex justify-end py-2'>
							{isSaving !== undefined ? (
								isSaving ? (
									<div className='flex items-center'>
										<svg
											role='status'
											className='mr-2 inline h-[22px] w-[22px] animate-spin fill-gray-600 text-gray-200 dark:text-gray-600'
											viewBox='0 0 100 101'
											fill='none'
											xmlns='http://www.w3.org/2000/svg'
										>
											<path
												d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
												fill='currentColor'
											/>
											<path
												d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
												fill='currentFill'
											/>
										</svg>
										<span className='text-12'>Đang cập nhật...</span>
									</div>
								) : (
									<div className='flex items-center'>
										<ImageCustom
											priority
											className='w-3'
											width={24}
											height={24}
											src={'/static/svg/saved.svg'}
										/>
										<span className='ml-1 text-12'>Đã cập nhật</span>
									</div>
								)
							) : (
								''
							)}
						</div>

						<div className='flex h-[120px] max-w-4/10 flex-4/10 justify-between pb-12 pt-20'>
							<Controller
								render={({ field }) => (
									<>
										<RadioField
											{...field}
											id='male_1'
											checked={field.value === '1'}
											label='Nam'
											value='1'
											onChange={() => {
												setValue('gender', '1', { shouldDirty: true });
											}}
										/>
										<RadioField
											{...field}
											id='female_2'
											checked={field.value === '2'}
											label='Nữ'
											value='2'
											onChange={() => {
												setValue('gender', '2', { shouldDirty: true });
											}}
										/>
									</>
								)}
								name='gender'
								control={control}
							/>
						</div>

						<Controller
							render={({ field }) => (
								<InputField
									id='fullName'
									type='text'
									placeholder='Nhập họ và tên'
									label='Nhập họ và tên'
									typeStyleForms={{ labelInsideBorder: true, animation: true }}
									autoComplete='off'
									className='relative pb-6'
									validationMessage={<MessageErrors name='fullName' errors={errors} />}
									{...field}
								/>
							)}
							name='fullName'
							control={control}
						/>

						<Controller
							render={({ field }) => (
								<div className='relative pb-6'>
									<button
										className='w-full'
										onClick={() => {
											if (field.value) {
												setIsShowVerifyInfo(true);
												setIsShowVerifyOTP({ ...isShowVerifyOTP, type: 'CHANGE' });
											} else {
												setIsShowVerifyInfo(true);
												setIsShowVerifyOTP({ ...isShowVerifyOTP, type: 'NEW' });
											}
										}}
									>
										<div className='w-full z-10 bg-transparent absolute top-0 left-0 h-[60px]'></div>
										<InputField
											id='phone'
											type='tel'
											placeholder='Nhập số điện thoại'
											label='Nhập số điện thoại'
											typeStyleForms={{ labelInsideBorder: true, animation: true }}
											className='relative'
											autoComplete='off'
											// disabled
											validationMessage={<MessageErrors name='phone' errors={errors} />}
											{...field}
										/>
									</button>

									{field.value ? (
										<button
											className='absolute top-[18px] right-[16px] mb-0 text-[#F05A94]'
											type='button'
											onClick={() => {
												setIsShowVerifyInfo(true);
												setIsShowVerifyOTP({ ...isShowVerifyOTP, type: 'CHANGE' });
											}}
										>
											Thay đổi
										</button>
									) : (
										<button
											className='absolute top-[18px] right-[16px] mb-0 text-[#F05A94]'
											type='button'
											onClick={() => {
												setIsShowVerifyInfo(true);
												setIsShowVerifyOTP({ ...isShowVerifyOTP, type: 'NEW' });
											}}
										>
											Cập nhật
										</button>
									)}
								</div>
							)}
							name='phone'
							control={control}
						/>

						<Controller
							render={({ field }) => (
								<InputField
									id='email'
									type='text'
									placeholder='Nhập email'
									label='Nhập email'
									typeStyleForms={{ labelInsideBorder: true, animation: true }}
									className='relative pb-6'
									autoComplete='off'
									validationMessage={<MessageErrors name='email' errors={errors} />}
									{...field}
								/>
							)}
							name='email'
							defaultValue={''}
							control={control}
						/>

						<Controller
							render={({ field }) => (
								<>
									<button className='w-full' onClick={() => handleThemeToggle()}>
										<InputField
											id='dateOfBirth'
											placeholder='Nhập ngày sinh'
											label='Nhập ngày sinh'
											typeStyleForms={{ labelInsideBorder: true, animation: true }}
											className='relative pb-6'
											autoComplete='off'
											disabled
											style={{ input: 'opacity-100' }}
											validationMessage={<MessageErrors name='dateOfBirth' errors={errors} />}
											{...field}
											value={
												field.value ? moment(field?.value, 'DD/MM/YYYY').format('DD/MM/YYYY') : ''
											}
											suffixIcon={
												<Icon
													name={IconEnum.CalendarBlank}
													styleIcon={{ marginTop: '-4px', marginLeft: '4px' }}
													size={24}
													color='#999999'
												/>
											}
										/>
									</button>

									{isOpen && (
										<DatePicker
											value={
												field?.value
													? new Date(moment(field?.value, 'DD/MM/YYYY').format('YYYY-MM-DD'))
													: new Date()
											}
											max={new Date()}
											isOpen={isOpen}
											showCaption={false}
											customHeader='Chọn ngày sinh'
											dateConfig={[
												{
													type: 'date',
													format: 'D',
													caption: 'Ngày',
													step: 1,
												},
												{
													type: 'month',
													format: 'M',
													caption: 'Tháng',
													step: 1,
												},
												{
													type: 'year',
													format: 'YYYY',
													caption: 'Năm',
													step: 1,
												},
											]}
											onSelect={handleSelect}
											onCancel={() => handleToggle(false)}
											onFinish={() => handleToggle(false)}
										/>
									)}
								</>
							)}
							name='dateOfBirth'
							control={control}
						/>
					</div>

					{/* <div className='mt-auto w-full bg-white py-3 px-4'>
						<button
							className='px-auto max-5/10 w-full flex-1 rounded-[4px] bg-[#F05A94] py-2.5 font-sfpro text-base text-white disabled:bg-[#DADDE1]'
							onClick={handleSubmit(onSubmit)}
							disabled={!isDirty || !isValid}
							type='button'
						>
							Lưu
						</button>
					</div> */}
				</div>
			</form>

			<Drawer
				isOpen={isShowVerifyInfo}
				direction='RIGHT'
				className={'hide-scrollbar z-[20] overflow-auto'}
				height={clientHeight}
				setIsOpen={() => setIsShowVerifyInfo(false)}
			>
				<DynamicVerifyPhoneMobile
					height={clientHeight}
					contextInfoProps={{
						type: isShowVerifyOTP.type,
					}}
					onClose={() => {
						setIsShowVerifyInfo(false);
						setIsShowVerifyOTP({
							phoneNumber: '',
							isActive: false,
							type: '',
							verifyId: 0,
						});
					}}
					onShowOTP={(value) =>
						setIsShowVerifyOTP({
							...isShowVerifyOTP,
							phoneNumber: value.phoneNumber,
							isActive: true,
							verifyId: value.verifyId,
						})
					}
				/>
			</Drawer>

			<Drawer
				isOpen={isShowVerifyOTP.isActive}
				direction='RIGHT'
				className={'hide-scrollbar z-[30] overflow-auto'}
				height={clientHeight}
				setIsOpen={() => setIsShowVerifyOTP({ isActive: false })}
			>
				<DynamicVerifyOTPMobile
					height={clientHeight}
					contextInfoProps={{
						mobileNumber: isShowVerifyOTP.phoneNumber,
						verifyId: isShowVerifyOTP.verifyId,
						type: isShowVerifyOTP.type,
					}}
					onClose={() => {
						setIsShowVerifyInfo(false);
						setIsShowVerifyOTP({ isActive: false, phoneNumber: '', type: '', verifyId: 0 });
					}}
					onVerifySuccess={handleVerifySuccess}
					onBackToPhone={() => {
						setIsShowVerifyInfo(true);
						setIsShowVerifyOTP({ isActive: false, phoneNumber: '', type: 'CHANGE', verifyId: 0 });
					}}
					onOTPAgain={(value) =>
						setIsShowVerifyOTP({
							...isShowVerifyOTP,
							verifyId: value.verifyId,
						})
					}
				/>
			</Drawer>

			{showAvatar && (
				<ModalPreviewAvatar
					isMobile={true}
					image={currentUser?.avatarImage?.fullPath || ''}
					onClose={() => setShowAvatar(false)}
				/>
			)}
		</Fragment>
	);
};

export default EditMobilePage;
