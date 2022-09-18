import { Icon, ImageCustom } from 'components';
import moment from 'moment';
import { memo } from 'react';

import ShowMedia from './comment-show-media';
const _ = require('lodash');

interface IProps {
	data: any;
	handleButtonLike: (data: any, key: number) => void;
	onClickShowInput: (data: any, key: number) => void;
	handleShowMedia: (itemChild: any, index: number, key: number) => void;
}
const CommentReply: React.FC<IProps> = ({
	data,
	handleButtonLike,
	handleShowMedia,
	onClickShowInput,
}) => {
	return (
		<>
			<div className='rounded-md'>
				<div className='mt-[8px] rounded-md bg-[#F6F6F6] px-[12px] py-[8px]'>
					<div className='align-center justify-content-start flex'>
						<div className='relative mr-[10px] h-[24px] w-[24px] '>
							<ImageCustom
								className='w-full rounded-[50%]'
								width={24}
								height={24}
								alt='test vui vui'
								src={data?.userInfo?.urlImage || '/static/images/empty-img.png'}
							/>
						</div>
						{/* <div className='mr-2 h-[24px] w-[24px]'>
							<img
								className='block w-full rounded-[50%]'
								src={data?.userInfo?.urlImage || '/static/svg/file-image.svg'}
								alt='avatar'
							/>
						</div> */}
						<span className='text-[rounded-md] mr-2 block font-sfpro_semiBold  text-sm'>
							{data?.userInfo?.fullName || 'Hack'}
						</span>
					</div>
					<div className='bg-[#F6F6F6] px-8'>
						<span className='text-sm'>
							<span>
								Trả lời:
								<span className='mx-[2px] text-[#f05a94]'>
									@{(data?.userInfo?.fullName && data?.userInfo?.fullName) || 'Hack'}
								</span>
							</span>
							{data?.content}
						</span>
					</div>
					<div></div>
				</div>
				<div className=''>
					<div className='flex items-center justify-start'>
						{(data?.media || []).map(
							(itemMedia: any, index: number) =>
								index + 1 < 5 && (
									<ShowMedia
										media={data}
										item={itemMedia}
										index={index}
										handleShowMedia={handleShowMedia}
									/>
								),
						)}
						{_.isNaN(_.isEmpty(data.media)) && _.isInteger(data.media.length - 5) ? (
							<label className='relative mx-[6px] flex h-[80px] w-[80px] flex-col overflow-hidden  rounded border border-dashed'>
								<div className='absolute inset-0 bg-[#0E0E10]/20'></div>
								<span className='absolute top-[0px] right-0 z-10 block h-[80px] w-[80px] text-center  text-20 leading-[80px] text-white'>
									+{(data?.mediaa || []).length - 5}
								</span>
							</label>
						) : null}
					</div>
				</div>
				<div className='my-[13px] ml-[42px] flex items-center justify-start'>
					<button
						onClick={() => handleButtonLike(data, 2)}
						className={`mr-4 flex items-center ${data.isLike > 0 ? 'text-[#f05a94]' : ''}`}
					>
						<div className='relative h-[14px] w-5'>
							{data?.isLike ? (
								<Icon type='icon-thumb-up' size={14} variant='primary' />
							) : (
								<Icon type='icon-thumb-up' size={14} variant='dark' />
							)}
						</div>
						<span className={`text-[14px] ${data.isLike > 0 ? 'text-[#f05a94]' : ''} `}>
							Hữu ích {data?.totalLike ? `(${data?.totalLike})` : ''}
						</span>
					</button>
					<button
						onClick={() => onClickShowInput && onClickShowInput(data, 2)}
						style={{ color: 'rgba(0, 0, 0, 0.54)' }}
						className='ml-[15px] flex items-center'
					>
						<div className='relative h-[20px] w-[28px]'>
							<ImageCustom src='/static/svg/comment.svg' alt='like' layout='fill' />
						</div>
						<span className='text-[14px] text-[#0000008A]'>Phản hồi</span>
					</button>
					<span className='ml-[15px] block text-12 font-medium leading-5 text-[#999999]'>
						{moment(data?.createAt).fromNow()}
					</span>
				</div>
			</div>
		</>
	);
};
export default memo(CommentReply);
