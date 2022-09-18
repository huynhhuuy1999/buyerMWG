import { yupResolver } from '@hookform/resolvers/yup';
import { InputField, MessageErrors, Notification } from 'components';
import { REGEX_PHONE_NUMBER } from 'constants/';
import { VerifyType } from 'enums';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { generateOTP } from 'services';
import * as yup from 'yup';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export interface VerifyForm {
	phone: string;
}

interface VerifyPhone {
	contextInfoProps: {
		type: string;
	};
	handleSendOTPSuccess: (value: any) => void;
}

const defaultValues: VerifyForm = {
	phone: '',
};

const VerifySchema = yup.object().shape({
	phone: yup
		.string()
		.required('Số điện thoại là bắt buộc')
		.matches(REGEX_PHONE_NUMBER, 'Số điện thoại không đúng định dạng'),
});

const VerifyPhoneMobile: React.FC<VerifyPhone> = ({ contextInfoProps, handleSendOTPSuccess }) => {
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
				type:
					contextInfoProps.type === 'CHANGE' ? VerifyType.CHANGE_PHONE : VerifyType.CONFIRM_PHONE,
			});

			if (!generateOTPReponse.isError && generateOTPReponse.data) {
				handleSendOTPSuccess({
					phoneNumber: formData.phone,
					verifyId: generateOTPReponse?.data?.verify_id || 0,
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
			className={`hide-scrollbar flex flex-col overflow-auto`}
			onSubmit={handleSubmit(onSubmit)}
		>
			<div className='px-[24px] pb-6'>
				<p className='font-sfpro_bold text-24 text-333333'>Cập nhật số điện thoại</p>
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
								label='Nhập số điện thoại'
								placeholder='Nhập số điện thoại'
								typeStyleForms={{ labelInsideBorder: true, animation: true }}
								autoComplete='off'
								className='relative mb-[32px]'
								style={{ label: 'text-[#999999]', input: 'p-[16px]' }}
								validationMessage={
									<MessageErrors className='mt-[2px]' name='phone' errors={errors} />
								}
							/>
						)}
					/>
				</div>
			</div>

			<div className='mt-auto mb-[16px] px-[24px] pt-6'>
				<p className='mt-[4px] text-center font-sfpro text-14 text-666666'>
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
			<hr />

			<div className='w-full px-4'>
				<div className='flex py-[8px]'>
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

export default VerifyPhoneMobile;
