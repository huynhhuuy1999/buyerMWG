import { yupResolver } from '@hookform/resolvers/yup';
import { InputField, MessageErrors, Notification, RadioField } from 'components';
import { REGEX_PHONE_NUMBER, REGEX_SPECIAL_CHARACTER } from 'constants/';
import { VerifyType } from 'enums';
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { generateOTP } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';
import * as yup from 'yup';

import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

export interface VerifyForm {
	phone: string;
	fullName: string;
	gender: string;
}

interface VerifyPhone {
	contextInfoProps: {
		type: string;
	};
	handleSendOTPSuccess: (value: any) => void;
	onClose: () => void;
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

const VerifyInfo: React.FC<VerifyPhone> = ({ contextInfoProps, handleSendOTPSuccess, onClose }) => {
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
			className={`hide-scrollbar relative flex flex-col overflow-auto`}
			onSubmit={handleSubmit(onSubmit)}
		>
			<Icon
				name={IconEnum.X}
				size={22}
				className={'absolute right-6 top-0 cursor-pointer'}
				onClick={onClose}
			/>
			<div className='px-[24px] pb-6'>
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

					<Controller
						control={control}
						name='fullName'
						render={({ field }) => (
							<InputField
								{...field}
								id='fullName'
								type='text'
								label='Họ và tên'
								placeholder='Nhập họ và tên'
								typeStyleForms={{ labelInsideBorder: true, animation: true }}
								className='relative'
								style={{ label: 'text-[#999999]', input: 'p-[16px]' }}
								validationMessage={
									<MessageErrors className='mt-[2px]' name='fullName' errors={errors} />
								}
							/>
						)}
					/>

					<div className='relative mb-12 mt-10 flex max-w-2/10 flex-2/10 justify-between'>
						<Controller
							render={({ field }) => (
								<RadioField
									{...field}
									checked={field.value === '1'}
									id='male_02'
									label='Nam'
									value={1}
									onChange={field.onChange}
								/>
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

export default VerifyInfo;
