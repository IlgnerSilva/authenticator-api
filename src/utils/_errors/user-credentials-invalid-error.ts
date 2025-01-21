export class UserCredentialsInvalidError extends Error {
	constructor() {
		super('Credentials invalid.');
	}
}
