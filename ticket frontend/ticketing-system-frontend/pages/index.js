import { useState } from 'react';
import { useRouter } from 'next/router';
import { login, register } from '../services/authService';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

export default function AuthPage() {
  const [isLoginView, setIsLoginView] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const data = await login(username, password);
      localStorage.setItem('token', data.token);
      router.push('/dashboard'); // We will create this page next
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await register(username, password);
      setSuccess('Registration successful! Please log in.');
      setIsLoginView(true); // Switch to login view after successful registration
      setUsername('');
      setPassword('');
    } catch (err) {
      setError(err.message || 'Registration failed. The username might already be taken.');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError('');
    setSuccess('');
    setUsername('');
    setPassword('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-900">
          {isLoginView ? 'Ticketing System Login' : 'Create an Account'}
        </h1>

        <form className="space-y-6" onSubmit={isLoginView ? handleLogin : handleRegister}>
          <Input
            id="username"
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
          />
          <Input
            id="password"
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && <p className="text-sm text-center text-red-600">{error}</p>}
          {success && <p className="text-sm text-center text-green-600">{success}</p>}

          <div>
            <Button type="submit" disabled={isLoading} fullWidth>
              {isLoading ? 'Processing...' : (isLoginView ? 'Login' : 'Register')}
            </Button>
          </div>
        </form>

        <p className="text-sm text-center text-gray-600">
          {isLoginView ? "Don't have an account? " : "Already have an account? "}
          <button onClick={toggleView} className="font-medium text-blue-600 hover:text-blue-500">
            {isLoginView ? 'Register' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
}