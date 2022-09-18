import classNames from 'classnames';
import { EmptyImage } from 'constants/';
import { FastAverageColor } from 'fast-average-color';
import { useAmp } from 'next/amp';
import { ImageProps } from 'next/image';
import { memo, useMemo, useState } from 'react';

import { useIsomorphicLayoutEffect } from '@/hooks/useIsomorphicLayoutEffect';

interface ImgCustomProps extends ImageProps {
	isBlur?: boolean;
	fixedBg?: string;
}

const ImageCustom = ({ isBlur = true, fixedBg = '', ...rest }: ImgCustomProps) => {
	const detectColor = new FastAverageColor();
	const [src, setSrc] = useState<string>(String(rest.src));
	const [screenWidth, setScreenWidth] = useState(768);
	const [color, setColor] = useState('rgb(255,255,255)');

	const isAmp = useAmp();

	useIsomorphicLayoutEffect(() => {
		setScreenWidth(document?.body?.clientWidth);
	}, []);

	useIsomorphicLayoutEffect(() => {
		isBlur &&
			String(src)?.includes('https') &&
			detectColor
				.getColorAsync(src, { top: 10, left: 0, width: 10, height: 10 })
				.then((color) => {
					if (color.value[0] === 0) setColor(`rgba(255,255,255,1)`);
					else setColor(`rgba(${color.value[0]},${color.value[1]},${color.value[2]},0.7)`);
				})
				.catch(() => {
					setColor(`rgba(255,255,255,1)`);
				});
	}, [rest.src, isBlur]);

	const arr = useMemo(() => [16, 32, 40, 48, 64, 90, 96, 128, 256, 320, 384, 512, 1024, 1366], []);

	const findClosestHigher = (w: number | string) => {
		let width = w;
		if (width?.toString()?.includes('%')) width = 512;
		return screenWidth >= 768
			? arr.find((item) => item >= parseInt(String(width)))
			: arr.find((item) => item > parseInt(String(width)));
	};

	const generateSrcSet = (w: number | string) => {
		const index = arr.findIndex((item) => item === Number(findClosestHigher(w ?? 384)));
		if (screenWidth >= 768) {
			if (index <= arr.length - 3) return [arr[index], arr[index + 1], arr[index + 2]];
			else if (index === arr.length - 2) return [arr[index], arr[index + 1]];
			else if (index === arr.length - 1) return [arr[index]];
			else return [arr[arr.length - 1]];
		} else if (screenWidth < 768) {
			return [arr[index]];
		}
	};

	return isAmp ? (
		<div
			style={{
				width: rest.width?.toString()
					? rest.width?.toString()?.includes('px')
						? rest.width
						: `${rest?.width}px`
					: 'inherit',
				height: rest?.height?.toString()
					? rest.height?.toString()?.includes('px')
						? rest.height
						: `${rest?.height}px`
					: 'inherit',
			}}
			className='relative'
		>
			<amp-img
				alt={rest.alt}
				src={src}
				// width={rest.width?.toString()}
				// height={rest?.height?.toString()}
				layout={'fill'}
			/>
		</div>
	) : !String(src)?.includes('http') ? (
		<picture
			style={{ width: rest.width, height: rest.height ?? 'inherit' }}
			className={classNames(
				'flex items-center',
				rest?.className || '',
				src === EmptyImage ? 'bg-[#f1f1f1]' : '',
			)}
		>
			<img
				alt={rest?.alt || 'vv-image'}
				src={String(rest?.src) || EmptyImage}
				className={classNames([
					rest?.src === EmptyImage
						? `object-fill w-full h-full ${rest.className}`
						: `${rest.className} ${rest?.width ? `w-[${rest?.width}px]` : ''} ${
								rest?.height ? `h-[${rest?.height}px]` : ''
						  } `,
				])}
				role='none'
				onClick={rest?.onClick}
			/>
		</picture>
	) : (
		<picture
			style={{
				height: rest.height ?? 'inherit',
				width: rest.width,
				background: fixedBg ? fixedBg : color,
			}}
			className={classNames(
				'flex items-center w-full',
				rest?.className || '',
				src === EmptyImage ? 'bg-[#f1f1f1]' : '',
			)}
		>
			<source
				srcSet={`${generateSrcSet(rest.width!)?.map((ele, index) => {
					return `${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/assets/files?url=${
						String(src)?.includes('http') ? rest?.src : process.env.NEXT_PUBLIC_DOMAIN_URL! + src
					}&w=${ele}&q=${rest.quality ?? 75} ${index + 1}x`;
				})}`}
			></source>
			<img
				alt={rest.alt}
				loading={rest.loading}
				style={{ contentVisibility: 'auto', margin: 'auto' }}
				className={classNames('h-full', rest.className)}
				src={`${process.env.NEXT_PUBLIC_IMAGE_DOMAIN}/assets/files?url=${
					String(src)?.includes('http') ? rest?.src : process.env.NEXT_PUBLIC_DOMAIN_URL! + src
				}&w=${findClosestHigher(String(rest?.width || 512)?.replace('px', '')) || 512}&q=${100}`}
				onError={() => {
					setSrc(EmptyImage);
				}}
				role='none'
				onClick={rest?.onClick}
			/>
		</picture>
	);
};

export default memo(ImageCustom);
