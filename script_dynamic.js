// Data structure mapping folder names to dataset names and question outputs
const datasetMappings = {
    'ATP_rendered_charts': 'atp_number_1_summaries',
    'fifa18_rendered_charts': 'fifa18_clean_summaries', 
    'Inc500Charts': 'Data Set- Inc5000 Company List_2014_summaries'
};

// Evaluation categories configuration
const evaluationCategories = {
    'clutter': {
        name: 'Visual Clutter',
        definition: 'Visual clutter or messiness (perceptual/pre-semantic) - the extent to which the chart appears visually crowded or noisy at a glance.',
        primaryQuestion: 'Which chart looks more cluttered or visually messy?',
        clarifyingSubtitle: 'Focus on visual crowding and noise, not data complexity',
        minViewTimeSeconds: 4,
        guidelines: {
            instructionSummary: [
                'Imagine seeing this chart for the first time for just 1–2 seconds, with some initial impressions to gauge the purpose of the visualization.',
                'Focus on **Purely Visual** perceptions. Is it a chart you would make an effort to parse in more detail?',
                'For this question, **Do NOT** try to decode the specific data values plotted, nor any underlying patterns/insights.',
                'Look only at the visible elements on the chart surface, their arrangement, and how they interact with each other and whether your initial impressions change upon closer inspection.'
            ],
            whatToFocusOn: [
                'Dense labels, overlapping text, or crowded annotations',
                'Heavy gridlines, excessive visual elements, or decorative components',
                'Overall visual noise and element density at first glance',
                'Whether the chart feels overwhelming or calm to look at initially'
            ],
            whatToIgnore: [
                'The actual data values or trends shown in the chart',
                'Your ability to understand the chart\'s message',
                'Whether the chart is "good" or "bad" from an analytical perspective',
                'The complexity of the underlying data or domain'
            ]
        }
    },
    'cognitive_load': {
        name: 'Cognitive Load (Extraneous)',
        definition: 'The mental effort required to parse the chart due to design choices (visual encoding, clutter, redundancy, scales, embellishments), not due to the underlying data complexity itself.',
        primaryQuestion: 'Which chart feels less mentally heavy to understand at a glance (i.e., requires less mental effort to parse and extract the main message)?',
        clarifyingSubtitle: 'Focus on design-induced mental effort, not data complexity',
        minViewTimeSeconds: 6,
        guidelines: {
            instructionSummary: [
                'Assume both charts show the same data; focus only on which design makes comprehension easier or harder.',
                'Answer based on the mental effort needed to identify key values/trends/comparisons—NOT on which chart you personally find prettier.',
                'Consider how quickly you can locate the legend/labels, understand encodings, and interpret scales.'
            ],
            whatToFocusOn: [
                'How many distinct visual cues you must track at once (color, size, shape, annotations, multiple legends).',
                'Whether you need to repeatedly switch attention between legend, labels, and marks to decode meaning.',
                'Whether the chart feels visually crowded or forces slow scanning.',
                'Scale complexity (dual y-axes, non-uniform spacing, multiple scales requiring constant checking)',
                'Legend/decoding overhead - how much back-and-forth eye movement is needed'
            ],
            whatToIgnore: [
                'Your familiarity with the topic/domain of the data (assume neutral).',
                'Whether you like the style aesthetically (unless it directly increases confusion or effort).',
                'Whether the data itself is complex (judge the design\'s added burden).'
            ],
            decisionHeuristic: 'Pick the chart that you believe a typical viewer could understand faster with fewer back-and-forth eye movements.'
        }
    }
};

// Current evaluation state
let currentCategory = 'clutter';
let currentDataset = null;
let currentSummaryId = null;
let currentQuestionId = null;

// Track saved responses for each category
let savedResponses = {
    'clutter': null,
    'cognitive_load': null
};

// Parse folder structure to get available datasets and their summary/question combinations
async function parseDatasetStructure() {
    try {
        // This would normally be done server-side, but for demo purposes we'll use hardcoded data
        const datasets = {
            'ATP_rendered_charts': [
                { folder: 'sum1_ques3_25', summaryId: 1, questionId: 3 },
                { folder: 'sum3_ques2_25', summaryId: 3, questionId: 2 }
            ],
            'fifa18_rendered_charts': [
                { folder: 'sum1_ques1_25', summaryId: 1, questionId: 1 },
                { folder: 'sum1_ques2_25', summaryId: 1, questionId: 2 },
                { folder: 'sum3_ques1_25', summaryId: 3, questionId: 1 },
                { folder: 'sum3_ques2_25', summaryId: 3, questionId: 2 }
            ],
            'Inc500Charts': [
                { folder: 'sum1_ques1_25', summaryId: 1, questionId: 1 },
                { folder: 'sum3_ques1_25', summaryId: 3, questionId: 1 },
                { folder: 'sum3_ques2_25', summaryId: 3, questionId: 2 }
            ]
        };
        
        return datasets;
    } catch (error) {
        console.error('Error parsing dataset structure:', error);
        return {};
    }
}

