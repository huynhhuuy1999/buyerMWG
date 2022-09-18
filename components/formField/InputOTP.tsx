import React, { CSSProperties, memo, useCallback, useState } from 'react';

import SingleOTPInput from './SingleOTPInput';

const BACKSPACE = 8;
const LEFT_ARROW = 37;
const RIGHT_ARROW = 39;
const DELETE = 46;
const SPACEBAR = 32;

export interface OTPInputProps {
	length: number;
	shouldAutoFocus: boolean;
	isNumberInput?: boolean;
	disabled?: boolean;

	style?: CSSProperties;
	className?: string;

	otpValues: string[];
	setOTPValues: any;

	inputStyle?: CSSProperties;
	inputClassName?: string;
}

function OTPInputComponent(props: OTPInputProps) {
	const {
		length,
		isNumberInput,
		shouldAutoFocus,
		disabled,
		inputClassName,
		inputStyle,
		otpValues,
		setOTPValues,
		...rest
	} = props;

	// Define state activeInput = 0
	const [activeInput, setActiveInput] = useState(0);

	// helpers
	// Define some helper functions

	const focusInput = useCallback(
		(inputIndex: number) => {
			const selectedIndex = Math.max(Math.min(length - 1, inputIndex), 0);
			setActiveInput(selectedIndex);
		},
		[length],
	);

	// Handle onFocus input
	const handleOnFocus = useCallback(
		(index: number) => () => {
			focusInput(index);
		},
		[focusInput],
	);

	const isInputValueValid = useCallback(
		(value: string) => {
			const isTypeValid = isNumberInput ? !isNaN(parseInt(value, 10)) : typeof value === 'string';

			return isTypeValid && value.trim().length === 1;
		},
		[isNumberInput],
	);

	const changeCodeAtFocus = useCallback(
		(str: string) => {
			const updatedOTPValues = [...otpValues];
			updatedOTPValues[activeInput] = str[0] || '';
			setOTPValues(updatedOTPValues);
			+str.length === 6 && setActiveInput(-1);
		},
		[activeInput, otpValues, setOTPValues],
	);

	const focusNextInput = useCallback(() => {
		focusInput(activeInput + 1);
	}, [activeInput, focusInput]);

	// Handle onChange value for each input
	const handleOnChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const val = e.currentTarget.value;

			if (isInputValueValid(val)) {
				changeCodeAtFocus(val);
			}
		},
		[changeCodeAtFocus, isInputValueValid],
	);

	const handleOnInput = (e: any) => {
		if (isInputValueValid(e.target.value)) {
			focusNextInput();
		} else {
			// This is a workaround for dealing with keyCode "229 Unidentified" on Android.

			if (isNumberInput) {
				const { nativeEvent } = e;

				if (nativeEvent.data === null && nativeEvent.inputType === 'deleteContentBackward') {
					e.preventDefault();
					changeCodeAtFocus('');
					focusPrevInput();
				}
			}
		}
	};

	// Hanlde onBlur input
	const handleOnBlur = useCallback(() => {
		setActiveInput(-1);
	}, []);

	const focusPrevInput = useCallback(() => {
		focusInput(activeInput - 1);
	}, [activeInput, focusInput]);

	// Handle onKeyDown input
	const handleOnKeyDown = useCallback(
		(e: any) => {
			if (
				e.keyCode === BACKSPACE ||
				e.key === 'Backspace' ||
				e.keyCode === DELETE ||
				e.key === 'Delete'
			) {
				e.preventDefault();
				changeCodeAtFocus('');
				focusPrevInput();
			} else if (e.keyCode === LEFT_ARROW || e.key === 'ArrowLeft') {
				e.preventDefault();
				focusPrevInput();
			} else if (e.keyCode === RIGHT_ARROW || e.key === 'ArrowRight') {
				e.preventDefault();
				focusNextInput();
			} else if (
				e.keyCode === SPACEBAR ||
				e.key === ' ' ||
				e.key === 'Spacebar' ||
				e.key === 'Space'
			) {
				e.preventDefault();
			} else if (e.key.match(/^[^0-9]$/)) {
				e.preventDefault();
			}
		},
		[changeCodeAtFocus, focusNextInput, focusPrevInput],
	);

	const handleOnPaste = useCallback(
		(e: React.ClipboardEvent<HTMLInputElement>) => {
			e.preventDefault();
			const pastedData = e.clipboardData
				.getData('text/plain')
				.trim()
				.slice(0, length - activeInput)
				.split('');
			if (pastedData) {
				let nextFocusIndex = 0;
				const updatedOTPValues = [...otpValues];
				updatedOTPValues.forEach((val, index) => {
					if (index >= activeInput) {
						const changedValue = pastedData.shift() || val;
						if (changedValue) {
							updatedOTPValues[index] = changedValue;
							nextFocusIndex = index;
						}
					}
				});
				setOTPValues(updatedOTPValues);
				setActiveInput(Math.min(nextFocusIndex + 1, length - 1));
			}
		},
		[activeInput, length, otpValues, setOTPValues],
	);

	return (
		<div {...rest}>
			{Array(length)
				.fill('')
				.map((_, index) => (
					<SingleOTPInput
						key={`SingleInput-${index}`}
						focus={activeInput === index}
						value={otpValues && otpValues[index]}
						shouldAutoFocus={shouldAutoFocus}
						onFocus={handleOnFocus(index)}
						onChange={handleOnChange}
						onKeyDown={handleOnKeyDown}
						onBlur={handleOnBlur}
						onPaste={handleOnPaste}
						onInput={handleOnInput}
						style={inputStyle}
						className={`${inputClassName} ${
							activeInput === index ? 'border-[#F05A94]' : 'border-[#E0E0E0]'
						}`}
						disabled={disabled}
					/>
				))}
		</div>
	);
}

export interface SingleOTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	focus?: boolean;
}

export default memo(OTPInputComponent);
