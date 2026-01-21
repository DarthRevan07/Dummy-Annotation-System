# Testing the Evaluation System (Local Mode)

## 🧪 How to Test Without Backend Setup

The system now works in **Local Mode** when the backend isn't configured yet. Here's how to test it:

### ✅ What Works in Local Mode:
1. **Complete Chart Evaluations**: All 4 categories work fully
2. **Local Data Storage**: Responses saved to browser localStorage  
3. **Progress Tracking**: Visual indicators show completion status
4. **Navigation**: Switch between pairs and categories
5. **Data Persistence**: Reload page and data remains

### 📝 Testing Steps:
1. **Start Evaluation**: Go to evaluation page with any dataset
2. **Complete Categories**: Fill out all 4 categories for a chart pair:
   - Visual Clutter Evaluation 
   - Cognitive Load Evaluation
   - Interpretability Evaluation  
   - Style Evaluation
3. **See Local Completion**: Yellow notification appears: "💾 Pair evaluation saved locally!"
4. **Check Progress**: Status shows "✅ Complete! Saved locally."
5. **Continue**: Move to next pair and repeat

### 🔍 Viewing Your Test Data:
Open browser developer tools (F12) → Console → Run:
```javascript
JSON.stringify(localStorage.getItem('pairEvaluations'), null, 2)
```
This shows all your saved evaluation data.

### 🚀 Ready for Real Data Collection?
When ready to collect real responses:
1. Follow `BACKEND_SETUP_GUIDE.md` to set up Google Apps Script
2. Replace the placeholder URL in `script_static_updated.js`
3. System automatically switches to **Backend Mode**
4. All completions auto-submit to your Google Sheets

### 📊 Local vs Backend Mode Differences:

| Feature | Local Mode | Backend Mode |
|---------|------------|--------------|
| Data Storage | Browser localStorage | Google Sheets |
| Persistence | Per browser/device | Centralized |
| Notifications | "Saved locally!" | "Submitted to backend!" |
| Access | Only you can see | You control access |
| Setup Required | None | Google Apps Script |

The system is fully functional for testing and development in Local Mode!