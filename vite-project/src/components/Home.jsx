import React, { useState, useRef } from 'react';

export default function Home({ onNavigate }) {
  // ⚡ Track the active interactive template view tab
  const [activeTab, setActiveTab] = useState('business');
  
  // 🧭 Reference hooks for internal page anchor navigation
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const templatesRef = useRef(null);
  const pricingRef = useRef(null);

  // 📝 Dynamic Content Matrix matching your exact target presentation layout
  const tabData = {
    business: {
      title: 'Meeting Minutes',
      badge: '💼 Business',
      accentText: 'text-indigo-600',
      accentBg: 'bg-indigo-50 border-indigo-100',
      progressTheme: 'bg-indigo-600',
      glowShadow: 'rgba(79,70,229,0.15)',
      docHeader: 'Executive Summary',
      accuracy: '98% Accuracy',
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

  // Helper smooth scroll handler for navbar links
  const scrollToSection = (elementRef) => {
    if (elementRef && elementRef.current) {
      elementRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfcff] font-sans antialiased text-slate-800 relative overflow-x-hidden flex flex-col">
      
      {/* Decorative Ambient Canvas Lighting */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] z-0 filter blur-[120px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.12) 0%, rgba(255,255,255,0) 70%)' }} />
      <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] z-0 filter blur-[130px] pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, rgba(255,255,255,0) 70%)' }} />

      {/* ========================================== */}
      {/* 1. DYNAMIC NAVIGATION TOP BAR             */}
      {/* ========================================== */}
      <header className="relative z-50 max-w-7xl w-full mx-auto px-6 lg:px-8 py-5 flex items-center justify-between bg-white/60 backdrop-blur-md sticky top-0 border-b border-slate-100">
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm shadow-md shadow-indigo-600/20">S</div>
          <span className="font-extrabold text-slate-900 text-lg tracking-tight">ScribeAll</span>
        </div>

        {/* Working Clickable Navigation Hub */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-bold text-slate-500">
          <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="hover:text-indigo-600 transition duration-150">Home</button>
          <button onClick={() => scrollToSection(featuresRef)} className="hover:text-indigo-600 transition duration-150">Features</button>
          <button onClick={() => scrollToSection(howItWorksRef)} className="hover:text-indigo-600 transition duration-150">How It Works</button>
          <button onClick={() => scrollToSection(templatesRef)} className="hover:text-indigo-600 transition duration-150">Templates</button>
          <button onClick={() => scrollToSection(pricingRef)} className="hover:text-indigo-600 transition duration-150">Pricing</button>
        </nav>

        <div className="flex items-center space-x-4">
          <button onClick={() => onNavigate('login')} className="text-sm font-bold text-slate-600 hover:text-indigo-600 transition px-3 py-2">Login</button>
          <button onClick={() => onNavigate('register')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-4 py-2.5 rounded-xl shadow-md shadow-indigo-600/10 transition duration-150">Get Started</button>
        </div>
      </header>

      {/* ========================================== */}
      {/* 2. CORE LANDING HERO CONTAINER HERO       */}
      {/* ========================================== */}
      <section className="relative z-10 max-w-7xl w-full mx-auto px-6 lg:px-8 pt-12 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
        
        {/* Left Typography Block */}
        <div className="lg:col-span-5 space-y-6 text-left">
          <h1 className="text-4xl sm:text-[54px] font-black text-slate-900 tracking-tight leading-[1.05]">
            Transform Audio <br />Into <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Structured Documents</span>
          </h1>
          <p className="text-sm sm:text-base text-slate-400 font-medium leading-relaxed max-w-md">
            ScribeAll uses AI to convert your audio recordings into industry-specific documents in seconds.
          </p>
          <div className="pt-2 flex items-center space-x-3.5">
            <button onClick={() => onNavigate('register')} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-lg shadow-indigo-600/20 transition duration-150 transform hover:translate-y-[-1px]">
              Get Started Free
            </button>
            <button onClick={() => scrollToSection(howItWorksRef)} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 font-bold text-sm px-5 py-3.5 rounded-xl shadow-sm transition duration-150 flex items-center space-x-2">
              <span className="text-xs text-slate-400">▶</span> <span>Watch Demo</span>
            </button>
          </div>

          {/* Social Proof Badges */}
          <div className="pt-6 flex items-center space-x-3 border-t border-slate-100 w-fit">
            <div className="flex -space-x-2.5">
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=60&q=80" alt="reviewer" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=60&q=80" alt="reviewer" />
              <img className="w-8 h-8 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=60&q=80" alt="reviewer" />
            </div>
            <p className="text-xs font-bold text-slate-400">Loved by 10,000+ business owners globally</p>
          </div>
        </div>

        {/* ========================================== */}
        {/* RIGHT COLUMN: FULLY POPULATED WORKSPACE BOX*/}
        {/* ========================================== */}
        <div className="lg:col-span-7 w-full relative">
          
          {/* Glassmorphic Container Frame with Adaptive Glow Shadowing */}
          <div 
            className="bg-white/90 backdrop-blur-md rounded-[2rem] border border-slate-100 p-6 shadow-2xl transition-all duration-500 text-left"
            style={{ boxShadow: `0 35px 80px -15px ${active.glowShadow}` }}
          >
            
            {/* 🔘 Target Pill Selector Hub Row */}
            <div className="flex flex-wrap gap-2 pb-5 border-b border-slate-100/80">
              {Object.keys(tabData).map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 flex items-center space-x-1.5 ${activeTab === tabKey ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/10 scale-[1.02]' : 'bg-slate-50 hover:bg-slate-100 text-slate-500 border border-slate-100'}`}
                >
                  <span>{tabKey === 'business' ? '💼 Business' : tabKey === 'healthcare' ? '🩺 Healthcare' : tabKey === 'legal' ? '⚖️ Legal' : '🎓 Education'}</span>
                </button>
              ))}
            </div>

            {/* Content Area Grid Layout Split */}
            <div className="pt-5 grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
              
              {/* Box Left Stack (Audio Data & Speaker Profiles) */}
              <div className="md:col-span-5 flex flex-col justify-between gap-4">
                
                {/* Speaker Identity Float Block */}
                <div className="bg-slate-50/60 border border-slate-100 p-3.5 rounded-2xl flex items-center space-x-3 shadow-sm transition-all duration-300">
                  <img src={active.avatar} alt="Speaker" className="w-9 h-9 rounded-full object-cover border border-white ring-2 ring-indigo-600/10" />
                  <div className="min-w-0 flex-1">
                    <h4 className="text-[10px] font-black tracking-wider uppercase text-slate-400 font-mono">Input Speaker</h4>
                    <p className="text-xs font-extrabold text-slate-800 truncate tracking-tight">{active.speaker}</p>
                  </div>
                </div>

                {/* Dark Live Interactive Audio Equalizer Box */}
                <div className="bg-[#0b0f19] border border-slate-900 rounded-2xl p-4 flex flex-col justify-between min-h-[140px] shadow-inner relative overflow-hidden flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono font-bold text-slate-500 tracking-wider uppercase">[Audio_Stream]</span>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                  </div>

                  {/* Pseudo-equalizer animations linked with active tab colors */}
                  <div className="flex items-end justify-center space-x-1.5 h-12 my-3">
                    <div className={`w-1 ${active.progressTheme} h-8 rounded-full animate-[pulse_0.8s_infinite]`}></div>
                    <div className="w-1 bg-purple-500 h-12 rounded-full animate-[pulse_1.2s_infinite]"></div>
                    <div className={`w-1 ${active.progressTheme} h-10 rounded-full animate-[pulse_0.6s_infinite]`}></div>
                    <div className="w-1 bg-slate-700 h-6 rounded-full"></div>
                    <div className={`w-1 ${active.progressTheme} h-11 rounded-full animate-[pulse_1s_infinite]`}></div>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono font-bold text-slate-400 border-t border-slate-900/60 pt-1.5">
                    <span>LIVE SCRIBING</span>
                    <span className={`${active.accentText} transition-colors duration-300 font-bold`}>{active.accuracy}</span>
                  </div>
                </div>
              </div>

              {/* Box Right Stack (Structured Paper Transcript Layout Sheet) */}
              <div className="md:col-span-7 bg-white rounded-2xl border border-slate-100 p-5 shadow-md shadow-slate-100/60 flex flex-col justify-between min-h-[260px] relative transition-all duration-300">
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs">📄</span>
                      <h3 className="text-[11px] font-black text-slate-800 tracking-tight font-mono uppercase">{active.title}</h3>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded uppercase tracking-wider ${active.accentBg} ${active.accentText}`}>Verified</span>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[9px] font-black uppercase text-slate-400 tracking-widest font-mono">{active.docHeader}</h4>
                    <ul className="space-y-2.5">
                      {active.bullets.map((bullet, index) => (
                        <li key={index} className="text-[11px] text-slate-600 leading-relaxed font-semibold flex items-start space-x-2 animate-[fadeIn_0.25s_ease-out]">
                          <span className={`inline-block w-1.5 h-1.5 rounded-full ${active.progressTheme} shrink-0 mt-1.5`}></span>
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-50 flex items-center justify-between text-[9px] font-mono text-slate-400 font-bold tracking-tight">
                  <span>Engine: Whisper-v4-Core</span>
                  <span>ISO Layout Map</span>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 3. ADDITIONAL CONTENT LANDING SECTIONS     */}
      {/* ========================================== */}
      
      {/* Features Anchor Section Block */}
      <section ref={featuresRef} id="features" className="bg-slate-50 border-y border-slate-100 py-16 text-center relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest font-mono">Product Capabilities</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight mt-2">Engineered For Execution Speed</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 text-left">
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
              <div className="text-xl">⚡</div>
              <h3 className="text-sm font-black text-slate-800">Ultra Low Latency</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Transcribe hours of multi-speaker context files safely within minor execution windows loops.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
              <div className="text-xl">🛡️</div>
              <h3 className="text-sm font-black text-slate-800">Enterprise Guardrails</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Full localized database tracking matrices keep core transaction states securely contained.</p>
            </div>
            <div className="bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm space-y-2">
              <div className="text-xl">🎯</div>
              <h3 className="text-sm font-black text-slate-800">Context Automation</h3>
              <p className="text-xs text-slate-400 font-semibold leading-relaxed">Smart mapping recognizes medical vocabularies and corporate targets natively.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section ref={howItWorksRef} id="how-it-works" className="bg-white py-16 text-center relative z-10">
        <div className="max-w-4xl mx-auto px-6 space-y-3">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest font-mono">Operational Framework</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Three Steps To Automation</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8 text-center">
            <div className="space-y-1">
              <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-mono font-bold mx-auto">1</div>
              <h4 className="text-xs font-black text-slate-800 pt-2">Capture Stream</h4>
              <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">Record natively inside workspace dashboard panels securely.</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-mono font-bold mx-auto">2</div>
              <h4 className="text-xs font-black text-slate-800 pt-2">Process Matrix</h4>
              <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">Whisper intelligence analyzes multi-speaker dialect strings.</p>
            </div>
            <div className="space-y-1">
              <div className="w-8 h-8 bg-indigo-50 border border-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-mono font-bold mx-auto">3</div>
              <h4 className="text-xs font-black text-slate-800 pt-2">Deploy Document</h4>
              <p className="text-[11px] text-slate-400 font-semibold max-w-xs mx-auto">Export beautifully organized layout summaries instantly.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Templates Placeholder Target Anchor */}
      <div ref={templatesRef} id="templates" />

      {/* Pricing Operational Matrix Anchor Section */}
      <section ref={pricingRef} id="pricing" className="bg-slate-50 border-t border-slate-100 py-16 text-center relative z-10 flex-1 flex flex-col justify-center">
        <div className="max-w-3xl mx-auto px-6 space-y-2">
          <span className="text-xs font-black text-indigo-600 uppercase tracking-widest font-mono">Subscription Profiles</span>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Predictable Scales, Optimized Value</h2>
          <div className="bg-white border border-slate-200 max-w-sm mx-auto rounded-2xl p-6 shadow-sm mt-8 text-left space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-slate-800 uppercase font-mono">Standard Tier</h4>
              <span className="bg-indigo-50 text-indigo-600 font-mono font-black text-[10px] px-2 py-0.5 rounded">Popular</span>
            </div>
            <div className="text-3xl font-black text-slate-900">$0 <span className="text-xs font-bold text-slate-400 font-sans">/ forever free tier</span></div>
            <p className="text-xs text-slate-400 font-semibold leading-relaxed">Complete unrestricted portal access to whisper model processing arrays for hackathon evaluation cycles.</p>
            <button onClick={() => onNavigate('register')} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-3 rounded-xl shadow-md shadow-indigo-600/15 transition text-center">
              Deploy Free Pipeline Workspace
            </button>
          </div>
        </div>
      </section>

      {/* ========================================== */}
      {/* 4. LOWER HORIZONTAL LOGO TRUST FOOTER      */}
      {/* ========================================== */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-8 border-t border-slate-100 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-400 bg-white">
        <div>Trusted by Professionals Worldwide</div>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 font-black text-[10px] uppercase tracking-wider text-slate-300 font-mono">
          <span className="hover:text-indigo-500 cursor-pointer transition" onClick={() => { setActiveTab('business'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}>💼 Business Core</span>
          <span className="hover:text-emerald-500 cursor-pointer transition" onClick={() => { setActiveTab('healthcare'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}>🏥 Healthcare Matrix</span>
          <span className="hover:text-amber-500 cursor-pointer transition" onClick={() => { setActiveTab('legal'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}>⚖️ Legal Framework</span>
          <span className="hover:text-purple-500 cursor-pointer transition" onClick={() => { setActiveTab('education'); window.scrollTo({ top: 400, behavior: 'smooth' }); }}>🎓 Education Cluster</span>
        </div>
      </footer>

    </div>
  );
}