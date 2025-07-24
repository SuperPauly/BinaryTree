/**
 * Main application logic for the Hatch Configuration Generator
 */

class HatchConfigApp {
    constructor() {
        this.generator = new TOMLGenerator();
        this.form = document.getElementById('config-form');
        this.tomlContent = document.getElementById('toml-content');
        this.copyBtn = document.getElementById('copy-btn');
        this.downloadBtn = document.getElementById('download-btn');
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupFormValidation();
        this.setupAutoUpdates();
        this.updateTOMLDisplay();
        
        console.log('🚀 Hatch Configuration Generator initialized!');
    }

    setupEventListeners() {
        // Form change listeners
        this.form.addEventListener('input', () => this.updateTOMLDisplay());
        this.form.addEventListener('change', () => this.updateTOMLDisplay());

        // Button listeners
        this.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.downloadBtn.addEventListener('click', () => this.downloadFile());

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault();
                this.downloadFile();
            }
            if ((e.ctrlKey || e.metaKey) && e.key === 'c' && e.shiftKey) {
                e.preventDefault();
                this.copyToClipboard();
            }
        });
    }

    setupFormValidation() {
        // Project name validation
        const nameInput = document.getElementById('name');
        nameInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const isValid = /^[a-z0-9-_]+$/.test(value) || value === '';
            
            if (!isValid) {
                e.target.setCustomValidity('Project name should contain only lowercase letters, numbers, hyphens, and underscores');
            } else {
                e.target.setCustomValidity('');
            }
        });

        // Version validation
        const versionInput = document.getElementById('version');
        versionInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const isValid = /^\d+\.\d+\.\d+/.test(value) || value === '';
            
            if (!isValid) {
                e.target.setCustomValidity('Version should follow semantic versioning (e.g., 1.0.0)');
            } else {
                e.target.setCustomValidity('');
            }
        });

        // Python version validation
        const pythonVersionInput = document.getElementById('requires_python');
        pythonVersionInput.addEventListener('input', (e) => {
            const value = e.target.value;
            const isValid = /^>=?\d+\.\d+/.test(value) || value === '';
            
            if (!isValid) {
                e.target.setCustomValidity('Python version should be in format like ">=3.8"');
            } else {
                e.target.setCustomValidity('');
            }
        });
    }

    setupAutoUpdates() {
        // Auto-update package paths when project name changes
        const nameInput = document.getElementById('name');
        const versionPathInput = document.getElementById('version_path');
        const packagesInput = document.getElementById('packages');

        nameInput.addEventListener('input', (e) => {
            const projectName = e.target.value;
            const packageName = projectName.replace(/-/g, '_');
            
            if (packageName) {
                versionPathInput.value = `src/${packageName}/__init__.py`;
                packagesInput.value = `src/${packageName}`;
            }
        });

        // Auto-update URLs when repository changes
        const repositoryInput = document.getElementById('repository');
        const homepageInput = document.getElementById('homepage');
        const issuesInput = document.getElementById('issues');

        repositoryInput.addEventListener('input', (e) => {
            const repoUrl = e.target.value;
            if (repoUrl && repoUrl.includes('github.com')) {
                if (!homepageInput.value || homepageInput.value.includes('username/my-project')) {
                    homepageInput.value = repoUrl;
                }
                if (!issuesInput.value || issuesInput.value.includes('username/my-project')) {
                    issuesInput.value = repoUrl + '/issues';
                }
            }
        });
    }

    getFormData() {
        const formData = new FormData(this.form);
        const data = {};

        // Get simple form values
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Handle checkboxes that can have multiple values
        const checkboxGroups = ['audience', 'python_versions'];
        checkboxGroups.forEach(group => {
            const checkboxes = this.form.querySelectorAll(`input[name="${group}"]:checked`);
            data[group] = Array.from(checkboxes).map(cb => cb.value);
        });

        return data;
    }

    updateTOMLDisplay() {
        try {
            const formData = this.getFormData();
            this.generator.updateFromForm(formData);
            const tomlString = this.generator.generateTOML();
            
            this.tomlContent.textContent = tomlString;
            this.applySyntaxHighlighting();
            
        } catch (error) {
            console.error('Error generating TOML:', error);
            this.tomlContent.textContent = `# Error generating TOML: ${error.message}`;
        }
    }

    applySyntaxHighlighting() {
        const content = this.tomlContent.textContent;
        const lines = content.split('\n');
        
        const highlightedLines = lines.map(line => {
            // Section headers
            if (line.match(/^\[.*\]$/)) {
                return `<span class="section">${line}</span>`;
            }
            // Comments
            if (line.trim().startsWith('#')) {
                return `<span class="comment">${line}</span>`;
            }
            // Key-value pairs
            if (line.includes(' = ')) {
                const [key, ...valueParts] = line.split(' = ');
                const value = valueParts.join(' = ');
                
                let highlightedValue = value;
                // String values
                if (value.match(/^".*"$/)) {
                    highlightedValue = `<span class="string">${value}</span>`;
                }
                // Boolean values
                else if (value === 'true' || value === 'false') {
                    highlightedValue = `<span class="boolean">${value}</span>`;
                }
                // Number values
                else if (value.match(/^\d+(\.\d+)?$/)) {
                    highlightedValue = `<span class="number">${value}</span>`;
                }
                
                return `<span class="key">${key}</span> = ${highlightedValue}`;
            }
            
            return line;
        });
        
        this.tomlContent.innerHTML = highlightedLines.join('\n');
    }

    async copyToClipboard() {
        try {
            const text = this.generator.generateTOML();
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            const originalText = this.copyBtn.textContent;
            this.copyBtn.textContent = '✅ Copied!';
            this.copyBtn.classList.add('copied');
            
            setTimeout(() => {
                this.copyBtn.textContent = originalText;
                this.copyBtn.classList.remove('copied');
            }, 2000);
            
            this.showNotification('✅ Copied to clipboard!', 'success');
            
        } catch (error) {
            console.error('Failed to copy:', error);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = this.generator.generateTOML();
            document.body.appendChild(textArea);
            textArea.select();
            
            try {
                document.execCommand('copy');
                this.showNotification('✅ Copied to clipboard!', 'success');
            } catch (fallbackError) {
                this.showNotification('❌ Failed to copy to clipboard', 'error');
            }
            
            document.body.removeChild(textArea);
        }
    }

    downloadFile() {
        try {
            const tomlContent = this.generator.generateTOML();
            const projectName = document.getElementById('name').value || 'my-project';
            const filename = 'pyproject.toml';
            
            const blob = new Blob([tomlContent], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            this.showNotification(`📥 Downloaded ${filename}`, 'success');
            
        } catch (error) {
            console.error('Failed to download:', error);
            this.showNotification('❌ Failed to download file', 'error');
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(n => n.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '12px 20px',
            borderRadius: '6px',
            color: 'white',
            fontWeight: '600',
            zIndex: '1000',
            transform: 'translateX(100%)',
            transition: 'transform 0.3s ease-out',
            maxWidth: '300px',
            wordWrap: 'break-word'
        });
        
        // Set background color based on type
        const colors = {
            success: '#48bb78',
            error: '#f56565',
            info: '#4299e1',
            warning: '#ed8936'
        };
        notification.style.backgroundColor = colors[type] || colors.info;
        
        // Add to page
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }

    // Utility method to reset form to defaults
    resetToDefaults() {
        if (confirm('Are you sure you want to reset all fields to their default values?')) {
            this.form.reset();
            
            // Reset to default values
            document.getElementById('name').value = 'my-project';
            document.getElementById('version').value = '0.1.0';
            document.getElementById('description').value = 'A Python project built with Hatch';
            document.getElementById('readme').value = 'README.md';
            document.getElementById('license').value = 'MIT';
            document.getElementById('requires_python').value = '>=3.8';
            document.getElementById('author_name').value = 'Your Name';
            document.getElementById('author_email').value = 'your.email@example.com';
            document.getElementById('homepage').value = 'https://github.com/username/my-project';
            document.getElementById('repository').value = 'https://github.com/username/my-project';
            document.getElementById('issues').value = 'https://github.com/username/my-project/issues';
            document.getElementById('version_path').value = 'src/my_project/__init__.py';
            document.getElementById('packages').value = 'src/my_project';
            document.getElementById('dev_dependencies').value = 'pytest>=7.0.0\nblack>=22.0.0\nisort>=5.0.0\nflake8>=4.0.0';
            document.getElementById('docs_dependencies').value = 'mkdocs>=1.4.0\nmkdocs-material>=8.0.0';
            
            // Reset checkboxes
            document.getElementById('dev_status').value = 'Development Status :: 3 - Alpha';
            document.querySelectorAll('input[name="audience"]').forEach(cb => {
                cb.checked = cb.value === 'Intended Audience :: Developers';
            });
            document.querySelectorAll('input[name="python_versions"]').forEach(cb => {
                cb.checked = true;
            });
            
            this.updateTOMLDisplay();
            this.showNotification('🔄 Reset to default values', 'info');
        }
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.hatchApp = new HatchConfigApp();
    
    // Add reset button functionality
    const resetBtn = document.createElement('button');
    resetBtn.textContent = '🔄 Reset to Defaults';
    resetBtn.className = 'btn btn-secondary';
    resetBtn.style.marginLeft = '10px';
    resetBtn.onclick = () => window.hatchApp.resetToDefaults();
    
    const actionsDiv = document.querySelector('.toml-actions');
    if (actionsDiv) {
        actionsDiv.appendChild(resetBtn);
    }
});

// Add some helpful console messages
console.log('🚀 Hatch Python Project Configuration Generator');
console.log('📝 Generate professional pyproject.toml files with ease!');
console.log('⌨️  Keyboard shortcuts:');
console.log('   Ctrl/Cmd + S: Download file');
console.log('   Ctrl/Cmd + Shift + C: Copy to clipboard');

