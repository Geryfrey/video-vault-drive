
import { RegisterForm } from '@/components/auth/RegisterForm';
import { AppShell } from '@/components/layout/AppShell';
import { Link } from 'react-router-dom';

const RegisterPage = () => {
  return (
    <AppShell>
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="mb-8 text-center">
          <Link to="/" className="flex items-center justify-center space-x-2 mb-4">
            <span className="text-3xl">🎥</span>
            <h1 className="font-bold text-2xl">Video Vault</h1>
          </Link>
          <h2 className="text-2xl font-bold">Create an account</h2>
        </div>
        
        <RegisterForm />
      </div>
    </AppShell>
  );
};

export default RegisterPage;
