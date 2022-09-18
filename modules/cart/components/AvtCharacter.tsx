import classNames from 'classnames';
import { useEffect, useState } from 'react';

type SizesAvt = 'large' | 'small' | 'medium';

export const sizeMap: { [key in SizesAvt]: string } = {
	large: 'h-[46px] w-[46px] max-w-[46px] flex-[46px] p-4 text-22',
	medium: 'h-[30px] w-[30px] max-w-[30px] flex-[30px] p-3 text-18',
	small: 'h-[16px] w-[16px] max-w-[16px] flex-[16px] p-2 text-12',
};

interface FontsAvtProps {
	bold?: boolean;
	uppercase?: boolean;
}

interface AvtCharacterProps {
	name: string;
	backgroundColor?: string;
	color?: string;
	sizes?: SizesAvt;
	fonts?: FontsAvtProps;
}

const AvtCharacter: React.FC<AvtCharacterProps> = ({ sizes = 'medium', name, fonts, ...props }) => {
	const [nameConvert, setNameConver] = useState<string>('');
	useEffect(() => {
		setNameConver(
			name
				?.split(' ')
				?.map((str) => str[0])
				?.filter((_, index) => index <= 1)
				?.join(''),
		);
	}, [name]);

	return (
		<div
			className={classNames([
				sizeMap[sizes],
				'relative rounded-full flex items-center justify-center overflow-hidden',
				fonts?.bold && 'font-sfpro_bold',
				fonts?.uppercase && 'uppercase',
			])}
			style={{
				backgroundColor: props.backgroundColor ?? '#828282',
				color: props.color ?? '#333333',
			}}
		>
			{nameConvert}
		</div>
	);
};

export default AvtCharacter;
