import { yupResolver } from '@hookform/resolvers/yup';
import { REGEX_PHONE_NUMBER, REGEX_SPECIAL_CHARACTER, REGEX_TAX_CODE } from 'constants/';
import { CartModel, ICartFormProps, PaymentMethod, TypeActionShippingAddress } from 'models';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

import { TypeCartPickupAddress } from '@/store/reducers/address';

const initalValues: ICartFormProps = {
	companyTaxCode: '',
	address: '',
	companyAddress: '',
	companyName: '',
	contactName: '',
	districtId: 0,
	gender: 0,
	isCompany: false,
	location: { lat: 0, lon: 0 },
	mobileNumber: '',
	paymentType: 0,
	pickupStoreId: '',
	note: '',
	provinceId: 0,
	wardId: 0,
	isLoadingCart: false,
	typeShipping: 0,
};

export const useFormCart = (
	paymentMethod: PaymentMethod[] | undefined,
	isAction: TypeActionShippingAddress,
	typePickupAddress: TypeCartPickupAddress,
	dataCart?: CartModel | null,
) => {
	const cartFormsSchemaDelivery = yup.object().shape({
		gender: yup.number().required('Vui lòng chọn giới tính'),
		contactName: yup
			.string()
			.required('Vui lòng nhập tên')
			.matches(REGEX_SPECIAL_CHARACTER, 'Vui lòng loại bỏ ký tự đặc biệt'),
		mobileNumber: yup
			.string()
			.required('Vui lòng nhập số điện thoại')
			.matches(REGEX_PHONE_NUMBER, 'Lỗi định dạng SĐT'),
		isCompany: yup.bool().default(false),
		companyName: yup
			.string()
			.nullable()
			.when('isCompany', {
				is: (value: boolean) => value && value === true,
				then: yup.string().required('Vui lòng chọn tên công ty'),
			}),
		companyTaxCode: yup
			.string()
			.nullable()
			.when('isCompany', {
				is: (value: boolean) => value && value === true,
				then: yup
					.string()
					.required('Vui lòng nhập mã số thuế')
					.matches(REGEX_TAX_CODE, 'Vui lòng nhập MST từ 10-15 ký tự'),
			}),
		companyAddress: yup
			.string()
			.nullable()
			.when('isCompany', {
				is: (value: boolean) => value && value === true,
				then: yup.string().required('Vui lòng nhập địa chỉ công ty'),
			}),
		typeShipping: yup.number().required('Vui lòng chọn loại giờ giao hàng'),
		provinceId: yup.number().required('Vui lòng chọn thành phố'),
		districtId: yup.number().required('Vui lòng chọn huyện'),
		wardId: yup.number().required('Vui lòng chọn xã'),
		address: yup.string().required('Vui lòng nhập địa chỉ'),
	});

	const cartFormsSchemaPickupStore = yup.object().shape({
		gender: yup.number().required('Vui lòng chọn giới tính'),
		contactName: yup
			.string()
			.required('Vui lòng nhập tên')
			.matches(REGEX_SPECIAL_CHARACTER, 'Vui lòng loại bỏ ký tự đặc biệt'),
		mobileNumber: yup
			.string()
			.required('Vui lòng nhập số điện thoại')
			.matches(REGEX_PHONE_NUMBER, 'Lỗi định dạng SĐT'),
		isCompany: yup.bool().default(false),
		companyName: yup
			.string()
			.nullable()
			.when('isCompany', {
				is: (value: boolean) => value && value === true,
				then: yup.string().required('Vui lòng chọn tên công ty'),
			}),
		provinceId: yup.number().required('Vui lòng chọn thành phố'),
		districtId: yup.number().required('Vui lòng chọn huyện'),
		wardId: yup.number().required('Vui lòng chọn xã'),
		companyTaxCode: yup
			.string()
			.nullable()
			.when('isCompany', {
				is: (value: boolean) => value && value === true,
				then: yup
					.string()
					.required('Vui lòng nhập mã số thuế')
					.matches(REGEX_TAX_CODE, 'Vui lòng nhập MST từ 10-15 ký tự'),
			}),
		companyAddress: yup
			.string()
			.nullable()
			.when('isCompany', {
				is: (value: boolean) => value && value === true,
				then: yup.string().required('Vui lòng nhập địa chỉ công ty'),
			}),
		pickupStoreId: yup.string().required('Vui lòng chọn một cửa hàng'),
	});

	const methods: UseFormReturn<ICartFormProps, any> = useForm<ICartFormProps>({
		mode: 'onChange',
		shouldFocusError: true,
		defaultValues: {
			...initalValues,
			paymentMethods: paymentMethod,
			paymentType:
				Number(dataCart?.cartPayment?.paymentType) > 0
					? dataCart?.cartPayment?.paymentType
					: paymentMethod?.find((k) => k.payDefault)?.id,
		},
		resolver: yupResolver(
			isAction.action === 'SUBMIT' || (isAction.action === 'RESELECT' && isAction.isActiveOrder)
				? yup.object().shape({
						isCompany: yup.bool().default(false),
						companyName: yup
							.string()
							.nullable()
							.when('isCompany', {
								is: (value: boolean) => value && value === true,
								then: yup.string().required('Vui lòng chọn tên công ty'),
							}),
						companyTaxCode: yup
							.string()
							.nullable()
							.when('isCompany', {
								is: (value: boolean) => value && value === true,
								then: yup
									.string()
									.required('Vui lòng nhập mã số thuế')
									.matches(REGEX_TAX_CODE, 'Vui lòng nhập MST từ 10-15 ký tự'),
							}),
						companyAddress: yup
							.string()
							.nullable()
							.when('isCompany', {
								is: (value: boolean) => value && value === true,
								then: yup.string().required('Vui lòng nhập địa chỉ công ty'),
							}),
				  })
				: typePickupAddress === 'homeDelivery'
				? cartFormsSchemaDelivery
				: cartFormsSchemaPickupStore,
		),
	});

	const validCartForms: boolean =
		isAction.action !== 'EDIT'
			? !methods.formState.isValid || !methods.formState.isDirty
			: !methods.formState.isValid;

	return { methods, validCartForms };
};
