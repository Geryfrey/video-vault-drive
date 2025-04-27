
import { LoginForm } from '@/components/auth/LoginForm';
import { AppShell } from '@/components/layout/AppShell';
import { Link } from 'react-router-dom';

const LoginPage = () => {
  return (
    <AppShell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🎥</span>
            <h1 className="font-bold text-2xl">Video Vault</h1>
          </Link>
          <h2 className="text-2xl font-bold">Welcome back</h2>
        </div>
        
        <LoginForm />
      </div>
    </AppShell>
  );
};

export default LoginPage;
