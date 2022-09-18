import { Notification } from 'components';
import { VerifyType } from 'enums';
import { useAppDispatch } from 'hooks';
import Cookies from 'js-cookie';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { confirmOTPAction, getInfoCustomer } from 'services';
import { Icon, IconEnum } from 'vuivui-icons';

import { ACCESS_TOKEN, CART_ID, WEB_TOKEN } from '@/constants/index';
import { authActions } from '@/store/reducers/authSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

const ConfirmMerge = dynamic(() => import('../confirm-merge'), {
	loading: () => <>Loading...</>,
	ssr: false,
}) as React.FC<any>;

const ErrorLogin = dynamic(() => import('../error-login'), {
	loading: () => <>Loading...</>,
	ssr: false,
}) as React.FC<any>;

const ConfirmOTP = dynamic(() => import('../verify-otp'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const VerifyPhone = dynamic(() => import('../verify-phone'), {
	loading: () => <>Loading...</>,
	ssr: false,
}) as React.FC<any>;

export enum Step {
	phoneForm = 'PHONE_FORM',
	confirmOTP = 'CONFIRM_OTP',
	confirmMerge = 'CONFIRM_MERGE',
	errorLogin = 'ERROR_LOGIN',
}

interface IModalEditProfile {
	setVerifyOTP: (data: any) => void;
	verifyOTP: {
		phoneNumber: string;
		type: string;
		verifyId: number;
	};
	handleVerifySuccess: (value: any) => void;
	onClose: () => void;
}

const ModalEditProfile: React.FC<IModalEditProfile> = ({
	verifyOTP,
	handleVerifySuccess,
	onClose,
	setVerifyOTP,
}) => {
	const [step, setStep] = useState<Step>(Step.phoneForm);
	const [otpValues, setOTPValues] = useState(Array<string>(6).fill(''));

	const dispatch = useAppDispatch();

	const handleSendOTPSuccess = (value: any) => {
		setVerifyOTP({
			...verifyOTP,
			phoneNumber: value.phoneNumber,
			verifyId: value.verifyId,
		});
		setStep(Step.confirmOTP);
	};

	const handleConfirmMerge = async () => {
		const otpValue = otpValues.join('');
		Notification.Loading.custom();

		try {
			const confirmOTPReponse = await confirmOTPAction({
				email_or_phone_number: verifyOTP.phoneNumber,
				type: VerifyType.CONFIRM_PHONE,
				verification_token: otpValue,
				verify_id: verifyOTP.verifyId,
			});

			if (!confirmOTPReponse.isError && confirmOTPReponse.data) {
				const { access_token, web_token, expires_in } = confirmOTPReponse.data?.loginData;
				const newCartId = confirmOTPReponse?.data?.newCartId;
				if (access_token && web_token) {
					Cookies.set(ACCESS_TOKEN, access_token, {
						domain:
							process.env.NODE_ENV === 'production'
								? process.env.NEXT_PUBLIC_ENDPOINT_NAME
								: undefined,
						httpOnly: false,
						sameSite: 'lax',
						expires: expires_in ? Math.floor(expires_in / 86400) : undefined,
					});
					Cookies.set(WEB_TOKEN, web_token, {
						domain:
							process.env.NODE_ENV === 'production'
								? process.env.NEXT_PUBLIC_ENDPOINT_NAME
								: undefined,
						httpOnly: false,
						sameSite: 'lax',
						expires: expires_in ? Math.floor(expires_in / 86400) : undefined,
					});
					Cookies.set(CART_ID, newCartId, {
						domain:
							process.env.NODE_ENV === 'production'
								? process.env.NEXT_PUBLIC_ENDPOINT_NAME
								: undefined,
						httpOnly: false,
						sameSite: 'lax',
						expires: expires_in ? Math.floor(expires_in / 86400) : undefined,
					});
				}

				const responseData = await getInfoCustomer();
				if (!responseData.isError && responseData.data) {
					dispatch(authActions.updateSelfInfoRequest(responseData.data));
				}
				Notification.Info.default('Đăng nhập thành công', 'SUCCESS', 3000);

				onClose();
				setOTPValues(Array<string>(6).fill(''));
				Notification.Loading.remove(1000);
			} else {
				getErrorMessageInstance('Xin vui lòng thử lại');
				Notification.Loading.remove(1000);
			}
		} catch (error) {
			getErrorMessageInstance('Xin vui lòng thử lại');
			Notification.Loading.remove(1000);
		}
	};

	const renderStep = () => {
		switch (step) {
			case Step.phoneForm:
				return (
					<VerifyPhone
						handleSendOTPSuccess={handleSendOTPSuccess}
						contextInfoProps={{ type: verifyOTP.type }}
					/>
				);
			case Step.confirmOTP:
				return (
					<ConfirmOTP
						verifyOTP={verifyOTP}
						handleVerifySuccess={handleVerifySuccess}
						onClose={onClose}
						otpValues={otpValues}
						setOTPValues={setOTPValues}
						onConfirm={() => setStep(Step.confirmMerge)}
						onShowError={() => setStep(Step.errorLogin)}
						onOTPAgain={(value) => setVerifyOTP({ ...verifyOTP, verifyId: value })}
					/>
				);
			case Step.confirmMerge:
				return (
					<ConfirmMerge
						info={{ phone: verifyOTP.phoneNumber }}
						onOK={() => handleConfirmMerge()}
						onClose={onClose}
					/>
				);
			case Step.errorLogin:
				return (
					<ErrorLogin
						info={{ phone: verifyOTP.phoneNumber }}
						onOK={() => {
							setStep(Step.phoneForm);
							setVerifyOTP({
								phoneNumber: '',
								type: 'CHANGE',
								verifyId: 0,
							});
						}}
					/>
				);
			default:
				return <></>;
		}
	};

	return (
		<div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
			{/* eslint-disable-next-line tailwindcss/migration-from-tailwind-2 */}
			<div className='fixed inset-0 bg-gray-500/75 transition-opacity'></div>

			<div className='fixed inset-0 z-10 overflow-y-auto'>
				<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
					<div className='relative w-1/2 overflow-hidden rounded-lg bg-white text-left shadow-xl  transition-all'>
						<div className='relative bg-white px-4 pt-0 pb-4'>
							<button
								className='absolute top-[14px] right-[10px] p-2'
								onClick={(e) => {
									e.preventDefault();
									onClose();
								}}
							>
								<Icon
									name={IconEnum.X}
									styleIcon={{ marginTop: '-10px', marginLeft: '-6px' }}
									size={24}
									color='#999999'
								/>
							</button>
							<div className='mx-auto flex items-center justify-center'>
								<div className='mt-9 text-left'>{renderStep()}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalEditProfile;
