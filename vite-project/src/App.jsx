import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import NewDocument from './components/NewDocument';
import ProfileSettings from './components/ProfileSettings'; 
import History from './components/History';      
import Sidebar from './components/Sidebar'; 
import LegalAnalysis from './components/LegalAnalysis'; // Ensure correct path mapping to your LegalAnalysis component

export default function App() {
  const [currentPage, setCurrentPage] = useState('landing'); 
  const [backendStatus, setBackendStatus] = useState({ connected: false, message: 'Connecting to server...' });
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('business');

  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  
  const recognitionRef = useRef(null);
  const finalTranscriptAccumulator = useRef('');

  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const pricingRef = useRef(null);

  const tabData = {
    business: {
      title: 'Meeting Minutes',
      badge: '💼 Business',
      accentText: 'text-indigo-600',
      accentBg: 'bg-indigo-50 border-indigo-100',
      progressTheme: 'bg-indigo-600',
      glowShadow: 'rgba(79,70,229,0.15)',
      docHeader: 'Executive Summary',
      accuracy: '98.2% Accuracy',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=80&q=80',
      speaker: 'Alex Mercer (Product VP)',
      bullets: [
        'Quarterly target timelines synchronized across all engineering squads.',
        'SaaS cloud migration window finalized for next staging branch rollout.',
        'Optimized data routing pipelines to reduce processing socket latencies.'
      ]
    },
    healthcare: {
      title: 'Clinical SOAP Note',
      badge: '🩺 Healthcare',
      accentText: 'text-emerald-600',
      accentBg: 'bg-emerald-50 border-emerald-100',
      progressTheme: 'bg-emerald-500',
      glowShadow: 'rgba(16,185,129,0.15)',
      docHeader: 'Chief Complaint & Vitals',
      accuracy: '99.4% Accuracy',
      avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=80&q=80',
      speaker: 'Dr. Sarah Jenkins, MD',
      bullets: [
        'Patient presents with persistent non-productive cough over 5 days.',
        'Lungs clear to auscultation bilaterally; oxygen saturation stable at 98%.',
        'Prescribed routine supportive therapy and scheduled standard diagnostic labs.'
      ]
    },
    legal: {
      title: 'Case Brief Summary',
      badge: '⚖️ Legal',
      accentText: 'text-amber-600',
      accentBg: 'bg-amber-50 border-amber-100',
      progressTheme: 'bg-amber-500',
      glowShadow: 'rgba(245,158,11,0.15)',
      docHeader: 'Deposition Matrix Findings',
      accuracy: '99.1% Accuracy',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=80&q=80',
      speaker: 'Marcus Vance, Esq.',
      bullets: [
        'Witness corroborates exact incident timeline parameters during review cross.',
        'Physical event coordinates align thoroughly with verified timestamp discovery.',
        'Motion for document production organized for upcoming judicial sign-off.'
      ]
    },
    education: {
      title: 'Lecture Digest Overview',
      badge: '🎓 Education',
      accentText: 'text-purple-600',
      accentBg: 'bg-purple-50 border-purple-100',
      progressTheme: 'bg-purple-500',
      glowShadow: 'rgba(147,51,234,0.15)',
      docHeader: 'Core Theoretical Frameworks',
      accuracy: '97.6% Accuracy',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80',
      speaker: 'Prof. Evelyn Hayes',
      bullets: [
        'Analyzed performance characteristics of distributed compute clusters.',
        'Evaluated scaling limits using foundational boundary equations.',
        'Assigned practical sandbox optimization modules to student directories.'
      ]
    }
  };

  const active = tabData[activeTab];

  useEffect(() => {
    axios.get('http://localhost:5000/api/test')
      .then((response) => {
        setBackendStatus({ connected: true, message: response.data.message });
      })
      .catch(() => {
        setBackendStatus({ connected: false, message: 'Backend Offline' });
      });
  }, []);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscriptAccumulator.current += event.results[i][0].transcript + ' ';
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }
        setLiveTranscript(finalTranscriptAccumulator.current + interimTranscript);
      };

      rec.onerror = (e) => console.error("Mic interface exception caught:", e);
      recognitionRef.current = rec;
    }
  }, []);

  const startRecording = () => {
    finalTranscriptAccumulator.current = '';
    setLiveTranscript('');
    setIsRecording(true);
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (e) {}
    }
  };

  const stopRecording = () => {
    setIsRecording(false);
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);          
    setCurrentPage('dashboard'); 
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to sign out of this session?")) {
      stopRecording();
      setUser(null);
      finalTranscriptAccumulator.current = '';
      setLiveTranscript('');
      setCurrentPage('landing');
    }
  };

  const scrollToSection = (elementRef) => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  if (currentPage === 'login') {
    return <Login onNavigate={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
  }

  if (currentPage === 'register') {
    return <Register onNavigate={setCurrentPage} onLoginSuccess={handleLoginSuccess} />;
  }

  // 🌟 Included 'cross-exam' and 'gap-analysis' routes inside the allowed workspace views array block
  if (['dashboard', 'new-document', 'history', 'profile', 'cross-exam', 'gap-analysis'].includes(currentPage)) {
    return (
      <div className="flex w-screen h-screen overflow-hidden bg-[#f8fafc]">
        <Sidebar 
          currentView={currentPage} 
          setCurrentView={setCurrentPage} 
          user={user} 
          onLogout={handleLogout} 
        />

        <main className="flex-1 h-full overflow-y-auto bg-[#f8fafc]">
          {currentPage === 'dashboard' && (
            <Dashboard 
              onNavigate={setCurrentPage} 
              user={user}
              isRecording={isRecording}
              liveTranscript={liveTranscript}
              startRecording={startRecording}
              stopRecording={stopRecording}
            />
          )}

          {currentPage === 'new-document' && <NewDocument onNavigate={setCurrentPage} user={user} />}

          {currentPage === 'history' && <History onNavigate={setCurrentPage} user={user} />}

          {/* ⚖️ Route logic routing to your newly built advanced features view container inside the canvas area */}
          {['cross-exam', 'gap-analysis'].includes(currentPage) && (
            <div className="p-6 max-w-5xl mx-auto bg-[#f8fafc]">
              <LegalAnalysis initialTab={currentPage} />
            </div>
          )}

          {currentPage === 'profile' && (
            <div className="p-6 max-w-5xl mx-auto bg-[#f8fafc]">
              <div className="mb-4 text-left">
                <h1 className="text-xl font-black text-slate-900 tracking-tight">Account Parameters</h1>
                <p className="text-xs text-slate-400">Modify credentials settings stored directly on your MongoDB user instance.</p>
              </div>
              <ProfileSettings 
                user={user} 
                onProfileUpdate={(updatedUser) => setUser(updatedUser)}
              />
            </div>
          )}
        </main>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-[#fbffff] overflow-x-hidden font-sans isolate">
      <div className="absolute top-[10%] left-[-10%] w-[600px] h-[600px] z-[-1] filter blur-[40px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(235,214,255,0.4) 0%, rgba(255,255,255,0) 70%)' }} />
      <div className="absolute top-[-5%] right-[-10%] w-[700px] h-[700px] z-[-1] filter blur-[50px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(218,226,255,0.5) 0%, rgba(240,210,255,0.3) 40%, rgba(255,255,255,0) 70%)' }} />

      <header className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between sticky top-0 bg-white/60 backdrop-blur-md z-40 border-b border-slate-100">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">S</div>
          <span className="font-bold text-[#0F172A] tracking-tight">ScribeAll</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-gray-500">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-600 transition">Home</button>
          <button onClick={() => scrollToSection(featuresRef)} className="hover:text-indigo-600 transition">Features</button>
          <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-indigo-600 transition">How It Works</button>
          <button onClick={() => scrollToSection(pricingRef)} className="hover:text-indigo-600 transition">Pricing</button>
        </nav>

        <div className="flex items-center space-x-6">
          <button onClick={() => setCurrentPage('login')} className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition">Login</button>
          <button onClick={() => setCurrentPage('register')} className="bg-[#4F46E5] hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition">Get Started</button>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 lg:px-12 pt-8 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center flex-grow">
        <div className="lg:col-span-5 flex flex-col space-y-6 text-left">
          <h1 className="text-[44px] lg:text-[54px] font-extrabold tracking-tight text-[#0F172A] leading-[1.1]">
            Transform Audio <br /> Into <span className="text-[#6366F1]">Structured <br />Documents</span>
          </h1>
          <p className="text-gray-500 text-[15px] leading-relaxed max-w-md font-medium">
            ScribeAll uses AI to convert your audio recordings into industry-specific documents in seconds.
          </p>
          <div className="flex flex-wrap gap-4 pt-1">
            <button onClick={() => setCurrentPage('register')} className="bg-[#4F46E5] hover:bg-indigo-700 text-white px-6 py-3.5 rounded-xl text-sm font-semibold shadow-md transition">Get Started Free</button>
            <button onClick={() => scrollToSection(featuresRef)} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-3.5 rounded-xl text-sm font-bold shadow-sm transition">Explore Features</button>
          </div>
        </div>

        <div className="lg:col-span-7 relative w-full flex justify-center lg:justify-end">
          <div className="w-full max-w-[620px] bg-white rounded-[2rem] border border-slate-100 p-6 transition-all duration-500 text-left flex flex-col gap-5" style={{ boxShadow: `0 35px 80px -15px ${active.glowShadow}` }}>
            <div className="flex flex-wrap gap-1.5 pb-4 border-b border-slate-100">
              {Object.keys(tabData).map((tabKey) => (
                <button
                  type="button"
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-150 ${activeTab === tabKey ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
                >
                  {tabKey === 'business' ? '💼 Business' : tabKey === 'healthcare' ? '🩺 Healthcare' : tabKey === 'legal' ? '⚖️ Legal' : '🎓 Education'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
              <div className="md:col-span-5 flex flex-col justify-between gap-3">
                <div className="bg-slate-50/70 border border-slate-100/60 p-3 rounded-xl flex items-center space-x-2.5 shadow-sm">
                  <img src={active.avatar} alt="User Profile Avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-600/10" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[9px] font-bold text-slate-400 font-mono tracking-wide uppercase">Input Context</h4>
                    <p className="text-xs font-bold text-slate-800 truncate tracking-tight">{active.speaker}</p>
                  </div>
                </div>

                <div className="bg-[#0b0f19] border border-slate-950 rounded-xl p-4 flex flex-col justify-between min-h-[135px] shadow-inner flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider">[Audio_Wave]</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse"></span>
                  </div>
                  <div className="flex items-end justify-center space-x-1.5 h-10 my-2">
                    <div className={`w-1 ${active.progressTheme} h-7 rounded-full animate-[pulse_0.7s_infinite]`}></div>
                    <div className="w-1 bg-purple-500 h-10 rounded-full animate-[pulse_1.1s_infinite]"></div>
                    <div className={`w-1 ${active.progressTheme} h-9 rounded-full animate-[pulse_0.5s_infinite]`}></div>
                    <div className="w-1 bg-slate-700 h-5 rounded-full"></div>
                    <div className={`w-1 ${active.progressTheme} h-8 rounded-full animate-[pulse_0.9s_infinite]`}></div>
                  </div>
                  <div className="text-[9px] font-mono font-bold text-slate-400 flex items-center justify-between border-t border-slate-900/60 pt-1">
                    <span>ENGINE STREAM</span>
                    <span className={`${active.accentText} font-bold`}>{active.accuracy}</span>
                  </div>
                </div>
              </div>

              <div className="md:col-span-7 bg-white border border-slate-100 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[240px]">
                <div className="space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center space-x-1.5">
                      <span className="text-xs">📄</span>
                      <h3 className="text-[10px] font-black tracking-tight font-mono text-slate-700 uppercase">{active.title}</h3>
                    </div>
                    <span className={`text-[8px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${active.accentBg} ${active.accentText}`}>Scribed</span>
                  </div>
                  <div className="space-y-1.5">
                    <h4 className="text-[9px] font-bold text-slate-400 font-mono tracking-widest uppercase">{active.docHeader}</h4>
                    <ul className="space-y-2">
                      {active.bullets.map((bullet, idx) => (
                        <li key={idx} className="text-[11px] text-slate-600 leading-relaxed font-medium flex items-start space-x-1.5">
                          <span className={`w-1 h-1 rounded-full ${active.progressTheme} shrink-0 mt-1.5`}></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="text-[9px] font-mono text-slate-400 font-semibold pt-2 border-t border-slate-50 flex items-center justify-between">
                  <span>Engine: Whisper-v4</span>
                  <span>ISO Format Mapped</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <section ref={featuresRef} id="features" className="bg-slate-50 border-y border-slate-100 py-20 text-left relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Advanced AI Workspace Infrastructure</h2>
            <p className="text-slate-500 text-sm mt-2">Stop wasting hours manually formatting raw text. ScribeAll builds structure instantly.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-2xl">🎙️</span>
              <h3 className="text-sm font-bold text-slate-900">Live Terminal Streaming</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Capture microphone audio streams in real-time with zero system delay or buffering blocks.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-2xl">🧠</span>
              <h3 className="text-sm font-bold text-slate-900">Context-Aware Templates</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Instantly structures raw text into tailored SOAP notes, corporate minutes, or legal brief metrics.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-2xl">📝</span>
              <h3 className="text-sm font-bold text-slate-900">Live Interactive Canvas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Instantly view your parsed data streams, make quick adjustments, and securely save updates.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-2">
              <span className="text-2xl">📥</span>
              <h3 className="text-sm font-bold text-slate-900">Multi-Format Exporting</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Generate immediate print-ready summaries or download clean matching PDF documents with a single click.</p>
            </div>
          </div>
        </div>
      </section>

      <section ref={howItWorksRef} id="how-it-works" className="bg-white py-20 text-left relative z-10 w-full">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How It Works</h2>
            <p className="text-slate-500 text-sm mt-2">Go from multi-line vocals to standard professional documentation in 4 easy steps.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-600 font-mono">01</div>
              <h3 className="text-sm font-bold text-slate-900">Select Context</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Choose an industry pipeline context framework to assign your specific formatting rule parameters.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-600 font-mono">02</div>
              <h3 className="text-sm font-bold text-slate-900">Stream or Upload</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Toggle onto your vocal terminal workspace to stream raw speech, or drop file assets natively onto the box.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-600 font-mono">03</div>
              <h3 className="text-sm font-bold text-slate-900">AI Structuring</h3>
              <p className="text-xs text-slate-500 leading-relaxed">The processing core maps data blocks into separate Executive Summaries and Extracted Findings.</p>
            </div>
            <div className="flex flex-col gap-3">
              <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center font-bold text-sm text-indigo-600 font-mono">04</div>
              <h3 className="text-sm font-bold text-slate-900">Secure Audit Locked</h3>
              <p className="text-xs text-slate-500 leading-relaxed">Your parsed asset footprint generates an unalterable signature lock inside MongoDB.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full border-t border-slate-100 bg-white py-6 text-center text-xs text-gray-400">
        © 2026 ScribeAll. All rights reserved.
      </footer>
    </div>
  );
}