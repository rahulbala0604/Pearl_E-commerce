import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login, user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '/';

  useEffect(() => {
    if (user) {
      navigate(redirect);
    }
  }, [user, navigate, redirect]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill all fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
      navigate(redirect);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 bg-[var(--color-bg-warm)]">
      <div className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 w-full max-w-md animate-fade-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary-400 to-primary-600"></div>
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-semibold text-gray-900 mb-2">Welcome Back</h2>
          <p className="text-gray-500 font-light">Sign in to manage your water purifiers.</p>
        </div>

        <form onSubmit={submitHandler} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full btn-primary py-3 px-4 flex justify-center items-center font-bold tracking-wide shadow-md"
          >
            {isSubmitting ? <Loader2 className="animate-spin mr-2" size={20} /> : null}
            {isSubmitting ? 'SIGNING IN...' : 'SIGN IN'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-gray-600">
          Don't have an account?{' '}
          <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-primary-600 hover:text-primary-800 font-bold">
            Sign up now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