// Sample questions data (in production, this would be loaded from JSON files)
const questionsData = {
    'Data Set- Inc5000 Company List_2014_summaries': {
        filename: "Data Set- Inc5000 Company List_2014_summaries",
        csv_sample: "company,revenue,growth,industry,state_l,city,rank,workers,metro,yrs_on_list\\nFuhu,195640000,158956.91,Consumer Products & Services,California,El Segundo,1,227,Los Angeles,2\\nQuest Nutrition,82640563,57347.92,Food & Beverage,California,El Segundo,2,191,Los Angeles,1",
        questions: [
            {
                summary_idx: 1,
                target_audience: "Business executives, investors, and strategic planners seeking market expansion opportunities",
                questions: [
                    "Which industries consistently produce the highest-growth companies across different states, and are there regional patterns worth exploring?",
                    "In which cities do top-revenue companies cluster, and how do these economic hotspots align with industry categories?",
                    "Are there states or cities where high growth and high revenue frequently coincide for specific industries, indicating strategic investment opportunities?"
                ],
                metadata: {
                    curator_intention: "Encourage these decision makers to analyze high-growth sectors for potential investment, benchmarking, or location-based strategic expansion."
                }
            },
            {
                summary_idx: 3,
                target_audience: "Economic development officials, urban planners, and workforce strategists",
                questions: [
                    "Which metro areas host the highest average company workforce counts, and how does this vary across industries?",
                    "Are there specific industries that dominate employment in certain metro regions, suggesting strong sectoral clustering?",
                    "How does the distribution of large employers by metro area correlate with state-level talent strategies?"
                ],
                metadata: {
                    curator_intention: "Direct attention to employment concentrations and industrial diversity across metro areas."
                }
            }
        ]
    },
    'fifa18_clean_summaries': {
        filename: "FIFA 18 Player Data",
        csv_sample: "Name,Age,Nationality,Club,Wage (€),Value (€),Overall,Potential\\nCristiano Ronaldo,32,Portugal,Real Madrid CF,565000,95500000,94,94\\nL. Messi,30,Argentina,FC Barcelona,565000,105000000,93,93",
        questions: [
            {
                summary_idx: 1,
                target_audience: "Football club executives and talent acquisition managers",
                questions: [
                    "How does the average player wage compare to average overall rating across clubs, and are higher wage clubs consistently achieving better performance?",
                    "Which clubs have the greatest disparity between player value and wage, and what insights can this reveal for cost-effective squad building?",
                    "How does the age profile of players with the highest potential differ between clubs?"
                ],
                metadata: {
                    curator_intention: "Encourage decision makers to assess player value and performance in the context of club roster planning."
                }
            },
            {
                summary_idx: 3,
                target_audience: "Sports analysts and performance researchers",
                questions: [
                    "What are the key performance attributes that distinguish top-tier players from their peers?",
                    "How do different playing positions correlate with specific skill combinations?",
                    "Which nationalities show the strongest representation in elite clubs?"
                ],
                metadata: {
                    curator_intention: "Guide analysts to examine performance patterns and player attributes for strategic insights."
                }
            }
        ]
    },
    'atp_number_1_summaries': {
        filename: "ATP Tennis Rankings Data",  
        csv_sample: "player,rank,points,country,age,tournaments_played\\nNovak Djokovic,1,12113,Serbia,34,18\\nRafael Nadal,2,9850,Spain,35,15",
        questions: [
            {
                summary_idx: 1,
                target_audience: "Tennis analysts and sports commentators",
                questions: [
                    "How do ranking points correlate with tournament participation across different age groups?",
                    "Which countries produce the most consistently high-ranking players?",
                    "What patterns emerge in the relationship between age and competitive performance?"
                ],
                metadata: {
                    curator_intention: "Encourage analysis of tennis performance trends and player development patterns."
                }
            },
            {
                summary_idx: 3,
                target_audience: "Tennis coaches and talent scouts",
                questions: [
                    "At what age do players typically reach their peak ranking potential?",
                    "How does tournament activity vary among top-ranked players?",
                    "Which countries have the most effective player development programs?"
                ],
                metadata: {
                    curator_intention: "Guide talent development decisions based on performance data analysis."
                }
            }
        ]
    }
};

// Initialize the application for evaluation
async function init() {
    // Get URL parameters to determine which dataset/question/category to load
    const urlParams = new URLSearchParams(window.location.search);
    const dataset = urlParams.get('dataset') || 'Inc500Charts';
    const summaryId = parseInt(urlParams.get('summary')) || 1;
    const questionId = parseInt(urlParams.get('question')) || 1;
    const category = urlParams.get('category') || 'clutter';
    
    currentDataset = dataset;
    currentSummaryId = summaryId;
    currentQuestionId = questionId;
    currentCategory = category;
    
    loadMasterQuestion(dataset, summaryId, questionId);
    loadFixedImages(dataset);
    loadEvaluationForm(category);
    setupEventListeners();
    setupNavigation();
    showViewTimeWarning(category);
}

// Setup navigation between evaluation categories
function setupNavigation() {
    const navigationBar = document.querySelector('.navigation-bar');
    if (navigationBar) {
        const categories = Object.keys(evaluationCategories);
        const currentIndex = categories.indexOf(currentCategory);
        
        // Check save status for each category
        const clutterSaved = savedResponses.clutter ? '✅' : '⭕';
        const cognitiveLoadSaved = savedResponses.cognitive_load ? '✅' : '⭕';
        
        navigationBar.innerHTML = 
            '<div class="nav-controls">' +
            '<button id="prevBtn" class="nav-btn" ' + (currentIndex <= 0 ? 'disabled' : '') + '>← Previous Category</button>' +
            '<div class="category-info">' +
                '<span class="category-indicator">' + (currentIndex + 1) + ' of ' + categories.length + ': ' + evaluationCategories[currentCategory].name + '</span>' +
                '<div class="save-status">' +
                    '<span class="status-item" title="Visual Clutter status">Clutter: ' + clutterSaved + '</span>' +
                    '<span class="status-item" title="Cognitive Load status">Cognitive Load: ' + cognitiveLoadSaved + '</span>' +
                '</div>' +
            '</div>' +
            '<button id="nextBtn" class="nav-btn" ' + (currentIndex >= categories.length - 1 ? 'disabled' : '') + '>Next Category →</button>' +
            '</div>';
        
        // Add event listeners for navigation
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (prevBtn && !prevBtn.disabled) {
            prevBtn.addEventListener('click', function() { navigateToCategory(categories[currentIndex - 1]); });
        }
        
        if (nextBtn && !nextBtn.disabled) {
            nextBtn.addEventListener('click', function() { navigateToCategory(categories[currentIndex + 1]); });
        }
        
        // Add keyboard navigation
        document.addEventListener('keydown', handleKeyNavigation);
    }
}

