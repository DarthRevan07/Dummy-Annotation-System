/**
 * Pair Processor Demo Script
 * Demonstrates how to use the PairProcessor class programmatically
 */

// Demo functions to showcase the pair processor capabilities
class PairProcessorDemo {
    constructor() {
        this.processor = null;
    }

    async initialize() {
        console.log('🚀 Initializing Pair Processor Demo...');
        this.processor = new PairProcessor();
        await this.processor.initialize();
        console.log('✅ Pair Processor initialized successfully!');
        
        this.runDemos();
    }

    async runDemos() {
        console.log('\n📊 Running Demo Scripts...\n');
        
        // Demo 1: Basic Statistics
        this.demoBasicStatistics();
        
        // Demo 2: Navigation Demo
        this.demoNavigation();
        
        // Demo 3: Search and Filter Demo
        this.demoSearchAndFilter();
        
        // Demo 4: Data Export Demo
        this.demoDataExport();
        
        // Demo 5: HTML Generation Demo
        this.demoHTMLGeneration();
    }

    demoBasicStatistics() {
        console.log('📈 Demo 1: Basic Statistics');
        console.log('=' .repeat(30));
        
        const stats = this.processor.getStatistics();
        console.log(`Total Pairs Found: ${stats.totalPairs}`);
        console.log(`Total Images: ${stats.totalImages}`);
        console.log(`Average Images per Pair: ${stats.averageImagesPerPair}`);
        
        console.log('\nDataset Distribution:');
        Object.entries(stats.datasetBreakdown).forEach(([dataset, count]) => {
            console.log(`  - ${dataset}: ${count} pairs`);
        });
        
        console.log('\nSummary Distribution:');
        Object.entries(stats.summaryBreakdown).forEach(([summary, count]) => {
            console.log(`  - ${summary}: ${count} pairs`);
        });
        
        console.log('\n');
    }

    demoNavigation() {
        console.log('🧭 Demo 2: Navigation');
        console.log('=' .repeat(30));
        
        // Show first pair
        let currentPair = this.processor.getCurrentPair();
        if (currentPair) {
            console.log(`Current Pair: ${currentPair.id}`);
            console.log(`Images: ${currentPair.images.length}`);
            console.log(`Path: ${currentPair.fullPath}`);
        }
        
        // Navigate through pairs
        console.log('\nNavigating through pairs:');
        for (let i = 0; i < Math.min(3, this.processor.allPairs.length); i++) {
            const pair = this.processor.jumpToPair(i);
            if (pair) {
                console.log(`  Pair ${i + 1}: ${pair.metadata.dataset} - ${pair.pairDir} (${pair.images.length} images)`);
            }
        }
        
        console.log('\n');
    }

    demoSearchAndFilter() {
        console.log('🔍 Demo 3: Search and Filter');
        console.log('=' .repeat(30));
        
        // Search by dataset
        console.log('Searching for Inc500Charts pairs:');
        const inc500Pairs = this.processor.searchPairs({ dataset: 'Inc500Charts' });
        inc500Pairs.forEach((pair, index) => {
            console.log(`  ${index + 1}. ${pair.id} (${pair.images.length} images)`);
        });
        
        // Search by summary
        console.log('\nSearching for sum3 pairs:');
        const sum3Pairs = this.processor.searchPairs({ summary: 'sum3' });
        sum3Pairs.forEach((pair, index) => {
            console.log(`  ${index + 1}. ${pair.id} - ${pair.summaryDir}`);
        });
        
        console.log('\n');
    }

    demoDataExport() {
        console.log('💾 Demo 4: Data Export');
        console.log('=' .repeat(30));
        
        const exportData = JSON.parse(this.processor.exportPairsData());
        console.log(`Export timestamp: ${exportData.timestamp}`);
        console.log(`Total pairs in export: ${exportData.totalPairs}`);
        
        if (exportData.pairs.length > 0) {
            console.log('\nFirst pair details:');
            const firstPair = exportData.pairs[0];
            console.log(`  ID: ${firstPair.id}`);
            console.log(`  Dataset: ${firstPair.metadata.dataset}`);
            console.log(`  Images: ${firstPair.images.map(img => img.name).join(', ')}`);
        }
        
        console.log('\n');
    }

