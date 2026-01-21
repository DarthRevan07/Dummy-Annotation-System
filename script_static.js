// Static implementation for category switching
let currentCategory = 'clutter';
let currentPairId = null;
let allPairEvaluations = {}; // Store evaluations per pair
let savedResponses = {
    'clutter': {},
    'cognitive_load': {},
    'interpretability': {},
    'style': {}
};

// Initialize pair evaluation when a new pair is loaded
function initializePairEvaluation(pairId, pairMetadata) {
    currentPairId = pairId;
    
    if (!allPairEvaluations[pairId]) {
        allPairEvaluations[pairId] = {
            pairId: pairId,
            metadata: pairMetadata,
            evaluations: {
                clutter: { completed: false, responses: {} },
                cognitive_load: { completed: false, responses: {} },
                interpretability: { completed: false, responses: {} },
                style: { completed: false, responses: {} }
            },
            startedAt: new Date().toISOString(),
            completedAt: null,
            completionStatus: {
                clutter: false,
                cognitive_load: false,
                interpretability: false,
                style: false
            }
        };
    }
    
    // Update UI to show current pair evaluation status
    updateEvaluationStatus();
}

// Show specific category content
function showCategory(category) {
    currentCategory = category;
    
    // Update navigation tabs
    document.getElementById('clutterTab').classList.toggle('active', category === 'clutter');
    document.getElementById('cognitiveTab').classList.toggle('active', category === 'cognitive_load');
    document.getElementById('interpretabilityTab').classList.toggle('active', category === 'interpretability');
    document.getElementById('styleTab').classList.toggle('active', category === 'style');
    
    // Show/hide guidelines
    document.getElementById('clutterGuidelines').style.display = category === 'clutter' ? 'block' : 'none';
    document.getElementById('cognitiveGuidelines').style.display = category === 'cognitive_load' ? 'block' : 'none';
    document.getElementById('interpretabilityGuidelines').style.display = category === 'interpretability' ? 'block' : 'none';
    document.getElementById('styleGuidelines').style.display = category === 'style' ? 'block' : 'none';
    
    // Show/hide forms
    document.getElementById('clutterForm').style.display = category === 'clutter' ? 'block' : 'none';
    document.getElementById('cognitiveForm').style.display = category === 'cognitive_load' ? 'block' : 'none';
    document.getElementById('interpretabilityForm').style.display = category === 'interpretability' ? 'block' : 'none';
    document.getElementById('styleForm').style.display = category === 'style' ? 'block' : 'none';
    
    // Load saved responses for current pair and category
    loadSavedResponsesForCurrentPair(category);
    
    // Update page title based on category
    const categoryNames = {
        'clutter': 'Visual Clutter Evaluation',
        'cognitive_load': 'Cognitive Load Evaluation',
        'interpretability': 'Interpretability Evaluation',
        'style': 'Style Evaluation'
    };
    document.title = categoryNames[category] + ' - Chart Evaluation System';
    
    // Update evaluation status indicators
    updateEvaluationStatus();
}