// Handle keyboard navigation
function handleKeyNavigation(event) {
    if (event.ctrlKey || event.altKey) return; // Don't interfere with browser shortcuts
    
    const categories = Object.keys(evaluationCategories);
    const currentIndex = categories.indexOf(currentCategory);
    
    if (event.key === 'ArrowLeft' && currentIndex > 0) {
        event.preventDefault();
        navigateToCategory(categories[currentIndex - 1]);
    } else if (event.key === 'ArrowRight' && currentIndex < categories.length - 1) {
        event.preventDefault();
        navigateToCategory(categories[currentIndex + 1]);
    }
}

// Navigate to different evaluation category
function navigateToCategory(category) {
    // Check if current form has unsaved changes
    const hasUnsavedChanges = checkForUnsavedChanges();
    
    if (hasUnsavedChanges) {
        const shouldSave = confirm('You have unsaved responses for ' + evaluationCategories[currentCategory].name + '. Would you like to save them before navigating away?');
        if (shouldSave) {
            saveCurrentResponses();
        }
    }
    
    // Update current category
    currentCategory = category;
    
    // Update URL without reloading page
    const newUrl = new URL(window.location);
    newUrl.searchParams.set('category', category);
    window.history.pushState({category: category}, '', newUrl.toString());
    
    // Dynamically update the page content
    updatePageForCategory(category);
}

// Update page content for the new category
function updatePageForCategory(category) {
    // Update master question section with new guidelines
    loadMasterQuestion(currentDataset, currentSummaryId, currentQuestionId);
    
    // Update evaluation form
    loadEvaluationForm(category);
    
    // Update navigation
    setupNavigation();
    
    // Show appropriate view time warning
    showViewTimeWarning(category);
}

// Check if current form has unsaved changes
function checkForUnsavedChanges() {
    const form = document.querySelector('.question-form');
    if (!form) return false;
    
    const inputs = form.querySelectorAll('input[type="radio"]:checked, textarea');
    return inputs.length > 0 && !savedResponses[currentCategory];
}

// Load evaluation form based on category
function loadEvaluationForm(category) {
    const categoryConfig = evaluationCategories[category];
    const formSection = document.querySelector('.question-form');
    
    if (!formSection || !categoryConfig) {
        console.error('Unable to load form for category: ' + category);
        return;
    }
    
    if (category === 'clutter') {
        loadClutterEvaluationForm(formSection, categoryConfig);
    } else if (category === 'cognitive_load') {
        loadCognitiveLoadEvaluationForm(formSection, categoryConfig);
    }
    
    // Restore saved responses after form is loaded
    setTimeout(function() {
        restoreSavedResponses();
    }, 100);
}

// Load clutter evaluation form
function loadClutterEvaluationForm(formSection, categoryConfig) {
    const html = [
        '<div class="primary-question">',
        '<h3>' + categoryConfig.primaryQuestion + '</h3>',
        '<p class="clarifying-subtitle">' + categoryConfig.clarifyingSubtitle + '</p>',
        '<div class="forced-choice">',
        '<label><input type="radio" name="primary_clutter" value="Chart A"> Chart A looks more cluttered</label>',
        '<label><input type="radio" name="primary_clutter" value="Chart B"> Chart B looks more cluttered</label>',
        '<label><input type="radio" name="primary_clutter" value="About the same"> About the same</label>',
        '</div>',
        '</div>',
        
        '<div class="likert-questions">',
        '<h4>Rate each chart\'s clutter level:</h4>',
        '<div class="likert-group">',
        '<label class="likert-label">Chart A clutter level:</label>',
        '<div class="likert-scale">',
        '<span class="scale-label">Very Clean<br>(1)</span>',
        '<div class="radio-group">',
        [1,2,3,4,5,6,7].map(i => '<label><input type="radio" name="chart_a_clutter" value="' + i + '"><span>' + i + '</span></label>').join(''),
        '</div>',
        '<span class="scale-label">Very Cluttered<br>(7)</span>',
        '</div>',
        '</div>',
        
        '<div class="likert-group">',
        '<label class="likert-label">Chart B clutter level:</label>',
        '<div class="likert-scale">',
        '<span class="scale-label">Very Clean<br>(1)</span>',
        '<div class="radio-group">',
        [1,2,3,4,5,6,7].map(i => '<label><input type="radio" name="chart_b_clutter" value="' + i + '"><span>' + i + '</span></label>').join(''),
        '</div>',
        '<span class="scale-label">Very Cluttered<br>(7)</span>',
        '</div>',
        '</div>',
        '</div>',
        
        '<div class="confidence-question">',
        '<h4>How confident are you in your choice?</h4>',
        '<div class="likert-scale confidence-scale">',
        '<span class="scale-label">Not confident<br>(1)</span>',
        '<div class="radio-group">',
        [1,2,3,4,5].map(i => '<label><input type="radio" name="confidence" value="' + i + '"><span>' + i + '</span></label>').join(''),
        '</div>',
        '<span class="scale-label">Very confident<br>(5)</span>',
        '</div>',
        '</div>',
        
        '<div class="rationale-question">',
        '<h4>Briefly explain what made your chosen chart look more/less cluttered (optional):</h4>',
        '<textarea id="rationale" rows="3" placeholder="E.g., \'Chart A has overlapping labels and heavy gridlines...\'" maxlength="500"></textarea>',
        '</div>',
        
        '<div class="form-actions">' +
        '<button type="button" id="saveBtn" class="save-btn">💾 Save Responses</button>' +
        '<button type="button" id="submitBtn" class="submit-btn">Submit Evaluation</button>' +
        '</div>'
    ].join('');
    
    formSection.innerHTML = html;
}

