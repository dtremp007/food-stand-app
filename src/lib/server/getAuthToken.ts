import { google } from 'googleapis';
import {
	GOOGLE_PRIVATE_KEY,
	GOOGLE_PROJECT_ID,
	GOOGLE_CLIENT_EMAIL,
	GOOGLE_SHEET_ID
} from '$env/static/private';

export const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export async function getAuthToken() {
	if (typeof window !== 'undefined') {
		throw new Error('NO SECRETS ON CLIENT!');
	}

	const { private_key } = JSON.parse(GOOGLE_PRIVATE_KEY || '{ private_key: null }');
	const auth = new google.auth.GoogleAuth({
		scopes: SCOPES,
		projectId: GOOGLE_PROJECT_ID,
		credentials: {
			private_key,
			client_email: GOOGLE_CLIENT_EMAIL
		}
	});
	const authToken = await auth.getClient();
	return authToken;
}
