import InputEmoji from 'react-input-emoji';

interface PropsPicker {
	onChange?: () => void;
	onEnter?: () => void;
	name?: string;
	placeholder?: string;
	valueProps?: any;
}
const IconPicker: React.FC<PropsPicker> = ({ onChange, onEnter, placeholder, valueProps }) => {
	return (
		<InputEmoji
			value={valueProps}
			borderRadius={0}
			borderColor='#ffffff'
			onChange={onChange}
			placeholder={placeholder}
			onEnter={onEnter}
			clearOnEnter
		/>
	);
};
export default IconPicker;
