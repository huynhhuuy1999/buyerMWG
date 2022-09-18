import classNames from 'classnames';
import { DeviceType } from 'enums';
import { useAppSelector } from 'hooks';
import isString from 'lodash/isString';
import React, { useEffect, useRef, useState } from 'react';

import { deviceTypeSelector } from '@/store/reducers/appSlice';
export interface OptionsProps {
	label?: string;
	value?: string | number;
}

interface DropdownProps {
	className?: string;
	underline?: boolean;
	defaultValue?: string | number;
	options: OptionsProps[] | undefined;
	icon?: React.ReactNode;
	disabled?: boolean;
	textDefaults?: string;
	onChange?: (
		value: string | number,
		setValue?: React.Dispatch<React.SetStateAction<OptionsProps>>,
	) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
	className,
	underline,
	defaultValue,
	options,
	disabled,
	textDefaults,
	icon,
	onChange,
}) => {
	const [value, setValue] = useState<OptionsProps>({
		label: '',
		value: '',
	});
	const [isActive, setIsActive] = useState<boolean>(false);
	const deviceType = useAppSelector(deviceTypeSelector);
	const refOptions = useRef<any>(null);

	useEffect(() => {
		setValue((prev) => ({
			...prev,
			value: isString(defaultValue) ? String(defaultValue) : Number(defaultValue),
		}));
	}, [defaultValue]);

	const handleSelectOption = (option: any) => {
		setValue(option);
		onChange && onChange(option.value, setValue);
		refOptions?.current?.blur();
	};

	return (
		<>
			{options?.some((item) => item.label && item.value) ? (
				<div className='relative'>
					<div
						className='group inline-block space-x-1'
						onClick={() => deviceType === DeviceType.MOBILE && setIsActive(!isActive)}
						onKeyPress={() => deviceType === DeviceType.MOBILE && setIsActive(!isActive)}
						tabIndex={0}
						role='button'
					>
						<div className='flex items-center font-sfpro_bold font-bold'>
							<span
								className={classNames([
									className,
									underline ? 'underline' : '',
									disabled ? 'cursor-not-allowed' : 'cursor-pointer',
									'block',
								])}
							>
								{options.find((t) => t.value === value.value)?.label ?? textDefaults}
							</span>
							{icon}
						</div>
						<div
							className={classNames([
								'absolute hidden shadow-md bg-white z-50 h-auto max-h-[200px] overflow-x-hidden overflow-y-scroll hide-scrollbar',
								disabled
									? 'grayscale filter cursor-not-allowed invisible'
									: 'lg:group-hover:block visible',
								deviceType === DeviceType.MOBILE && isActive ? 'xs:!block' : '',
							])}
							ref={refOptions}
						>
							{options?.map((option, index) => {
								return (
									<div
										className={classNames([
											option.value === defaultValue && 'cursor-not-allowed opacity-70',
										])}
										key={index}
									>
										<div
											onClick={() => handleSelectOption(option)}
											onKeyPress={() => handleSelectOption(option)}
											tabIndex={0}
											data-value={option.value}
											role='button'
											className={classNames([
												'cursor-pointer whitespace-nowrap py-2 px-4 first:rounded-t last:rounded-b hover:bg-[#edeff3]',
												option.value === defaultValue && 'pointer-events-none',
											])}
										>
											<span className={className}>{option.label}</span>
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
			) : (
				''
			)}
		</>
	);
};

export default Dropdown;
