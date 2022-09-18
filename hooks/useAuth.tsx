import { LoginPayload } from 'models';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import {
	currentUserSelector,
	getSelfInfoRequest,
	isLoggedInSelector,
	loginRequest,
	logoutRequest,
} from 'store/reducers/authSlice';

export const useAuth = () => {
	const dispatch = useDispatch();
	const router = useRouter();
	const isLoggedIn = useSelector(isLoggedInSelector);
	const currentUser = useSelector(currentUserSelector);

	const login = async (data: LoginPayload) => {
		await dispatch(loginRequest(data));
		await dispatch(getSelfInfoRequest());
		router.back();
	};

	const logout = async () => {
		await dispatch(logoutRequest());
	};

	return { isLoggedIn, currentUser, login, logout };
};
