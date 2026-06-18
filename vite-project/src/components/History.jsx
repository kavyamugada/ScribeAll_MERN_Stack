import React, { useState, useEffect } from 'react';

export default function History({ user }) {
  const [historyRecords, setHistoryRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorStatus, setErrorStatus] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const activeUserId = user?.id || user?._id || "60c72b2f9b1d8b2bad123456";
        
        const response = await fetch(`https://scribeall-backend.onrender.com/api/documents/history/${activeUserId}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error('Failed to retrieve your documentation logs.');
        const data = await response.json();
        setHistoryRecords(data);
      } catch (err) {
        console.error(err);
        setErrorStatus(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [user]);

  if (isLoading) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8 bg-[#fbfcff]">
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-xs font-bold text-slate-700">Loading your document archive...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fbfcff] font-sans antialiased text-[#0F172A] w-full p-8 max-w-7xl mx-auto space-y-6">
      <div className="text-left">
        <h1 className="text-xl font-extrabold text-slate-900">History Archive</h1>
        <p className="text-xs text-gray-400 mt-0.5">Access your past recordings, generated summary reports, and cloud files.</p>
      </div>

      {errorStatus && <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 text-xs text-left">⚠️ {errorStatus}</div>}

      {historyRecords.length === 0 ? (
        <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-500 max-w-xl mx-auto space-y-3">
          <div className="text-3xl">📭</div>
          <p className="text-xs font-bold text-slate-800">No documents found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
          {historyRecords.map((record) => (
            <div key={record._id} className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded font-bold">{record.category || 'General'}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{new Date(record.createdAt).toLocaleDateString()}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 truncate" title={record.title}>{record.title}</h3>
                <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed italic bg-slate-50/50 p-2.5 rounded-xl border border-slate-100">"{record.executiveSummary || 'No summary compiled.'}"</p>
              </div>

              <div className="border-t border-slate-50 pt-3 space-y-3">
                {record.audioUrl && (
                  <div className="space-y-1">
                    <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Audio Playback Link</p>
                    <audio src={record.audioUrl} controls className="w-full h-8 rounded bg-slate-100" />
                  </div>
                )}

                <div className="flex items-center justify-between gap-2 pt-1">
                  <button
                    onClick={() => {
                      // Reads the clean URL straight from MongoDB row
                      if (record.pdfUrl) {
                        window.open(record.pdfUrl, '_blank');
                      } else {
                        // 🔥 FIXED: Standardized fallback pattern to match server root naming convention
                        const cleanTitle = record.title
                          .toLowerCase()
                          .replace(/[^a-z0-9]/gi, '_')
                          .replace(/_+/g, '_')
                          .replace(/^_+|_+$/g, '');
                        window.open(`https://ijxboiwtxgohvtyvwium.supabase.co/storage/v1/object/public/scribeall_assets/summary_${cleanTitle}.pdf`, '_blank');
                      }
                    }}
                    className="text-xs bg-slate-900 hover:bg-slate-800 text-white font-bold py-2 px-3 rounded-lg transition cursor-pointer"
                  >
                    📄 View PDF Summary
                  </button>
                  {record.audioUrl && <a href={record.audioUrl} target="_blank" rel="noreferrer" className="text-[11px] text-indigo-600 font-bold hover:underline">Source Track ↗</a>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}