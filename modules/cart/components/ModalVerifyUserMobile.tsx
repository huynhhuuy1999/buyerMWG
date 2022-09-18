import { Notification } from 'components';
import { ACCESS_TOKEN, CART_ID, WEB_TOKEN } from 'constants/';
import { DeviceType, VerifyType } from 'enums';
import { useAppCart, useAppDispatch, useAppSelector } from 'hooks';
import Cookies from 'js-cookie';
import { CustomerProfile, TypeActionShippingAddress } from 'models';
import { VerifyOTPErrorsExisted, VerifyOTPMerge } from 'modules';
import dynamic from 'next/dynamic';
import React, { useState } from 'react';
import { confirmOTPAction, updateInfoCustomer } from 'services';
import { ScopedMutator } from 'swr/dist/types';
import { handleChangeShipping } from 'utils';

import { deviceTypeSelector } from '@/store/reducers/appSlice';
import { authActions } from '@/store/reducers/authSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

import { VerifyOTPProps } from '../types';
import Drawer from './Drawer';

const DynamicVerifyInfoMobile = dynamic(() => import('@/modules/verify-info/verify-info.mobile'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

const DynamicVerifyOTPMobile = dynamic(() => import('@/modules/verify-otp/verify-otp.mobile'), {
	loading: () => <>Loading...</>,
	ssr: false,
});

export enum Step {
	phoneForm = 'PHONE_FORM',
	confirmOTP = 'CONFIRM_OTP',
	confirmMerge = 'CONFIRM_MERGE',
	errorLogin = 'ERROR_LOGIN',
}
interface IModalVerifyUser {
	verifyOTP: {
		phoneNumber: string;
		contactName: string;
		gender: number;
		verifyId: number;
		type: string;
	};
	onActive: { isShowVerifyInfo: boolean; isShowVerifyOTP: boolean };
	setVerifyOTP: (data: React.SetStateAction<VerifyOTPProps>) => void;
	handleSubmitPhoneSuccess: (value: any) => void;
	onAction: (val: TypeActionShippingAddress['action']) => void;
	onMutable: ScopedMutator<any>;
	onClose: () => void;
}

const ModalVerifyUserMobile: React.FC<IModalVerifyUser> = ({
	verifyOTP,
	handleSubmitPhoneSuccess,
	setVerifyOTP,
	onAction,
	onMutable,
	onActive,
	onClose,
}) => {
	const [step, setStep] = useState<Step>(Step.phoneForm);
	const [otpValues, setOTPValues] = useState(Array<string>(6).fill(''));
	const { cartId } = useAppCart();
	const deviceTypeState = useAppSelector(deviceTypeSelector);
	const dispatch = useAppDispatch();

	const handleSendOTPSuccess = (value: VerifyOTPProps) => {
		handleSubmitPhoneSuccess(value);
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
				full_name: verifyOTP.contactName,
				gender: verifyOTP.gender,
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
				onClose();
				const resUpdate = await updateInfoCustomer({
					fullName: verifyOTP.contactName,
					gender: verifyOTP.gender,
					mobilePhone: verifyOTP.phoneNumber,
				});
				if (!resUpdate.isError && resUpdate.data) {
					dispatch(authActions.updateSelfInfoRequest(resUpdate.data));
				}
				const resProfile = await onMutable({
					url: '/profile',
					method: 'GET',
				});

				const dataProfile = resProfile?.data as CustomerProfile[];
				dataProfile.find((ele) => ele.isDefault)?.profileId
					? handleChangeShipping(
							cartId,
							dataProfile.find((ele) => ele.isDefault)?.profileId!,
							onMutable,
							dispatch,
					  )
					: await onMutable({
							method: 'GET',
							url: `/cart/${cartId}`,
					  });
				await onMutable({
					method: 'GET',
					url: `/cartbuylater`,
				});
				setOTPValues(Array<string>(6).fill(''));
				Notification.Loading.remove(300);
			} else {
				getErrorMessageInstance('Xin vui lòng thử lại');
				Notification.Loading.remove(3000);
			}
		} catch (error) {
			getErrorMessageInstance('Xin vui lòng thử lại');
			Notification.Loading.remove(3000);
		}
	};

	const renderStep = () => {
		switch (step) {
			case Step.phoneForm:
				return (
					<Drawer
						isOpen={onActive.isShowVerifyInfo}
						direction='RIGHT'
						className={'hide-scrollbar z-[20] overflow-auto'}
						height={'h-[100vh]'}
					>
						<DynamicVerifyInfoMobile
							handleSendOTPSuccess={handleSendOTPSuccess}
							contextInfoProps={{ type: verifyOTP.type }}
							onClose={onClose}
						/>
					</Drawer>
				);
			case Step.confirmOTP:
				return (
					<Drawer
						isOpen={onActive.isShowVerifyOTP}
						direction='RIGHT'
						className={'hide-scrollbar z-[30] overflow-auto'}
						height={'h-[100vh]'}
					>
						<DynamicVerifyOTPMobile
							verifyOTP={verifyOTP}
							onAction={onAction}
							otpValues={otpValues}
							setOTPValues={setOTPValues}
							onConfirm={() => setStep(Step.confirmMerge)}
							onShowError={() => setStep(Step.errorLogin)}
							onOTPAgain={(value) => setVerifyOTP({ ...verifyOTP, verifyId: value?.verifyId })}
							onClose={onClose}
						/>
					</Drawer>
				);
			case Step.confirmMerge:
				return (
					<Drawer
						isOpen={Boolean(step === Step.confirmMerge)}
						direction='RIGHT'
						className={'hide-scrollbar z-[30] overflow-auto'}
						height={'h-[100vh]'}
					>
						<VerifyOTPMerge
							info={{ phone: verifyOTP.phoneNumber }}
							onOK={handleConfirmMerge}
							onClose={onClose}
							deviceType={DeviceType.MOBILE}
						/>
					</Drawer>
				);
			case Step.errorLogin:
				return (
					<VerifyOTPErrorsExisted
						info={{ phone: verifyOTP.phoneNumber }}
						onClose={onClose}
						onOK={() => {
							setStep(Step.phoneForm);
							setVerifyOTP({
								phoneNumber: '',
								contactName: '',
								gender: 0,
								type: 'CHANGE',
								verifyId: 0,
							});
						}}
						deviceType={deviceTypeState}
					/>
				);
			default:
				return <></>;
		}
	};

	return <>{renderStep()}</>;
};

export default ModalVerifyUserMobile;
