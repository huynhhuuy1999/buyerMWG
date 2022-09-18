import Link from 'next/link';

export interface ICategoryTag {
	content?: string;
	badgeCount?: number;
	color?: string;
	path?: string;
}

const CategoryTag: React.FC<ICategoryTag> = (props: ICategoryTag) => {
	const { content, badgeCount = 0, color = '#EEE', path = '' } = props;

	return (
		<Link href={path} passHref>
			<a className='relative' title={content}>
				<h3
					style={{ backgroundColor: color }}
					className='rounded-md py-2 px-10px text-14 text-3E3E40'
				>
					{content}
				</h3>
				{badgeCount > 0 && (
					<p className='absolute -top-2 right-[-10px] rounded-full bg-DF0707 px-5px font-sfpro_semiBold text-11 text-white'>
						{badgeCount}
					</p>
				)}
			</a>
		</Link>
	);
};

export default CategoryTag;
