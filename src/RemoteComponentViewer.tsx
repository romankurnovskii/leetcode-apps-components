import React, {useState, useEffect, createElement} from 'react';
import {InputCase} from './components/InputCase';
import {NextButton} from './components/NextButton';
import {PreviousButton} from './components/PreviousButton';
import {StartButton} from './components/StartButton';
import {ErrorBoundary} from './components/ErrorBoundary';

const leetcodeAppsComponents = {
  InputCase: InputCase,
  StartButton: StartButton,
  PreviousButton: PreviousButton,
  NextButton: NextButton,
};

// Remove BabelType interface (no longer needed)

declare global {
  interface Window {
    Babel: {
      transform: (code: string, options: unknown) => {code: string};
    };
  }
}

// --- Main App Component ---
// This component will fetch, transpile, and render the dynamic component.
// Accepts a problemId prop to determine which visualization to load.
export interface RemoteComponentViewerProps {
  problemId: number;
  parentUrl?: string;
}

function RemoteComponentViewer({
  problemId,
  parentUrl = 'https://raw.githubusercontent.com/romankurnovskii/leetcode-apps/refs/heads/main/visualizations',
}: RemoteComponentViewerProps) {
  const [DynamicComponent, setDynamicComponent] = useState<React.ComponentType | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  const componentUrl = `${parentUrl}/${problemId}/01.jsx`;

  useEffect(() => {
    // loads the Babel transpiler script into the document head.
    const loadBabel = () => {
      return new Promise<void>((resolve, reject) => {
        if ((window as Window & typeof globalThis).Babel) {
          resolve();
          return;
        }
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/@babel/standalone/babel.min.js';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Babel.'));
        document.head.appendChild(script);
      });
    };

    const fetchAndRenderComponent = async () => {
      try {
        setStatus('loading');

        // 1. Load Babel transpiler
        await loadBabel();

        // 2. Fetch the component's source code
        const urlWithCacheBuster = `${componentUrl}?cb=${Date.now()}`;
        const response = await fetch(urlWithCacheBuster);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        let jsxCode = await response.text();

        // Preprocess: Remove import/export statements (except export default)
        jsxCode = jsxCode
          .split('\n')
          .filter(line => !/^\s*import\s/.test(line) && !/^\s*export\s+(?!default)/.test(line))
          .join('\n');

        // Preprocess: Rewrite useState, useEffect, useMemo, useRef to React.useState, etc.
        jsxCode = jsxCode
          .replace(/\buseState\s*\(/g, 'React.useState(')
          .replace(/\buseEffect\s*\(/g, 'React.useEffect(')
          .replace(/\buseMemo\s*\(/g, 'React.useMemo(')
          .replace(/\buseRef\s*\(/g, 'React.useRef(');

        // 3. Transpile JSX to JavaScript using Babel
        const {code: jsCode} = window.Babel.transform(jsxCode, {
          presets: ['react'],
          plugins: [
            // This plugin is needed to handle 'export default'
            ['transform-modules-commonjs', {allowTopLevelThis: true}],
          ],
        });

        // 4. Prepare a 'sandbox' to execute the transpiled code
        const exports: {default?: React.ComponentType} = {};
        const module: {exports: {default?: React.ComponentType}} = {
          exports,
        };

        // This custom require function intercepts module requests from the fetched code.
        const customRequire = (name: string): unknown => {
          if (name === 'react') {
            return React;
          }
          if (name === 'leetcode-apps-components') {
            return leetcodeAppsComponents;
          }
          throw new Error(`Cannot find module '${name}'`);
        };

        // 5. Execute the code to get the component constructor
        // We wrap the code in a function to give it scope and pass in our dependencies.
        const factory = new Function(
          'module',
          'exports',
          'require',
          'React',
          'useState',
          'useEffect',
          'useMemo',
          'useRef',
          jsCode
        );
        factory(module, exports, customRequire, React, React.useState, React.useEffect, React.useMemo, React.useRef);

        const component = module.exports.default;

        if (typeof component !== 'function' && typeof component !== 'object') {
          console.error('Loaded module:', module.exports);
          throw new Error(
            'Failed to get a valid React component from the URL. The default export is missing or invalid.'
          );
        }

        // 6. Set the component in state so it can be rendered
        setDynamicComponent(() => component); // Use a function to store the component constructor
        setStatus('success');
      } catch (err) {
        console.error('Error loading dynamic component:', err);
        setStatus('error');
      }
    };

    fetchAndRenderComponent();
  }, [problemId, parentUrl]); // Only re-run if these change

  // --- Render logic ---
  const renderContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="flex flex-col items-center justify-center p-8">
            <svg
              className="animate-spin -ml-1 mr-3 h-10 w-10 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="mt-4 text-lg">Loading and transpiling component...</p>
          </div>
        );
      case 'error':
        return <div></div>;
      case 'success':
        return DynamicComponent ? (
          <ErrorBoundary fallback={<div>Component failed to render.</div>}>
            {createElement(DynamicComponent)}
          </ErrorBoundary>
        ) : null;
      default:
        return null;
    }
  };

  return <div className="max-w-4xl mx-auto">{renderContent()}</div>;
}

export default RemoteComponentViewer;
