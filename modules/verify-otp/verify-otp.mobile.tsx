import classNames from 'classnames';
import { ImageCustom, InputOTP, Notification } from 'components';
import { ACCESS_TOKEN, WEB_TOKEN } from 'constants/';
import { VerifyType } from 'enums';
import { useAppDispatch } from 'hooks';
import Cookies from 'js-cookie';
import { TypeActionShippingAddress } from 'models';
import React, { useEffect, useState } from 'react';
import { confirmOTP, generateOTP, updateInfoCustomer } from 'services';

import { authActions } from '@/store/reducers/authSlice';

interface VerifyOTP {
	verifyOTP: {
		phoneNumber: string;
		contactName: string;
		gender: number;
		verifyId: number;
		type: string;
	};
	onClose: () => void;
	otpValues: any;
	setOTPValues: (data: any) => void;
	onConfirm: () => void;
	onShowError: () => void;
	onAction: (val: TypeActionShippingAddress['action']) => void;
	onOTPAgain: (data: any) => void;
}

const VerifyOTPMobile: React.FC<VerifyOTP> = ({
	verifyOTP,
	onClose,
	otpValues,
	setOTPValues,
	onConfirm,
	onAction,
	onShowError,
	onOTPAgain,
}) => {
	const [counter, setCounter] = useState(59);
	const [isError, setIsError] = useState<string>('');
	const [finishCountdown, setFinishCountdown] = useState(Date.now() + 59000);
	const dispatch = useAppDispatch();

	// useEffect(() => {
	// 	setFinishCountdown(Date.now() + 59000);
	// 	setCounter(59);
	// }, [verifyOTP.phoneNumber]);

	useEffect(() => {
		let timer: NodeJS.Timeout;

		const timeSpan = Math.floor((finishCountdown - Date.now()) / 1000);
		if (timeSpan >= 0 && verifyOTP.phoneNumber) {
			timer = setInterval(() => setCounter(timeSpan), 1000);
		}

		return () => clearInterval(timer);
	}, [counter, finishCountdown, verifyOTP.phoneNumber]);

	useEffect(() => {
		(async () => {
			const otpValue = otpValues.join('');

			if (otpValue.length === 6) {
				Notification.Loading.custom();

				try {
					const confirmOTPReponse = await confirmOTP({
						email_or_phone_number: verifyOTP.phoneNumber,
						type: VerifyType.CONFIRM_PHONE,
						verification_token: otpValue,
						verify_id: verifyOTP.verifyId,
						full_name: verifyOTP.contactName,
						gender: verifyOTP.gender,
					});

					if (!confirmOTPReponse.isError && confirmOTPReponse.data) {
						if (!confirmOTPReponse.data?.nextStep) {
							if (confirmOTPReponse.data?.message) {
								// show error
								setOTPValues(Array<string>(6).fill(''));
								onShowError();
								Notification.Loading.remove(300);
							} else {
								const { access_token, web_token, expires_in } = confirmOTPReponse.data?.loginData;

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
								}
								const resUpdate = await updateInfoCustomer({
									fullName: verifyOTP.contactName,
									gender: verifyOTP.gender,
									mobilePhone: verifyOTP.phoneNumber,
								});
								if (!resUpdate.isError && resUpdate.data) {
									dispatch(authActions.updateSelfInfoRequest(resUpdate.data));
								}
								onAction('CREATE');
								setOTPValues(Array<string>(6).fill(''));
								Notification.Loading.remove(300);
							}
						} else {
							if (verifyOTP.type === 'NEW') {
								// confirm sđt tồn tại ở đt khác để login
								onConfirm();
								Notification.Loading.remove(300);
							} else {
								// show không thể change vì đã tồn tại. Phải logout để đăng nhập lại
								setOTPValues(Array<string>(6).fill(''));
								onShowError();
								Notification.Loading.remove(300);
							}
						}
					} else {
						setIsError('Mã không đúng. Vui lòng thử lại');
						Notification.Loading.remove(300);
					}
				} catch (error) {
					setIsError('Mã không đúng. Vui lòng thử lại');
					Notification.Loading.remove(300);
				}
			} else {
				isError && setIsError('');
			}
		})();
	}, [otpValues]);

	const resendOTP = async () => {
		setCounter(59);
		setFinishCountdown(Date.now() + 59000);
		setOTPValues(Array<string>(6).fill(''));

		try {
			const generateOTPReponse = await generateOTP({
				email_or_phone_number: verifyOTP.phoneNumber,
				type: verifyOTP.type === 'NEW' ? VerifyType.CONFIRM_PHONE : VerifyType.CHANGE_PHONE,
			});

			if (!generateOTPReponse.isError && generateOTPReponse.data) {
				onOTPAgain({
					verifyId: generateOTPReponse?.data?.verify_id || 0,
				});
			} else {
				Notification.Info.default('Xin vui lòng thử lại', 'ERROR', 3000);
			}
		} catch (error) {
			Notification.Info.default('Xin vui lòng thử lại', 'ERROR', 3000);
		}
	};

	return (
		<div className='h-[100vh]'>
			<div className='relative flex h-[48px] items-center justify-center bg-[#F05A94]'>
				<button
					onClick={() => {
						onClose();
						setOTPValues(Array<string>(6).fill(''));
					}}
					className='absolute top-1/2 left-[16px] h-[24px] w-[24px] -translate-y-1/2'
				>
					<ImageCustom
						height={24}
						width={24}
						alt='close'
						src={'/static/svg/close-icon.svg'}
						objectFit='cover'
					/>
				</button>
				<div className='h-[48px] w-[155px]'>
					<ImageCustom
						height={48}
						width={155}
						alt='logo'
						src={'/static/images/logofull.png'}
						objectFit='cover'
					/>
				</div>
			</div>
			<div className='mb-16 px-[24px] pt-6'>
				<p className='font-sfpro_bold text-24 text-333333'>Xác thực OTP</p>
				<p className='mt-[4px] font-sfpro text-14 tracking-wider text-666666'>
					Nhập mã gồm 6 chữ số đã được gửi đến
				</p>
				<p className='mt-[2px] font-sfpro_bold text-14 text-666666'>{verifyOTP.phoneNumber}</p>

				<div className='mt-[28px]'>
					<InputOTP
						otpValues={otpValues}
						setOTPValues={setOTPValues}
						isNumberInput={true}
						shouldAutoFocus={true}
						length={6}
						className=''
						inputClassName={classNames([
							'mr-[8px] h-[58px] w-[39px] border-[1px] border-solid  rounded-[4px] text-[24px] font-sfpro_bold text-333333 text-center',
							isError ? 'border-red-500' : 'border-[#E0E0E0]',
						])}
					/>

					{isError && <p className='mt-[8px] text-14 text-[#EA001B]'>{isError}</p>}
				</div>
			</div>

			<div className='mt-[50px] mb-[32px] px-[24px]'>
				{counter > 0 ? (
					<>
						<p className='mt-[4px] font-sfpro text-14 tracking-wider text-666666'>
							Mã mới sẽ được gửi lại sau:{' '}
						</p>
						<p>
							<span className='mt-[2px] font-sfpro_bold text-14 text-666666'>
								00:{counter > 9 ? counter : `0${counter}`}
							</span>
						</p>
					</>
				) : (
					<>
						<p className='mt-[4px] font-sfpro text-14 tracking-wider text-666666'>
							Bạn chưa nhận được mã?
						</p>

						<button
							className='mt-[4px] bg-transparent font-sfpro_semiBold text-16 tracking-wider text-[#126BFB]'
							onClick={resendOTP}
						>
							Gửi lại mã
						</button>
					</>
				)}
			</div>
		</div>
	);
};

export default VerifyOTPMobile;
