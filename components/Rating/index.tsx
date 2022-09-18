import classNames from 'classnames';
// import { ImageCustom } from 'components';
import React, { PropsWithChildren } from 'react';

type TypeRating = 'filer' | 'single' | 'multiple';

interface IRating {
	typeRating: TypeRating;
	value: number;
	className?: string;
	isEmpty?: boolean;
	onGetIndexStar?: (index: number) => void;
}
interface ISwitchProps {
	test: TypeRating;
	children?: (React.ReactNode | any)[];
}

const Rating: React.FC<IRating> = ({ typeRating, value, className, isEmpty, onGetIndexStar }) => {
	const Switch: React.FC<ISwitchProps> = ({ children, test }: PropsWithChildren<ISwitchProps>) => {
		// filter out only children with a matching prop
		return children?.find((child: any) => {
			return child.props.value === test;
		});
	};
	const Case: React.FC<{ children: React.ReactNode; value: TypeRating }> = ({
		children,
		value,
	}) => {
		return <>{children}</>;
	};
	return (
		<Switch test={typeRating}>
			<Case value={'filer'}>oke</Case>
			<Case value={'multiple'}>
				{[...new Array(5)].map((_, index: number) =>
					index < value ? (
						<div
							key={index}
							role='button'
							tabIndex={0}
							className={classNames(['relative', className || 'w-[15px] h-4 mx-[1px]'])}
							onClick={() => onGetIndexStar?.(index)}
							onKeyPress={() => onGetIndexStar?.(index)}
						>
							<img src='/static/svg/star-product.svg' width={32} height={32} alt='star' />
						</div>
					) : (
						<div
							className={classNames(['relative', className || 'w-[15px] h-4 mx-[1px]'])}
							key={index}
							role='button'
							tabIndex={0}
							onClick={() => onGetIndexStar?.(index)}
							onKeyPress={() => onGetIndexStar?.(index)}
						>
							{isEmpty ? (
								<img
									src='/static/svg/star-empty.svg'
									width={32}
									height={32}
									alt='star background'
								/>
							) : (
								<img src='/static/svg/star-none.svg' width={32} height={32} alt='star background' />
							)}
						</div>
					),
				)}
			</Case>
		</Switch>
	);
};
export default Rating;
