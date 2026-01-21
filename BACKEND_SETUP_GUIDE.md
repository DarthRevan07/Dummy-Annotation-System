# Backend Setup Guide for Chart Evaluation System

## 🎯 Overview
This guide provides multiple options to collect user submissions from your hosted evaluation system.

## 📋 What Data is Collected
Each submission includes:
- **User ID**: Unique identifier for each evaluator
- **Session ID**: Unique per browser session
- **Pair Metadata**: Dataset, summary, question info
- **Complete Evaluations**: All 4 categories (Visual Clutter, Cognitive Load, Interpretability, Style)
- **Timestamps**: Start time, completion time, submission time
- **System Info**: Browser details, screen resolution

---

## 🚀 **Option 1: Formspree (Recommended - Easiest)**

**Setup Time**: 5 minutes | **Cost**: Free (500 submissions/month)

1. Go to [formspree.io](https://formspree.io)
2. Create account and new form
3. Copy your form ID (e.g., `xpznvqjz`)
4. In your `script_static_updated.js`, uncomment and update:

```javascript
// Uncomment this section in submitToBackend function:
const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        evaluation_data: JSON.stringify(data),
        user_id: data.userId,
        pair_id: data.pairId,
        submission_time: data.submissionTimestamp
    })
});
```

**Benefits**: 
- ✅ No coding required
- ✅ Email notifications
- ✅ CSV/JSON export
- ✅ Spam protection

---

## 🔥 **Option 2: Google Sheets + Apps Script**

**Setup Time**: 15 minutes | **Cost**: Free

### Step 1: Create Google Sheet and Get Sheet ID

1. Go to [sheets.google.com](https://sheets.google.com)
2. Create a new blank spreadsheet
3. Name it "Chart Evaluation Responses" (or any name you prefer)
4. **Copy the Sheet ID from the URL**:
   - Look at your browser's address bar
   - URL looks like: `https://docs.google.com/spreadsheets/d/1ABC123def456GHI789jkl/edit#gid=0`
   - **The Sheet ID is the long string between `/d/` and `/edit`**
   - In this example: `1ABC123def456GHI789jkl`
   - **Copy this ID - you'll need it in Step 2**

### Step 2: Create Google Apps Script

1. Go to [script.google.com](https://script.google.com)
2. Create new project, replace code with:

```javascript
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Create or get spreadsheet - REPLACE WITH YOUR ACTUAL SHEET ID
    const sheetId = 'YOUR_SHEET_ID'; // Example: '1ABC123def456GHI789jkl'
    const sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
    
    // Add headers if first row
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'User ID', 'Session ID', 'Pair ID', 'Dataset',
        'Clutter Primary', 'Clutter A', 'Clutter B', 'Clutter Rationale',
        'Cognitive Primary', 'Cognitive A', 'Cognitive B', 'Cognitive Rationale',
        'Interpretability Primary', 'Interpretability A', 'Interpretability B', 'Interpretability Rationale',
        'Style Primary', 'Style A', 'Style B', 'Style Rationale',
        'Full JSON Data'
      ]);
    }
    
    // Extract evaluation data
    const eval = data.evaluationSummary;
    
    // Add data row
    sheet.appendRow([
      new Date(),
      data.userId,
      data.sessionId,
      data.pairId,
      data.metadata.dataset,
      eval.clutter.primary_choice,
      eval.clutter.chart_a_rating,
      eval.clutter.chart_b_rating,
      eval.clutter.rationale,
      eval.cognitive_load.primary_choice,
      eval.cognitive_load.chart_a_rating,
      eval.cognitive_load.chart_b_rating,
      eval.cognitive_load.rationale,
      eval.interpretability.primary_choice,
      eval.interpretability.chart_a_rating,
      eval.interpretability.chart_b_rating,
      eval.interpretability.rationale,
      eval.style.primary_choice,
      eval.style.chart_a_rating,
      eval.style.chart_b_rating,
      eval.style.rationale,
      JSON.stringify(data)
    ]);
    
    return ContentService
      .createTextOutput('Success')
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput('Error: ' + error.toString())
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### Step 3: Deploy and Configure

1. **Replace the Sheet ID**: In the code, find `const sheetId = 'YOUR_SHEET_ID';` and replace `YOUR_SHEET_ID` with the ID you copied from Step 1
2. Click "Deploy" > "New Deployment"
3. Type: "Web app"
4. Execute as: "Me"
5. Access: "Anyone"
6. Copy the web app URL

### Step 4: Update Your Code

Uncomment this section in `script_static_updated.js`:

```javascript
const response = await fetch('YOUR_GOOGLE_SCRIPT_URL', {
    method: 'POST',
    mode: 'no-cors',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
});
```

---

## 💾 **Option 3: Airtable Database**

**Setup Time**: 10 minutes | **Cost**: Free (1,200 records/month)

### Step 1: Create Airtable Base

1. Go to [airtable.com](https://airtable.com)
2. Create new base called "Chart Evaluations"
3. Create table with these fields:
   - `User ID` (Single line text)
   - `Pair ID` (Single line text)
   - `Dataset` (Single line text)
   - `Submission Time` (Date)
   - `Evaluation Data` (Long text)
   - `Full Data` (Long text)

### Step 2: Get API Credentials

1. Go to [airtable.com/api](https://airtable.com/api)
2. Select your base
3. Copy Base ID and create API key

### Step 3: Update Your Code

Uncomment this section in `script_static_updated.js`:

```javascript
const response = await fetch('https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE_NAME', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer YOUR_AIRTABLE_API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        records: [{
            fields: {
                'User ID': data.userId,
                'Pair ID': data.pairId,
                'Submission Time': data.submissionTimestamp,
                'Evaluation Data': JSON.stringify(data.evaluationSummary),
                'Full Data': JSON.stringify(data)
            }
        }]
    })
});
```

---

## 🌐 **Option 4: Custom API (Advanced)**

If you have your own server, create an endpoint:

### Node.js/Express Example:

```javascript
app.post('/api/submit-evaluation', (req, res) => {
    const evaluation = req.body;
    
    // Save to database (MongoDB, PostgreSQL, etc.)
    db.collection('evaluations').insertOne(evaluation);
    
    // Or save to file
    fs.appendFileSync('evaluations.json', JSON.stringify(evaluation) + '\n');
    
    res.json({ success: true });
});
```

### PHP Example:

```php
<?php
if ($_POST) {
    $evaluation = json_decode(file_get_contents('php://input'), true);
    
    // Save to file
    file_put_contents('evaluations.json', 
        json_encode($evaluation) . "\n", FILE_APPEND);
    
    echo json_encode(['success' => true]);
}
?>
```

---

## 📊 **Data Analysis**

Once you collect submissions, you can:

1. **Export from Formspree**: CSV/JSON download
2. **Analyze Google Sheets**: Use pivot tables, charts
3. **Query Airtable**: Built-in views and filters
4. **Process JSON files**: Python/R for statistical analysis

### Python Analysis Example:

```python
import json
import pandas as pd

