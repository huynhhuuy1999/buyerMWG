import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { counterActions, valueSelector } from 'store/reducers/counterSlice';

const Counter: React.FC = () => {
	const dispatch = useDispatch();
	const countValue = useSelector(valueSelector);

	return (
		<>
			<div>Counter web</div>
			<div>
				<button
					className='mr-1 mb-1 rounded bg-pink-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600'
					onClick={() => dispatch(counterActions.increment())}
				>
					+
				</button>
				<input
					className='border border-solid border-blue-100 text-center'
					value={countValue}
					onChange={(event) =>
						dispatch(counterActions.incrementByAmount(Number(event.target.value)))
					}
				/>
				<button
					className='mr-1 mb-1 rounded bg-pink-500 px-4 py-2 text-xs font-bold uppercase text-white shadow outline-none transition-all duration-150 ease-linear hover:shadow-md focus:outline-none active:bg-pink-600'
					onClick={() => dispatch(counterActions.decrement())}
				>
					-
				</button>
			</div>
		</>
	);
};

export default Counter;
