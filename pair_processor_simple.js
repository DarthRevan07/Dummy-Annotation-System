/**
 * Simplified Pair Directory Processor
 * Only processes actual pair directories (pair1, pair2, etc.) from the pairs folder
 */

class PairProcessor {
    constructor() {
        // Simple path construction based on environment
        const isGitHubPages = window.location.hostname.includes('github.io');
        this.basePath = isGitHubPages ? 'pairs' : './pairs';
        
        console.log('Environment:', { isGitHubPages, basePath: this.basePath });
        
        this.currentPairIndex = 0;
        this.allPairs = [];
        this.isInitialized = false;
    }

    /**
     * Initialize the processor by scanning only actual pair directories
     * @param {Object} urlParams - URL parameters for filtering
     */
    async initialize(urlParams = null) {
        console.log('Initializing Simplified Pair Processor...');
        await this.scanPairDirectories(urlParams);
        this.isInitialized = true;
        console.log(`Found ${this.allPairs.length} actual pairs`);
    }

    /**
     * Scan only for actual pair directories (pair1, pair2, etc.)
     * @param {Object} urlParams - URL parameters for filtering
     */
    async scanPairDirectories(urlParams = null) {
        console.log('Scanning pair directories...');
        
        const datasets = ['Inc500Charts', 'fifa18_rendered_charts', 'ATP_rendered_charts'];
        let targetDatasets = datasets;
        
        if (urlParams && urlParams.get('dataset')) {
            const selectedDataset = urlParams.get('dataset');
            targetDatasets = datasets.filter(dataset => dataset === selectedDataset);
        }
        
        for (const dataset of targetDatasets) {
            await this.processDataset(dataset, urlParams);
        }
        
        console.log(`Found ${this.allPairs.length} total pairs`);
    }

    /**
     * Process a single dataset
     */
    async processDataset(dataset, urlParams) {
        const summaryDirs = ['sum1_ques1', 'sum1_ques2', 'sum1_ques3', 'sum3_ques1', 'sum3_ques2', 'sum3_ques3'];
        
        for (const summaryDir of summaryDirs) {
            if (!this.matchesUrlParams(summaryDir, urlParams)) continue;
            
            // Check for pair directories (pair1, pair2, etc.)
            for (let i = 1; i <= 10; i++) {
                const pairDir = `pair${i}`;
                const pairData = await this.processPairDirectory(dataset, summaryDir, pairDir);
                
                if (pairData && pairData.images.length >= 2) {
                    this.allPairs.push(pairData);
                }
            }
        }
    }

    /**
     * Check if summary directory matches URL parameters
     */
    matchesUrlParams(summaryDir, urlParams) {
        if (!urlParams) return true;
        
        const summary = urlParams.get('summary');
        const question = urlParams.get('question');
        
        if (summary && !summaryDir.includes(`sum${summary}_`)) {
            return false;
        }
        
        if (question && !summaryDir.includes(`_ques${question}`)) {
            return false;
        }
        
        return true;
    }





    /**
     * Process a pair directory and load its images
     */
    async processPairDirectory(dataset, summaryDir, pairDir) {
        const pairPath = `${this.basePath}/${dataset}/${summaryDir}/${pairDir}`;
        
        try {
            const images = await this.loadImagesFromDirectory(pairPath);
            
            if (images.length < 2) {
                return null;
            }
            
            return {
                id: `${dataset}_${summaryDir}_${pairDir}`,
                dataset: dataset,
                summaryDir: summaryDir,
                pairDir: pairDir,
                pairPath: pairPath,
                images: images,
                metadata: {
                    dataset: this.getDatasetName(dataset),
                    summary: summaryDir,
                    question: this.extractQuestion(summaryDir),
                    pairNumber: parseInt(pairDir.replace('pair', ''))
                }
            };
        } catch (error) {
            return null;
        }
    }

    /**
     * Load images from a directory
     */
    async loadImagesFromDirectory(dirPath) {
        const images = [];
        const imageExtensions = ['.png', '.jpg', '.jpeg'];
        
        // Test common image names
        const testFiles = [];
        for (let i = 1; i <= 25; i++) {
            testFiles.push(`${i}.png`);
        }
        
        for (const filename of testFiles) {
            const imagePath = `${dirPath}/${filename}`;
            
            if (await this.checkImageExists(imagePath)) {
                images.push({
                    name: filename,
                    path: imagePath,
                    fullUrl: imagePath
                });
                
                // Stop after finding enough images
                if (images.length >= 10) break;
            }
        }
        
        // Sort by numeric order
        images.sort((a, b) => {
            const aNum = parseInt(a.name.match(/\d+/)?.[0] || 0);
            const bNum = parseInt(b.name.match(/\d+/)?.[0] || 0);
            return aNum - bNum;
        });
        
        return images;
    }



    /**
     * Check if image file exists
     */
    async checkImageExists(imagePath) {
        try {
            const response = await fetch(imagePath, { method: 'HEAD' });
            return response.ok;
        } catch {
            return false;
        }
    }

    /**
     * Get human-readable dataset name
     */
    getDatasetName(dataset) {
        const datasetMap = {
            'ATP_rendered_charts': 'ATP Number 1 Rankings',
            'fifa18_rendered_charts': 'FIFA 18 Dataset',
            'Inc500Charts': 'Inc5000 Company List 2014'
        };
        return datasetMap[dataset] || dataset;
    }

    /**
     * Extract question number from summary directory name
     */
    extractQuestion(summaryDir) {
        const match = summaryDir.match(/ques(\d+)/);
        return match ? match[1] : '1';
    }

    /**
     * Get comprehensive statistics about loaded pairs
     */
    getStatistics() {
        const stats = {
            totalPairs: this.allPairs.length,
            datasetBreakdown: {},
            summaryBreakdown: {},
            questionBreakdown: {}
        };

        this.allPairs.forEach(pair => {
            // Dataset breakdown
            const dataset = pair.metadata.dataset;
            stats.datasetBreakdown[dataset] = (stats.datasetBreakdown[dataset] || 0) + 1;

            // Summary breakdown
            stats.summaryBreakdown[pair.summaryDir] = (stats.summaryBreakdown[pair.summaryDir] || 0) + 1;

            // Question breakdown
            const question = pair.metadata.question;
            stats.questionBreakdown[question] = (stats.questionBreakdown[question] || 0) + 1;
        });

        return stats;
    }

    /**
     * Filter pairs based on criteria
     */
    filterPairs(criteria) {
        return this.allPairs.filter(pair => {
            if (criteria.dataset && !pair.dataset.toLowerCase().includes(criteria.dataset.toLowerCase())) {
                return false;
            }
            if (criteria.summary && pair.summaryDir !== criteria.summary) {
                return false;
            }
            if (criteria.question && pair.metadata.question !== criteria.question) {
                return false;
            }
            return true;
        });
    }
}