// Load cognitive load evaluation form
function loadCognitiveLoadEvaluationForm(formSection, categoryConfig) {
    const html = [
        '<div class="primary-question">',
        '<h3>' + categoryConfig.primaryQuestion + '</h3>',
        '<p class="clarifying-subtitle">' + categoryConfig.clarifyingSubtitle + '</p>',
        '<div class="forced-choice">',
        '<label><input type="radio" name="primary_cognitive_load" value="Chart A"> Chart A requires less mental effort</label>',
        '<label><input type="radio" name="primary_cognitive_load" value="Chart B"> Chart B requires less mental effort</label>',
        '<label><input type="radio" name="primary_cognitive_load" value="About the same"> About the same</label>',
        '</div>',
        '</div>',
        
        '<div class="likert-questions">',
        '<h4>How mentally effortful is this chart to understand?</h4>',
        '<div class="likert-group">',
        '<label class="likert-label">Chart A mental effort:</label>',
        '<div class="likert-scale">',
        '<span class="scale-label">Very low effort<br>(1)</span>',
        '<div class="radio-group">',
        [1,2,3,4,5,6,7].map(i => '<label><input type="radio" name="chart_a_effort" value="' + i + '"><span>' + i + '</span></label>').join(''),
        '</div>',
        '<span class="scale-label">Very high effort<br>(7)</span>',
        '</div>',
        '</div>',
        
        '<div class="likert-group">',
        '<label class="likert-label">Chart B mental effort:</label>',
        '<div class="likert-scale">',
        '<span class="scale-label">Very low effort<br>(1)</span>',
        '<div class="radio-group">',
        [1,2,3,4,5,6,7].map(i => '<label><input type="radio" name="chart_b_effort" value="' + i + '"><span>' + i + '</span></label>').join(''),
        '</div>',
        '<span class="scale-label">Very high effort<br>(7)</span>',
        '</div>',
        '</div>',
        '</div>',
        
        '<div class="confidence-question">',
        '<h4>How confident are you in your choice?</h4>',
        '<div class="likert-scale confidence-scale">',
        '<span class="scale-label">Not confident<br>(1)</span>',
        '<div class="radio-group">',
        [1,2,3,4,5].map(i => '<label><input type="radio" name="confidence" value="' + i + '"><span>' + i + '</span></label>').join(''),
        '</div>',
        '<span class="scale-label">Very confident<br>(5)</span>',
        '</div>',
        '</div>',
        
        '<div class="rationale-question">',
        '<h4>Briefly explain what made your chosen chart feel easier/harder to parse (optional):</h4>',
        '<textarea id="rationale" rows="3" placeholder="E.g., \'Chart A has too many visual channels to track simultaneously...\'" maxlength="500"></textarea>',
        '</div>',
        
        '<div class="form-actions">' +
        '<button type="button" id="saveBtn" class="save-btn">💾 Save Responses</button>' +
        '<button type="button" id="submitBtn" class="submit-btn">Submit Evaluation</button>' +
        '</div>'
    ].join('');
    
    formSection.innerHTML = html;
}

// Load the master question based on dataset and IDs
function loadMasterQuestion(dataset, summaryId, questionId) {
    const datasetKey = datasetMappings[dataset];
    const questionData = questionsData[datasetKey];
    
    if (!questionData) {
        console.error('No question data found for dataset: ' + dataset);
        return;
    }
    
    // Find the specific summary
    const summary = questionData.questions.find(q => q.summary_idx === summaryId);
    if (!summary) {
        console.error('No summary found for summaryId: ' + summaryId);
        return;
    }
    
    // Get the specific question (questionId is 1-based, array is 0-based)
    const question = summary.questions[questionId - 1];
    if (!question) {
        console.error('No question found for questionId: ' + questionId);
        return;
    }
    
    // Update the master question section
    const masterQuestionSection = document.querySelector('.master-question-section');
    masterQuestionSection.innerHTML = [
        '<h2 class="master-question-title">Master Question</h2>',
        '<div class="dataset-info">',
        '<strong>Dataset:</strong> ' + questionData.filename + '<br>',
        '<strong>Target Audience:</strong> ' + summary.target_audience,
        '</div>',
        '<p class="master-question-text">',
        '<strong>' + question + '</strong>',
        '</p>',
        '<div class="curator-context">',
        '<em>Context: ' + summary.metadata.curator_intention + '</em>',
        '</div>',
        '<div class="additional-aspects">',
        '<h4>Additional Resources:</h4>',
        '<div class="aspect-links">',
        '<a href="#" onclick="showNarrativeSummary()" class="aspect-link">📄 Narrative Summary</a>',
        '<a href="#" onclick="showDataTableSample()" class="aspect-link">📊 Data Table Sample</a>',
        '</div>',
        '</div>',
        '<div class="assumption-note">',
        '<strong>Important:</strong> Both charts show visualizations of the same underlying dataset; only the visual design elements differ.',
        '</div>'
    ].join('');
    
    // Update guidelines section with category-specific content
    const categoryConfig = evaluationCategories[currentCategory];
    if (categoryConfig && categoryConfig.guidelines) {
        updateGuidelinesSection(categoryConfig.guidelines);
    }
}

// Show narrative summary modal
function showNarrativeSummary() {
    const datasetKey = datasetMappings[currentDataset];
    const questionData = questionsData[datasetKey];
    const summary = questionData.questions.find(q => q.summary_idx === currentSummaryId);
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = [
        '<div class="modal-content">',
        '<div class="modal-header">',
        '<h3>📄 Narrative Summary</h3>',
        '<button onclick="this.closest(\'.modal-overlay\').remove()" class="close-btn">&times;</button>',
        '</div>',
        '<div class="modal-body">',
        '<h4>Target Audience:</h4>',
        '<p>' + summary.target_audience + '</p>',
        '<h4>Curator\'s Intention:</h4>',
        '<p>' + summary.metadata.curator_intention + '</p>',
        '<h4>All Questions in this Summary:</h4>',
        '<ol>',
        summary.questions.map(q => '<li>' + q + '</li>').join(''),
        '</ol>',
        '</div>',
        '</div>'
    ].join('');
    document.body.appendChild(modal);
}

