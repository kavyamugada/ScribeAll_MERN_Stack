import React, { useState } from 'react';
import axios from 'axios';
export default function Register({ onNavigate }) {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    const termsChecked = document.getElementById('terms').checked;
    if (!termsChecked) {
      setError('You must agree to the Terms of Service and Privacy Policy.');
      return;
    }
    setLoading(true);
    try {
      // 🚀 Send the form values directly to your backend server port
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });
      if (response.data.success) {
        alert('Account created successfully! Please login.');
        onNavigate('login'); // Route them to login screen automatically
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong during registration.');
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fbfcff] p-4 font-sans isolate">
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] z-[-1] filter blur-[50px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(235,214,255,0.5) 0%, rgba(240,210,255,0.2) 50%, rgba(255,255,255,0) 70%)' }} />

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(130,140,180,0.1)] border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[600px]">
        <div className="p-8 lg:p-12 flex flex-col justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="font-bold text-[#0F172A] tracking-tight">ScribeAll</span>
          </div>
          <div className="my-auto py-4">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] mb-2">Create an Account</h2>
            <p className="text-sm text-gray-400 mb-6">Get started with your free account today</p>

            {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100">{error}</div>}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="John Doe" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] transition text-sm text-gray-700 placeholder-gray-300" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">Email Address</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="youremail@example.com" className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] transition text-sm text-gray-700 placeholder-gray-300" required />
              </div>

              <div>
  <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-1.5">
    Password
  </label>

  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Minimum 8 characters"
      className="w-full px-4 py-2.5 pr-12 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] transition text-sm text-gray-700 placeholder-gray-300"
      required
    />

    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-indigo-600"
    >
      {showPassword ? (
        // Eye Slash
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13.875 18.825A10.05 10.05 0 0112 19c-5 0-9-4-10-7a10.05 10.05 0 013.92-4.94M9.88 9.88A3 3 0 0114.12 14.12M6.1 6.1L17.9 17.9"
          />
        </svg>
      ) : (
        // Eye
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M2.458 12C3.732 7.943 7.523 5 12 5s8.268 2.943 9.542 7c-1.274 4.057-5.065 7-9.542 7S3.732 16.057 2.458 12z"
          />
        </svg>
      )}
    </button>
  </div>
</div>
              <div className="flex items-start space-x-2 text-xs font-semibold pt-1">
                <input type="checkbox" className="mt-0.5 w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500" id="terms" />
                <label htmlFor="terms" className="text-gray-500 cursor-pointer select-none leading-normal">
                  I agree to the <a href="#" className="text-indigo-600 hover:underline">Terms of Service</a> and <a href="#" className="text-indigo-600 hover:underline">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition tracking-wide text-sm mt-4 disabled:bg-indigo-400">
                {loading ? 'Creating Account...' : 'Register'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 font-semibold mt-6">
              Already have an account?{' '}
              <button onClick={() => onNavigate('login')} className="text-indigo-600 hover:underline font-bold focus:outline-none">Login here</button>
            </p>
          </div>

          <div className="text-center text-[10px] font-medium text-gray-300 tracking-wide">© 2026 ScribeAll. All rights reserved.</div>
        </div>

        <div className="hidden md:flex relative flex-col items-center justify-center p-8 overflow-hidden border-l border-gray-50" style={{ background: 'linear-gradient(135deg, #f0f5ff 0%, #e0f2fe 100%)' }}>
          <div className="absolute w-80 h-80 rounded-full border border-white/50 top-[-5%] left-[-10%] pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-indigo-200/20 filter blur-xl bottom-[5%] right-[-10%] pointer-events-none" />
          <div className="relative flex flex-col items-center justify-center w-full max-w-[280px]">
            <div className="absolute w-32 h-32 bg-blue-400/20 rounded-full filter blur-xl animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-[2.5rem] shadow-2xl border border-white/40 flex items-center justify-center text-white backdrop-blur-md z-10 mb-8 transform hover:rotate-3 transition duration-300">
              <svg className="w-12 h-12 drop-shadow" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
              </svg>
            </div>
            <div className="w-full bg-white/90 backdrop-blur-sm rounded-2xl p-4 shadow-[0_15px_35px_rgba(100,110,140,0.1)] border border-white/60 space-y-2 z-20">
              <div className="flex items-center space-x-2"><span className="text-green-500 text-xs">⚡</span><p className="text-[11px] font-bold text-slate-800">Instant AI Transcription</p></div>
              <div className="flex items-center space-x-2"><span className="text-green-500 text-xs">⚡</span><p className="text-[11px] font-bold text-slate-800">Custom Industry Templates</p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}