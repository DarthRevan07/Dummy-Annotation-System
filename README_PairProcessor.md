# Pair Directory Processor System

A comprehensive system for systematically processing and navigating image pairs from the `pairs` directory structure. This system provides both UI and programmatic interfaces for working with chart evaluation image pairs.

## 🚀 Features

- **Systematic Pair Discovery**: Automatically scans all table directories and their subdirectories for image pairs
- **Interactive Navigation**: Navigate through pairs with previous/next controls
- **Advanced Filtering**: Filter pairs by dataset, summary, or question
- **Batch Processing**: Process all pairs programmatically with validation and reporting
- **Statistics & Analytics**: Comprehensive statistics about pairs and images
- **Export Capabilities**: Export data as JSON and generate HTML reports
- **Image Validation**: Validate image loading and collect metadata
- **Performance Metrics**: Track processing times and performance statistics
- **Responsive UI**: Mobile-friendly interface with modal image viewing

## 📁 Directory Structure

The system works with this directory structure:
```
pairs/
├── ATP_rendered_charts/
│   ├── sum1_ques3/
│   └── sum3_ques2/
├── fifa18_rendered_charts/
│   ├── sum1_ques1/
│   ├── sum1_ques2/
│   ├── sum3_ques1/
│   └── sum3_ques2/
└── Inc500Charts/
    ├── sum1_ques1/
    ├── sum3_ques1/
    └── sum3_ques2/
        ├── pair1/
        │   ├── 1.png
        │   └── 2.png
        └── pair2/
```

## 🔧 Files Overview

### Core System Files

1. **`pair_processor.js`** - Main pair processing class and logic
2. **`pair_processor_demo.js`** - Demo scripts and usage examples
3. **`pair_batch_processor.js`** - Batch processing and reporting utilities
4. **`index.html`** - Updated with pair processor UI integration
5. **`styles.css`** - Updated with pair processor styling

### Key Classes

- **`PairProcessor`** - Main class for pair discovery and navigation
- **`PairProcessorDemo`** - Demo and testing utilities
- **`PairBatchProcessor`** - Batch processing and validation

## 🎯 Usage Guide

### 1. Basic UI Usage

1. Open `index.html` in your browser
2. Click the "Pair Processor" tab in the navigation
3. The system will automatically initialize and scan for pairs
4. Use the navigation controls to browse through pairs
5. Apply filters to find specific datasets or summaries
6. Click images to view them in full-screen modal

### 2. Programmatic Usage

#### Initialize the Processor
```javascript
const processor = new PairProcessor();
await processor.initialize();
```

#### Navigate Through Pairs
```javascript
// Get current pair
const currentPair = processor.getCurrentPair();

// Navigate
const nextPair = processor.nextPair();
const prevPair = processor.previousPair();

// Jump to specific pair
const specificPair = processor.jumpToPair(5);
```

#### Search and Filter
```javascript
// Search by criteria
const inc500Pairs = processor.searchPairs({ dataset: 'Inc500Charts' });
const sum3Pairs = processor.searchPairs({ summary: 'sum3' });

// Get all pairs summary
const summary = processor.getAllPairsSummary();
```

#### Get Statistics
```javascript
const stats = processor.getStatistics();
console.log(`Total pairs: ${stats.totalPairs}`);
console.log(`Total images: ${stats.totalImages}`);
console.log(`Dataset breakdown:`, stats.datasetBreakdown);
```

### 3. Batch Processing

#### Run Batch Processing
```javascript
const batchProcessor = new PairBatchProcessor(processor);
const results = await batchProcessor.processAllPairs();

// Generate comprehensive report
const report = batchProcessor.generateBatchReport();
console.log(report);
```

#### Export Reports
```javascript
// Export JSON data
batchProcessor.exportBatchResults();

// Generate and save HTML report
batchProcessor.saveHTMLReport();
```

### 4. Demo Functions

#### Run Quick Demo
```javascript
// In browser console
runPairProcessorDemo();

// Or run quick test
quickPairTest();
```

#### Performance Testing
```javascript
const demo = new PairProcessorDemo();
await demo.initialize();
demo.performanceTest();
```

