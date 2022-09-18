import classNames from 'classnames';
import { ImageCustom } from 'components';
import Link from 'next/link';

interface IEmptyProduct {
	title?: string;
	content?: string;
	type?: string;
	height?: string;
	width?: string;
}

const EmptyProduct: React.FC<IEmptyProduct> = ({
	title,
	height,
	width,
	type,
	content = 'Tiếp tục mua sắm',
}) => {
	return (
		<div
			className={classNames([
				'w-full bg-white px-3 py-4 rounded-md flex text-16  text-center relative',
				type ? 'h-[calc(100vh_-_150px)] ' : 'h-[calc(100vh_-_92px)] ',
				height ?? 'h-[calc(100vh_-_92px)]',
				width ?? 'w-full',
			])}
		>
			<div className='m-auto flex w-fit flex-col items-center'>
				<div className='relative h-[151px] w-[151px]'>
					<ImageCustom
						src={'/static/svg/empty-list.svg'}
						alt='img vuivui'
						objectFit='contain'
						layout='fill'
					/>
				</div>
				<div className='flex flex-col'>
					<span>{title}</span>
					{type !== 'shop' && (
						<Link href='/'>
							<a className='mx-auto mt-4 block w-[50%] min-w-max rounded-md bg-pink-F05A94 px-3 py-2 text-white'>
								{content}
							</a>
						</Link>
					)}
				</div>
			</div>
		</div>
	);
};

export default EmptyProduct;
