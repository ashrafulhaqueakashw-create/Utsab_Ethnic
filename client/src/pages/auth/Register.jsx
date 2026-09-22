import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useRegisterMutation } from '../../features/auth/authApiSlice';
import { setCredentials } from '../../features/auth/authSlice';
import Message from '../../components/common/Message';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) navigate('/');
  }, [userInfo, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    if (password !== confirmPassword) {
      return setErrorMsg('Passwords do not match');
    }

    try {
      const res = await register({ name, email, password }).unwrap();
      dispatch(setCredentials(res));
      navigate('/');
    } catch (err) {
      setErrorMsg(err?.data?.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-row-reverse">
      {/* Right - Decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-bl from-primary-dark to-primary relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute w-[600px] h-[600px] rounded-full border border-white/30 top-40 right-40" />
          <div className="absolute w-[400px] h-[400px] rounded-full border border-white/20 -bottom-20 -left-10" />
        </div>
        <div className="relative text-center px-12 z-10">
          <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <span className="text-white font-serif font-bold text-2xl">U</span>
          </div>
          <h2 className="text-4xl font-serif font-bold text-white mb-4">Join Utsab Ethnic</h2>
          <p className="text-white/60 text-sm leading-relaxed max-w-sm mx-auto">
            Create an account to unlock faster checkout, order tracking, and member-only early access to new collections.
          </p>
        </div>
      </div>

      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md animate-fade-in-up">
          <div className="lg:hidden mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-serif font-bold text-sm">U</span>
              </div>
              <span className="font-serif font-bold tracking-wide text-neutral-dark">
                UTSAB <span className="font-light text-primary">ETHNIC</span>
              </span>
            </Link>
          </div>

          <h1 className="text-2xl md:text-3xl font-serif font-bold mb-2">Create Account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-medium hover:text-accent transition-colors">
              Sign in
            </Link>
          </p>

          {errorMsg && <div className="mb-6"><Message variant="danger">{errorMsg}</Message></div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                required
                className="input-field py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="input-field py-2.5"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  required
                  className="input-field py-2.5 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Confirm Password</label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="input-field py-2.5"
              />
            </div>

            <div className="pt-2 text-xs text-gray-500 mb-4">
              By creating an account, you agree to our{' '}
              <a href="#" className="text-primary hover:underline">Terms of Service</a>{' '}
              and{' '}
              <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full py-3.5 text-sm uppercase tracking-wider disabled:opacity-50 mt-2"
            >
              {isLoading ? 'Creating account...' : (
                <>Create Account <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
