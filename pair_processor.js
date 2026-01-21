/**
 * Pair Directory Processor
 * Systematically processes all pair directories in the pairs folder structure
 * Handles image loading, comparison interface, and navigation between pairs
 */

class PairProcessor {
    constructor() {
        this.basePath = './pairs';
        this.currentPairIndex = 0;
        this.allPairs = [];
        this.isInitialized = false;
    }

    /**
     * Initialize the processor by scanning all pair directories
     * @param {Object} urlParams - URL parameters for filtering
     */
    async initialize(urlParams = null) {
        console.log('Initializing Pair Processor...');
        await this.scanAllPairs(urlParams);
        this.isInitialized = true;
        console.log(`Found ${this.allPairs.length} total pairs across all datasets`);
    }

    /**
     * Scan all table directories and their subdirectories for pairs
     * @param {Object} urlParams - URL parameters for filtering
     */
    async scanAllPairs(urlParams = null) {
        let tableDirectories = ['ATP_rendered_charts', 'fifa18_rendered_charts', 'Inc500Charts'];
        
        // Filter by dataset parameter if provided
        if (urlParams && urlParams.get('dataset')) {
            const selectedDataset = urlParams.get('dataset');
            tableDirectories = tableDirectories.filter(dir => dir === selectedDataset);
            console.log(`Filtering for dataset: ${selectedDataset}`);
        }
        
        for (const tableDir of tableDirectories) {
            try {
                const summaryDirs = await this.getSummaryDirectories(tableDir);
                
                for (const summaryDir of summaryDirs) {
                    // Filter by summary parameter if provided
                    if (urlParams && urlParams.get('summary')) {
                        const selectedSummary = urlParams.get('summary');
                        if (!summaryDir.includes(`sum${selectedSummary}_`)) {
                            continue;
                        }
                    }
                    
                    // Filter by question parameter if provided  
                    if (urlParams && urlParams.get('question')) {
                        const selectedQuestion = urlParams.get('question');
                        if (!summaryDir.includes(`_ques${selectedQuestion}_`)) {
                            continue;
                        }
                    }
                    
                    const pairDirs = await this.getPairDirectories(tableDir, summaryDir);
                    
                    for (const pairDir of pairDirs) {
                        const pairData = await this.processPairDirectory(tableDir, summaryDir, pairDir);
                        if (pairData && pairData.images.length > 0) {
                            this.allPairs.push(pairData);
                        }
                    }
                }
            } catch (error) {
                console.warn(`Error processing table directory ${tableDir}:`, error);
            }
        }
    }

    /**
     * Get summary directories for a given table directory
     */
    async getSummaryDirectories(tableDir) {
        const summaryDirs = [];
        const tableStructure = {
            'ATP_rendered_charts': ['sum1_ques3', 'sum3_ques2'],
            'fifa18_rendered_charts': ['sum1_ques1', 'sum1_ques2', 'sum3_ques1', 'sum3_ques2'],
            'Inc500Charts': ['sum1_ques1', 'sum3_ques1', 'sum3_ques2']
        };
        
        return tableStructure[tableDir] || [];
    }

    /**
     * Get pair directories for a given table and summary directory
     */
    async getPairDirectories(tableDir, summaryDir) {
        const pairDirs = [];
        const fullPath = `${this.basePath}/${tableDir}/${summaryDir}`;
        
        try {
            // Check for pair directories (pair1, pair2, etc.) - increased range
            for (let i = 1; i <= 20; i++) { // Check up to pair20 to be comprehensive
                const pairPath = `${fullPath}/pair${i}`;
                const exists = await this.checkDirectoryExists(pairPath);
                if (exists) {
                    console.log(`Found pair directory: ${pairPath}`);
                    pairDirs.push(`pair${i}`);
                }
            }
            
            // If no pair directories found, check if the summary directory itself contains images
            if (pairDirs.length === 0) {
                const directImages = await this.getImagesInDirectory(fullPath);
                if (directImages.length >= 2) {
                    // Create virtual pairs from direct images (groups of 2)
                    for (let i = 0; i < directImages.length; i += 2) {
                        if (i + 1 < directImages.length) {
                            console.log(`Creating virtual pair from direct images in: ${fullPath}`);
                            // We'll handle this in processPairDirectory by detecting this case
                            pairDirs.push(`virtual_pair_${Math.floor(i/2) + 1}`);
                        }
                    }
                }
            }
        } catch (error) {
            console.warn(`Error checking pair directories in ${fullPath}:`, error);
        }
        
        console.log(`Found ${pairDirs.length} pairs in ${fullPath}:`, pairDirs);
        return pairDirs;
    }

