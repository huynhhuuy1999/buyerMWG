interface IToggleBtn {
	isChecked?: boolean;
	width?: number;
	height?: number;
	setChecked?: (check: boolean) => void;
}

export const ToggleBtn: React.FC<IToggleBtn> = ({
	isChecked,
	width = 42,
	height = 24,
	setChecked,
}) => {
	return (
		<label className='relative inline-block' style={{ width, height }}>
			<input
				type='checkbox'
				checked={isChecked}
				onChange={() => setChecked?.(!isChecked)}
				style={{
					height: 0,
					width: 0,
					opacity: 0,
					margin: 'unset',
					border: 'unset',
					display: 'unset',
					placeContent: 'unset',
				}}
			/>
			<span
				className={`toggle ${isChecked ? 'toggle-checked bg-[#F05A94]' : ''} before:rounded-[50%]`}
			/>
		</label>
	);
};
