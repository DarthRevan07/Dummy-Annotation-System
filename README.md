# Evaluation Results Viewer

A web-based UI for presenting evaluation questions with image comparisons and multiple-choice responses.

## Features

- **Master Question**: Fixed question that provides overall context for image comparison
- **Navigation Questions**: Navigate between specific evaluation questions using Previous/Next buttons or keyboard arrows
- **Image Comparison**: Side-by-side display of two placeholder visualizations with detailed metrics
- **Multiple Choice Questions**: 4-5 MCQ options with radio button selection
- **Progress Tracking**: Shows current question number and total questions
- **Answer Management**: Submit answers, skip questions, and update previous responses
- **Keyboard Navigation**: Use arrow keys and number keys for quick navigation
- **Export Results**: Download evaluation results as JSON

## Structure

The interface has two types of questions:

### Master Question
- **Fixed Content**: Remains constant while navigating through questions
- **Context**: Provides overall evaluation framework for the two visualizations
- **Images**: Two placeholder visualizations (A and B) with placeholder metrics

### Navigation Questions
- **Variable Content**: Changes as you navigate between questions
- **Specific Focus**: Each question targets a different evaluation aspect (accuracy, clarity, design, etc.)
- **MCQ Options**: Tailored to each specific evaluation criterion

## File Structure

```
UI/
├── index.html          # Main HTML structure with Master Question section
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality with placeholder data
└── README.md          # This file
```

## Usage

1. Open `index.html` in a web browser
2. Review the Master Question that provides overall context
3. Navigate through specific evaluation questions using Previous/Next buttons
4. Compare the two placeholder visualizations for each question
5. Select your answer from the multiple choice options
6. Submit your answer or skip to the next question
7. Export results when complete

## Customization

### Adding Questions

Edit the `questionsData` array in `script.js`:

```javascript
{
    id: 1,
    title: "Question 1 - [Category]",
    text: "[Specific evaluation question text]",
    style: "[analytical/perceptual/aesthetic/contextual]",
    complexity: "[low/medium/high]",
    mcqPrompt: "[Question prompt for MCQ]",
    mcqOptions: [
        "A) [Option 1]",
        "B) [Option 2]", 
        "C) [Option 3]",
        "D) [Option 4]",
        "E) [Option 5]"
    ]
}
```

### Updating Fixed Images

Modify the `fixedImagesData` object in `script.js` to update the placeholder visualization information that remains constant across all questions.

### Styling

Modify `styles.css` to customize:
- Colors and themes
- Layout and spacing  
- Font sizes and families
- Responsive breakpoints
- Master Question section appearance

## Sample Question Types

The interface includes placeholder questions for:
- **Data Accuracy**: Evaluating statistical correctness
- **Visual Clarity**: Assessing communication effectiveness  
- **Design Quality**: Reviewing aesthetic and design principles
- **Information Density**: Balancing detail with comprehensibility
- **Target Audience**: Considering context and appropriateness

## Keyboard Shortcuts

- **Left Arrow**: Previous question
- **Right Arrow**: Next question
- **1-5**: Select MCQ option
- **Enter**: Submit answer

## Browser Support

- Chrome 60+
- Firefox 60+
- Safari 12+
- Edge 79+

## Responsive Design

The interface adapts to different screen sizes:
- Desktop: Side-by-side image layout
- Tablet/Mobile: Stacked image layout with adjusted spacing
- Master Question section remains prominent across all devices