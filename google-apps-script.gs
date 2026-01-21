// Example Google Apps Script for collecting chart evaluation submissions
// Deploy this as a web app in Google Apps Script

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Configuration - Replace with your Google Sheet ID
    const SHEET_ID = 'YOUR_GOOGLE_SHEET_ID_HERE';
    
    // Open the spreadsheet
    let spreadsheet;
    try {
      spreadsheet = SpreadsheetApp.openById(SHEET_ID);
    } catch (error) {
      // If sheet doesn't exist, create it
      spreadsheet = SpreadsheetApp.create('Chart Evaluation Responses');
      console.log('Created new spreadsheet:', spreadsheet.getId());
    }
    
    const sheet = spreadsheet.getActiveSheet();
    
    // Create headers if this is the first entry
    if (sheet.getLastRow() === 0) {
      const headers = [
        'Timestamp',
        'User ID',
        'Session ID', 
        'Pair ID',
        'Dataset',
        'Summary',
        'Question',
        'Started At',
        'Completed At',
        'Submission Time',
        
        // Visual Clutter
        'Clutter Primary Choice',
        'Clutter Chart A Rating',
        'Clutter Chart B Rating',
        'Clutter Rationale',
        'Clutter Completed At',
        
        // Cognitive Load
        'Cognitive Primary Choice',
        'Cognitive Chart A Rating', 
        'Cognitive Chart B Rating',
        'Cognitive Rationale',
        'Cognitive Completed At',
        
        // Interpretability
        'Interpretability Primary Choice',
        'Interpretability Chart A Rating',
        'Interpretability Chart B Rating',
        'Interpretability Rationale',
        'Interpretability Completed At',
        
        // Style
        'Style Primary Choice',
        'Style Chart A Rating',
        'Style Chart B Rating',
        'Style Rationale',
        'Style Completed At',
        
        // System Info
        'User Agent',
        'Screen Resolution',
        
        // Full JSON (for backup/analysis)
        'Full JSON Data'
      ];
      
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      
      // Format headers
      const headerRange = sheet.getRange(1, 1, 1, headers.length);
      headerRange.setFontWeight('bold');
      headerRange.setBackground('#4285F4');
      headerRange.setFontColor('white');
    }
    
    // Extract data from submission
    const eval = data.evaluationSummary || {};
    const metadata = data.metadata || {};
    
    // Prepare row data
    const rowData = [
      new Date(), // Current timestamp
      data.userId || '',
      data.sessionId || '',
      data.pairId || '',
      metadata.dataset || '',
      metadata.summary || '',
      metadata.question || '',
      data.startedAt || '',
      data.completedAt || '',
      data.submissionTimestamp || '',
      
      // Visual Clutter
      (eval.clutter && eval.clutter.primary_choice) || '',
      (eval.clutter && eval.clutter.chart_a_rating) || '',
      (eval.clutter && eval.clutter.chart_b_rating) || '',
      (eval.clutter && eval.clutter.rationale) || '',
      (eval.clutter && eval.clutter.completed_at) || '',
      
      // Cognitive Load
      (eval.cognitive_load && eval.cognitive_load.primary_choice) || '',
      (eval.cognitive_load && eval.cognitive_load.chart_a_rating) || '',
      (eval.cognitive_load && eval.cognitive_load.chart_b_rating) || '',
      (eval.cognitive_load && eval.cognitive_load.rationale) || '',
      (eval.cognitive_load && eval.cognitive_load.completed_at) || '',
      
      // Interpretability
      (eval.interpretability && eval.interpretability.primary_choice) || '',
      (eval.interpretability && eval.interpretability.chart_a_rating) || '',
      (eval.interpretability && eval.interpretability.chart_b_rating) || '',
      (eval.interpretability && eval.interpretability.rationale) || '',
      (eval.interpretability && eval.interpretability.completed_at) || '',
      
      // Style
      (eval.style && eval.style.primary_choice) || '',
      (eval.style && eval.style.chart_a_rating) || '',
      (eval.style && eval.style.chart_b_rating) || '',
      (eval.style && eval.style.rationale) || '',
      (eval.style && eval.style.completed_at) || '',
      
      // System Info
      data.userAgent || '',
      data.screenResolution || '',
      
      // Full JSON data for backup/detailed analysis
      JSON.stringify(data)
    ];
    
    // Add the row to the sheet
    sheet.appendRow(rowData);
    
    // Auto-resize columns for better readability
    sheet.autoResizeColumns(1, rowData.length);
    
    // Log success
    console.log('Successfully saved evaluation:', data.pairId);
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Evaluation saved successfully',
        pairId: data.pairId,
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    console.error('Error processing submission:', error);
    
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString(),
        timestamp: new Date().toISOString()
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: Test function to verify the script works
function testSubmission() {
  const testData = {
    userId: 'test_user_123',
    sessionId: 'test_session_456',
    pairId: 'Inc500Charts_sum3_ques2_pair1',
    metadata: {
      dataset: 'Inc5000 Company List 2014',
      summary: 'sum3',
      question: 'ques2'
    },
    startedAt: '2024-01-01T10:00:00.000Z',
    completedAt: '2024-01-01T10:15:00.000Z',
    submissionTimestamp: '2024-01-01T10:15:30.000Z',
    evaluationSummary: {
      clutter: {
        primary_choice: 'Chart A looks more cluttered',
        chart_a_rating: 3,
        chart_b_rating: 1,
        rationale: 'Chart A has more visual elements',
        completed_at: '2024-01-01T10:05:00.000Z'
      }
    },
    userAgent: 'Mozilla/5.0 (Test Browser)',
    screenResolution: '1920x1080'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  console.log('Test result:', result.getContent());
}