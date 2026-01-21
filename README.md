# Dummy-Annotation-System

A Chart Evaluation System for evaluating charts across different cognitive constructs including visual clutter, cognitive load, interpretability, and style.

## 📋 Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
- [How to Upload Local Directories](#how-to-upload-local-directories)
  - [Prerequisites](#prerequisites)
  - [Directory Structure](#directory-structure)
  - [Step-by-Step Guide](#step-by-step-guide)
- [Expected Directory Structure](#expected-directory-structure)
- [Adding Your Own Chart Data](#adding-your-own-chart-data)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

This system allows you to:
- Evaluate charts across different cognitive constructs
- Compare chart pairs side-by-side
- Navigate through multiple datasets and evaluation categories
- Annotate and analyze chart effectiveness

## 🚀 Getting Started

1. Clone this repository:
   ```bash
   git clone https://github.com/DarthRevan07/Dummy-Annotation-System.git
   cd Dummy-Annotation-System
   ```

2. Open `index.html` in a web browser to view the evaluation system

## 📤 How to Upload Local Directories

### Prerequisites

Before uploading local directories, ensure you have:
- Git installed on your system ([Download Git](https://git-scm.com/downloads))
- A GitHub account with write access to this repository
- Your local directories organized according to the expected structure (see below)

### Directory Structure

The system expects chart image pairs to be organized in the following structure:

```
pairs/
├── [dataset_name]/
│   └── [summary_question]/
│       └── [pair_folder]/
│           ├── 1.png
│           ├── 2.png
│           └── ... (additional images)
```

**Example:**
```
pairs/
├── ATP_rendered_charts/
│   ├── sum1_ques3/
│   │   ├── pair1/
│   │   │   ├── 1.png
│   │   │   └── 2.png
│   │   └── pair2/
│   │       ├── 1.png
│   │       └── 2.png
│   └── sum3_ques2/
│       └── pair1/
│           ├── 1.png
│           └── 2.png
├── fifa18_rendered_charts/
│   ├── sum1_ques1/
│   ├── sum1_ques2/
│   ├── sum3_ques1/
│   └── sum3_ques2/
└── Inc500Charts/
    ├── sum1_ques1/
    ├── sum3_ques1/
    └── sum3_ques2/
```

### Step-by-Step Guide

#### Method 1: Using Git Command Line

1. **Navigate to your repository directory:**
   ```bash
   cd /path/to/Dummy-Annotation-System
   ```

2. **Create the pairs directory structure (if it doesn't exist):**
   ```bash
   mkdir -p pairs
   ```

3. **Copy your local directories into the repository:**
   ```bash
   # Option A: Copy an entire dataset directory
   cp -r /path/to/your/local/dataset_name pairs/
   
   # Option B: Copy specific subdirectories
   cp -r /path/to/your/local/ATP_rendered_charts pairs/
   ```

4. **Check what files will be added:**
   ```bash
   git status
   ```

5. **Add the new directories to Git:**
   ```bash
   # Add specific directory
   git add pairs/your_dataset_name/
   
   # Or add all changes in pairs folder
   git add pairs/
   ```

6. **Commit your changes:**
   ```bash
   git commit -m "Add new chart dataset: [dataset_name]"
   ```

7. **Push to GitHub:**
   ```bash
   git push origin main
   ```
   (Replace `main` with your branch name if different)

#### Method 2: Using GitHub Desktop

1. Open GitHub Desktop and select this repository
2. Copy your local directories to the `pairs/` folder in the repository
3. GitHub Desktop will automatically detect the new files
4. Review the changes in the "Changes" tab
5. Add a commit message (e.g., "Add new chart dataset")
6. Click "Commit to main"
7. Click "Push origin" to upload to GitHub

#### Method 3: Using GitHub Web Interface (For Small Files)

1. Navigate to your repository on GitHub.com
2. Click on "Add file" > "Upload files"
3. Drag and drop your directories or click "choose your files"
4. Add a commit message
5. Click "Commit changes"

**Note:** This method has file size limitations and is best for smaller datasets.

## 📁 Expected Directory Structure

The system currently supports three main datasets:

1. **ATP_rendered_charts**
   - Summary/Question combinations: `sum1_ques3`, `sum3_ques2`

2. **fifa18_rendered_charts**
   - Summary/Question combinations: `sum1_ques1`, `sum1_ques2`, `sum3_ques1`, `sum3_ques2`

3. **Inc500Charts**
   - Summary/Question combinations: `sum1_ques1`, `sum3_ques1`, `sum3_ques2`

Each combination should contain pair directories (`pair1`, `pair2`, etc.) with at least 2 chart images for comparison.

## 🔧 Adding Your Own Chart Data

To add your own custom dataset:

1. **Create your directory structure:**
   ```bash
   mkdir -p pairs/your_dataset_name/sum1_ques1/pair1
   ```

2. **Add your chart images:**
   - Place at least 2 images in each pair folder
   - Images should be named with numbers (e.g., `1.png`, `2.png`)
   - Supported formats: PNG, JPG, JPEG

3. **Update the code (if adding a new dataset):**
   
   Open `pair_processor.js` and add your dataset to the configuration:
   
   ```javascript
   // In the scanAllPairs() method, add your dataset to the tableDirectories array:
   const tableDirectories = [
       'ATP_rendered_charts', 
       'fifa18_rendered_charts', 
       'Inc500Charts',
       'your_dataset_name'  // Add your dataset here
   ];
   
   // In the getSummaryDirectories() method, add your dataset to the tableStructure object:
   const tableStructure = {
       'ATP_rendered_charts': ['sum1_ques3', 'sum3_ques2'],
       'fifa18_rendered_charts': ['sum1_ques1', 'sum1_ques2', 'sum3_ques1', 'sum3_ques2'],
       'Inc500Charts': ['sum1_ques1', 'sum3_ques1', 'sum3_ques2'],
       'your_dataset_name': ['sum1_ques1']  // Add your summary/question combinations
   };
   ```

4. **Commit and push your changes:**
   ```bash
   git add pairs/ pair_processor.js
   git commit -m "Add custom dataset: your_dataset_name"
   git push origin main
   ```

## 🐛 Troubleshooting

### Common Issues

**Issue: "Permission denied" when pushing to GitHub**
- Solution: Ensure you have write access to the repository and your Git credentials are configured correctly
- Run: `git config --global user.name "Your Name"` and `git config --global user.email "your.email@example.com"`

**Issue: Files not appearing in the web interface**
- Solution: Ensure your directory structure matches the expected format
- Check that image files are in supported formats (PNG, JPG, JPEG)
- Verify that each pair directory contains at least 2 images

**Issue: "Large files" warning from Git**
- Solution: For large image files, consider:
  - Using Git LFS (Large File Storage): `git lfs install` and `git lfs track "*.png"`
  - Compressing images before uploading
  - Splitting large datasets into smaller commits

**Issue: Images not loading in the browser**
- Solution: Check browser console (F12) for errors
- Ensure image paths are correct relative to `index.html`
- Verify the `pairs/` directory is in the same location as `index.html`

**Issue: New dataset not appearing in the system**
- Solution: Make sure you've updated both:
  1. Added the physical directory structure under `pairs/`
  2. Updated the `tableDirectories` and `tableStructure` in `pair_processor.js`

### Getting Help

If you encounter issues not covered here:
1. Check the browser console (F12) for error messages
2. Review the `pair_processor.js` code to understand the expected structure
3. Open an issue on GitHub with details about your problem

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.