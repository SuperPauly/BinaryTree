# 🚀 Hatch Python Project Configuration Generator

A static web application for creating professional `pyproject.toml` files for Python projects using the Hatch build system. No server required - runs entirely in your browser!

## ✨ Features

- **🎨 Real-time Configuration**: See your `pyproject.toml` update as you type
- **📋 Copy to Clipboard**: One-click copying of the generated configuration
- **📥 Download File**: Download your `pyproject.toml` directly
- **✅ Form Validation**: Built-in validation for project names, versions, and more
- **🔄 Auto-completion**: Smart defaults and auto-updating related fields
- **📱 Responsive Design**: Works great on desktop and mobile devices
- **⌨️ Keyboard Shortcuts**: `Ctrl+S` to download, `Ctrl+Shift+C` to copy
- **🌐 GitHub Pages Ready**: Static site that can be hosted anywhere

## 🚀 Live Demo

Visit the live application: [https://superpauly.github.io/hatch-config-generator/](https://superpauly.github.io/hatch-config-generator/)

## 🛠️ Local Development

1. Clone this repository:
   ```bash
   git clone https://github.com/SuperPauly/hatch-config-generator.git
   cd hatch-config-generator
   ```

2. Open `index.html` in your browser or serve it with a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   
   # Using PHP
   php -S localhost:8000
   ```

3. Navigate to `http://localhost:8000`

## 📁 Project Structure

```
hatch-config-generator/
├── index.html              # Main HTML file
├── css/
│   └── style.css          # Styles and responsive design
├── js/
│   ├── app.js             # Main application logic
│   └── toml-generator.js  # TOML generation engine
└── README.md              # This file
```

## 🎯 Supported Configuration Options

### Project Metadata
- Project name, version, and description
- Author information and maintainers
- License selection
- README file specification
- Python version requirements

### Dependencies
- Runtime dependencies
- Development dependencies (testing, linting)
- Documentation dependencies
- Optional dependency groups

### Project URLs
- Homepage, repository, and issue tracker links
- Auto-completion for GitHub repositories

### Hatch-Specific Configuration
- Version file path configuration
- Package directory specification
- Build targets (wheel and sdist)
- Environment configurations

### Python Package Classifiers
- Development status
- Intended audience
- Supported Python versions
- License classifiers
- Topic classifications

### Entry Points
- Console scripts
- GUI scripts
- Custom entry points

## 🔧 Technical Details

This application is built with:

- **Vanilla JavaScript** - No frameworks, fast loading
- **CSS Grid & Flexbox** - Modern, responsive layout
- **Web APIs** - Clipboard API, File Download API
- **Real-time Updates** - Form changes instantly update the TOML output
- **Client-side TOML Generation** - No server required

## 🤝 Contributing

Contributions are welcome! Here are some ways you can help:

1. **Report Issues**: Found a bug or have a feature request? [Open an issue](https://github.com/SuperPauly/hatch-config-generator/issues)

2. **Submit Pull Requests**: 
   - Fork the repository
   - Create a feature branch
   - Make your changes
   - Test thoroughly
   - Submit a pull request

3. **Improve Documentation**: Help make the README or code comments clearer

4. **Add Features**: Some ideas for enhancements:
   - More Python classifiers
   - Project templates/presets
   - Import from existing `pyproject.toml`
   - Export to other formats
   - Dark mode theme

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Hatch](https://hatch.pypa.io/) - The modern Python project manager
- [Python Packaging Authority](https://www.pypa.io/) - For the packaging standards
- [GitHub Pages](https://pages.github.com/) - For free static site hosting

## 🔗 Related Projects

- [Hatch](https://github.com/pypa/hatch) - Modern, extensible Python project management
- [PyProject.toml Guide](https://packaging.python.org/en/latest/guides/writing-pyproject-toml/) - Official packaging guide
- [Python Classifiers](https://pypi.org/classifiers/) - Complete list of PyPI classifiers

---

**Made with ❤️ for the Python community**

