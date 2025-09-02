import React from 'react';
import LoginPage from './pages/LoginPage';
import { AuthProvider } from './context/AuthContext';

export default function AdminApp() {
	return (
		<AuthProvider>
			<LoginPage />
		</AuthProvider>
	);
}
