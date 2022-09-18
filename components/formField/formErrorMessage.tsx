import { ErrorMessage } from '@hookform/error-message';
import classNames from 'classnames';
import React, { FC } from 'react';

import { ErrorsMessageProps } from '@/components/formField/types';

const Messages: FC<ErrorsMessageProps<{}>> = ({ name, className, errors, messageExtra }) => {
	return (
		<ErrorMessage
			errors={errors}
			name={name}
			render={({ message }) => (
				<p className={classNames(['font-serif text-sm text-left block text-red-600', className])}>
					{messageExtra ?? message}
				</p>
			)}
		/>
	);
};

export default Messages;
