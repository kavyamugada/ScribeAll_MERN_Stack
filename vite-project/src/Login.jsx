import React, { useState } from 'react';
import axios from 'axios';

export default function Login({ onNavigate, onLoginSuccess }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showBypass, setShowBypass] = useState(true); // Defaulted to true so it is always accessible if needed
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // 🚀 Points cleanly to your server setup port assignment rules
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: formData.email,
        password: formData.password
      });

      if (response.data.success) {
        alert(`Welcome back, ${response.data.user.name}!`);
        onLoginSuccess(response.data.user); 
      }
    } catch (err) {
      const backendError = err.response?.data?.message || err.message || '';
      const statusCode = err.response?.status;
      
      // 🔍 Enhanced error checking: Catch 404 Route errors alongside Network connection drops
      if (statusCode === 404) {
        setError('⚠️ API Route Error (404): The server is online, but the endpoint "/api/auth/login" was not found. Please verify your backend server route attachments, or use the Emergency Bypass below.');
        setShowBypass(true); 
      } else if (backendError.includes('ENOTFOUND') || backendError.includes('Network Error')) {
        setError('⚠️ MongoDB Database Connection Error: The server cannot reach your Atlas cloud cluster right now. Verify your local internet or IP whitelist settings.');
        setShowBypass(true); 
      } else {
        setError(backendError || 'Invalid email or password connection.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyBypass = (e) => {
    e.preventDefault(); // Stop any form-submission layout triggers
    console.warn("Emergency Bypass Engaged: Logging in with static mockup parameters.");
    const offlineMockUser = {
      _id: "657c1234f1d234567890abcdef", // Matches pipeline fallback requirements
      name: "Prathyu (Demo)",
      email: formData.email || "demo@scribeall.ai",
      tier: "Hackathon Presentation Sandbox Mode"
    };
    onLoginSuccess(offlineMockUser);
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#fbfcff] p-4 font-sans isolate">
      <div className="absolute top-[10%] right-[10%] w-[600px] h-[600px] z-[-1] filter blur-[50px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(218,226,255,0.6) 0%, rgba(240,210,255,0.3) 50%, rgba(255,255,255,0) 70%)' }} />

      <div className="w-full max-w-4xl bg-white rounded-3xl shadow-[0_20px_50px_rgba(130,140,180,0.1)] border border-gray-100 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[550px]">
        <div className="p-8 lg:p-12 flex flex-col justify-between">
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onNavigate('landing')}>
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
            <span className="font-bold text-[#0F172A] tracking-tight">ScribeAll</span>
          </div>

          <div className="my-auto py-6">
            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0F172A] mb-2">Welcome Back!</h2>
            <p className="text-sm text-gray-400 mb-6">Login to continue to your account</p>

            {error && (
              <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs font-semibold rounded-xl border border-red-100 space-y-2 text-left">
                <p>{error}</p>
                {showBypass && (
                  <button 
                    type="button" 
                    onClick={handleEmergencyBypass} 
                    className="w-full mt-1 bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-black uppercase tracking-wider py-1.5 rounded-lg transition cursor-pointer"
                  >
                    ⚡ Bypass Database & Force Demo Access
                  </button>
                )}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-left">
              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="youremail@example.com" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] transition text-sm text-gray-700 placeholder-gray-300" required />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 tracking-wide uppercase mb-2">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    name="password" 
                    value={formData.password} 
                    onChange={handleChange} 
                    placeholder="••••••••" 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-[#4F46E5] transition text-sm text-gray-700 placeholder-gray-300 pr-12" 
                    required 
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 transition text-sm cursor-pointer select-none z-10 bg-transparent border-none outline-none"
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs font-semibold pt-1">
                <label className="flex items-center space-x-2 text-gray-600 cursor-pointer select-none">
                  <input type="checkbox" className="w-4 h-4 rounded text-indigo-600 border-gray-300 focus:ring-indigo-500" defaultChecked />
                  <span>Remember me</span>
                </label>
                <a href="#" className="text-gray-500 hover:text-indigo-600 transition">Forgot Password?</a>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-[#4F46E5] hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl shadow-md transition tracking-wide text-sm mt-2 disabled:bg-indigo-400 cursor-pointer">
                {loading ? 'Verifying Account...' : 'Login'}
              </button>
            </form>

            <p className="text-center text-xs text-gray-400 font-semibold mt-6">
              Don't have an account?{' '}
              <button onClick={() => onNavigate('register')} className="text-indigo-600 hover:underline font-bold focus:outline-none cursor-pointer">Register here</button>
            </p>
          </div>

          <div className="text-center text-[10px] font-medium text-gray-300 tracking-wide">© 2026 ScribeAll. All rights reserved.</div>
        </div>

        <div className="hidden md:flex relative flex-col items-center justify-center p-8 overflow-hidden border-l border-gray-50" style={{ background: 'linear-gradient(135deg, #f3f0ff 0%, #e0e7ff 100%)' }}>
          <div className="absolute w-72 h-72 rounded-full border border-white/40 top-[10%] right-[-5%] pointer-events-none" />
          <div className="absolute w-96 h-96 rounded-full bg-white/20 filter blur-2xl bottom-[-10%] left-[-10%] pointer-events-none" />
          <div className="relative flex flex-col items-center justify-center w-full max-w-[280px]">
            <div className="absolute w-32 h-32 bg-indigo-400/30 rounded-full filter blur-xl animate-pulse" />
            <div className="relative w-32 h-32 bg-gradient-to-b from-indigo-400/80 to-purple-500/80 rounded-[2rem] shadow-2xl border border-white/50 flex items-center justify-center text-white backdrop-blur-md z-10 mb-8 transform hover:scale-105 transition duration-300">
              <svg className="w-14 h-14 drop-shadow-md" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            <div className="w-full bg-white rounded-2xl p-4 shadow-[0_15px_35px_rgba(100,110,140,0.15)] border border-white flex items-center space-x-3.5 z-20">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 text-sm">🛡️</div>
              <div className="text-left">
                <p className="text-xs font-extrabold text-indigo-950 leading-tight mb-0.5">Secure</p>
                <p className="text-[10px] font-medium text-gray-400 leading-none">Your data is safe with us.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}