# 📚 Rise Course Job Aid PDF Generator

Transform your Articulate Rise course content into professional PDF job aids and learning resources.

## 🚀 Features

### Enhanced Rise Integration
- **Smart Content Detection**: Automatically identifies Rise lessons and content blocks
- **Folder Upload Support**: Upload entire unzipped Rise course folders
- **Content Analysis**: Extracts titles, descriptions, interactions, and assessments
- **Media Handling**: Identifies and processes embedded media files
- **Clean PDF Output**: Removes unnecessary Rise player elements for clean PDFs

### Professional PDF Generation
- **Beautiful Design**: Modern, professional layout with consistent styling
- **Interactive Elements**: Converts Rise interactions into readable content
- **Reflection Spaces**: Adds learning reflection questions for each lesson
- **Table of Contents**: Automatically generated navigation
- **Progress Tracking**: Visual progress during PDF generation

### User-Friendly Interface
- **Drag & Drop**: Easy folder selection with visual feedback
- **Lesson Selection**: Choose which lessons to include in your PDF
- **Customization**: Add custom course title and author information
- **Real-time Feedback**: Progress indicators and status messages

## 📋 How to Use

### Step 1: Prepare Your Rise Course
1. **Export from Rise**: Download your Rise course as a ZIP file
2. **Unzip Content**: Extract the ZIP file to a folder on your computer
3. **Verify Structure**: Ensure you have the complete course folder with HTML files

### Step 2: Generate Your PDF
1. **Open the Generator**: Open `rise-course-pdf-generator.html` in your web browser
2. **Select Course Folder**: Click "Select Rise Course Folder" and choose your unzipped course directory
3. **Scan for Content**: Click "Scan for Lessons" to analyze your course structure
4. **Review Lessons**: Check/uncheck lessons you want to include
5. **Customize Details**: Enter your course title and author name
6. **Generate PDF**: Click "Download PDF" to create your job aid

### Step 3: Use Your Job Aid
- **Share with Learners**: Distribute the PDF as a reference guide
- **Print for Workshops**: Use as handouts during training sessions
- **Archive Learning**: Keep as a permanent record of course content

## 🔧 Technical Details

### Supported Rise Features
- ✅ Text blocks and content sections
- ✅ Images and media references
- ✅ Basic interactions (converted to text)
- ✅ Assessment questions (summarized)
- ✅ Navigation structure
- ✅ Lesson titles and descriptions

### File Requirements
- **Format**: Unzipped Rise course folder
- **Files**: HTML, CSS, JS, and media files
- **Structure**: Standard Rise export structure
- **Size**: Works with courses of any size

### Browser Compatibility
- ✅ Chrome/Chromium (Recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge

## 📁 File Structure

```
your-course-folder/
├── index.html              # Main course file
├── lesson1.html            # Individual lessons
├── lesson2.html
├── css/                    # Stylesheets
├── js/                     # JavaScript files
├── assets/                 # Images and media
└── lib/                    # Rise libraries
```

## 🎨 Customization Options

### Visual Styling
- Modern gradient backgrounds
- Professional typography
- Consistent color scheme
- Responsive design for all screen sizes

### Content Structure
- Course cover page with title and author
- Individual lesson sections
- Reflection questions for each lesson
- Clean, readable formatting

### PDF Settings
- A4 page size
- Optimized margins
- High-quality rendering
- Automatic page breaks

## 🛠️ Advanced Features

### Content Analysis Engine
The generator includes a sophisticated content analysis engine (`rise-content-extractor.js`) that:

- **Identifies Rise Content**: Uses multiple markers to detect Rise-generated content
- **Extracts Metadata**: Pulls course information, titles, and descriptions
- **Processes Interactions**: Converts interactive elements to static content
- **Handles Media**: Identifies and references embedded media files
- **Cleans Output**: Removes unnecessary code for clean PDF generation

### Intelligent Lesson Detection
- Automatically finds lesson files in complex folder structures
- Sorts lessons in logical order
- Extracts meaningful titles from content
- Identifies lesson descriptions and summaries

## 📖 Best Practices

### For Course Authors
1. **Clear Titles**: Use descriptive lesson titles in Rise
2. **Structured Content**: Organize content in logical blocks
3. **Minimal JavaScript**: Avoid complex interactions that won't translate to PDF
4. **Quality Images**: Use high-resolution images for better PDF output

### For PDF Generation
1. **Test First**: Generate a small test PDF before processing large courses
2. **Check Content**: Review detected lessons before generating
3. **Customize Titles**: Use meaningful course and author names
4. **Save Regularly**: Keep backup copies of your Rise source files

## 🔍 Troubleshooting

### Common Issues

**Q: No lessons detected**
- ✅ Ensure you've selected the correct unzipped course folder
- ✅ Check that HTML files contain Rise-specific content
- ✅ Verify the course was properly exported from Rise

**Q: Missing content in PDF**
- ✅ Some interactive elements may not transfer to PDF
- ✅ Check that all course files were included in the upload
- ✅ Try selecting fewer lessons if the course is very large

**Q: PDF generation fails**
- ✅ Ensure you're using a modern web browser
- ✅ Check that your course folder isn't too large
- ✅ Try disabling browser extensions temporarily

### Getting Help
- Check browser console for error messages
- Ensure all course files are present
- Try with a smaller subset of lessons first

## 🚀 Future Enhancements

### Planned Features
- **Enhanced Media Support**: Better handling of embedded videos and audio
- **Interactive Elements**: More sophisticated conversion of Rise interactions
- **Branding Options**: Custom colors and styling options
- **Batch Processing**: Process multiple courses at once
- **Export Formats**: Additional output formats beyond PDF

### Contributing
This tool is designed to be extensible. The modular architecture allows for easy addition of new features and content processors.

## 📄 License

This tool is provided as-is for educational and professional use. Please respect Articulate Rise's terms of service when using exported content.

---

**Ready to transform your Rise courses into professional job aids?** 
Open `rise-course-pdf-generator.html` and get started! 🎯