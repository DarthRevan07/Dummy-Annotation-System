/**
 * Simplified Pair Directory Processor
 * Only processes actual pair directories (pair1, pair2, etc.) from the pairs folder
 */

class PairProcessor {
    constructor() {
        // Detect if running on GitHub Pages and adjust base path accordingly
        const isGitHubPages = window.location.hostname.includes('github.io');
        const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        
        if (isGitHubPages) {
            // GitHub Pages serves from /repository-name/ path
            this.basePath = '/Dummy-Annotation-System/pairs';
        } else if (isLocal) {
            // Local development server
            this.basePath = './pairs';
        } else {
            // Default fallback
            this.basePath = './pairs';
        }
        
        console.log('Environment detected:', { isGitHubPages, isLocal, basePath: this.basePath });
        
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
        console.log('=== SCANNING PAIR DIRECTORIES ===');
        console.log('URL params:', urlParams ? Object.fromEntries(urlParams) : 'none');
        console.log('Environment:', {
            hostname: window.location.hostname,
            isGitHubPages: window.location.hostname.includes('github.io'),
            basePath: this.basePath
        });
        
        const datasets = ['ATP_rendered_charts', 'fifa18_rendered_charts', 'Inc500Charts'];
        
        // Filter by dataset parameter if provided
        let targetDatasets = datasets;
        if (urlParams && urlParams.get('dataset')) {
            const selectedDataset = urlParams.get('dataset');
            targetDatasets = datasets.filter(dataset => dataset === selectedDataset);
            console.log(`Filtering for dataset: ${selectedDataset}`);
        }
        
        console.log('Target datasets:', targetDatasets);
        
        for (const dataset of targetDatasets) {
            console.log(`\n--- Processing dataset: ${dataset} ---`);
            try {
                const summaryDirs = await this.getSummaryDirectories(dataset);
                console.log(`Summary directories found:`, summaryDirs);
                
                for (const summaryDir of summaryDirs) {
                    console.log(`\n  Processing summary: ${summaryDir}`);
                    // Filter by URL parameters if provided
                    if (!this.matchesUrlParams(summaryDir, urlParams)) {
                        console.log(`    Skipped - doesn't match URL params`);
                        continue;
                    }
                    
                    const pairDirs = await this.getActualPairDirectories(dataset, summaryDir);
                    console.log(`    Pair directories found:`, pairDirs);
                    
                    for (const pairDir of pairDirs) {
                        console.log(`\n    Processing pair: ${pairDir}`);
                        const pairData = await this.processPairDirectory(dataset, summaryDir, pairDir);
                        if (pairData && pairData.images.length >= 2) {
                            this.allPairs.push(pairData);
                            console.log(`      ✅ Added pair: ${pairData.id} with ${pairData.images.length} images`);
                        } else {
                            console.log(`      ❌ Rejected pair: insufficient images (${pairData ? pairData.images.length : 0})`);
                        }
                    }
                }
            } catch (error) {
                console.error(`Error processing dataset ${dataset}:`, error);
            }
        }
        
        console.log(`\n=== SCAN COMPLETE ===`);
        console.log(`Total pairs found: ${this.allPairs.length}`);
        if (this.allPairs.length > 0) {
            console.log('Pair summary:', this.allPairs.map(p => ({ id: p.id, imageCount: p.images.length })));
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
     * Get summary directories for a dataset
     */
    async getSummaryDirectories(dataset) {
        const summaryDirs = [];
        
        // Known summary directories that exist for each dataset
        const knownSummaries = {
            'Inc500Charts': ['sum1_ques1', 'sum3_ques1', 'sum3_ques2'],
            'fifa18_rendered_charts': ['sum1_ques1', 'sum1_ques2', 'sum3_ques1', 'sum3_ques2'],
            'ATP_rendered_charts': ['sum1_ques3', 'sum3_ques2']
        };
        
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            // On GitHub Pages, use known directories instead of trying to list
            const dirs = knownSummaries[dataset] || [];
            console.log(`Using known directories for ${dataset} on GitHub Pages:`, dirs);
            return dirs;
        } else {
            // Local development - check each directory
            const testDirs = knownSummaries[dataset] || [];
            
            for (const dir of testDirs) {
                if (await this.checkDirectoryExists(`${this.basePath}/${dataset}/${dir}`)) {
                    summaryDirs.push(dir);
                }
            }
        }
        
        return summaryDirs;
    }

    /**
     * Get only actual pair directories (pair1, pair2, etc.)
     */
    async getActualPairDirectories(dataset, summaryDir) {
        const pairDirs = [];
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        if (isGitHubPages) {
            // On GitHub Pages, use known pair directories instead of checking existence
            const knownPairs = {
                'Inc500Charts': {
                    'sum1_ques1': ['pair1', 'pair2'],
                    'sum3_ques1': ['pair1', 'pair2', 'pair3'],
                    'sum3_ques2': ['pair1', 'pair2', 'pair3']
                },
                'fifa18_rendered_charts': {
                    'sum1_ques1': [], // No pairs in this directory
                    'sum1_ques2': ['pair1', 'pair2'],
                    'sum3_ques1': ['pair1', 'pair2', 'pair3', 'pair4', 'pair5', 'pair6'],
                    'sum3_ques2': ['pair1', 'pair2', 'pair3']
                },
                'ATP_rendered_charts': {
                    'sum1_ques3': ['pair1', 'pair2', 'pair3', 'pair4'],
                    'sum3_ques2': ['pair1']
                }
            };
            
            const pairs = knownPairs[dataset]?.[summaryDir] || [];
            console.log(`Using known pairs for ${dataset}/${summaryDir} on GitHub Pages:`, pairs);
            return pairs;
        } else {
            // Local development - check for pair directories
            for (let i = 1; i <= 20; i++) {
                const pairDir = `pair${i}`;
                if (await this.checkDirectoryExists(`${this.basePath}/${dataset}/${summaryDir}/${pairDir}`)) {
                    pairDirs.push(pairDir);
                }
            }
            
            console.log(`Found ${pairDirs.length} actual pair directories in ${dataset}/${summaryDir}:`, pairDirs);
            return pairDirs;
        }
    }

    /**
     * Process a pair directory and load its images
     */
    async processPairDirectory(dataset, summaryDir, pairDir) {
        const pairPath = `${this.basePath}/${dataset}/${summaryDir}/${pairDir}`;
        
        console.log('Processing pair directory:', pairPath);
        
        try {
            const images = await this.loadImagesFromDirectory(pairPath);
            
            if (images.length < 2) {
                console.warn(`Pair directory ${pairPath} has ${images.length} images (need at least 2), skipping`);
                return null;
            }
            
            const pairData = {
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
            
            console.log('Successfully created pair data:', {
                id: pairData.id,
                imageCount: images.length,
                imageNames: images.map(img => img.name)
            });
            
            return pairData;
        } catch (error) {
            console.error(`Error processing pair directory ${pairPath}:`, error);
            return null;
        }
    }

    /**
     * Load images from a directory
     */
    async loadImagesFromDirectory(dirPath) {
        const images = [];
        const imageExtensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg'];
        const isGitHubPages = window.location.hostname.includes('github.io');
        
        console.log(`\n      Loading images from directory: ${dirPath}`);
        
        if (isGitHubPages) {
            // For GitHub Pages, use known image mappings instead of checking existence
            const knownImages = this.getKnownImagesForPath(dirPath);
            console.log(`      Using known images for GitHub Pages:`, knownImages);
            
            for (const filename of knownImages) {
                const imagePath = `${dirPath}/${filename}`;
                images.push({
                    name: filename,
                    path: imagePath,
                    fullUrl: imagePath
                });
                console.log(`        ✅ Added known image: ${filename}`);
            }
        } else {
            // Local development - check for image existence
            const testFiles = [];
            
            // Pattern 1: 1.png, 2.png, etc.
            for (let i = 1; i <= 30; i++) {
                for (const ext of imageExtensions) {
                    testFiles.push(`${i}${ext}`);
                }
            }
            
            // Pattern 2: chart1.png, chart2.png, etc.
            for (let i = 1; i <= 15; i++) {
                for (const ext of imageExtensions) {
                    testFiles.push(`chart${i}${ext}`);
                    testFiles.push(`image${i}${ext}`);
                }
            }
            
            console.log(`      Testing ${testFiles.length} possible image names...`);
            
            let foundCount = 0;
            for (const filename of testFiles) {
                const imagePath = `${dirPath}/${filename}`;
                const exists = await this.checkImageExists(imagePath);
                
                if (exists) {
                    foundCount++;
                    const finalUrl = `${imagePath}?v=${Date.now()}`;
                    
                    images.push({
                        name: filename,
                        path: imagePath,
                        fullUrl: finalUrl
                    });
                    console.log(`        ✅ Found: ${filename}`);
                    
                    if (foundCount >= 10) {
                        console.log(`        (Stopped searching after finding ${foundCount} images)`);
                        break;
                    }
                }
            }
        }
        
        // Sort images by filename for consistent ordering
        images.sort((a, b) => {
            const aNum = parseInt(a.name.match(/\d+/)?.[0] || 0);
            const bNum = parseInt(b.name.match(/\d+/)?.[0] || 0);
            return aNum - bNum;
        });
        
        console.log(`      Result: Found ${images.length} images in ${dirPath}`);
        if (images.length > 0) {
            console.log(`      Images: ${images.map(img => img.name).join(', ')}`);
        }
        
        return images;
    }

    /**
     * Check if directory exists
     */
    async checkDirectoryExists(dirPath) {
        try {
            // For GitHub Pages, we can't check directory existence directly
            // Instead, we'll try to fetch a common file that might exist in the directory
            const isGitHubPages = window.location.hostname.includes('github.io');
            
            if (isGitHubPages) {
                // On GitHub Pages, assume directory exists if we're checking known paths
                const knownPaths = [
                    '/Dummy-Annotation-System/pairs/Inc500Charts/sum1_ques1',
                    '/Dummy-Annotation-System/pairs/Inc500Charts/sum3_ques1', 
                    '/Dummy-Annotation-System/pairs/Inc500Charts/sum3_ques2',
                    '/Dummy-Annotation-System/pairs/fifa18_rendered_charts/sum1_ques1',
                    '/Dummy-Annotation-System/pairs/fifa18_rendered_charts/sum1_ques2',
                    '/Dummy-Annotation-System/pairs/fifa18_rendered_charts/sum3_ques1',
                    '/Dummy-Annotation-System/pairs/fifa18_rendered_charts/sum3_ques2',
                    '/Dummy-Annotation-System/pairs/ATP_rendered_charts/sum1_ques3',
                    '/Dummy-Annotation-System/pairs/ATP_rendered_charts/sum3_ques2'
                ];
                
                const dirExists = knownPaths.some(path => dirPath.includes(path.substring(25))); // Remove repo prefix for comparison
                console.log(`Directory check (GitHub Pages): ${dirPath} -> ${dirExists}`);
                return dirExists;
            } else {
                // Local development - try to fetch directory
                const response = await fetch(dirPath + '/');
                return response.ok || response.status === 403; // 403 means directory exists but listing disabled
            }
        } catch {
            return false;
        }
    }

    /**
     * Get known images for a specific path (GitHub Pages only)
     */
    getKnownImagesForPath(dirPath) {
        // Extract dataset, summary, and pair from the path
        const pathParts = dirPath.split('/');
        const dataset = pathParts[pathParts.length - 3];
        const summary = pathParts[pathParts.length - 2];
        const pair = pathParts[pathParts.length - 1];
        
        // Known image mappings based on actual file structure
        const knownImageMappings = {
            'Inc500Charts': {
                'sum1_ques1': {
                    'pair1': ['5.png', '7.png'],
                    'pair2': ['10.png', '8.png']
                },
                'sum3_ques1': {
                    'pair1': ['6.png', '7.png'],
                    'pair2': ['12.png', '13.png'],
                    'pair3': ['10.png', '11.png']
                },
                'sum3_ques2': {
                    'pair1': ['1.png', '2.png'],
                    'pair2': ['10.png', '8.png'],
                    'pair3': ['14.png', '15.png']
                }
            },
            'fifa18_rendered_charts': {
                'sum1_ques2': {
                    'pair1': ['15.png', '17.png'],
                    'pair2': ['10.png', '20.png']
                },
                'sum3_ques1': {
                    'pair1': ['2.png', '4.png'],
                    'pair2': ['1.png', '7.png'],
                    'pair3': ['7.png', '9.png'],
                    'pair4': ['12.png', '16.png'],
                    'pair5': ['18.png', '20.png'],
                    'pair6': ['19.png', '25.png']
                },
                'sum3_ques2': {
                    'pair1': ['14.png', '5.png'],
                    'pair2': ['15.png', '3.png'],
                    'pair3': ['16.png', '18.png']
                }
            },
            'ATP_rendered_charts': {
                'sum1_ques3': {
                    'pair1': ['11.png', '9.png'],
                    'pair2': ['6.png', '7.png'],
                    'pair3': ['1.png', '6.png'],
                    'pair4': ['10.png', '4.png']
                },
                'sum3_ques2': {
                    'pair1': ['6.png', '8.png']
                }
            }
        };
        
        const images = knownImageMappings[dataset]?.[summary]?.[pair] || [];
        console.log(`      Known images for ${dataset}/${summary}/${pair}:`, images);
        return images;
    }

    /**
     * Check if image file exists
     */
    async checkImageExists(imagePath) {
        try {
            // Use GET instead of HEAD as some servers don't support HEAD for static files
            const response = await fetch(imagePath);
            const exists = response.ok;
            
            if (!exists) {
                if (response.status === 404) {
                    // Normal - file doesn't exist
                    return false;
                } else {
                    console.log(`        Image check for ${imagePath}: HTTP ${response.status}`);
                }
            }
            
            return exists;
        } catch (error) {
            console.log(`        Image check error for ${imagePath}: ${error.message}`);
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