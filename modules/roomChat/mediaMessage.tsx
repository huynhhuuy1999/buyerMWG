import classNames from 'classnames';
import { ImageCustom } from 'components';
import { EmptyImage, REGEX_IMAGE } from 'constants/';
import React from 'react';
interface IMediaMessageProps {
	media: string[];
	className?: string;
	clss?: string;
	title?: string;
	onMouseLeave?: () => void;
	onMouseEnter?: () => void;
}
const MediaMessage: React.FC<IMediaMessageProps> = ({
	media,
	className,
	clss,
	title,
	onMouseLeave,
	onMouseEnter,
}) => {
	return (
		<div
			className={classNames([
				className ? className : '',
				'flex items-center flex-grow flex-row flex-wrap h-auto w-auto',
			])}
			role='none'
			title={title}
			onMouseLeave={onMouseLeave}
			onMouseEnter={onMouseEnter}
		>
			{media.map((urlMedia, index) => (
				<div
					className={classNames([clss ? clss : '', 'w-auto h-auto rounded-md shadow'])}
					key={index}
				>
					<ImageCustom
						width={media.length > 2 ? 64 : 192 / media.length}
						height={media.length > 2 ? 64 : 192 / media.length}
						src={urlMedia && REGEX_IMAGE.test(urlMedia) ? urlMedia : EmptyImage}
					/>
				</div>
			))}
		</div>
	);
};
export default MediaMessage;
