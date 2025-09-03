// AuthService: Handles communication with backend authentication endpoints
class AuthService {
	constructor(baseURL = '/api/auth') {
		this.baseURL = baseURL;
	}

	async register(userData) {
		if (!userData.role) {
			throw new Error('Role is required for registration');
		}
		let response, data;
		// Use FormData for vendor registration (file upload)
		if (userData.role === 'vendor') {
			const formData = new FormData();
			// Send all vendor fields as flat keys for backend compatibility
			Object.entries(userData).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					formData.append(key, value);
				}
			});
			// Debug: print FormData keys before sending
			console.log('FormData keys for vendor registration:');
			for (let key of formData.keys()) {
				console.log(key);
			}
			response = await fetch(`${this.baseURL}/register`, {
				method: 'POST',
				body: formData
			});
		} else {
			response = await fetch(`${this.baseURL}/register`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(userData)
			});
		}
		try {
			data = await response.json();
		} catch {
			throw new Error('Invalid server response');
		}
		if (!response.ok) throw new Error(data.error || 'Registration failed');
		return data;
	}

	async login(email, password) {
		const response = await fetch(`${this.baseURL}/login`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});
		const data = await response.json();
		if (!response.ok) throw new Error(data.error || 'Login failed');
		return data;
	}
}

export default new AuthService();
