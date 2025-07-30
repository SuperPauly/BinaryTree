/**
 * TOML Generator - Client-side TOML generation for Hatch projects
 */

class TOMLGenerator {
    constructor() {
        this.config = this.getDefaultConfig();
    }

    getDefaultConfig() {
        return {
            'build-system': {
                requires: ['hatchling'],
                'build-backend': 'hatchling.build'
            },
            project: {
                name: 'my-project',
                version: '0.1.0',
                description: 'A Python project built with Hatch',
                readme: 'README.md',
                license: 'MIT',
                authors: [
                    { name: 'Your Name', email: 'your.email@example.com' }
                ],
                keywords: [],
                classifiers: [
                    'Development Status :: 3 - Alpha',
                    'Intended Audience :: Developers',
                    'License :: OSI Approved :: MIT License',
                    'Programming Language :: Python :: 3',
                    'Programming Language :: Python :: 3.8',
                    'Programming Language :: Python :: 3.9',
                    'Programming Language :: Python :: 3.10',
                    'Programming Language :: Python :: 3.11',
                    'Programming Language :: Python :: 3.12'
                ],
                'requires-python': '>=3.8',
                dependencies: [],
                'optional-dependencies': {
                    dev: [
                        'pytest>=7.0.0',
                        'black>=22.0.0',
                        'isort>=5.0.0',
                        'flake8>=4.0.0'
                    ],
                    docs: [
                        'mkdocs>=1.4.0',
                        'mkdocs-material>=8.0.0'
                    ]
                },
                urls: {
                    Homepage: 'https://github.com/username/my-project',
                    Repository: 'https://github.com/username/my-project',
                    Issues: 'https://github.com/username/my-project/issues'
                },
                scripts: {}
            },
            tool: {
                hatch: {
                    version: {
                        path: 'src/my_project/__init__.py'
                    },
                    build: {
                        targets: {
                            wheel: {
                                packages: ['src/my_project']
                            },
                            sdist: {
                                exclude: [
                                    '/.github',
                                    '/docs',
                                    '/tests'
                                ]
                            }
                        }
                    },
                    envs: {
                        default: {
                            dependencies: [
                                'pytest>=7.0.0',
                                'pytest-cov>=4.0.0'
                            ]
                        },
                        lint: {
                            detached: true,
                            dependencies: [
                                'black>=22.0.0',
                                'isort>=5.0.0',
                                'flake8>=4.0.0',
                                'mypy>=1.0.0'
                            ]
                        },
                        docs: {
                            dependencies: [
                                'mkdocs>=1.4.0',
                                'mkdocs-material>=8.0.0'
                            ]
                        }
                    }
                },
                black: {
                    'target-version': ['py38'],
                    'line-length': 88,
                    'skip-string-normalization': true
                },
                isort: {
                    profile: 'black',
                    multi_line_output: 3,
                    line_length: 88
                },
                pytest: {
                    testpaths: ['tests'],
                    addopts: '-v --cov=src --cov-report=term-missing'
                }
            }
        };
    }