    /**
     * Process a specific pair directory and extract image information
     */
    async processPairDirectory(tableDir, summaryDir, pairDir) {
        let fullPath, images;
        
        if (pairDir.startsWith('virtual_pair_')) {
            // Handle virtual pairs created from direct images in summary directory
            fullPath = `${this.basePath}/${tableDir}/${summaryDir}`;
            const allImages = await this.getImagesInDirectory(fullPath);
            
            // Extract pair number from virtual_pair_N
            const pairNumber = parseInt(pairDir.split('_')[2]);
            const startIndex = (pairNumber - 1) * 2;
            
            // Take 2 images for this virtual pair
            images = allImages.slice(startIndex, startIndex + 2);
            
            console.log(`Processing virtual pair ${pairNumber} from ${fullPath}, images:`, images.map(img => img.name));
        } else {
            // Handle real pair directories
            fullPath = `${this.basePath}/${tableDir}/${summaryDir}/${pairDir}`;
            images = await this.getImagesInDirectory(fullPath);
            
            console.log(`Processing real pair directory ${fullPath}, found ${images.length} images`);
        }
        
        if (images.length === 0) {
            console.warn(`No images found in ${fullPath}`);
            return null;
        }
        
        // For evaluation purposes, we need at least 2 images for A/B comparison
        if (images.length < 2) {
            console.warn(`Insufficient images for pair comparison in ${fullPath} (found ${images.length}, need 2)`);
            return null;
        }

        return {
            id: `${tableDir}_${summaryDir}_${pairDir}`,
            tableDir,
            summaryDir,
            pairDir,
            fullPath,
            images: images.slice(0, 2), // Take first 2 images for A/B comparison
            metadata: this.extractMetadata(tableDir, summaryDir, pairDir)
        };
    }

    /**
     * Get all image files in a directory
     */
    async getImagesInDirectory(directoryPath) {
        const images = [];
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
        
        try {
            // Since we can't directly read directories in browser, we'll use a predefined structure
            // For the known structure, we'll check common image names
            const commonImageNames = ['1.png', '2.png', '3.png', '4.png', '5.png', 
                                    '10.png', '11.png', '12.png', '14.png', '15.png', '16.png', '8.png'];
            
            for (const imageName of commonImageNames) {
                const imagePath = `${directoryPath}/${imageName}`;
                const exists = await this.checkImageExists(imagePath);
                if (exists) {
                    images.push({
                        name: imageName,
                        path: imagePath,
                        fullUrl: imagePath
                    });
                }
            }
        } catch (error) {
            console.warn(`Error getting images from ${directoryPath}:`, error);
        }
        
        return images;
    }

    /**
     * Check if a directory exists by trying to load a test image from it
     */
    async checkDirectoryExists(path) {
        try {
            // Try to check if directory has images by testing common image names
            const testImages = ['1.png', '2.png', '3.png', '4.png', '5.png', '10.png', '11.png', '12.png', '14.png', '15.png', '16.png', '8.png'];
            
            for (const testImage of testImages) {
                const testPath = `${path}/${testImage}`;
                const exists = await this.checkImageExists(testPath);
                if (exists) {
                    return true; // Directory exists if it contains at least one image
                }
            }
            
            return false;
        } catch {
            return false;
        }
    }

    /**
     * Check if an image exists by attempting to load it
     */
    async checkImageExists(imagePath) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = imagePath;
            
