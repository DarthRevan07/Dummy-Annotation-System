/**
 * Pair Processor Batch Operations
 * Utility functions for batch processing of image pairs
 */

class PairBatchProcessor {
    constructor(pairProcessor) {
        this.processor = pairProcessor;
        this.batchResults = [];
    }

    /**
     * Process all pairs and collect metadata
     */
    async processAllPairs() {
        console.log('Starting batch processing of all pairs...');
        const results = [];
        
        for (let i = 0; i < this.processor.allPairs.length; i++) {
            const pair = this.processor.allPairs[i];
            const result = await this.processSinglePair(pair, i);
            results.push(result);
            
            // Progress indicator
            if ((i + 1) % 5 === 0 || i === this.processor.allPairs.length - 1) {
                console.log(`Processed ${i + 1}/${this.processor.allPairs.length} pairs`);
            }
        }
        
        this.batchResults = results;
        return results;
    }

    /**
     * Process a single pair and return detailed information
     */
    async processSinglePair(pair, index) {
        const result = {
            index,
            id: pair.id,
            status: 'processing',
            startTime: new Date().toISOString(),
            metadata: pair.metadata,
            imageCount: pair.images.length,
            imageDetails: [],
            errors: [],
            processingTime: 0
        };

        const startTime = performance.now();

        try {
            // Validate images
            for (const image of pair.images) {
                const imageDetail = await this.validateImage(image);
                result.imageDetails.push(imageDetail);
            }

            result.status = 'completed';
        } catch (error) {
            result.status = 'error';
            result.errors.push(error.message);
        }

        result.processingTime = performance.now() - startTime;
        result.endTime = new Date().toISOString();

        return result;
    }

    /**
     * Validate an individual image
     */
    async validateImage(image) {
        return new Promise((resolve) => {
            const img = new Image();
            const startTime = performance.now();
            
            img.onload = function() {
                resolve({
                    name: image.name,
                    path: image.path,
                    status: 'valid',
                    width: this.naturalWidth,
                    height: this.naturalHeight,
                    aspectRatio: (this.naturalWidth / this.naturalHeight).toFixed(2),
                    loadTime: performance.now() - startTime
                });
            };
            
            img.onerror = function() {
                resolve({
                    name: image.name,
                    path: image.path,
                    status: 'invalid',
                    error: 'Failed to load image',
                    loadTime: performance.now() - startTime
                });
            };
            
            img.src = image.fullUrl;
            
            // Timeout after 5 seconds
            setTimeout(() => {
                resolve({
                    name: image.name,
                    path: image.path,
                    status: 'timeout',
                    error: 'Image load timeout',
                    loadTime: performance.now() - startTime
                });
            }, 5000);
        });
    }

    /**
     * Generate a comprehensive batch report
     */
    generateBatchReport() {
        if (this.batchResults.length === 0) {
            return 'No batch processing results available. Run processAllPairs() first.';
        }

        const report = {
            summary: this.generateSummary(),
            details: this.batchResults,
            validationReport: this.generateValidationReport(),
            performanceReport: this.generatePerformanceReport()
        };

        return report;
    }

    /**
     * Generate summary statistics
     */
    generateSummary() {
        const total = this.batchResults.length;
        const completed = this.batchResults.filter(r => r.status === 'completed').length;
        const errors = this.batchResults.filter(r => r.status === 'error').length;
        const totalImages = this.batchResults.reduce((sum, r) => sum + r.imageCount, 0);
        const validImages = this.batchResults.reduce((sum, r) => 
            sum + r.imageDetails.filter(img => img.status === 'valid').length, 0);

        return {
            totalPairs: total,
            completedPairs: completed,
            errorPairs: errors,
            successRate: `${((completed / total) * 100).toFixed(1)}%`,
            totalImages,
            validImages,
            imageValidationRate: `${((validImages / totalImages) * 100).toFixed(1)}%`
        };
    }

    /**
     * Generate validation report
     */
    generateValidationReport() {
        const validationResults = {
            validImages: 0,
            invalidImages: 0,
            timeoutImages: 0,
            imagesBySize: {},
            commonErrors: {}
        };

        this.batchResults.forEach(result => {
            result.imageDetails.forEach(img => {
                switch (img.status) {
                    case 'valid':
                        validationResults.validImages++;
                        const sizeKey = `${img.width}x${img.height}`;
                        validationResults.imagesBySize[sizeKey] = 
                            (validationResults.imagesBySize[sizeKey] || 0) + 1;
                        break;
                    case 'invalid':
                        validationResults.invalidImages++;
                        if (img.error) {
                            validationResults.commonErrors[img.error] = 
                                (validationResults.commonErrors[img.error] || 0) + 1;
                        }
                        break;
                    case 'timeout':
                        validationResults.timeoutImages++;
                        break;
                }
            });
        });

        return validationResults;
    }

    /**
     * Generate performance report
     */
    generatePerformanceReport() {
        const processingTimes = this.batchResults.map(r => r.processingTime);
        const loadTimes = this.batchResults.flatMap(r => 
            r.imageDetails.map(img => img.loadTime).filter(time => !isNaN(time))
        );

        return {
            avgProcessingTime: this.calculateAverage(processingTimes),
            minProcessingTime: Math.min(...processingTimes),
            maxProcessingTime: Math.max(...processingTimes),
            avgImageLoadTime: this.calculateAverage(loadTimes),
            minImageLoadTime: Math.min(...loadTimes),
            maxImageLoadTime: Math.max(...loadTimes),
            totalProcessingTime: processingTimes.reduce((sum, time) => sum + time, 0)
        };
    }