# Load all evaluations
evaluations = []
with open('evaluations.json', 'r') as f:
    for line in f:
        evaluations.append(json.loads(line))

# Convert to DataFrame for analysis
df = pd.json_normalize(evaluations)

# Analyze results
print("Evaluation Summary:")
print(df.groupby('metadata.dataset').size())
print(df['evaluationSummary.clutter.primary_choice'].value_counts())
```

---

## 🔒 **Security & Privacy**

- **No Personal Info**: System only collects evaluation responses
- **Unique IDs**: Anonymous user identification
- **Local Backup**: Data saved locally as fallback
- **HTTPS**: Ensure your hosting uses SSL

## 🚀 **Hosting Options**

- **GitHub Pages**: Free static hosting
- **Netlify**: Free with forms built-in
- **Vercel**: Free with API support
- **Firebase**: Google's hosting platform

Choose the option that best fits your technical comfort level and requirements!

---

## 🌐 **How to Deploy and Share Your Evaluation System**

Once you've set up your backend, you need to host your files online so users can access them.

### **Option 1: GitHub Pages (Recommended - Free & Easy)**

**Step 1: Upload to GitHub**
1. Go to [github.com](https://github.com) and create account (if needed)
2. Create new repository called `chart-evaluation-system`
3. Upload all your files:
   - `index.html`
   - `styles.css` 
   - `script_static_updated.js`
   - `pair_processor.js`
   - `pairs/` folder (with all your image pairs)

**Step 2: Enable GitHub Pages**
1. Go to your repository Settings
2. Scroll to "Pages" section
3. Source: "Deploy from a branch"
4. Branch: "main" or "master"
5. Click "Save"

**Step 3: Get Your URL**
- GitHub will provide a URL like: `https://yourusername.github.io/chart-evaluation-system`
- **This is the link you share with evaluators!**

