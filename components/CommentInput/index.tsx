import { Fragment } from 'react';
import { Controller, useForm } from 'react-hook-form';
import InputEmoji from 'react-input-emoji';
import { Icon, IconEnum, iconSheet } from 'vuivui-icons';

interface RulesInput {
	id: string;
	title?: string;
	isLoading?: boolean;
	onSubmitForm: (data: any, id: string) => void;
	handleUpdateMedia: (e: any, id: string) => void;
}
const CommentForm: React.FC<RulesInput> = ({ id, title, onSubmitForm, handleUpdateMedia }) => {
	const {
		control,
		handleSubmit,
		formState: {},
		setValue,
	} = useForm<any>({ mode: 'onSubmit' });

	const handleSubmitA = (data: any) => {
		onSubmitForm(data, id);
		setValue(id, '');
	};

	return (
		<Fragment>
			<form
				onSubmit={handleSubmit((data) => handleSubmitA(data))}
				className='mb-4 w-full  rounded-sm border border-gray-300'
			>
				{iconSheet}
				<div className='flex relative w-full items-center justify-between space-x-1'>
					<div className='w-[80%]'>
						<Controller
							control={control}
							name={id}
							render={({ field: { value, onChange } }) => (
								<InputEmoji
									value={value}
									borderRadius={0}
									borderColor='#ffffff'
									onChange={onChange}
									placeholder={title}
									onEnter={handleSubmit((data) => handleSubmitA(data))}
									clearOnEnter={true}
								/>
							)}
						/>
					</div>
					<div className='flex items-start w-[20%] justify-start'>
						<span className='relative mr-2 flex h-6 w-6 flex-col hover:border-gray-100 hover:bg-gray-100'>
							<Icon name={IconEnum.Image} size={24} color={'#333333'} className='absolute z-1' />
							<input
								type='file'
								name={`${id ? id : 'question'}`}
								multiple
								onChange={(e: React.FormEvent<HTMLInputElement>) => handleUpdateMedia(e, id)}
								className='w-6  h-6 opacity-0 absolute z-10'
							/>
						</span>
						<span className='relative flex h-6 w-6 flex-col hover:border-gray-100 hover:bg-gray-100'>
							<Icon
								name={IconEnum.PaperPlaneRight}
								size={22}
								color={'#333333'}
								className='absolute z-1'
							/>
							<input
								type='submit'
								onClick={() => handleSubmit((data) => handleSubmitA(data))}
								className='w-6 h-6 opacity-0 absolute z-10'
							/>
						</span>
					</div>
				</div>
			</form>
		</Fragment>
	);
};
export default CommentForm;