// Show data table sample modal with actual CSV data
async function showDataTableSample() {
    const datasetKey = datasetMappings[currentDataset];
    const questionData = questionsData[datasetKey];
    
    // Create modal with loading state
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = [
        '<div class="modal-content large-modal">',
        '<div class="modal-header">',
        '<h3>📊 Data Table Sample</h3>',
        '<button onclick="this.closest(\'.modal-overlay\').remove()" class="close-btn">&times;</button>',
        '</div>',
        '<div class="modal-body">',
        '<h4>Dataset: ' + questionData.filename + '</h4>',
        '<div class="data-table-container">',
        '<div class="loading-indicator">Loading table data...</div>',
        '</div>',
        '</div>',
        '</div>'
    ].join('');
    document.body.appendChild(modal);
    
    // Load and parse CSV data
    try {
        const csvData = await loadCSVData(currentDataset);
        const tableContainer = modal.querySelector('.data-table-container');
        tableContainer.innerHTML = createDataTable(csvData, 15); // Show top 15 entries
    } catch (error) {
        console.error('Error loading CSV data:', error);
        const tableContainer = modal.querySelector('.data-table-container');
        tableContainer.innerHTML = [
            '<div class="error-message">',
            '<p>Unable to load table data. Showing sample format:</p>',
            '<div class="data-sample">',
            '<pre>' + questionData.csv_sample + '</pre>',
            '</div>',
            '</div>'
        ].join('');
    }
}

// Show initial view time warning
function showViewTimeWarning(category) {
    const categoryConfig = evaluationCategories[category];
    const minViewTime = categoryConfig ? categoryConfig.minViewTimeSeconds : 4;
    
    const warningDiv = document.createElement('div');
    warningDiv.id = 'viewTimeWarning';
    warningDiv.style.cssText = 'position: fixed; top: 20px; right: 20px; background: #ffc107; color: #856404; padding: 15px; border-radius: 6px; border: 1px solid #ffeaa7; font-weight: 600; z-index: 1000; box-shadow: 0 2px 8px rgba(0,0,0,0.15);';
    warningDiv.innerHTML = '⏱️ Please view the charts for at least ' + minViewTime + ' seconds before answering';
    document.body.appendChild(warningDiv);
    
    // Remove warning after 6 seconds
    setTimeout(function() {
        const warning = document.getElementById('viewTimeWarning');
        if (warning) {
            warning.style.opacity = '0';
            setTimeout(function() { warning.remove(); }, 300);
        }
    }, 6000);
}

// Setup event listeners
function setupEventListeners() {
    // Use event delegation since form is dynamically loaded
    document.addEventListener('click', function(event) {
        if (event.target && event.target.id === 'submitBtn') {
            submitEvaluation();
        } else if (event.target && event.target.id === 'saveBtn') {
            saveCurrentResponses();
        }
    });
    
    // Track when user starts interacting
    document.addEventListener('change', trackUserInteraction);
}

let startTime = Date.now();
let userStartedInteracting = false;

function trackUserInteraction() {
    if (!userStartedInteracting) {
        userStartedInteracting = true;
        console.log('User started interacting at:', Date.now() - startTime, 'ms');
    }
}

// Save current responses without submitting
function saveCurrentResponses() {
    const formData = collectFormData();
    
    if (!formData.responses || Object.keys(formData.responses).length === 0) {
        alert('No responses to save. Please answer at least one question.');
        return;
    }
    
    // Save to memory
    savedResponses[currentCategory] = formData;
    
    // Save to localStorage for persistence
    const storageKey = 'evaluation_' + currentDataset + '_sum' + currentSummaryId + '_ques' + currentQuestionId;
    localStorage.setItem(storageKey, JSON.stringify(savedResponses));
    
    // Update navigation to show saved status
    setupNavigation();
    
    // Show success message
    showSaveConfirmation();
}

// Show save confirmation
function showSaveConfirmation() {
    const saveBtn = document.getElementById('saveBtn');
    if (saveBtn) {
        const originalText = saveBtn.innerHTML;
        saveBtn.innerHTML = '✅ Saved!';
        saveBtn.style.backgroundColor = '#28a745';
        
        setTimeout(function() {
            saveBtn.innerHTML = originalText;
            saveBtn.style.backgroundColor = '';
        }, 2000);
    }
}

// Restore saved responses when loading a form
function restoreSavedResponses() {
    const storageKey = 'evaluation_' + currentDataset + '_sum' + currentSummaryId + '_ques' + currentQuestionId;
    const saved = localStorage.getItem(storageKey);
    
    if (saved) {
        savedResponses = JSON.parse(saved);
    }
    
    const categoryData = savedResponses[currentCategory];
    if (categoryData && categoryData.responses) {
        const responses = categoryData.responses;
        
        // Restore radio button selections
        Object.keys(responses).forEach(function(key) {
            if (key !== 'rationale' && responses[key] !== null) {
                const input = document.querySelector('input[name="' + key.replace(/([A-Z])/g, '_$1').toLowerCase() + '"][value="' + responses[key] + '"]');
                if (input) {
                    input.checked = true;
                }
            }
        });
        
        // Restore textarea content
        if (responses.rationale) {
            const textarea = document.getElementById('rationale');
            if (textarea) {
                textarea.value = responses.rationale;
            }
        }
    }
}