    /**
     * Helper function to calculate average
     */
    calculateAverage(numbers) {
        if (numbers.length === 0) return 0;
        return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
    }

    /**
     * Export batch results to JSON
     */
    exportBatchResults(filename = null) {
        if (!filename) {
            filename = `batch_results_${new Date().toISOString().slice(0, 10)}.json`;
        }

        const report = this.generateBatchReport();
        const jsonData = JSON.stringify(report, null, 2);

        if (typeof window !== 'undefined') {
            // Browser environment
            const blob = new Blob([jsonData], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Node.js environment
            console.log('JSON data ready for export:', jsonData);
        }

        return jsonData;
    }

    /**
     * Generate HTML report
     */
    generateHTMLReport() {
        const report = this.generateBatchReport();
        
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Pair Processing Batch Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: #3498db; color: white; padding: 20px; margin: -20px -20px 20px -20px; border-radius: 8px 8px 0 0; }
        .summary-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
        .summary-card { background: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 15px; text-align: center; }
        .summary-card h3 { margin: 0 0 10px 0; color: #2c3e50; }
        .summary-card .value { font-size: 24px; font-weight: bold; color: #3498db; }
        .details-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .details-table th, .details-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .details-table th { background-color: #3498db; color: white; }
        .details-table tr:nth-child(even) { background-color: #f2f2f2; }
        .status-completed { color: #27ae60; font-weight: bold; }
        .status-error { color: #e74c3c; font-weight: bold; }
        .section { margin: 30px 0; }
        .section h2 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Pair Processing Batch Report</h1>
            <p>Generated on ${new Date().toLocaleString()}</p>
        </div>
        
        <div class="section">
            <h2>Summary</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Total Pairs</h3>
                    <div class="value">${report.summary.totalPairs}</div>
                </div>
                <div class="summary-card">
                    <h3>Completed</h3>
                    <div class="value">${report.summary.completedPairs}</div>
                </div>
                <div class="summary-card">
                    <h3>Success Rate</h3>
                    <div class="value">${report.summary.successRate}</div>
                </div>
                <div class="summary-card">
                    <h3>Total Images</h3>
                    <div class="value">${report.summary.totalImages}</div>
                </div>
                <div class="summary-card">
                    <h3>Valid Images</h3>
                    <div class="value">${report.summary.validImages}</div>
                </div>
                <div class="summary-card">
                    <h3>Image Validation Rate</h3>
                    <div class="value">${report.summary.imageValidationRate}</div>
                </div>
            </div>
        </div>
        
        <div class="section">
            <h2>Pair Details</h2>
            <table class="details-table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Pair ID</th>
                        <th>Dataset</th>
                        <th>Status</th>
                        <th>Images</th>
                        <th>Valid Images</th>
                        <th>Processing Time (ms)</th>
                    </tr>
                </thead>
                <tbody>
                    ${report.details.map(detail => `
                        <tr>
                            <td>${detail.index + 1}</td>
                            <td>${detail.id}</td>
                            <td>${detail.metadata.dataset}</td>
                            <td class="status-${detail.status}">${detail.status}</td>
                            <td>${detail.imageCount}</td>
                            <td>${detail.imageDetails.filter(img => img.status === 'valid').length}</td>
                            <td>${detail.processingTime.toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
        
        <div class="section">
            <h2>Performance Metrics</h2>
            <div class="summary-grid">
                <div class="summary-card">
                    <h3>Avg Processing Time</h3>
                    <div class="value">${report.performanceReport.avgProcessingTime.toFixed(2)}ms</div>
                </div>
                <div class="summary-card">
                    <h3>Avg Image Load Time</h3>
                    <div class="value">${report.performanceReport.avgImageLoadTime.toFixed(2)}ms</div>
                </div>
                <div class="summary-card">
                    <h3>Total Processing Time</h3>
                    <div class="value">${report.performanceReport.totalProcessingTime.toFixed(2)}ms</div>
                </div>
            </div>
        </div>
    </div>
</body>
</html>`;
        
        return html;
    }

    /**
     * Save HTML report to file
     */
    saveHTMLReport(filename = null) {
        if (!filename) {
            filename = `batch_report_${new Date().toISOString().slice(0, 10)}.html`;
        }

        const html = this.generateHTMLReport();

        if (typeof window !== 'undefined') {
            const blob = new Blob([html], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }

        return html;
    }
}

// Usage functions for the batch processor
async function runBatchProcessing() {
    if (!window.pairProcessor || !window.pairProcessor.isInitialized) {
        console.error('Pair processor not initialized. Please initialize it first.');
        return;
    }

    const batchProcessor = new PairBatchProcessor(window.pairProcessor);
    
    console.log('Starting batch processing...');
    const results = await batchProcessor.processAllPairs();
    
    console.log('Batch processing completed!');
    console.log('Results:', batchProcessor.generateBatchReport());
    
    return batchProcessor;
}

function exportBatchReport() {
    if (window.lastBatchProcessor) {
        window.lastBatchProcessor.exportBatchResults();
        window.lastBatchProcessor.saveHTMLReport();
        console.log('Reports exported successfully!');
    } else {
        console.error('No batch processing results available. Run runBatchProcessing() first.');
    }
}

// Auto-assign to window for browser access
if (typeof window !== 'undefined') {
    window.PairBatchProcessor = PairBatchProcessor;
    window.runBatchProcessing = runBatchProcessing;
    window.exportBatchReport = exportBatchReport;
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PairBatchProcessor, runBatchProcessing, exportBatchReport };
}