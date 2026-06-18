const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({
  userId: { 
    type: String, 
    required: true 
  },
  title: { 
    type: String, 
    required: true 
  },
  category: { 
    type: String, 
    default: 'Business' 
  },
  executiveSummary: { 
    type: String
  },
  extractedQuestion: { 
    type: String 
  },
  extractedAnswer: { 
    type: String 
  },
  fullDetails: { 
    type: String, 
    required: true 
  },
  audioUrl: {
    type: String,
    default: "" 
  },
  // Saved directly out of the server's public return payload
  pdfUrl: {
    type: String,
    default: ""
  },
  date: { 
    type: String, 
    default: () => new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) 
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Document', DocumentSchema);