// Collect all form data based on current category
function collectFormData() {
    const formData = {
        timestamp: new Date().toISOString(),
        viewTimeMs: Date.now() - startTime,
        dataset: currentDataset,
        summaryId: currentSummaryId,
        questionId: currentQuestionId,
        category: currentCategory,
        responses: {}
    };
    
    if (currentCategory === 'clutter') {
        // Primary clutter comparison
        const primaryClutter = document.querySelector('input[name="primary_clutter"]:checked');
        formData.responses.primaryClutter = primaryClutter ? primaryClutter.value : null;
        
        // Chart A clutter rating
        const chartAClutter = document.querySelector('input[name="chart_a_clutter"]:checked');
        formData.responses.chartAClutter = chartAClutter ? parseInt(chartAClutter.value) : null;
        
        // Chart B clutter rating  
        const chartBClutter = document.querySelector('input[name="chart_b_clutter"]:checked');
        formData.responses.chartBClutter = chartBClutter ? parseInt(chartBClutter.value) : null;
    } else if (currentCategory === 'cognitive_load') {
        // Primary cognitive load comparison
        const primaryCognitiveLoad = document.querySelector('input[name="primary_cognitive_load"]:checked');
        formData.responses.primaryCognitiveLoad = primaryCognitiveLoad ? primaryCognitiveLoad.value : null;
        
        // Chart A effort rating
        const chartAEffort = document.querySelector('input[name="chart_a_effort"]:checked');
        formData.responses.chartAEffort = chartAEffort ? parseInt(chartAEffort.value) : null;
        
        // Chart B effort rating  
        const chartBEffort = document.querySelector('input[name="chart_b_effort"]:checked');
        formData.responses.chartBEffort = chartBEffort ? parseInt(chartBEffort.value) : null;
    }
    
    // Confidence rating (common to both categories)
    const confidence = document.querySelector('input[name="confidence"]:checked');
    formData.responses.confidence = confidence ? parseInt(confidence.value) : null;
    
    // Open text rationale
    const rationale = document.getElementById('rationale');
    formData.responses.rationale = rationale ? rationale.value.trim() : null;
    
    return formData;
}

// Validate required fields based on current category
function validateForm() {
    const errors = [];
    
    if (currentCategory === 'clutter') {
        if (!document.querySelector('input[name="primary_clutter"]:checked')) {
            errors.push('Please select which chart looks more cluttered');
        }
        
        if (!document.querySelector('input[name="chart_a_clutter"]:checked')) {
            errors.push('Please rate Chart A\'s clutter level');
        }
        
        if (!document.querySelector('input[name="chart_b_clutter"]:checked')) {
            errors.push('Please rate Chart B\'s clutter level');
        }
    } else if (currentCategory === 'cognitive_load') {
        if (!document.querySelector('input[name="primary_cognitive_load"]:checked')) {
            errors.push('Please select which chart requires less mental effort');
        }
        
        if (!document.querySelector('input[name="chart_a_effort"]:checked')) {
            errors.push('Please rate Chart A\'s mental effort level');
        }
        
        if (!document.querySelector('input[name="chart_b_effort"]:checked')) {
            errors.push('Please rate Chart B\'s mental effort level');
        }
    }
    
    if (!document.querySelector('input[name="confidence"]:checked')) {
        errors.push('Please indicate your confidence level');
    }
    
    return errors;
}

// Submit evaluation
function submitEvaluation() {
    const errors = validateForm();
    
    if (errors.length > 0) {
        alert('Please complete the following:\\n\\n• ' + errors.join('\\n• '));
        return;
    }
    
    // Check minimum view time based on category
    const categoryConfig = evaluationCategories[currentCategory];
    const minViewTime = categoryConfig ? categoryConfig.minViewTimeSeconds * 1000 : 4000;
    const viewTime = Date.now() - startTime;
    
    if (viewTime < minViewTime) {
        if (!confirm('You viewed the charts for ' + Math.round(viewTime/1000) + ' seconds. The minimum recommended time is ' + Math.round(minViewTime/1000) + ' seconds. Submit anyway?')) {
            return;
        }
    }
    
    const formData = collectFormData();
    
    // Show success message
    showSubmissionSuccess(formData);
}

// Show submission success
function showSubmissionSuccess(formData) {
    const formSection = document.querySelector('.question-form');
    
    const responseDetails = currentCategory === 'clutter' 
        ? 'Primary choice: ' + (formData.responses.primaryClutter || 'Not selected') + '<br>' +
          'Chart A rating: ' + (formData.responses.chartAClutter || 'Not rated') + '/7<br>' +
          'Chart B rating: ' + (formData.responses.chartBClutter || 'Not rated') + '/7'
        : 'Primary choice: ' + (formData.responses.primaryCognitiveLoad || 'Not selected') + '<br>' +
          'Chart A effort: ' + (formData.responses.chartAEffort || 'Not rated') + '/7<br>' +
          'Chart B effort: ' + (formData.responses.chartBEffort || 'Not rated') + '/7';
    
    formSection.innerHTML = [
        '<div style="text-align: center; padding: 40px; background-color: #d4edda; border-radius: 8px; margin: 20px 0;">',
        '<h3 style="color: #155724; margin-bottom: 15px;">✅ Evaluation Complete!</h3>',
        '<p style="color: #155724; margin-bottom: 20px;">',
        'Thank you for your ' + evaluationCategories[currentCategory].name.toLowerCase() + ' evaluation. Your responses have been recorded.',
        '</p>',
        '<div style="background: rgba(0,0,0,0.1); padding: 15px; border-radius: 6px; margin: 20px 0;">',
        '<strong>Category:</strong> ' + evaluationCategories[currentCategory].name + '<br>',
        '<strong>Dataset:</strong> ' + formData.dataset + '<br>',
        '<strong>Summary ID:</strong> ' + formData.summaryId + ', <strong>Question ID:</strong> ' + formData.questionId + '<br>',
        '<strong>View time:</strong> ' + Math.round(formData.viewTimeMs/1000) + ' seconds<br>',
        responseDetails + '<br>',
        '<strong>Confidence:</strong> ' + (formData.responses.confidence || 'Not rated') + '/5',
        '</div>',
        '<button onclick="exportResults()" style="background-color: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">',
        'Export Results',
        '</button>',
        '</div>'
    ].join('');
    
    console.log('Evaluation Results:', formData);
    
    // Store results globally for export
    window.evaluationResults = formData;
}

