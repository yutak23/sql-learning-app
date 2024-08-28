import { generateSecret } from 'jose';

const secretKey = await generateSecret('HS256');
const secretKeyString = Buffer.from(secretKey.export()).toString('base64');

console.log(secretKeyString);