    demoHTMLGeneration() {
        console.log('🎨 Demo 5: HTML Generation');
        console.log('=' .repeat(30));
        
        // Generate HTML for current pair
        const currentPair = this.processor.getCurrentPair();
        if (currentPair) {
            const html = this.processor.generatePairHTML(currentPair);
            console.log('Generated HTML length:', html.length, 'characters');
            console.log('HTML preview (first 200 chars):');
            console.log(html.substring(0, 200) + '...');
        }
        
        console.log('\n');
    }

    // Utility method to get a summary report
    generateSummaryReport() {
        const summary = this.processor.getAllPairsSummary();
        
        console.log('📋 Summary Report');
        console.log('=' .repeat(50));
        
        summary.forEach((pair, index) => {
            console.log(`${index + 1}. ${pair.id}`);
            console.log(`   Dataset: ${pair.dataset}`);
            console.log(`   Summary/Question: ${pair.summary} - ${pair.question}`);
            console.log(`   Pair: ${pair.pairNumber}`);
            console.log(`   Images: ${pair.imageCount}`);
            console.log(`   Path: ${pair.path}`);
            console.log('');
        });
    }

    // Method to test specific pair processing
    async testSpecificPair(tableDir, summaryDir, pairDir) {
        console.log(`🔬 Testing Specific Pair: ${tableDir}/${summaryDir}/${pairDir}`);
        console.log('=' .repeat(50));
        
        try {
            const pairData = await this.processor.processPairDirectory(tableDir, summaryDir, pairDir);
            if (pairData) {
                console.log('✅ Pair processed successfully:');
                console.log(`   ID: ${pairData.id}`);
                console.log(`   Images found: ${pairData.images.length}`);
                console.log(`   Metadata: ${JSON.stringify(pairData.metadata, null, 2)}`);
                
                pairData.images.forEach((image, index) => {
                    console.log(`   Image ${index + 1}: ${image.name} (${image.path})`);
                });
            } else {
                console.log('❌ No valid pair data found');
            }
        } catch (error) {
            console.error('❌ Error processing pair:', error);
        }
        
        console.log('\n');
    }

    // Method to monitor pair processor performance
    performanceTest() {
        console.log('⚡ Performance Test');
        console.log('=' .repeat(30));
        
        const startTime = performance.now();
        
        // Test navigation performance
        for (let i = 0; i < this.processor.allPairs.length; i++) {
            this.processor.jumpToPair(i);
        }
        
        const navigationTime = performance.now() - startTime;
        console.log(`Navigation test completed in: ${navigationTime.toFixed(2)}ms`);
        
        // Test search performance
        const searchStartTime = performance.now();
        this.processor.searchPairs({ dataset: 'Inc500Charts' });
        const searchTime = performance.now() - searchStartTime;
        console.log(`Search test completed in: ${searchTime.toFixed(2)}ms`);
        
        // Test HTML generation performance
        const htmlStartTime = performance.now();
        this.processor.generatePairHTML();
        const htmlTime = performance.now() - htmlStartTime;
        console.log(`HTML generation test completed in: ${htmlTime.toFixed(2)}ms`);
        
        console.log('\n');
    }
}

// Usage examples and helper functions
function runPairProcessorDemo() {
    const demo = new PairProcessorDemo();
    demo.initialize();
}

function quickPairTest() {
    console.log('🚀 Quick Pair Test');
    
    // Test with known existing pair
    const demo = new PairProcessorDemo();
    demo.initialize().then(() => {
        demo.testSpecificPair('Inc500Charts', 'sum3_ques2', 'pair1');
        demo.generateSummaryReport();
        demo.performanceTest();
    });
}

// Auto-run demo if in browser environment
if (typeof window !== 'undefined' && window.pairProcessor) {
    console.log('🌐 Browser environment detected. Demo functions available:');
    console.log('  - runPairProcessorDemo()');
    console.log('  - quickPairTest()');
    console.log('  - new PairProcessorDemo() for custom usage');
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { PairProcessorDemo, runPairProcessorDemo, quickPairTest };
}