// Save clutter responses for current pair
function saveClutterResponses() {
    if (!currentPairId) {
        alert('No pair loaded for evaluation');
        return;
    }
    
    const responses = {};
    
    // Primary question
    const primary = document.querySelector('input[name="primary_clutter"]:checked');
    responses.primary_clutter = primary ? primary.value : null;
    
    // Chart A rating
    const chartARating = document.querySelector('input[name="chart_a_clutter"]:checked');
    responses.chart_a_clutter = chartARating ? parseInt(chartARating.value) : null;
    
    // Chart B rating
    const chartBRating = document.querySelector('input[name="chart_b_clutter"]:checked');
    responses.chart_b_clutter = chartBRating ? parseInt(chartBRating.value) : null;
    
    // Rationale
    responses.rationale_clutter = document.getElementById('rationale_clutter').value.trim();
    
    // Update pair evaluation
    allPairEvaluations[currentPairId].evaluations.clutter = {
        completed: true,
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Update completion status
    allPairEvaluations[currentPairId].completionStatus.clutter = true;
    
    // Save to localStorage
    localStorage.setItem('pairEvaluations', JSON.stringify(allPairEvaluations));
    
    // Update UI
    updateEvaluationStatus();
    
    alert('Visual Clutter responses saved successfully!');
}
    
    // Chart A rating
    const chartA = document.querySelector('input[name="chart_a_clutter"]:checked');
    responses.chart_a_clutter = chartA ? parseInt(chartA.value) : null;
    
    // Chart B rating
    const chartB = document.querySelector('input[name="chart_b_clutter"]:checked');
    responses.chart_b_clutter = chartB ? parseInt(chartB.value) : null;
    
    // Confidence
    const confidence = document.querySelector('input[name="confidence_clutter"]:checked');
    responses.confidence_clutter = confidence ? parseInt(confidence.value) : null;
    
    // Rationale
    const rationale = document.getElementById('rationale_clutter');
    responses.rationale_clutter = rationale ? rationale.value.trim() : null;
    
    // Save to memory
    savedResponses.clutter = {
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('evaluation_clutter', JSON.stringify(savedResponses.clutter));
    
    // Show confirmation
    showSaveConfirmation('clutter');
}

// Save cognitive load responses for current pair
function saveCognitiveResponses() {
    if (!currentPairId) {
        alert('No pair loaded for evaluation');
        return;
    }
    
    const responses = {};
    
    // Primary question
    const primary = document.querySelector('input[name="primary_cognitive_load"]:checked');
    responses.primary_cognitive_load = primary ? primary.value : null;
    
    // Chart A rating
    const chartARating = document.querySelector('input[name="chart_a_cognitive"]:checked');
    responses.chart_a_cognitive = chartARating ? parseInt(chartARating.value) : null;
    
    // Chart B rating
    const chartBRating = document.querySelector('input[name="chart_b_cognitive"]:checked');
    responses.chart_b_cognitive = chartBRating ? parseInt(chartBRating.value) : null;
    
    // Rationale
    responses.rationale_cognitive = document.getElementById('rationale_cognitive').value.trim();
    
    // Update pair evaluation
    allPairEvaluations[currentPairId].evaluations.cognitive_load = {
        completed: true,
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Update completion status
    allPairEvaluations[currentPairId].completionStatus.cognitive_load = true;
    
    // Save to localStorage
    localStorage.setItem('pairEvaluations', JSON.stringify(allPairEvaluations));
    
    // Update UI
    updateEvaluationStatus();
    
    alert('Cognitive Load responses saved successfully!');
}
    
    // Primary question
    const primary = document.querySelector('input[name="primary_cognitive_load"]:checked');
    responses.primary_cognitive_load = primary ? primary.value : null;
    
    // Chart A effort
    const chartA = document.querySelector('input[name="chart_a_effort"]:checked');
    responses.chart_a_effort = chartA ? parseInt(chartA.value) : null;
    
    // Chart B effort
    const chartB = document.querySelector('input[name="chart_b_effort"]:checked');
    responses.chart_b_effort = chartB ? parseInt(chartB.value) : null;
    
    // Confidence
    const confidence = document.querySelector('input[name="confidence_cognitive"]:checked');
    responses.confidence_cognitive = confidence ? parseInt(confidence.value) : null;
    
    // Rationale
    const rationale = document.getElementById('rationale_cognitive');
    responses.rationale_cognitive = rationale ? rationale.value.trim() : null;
    
    // Save to memory
    savedResponses.cognitive_load = {
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('evaluation_cognitive_load', JSON.stringify(savedResponses.cognitive_load));
    
    // Show confirmation
    showSaveConfirmation('cognitive_load');
}

// Save interpretability responses for current pair
function saveInterpretabilityResponses() {
    if (!currentPairId) {
        alert('No pair loaded for evaluation');
        return;
    }
    
    const responses = {};
    
    // Primary question
    const primary = document.querySelector('input[name="primary_interpretability"]:checked');
    responses.primary_interpretability = primary ? primary.value : null;
    
    // Chart A rating
    const chartARating = document.querySelector('input[name="chart_a_interpretability"]:checked');
    responses.chart_a_interpretability = chartARating ? parseInt(chartARating.value) : null;
    
    // Chart B rating
    const chartBRating = document.querySelector('input[name="chart_b_interpretability"]:checked');
    responses.chart_b_interpretability = chartBRating ? parseInt(chartBRating.value) : null;
    
    // Rationale
    responses.rationale_interpretability = document.getElementById('rationale_interpretability').value.trim();
    
    // Update pair evaluation
    allPairEvaluations[currentPairId].evaluations.interpretability = {
        completed: true,
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Update completion status
    allPairEvaluations[currentPairId].completionStatus.interpretability = true;
    
    // Save to localStorage
    localStorage.setItem('pairEvaluations', JSON.stringify(allPairEvaluations));
    
    // Update UI
    updateEvaluationStatus();
    
    alert('Interpretability responses saved successfully!');
}
    
    // Primary question
    const primary = document.querySelector('input[name="primary_interpretability"]:checked');
    responses.primary_interpretability = primary ? primary.value : null;
    
    // Chart A clarity
    const chartA = document.querySelector('input[name="chart_a_clarity"]:checked');
    responses.chart_a_clarity = chartA ? parseInt(chartA.value) : null;
    
    // Chart B clarity
    const chartB = document.querySelector('input[name="chart_b_clarity"]:checked');
    responses.chart_b_clarity = chartB ? parseInt(chartB.value) : null;
    
    // Confidence
    const confidence = document.querySelector('input[name="confidence_interpretability"]:checked');
    responses.confidence_interpretability = confidence ? parseInt(confidence.value) : null;
    
    // Rationale
    const rationale = document.getElementById('rationale_interpretability');
    responses.rationale_interpretability = rationale ? rationale.value.trim() : null;
    
    // Save to memory
    savedResponses.interpretability = {
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('evaluation_interpretability', JSON.stringify(savedResponses.interpretability));
    
    // Show confirmation
    showSaveConfirmation('interpretability');
}

// Save style responses for current pair
function saveStyleResponses() {
    if (!currentPairId) {
        alert('No pair loaded for evaluation');
        return;
    }
    
    const responses = {};
    
    // Style question
    const styleQ1 = document.querySelector('input[name="style_q1"]:checked');
    responses.style_q1 = styleQ1 ? styleQ1.value : null;
    
    // Update pair evaluation
    allPairEvaluations[currentPairId].evaluations.style = {
        completed: true,
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Update completion status
    allPairEvaluations[currentPairId].completionStatus.style = true;
    
    // Save to localStorage
    localStorage.setItem('pairEvaluations', JSON.stringify(allPairEvaluations));
    
    // Update UI
    updateEvaluationStatus();
    
    alert('Style responses saved successfully!');
}
    
    // Primary question
    const primary = document.querySelector('input[name="primary_style"]:checked');
    responses.primary_style = primary ? primary.value : null;
    
    // Chart A appeal
    const chartA = document.querySelector('input[name="chart_a_appeal"]:checked');
    responses.chart_a_appeal = chartA ? parseInt(chartA.value) : null;
    
    // Chart B appeal
    const chartB = document.querySelector('input[name="chart_b_appeal"]:checked');
    responses.chart_b_appeal = chartB ? parseInt(chartB.value) : null;
    
    // Confidence
    const confidence = document.querySelector('input[name="confidence_style"]:checked');
    responses.confidence_style = confidence ? parseInt(confidence.value) : null;
    
    // Rationale
    const rationale = document.getElementById('rationale_style');
    responses.rationale_style = rationale ? rationale.value.trim() : null;
    
    // Save to memory
    savedResponses.style = {
        responses: responses,
        timestamp: new Date().toISOString()
    };
    
    // Save to localStorage
    localStorage.setItem('evaluation_style', JSON.stringify(savedResponses.style));
    
    // Show confirmation
    showSaveConfirmation('style');
}

// Show save confirmation
function showSaveConfirmation(category) {
    const buttonSelectors = {
        'clutter': 'button[onclick="saveClutterResponses()"]',
        'cognitive_load': 'button[onclick="saveCognitiveResponses()"]',
        'interpretability': 'button[onclick="saveInterpretabilityResponses()"]',
        'style': 'button[onclick="saveStyleResponses()"]'
    };
    
    const button = document.querySelector(buttonSelectors[category]);
    
    if (button) {
        const originalText = button.innerHTML;
        button.innerHTML = '✅ Saved!';
        button.style.backgroundColor = '#28a745';
        
        setTimeout(function() {
            button.innerHTML = originalText;
            button.style.backgroundColor = '';
        }, 2000);
    }
}

// Validate form based on category
function validateForm(category) {
    const errors = [];
    
    if (category === 'clutter') {
        if (!document.querySelector('input[name="primary_clutter"]:checked')) {
            errors.push('Please select which chart looks more cluttered');
        }
        if (!document.querySelector('input[name="chart_a_clutter"]:checked')) {
            errors.push('Please rate Chart A\'s clutter level');
        }
        if (!document.querySelector('input[name="chart_b_clutter"]:checked')) {
            errors.push('Please rate Chart B\'s clutter level');
        }
        if (!document.querySelector('input[name="confidence_clutter"]:checked')) {
            errors.push('Please indicate your confidence level');
        }
    } else if (category === 'cognitive_load') {
        if (!document.querySelector('input[name="primary_cognitive_load"]:checked')) {
            errors.push('Please select which chart requires less mental effort');
        }
        if (!document.querySelector('input[name="chart_a_effort"]:checked')) {
            errors.push('Please rate Chart A\'s mental effort level');
        }
        if (!document.querySelector('input[name="chart_b_effort"]:checked')) {
            errors.push('Please rate Chart B\'s mental effort level');
        }
        if (!document.querySelector('input[name="confidence_cognitive"]:checked')) {
            errors.push('Please indicate your confidence level');
        }
    } else if (category === 'interpretability') {
        if (!document.querySelector('input[name="primary_interpretability"]:checked')) {
            errors.push('Please select which chart is more interpretable');
        }
        if (!document.querySelector('input[name="chart_a_clarity"]:checked')) {
            errors.push('Please rate Chart A\'s clarity level');
        }
        if (!document.querySelector('input[name="chart_b_clarity"]:checked')) {
            errors.push('Please rate Chart B\'s clarity level');
        }
        if (!document.querySelector('input[name="confidence_interpretability"]:checked')) {
            errors.push('Please indicate your confidence level');
        }
    } else if (category === 'style') {
        if (!document.querySelector('input[name="primary_style"]:checked')) {
            errors.push('Please select which chart looks better designed');
        }
        if (!document.querySelector('input[name="chart_a_appeal"]:checked')) {
            errors.push('Please rate Chart A\'s design appeal');
        }
        if (!document.querySelector('input[name="chart_b_appeal"]:checked')) {
            errors.push('Please rate Chart B\'s design appeal');
        }
        if (!document.querySelector('input[name="confidence_style"]:checked')) {
            errors.push('Please indicate your confidence level');
        }
    }
    
    return errors;
}

// Submit evaluation
function submitEvaluation(category) {
    const errors = validateForm(category);
    
    if (errors.length > 0) {
        alert('Please complete the following:\n\n• ' + errors.join('\n• '));
        return;
    }
    
    // Auto-save before submitting
    if (category === 'clutter') {
        saveClutterResponses();
    } else if (category === 'cognitive_load') {
        saveCognitiveResponses();
    } else if (category === 'interpretability') {
        saveInterpretabilityResponses();
    } else if (category === 'style') {
        saveStyleResponses();
    }
    
    // Show success message
    showSubmissionSuccess(category);
}

// Show submission success
function showSubmissionSuccess(category) {
    const formIds = {
        'clutter': 'clutterForm',
        'cognitive_load': 'cognitiveForm',
        'interpretability': 'interpretabilityForm',
        'style': 'styleForm'
    };
    
    const categoryNames = {
        'clutter': 'Visual Clutter',
        'cognitive_load': 'Cognitive Load (Extraneous)',
        'interpretability': 'Interpretability (Confusion / Ambiguity)',
        'style': 'Style (Aesthetic Appeal)'
    };
    
    const form = document.getElementById(formIds[category]);
    const categoryName = categoryNames[category];
    const responses = savedResponses[category].responses;
    
    let responseDetails = '';
    if (category === 'clutter') {
        responseDetails = 
            'Primary choice: ' + (responses.primary_clutter || 'Not selected') + '<br>' +
            'Chart A rating: ' + (responses.chart_a_clutter || 'Not rated') + '/7<br>' +
            'Chart B rating: ' + (responses.chart_b_clutter || 'Not rated') + '/7<br>' +
            'Confidence: ' + (responses.confidence_clutter || 'Not rated') + '/5';
    } else if (category === 'cognitive_load') {
        responseDetails = 
            'Primary choice: ' + (responses.primary_cognitive_load || 'Not selected') + '<br>' +
            'Chart A effort: ' + (responses.chart_a_effort || 'Not rated') + '/7<br>' +
            'Chart B effort: ' + (responses.chart_b_effort || 'Not rated') + '/7<br>' +
            'Confidence: ' + (responses.confidence_cognitive || 'Not rated') + '/5';
    } else if (category === 'interpretability') {
        responseDetails = 
            'Primary choice: ' + (responses.primary_interpretability || 'Not selected') + '<br>' +
            'Chart A clarity: ' + (responses.chart_a_clarity || 'Not rated') + '/7<br>' +
            'Chart B clarity: ' + (responses.chart_b_clarity || 'Not rated') + '/7<br>' +
            'Confidence: ' + (responses.confidence_interpretability || 'Not rated') + '/5';
    } else if (category === 'style') {
        responseDetails = 
            'Primary choice: ' + (responses.primary_style || 'Not selected') + '<br>' +
            'Chart A appeal: ' + (responses.chart_a_appeal || 'Not rated') + '/7<br>' +
            'Chart B appeal: ' + (responses.chart_b_appeal || 'Not rated') + '/7<br>' +
            'Confidence: ' + (responses.confidence_style || 'Not rated') + '/5';
    }
    
    form.innerHTML = [
        '<div style="text-align: center; padding: 40px; background-color: #d4edda; border-radius: 8px; margin: 20px 0;">',
        '<h3 style="color: #155724; margin-bottom: 15px;">✅ ' + categoryName + ' Evaluation Complete!</h3>',
        '<p style="color: #155724; margin-bottom: 20px;">',
        'Thank you for your evaluation. Your responses have been recorded.',
        '</p>',
        '<div style="background: rgba(0,0,0,0.1); padding: 15px; border-radius: 6px; margin: 20px 0;">',
        '<strong>Category:</strong> ' + categoryName + '<br>',
        responseDetails,
        '</div>',
        '<button onclick="exportResults(\'' + category + '\')" style="background-color: #28a745; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer;">',
        'Export Results',
        '</button>',
        '<button onclick="location.reload()" style="background-color: #007bff; color: white; padding: 12px 24px; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; margin-left: 10px;">',
        'Start New Evaluation',
        '</button>',
        '</div>'
    ].join('');
}

// Export all evaluations for current pair
function exportCurrentPairEvaluations() {
    if (!currentPairId || !allPairEvaluations[currentPairId]) {
        alert('No pair evaluation data to export');
        return;
    }
    
    const pairData = allPairEvaluations[currentPairId];
    const exportData = {
        ...pairData,
        exportedAt: new Date().toISOString(),
        metadata: {
            ...pairData.metadata,
            userAgent: navigator.userAgent,
            screenResolution: screen.width + 'x' + screen.height
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `pair_${currentPairId}_evaluation_${Date.now()}.json`;
    link.click();
}

// Export all pair evaluations
function exportAllPairEvaluations() {
    if (Object.keys(allPairEvaluations).length === 0) {
        alert('No evaluation data to export');
        return;
    }
    
    const exportData = {
        exportedAt: new Date().toISOString(),
        totalPairs: Object.keys(allPairEvaluations).length,
        pairEvaluations: allPairEvaluations,
        metadata: {
            userAgent: navigator.userAgent,
            screenResolution: screen.width + 'x' + screen.height
        }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `all_pair_evaluations_${Date.now()}.json`;
    link.click();
}

// Check if current pair evaluation is complete
function isCurrentPairComplete() {
    if (!currentPairId || !allPairEvaluations[currentPairId]) return false;
    
    const status = allPairEvaluations[currentPairId].completionStatus;
    return Object.values(status).every(completed => completed);
}

// Get evaluation summary for current pair
function getCurrentPairSummary() {
    if (!currentPairId || !allPairEvaluations[currentPairId]) return null;
    
    const evaluation = allPairEvaluations[currentPairId];
    const status = evaluation.completionStatus;
    const completed = Object.values(status).filter(Boolean).length;
    const total = Object.keys(status).length;
    
    return {
        pairId: currentPairId,
        completed: completed,
        total: total,
        isComplete: completed === total,
        completedCategories: Object.entries(status).filter(([k, v]) => v).map(([k, v]) => k)
    };
}

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
    // Load pair evaluations from localStorage
    const savedPairEvaluations = localStorage.getItem('pairEvaluations');
    if (savedPairEvaluations) {
        try {
            allPairEvaluations = JSON.parse(savedPairEvaluations);
        } catch (error) {
            console.error('Error loading saved pair evaluations:', error);
            allPairEvaluations = {};
        }
    }
    
    // Start with clutter category
    showCategory('clutter');
});

// Keyboard navigation
document.addEventListener('keydown', function(event) {
    if (event.ctrlKey && event.key === '1') {
        event.preventDefault();
        showCategory('clutter');
    } else if (event.ctrlKey && event.key === '2') {
        event.preventDefault();
        showCategory('cognitive_load');
    } else if (event.ctrlKey && event.key === '3') {
        event.preventDefault();
        showCategory('interpretability');
    } else if (event.ctrlKey && event.key === '4') {
        event.preventDefault();
        showCategory('style');
    }
});