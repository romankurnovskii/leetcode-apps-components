import React, {useState, useEffect} from 'react';
// @ts-ignore: No types for '@babel/standalone'
import {transform} from '@babel/standalone';

export interface RemoteComponentProps {
  url: string;
  LoadingComponent?: React.ComponentType;
  ErrorComponent?: React.ComponentType<{error: Error}>;
}

const RemoteComponent: React.FC<RemoteComponentProps> = ({
  url,
  LoadingComponent,
  ErrorComponent,
}: RemoteComponentProps) => {
  const [DynamicComponent, setDynamicComponent] = useState<React.ComponentType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    setDynamicComponent(null);
    setLoading(true);
    setError(null);
    setNotFound(false);

    const fetchAndCreateComponent = async () => {
      try {
        const response = await fetch(url);
        if (response.status === 404) {
          setNotFound(true);
          return;
        }
        if (!response.ok) {
          throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
        const jsxCode = await response.text();

        const exportMatch = jsxCode.match(/export default (\w+);/);
        const componentName = exportMatch ? exportMatch[1] : null;
        if (!componentName) {
          throw new Error("Could not find a default export in the fetched file (e.g., 'export default MyComponent;').");
        }

        const cleanedJsx = jsxCode.replace(/import React, {.*} from 'react';/s, '').replace(/export default .*;/, '');

        const {code: jsCode} = transform(cleanedJsx, {
          presets: [['react', {runtime: 'classic'}]],
        });

        const setupScript = `const { useState, useEffect, useMemo, useCallback, useRef } = React;`;
        // eslint-disable-next-line @typescript-eslint/no-implied-eval
        const ComponentFactory = new Function('React', `${setupScript}\n${jsCode}\nreturn ${componentName};`);
        const FetchedComponent = ComponentFactory(React);

        setDynamicComponent(() => FetchedComponent);
      } catch (e) {
        setError(e instanceof Error ? e : new Error('An unknown error occurred'));
      } finally {
        setLoading(false);
      }
    };

    fetchAndCreateComponent();
  }, [url]);

  if (notFound) return null;
  if (loading) {
    return LoadingComponent ? <LoadingComponent /> : <div>Loading...</div>;
  }
  if (error) {
    return ErrorComponent ? <ErrorComponent error={error} /> : null;
  }
  return DynamicComponent ? <DynamicComponent /> : null;
};

export interface RemoteVisualizerLoaderProps {
  problemId: number;
}

const RemoteVisualizerLoader: React.FC<RemoteVisualizerLoaderProps> = ({problemId}: RemoteVisualizerLoaderProps) => {
  const url = `https://raw.githubusercontent.com/romankurnovskii/leetcode-apps/refs/heads/feat-visualization-snippets/visualizations/${problemId}/01.jsx`;

  const CustomLoading: React.FC = () => (
    <div>
      <div>Loading...</div>
      <p>{url}</p>
    </div>
  );

  const CustomError: React.FC<{error: Error}> = ({error}: {error: Error}) => (
    <div>
      <p>Failed to Load Component</p>
      <p>{error.message}</p>
      <p>
        This can happen due to network issues (CORS), or errors in the fetched code. Check the browser's developer
        console for more details.
      </p>
    </div>
  );

  return <RemoteComponent url={url} LoadingComponent={CustomLoading} ErrorComponent={CustomError} />;
};

export {RemoteVisualizerLoader as RemoteComponentViewer};
export default RemoteVisualizerLoader;
