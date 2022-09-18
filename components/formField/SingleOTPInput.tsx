import { usePrevious } from 'hooks';
import { memo, useEffect, useRef } from 'react';

export interface SingleOTPInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
	focus?: boolean;
	shouldAutoFocus?: boolean;
}

function SingleOTPInputComponent(props: SingleOTPInputProps) {
	const { focus, shouldAutoFocus, value, ...rest } = props;
	const inputRef = useRef<HTMLInputElement>(null);
	const prevFocus = usePrevious(!!focus);
	useEffect(() => {
		if (inputRef.current) {
			if (focus && shouldAutoFocus) {
				inputRef.current.focus();
			}
			if (focus && shouldAutoFocus && focus !== prevFocus) {
				inputRef.current.focus();
				inputRef.current.select();
			}
		}
	}, [shouldAutoFocus, focus, prevFocus]);

	return (
		<input type='tel' maxLength={1} value={value || ''} placeholder='-' ref={inputRef} {...rest} />
	);
}
export default memo(SingleOTPInputComponent);
