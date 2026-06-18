import axios from 'axios';

/**
 * Communicates with the backend server to build and download a formatted PDF analysis document.
 * Handles both freshly generated views and historical records cleanly.
 * @param {Object} documentData - The document payload fields from your React components
 */
export const downloadPDFSummary = async (documentData) => {
  try {
    if (!documentData) {
      console.error("No valid document data properties passed to exporter.");
      return false;
    }

    // Safely gather data targets regardless of dashboard array naming structures
    const payload = {
      title: documentData.title || 'Structured Note Summary',
      category: documentData.category || 'Business',
      executiveSummary: documentData.executiveSummary || '',
      extractedQuestion: documentData.extractedQuestion || '',
      extractedAnswer: documentData.extractedAnswer || '',
      // Maps both variations so the backend never registers an empty layout matrix
      text: documentData.fullDetails || documentData.text || '',
      fullDetails: documentData.fullDetails || documentData.text || ''
    };

    console.log("Triggering backend PDF compilation with data tracking:", payload.title);

    // Make an optimized post request specifying binary array buffers
    const response = await axios.post('http://localhost:5000/api/audio/download-pdf', payload, {
      responseType: 'blob', // Critical for handling binary stream transfers cleanly
      headers: {
        'Content-Type': 'application/json'
      }
    });

    // Create a localized browser storage link element context
    const blobFile = new Blob([response.data], { type: 'application/pdf' });
    const downloadUrl = window.URL.createObjectURL(blobFile);
    const hiddenAnchorElement = document.createElement('a');
    
    // Assign structural downloading configurations
    hiddenAnchorElement.href = downloadUrl;
    hiddenAnchorElement.download = `${payload.title.replace(/[^a-z0-9]/gi, '_')}_Analysis.pdf`;
    
    // Append to virtual document map, click, and garbage collect immediately
    document.body.appendChild(hiddenAnchorElement);
    hiddenAnchorElement.click();
    document.body.removeChild(hiddenAnchorElement);
    window.URL.revokeObjectURL(downloadUrl);

    return true;
  } catch (error) {
    console.error("Front-end PDF download interaction failed completely:", error);
    alert("Could not process PDF generation right now. Please verify your backend server connection channels.");
    return false;
  }
};