const express = require('express');
const router = express.Router();
const multer = require('multer');
const { createClient } = require('@supabase/supabase-js');
const { AssemblyAI } = require('assemblyai'); 
const Document = require('../models/Document'); // Ensure correct casing matching your schema name

// Initialize Cloud Infrastructure Storage Bucket Client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const upload = multer({ storage: multer.memoryStorage() });

// Initialize the AssemblyAI Engine
const aaiClient = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY });

/* =========================================================================
   🎤 1. AUDIO UPLOAD & REAL-TIME SPEECH TRANSCRIPTION ENDPOINT
   ========================================================================= */
router.post('/upload', upload.single('audioFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No audio resource file provided.' });
    }

    // Process file metadata naming structures
    const fileExtension = req.file.originalname.split('.').pop();
    const cleanBaseName = req.file.originalname.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const uniqueFileName = `audios/${Date.now()}_${cleanBaseName}.${fileExtension}`;

    // Upload audio source stream directly into your Supabase assets container
    const { data: storageData, error: storageError } = await supabase.storage
      .from('scribeall_assets')
      .upload(uniqueFileName, req.file.buffer, {
        contentType: req.file.mimetype,
        upsert: false
      });

    if (storageError) throw storageError;

    // Retrieve public tracking link address location string 
    const { data: { publicUrl } } = supabase.storage
      .from('scribeall_assets')
      .getPublicUrl(uniqueFileName);

    console.log(`🎤 Audio uploaded to Supabase. Transcribing track: ${req.file.originalname}...`);

    // Stream audio buffer track properties straight down to AssemblyAI 
    const transcript = await aaiClient.transcripts.transcribe({
      audio: req.file.buffer
    });

    if (transcript.status === 'error') {
      throw new Error(`Speech-to-Text Error: ${transcript.error}`);
    }

    const realSpokenText = transcript.text || "Audio processing completed, but no explicit spoken speech content was detected.";

    return res.status(200).json({
      success: true,
      message: 'Audio track successfully transcribed in real-time!',
      fullDetails: realSpokenText, 
      audioUrl: publicUrl
    });

  } catch (error) {
    console.error('❌ Cloud Audio Upload & Transcription Pipeline Failure:', error);
    return res.status(500).json({ success: false, message: error.message });
  }
});

/* =========================================================================
   💾 2. METADATA RECORD SAVE ENDPOINT
   ========================================================================= */
router.post('/save', async (req, res) => {
  try {
    const { userId, title, category } = req.body;
    
    if (!userId || !title || !category) {
      return res.status(400).json({ error: "Missing required tracking parameters: userId, title, or category." });
    }

    // Build standardized document entry containing the verified PDF path link URL
    const newDoc = new Document({
      userId: req.body.userId,
      title: req.body.title,
      category: req.body.category,
      executiveSummary: req.body.executiveSummary,
      extractedQuestion: req.body.extractedQuestion,
      extractedAnswer: req.body.extractedAnswer,
      fullDetails: req.body.fullDetails,
      audioUrl: req.body.audioUrl,
      pdfUrl: req.body.pdfUrl // 🔥 STORES DIRECT VERIFIED LINK DIRECTLY TO MONGO CARD LOGS
    });

    const saved = await newDoc.save();
    return res.status(201).json(saved);
  } catch (error) {
    console.error("❌ Save Route Ledger Sync Interruption:", error);
    return res.status(500).json({ error: "Failed to save document to database" });
  }
});

/* =========================================================================
   📜 3. REAL-TIME HISTORY RETRIEVAL ARCHIVE ENDPOINT
   ========================================================================= */
router.get('/history/:userId', async (req, res) => {
  try {
    const records = await Document.find({ userId: req.params.userId }).sort({ createdAt: -1 });
    return res.status(200).json(records);
  } catch (error) {
    console.error("❌ Fetch History Error:", error);
    return res.status(500).json({ error: "Failed to fetch history data collection logs" });
  }
});

module.exports = router;