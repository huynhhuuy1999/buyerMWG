import { ImageCustom, Rating } from '../..';

interface IReviewCardProps {
	valueRating?: number;
	merchantName: string;
	productName?: string;
	imgWidth?: number;
	imgHeight?: number;
	classname?: string;
	logo: string;
	image: string;
}

const ReviewCard: React.FC<IReviewCardProps> = ({
	valueRating,
	merchantName,
	productName,
	classname,
	logo,
	image,
}) => {
	return (
		<>
			<div className={'border rounded-lg p-2' + classname}>
				<div className='mb-3 flex'>
					<ImageCustom
						src={logo}
						width={24}
						height={24}
						className={`focus-outline-none aspect-square object-cover`}
					/>
					<span className='ml-2 font-semibold'>{merchantName}</span>
				</div>
				<div className='mb-2'>
					{image && (
						<ImageCustom
							src={image}
							loading='lazy'
							width='134'
							height='134'
							alt={productName}
							className={`focus-outline-none aspect-square object-cover`}
						/>
					)}
				</div>
				<div className='flex justify-center'>
					{valueRating && (
						<Rating
							typeRating='multiple'
							className='mx-[3px] h-[18px] w-[18px]'
							value={valueRating}
							isEmpty={true}
							//onGetIndexStar={handleGetIndexStar}
						/>
					)}
				</div>
			</div>
		</>
	);
};

export default ReviewCard;
