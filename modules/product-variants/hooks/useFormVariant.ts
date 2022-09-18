import { yupResolver } from '@hookform/resolvers/yup';
import { useForm, UseFormReturn } from 'react-hook-form';
import * as yup from 'yup';

export const useFormVariants = (isTwoPropertiesSelected: boolean, isSingleVariant: boolean) => {
	const schemaVariant = yup.object().shape({
		isTwoProperties: yup.bool().default(isTwoPropertiesSelected),
		isSingleVariant: yup.bool().default(isSingleVariant),
		propertyValueId1: yup.number().when('isSingleVariant', {
			is: (value: boolean) => (!value ? true : false),
			then: yup.number().required('Vui lòng chọn phân loại hàng'),
		}),
		propertyValueId2: yup.number().when('isTwoProperties', {
			is: (value: boolean) => value && value === true,
			then: yup.number().required('Vui lòng chọn phân loại hàng'),
		}),
	});

	const methods: UseFormReturn<any, any> = useForm<any>({
		mode: 'onChange',
		resolver: yupResolver(schemaVariant),
	});

	const validVariantForms = methods.formState.isValid;

	return { methods, validVariantForms };
};
