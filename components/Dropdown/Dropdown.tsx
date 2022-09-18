import classNames from 'classnames';
import { ImageCustom } from 'components';
import { ReactNode, useEffect, useRef, useState } from 'react';

interface IDropdown {
	data?: Array<{ id: number; label: string; selected?: boolean }>;
	defaultValue?: any;
	placeholder?: string;
	classNameContainer?: string;
	classNameHeader?: string;
	classNameBody?: string;
	classNameItem?: string;
	onChange?: (value: { id: number; label: string }) => void;
	prefixIcon?: ReactNode;
	suffixIcon?: ReactNode;
	iconSelected?: ReactNode;
	labelHeaderFixBody?: string;
	classNameTitle?: string;
}

export const Dropdown: React.FC<IDropdown> = ({
	classNameBody,
	classNameHeader,
	classNameItem,
	data,
	defaultValue,
	onChange,
	placeholder,
	prefixIcon,
	suffixIcon,
	iconSelected,
	labelHeaderFixBody,
	classNameTitle,
}) => {
	const [isShow, setIsShow] = useState<boolean>(false);
	const ref = useRef<HTMLDivElement>(null);
	const [selected, setSelected] = useState<{ id: number; label: string }>();

	const handleSelect = (value: { id: number; label: string }) => {
		setSelected(value);
		setIsShow(false);
		onChange?.(value);
	};

	useEffect(() => {
		if (defaultValue || defaultValue === 0) {
			let sortDefault = data?.filter((itemSort) => itemSort.id === Number(defaultValue));
			sortDefault?.length && setSelected(sortDefault[0]);
		} else {
			setSelected(data?.[0]);
		}
	}, [defaultValue]);

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

	return (
		<div className='relative'>
			<div
				className={`flex cursor-pointer items-center rounded-3px border border-light-E0E0E0 px-3 text-16 text-333333 ${classNameHeader}`}
				onClick={() => setIsShow(true)}
				onKeyPress={() => setIsShow(true)}
				tabIndex={0}
				role='button'
			>
				{prefixIcon && prefixIcon}
				<span className={classNames(['ml-[6px]'], classNameTitle ? classNameTitle : 'text-16')}>
					{data?.find((item) => item?.selected)
						? data?.find((item) => item?.selected)?.label
						: selected
						? selected.label
						: placeholder}
				</span>
				{suffixIcon && <div className='ml-1'>{suffixIcon}</div>}
			</div>
			<div
				className={classNames([
					'px-4 border absolute border-light-E0E0E0 w-full bg-white z-[1]',
					isShow ? 'transition-transform duration-150 origin-top ' : 'scale-y-0 origin-top',
					classNameBody,
				])}
				ref={ref}
			>
				{labelHeaderFixBody ? (
					<div
						className='flex h-[50px] cursor-pointer items-center justify-between border-b border-b-[#E0E0E0] px-6 text-333333'
						onClick={() => setIsShow(false)}
						onKeyPress={() => setIsShow(false)}
						tabIndex={0}
						role='button'
					>
						<span className='font-sfpro_semiBold text-18'>{labelHeaderFixBody}</span>
						<ImageCustom
							width={24}
							height={24}
							src={'/static/svg/Close.svg'}
							onClick={() => setIsShow(false)}
						/>
					</div>
				) : null}
				{data?.map((item, index) => {
					const check = Object.keys(item).includes('selected')
						? item?.selected
						: item.id === selected?.id;
					return (
						<div
							key={index}
							onClick={() => handleSelect(item)}
							className={classNames([
								'cursor-pointer',
								check && 'bg-[#f1f1f1] font-sfpro_semiBold',
								classNameItem,
							])}
							onKeyDown={() => {}}
							role='button'
							tabIndex={index}
						>
							{item.label}
							{iconSelected && check ? iconSelected : null}
						</div>
					);
				})}
			</div>
		</div>
	);
};
