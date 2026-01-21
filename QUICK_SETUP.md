# Quick Setup Instructions for Data Collection

## 🎯 Choose Your Backend Solution

### Option 1: Formspree (Fastest - 5 minutes)
1. Go to [formspree.io](https://formspree.io) and create account
2. Create new form, copy form ID (e.g., `xpznvqjz`)
3. In `script_static_updated.js`, find this line:
   ```javascript
   // const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
   ```
4. Uncomment the entire Formspree section and replace `YOUR_FORM_ID`
5. Comment out the temporary line: `return Promise.resolve({ ok: true });`

### Option 2: Google Sheets (15 minutes)
1. Copy contents of `google-apps-script.gs`
2. Go to [script.google.com](https://script.google.com), create new project
3. Replace default code with copied content
4. Replace `YOUR_GOOGLE_SHEET_ID_HERE` with actual Sheet ID
5. Deploy as web app (Execute as "Me", Access "Anyone")
6. Copy deployment URL
7. In `script_static_updated.js`, uncomment Google Script section and add your URL

### Option 3: Airtable (10 minutes)
1. Create Airtable base with fields listed in BACKEND_SETUP_GUIDE.md
2. Get API key and Base ID from airtable.com/api
3. In `script_static_updated.js`, uncomment Airtable section
4. Replace placeholders with your credentials

## 🚀 Deploy Your Evaluation System

### GitHub Pages (Recommended)
1. Push your files to GitHub repository
2. Enable GitHub Pages in repository settings
3. Share the GitHub Pages URL with evaluators

### Netlify
1. Drag & drop your folder to netlify.com/drop
2. Get instant URL for sharing

## 📊 Collecting Responses

Once deployed:
- **Users fill evaluations** → Submit → **Data sent to your backend**
- **You receive notifications** (email for Formspree)
- **Export data** as CSV/JSON for analysis

## 🔍 Data Structure

Each submission contains:
```json
{
  "userId": "user_1640995200_abc123",
  "pairId": "Inc500Charts_sum3_ques2_pair1", 
  "evaluationSummary": {
    "clutter": { "primary_choice": "Chart A", "chart_a_rating": 3, "rationale": "..." },
    "cognitive_load": { "primary_choice": "Chart B", "chart_a_rating": 2, "rationale": "..." },
    "interpretability": { "primary_choice": "Chart A", "chart_a_rating": 1, "rationale": "..." },
    "style": { "primary_choice": "Chart B", "chart_a_rating": 4, "rationale": "..." }
  }
}
```

Perfect for statistical analysis and research!