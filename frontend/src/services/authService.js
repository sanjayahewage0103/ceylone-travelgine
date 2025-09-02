// AuthService: Handles communication with backend authentication endpoints
class AuthService {
	constructor(baseURL = '/api/auth') {
		this.baseURL = baseURL;
	}

	async register(userData) {
		const response = await fetch(`${this.baseURL}/register`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(userData)
		});
		const data = await response.json();
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
