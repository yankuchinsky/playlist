import {HTTP} from './HTTP';

const main = 'http://127.0.0.1:5000/';

export const User = {
	login(payload){
		return HTTP.post(main + 'login', payload);
	}
}
 
export const Songs = {
	getSongs(payload){
		return HTTP.get(main + 'songs');
	}
}