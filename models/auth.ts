export interface RegistAppIdPayload {
	appId: string;
	firebaseToken: string;
}

export interface RegistAppIdData {
	appId: string;
	signature: string;
	fireBaseToken: string;
	userId: string;
	userPhoneNumber?: string;
	userEmail?: string;
	webToken: string;
	createdAt: string;
}

export interface GuestLoginPayload {
	appId: string;
	signature: string;
}

export interface GuestLoginData {
	accessToken: string;
	webToken: string;
}

export interface LoginPayload {
	email_or_phone_number: string;
	password: string;
}

export interface LoginData {
	access_token: string;
	expires_in: number;
	token_type: string;
	scope: string;
	refresh_token: string;
	web_token: string;
}

export interface AvatarImage {
	name: string;
	description: string;
	filePath: string;
	fullPath: string;
	fileExtension: string;
}

export interface AccountInfo {
	id: string;
	userName: string;
	fullName: string;
	gender: number;
	email: string;
	mobilePhone: string;
	address: string;
	note: string;
	avatarImage: AvatarImage;
	birthDay: string;
	status: number;
	customerType: number;
	customerGroup: number;
	emailConfirmed: boolean;
	phoneNumberConfirmed: boolean;
	createdAt: string;
	version: number;
}

export interface TokenDecode {
	nbf: number;
	exp: number;
	iss: string;
	aud: string[];
	client_id: string;
	sub: string;
	auth_time: number;
	idp: string;
	user: string;
	jti: string;
	iat: number;
	scope: string[];
	amr: string[];
	hasura_claims: any;
	roles: string[];
}

export interface CustomerInfo {
	userId?: string;
	fullName?: string;
	gender?: number;
	email?: string;
	mobilePhone?: string;
	address?: string;
	note?: string;
	avatarImage?: {
		name?: string;
		description?: string;
		filePath?: string;
		fullPath?: string;
		fileExtension?: string;
	};
	birthDay?: string;
}

export interface FirebaseToken {
	platform: string;
	device: string;
	token: string;
	typeToken: string;
	language: string;
}