## 📊 API Reference

### PairProcessor Methods

#### Core Methods
- `initialize()` - Initialize the processor and scan for pairs
- `getCurrentPair()` - Get currently selected pair
- `nextPair()` / `previousPair()` - Navigate between pairs
- `jumpToPair(index)` - Jump to specific pair by index

#### Search & Filter
- `searchPairs(criteria)` - Search pairs by dataset, summary, etc.
- `getAllPairsSummary()` - Get summary of all pairs
- `getStatistics()` - Get comprehensive statistics

#### Data Export
- `exportPairsData()` - Export all pair data as JSON
- `generatePairHTML(pair)` - Generate HTML for displaying pair

### PairBatchProcessor Methods

#### Processing
- `processAllPairs()` - Process all pairs with validation
- `processSinglePair(pair, index)` - Process individual pair
- `validateImage(image)` - Validate individual image

#### Reporting
- `generateBatchReport()` - Generate comprehensive report
- `generateSummary()` - Generate summary statistics
- `generateValidationReport()` - Generate image validation report
- `generatePerformanceReport()` - Generate performance metrics

#### Export
- `exportBatchResults(filename)` - Export results as JSON
- `generateHTMLReport()` - Generate HTML report
- `saveHTMLReport(filename)` - Save HTML report to file

## 🎨 UI Components

### Navigation Controls
- **Dataset Filter**: Filter by ATP, FIFA18, or Inc500Charts
- **Summary Filter**: Filter by sum1, sum3, etc.
- **Pair Jump**: Jump directly to specific pair number
- **Export Data**: Export current data as JSON

### Display Elements
- **Pair Header**: Shows current pair information and metadata
- **Image Gallery**: Displays pair images with hover effects
- **Navigation Buttons**: Previous/Next with current position indicator
- **Statistics Panel**: Shows comprehensive statistics
- **Search Results**: Displays filtered pair results

### Modal Features
- **Full-Screen Image View**: Click any image to view in modal
- **Keyboard Navigation**: Use arrow keys to navigate in modal
- **Responsive Design**: Works on desktop and mobile

## 📈 Statistics & Reports

### Basic Statistics
- Total pairs found
- Total images across all pairs
- Average images per pair
- Dataset distribution
- Summary/question distribution

### Validation Reports
- Valid vs invalid images
- Image loading success rates
- Common error types
- Image dimensions and aspect ratios

### Performance Metrics
- Processing times per pair
- Image loading times
- Navigation performance
- Memory usage patterns

## 🔍 Troubleshooting

### Common Issues

1. **No pairs found**: Check directory structure and image files exist
2. **Images not loading**: Verify image paths and file extensions
3. **Slow performance**: Consider reducing batch size or using filters
4. **Memory issues**: Process pairs in smaller batches

### Debug Mode
```javascript
// Enable debug logging
console.log('Debug mode enabled');
processor.debugMode = true;
```

### Error Handling
The system includes comprehensive error handling for:
- Missing directories
- Invalid image files
- Network timeouts
- Processing failures

## 🚀 Advanced Usage

### Custom Validation
```javascript
// Override image validation logic
batchProcessor.validateImage = async function(image) {
    // Custom validation logic here
    return customValidationResult;
};
```

### Custom Filters
```javascript
// Create custom search criteria
const customPairs = processor.searchPairs({
    dataset: 'Inc500Charts',
    summary: 'sum3',
    imageCount: { min: 2 }
});
```

### Integration with Other Systems
```javascript
// Export for use in other applications
const pairData = processor.exportPairsData();
await sendToExternalSystem(pairData);
```

## 🛠️ Development

### Adding New Features
1. Extend the `PairProcessor` class for new functionality
2. Add corresponding UI elements in `index.html`
3. Update styles in `styles.css`
4. Add tests in demo scripts

### Performance Optimization
- Use batch processing for large datasets
- Implement lazy loading for images
- Cache processed results
- Use web workers for heavy computations

## 📝 License

This system is part of the Chart Evaluation project and follows the same licensing terms.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Add tests for new functionality
4. Submit a pull request

---

For more information or support, please refer to the main project documentation.