### **Option 2: Netlify (Drag & Drop)**

1. Go to [netlify.com](https://netlify.com)
2. Drag your entire project folder to the deploy area
3. Get instant URL like: `https://wonderful-name-123456.netlify.app`
4. **Share this URL with evaluators!**

### **Option 3: Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Import from GitHub or upload folder
3. Get URL like: `https://chart-evaluation-system.vercel.app`
4. **Share this URL with evaluators!**

---

## 📧 **How to Share With Evaluators**

### **Create Instructions for Your Users:**

Send them an email like this:

```
Subject: Chart Evaluation Study - Your Participation Needed

Dear [Evaluator Name],

You're invited to participate in a chart evaluation study. This should take about 15-20 minutes.

🔗 **Evaluation Link**: https://yourusername.github.io/chart-evaluation-system

📋 **Instructions:**
1. Click the link above
2. You'll see pairs of charts to evaluate
3. Complete all 4 evaluation categories for each pair:
   - Visual Clutter
   - Cognitive Load  
   - Interpretability
   - Style
4. Click "Submit Complete Evaluation" when done
5. Move to next pair and repeat

⏱️ **Time**: ~3-5 minutes per pair
💾 **Data**: Your responses are automatically saved
🔒 **Privacy**: No personal information is collected

Questions? Reply to this email.

Thank you for your participation!
```

### **For Social Media/Forums:**

```
🔬 Participating in a chart evaluation study! 

Help researchers understand how people perceive data visualizations. Takes ~15 minutes.

Link: https://yourusername.github.io/chart-evaluation-system

Your feedback will contribute to better chart design principles! 📊
```

---

## 📊 **Monitoring Responses**

Depending on your backend choice:

### **Formspree:**
- Check your email for submission notifications
- Login to formspree.io dashboard to see all responses
- Export as CSV for analysis

### **Google Sheets:**
- Open your Google Sheet to see responses in real-time
- Each row = one complete evaluation
- Use built-in charts and pivot tables for analysis

### **Airtable:**
- Login to airtable.com to view responses
- Create different views (by user, by pair, by date)
- Export or use Airtable's analysis tools

---

## 🎯 **Best Practices for User Recruitment**

### **Academic Settings:**
- Email to student mailing lists
- Post in relevant online communities
- Offer course credit or small incentives

### **Professional Networks:**
- LinkedIn posts in relevant groups
- Twitter with relevant hashtags (#datavis #research)
- Slack communities (design, data science)

### **Quality Control:**
- Monitor submission times (too fast = suspicious)
- Check for consistent patterns (all same answers)
- Consider attention check questions

### **Sample Size Planning:**
- Plan for ~20-30% dropout rate
- For statistical significance: aim for 30+ responses per pair
- Consider pilot testing with 5-10 users first