import React, { useState } from 'react';

export default function NewDocument({ user, onNavigate }) {
  const [file, setFile] = useState(null);
  const [category, setCategory] = useState('Education');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorStatus, setErrorStatus] = useState(null);

  const categories = [
    { name: 'Business', label: 'Business', desc: 'Meeting Minutes, Reports, Action Items' },
    { name: 'Education', label: 'Education', desc: 'Study Guides, Lecture Notes' },
    { name: 'Medical', label: 'Medical', desc: 'SOAP Notes, Patient Reports' },
    { name: 'Legal', label: 'Legal', desc: 'Legal Briefs, Case Summaries' },
    { name: 'Custom', label: 'Custom', desc: 'Create custom template' }
  ];

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
      setErrorStatus(null);
    }
  };

  const handleGenerate = async () => {
    if (!file) {
      setErrorStatus('Please select an audio resource file to upload.');
      return;
    }

    setIsProcessing(true);
    setErrorStatus(null);

    const formData = new FormData();
    formData.append('audioFile', file);

    try {
      // Step 1: Ingest audio and wait for AssemblyAI transcript text
      const uploadResponse = await fetch('https://scribeall-backend.onrender.com/api/documents/upload', {
        method: 'POST',
        body: formData,
      });
      const uploadData = await uploadResponse.json();
      if (!uploadResponse.ok || !uploadData.success) {
        throw new Error(uploadData.message || 'Audio upload engine error.');
      }

      // Step 2: Request structured text formatting from AI template architect
      const aiResponse = await fetch('https://scribeall-backend.onrender.com/api/generate-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: uploadData.fullDetails, 
          pipelineContext: category 
        })
      });
      
      if (!aiResponse.ok) {
        const errorData = await aiResponse.json();
        throw new Error(errorData.message || 'AI summary mapping analysis pipeline failure.');
      }
      const aiData = await aiResponse.json();

      // Step 3: Run PDF compilation on backend, send email, and trigger database storage
      const pdfResponse = await fetch('https://scribeall-backend.onrender.com/api/documents/email-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user?.email || "mugadakatyayani@gmail.com",
          name: user?.name || "monika",
          queryTitle: aiData.queryTitle,
          executiveSummary: aiData.executiveSummary,
          extractedQuestion: uploadData.fullDetails,
          extractedAnswer: aiData.extractedAnswer,
          nextSteps: aiData.nextSteps,
          userId: user?.id || user?._id || "60c72b2f9b1d8b2bad123456", // Forwarded for database save
          audioUrl: uploadData.audioUrl || "",                         // Forwarded for database save
          pipelineContext: category                                    // Forwarded for database save
        })
      });
      
      const pdfData = await pdfResponse.json();
      if (!pdfResponse.ok || !pdfData.success) {
        throw new Error('PDF compilation pipeline crashed.');
      }

      // Step 4: Everything succeeded! Open the PDF document in a new tab
      if (pdfData.pdfUrl) {
        window.open(pdfData.pdfUrl, '_blank');
      }

      // Step 5: Redirect to the History Archive screen view panel
      if (onNavigate) {
        onNavigate('history'); 
      }

    } catch (err) {
      console.error("❌ Pipeline Error:", err);
      setErrorStatus(err.message || 'Operational interruption running pipeline.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fbfcff] font-sans antialiased text-[#0F172A] w-full p-8 max-w-7xl mx-auto space-y-6">
      <div className="text-left">
        <h1 className="text-xl font-extrabold text-slate-900">Workspace Portal</h1>
        <p className="text-xs text-gray-400 mt-0.5">Generate analytical structures dynamically utilizing speech processing models.</p>
      </div>

      {errorStatus && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs text-left">
          ⚠️ {errorStatus}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Interactive Ingestion Grid Panel Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="border-2 border-dashed border-slate-200 hover:border-indigo-400 bg-white rounded-2xl p-12 transition text-center space-y-4 relative">
            <input 
              type="file" 
              accept="audio/*" 
              onChange={handleFileChange} 
              disabled={isProcessing}
              className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" 
            />
            <div className="text-4xl">📁</div>
            <div>
              <p className="text-xs font-bold text-slate-800">
                {file ? `Attached: ${file.name}` : 'Click to look up audio file entries'}
              </p>
              <p className="text-[10px] text-slate-400 mt-1">Accepts MP3, WAV, M4A sound feeds</p>
            </div>
          </div>
        </div>

        {/* Right Configuration Management Framework Area */}
        <div className="bg-[#090D16] border border-slate-800 rounded-2xl p-6 text-white text-left h-fit space-y-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Select Industry Template</h3>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label 
                key={cat.name} 
                className={`flex items-start justify-between p-3.5 rounded-xl border transition cursor-pointer ${
                  category === cat.name ? 'bg-indigo-600/10 border-indigo-500' : 'bg-slate-900/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-start space-x-3 w-full">
                  <input 
                    type="radio" 
                    name="category-group" 
                    checked={category === cat.name} 
                    onChange={() => setCategory(cat.name)} 
                    disabled={isProcessing} 
                    className="mt-0.5 accent-indigo-500" 
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-200">{cat.label}</p>
                    <p className="text-[10px] text-slate-500 mt-0.5 leading-normal">{cat.desc}</p>
                  </div>
                </div>
              </label>
            ))}
          </div>
          
          <button 
            onClick={handleGenerate} 
            disabled={isProcessing} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-800 disabled:text-slate-500 text-white font-bold py-3 rounded-xl transition text-xs shadow-lg shadow-indigo-600/10 cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center space-x-2">
                <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Processing Components...</span>
              </div>
            ) : (
              'Generate Document'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}