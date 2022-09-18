import React, { useEffect, useState } from 'react';

import DatePickerItem from './DatePickerItem';
import { DateConfig, dateConfigMap, Unit } from './types';
import { isDateConfig, isDateConfigKey } from './utils';
import { nextDate } from './utils/time';

export interface DatePickerProps {
	value?: Date;
	min?: Date;
	max?: Date;
	customHeader?: React.ReactNode;
	showHeader?: boolean;
	showFooter?: boolean;
	showCaption?: boolean;
	dateConfig?: Unit[] | DateConfig[];
	headerFormat?: string;
	confirmText?: string;
	cancelText?: string;
	onChange?: Function;
	onSelect?: Function;
	onCancel?: React.MouseEventHandler<HTMLButtonElement | HTMLDivElement>;
	onFinish?: Function;
}

const normalizeDateConfig = (dateConfig: Required<DatePickerProps>['dateConfig']) => {
	const configList: DateConfig[] = dateConfig.map((value: string | DateConfig) => {
		if (isDateConfigKey(value)) {
			return {
				...dateConfigMap[value as keyof typeof dateConfigMap],
				type: value,
			};
		}
		if (isDateConfig(value)) {
			const key = value.type;
			return {
				...dateConfigMap[key],
				...value,
				type: key,
			};
		}
		throw new Error('invalid dateConfig');
	});
	return configList;
};

const DatePicker: React.FC<DatePickerProps> = ({
	value: propsValue = new Date(),
	min = new Date(1950, 0, 1),
	max = new Date(2050, 0, 1),
	showFooter = true,
	showHeader = true,
	showCaption = false,
	dateConfig = [
		{
			format: 'YYYY',
			caption: 'Năm',
			type: 'year',
			step: 1,
		},
		{
			format: 'M',
			caption: 'Tháng',
			type: 'month',
			step: 1,
		},
		{
			format: 'D',
			caption: 'Ngày',
			type: 'date',
			step: 1,
		},
	],
	headerFormat = 'DD/MM/YYYY',
	confirmText = 'Xong',
	cancelText = 'Huỷ',
	customHeader,
	onSelect,
	onChange,
	onCancel,
	onFinish,
}) => {
	const [value, setValue] = useState(nextDate(propsValue));
	useEffect(() => {
		setValue((stateValue) => {
			if (stateValue.getTime() !== propsValue.getTime()) {
				return new Date(propsValue);
			}
			return stateValue;
		});
	}, [propsValue]);

	useEffect(() => {
		if (value.getTime() > max.getTime()) {
			setValue(new Date(max));
		}

		if (value.getTime() < min.getTime()) {
			setValue(new Date(min));
		}
	}, [value, min, max]);

	const handleFinishBtnClick = () => {
		if (onSelect) onSelect(value);
	};

	const handleCancelBtnClick = () => {
		if (onFinish) onFinish(value);
	};

	const handleDateSelect = (nextValue: typeof value) => {
		setValue(nextValue);
		if (onChange) {
			onChange(nextValue);
		}
	};

	const dataConfigList = normalizeDateConfig(dateConfig);
	return (
		<div className='vuivui-datepicker ios'>
			{showHeader && (
				<div className='vuivui-datepicker-header'>
					{/* {customHeader || convertDate(value, headerFormat)} */}
					{customHeader}
				</div>
			)}
			{showCaption && (
				<div className='vuivui-datepicker-caption'>
					{dataConfigList.map((item, index) => (
						<div key={index} className='vuivui-datepicker-caption-item'>
							{item.caption}
						</div>
					))}
				</div>
			)}
			<div className='vuivui-datepicker-content'>
				{dataConfigList.map((item, index) => (
					<DatePickerItem
						key={index}
						value={value}
						min={min}
						max={max}
						step={item.step}
						type={item.type}
						format={item.format}
						onSelect={handleDateSelect}
					/>
				))}
			</div>
			{showFooter && (
				<div className='vuivui-datepicker-navbar'>
					<button className='vuivui-datepicker-navbar-btn' onClick={handleFinishBtnClick}>
						{confirmText}
					</button>
					<button className='vuivui-datepicker-navbar-btn' onClick={handleCancelBtnClick}>
						{cancelText}
					</button>
				</div>
			)}
		</div>
	);
};

export default DatePicker;
