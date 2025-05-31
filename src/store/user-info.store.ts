import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export interface UserInfo {
	name: string;
	lastname: string;
	email: string;
	phone: string;
	address: string;
	department?: string;
	province: string;
	locality: string;
	zipCode: string;
	dni: string;
}

function createUserInfo() {
	const initialCart: UserInfo = (() => {
		if (browser) {
			const stored = localStorage.getItem('user-info');
			try {
				return stored ? JSON.parse(stored) : [];
			} catch {
				return [];
			}
		}
		return [];
	})();

	const saveInfo = (info: UserInfo) => {
		localStorage.setItem('user-info', JSON.stringify(info));
	};

	const { subscribe, set } = writable<UserInfo>(initialCart);

	return {
		subscribe,
		save: (userInfo: UserInfo) => {
			saveInfo(userInfo);
			set(userInfo);
		} // Permite reemplazar el carrito completo si es necesario
	};
}

export const userInfoStore = createUserInfo();
