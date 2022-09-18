import { ReactNode, useEffect, useRef, useState } from 'react';
import { Icon, IconEnum } from 'vuivui-icons';

interface IDropdownLocation {
	legend?: string | ReactNode;
	data?: Array<{ id: number; label: string }>;
	defaultValue?: any;
	placeholder?: string;
	classNameContainer?: string;
	classNameHeader?: string;
	classNameBody?: string;
	classNameItem?: string;
	onChange?: (value: { id: number; label: string }) => void;
}

export const DropdownLocation: React.FC<IDropdownLocation> = ({
	legend,
	data,
	defaultValue,
	placeholder,
	classNameBody,
	classNameContainer,
	classNameHeader,
	classNameItem,
	onChange,
}) => {
	const [isShow, setIsShow] = useState(false);
	const ref = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<{ id?: number; label?: string }>({
		id: 0,
		label: 'Toàn quốc',
	});

	useEffect(() => {
		if (isShow) {
			const handleClickOutside = (event: any) => {
				if (ref.current && !ref.current.contains(event.target)) {
					setIsShow(false);
				}
			};
			document.addEventListener('click', handleClickOutside);
			return () => {
				document.removeEventListener('click', handleClickOutside);
			};
		}
	}, [ref, isShow]);

	useEffect(() => {
		if (defaultValue && data?.length) {
			const index = data.findIndex((item) => item.id === defaultValue.id);
			if (index !== -1) {
				setSelected({
					id: defaultValue.id,
					label: data[index].label,
				});
			} else {
				setSelected({
					id: 0,
					label: 'Toàn quốc',
				});
			}
		}
	}, [defaultValue, data]);

	const handleSelect = (value: { id: number; label: string }) => {
		setSelected(value);
		setIsShow(false);
		onChange?.(value);
	};

	return (
		<div className={`relative ${classNameContainer}`}>
			<fieldset
				onClick={() => setIsShow(true)}
				className={`z-20 h-[56px] rounded-[5px] border ${classNameHeader}`}
				role='presentation'
			>
				<legend className='ml-5 text-13 text-666666'>{legend}</legend>
				<div className='ml-18px mr-5 flex justify-between'>
					<span className=' text-16'>{selected ? selected.label : placeholder}</span>
					<Icon name={IconEnum.CaretDown} size={20} />
				</div>
			</fieldset>
			<div
				className={` absolute z-10 w-full border bg-white px-4 ${
					isShow ? 'origin-top transition-transform duration-150' : 'origin-top scale-y-0'
				} ${classNameBody}`}
				ref={ref}
			>
				<div
					onClick={() => handleSelect({ id: 0, label: 'Toàn quốc' })}
					className={`cursor-pointer ${classNameItem}`}
					onKeyPress={() => handleSelect({ id: 0, label: 'Toàn quốc' })}
					tabIndex={0}
					role='button'
				>
					Toàn quốc
				</div>
				{data?.map((item, index) => {
					return (
						<div
							key={index}
							onClick={() => handleSelect(item)}
							className={`cursor-pointer ${classNameItem}`}
							onKeyPress={() => handleSelect(item)}
							tabIndex={index}
							role='button'
						>
							{item.label}
						</div>
					);
				})}
			</div>
		</div>
	);
};
