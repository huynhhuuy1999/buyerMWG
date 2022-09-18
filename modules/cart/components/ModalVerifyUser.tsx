import { Notification } from 'components';
import { ACCESS_TOKEN, CART_ID, WEB_TOKEN } from 'constants/';
import { VerifyType } from 'enums';
import { useAppCart, useAppDispatch, useAppSelector } from 'hooks';
import Cookies from 'js-cookie';
import { CustomerProfile, TypeActionShippingAddress } from 'models';
import { VerifyInfo, VerifyOTP, VerifyOTPErrorsExisted, VerifyOTPMerge } from 'modules';
import React, { useState } from 'react';
import { confirmOTPAction, updateInfoCustomer } from 'services';
import { ScopedMutator } from 'swr/dist/types';
import { handleChangeShipping } from 'utils';

import { deviceTypeSelector } from '@/store/reducers/appSlice';
import { authActions } from '@/store/reducers/authSlice';
import getErrorMessageInstance from '@/utils/getErrorMessageInstance';

import { VerifyOTPProps } from '../types';

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
	setVerifyOTP: (data: React.SetStateAction<VerifyOTPProps>) => void;
	handleSubmitPhoneSuccess: (value: any) => void;
	onAction: (val: TypeActionShippingAddress['action']) => void;
	onMutable: ScopedMutator<any>;
	onClose: () => void;
}

const ModalVerifyUser: React.FC<IModalVerifyUser> = ({
	verifyOTP,
	handleSubmitPhoneSuccess,
	setVerifyOTP,
	onAction,
	onMutable,
	onClose,
}) => {
	const [step, setStep] = useState<Step>(Step.phoneForm);
	const [otpValues, setOTPValues] = useState(Array<string>(6).fill(''));
	const dispatch = useAppDispatch();
	const deviceTypeState = useAppSelector(deviceTypeSelector);
	const { cartId } = useAppCart();

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
				onAction('CREATE');

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
				dataProfile?.find((ele) => ele.isDefault)?.profileId
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
					<VerifyInfo
						handleSendOTPSuccess={handleSendOTPSuccess}
						contextInfoProps={{ type: verifyOTP.type }}
						onClose={() => onClose()}
					/>
				);
			case Step.confirmOTP:
				return (
					<VerifyOTP
						verifyOTP={verifyOTP}
						onClose={onClose}
						onAction={onAction}
						otpValues={otpValues}
						setOTPValues={setOTPValues}
						onConfirm={() => setStep(Step.confirmMerge)}
						onShowError={() => setStep(Step.errorLogin)}
						onOTPAgain={(value) => setVerifyOTP({ ...verifyOTP, verifyId: value?.verifyId })}
					/>
				);
			case Step.confirmMerge:
				return (
					<VerifyOTPMerge
						info={{ phone: verifyOTP.phoneNumber }}
						onOK={handleConfirmMerge}
						onClose={onClose}
					/>
				);
			case Step.errorLogin:
				return (
					<VerifyOTPErrorsExisted
						info={{ phone: verifyOTP.phoneNumber }}
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

	return (
		<div className='relative z-10' aria-labelledby='modal-title' role='dialog' aria-modal='true'>
			<div className='fixed inset-0 bg-gray-500/75 transition-opacity'></div>

			<div className='fixed inset-0 z-10 overflow-y-auto'>
				<div className='flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0'>
					<div className='relative w-[40%] overflow-hidden rounded-lg bg-white text-left shadow-xl  transition-all'>
						<div className='relative bg-white px-4 pt-2 pb-4'>
							<div className='mx-auto flex items-center justify-center'>
								<div className='mt-5 text-left'>{renderStep()}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ModalVerifyUser;