// Export results function
function exportResults() {
    const formData = window.evaluationResults || collectFormData();
    
    const results = {
        evaluationType: evaluationCategories[currentCategory].name,
        completedAt: new Date().toISOString(),
        dataset: formData.dataset,
        summaryId: formData.summaryId,
        questionId: formData.questionId,
        category: formData.category,
        construct: {
            name: evaluationCategories[currentCategory].name,
            definition: evaluationCategories[currentCategory].definition
        },
        responses: formData.responses,
        metadata: {
            viewTimeMs: formData.viewTimeMs,
            userAgent: navigator.userAgent,
            screenResolution: screen.width + 'x' + screen.height,
            timestamp: formData.timestamp
        }
    };
    
    const dataStr = JSON.stringify(results, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = currentCategory + '_evaluation_' + formData.dataset + '_sum' + formData.summaryId + '_ques' + formData.questionId + '_' + Date.now() + '.json';
    link.click();
    
    console.log('Results exported:', results);
}

// Hardcoded CSV data for demonstration (fallback when files can't be loaded)
const fallbackCSVData = {
    'Inc500Charts': "rank,workers,company,revenue,growth,industry,state_l,city,metro,yrs_on_list\\n1,227,Fuhu,195640000,158956.91,Consumer Products & Services,California,El Segundo,Los Angeles,2\\n2,191,Quest Nutrition,82640563,57347.92,Food & Beverage,California,El Segundo,Los Angeles,1\\n3,108,Vacasa,51869307,52059.52,Travel & Hospitality,Oregon,Portland,Portland,1\\n4,62,Active Wellness,43158688,41977.23,Health,California,San Diego,San Diego,1\\n5,750,Lumos Networks,42082811,41093.89,Telecommunications,Virginia,Richmond,Richmond,3\\n6,150,FIGS,40975692,40018.11,Consumer Products & Services,California,Santa Monica,Los Angeles,1\\n7,51,iHeartMedia,39846336,38975.12,Media,Texas,San Antonio,San Antonio,2\\n8,290,Shopify,38951447,38095.45,Software,Canada,Ottawa,Ottawa,2\\n9,125,Rocket Internet,37962558,37154.78,Software,Germany,Berlin,Berlin,1\\n10,88,ThoughtSpot,36954669,36104.11,Software,California,Palo Alto,San Francisco,1\\n11,200,Snapchat,35946780,35045.44,Social Networking,California,Los Angeles,Los Angeles,1\\n12,175,Pinterest,34938891,34016.77,Social Networking,California,San Francisco,San Francisco,1\\n13,95,Workday,33931002,32988.10,Software,California,Pleasanton,San Francisco,3\\n14,145,Salesforce,32923113,31959.43,Software,California,San Francisco,San Francisco,4\\n15,380,ServiceNow,31915224,30930.76,Software,California,Santa Clara,San Francisco,2",
    
    'fifa18_rendered_charts': "Wage (€),Value (€),Name,Age,Photo,Nationality,Overall,Potential,Club,Special,Acceleration,Sprint speed\\n565000,95500000,Cristiano Ronaldo,32,https://cdn.sofifa.org/48/18/players/20801.png,Portugal,94,94,Real Madrid CF,2228,89,91\\n565000,105000000,L. Messi,30,https://cdn.sofifa.org/48/18/players/158023.png,Argentina,93,93,FC Barcelona,2154,92,87\\n280000,123000000,Neymar,25,https://cdn.sofifa.org/48/18/players/190871.png,Brazil,92,94,Paris Saint-Germain,2100,94,90\\n510000,97000000,L. Suárez,30,https://cdn.sofifa.org/48/18/players/176580.png,Uruguay,92,92,FC Barcelona,2291,88,77\\n355000,92000000,R. Lewandowski,28,https://cdn.sofifa.org/48/18/players/188545.png,Poland,91,91,FC Bayern Munich,2143,79,83\\n215000,64500000,De Gea,26,https://cdn.sofifa.org/48/18/players/193080.png,Spain,90,92,Manchester United,1458,57,58\\n295000,90500000,E. Hazard,26,https://cdn.sofifa.org/48/18/players/183277.png,Belgium,90,91,Chelsea,2096,93,87\\n340000,79000000,T. Kroos,27,https://cdn.sofifa.org/48/18/players/182521.png,Germany,90,90,Real Madrid CF,2165,60,52\\n275000,77000000,G. Higuaín,29,https://cdn.sofifa.org/48/18/players/167664.png,Argentina,90,90,Juventus,1961,78,80\\n310000,52000000,Sergio Ramos,31,https://cdn.sofifa.org/48/18/players/155862.png,Spain,90,90,Real Madrid CF,2153,75,77\\n285000,83000000,K. De Bruyne,26,https://cdn.sofifa.org/48/18/players/192985.png,Belgium,89,92,Manchester City,2162,76,75\\n190000,59000000,T. Courtois,25,https://cdn.sofifa.org/48/18/players/192119.png,Belgium,89,92,Chelsea,1282,46,52\\n265000,67500000,A. Sánchez,28,https://cdn.sofifa.org/48/18/players/184941.png,Chile,89,89,Arsenal,2181,88,84\\n340000,57000000,L. Modrić,31,https://cdn.sofifa.org/48/18/players/177003.png,Croatia,89,89,Real Madrid CF,2228,75,71\\n370000,69500000,G. Bale,27,https://cdn.sofifa.org/48/18/players/173731.png,Wales,89,89,Real Madrid CF,2263,93,95",

    'ATP_rendered_charts': "Player,DOB,Cumulative Weeks,Date,Sex,Weeks,Age (days),Age (years)\\nIlie Nastase,7/19/1946,40,8/23/1973,Male,40,9897,27.09\\nJohn Newcombe,5/23/1944,8,6/3/1974,Male,8,10968,30.03\\nJimmy Connors,9/2/1952,160,7/29/1974,Male,160,8000,21.90\\nBjörn Borg,6/6/1956,1,8/23/1977,Male,1,7748,21.21\\nJimmy Connors,9/2/1952,244,8/30/1977,Male,84,9128,24.99\\nBjörn Borg,6/6/1956,7,4/9/1979,Male,6,8342,22.84\\nJimmy Connors,9/2/1952,251,5/21/1979,Male,7,9757,26.71\\nBjörn Borg,6/6/1956,41,7/9/1979,Male,34,8433,23.09\\nJohn McEnroe,2/16/1959,3,3/3/1980,Male,3,7686,21.04\\nBjörn Borg,6/6/1956,61,3/24/1980,Male,20,8692,23.80\\nJohn McEnroe,2/16/1959,4,8/11/1980,Male,1,7847,21.48\\nBjörn Borg,6/6/1956,107,8/18/1980,Male,46,8839,24.20\\nJohn McEnroe,2/16/1959,6,7/6/1981,Male,2,8176,22.38\\nBjörn Borg,6/6/1956,109,7/20/1981,Male,2,9175,25.12\\nJohn McEnroe,2/16/1959,64,8/3/1981,Male,58,8204,22.46"
};

// Load CSV data from the csv folder
async function loadCSVData(dataset) {
    const csvFilenames = {
        'ATP_rendered_charts': 'atp_number_1.csv',
        'fifa18_rendered_charts': 'fifa18_clean.csv', 
        'Inc500Charts': 'Inc5000_Company_List_2014.csv'
    };
    
    const filename = csvFilenames[dataset];
    if (!filename) {
        throw new Error('No CSV file mapping found for dataset: ' + dataset);
    }
    
    try {
        const response = await fetch('csv/' + filename);
        if (!response.ok) {
            throw new Error('Failed to load CSV file: ' + filename + ' (Status: ' + response.status + ')');
        }
        
        const csvText = await response.text();
        return parseCSV(csvText);
    } catch (error) {
        console.error('Error loading CSV file:', error);
        console.log('Using fallback CSV data');
        const fallbackText = fallbackCSVData[dataset];
        if (fallbackText) {
            return parseCSV(fallbackText.replace(/\\n/g, '\\n'));
        } else {
            throw new Error('No fallback data available for dataset: ' + dataset);
        }
    }
}

// Parse CSV text into array of objects
function parseCSV(csvText) {
    const lines = csvText.trim().split('\\n');
    const headers = lines[0].split(',').map(function(header) { return header.trim(); });
    const data = [];
    
    for (let i = 1; i < lines.length && i <= 15; i++) {
        const values = parseCSVLine(lines[i]);
        if (values.length === headers.length) {
            const row = {};
            headers.forEach(function(header, index) {
                row[header] = values[index];
            });
            data.push(row);
        }
    }
    
    return { headers: headers, data: data };
}

// Parse a single CSV line, handling quoted values
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current.trim());
            current = '';
        } else {
            current += char;
        }
    }
    
    result.push(current.trim());
    return result;
}