    updateFromForm(formData) {
        // Reset config to defaults and update with form data
        this.config = this.getDefaultConfig();
        
        // Update project metadata
        this.config.project.name = formData.name || 'my-project';
        this.config.project.version = formData.version || '0.1.0';
        this.config.project.description = formData.description || 'A Python project built with Hatch';
        
        if (formData.readme) {
            this.config.project.readme = formData.readme;
        }
        
        if (formData.license) {
            this.config.project.license = formData.license;
        }
        
        if (formData.requires_python) {
            this.config.project['requires-python'] = formData.requires_python;
        }

        // Update authors
        const authors = [];
        if (formData.author_name || formData.author_email) {
            const author = {};
            if (formData.author_name) author.name = formData.author_name;
            if (formData.author_email) author.email = formData.author_email;
            authors.push(author);
        }
        if (authors.length > 0) {
            this.config.project.authors = authors;
        }

        // Update URLs
        const urls = {};
        if (formData.homepage) urls.Homepage = formData.homepage;
        if (formData.repository) urls.Repository = formData.repository;
        if (formData.issues) urls.Issues = formData.issues;
        
        if (Object.keys(urls).length > 0) {
            this.config.project.urls = urls;
        }

        // Update keywords
        if (formData.keywords) {
            const keywords = formData.keywords.split(',')
                .map(k => k.trim())
                .filter(k => k.length > 0);
            if (keywords.length > 0) {
                this.config.project.keywords = keywords;
            }
        }

        // Update classifiers
        const classifiers = ['Programming Language :: Python :: 3'];
        
        // Add development status
        if (formData.dev_status) {
            classifiers.push(formData.dev_status);
        }
        
        // Add intended audience
        if (formData.audience && formData.audience.length > 0) {
            classifiers.push(...formData.audience);
        }
        
        // Add Python versions
        if (formData.python_versions && formData.python_versions.length > 0) {
            classifiers.push(...formData.python_versions);
        }
        
        // Add license classifier
        if (formData.license) {
            const licenseClassifiers = {
                'MIT': 'License :: OSI Approved :: MIT License',
                'Apache-2.0': 'License :: OSI Approved :: Apache Software License',
                'BSD-3-Clause': 'License :: OSI Approved :: BSD License',
                'GPL-3.0': 'License :: OSI Approved :: GNU General Public License v3 (GPLv3)',
                'LGPL-3.0': 'License :: OSI Approved :: GNU Lesser General Public License v3 (LGPLv3)',
                'MPL-2.0': 'License :: OSI Approved :: Mozilla Public License 2.0 (MPL 2.0)'
            };
            if (licenseClassifiers[formData.license]) {
                classifiers.push(licenseClassifiers[formData.license]);
            }
        }
        
        this.config.project.classifiers = classifiers;

        // Update dependencies
        if (formData.dependencies) {
            const deps = this.parseDependencies(formData.dependencies);
            if (deps.length > 0) {
                this.config.project.dependencies = deps;
            }
        }

        // Update optional dependencies
        const optionalDeps = {};
        
        if (formData.dev_dependencies) {
            const devDeps = this.parseDependencies(formData.dev_dependencies);
            if (devDeps.length > 0) {
                optionalDeps.dev = devDeps;
            }
        }
        
        if (formData.docs_dependencies) {
            const docsDeps = this.parseDependencies(formData.docs_dependencies);
            if (docsDeps.length > 0) {
                optionalDeps.docs = docsDeps;
            }
        }
        
        if (Object.keys(optionalDeps).length > 0) {
            this.config.project['optional-dependencies'] = optionalDeps;
        }

        // Update console scripts
        if (formData.console_scripts) {
            const scripts = this.parseConsoleScripts(formData.console_scripts);
            if (Object.keys(scripts).length > 0) {
                this.config.project.scripts = scripts;
            }
        }

        // Update Hatch configuration
        if (formData.version_path) {
            this.config.tool.hatch.version.path = formData.version_path;
        }

        if (formData.packages) {
            const packages = formData.packages.split(',')
                .map(p => p.trim())
                .filter(p => p.length > 0);
            if (packages.length > 0) {
                this.config.tool.hatch.build.targets.wheel.packages = packages;
            }
        }

        // Update environment dependencies to match optional dependencies
        if (optionalDeps.dev) {
            this.config.tool.hatch.envs.default.dependencies = optionalDeps.dev;
        }
        if (optionalDeps.docs) {
            this.config.tool.hatch.envs.docs.dependencies = optionalDeps.docs;
        }
    }

    parseDependencies(depsString) {
        if (!depsString) return [];
        
        return depsString.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'));
    }

    parseConsoleScripts(scriptsString) {
        if (!scriptsString) return {};
        
        const scripts = {};
        scriptsString.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0 && !line.startsWith('#'))
            .forEach(line => {
                const parts = line.split('=');
                if (parts.length === 2) {
                    const name = parts[0].trim();
                    const entryPoint = parts[1].trim();
                    scripts[name] = entryPoint;
                }
            });
        
