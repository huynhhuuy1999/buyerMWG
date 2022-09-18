import classNames from 'classnames';
import { ImageCustom, InputOTP, Notification } from 'components';
import { ACCESS_TOKEN, CART_ID, WEB_TOKEN } from 'constants/index';
import { VerifyType } from 'enums';
import { useAppDispatch } from 'hooks';
import Cookies from 'js-cookie';
import React, { useEffect, useState } from 'react';
import { confirmOTP, confirmOTPAction, generateOTP, getInfoCustomer } from 'services';

import { authActions } from '@/store/reducers/authSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

import ModalConfirmMerge from './components/ModalConfirmMerge';
import ModalErrorLogin from './components/ModalErrorLogin';

interface VerifyOTP {
	height: number;
	onClose: () => void;
	contextInfoProps: {
		mobileNumber: string;
		verifyId: number;
		type: string;
	};
	onVerifySuccess: (data: any) => void;
	onBackToPhone: () => void;
	onOTPAgain: (data: any) => void;
}

const VerifyOTPMobile: React.FC<VerifyOTP> = ({
	height,
	onClose,
	contextInfoProps,
	onVerifySuccess,
	onBackToPhone,
	onOTPAgain,
}) => {
	const [otpValues, setOTPValues] = useState(Array<string>(6).fill(''));
	const [counter, setCounter] = useState(59);
	const [isError, setIsError] = useState<string>('');
	const [isShowConfirm, setIsShowConfirm] = useState<boolean>(false);
	const [isShowErrorLogin, setIsShowErrorLogin] = useState<boolean>(false);
	const [finishCountdown, setFinishCountdown] = useState(Date.now() + 59000);

	const dispatch = useAppDispatch();

	useEffect(() => {
		setFinishCountdown(Date.now() + 59000);
		setCounter(59);
	}, [contextInfoProps.mobileNumber]);

	useEffect(() => {
		let timer: NodeJS.Timeout;

		const timeSpan = Math.floor((finishCountdown - Date.now()) / 1000);
		if (timeSpan >= 0 && contextInfoProps.mobileNumber) {
			timer = setInterval(() => setCounter(timeSpan), 1000);
		}

		return () => clearInterval(timer);
	}, [counter, finishCountdown, contextInfoProps.mobileNumber]);

	useEffect(() => {
		(async () => {
			const otpValue = otpValues.join('');

			if (otpValue.length === 6) {
				Notification.Loading.custom();

				try {
					const confirmOTPReponse = await confirmOTP({
						email_or_phone_number: contextInfoProps.mobileNumber,
						type:
							contextInfoProps.type === 'NEW' ? VerifyType.CONFIRM_PHONE : VerifyType.CHANGE_PHONE,
						verification_token: otpValue,
						verify_id: contextInfoProps.verifyId,
					});

					if (!confirmOTPReponse.isError && confirmOTPReponse.data) {
						if (!confirmOTPReponse.data?.nextStep) {
							if (confirmOTPReponse.data?.message) {
								setIsShowErrorLogin(true);
								setOTPValues(Array<string>(6).fill(''));
								Notification.Loading.remove(1000);
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

								onVerifySuccess({ phone: contextInfoProps.mobileNumber });

								Notification.Info.default(
									`${
										contextInfoProps.type === 'NEW'
											? 'Tạo tài khoản thành công'
											: 'Thay đổi số điện thoại thành công'
									}`,
									'SUCCESS',
									3000,
								);

								onClose();
								setOTPValues(Array<string>(6).fill(''));
								Notification.Loading.remove(1000);
							}
						} else {
							if (contextInfoProps.type === 'NEW') {
								setIsShowConfirm(true);
								Notification.Loading.remove(1000);
							} else {
								setIsShowErrorLogin(true);
								setOTPValues(Array<string>(6).fill(''));
								Notification.Loading.remove(1000);
							}
						}
					} else {
						setIsError('Mã không đúng. Vui lòng thử lại');
						Notification.Loading.remove(1000);
					}
				} catch (error) {
					setIsError(`Mã không đúng. Vui lòng thử lại`);
					Notification.Loading.remove(1000);
				}
			} else {
				isError && setIsError('');
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [otpValues]);

	const resendOTP = async () => {
		setCounter(59);
		setFinishCountdown(Date.now() + 59000);
		setOTPValues(Array<string>(6).fill(''));

		try {
			const generateOTPReponse = await generateOTP({
				email_or_phone_number: contextInfoProps.mobileNumber,
				type: contextInfoProps.type === 'NEW' ? VerifyType.CONFIRM_PHONE : VerifyType.CHANGE_PHONE,
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

	const handleConfirmMerge = async () => {
		const otpValue = otpValues.join('');
		Notification.Loading.custom();

		try {
			const confirmOTPReponse = await confirmOTPAction({
				email_or_phone_number: contextInfoProps.mobileNumber,
				type: VerifyType.CONFIRM_PHONE,
				verification_token: otpValue,
				verify_id: contextInfoProps.verifyId,
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

	return (
		<>
			<div style={{ height: `${height ? `${height}px` : '100vh'}` }}>
				<div className='relative flex h-[48px] items-center justify-center bg-[#F05A94]'>
					<button
						onClick={() => {
							onClose();
							setOTPValues(Array<string>(6).fill(''));
							setIsError('');
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

				<div className='mt-[64px] px-[24px] pb-3'>
					<p className='font-sfpro_bold text-24 text-333333'>Xác thực OTP</p>
					<p className='mt-[4px] font-sfpro text-14 tracking-wider text-666666'>
						Nhập mã gồm 6 chữ số đã được gửi đến
					</p>
					<p className='mt-[2px] font-sfpro_bold text-14 text-666666'>
						{contextInfoProps.mobileNumber}
					</p>

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

				<div className='my-[32px] px-[24px]'>
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

			{isShowConfirm && (
				<ModalConfirmMerge
					info={{ phone: contextInfoProps.mobileNumber }}
					onOK={handleConfirmMerge}
					onClose={() => {
						setOTPValues(Array<string>(6).fill(''));
						setIsShowConfirm(false);
						onClose();
					}}
				/>
			)}

			{isShowErrorLogin && (
				<ModalErrorLogin
					info={{ phone: contextInfoProps.mobileNumber }}
					onOK={() => {
						setIsShowErrorLogin(false);
						onBackToPhone();
					}}
				/>
			)}
		</>
	);
};

export default VerifyOTPMobile;
