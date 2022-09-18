import { yupResolver } from '@hookform/resolvers/yup';
import { ImageCustom, InputField, MessageErrors, Notification, RadioField } from 'components';
import { REGEX_PHONE_NUMBER, REGEX_SPECIAL_CHARACTER } from 'constants/';
import { VerifyType } from 'enums';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { generateOTP } from 'services';
import * as yup from 'yup';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export interface VerifyForm {
	phone: string;
	fullName: string;
	gender: string;
}

interface VerifyInfo {
	contextInfoProps: {
		type: string;
	};
	onClose: () => void;
	handleSendOTPSuccess: (value: any) => void;
}

const defaultValues: VerifyForm = {
	phone: '',
	fullName: '',
	gender: '',
};

const VerifySchema = yup.object().shape({
	phone: yup
		.string()
		.required('Số điện thoại là bắt buộc')
		.matches(REGEX_PHONE_NUMBER, 'Số điện thoại không đúng định dạng'),

	fullName: yup
		.string()
		.matches(REGEX_SPECIAL_CHARACTER, 'Vui lòng loại bỏ ký tự đặc biệt')
		.required('Họ và tên là bắt buộc'),
	gender: yup.string().required('Giới tính là bắt buộc'),
});

const VerifyInfoMobile: React.FC<VerifyInfo> = ({
	onClose,
	handleSendOTPSuccess,
	contextInfoProps,
}) => {
	const {
		control,
		handleSubmit,
		reset,
		formState: { isDirty, isValid, errors },
	} = useForm<any>({
		mode: 'all',
		resolver: yupResolver(VerifySchema),
		defaultValues,
	});

	const onSubmit = async (formData: VerifyForm) => {
		Notification.Loading.custom();
		try {
			const generateOTPReponse = await generateOTP({
				email_or_phone_number: formData.phone,
				type: VerifyType.CONFIRM_PHONE,
			});

			if (!generateOTPReponse.isError && generateOTPReponse.data) {
				handleSendOTPSuccess({
					phoneNumber: formData.phone,
					contactName: formData.fullName,
					gender: +formData.gender,
					verifyId: generateOTPReponse.data.verify_id,
				});
				reset(defaultValues);
				Notification.Loading.remove();
			} else {
				Notification.Info.default('Xin vui lòng thử lại', 'ERROR', 3000);
			}
		} catch (error) {
			getErrorMessageInstance(error);
		}
	};

	return (
		<form
			className='hide-scrollbar flex h-[calc(100vh_+_116px)] flex-col overflow-auto'
			onSubmit={handleSubmit(onSubmit)}
		>
			<button
				onClick={onClose}
				className='relative z-[50] flex h-[56px] items-center justify-center bg-[#F05A94]'
			>
				<div className='absolute top-1/2 left-[16px] h-[24px] w-[24px] -translate-y-1/2'>
					<ImageCustom
						height={24}
						width={24}
						alt='close'
						src={'/static/svg/close-icon.svg'}
						objectFit='cover'
					/>
				</div>
				<div className='h-[56px] w-[155px]'>
					<ImageCustom
						height={56}
						width={155}
						alt='logo'
						src={'/static/images/logofull.png'}
						objectFit='cover'
					/>
				</div>
			</button>

			<div className='xs:mt-[32px] sm:mt-[64px] px-[24px]'>
				<p className='font-sfpro_bold text-24 text-333333'>Xác thực danh tính</p>
				<p className='mt-[4px] font-sfpro text-14 text-666666'>
					Nhập số điện thoại để đăng ký hoặc đăng nhập vào VuiVui.com
				</p>

				<div className='mt-[28px]'>
					<Controller
						control={control}
						name='phone'
						render={({ field }) => (
							<InputField
								{...field}
								id='phone'
								type='tel'
								label='Số điện thoại'
								typeStyleForms={{ labelInsideBorder: true, animation: true }}
								className='relative mb-[32px]'
								style={{ label: 'text-[#999999]', input: 'p-[16px]' }}
								validationMessage={
									<MessageErrors className='mt-[2px]' name='phone' errors={errors} />
								}
							/>
						)}
					/>

					<Controller
						control={control}
						name='fullName'
						render={({ field }) => (
							<InputField
								{...field}
								id='fullName'
								type='text'
								label='Họ và tên'
								typeStyleForms={{ labelInsideBorder: true, animation: true }}
								className='relative'
								style={{ label: 'text-[#999999]', input: 'p-[16px]' }}
								validationMessage={
									<MessageErrors className='mt-[2px]' name='fullName' errors={errors} />
								}
							/>
						)}
					/>

					<div className='relative mb-6 mt-10 flex max-w-6/10 flex-6/10 justify-between'>
						<Controller
							render={({ field }) => (
								<>
									<RadioField
										{...field}
										checked={field.value === '1'}
										id='male_02'
										label='Nam'
										value={1}
										onChange={field.onChange}
									/>
								</>
							)}
							name='gender'
							control={control}
						/>
						<Controller
							render={({ field }) => (
								<RadioField
									{...field}
									checked={field.value === '2'}
									id='female_02'
									label='Nữ'
									value={2}
									onChange={field.onChange}
								/>
							)}
							name='gender'
							control={control}
						/>
						{/* {<MessageErrors name='gender' errors={formState.errors} />} */}
					</div>
				</div>
			</div>

			<div className='mb-50 px-[24px]'>
				<p className='xs:mt-[32px] sm:mt-[4px] text-center font-sfpro text-14 text-666666'>
					Bằng cách Tiếp tục, bạn xác nhận rằng bạn đã đọc và đồng ý với{' '}
					<a href='/' className='text-[#126BFB]'>
						Điều Khoản Dịch vụ
					</a>
					<span className='inline-block px-1'>và</span>
					<a href='/' className='text-[#126BFB]'>
						Chính Sách Bảo Mật
					</a>{' '}
					của VuiVui
				</p>
			</div>

			<div className='fixed bottom-0 w-full'>
				<div className='flex border-t border-[#E0E0E0] bg-white px-[24px] py-[8px]'>
					<button
						disabled={!isValid || !isDirty}
						className='px-auto w-full rounded-[6px] bg-[#F05A94] py-2.5 font-sfpro text-base text-white disabled:bg-[#DADDE1]'
						type='submit'
					>
						Tiếp tục
					</button>
				</div>
			</div>
		</form>
	);
};

export default VerifyInfoMobile;
