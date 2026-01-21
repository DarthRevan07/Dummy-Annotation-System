# Contributing to Dummy-Annotation-System

Thank you for your interest in contributing to the Chart Evaluation System!

## Quick Start for Adding Data

### 1. Fork and Clone
```bash
git clone https://github.com/DarthRevan07/Dummy-Annotation-System.git
cd Dummy-Annotation-System
```

### 2. Create Directory Structure
```bash
mkdir -p pairs/your_dataset_name/sum1_ques1/pair1
```

### 3. Add Your Images
Place at least 2 chart images in each pair folder:
- `pairs/your_dataset_name/sum1_ques1/pair1/1.png`
- `pairs/your_dataset_name/sum1_ques1/pair1/2.png`

### 4. Update Configuration (if adding new dataset)
Edit `pair_processor.js`:
```javascript
const tableDirectories = [
    'ATP_rendered_charts', 
    'fifa18_rendered_charts', 
    'Inc500Charts',
    'your_dataset_name'  // Add here
];

const tableStructure = {
    'ATP_rendered_charts': ['sum1_ques3', 'sum3_ques2'],
    'fifa18_rendered_charts': ['sum1_ques1', 'sum1_ques2', 'sum3_ques1', 'sum3_ques2'],
    'Inc500Charts': ['sum1_ques1', 'sum3_ques1', 'sum3_ques2'],
    'your_dataset_name': ['sum1_ques1']  // Add here
};
```

### 5. Commit and Push
```bash
git add pairs/ pair_processor.js
git commit -m "Add dataset: your_dataset_name"
git push origin main
```

## Guidelines

### Image Requirements
- **Format:** PNG, JPG, or JPEG
- **Minimum per pair:** 2 images
- **Naming:** Numeric (1.png, 2.png, etc.)
- **Size:** Keep files reasonably sized (< 5MB per image)

### Directory Naming
- Use underscores for spaces: `my_dataset` not `my dataset`
- Use lowercase for consistency
- Be descriptive: `sales_charts_2024` not `sc2024`

### Commit Messages
- Be descriptive: `Add Q1 2024 sales charts dataset`
- Reference issues if applicable: `Add charts for #123`

## Code Contributions

### Before Submitting
1. Test your changes locally by opening `index.html`
2. Check browser console for errors (F12)
3. Verify images load correctly
4. Ensure navigation works between pairs

### Pull Request Process
1. Create a feature branch: `git checkout -b feature/add-new-dataset`
2. Make your changes
3. Test thoroughly
4. Submit PR with clear description
5. Link to any related issues

## Questions?

- Check the [README.md](README.md) for detailed documentation
- Review existing datasets in `pairs/` for examples
- Open an issue for questions or problems

## Code of Conduct

- Be respectful and constructive
- Help others learn and improve
- Keep discussions focused and on-topic