        return scripts;
    }

    generateTOML() {
        return this.objectToTOML(this.config);
    }

    objectToTOML(obj, indent = 0) {
        let toml = '';
        const indentStr = '  '.repeat(indent);
        
        // Handle different types of objects
        for (const [key, value] of Object.entries(obj)) {
            if (value === null || value === undefined) {
                continue;
            }
            
            if (Array.isArray(value)) {
                if (value.length === 0) continue;
                
                // Check if it's an array of simple values or objects
                if (value.every(item => typeof item !== 'object')) {
                    toml += `${indentStr}${key} = ${this.formatArray(value)}\n`;
                } else {
                    // Array of objects (like authors)
                    toml += `${indentStr}${key} = [\n`;
                    value.forEach(item => {
                        toml += `${indentStr}  ${this.formatObject(item)},\n`;
                    });
                    toml += `${indentStr}]\n`;
                }
            } else if (typeof value === 'object') {
                // Section header
                const sectionName = indent === 0 ? key : `${key}`;
                toml += `\n[${indent === 0 ? '' : 'tool.'}${sectionName}]\n`;
                toml += this.objectToTOML(value, indent + 1);
            } else {
                // Simple value
                toml += `${indentStr}${key} = ${this.formatValue(value)}\n`;
            }
        }
        
        return toml;
    }

    formatValue(value) {
        if (typeof value === 'string') {
            return `"${value.replace(/"/g, '\\"')}"`;
        } else if (typeof value === 'boolean') {
            return value.toString();
        } else if (typeof value === 'number') {
            return value.toString();
        }
        return `"${value}"`;
    }

    formatArray(arr) {
        if (arr.length === 0) return '[]';
        
        const formatted = arr.map(item => this.formatValue(item)).join(', ');
        
        // If the array is long, format it on multiple lines
        if (formatted.length > 80) {
            return '[\n  ' + arr.map(item => this.formatValue(item)).join(',\n  ') + '\n]';
        }
        
        return `[${formatted}]`;
    }

    formatObject(obj) {
        const pairs = Object.entries(obj)
            .map(([key, value]) => `${key} = ${this.formatValue(value)}`)
            .join(', ');
        return `{${pairs}}`;
    }

    // Better TOML generation that handles nested sections properly
    generateTOML() {
        let toml = '';
        
        // Build system section
        if (this.config['build-system']) {
            toml += '[build-system]\n';
            toml += `requires = ${this.formatArray(this.config['build-system'].requires)}\n`;
            toml += `build-backend = ${this.formatValue(this.config['build-system']['build-backend'])}\n`;
        }
        
        // Project section
        if (this.config.project) {
            toml += '\n[project]\n';
            const project = this.config.project;
            
            if (project.name) toml += `name = ${this.formatValue(project.name)}\n`;
            if (project.version) toml += `version = ${this.formatValue(project.version)}\n`;
            if (project.description) toml += `description = ${this.formatValue(project.description)}\n`;
            if (project.readme) toml += `readme = ${this.formatValue(project.readme)}\n`;
            if (project.license) toml += `license = ${this.formatValue(project.license)}\n`;
            if (project['requires-python']) toml += `requires-python = ${this.formatValue(project['requires-python'])}\n`;
            
            if (project.authors && project.authors.length > 0) {
                toml += 'authors = [\n';
                project.authors.forEach(author => {
                    toml += `  ${this.formatObject(author)},\n`;
                });
                toml += ']\n';
            }
            
            if (project.keywords && project.keywords.length > 0) {
                toml += `keywords = ${this.formatArray(project.keywords)}\n`;
            }
            
            if (project.classifiers && project.classifiers.length > 0) {
                toml += 'classifiers = [\n';
                project.classifiers.forEach(classifier => {
                    toml += `  ${this.formatValue(classifier)},\n`;
                });
                toml += ']\n';
            }
            
            if (project.dependencies && project.dependencies.length > 0) {
                toml += `dependencies = ${this.formatArray(project.dependencies)}\n`;
            }
            
            if (project['optional-dependencies']) {
                toml += '\n[project.optional-dependencies]\n';
                Object.entries(project['optional-dependencies']).forEach(([key, deps]) => {
                    toml += `${key} = ${this.formatArray(deps)}\n`;
                });
            }
            
            if (project.urls && Object.keys(project.urls).length > 0) {
                toml += '\n[project.urls]\n';
                Object.entries(project.urls).forEach(([key, url]) => {
                    toml += `${key} = ${this.formatValue(url)}\n`;
                });
            }
            
            if (project.scripts && Object.keys(project.scripts).length > 0) {
                toml += '\n[project.scripts]\n';
                Object.entries(project.scripts).forEach(([key, script]) => {
                    toml += `${key} = ${this.formatValue(script)}\n`;
                });
            }
        }
        
        // Tool sections
        if (this.config.tool) {
            // Hatch configuration
            if (this.config.tool.hatch) {
                const hatch = this.config.tool.hatch;
                
                if (hatch.version) {
                    toml += '\n[tool.hatch.version]\n';
                    if (hatch.version.path) {
                        toml += `path = ${this.formatValue(hatch.version.path)}\n`;
                    }
                }
                
                if (hatch.build) {
                    if (hatch.build.targets.wheel.packages) {
                        toml += '\n[tool.hatch.build.targets.wheel]\n';
                        toml += `packages = ${this.formatArray(hatch.build.targets.wheel.packages)}\n`;
                    }
                    
                    if (hatch.build.targets.sdist.exclude) {
                        toml += '\n[tool.hatch.build.targets.sdist]\n';
                        toml += `exclude = ${this.formatArray(hatch.build.targets.sdist.exclude)}\n`;
                    }
                }
                
                if (hatch.envs) {
                    Object.entries(hatch.envs).forEach(([envName, envConfig]) => {
                        toml += `\n[tool.hatch.envs.${envName}]\n`;
                        if (envConfig.detached) {
                            toml += `detached = ${envConfig.detached}\n`;
                        }
                        if (envConfig.dependencies) {
                            toml += `dependencies = ${this.formatArray(envConfig.dependencies)}\n`;
                        }
                    });
                }
            }
            
            // Other tool configurations
            ['black', 'isort', 'pytest'].forEach(tool => {
                if (this.config.tool[tool]) {
                    toml += `\n[tool.${tool}]\n`;
                    Object.entries(this.config.tool[tool]).forEach(([key, value]) => {
                        if (Array.isArray(value)) {
                            toml += `${key} = ${this.formatArray(value)}\n`;
                        } else {
                            toml += `${key} = ${this.formatValue(value)}\n`;
                        }
                    });
                }
            });
        }
        
        return toml;
    }
}

