import { SignJWT, jwtVerify } from 'jose';
import { Buffer } from 'node:buffer';

export default class JWT {
	constructor(secretKeyString) {
		this.secret = Buffer.from(secretKeyString, 'base64');
	}

	async sign(payload) {
		const jwt = new SignJWT(payload);
		jwt.setProtectedHeader({ alg: 'HS256' });
		jwt.setIssuedAt();
		jwt.setIssuer('sql-learning-app');
		jwt.setAudience('sql-learning-app');
		jwt.setExpirationTime('1year');
		return jwt.sign(this.secret);
	}

	async verify(token) {
		return jwtVerify(token, this.secret, { issuer: 'sql-learning-app' });
	}
}
