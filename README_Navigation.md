# Visual Evaluation Interface - Navigation & Cognitive Load

## ✨ New Features Added

### 🔄 **Arrow Navigation Between Categories**
- **Left/Right Arrow Keys**: Navigate between evaluation categories
- **Previous/Next Buttons**: Click navigation in the header
- **Category Indicator**: Shows current position (e.g., "1 of 2: Visual Clutter")

### 🧠 **Cognitive Load Evaluation Category**
Complete implementation following the provided specification:

#### **Construct Definition**
- **Name**: Cognitive Load (Extraneous)  
- **Focus**: Mental effort required due to design choices (not data complexity)
- **Time Requirement**: Minimum 6 seconds viewing time

#### **Evaluation Questions**
1. **Primary Question**: "Which chart feels less mentally heavy to understand at a glance?"
2. **Likert Scales**: Mental effort rating for each chart (1-7)
3. **Confidence Rating**: 1-5 scale
4. **Optional Rationale**: Open text explanation

#### **Design Focus Areas**
- Visual channel complexity (color, size, shape, annotations)
- Redundant encodings and information
- Label/text clutter and readability
- Decorative elements and embellishments
- Scale complexity (dual axes, transformations)
- Information accessibility and decoding overhead

## 🌐 **Usage**

### **URL Parameters**
```
http://localhost:8001/index.html?dataset=Inc500Charts&summary=1&question=1&category=clutter
```

**Parameters:**
- `dataset`: Inc500Charts | fifa18_rendered_charts | ATP_rendered_charts  
- `summary`: 1 | 3
- `question`: 1 | 2 | 3
- `category`: **clutter** | **cognitive_load**

### **Navigation Methods**
1. **Keyboard**: Use ← → arrow keys to switch categories
2. **Mouse**: Click "Previous" / "Next" buttons in header
3. **Direct URL**: Change `category` parameter directly

## 📊 **Evaluation Categories**

### **1. Visual Clutter (Perceptual/Pre-Semantic)**
- Focus: Visual crowding and noise perception
- Time: 4 seconds minimum viewing
- Questions: Clutter comparison, cleanliness ratings

### **2. Cognitive Load (Extraneous)** ✨ *NEW*
- Focus: Mental effort from design choices
- Time: 6 seconds minimum viewing  
- Questions: Mental effort comparison, effort ratings

## 🎯 **Preserved Features**
- ✅ Same master question, summary, and chart details
- ✅ Dynamic dataset loading from folder structure
- ✅ CSV data table display with all columns
- ✅ Modal dialogs for narrative summary and data samples
- ✅ Form validation and export functionality
- ✅ Responsive design for mobile devices

## 🚀 **Technical Implementation**
- **Category System**: Dynamic form loading based on URL parameter
- **Navigation Logic**: Arrow key handling with browser shortcut avoidance
- **Data Collection**: Category-specific response fields and validation
- **Export Format**: Enhanced JSON with category and construct information

The interface now supports comprehensive evaluation across multiple perceptual and cognitive dimensions while maintaining the same familiar workflow and data context.