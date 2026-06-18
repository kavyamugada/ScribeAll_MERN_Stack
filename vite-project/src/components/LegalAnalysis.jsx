import React, { useState } from 'react';

export default function LegalAnalysis({ initialTab = 'cross-exam' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  const [audioTranscript, setAudioTranscript] = useState('');
  const [referenceDocument, setReferenceDocument] = useState('');

  const handleRunAnalysis = (e) => {
    e.preventDefault();
    setLoading(true);
    setAnalysisResult(null);

    // Mock processing timeout
    setTimeout(() => {
      if (activeTab === 'cross-exam') {
        setAnalysisResult({
          summary: "Inconsistencies detected regarding timeline and location parameters.",
          findings: [
            { type: 'Contradiction', transcript: "Witness stated: 'I got there at 9:00 PM.'", reference: "Signed Statement page 4: 'Arrived at 9:45 PM due to gridlock.'", severity: 'High' },
            { type: 'Omission', transcript: "Witness did not mention seeing the secondary vehicle.", reference: "Police Report: Witness explicitly described a red sedan leaving.", severity: 'Medium' }
          ]
        });
      } else {
        setAnalysisResult({
          summary: "Gap tracking completed against Standard Compliance Template.",
          findings: [
            { type: 'Missing Requirement', item: "NDA Verification clause", detail: "The verbal stream contains no authorization acknowledgement.", impact: "Critical Risk" },
            { type: 'Incomplete Section', item: "Budget Cap Discussion", detail: "Mentioned overall cost but failed to specify the maximum threshold.", impact: "Moderate Risk" }
          ]
        });
      }
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-2xl border border-slate-200 text-left shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Advanced AI Intelligence Suite</h2>
        <p className="text-sm text-slate-500">Cross-reference transcripts, track operational gaps, and flag contradictions instantly.</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 mb-6 gap-4">
        <button
          type="button"
          onClick={() => { setActiveTab('cross-exam'); setAnalysisResult(null); }}
          className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'cross-exam' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          ⚖️ 2. Cross-Examination Engine
        </button>
        <button
          type="button"
          onClick={() => { setActiveTab('gap-analysis'); setAnalysisResult(null); }}
          className={`pb-3 text-sm font-bold transition-all border-b-2 ${activeTab === 'gap-analysis' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
        >
          📊 3. Gap Analysis Matrix
        </button>
      </div>

      <div className="grid md:grid-cols-12 gap-6">
        {/* Inputs */}
        <form onSubmit={handleRunAnalysis} className="md:col-span-5 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">Audio Transcript Text</label>
            <textarea
              rows={4}
              value={audioTranscript}
              onChange={(e) => setAudioTranscript(e.target.value)}
              placeholder="Paste processed transcript text here..."
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2">
              {activeTab === 'cross-exam' ? 'Reference Master Document (Prior Statements)' : 'Target Requirements Checklist'}
            </label>
            <textarea
              rows={4}
              value={referenceDocument}
              onChange={(e) => setReferenceDocument(e.target.value)}
              placeholder={activeTab === 'cross-exam' ? "Paste verified depositions or statements..." : "List out items that MUST be present..."}
              className="w-full p-3 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-xl transition text-sm disabled:bg-indigo-400 shadow-md"
          >
            {loading ? 'Analyzing...' : `Execute ${activeTab === 'cross-exam' ? 'Cross-Examination' : 'Gap Scan'}`}
          </button>
        </form>

        {/* Results view */}
        <div className="md:col-span-7 bg-slate-50 rounded-2xl border border-slate-200 p-5 flex flex-col justify-between min-h-[350px]">
          {!analysisResult && !loading && (
            <div className="my-auto text-center py-12">
              <span className="text-3xl">🧠</span>
              <h4 className="text-slate-700 font-bold mt-3 text-sm">Awaiting Analysis</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Fill out the information on the left to display anomalies.</p>
            </div>
          )}

          {loading && (
            <div className="my-auto text-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-xs font-semibold text-slate-500 animate-pulse">Running AI deep compliance checks...</p>
            </div>
          )}

          {analysisResult && (
            <div className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-800">Executive Summary</h4>
                <p className="text-sm text-indigo-950 mt-1">{analysisResult.summary}</p>
              </div>

              <div className="space-y-3">
                {activeTab === 'cross-exam' ? (
                  analysisResult.findings.map((item, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-extrabold px-2 py-0.5 bg-red-100 text-red-700 rounded-md">{item.type}</span>
                        <span className="text-[11px] font-bold text-slate-400">Severity: {item.severity}</span>
                      </div>
                      <p className="text-xs text-slate-600"><strong className="text-slate-800">Transcript:</strong> {item.transcript}</p>
                      <p className="text-xs text-slate-600"><strong className="text-slate-800">Conflict:</strong> {item.reference}</p>
                    </div>
                  ))
                ) : (
                  analysisResult.findings.map((item, index) => (
                    <div key={index} className="bg-white border border-slate-200 p-4 rounded-xl space-y-1">
                      <div className="flex justify-between items-center">
                        <h5 className="text-xs font-bold text-slate-800">{item.item}</h5>
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-amber-100 text-amber-800 rounded">{item.impact}</span>
                      </div>
                      <p className="text-xs text-slate-500">{item.detail}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          <div className="text-[10px] text-slate-400 font-mono border-t border-slate-200 pt-3 mt-4 text-right">
            ScribeAll Context Matrix Engine v4
          </div>
        </div>
      </div>
    </div>
  );
}