            // Timeout after 1 second
            setTimeout(() => resolve(false), 1000);
        });
    }

    /**
     * Extract metadata from directory structure
     */
    extractMetadata(tableDir, summaryDir, pairDir) {
        const [summaryPart, questionPart] = summaryDir.split('_');
        
        return {
            dataset: this.getDatasetName(tableDir),
            summary: summaryPart,
            question: questionPart,
            pairNumber: pairDir.replace('pair', ''),
            created: new Date().toISOString()
        };
    }

    /**
     * Get human-readable dataset name
     */
    getDatasetName(tableDir) {
        const datasetMap = {
            'ATP_rendered_charts': 'ATP Rankings',
            'fifa18_rendered_charts': 'FIFA 18 Dataset',
            'Inc500Charts': 'Inc5000 Company List 2014'
        };
        return datasetMap[tableDir] || tableDir;
    }

    /**
     * Get current pair data
     */
    getCurrentPair() {
        if (!this.isInitialized || this.allPairs.length === 0) {
            return null;
        }
        return this.allPairs[this.currentPairIndex] || null;
    }

    /**
     * Navigate to next pair
     */
    nextPair() {
        if (this.currentPairIndex < this.allPairs.length - 1) {
            this.currentPairIndex++;
            return this.getCurrentPair();
        }
        return null;
    }

    /**
     * Navigate to previous pair
     */
    previousPair() {
        if (this.currentPairIndex > 0) {
            this.currentPairIndex--;
            return this.getCurrentPair();
        }
        return null;
    }

    /**
     * Jump to specific pair by index
     */
    jumpToPair(index) {
        if (index >= 0 && index < this.allPairs.length) {
            this.currentPairIndex = index;
            return this.getCurrentPair();
        }
        return null;
    }

    /**
     * Get all pairs summary
     */
    getAllPairsSummary() {
        return this.allPairs.map((pair, index) => ({
            index,
            id: pair.id,
            dataset: pair.metadata.dataset,
            summary: pair.metadata.summary,
            question: pair.metadata.question,
            pairNumber: pair.metadata.pairNumber,
            imageCount: pair.images.length,
            path: pair.fullPath
        }));
    }

    /**
     * Search pairs by criteria
     */
    searchPairs(criteria) {
        return this.allPairs.filter(pair => {
            if (criteria.dataset && !pair.tableDir.toLowerCase().includes(criteria.dataset.toLowerCase())) {
                return false;
            }
            if (criteria.summary && !pair.summaryDir.includes(criteria.summary)) {
                return false;
            }
            if (criteria.pairNumber && pair.pairDir !== `pair${criteria.pairNumber}`) {
                return false;
            }
            return true;
        });
    }

    /**
     * Generate HTML for displaying current pair
     */
    generatePairHTML(pair = null) {
        const currentPair = pair || this.getCurrentPair();
        
        if (!currentPair) {
            return '<div class="pair-display">No pairs available</div>';
        }

        const imagesHTML = currentPair.images.map((image, index) => `
            <div class="pair-image-container">
                <h4>Image ${index + 1}</h4>
                <img src="${image.fullUrl}" alt="${image.name}" class="pair-image" 
                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIG5vdCBmb3VuZDwvdGV4dD48L3N2Zz4='; this.alt='Image not found';">
                <p class="image-info">${image.name}</p>
            </div>
        `).join('');

        return `
            <div class="pair-display">
                <div class="pair-header">
                    <h3>Pair ${this.currentPairIndex + 1} of ${this.allPairs.length}</h3>
                    <div class="pair-metadata">
                        <span class="dataset-badge">${currentPair.metadata.dataset}</span>
                        <span class="summary-badge">${currentPair.metadata.summary} - ${currentPair.metadata.question}</span>
                        <span class="pair-badge">${currentPair.pairDir}</span>
                    </div>
                </div>
                <div class="pair-images">
                    ${imagesHTML}
                </div>
                <div class="pair-navigation">
                    <button onclick="pairProcessor.previousPair(); updatePairDisplay();" 
                            ${this.currentPairIndex === 0 ? 'disabled' : ''}>Previous</button>
                    <span class="pair-counter">${this.currentPairIndex + 1} / ${this.allPairs.length}</span>
                    <button onclick="pairProcessor.nextPair(); updatePairDisplay();" 
                            ${this.currentPairIndex === this.allPairs.length - 1 ? 'disabled' : ''}>Next</button>
                </div>
            </div>
        `;
    }

    /**
     * Export pairs data as JSON
     */
    exportPairsData() {
        return JSON.stringify({
            timestamp: new Date().toISOString(),
            totalPairs: this.allPairs.length,
            pairs: this.allPairs
        }, null, 2);
    }

    /**
     * Get statistics about the pairs
     */
    getStatistics() {
        const stats = {
            totalPairs: this.allPairs.length,
            totalImages: this.allPairs.reduce((sum, pair) => sum + pair.images.length, 0),
            datasetBreakdown: {},
            summaryBreakdown: {},
            averageImagesPerPair: 0
        };

        this.allPairs.forEach(pair => {
            // Dataset breakdown
            const dataset = pair.metadata.dataset;
            stats.datasetBreakdown[dataset] = (stats.datasetBreakdown[dataset] || 0) + 1;

            // Summary breakdown
            const summary = `${pair.metadata.summary}_${pair.metadata.question}`;
            stats.summaryBreakdown[summary] = (stats.summaryBreakdown[summary] || 0) + 1;
        });

        stats.averageImagesPerPair = stats.totalPairs > 0 ? 
            (stats.totalImages / stats.totalPairs).toFixed(2) : 0;

        return stats;
    }
}

// Global instance
const pairProcessor = new PairProcessor();

// Helper functions for UI integration
function initializePairProcessor() {
    pairProcessor.initialize().then(() => {
        console.log('Pair Processor initialized successfully');
        updatePairDisplay();
        updateStatisticsDisplay();
    }).catch(error => {
        console.error('Failed to initialize Pair Processor:', error);
    });
}

function updatePairDisplay() {
    const displayElement = document.getElementById('pairDisplay');
    if (displayElement) {
        displayElement.innerHTML = pairProcessor.generatePairHTML();
    }
}

function updateStatisticsDisplay() {
    const statsElement = document.getElementById('pairStatistics');
    if (statsElement) {
        const stats = pairProcessor.getStatistics();
        statsElement.innerHTML = `
            <div class="statistics-panel">
                <h4>Pair Statistics</h4>
                <div class="stat-item">Total Pairs: ${stats.totalPairs}</div>
                <div class="stat-item">Total Images: ${stats.totalImages}</div>
                <div class="stat-item">Average Images per Pair: ${stats.averageImagesPerPair}</div>
                
                <h5>Dataset Distribution:</h5>
                ${Object.entries(stats.datasetBreakdown).map(([dataset, count]) => 
                    `<div class="stat-item">${dataset}: ${count} pairs</div>`
                ).join('')}
                
                <h5>Summary Distribution:</h5>
                ${Object.entries(stats.summaryBreakdown).map(([summary, count]) => 
                    `<div class="stat-item">${summary}: ${count} pairs</div>`
                ).join('')}
            </div>
        `;
    }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePairProcessor);
} else {
    initializePairProcessor();
}