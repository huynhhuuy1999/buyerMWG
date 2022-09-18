import React, {
	CSSProperties,
	DetailedHTMLProps,
	InputHTMLAttributes,
	TextareaHTMLAttributes,
} from 'react';
import { DeepMap, FieldError } from 'react-hook-form';

export const sizeMap: { [key in InputSize]: string } = {
	small: 'p-2 text-sm',
	medium: 'p-4 text-sm',
	onlyborderBottom: 'px-3 pt-6 pb-2 text-sm',
	base: 'p-[16px] text-base',
	large: 'p-5 text-lg',
};

export interface TypeStyleForms {
	labelInsideBorder?: boolean;
	OnlyborderBottom?: boolean;
	animation?: boolean;
	placeholder?: boolean;
}

export type labelColor = CSSProperties;
export type InputSize = 'base' | 'large' | 'medium' | 'onlyborderBottom' | 'small';
export type InputType = 'text' | 'email' | 'date' | 'tel' | 'checkbox' | 'password';

export interface Styles {
	label?: string;
	input?: string;
}

//for input normal
export type InputProps = {
	id: string;
	label?: string;
	type?: InputType;
	size?: InputSize;
	className?: string;
	labelColor?: labelColor;
	style?: Styles;
	suffixIcon?: JSX.Element;
	validationMessage?: JSX.Element;
	typeStyleForms: TypeStyleForms;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>, 'size'>;

// for radio input
export interface RadioInputProps
	extends DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> {
	id: string;
	name: string;
	label?: string;
	className?: string;
	reverseRadio?: boolean;
	styles?: Styles;
	labelColor?: labelColor;
	validationMessage?: JSX.Element;
	render?: React.ReactNode;
}

// for text area
export type FormTextareaProps = {
	id: string;
	label: string;
	className?: string;
	size?: InputSize;
	typeStyleForms: TypeStyleForms;
	validationMessage?: JSX.Element;
	labelColor?: labelColor;
} & Omit<
	DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>,
	'size'
>;

// for select
export interface SelectOptions {
	name: string;
	value: string | number;
}

export type SelectProps = {
	id: string;
	label?: string;
	className?: string;
	classNameSelect?: string;
	typeStyleForms?: TypeStyleForms;
	validationMessage?: JSX.Element;
	labelColor?: labelColor;
	render?: JSX.Element;
	size?: InputSize;
	options: SelectOptions[];
	isAvatar?: boolean;
	suffixIcon?: JSX.Element;
} & Omit<DetailedHTMLProps<InputHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>, 'size'>;

//error message
export interface ErrorsMessageProps<T> {
	className?: string;
	errors?: Partial<DeepMap<T, FieldError>>;
	name: string;
	messageExtra?: string;
}