// Create HTML table from parsed CSV data
function createDataTable(csvData, maxRows) {
    maxRows = maxRows || 15;
    const headers = csvData.headers;
    const data = csvData.data;
    
    if (!data || data.length === 0) {
        return '<p>No data available</p>';
    }
    
    const displayHeaders = headers;
    
    let html = [
        '<div class="table-info">',
        '<p><strong>Showing top ' + Math.min(data.length, maxRows) + ' entries</strong> ',
        '(' + displayHeaders.length + ' columns shown)</p>',
        '</div>',
        '<div class="table-wrapper">',
        '<table class="data-table">',
        '<thead>',
        '<tr>',
        displayHeaders.map(function(header) { return '<th>' + header + '</th>'; }).join(''),
        '</tr>',
        '</thead>',
        '<tbody>'
    ].join('');
    
    const displayData = data.slice(0, maxRows);
    
    displayData.forEach(function(row) {
        html += '<tr>';
        displayHeaders.forEach(function(header) {
            const cellValue = row[header] || '';
            const truncatedValue = cellValue.length > 50 ? cellValue.substring(0, 47) + '...' : cellValue;
            html += '<td title="' + cellValue + '">' + truncatedValue + '</td>';
        });
        html += '</tr>';
    });
    
    html += [
        '</tbody>',
        '</table>',
        '</div>',
        '<div class="table-footer">',
        '<p><em>Note: This table shows a sample of the data structure and content. The complete dataset may contain many more rows.</em></p>',
        '</div>'
    ].join('');
    
    return html;
}

// Load fixed images that remain constant
function loadFixedImages(dataset) {
    const chartTitles = {
        'ATP_rendered_charts': ['ATP Chart A', 'ATP Chart B'],
        'fifa18_rendered_charts': ['FIFA Chart A', 'FIFA Chart B'], 
        'Inc500Charts': ['Inc5000 Chart A', 'Inc5000 Chart B']
    };
    
    const titles = chartTitles[dataset] || ['Chart A', 'Chart B'];
    
    // Update Image 1 
    document.getElementById('imageTitle1').textContent = titles[0];
    document.getElementById('imageScore1').textContent = "";
    document.getElementById('relevance1').textContent = "Dense labels";
    document.getElementById('chartErrors1').textContent = "Heavy gridlines";
    document.getElementById('clarity1').textContent = "Decorative elements";
    document.getElementById('designQuality1').textContent = "";
    document.getElementById('description1').textContent = '[' + titles[0] + ' - Contains various visual elements that may contribute to clutter]';
    
    // Update Image 2
    document.getElementById('imageTitle2').textContent = titles[1];
    document.getElementById('imageScore2').textContent = "";
    document.getElementById('relevance2').textContent = "Minimal labels";
    document.getElementById('chartErrors2').textContent = "Reduced ink";
    document.getElementById('clarity2').textContent = "Clean design";
    document.getElementById('designQuality2').textContent = "";
    document.getElementById('description2').textContent = '[' + titles[1] + ' - Features simplified visual design with fewer elements]';
    
    // Remove any highlighting since we're comparing
    document.getElementById('imageCard1').classList.remove('highlighted');
    document.getElementById('imageCard2').classList.remove('highlighted');
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', init);

// Handle browser back/forward navigation
window.addEventListener('popstate', function(event) {
    if (event.state && event.state.category) {
        currentCategory = event.state.category;
        updatePageForCategory(currentCategory);
    }
});