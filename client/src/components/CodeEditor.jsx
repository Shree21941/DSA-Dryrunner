import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { useExecutionStore } from '../store/executionStore';
import './CodeEditor.css';

export default function CodeEditor({ starterCode = '', languageCodes = {} }) {
  const { code, setCode, isExecuting } = useExecutionStore();
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');

  const languages = {
    javascript: { name: 'JavaScript', ext: '.js', monacoLang: 'javascript' },
    java: { name: 'Java', ext: '.java', monacoLang: 'java' },
    c: { name: 'C', ext: '.c', monacoLang: 'c' },
    cpp: { name: 'C++', ext: '.cpp', monacoLang: 'cpp' },
  };

  const handleLanguageChange = (lang) => {
    setSelectedLanguage(lang);
    // Set the appropriate starter code for the selected language
    const langCode = languageCodes[lang] || starterCode;
    setCode(langCode);
  };

  const currentCode = languageCodes[selectedLanguage] || starterCode;
  const monacoLanguage = languages[selectedLanguage]?.monacoLang || 'javascript';

  const handleEditorChange = (value) => {
    setCode(value || '');
  };

  return (
    <div className="code-editor-container">
      <div className="editor-header">
        <h3>Code Editor</h3>
        <div className="language-selector">
          {Object.entries(languages).map(([code, lang]) => (
            <button
              key={code}
              className={`language-btn ${selectedLanguage === code ? 'active' : ''}`}
              onClick={() => handleLanguageChange(code)}
            >
              {lang.name}
            </button>
          ))}
        </div>
      </div>
      <Editor
        height="400px"
        language={monacoLanguage}
        value={code || currentCode}
        onChange={handleEditorChange}
        theme="light"
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        loading={<div>Loading editor...</div>}
      />
      <div className="editor-info">
        <span>💡 Tip: Your code will be executed step-by-step with full variable visibility</span>
      </div>
    </div>
  );
}
