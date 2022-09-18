interface ISwitchProps {
	active: boolean;
	onActive: (value: boolean) => void;
}

const Switch: React.FC<ISwitchProps> = ({ active, onActive }) => {
	const toggleClass = 'transform translate-x-[18px]';
	return (
		<>
			<button
				className={
					'w-[42px] h-[24px] flex items-centerrounded-full p-[1px] rounded-full cursor-pointer ' +
					(active ? 'bg-[#F05A94]' : 'bg-[#DADDE1]')
				}
				onClick={() => {
					onActive(!active);
				}}
			>
				<div
					className={
						'bg-white shadow-[0px 6px 12px rgba(28, 73, 143, 0.08)] w-[22px] h-[22px] rounded-full shadow-md transform duration-300 ease-in-out' +
						(active ? toggleClass : null)
					}
				></div>
			</button>
		</>
	);
};

export default Switch;
