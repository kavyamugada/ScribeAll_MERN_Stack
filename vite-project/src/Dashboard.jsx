import React, { useState, useEffect, useRef } from 'react';

export default function Dashboard({ onNavigate, user, onLogout }) {
  const [activeIndustry, setActiveIndustry] = useState('education');
  const [isRecording, setIsRecording] = useState(false);
  const [liveTranscript, setLiveTranscript] = useState('');
  const [documentTitle, setDocumentTitle] = useState('');
  const [documentHistory, setDocumentHistory] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedDocument, setProcessedDocument] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const recognitionRef = useRef(null);
  const recordingStateRef = useRef(false);

  // Clears active screen upon new login to prevent seeing old data
  useEffect(() => {
    if (user && (user.id || user._id)) {
      const activeUserId = user.id || user._id;
      fetch(`http://localhost:5000/api/documents/history/${activeUserId}`)
        .then((res) => res.ok ? res.json() : [])
        .then((data) => {
          setDocumentHistory(data);
          setProcessedDocument(null); 
        })
        .catch((err) => console.error("Database history loading error:", err));
    }
  }, [user]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event) => {
        if (!recordingStateRef.current) return;
        let txt = '';
        for (let i = 0; i < event.results.length; ++i) { 
          txt += event.results[i][0].transcript + ' '; 
        }
        setLiveTranscript(txt.trim());
      };

      rec.onerror = (event) => { console.error(event.error); };
      rec.onend = () => { 
        if (recordingStateRef.current) {
          try { rec.start(); } catch(e) {}
        }
      };
      recognitionRef.current = rec;
    }
  }, []);

  const handleStartRecording = () => {
    recordingStateRef.current = true;
    setLiveTranscript('');
    setProcessedDocument(null);
    setIsRecording(true);
    if (recognitionRef.current) {
      try { recognitionRef.current.start(); } catch (err) {}
    }
  };

  const handleStopAndProcess = async () => {
    recordingStateRef.current = false;
    setIsRecording(false);
    if (recognitionRef.current) recognitionRef.current.stop();

    const finalEntireSpeech = liveTranscript.trim();
    if (!finalEntireSpeech) return alert("No voice input captured.");

    setIsProcessing(true);
    const titles = { education: '🎓 Academic Report', business: '💼 Business Sheet', medical: '🩺 Clinical Record', legal: '⚖️ Legal Brief' };
    const categories = { education: 'Education', business: 'Business', medical: 'Medical', legal: 'Legal' };
    const finalSavedTitle = documentTitle.trim() || titles[activeIndustry] || 'Structured Analytics Document';

    try {
      // Passes user context parameters along to trigger Summary Email 1 automatically
      const aiResponse = await fetch('http://localhost:5000/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: finalEntireSpeech, 
          pipelineContext: activeIndustry,
          userEmail: user?.email,
          userName: user?.name
        })
      });
      
      const aiStructuredData = await aiResponse.json();

      const dbPayload = {
        userId: user?.id || user?._id,
        title: aiStructuredData.queryTitle || finalSavedTitle,
        category: categories[activeIndustry] || 'Business',
        executiveSummary: aiStructuredData.executiveSummary,
        extractedQuestion: finalEntireSpeech,               
        extractedAnswer: aiStructuredData.extractedAnswer, 
        nextSteps: aiStructuredData.nextSteps, 
        fullDetails: finalEntireSpeech,
        audioUrl: ""
      };

      const response = await fetch('http://localhost:5000/api/documents/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbPayload)
      });
      
      const savedDoc = await response.json();
      setProcessedDocument(savedDoc);
      setDocumentHistory(prev => [savedDoc, ...prev]);
      setDocumentTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!processedDocument) return;
    try {
      const response = await fetch('http://localhost:5000/api/documents/email-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email,
          name: user?.name || "User",
          queryTitle: processedDocument.title,
          executiveSummary: processedDocument.executiveSummary,
          extractedQuestion: processedDocument.extractedQuestion,
          extractedAnswer: processedDocument.extractedAnswer,
          nextSteps: processedDocument.nextSteps
        })
      });

      const blobFile = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blobFile);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = `${processedDocument.title.replace(/[^a-z0-9]/gi, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      
      alert("🎉 Download completed successfully! Verification email dispatched.");
      
      // Clear visual fields immediately after download completes
      setProcessedDocument(null);
      setLiveTranscript('');
      setDocumentTitle('');
      setIsEditing(false);

    } catch (err) {
      alert("Error compiling configuration PDF layers.");
    }
  };

  const handleUpdateField = (key, val) => {
    setProcessedDocument(prev => ({ ...prev, [key]: val }));
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 flex flex-col">
      <header className="bg-white border-b border-slate-200/80 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onNavigate('landing')}>
          <div className="w-7 h-7 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-sm">S</div>
          <span className="font-black text-slate-900 tracking-tight text-base">ScribeAll Terminal</span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-xs font-semibold">Workspace Profile: <strong className="text-indigo-600">{user?.name || user?.email}</strong></span>
          <button onClick={onLogout} className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-3 py-1.5 rounded-lg transition">Logout</button>
        </div>
      </header>

      <div className="max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
        
        {/* Left Side Column */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm text-left space-y-2.5">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">1. Choose Pipeline Context</h3>
            <div className="grid grid-cols-2 gap-2">
              {[ ['education', '🎓 Higher Ed'], ['business', '💼 Business Ops'], ['medical', '🩺 Medical Chart'], ['legal', '⚖️ Legal Brief'] ].map(([id, label]) => (
                <button key={id} onClick={() => setActiveIndustry(id)} className={`px-3 py-2 rounded-xl text-xs font-bold text-left transition ${activeIndustry === id ? 'bg-indigo-600 text-white shadow-md' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}>{label}</button>
              ))}
            </div>
          </div>

          <div className="bg-[#0b1329] text-white rounded-2xl p-5 shadow-xl flex flex-col justify-between min-h-[260px] text-left">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <span className="text-[10px] font-mono text-slate-500 font-bold">[Vocal_Mic_Terminal]</span>
              {isRecording && <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded text-[9px] font-bold animate-pulse">STREAMING LIVE</span>}
            </div>
            <div className="mt-3">
              <label className="text-[9px] font-mono font-bold text-slate-400 uppercase block mb-1">2. Custom Session Label</label>
              <input type="text" placeholder="Name this session..." value={documentTitle} disabled={isRecording} onChange={(e) => setDocumentTitle(e.target.value)} className="w-full text-xs p-2.5 rounded-xl bg-slate-950/80 text-slate-200 focus:outline-none focus:border-indigo-500" />
            </div>
            <div className="bg-slate-950/60 rounded-xl p-3 min-h-[70px] text-[11px] font-mono text-indigo-300 overflow-y-auto my-2">{liveTranscript || <span className="text-slate-600 italic font-sans text-xs">Run microphone voice stream processes here...</span>}</div>
            <button onClick={isRecording ? handleStopAndProcess : handleStartRecording} className={`w-full text-white font-bold text-xs py-3 rounded-xl transition ${isRecording ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}>{isRecording ? '⏹️ Stop & Process Stream' : '🔴 Record Live Voice Audio'}</button>
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm text-left flex-1 flex flex-col min-h-[180px]">
            <div className="border-b border-slate-100 pb-2 mb-2"><h3 className="text-xs font-black uppercase tracking-wider text-slate-500 font-mono">🗄️ History Archives</h3></div>
            <div className="space-y-2 overflow-y-auto max-h-[200px] flex-1">
              {documentHistory.length === 0 ? <div className="text-xs text-slate-400 italic text-center pt-8">No historical data logs matching profile.</div> : documentHistory.map((item) => (
                <div key={item._id || item.id} onClick={() => { setProcessedDocument(item); setIsEditing(false); }} className={`p-2.5 rounded-xl border cursor-pointer transition ${processedDocument?._id === item._id ? 'bg-indigo-50/70 border-indigo-200' : 'bg-slate-50/50 border-slate-100 hover:bg-slate-50'}`}>
                  <h4 className="text-xs font-bold text-slate-800 truncate">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">{item.extractedQuestion}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Main Column Workspace View */}
        <div className="lg:col-span-8 bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm text-left flex-1 flex flex-col justify-between min-h-[550px]">
          {isProcessing ? (
            <div className="my-auto flex flex-col items-center justify-center py-24 text-slate-400"><div className="w-6 h-6 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-2"></div><p className="text-[11px] font-bold font-mono uppercase tracking-wider">Compiling AI Documentation Matrix...</p></div>
          ) : processedDocument ? (
            <div className="space-y-4 flex-1 flex flex-col justify-between">
              
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-md uppercase font-mono tracking-wider">{processedDocument.category}</span>
                  <h2 className="text-base font-black text-slate-900 mt-1.5">{processedDocument.title}</h2>
                </div>
                <button onClick={() => setIsEditing(!isEditing)} className="text-xs px-3 py-1.5 rounded-xl border font-bold bg-slate-50 hover:bg-slate-100 transition">{isEditing ? '🔒 Lock' : '📝 Edit Doc'}</button>
              </div>

              <div className="space-y-4 overflow-y-auto flex-1 max-h-[420px] pr-1">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase block tracking-wider">Executive Abstract</label>
                  {isEditing ? (
                    <textarea className="w-full text-xs p-2.5 border border-amber-300 rounded-xl focus:outline-none" rows="2" value={processedDocument.executiveSummary || ''} onChange={(e) => handleUpdateField('executiveSummary', e.target.value)}/>
                  ) : (
                    <p className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border font-medium leading-relaxed">{processedDocument.executiveSummary}</p>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase block tracking-wider">Original Audio Input Prompt</label>
                  {isEditing ? (
                    <textarea className="w-full text-xs p-2.5 border border-amber-300 rounded-xl focus:outline-none font-mono text-emerald-700" rows="3" value={processedDocument.extractedQuestion || ''} onChange={(e) => handleUpdateField('extractedQuestion', e.target.value)}/>
                  ) : (
                    <div className="bg-slate-950 text-emerald-400 font-mono text-xs p-3.5 rounded-xl border border-slate-900 whitespace-pre-line leading-relaxed shadow-inner">
                      {processedDocument.extractedQuestion}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase block tracking-wider">Generated Documentation Theory & Analysis</label>
                  {isEditing ? (
                    <textarea className="w-full text-xs p-2.5 border border-amber-300 rounded-xl focus:outline-none" rows="6" value={processedDocument.extractedAnswer || ''} onChange={(e) => handleUpdateField('extractedAnswer', e.target.value)}/>
                  ) : (
                    <div className="bg-indigo-50/40 border border-indigo-100/60 rounded-xl p-4 text-xs font-medium text-slate-700 leading-relaxed whitespace-pre-line text-justify shadow-sm">
                      {processedDocument.extractedAnswer}
                    </div>
                  )}
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono font-black text-slate-400 uppercase block tracking-wider">🚀 Proactive Next Steps & Recommendations</label>
                  {isEditing ? (
                    <textarea className="w-full text-xs p-2.5 border border-amber-300 rounded-xl focus:outline-none font-sans" rows="3" value={processedDocument.nextSteps || ''} onChange={(e) => handleUpdateField('nextSteps', e.target.value)}/>
                  ) : (
                    <div className="bg-amber-50/50 border border-amber-200/60 rounded-xl p-4 text-xs font-semibold text-amber-900 leading-relaxed whitespace-pre-line shadow-sm">
                      {processedDocument.nextSteps}
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-400 font-medium">Auto-compiled via Gemini-2.5 Framework</span>
                <button onClick={handleDownloadPDF} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm transition">📥 Download PDF Document</button>
              </div>

            </div>
          ) : (
            <div className="my-auto flex flex-col items-center justify-center text-slate-300 py-24"><span className="text-4xl mb-2">📄</span><p className="text-xs font-bold font-mono uppercase text-slate-400 tracking-wider">Awaiting live audio capture stream context...</p></div>
          )}
        </div>

      </div>
    </div>
  );
}