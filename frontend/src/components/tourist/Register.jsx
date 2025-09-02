import React, { useState } from 'react';
import Input from '../ui/Input';
import Button from '../ui/Button';
import authService from '../../services/authService';

// This component handles the tourist registration form.
const Register = ({ onSwitchToLogin }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (data.password !== data.confirmPassword) {
            setError("Passwords do not match.");
            setLoading(false);
            return;
        }

        try {
            // Call the authService, explicitly setting the role to 'tourist'
            await authService.register({ ...data, role: 'tourist' });
            setSuccess("Registration successful! Please login to continue.");
            setTimeout(() => {
                onSwitchToLogin(); // Automatically switch to login view after success
            }, 2000);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-800">Create a Tourist Account</h2>
                <p className="text-gray-600">Join to discover authentic Sri Lanka.</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input type="text" name="fullName" placeholder="Full Name" required />
                <Input type="email" name="email" placeholder="Email Address" required />
                <Input type="text" name="contact" placeholder="Contact Number" required />
                <Input type="password" name="password" placeholder="Password" required />
                <Input type="password" name="confirmPassword" placeholder="Confirm Password" required />
                
                {error && <p className="text-red-500 text-sm font-medium">{error}</p>}
                {success && <p className="text-green-500 text-sm font-medium">{success}</p>}
                
                <Button type="submit" fullWidth disabled={loading}>
                    {loading ? 'Creating Account...' : 'Create Account'}
                </Button>
            </form>
            <p className="text-center text-sm text-gray-600 mt-6">
                Already have an account?{' '}
                <button onClick={onSwitchToLogin} className="font-semibold text-teal-600 hover:text-teal-800">
                    Login Here
                </button>
            </p>
        </div>
    );
};

export default Register;
