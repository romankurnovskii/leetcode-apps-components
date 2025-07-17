# leetcode-remote-component

Dynamically load and render remote React components from a URL.

## Installation

```bash
npm install leetcode-remote-component
```

or

```bash
yarn add leetcode-remote-component
```

## Usage

```tsx
import React from 'react';
import { RemoteComponentViewer } from 'leetcode-remote-component';

const problemId = '704'; // Example: Binary Search
const url = `https://raw.githubusercontent.com/romankurnovskii/leetcode-apps/main/visualizations/${problemId}/01.jsx`;

const App: React.FC = () => (
  <div className="bg-gray-100 min-h-screen p-4 sm:p-8">
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold text-gray-800">Remote Component Loader</h1>
      <p className="text-lg text-gray-600 mt-2">Demonstrating how to dynamically load and render a React component from a URL.</p>
    </div>
    <RemoteComponentViewer url={url} />
  </div>
);

export default App;
```

## Props

### `<RemoteComponentViewer />`

| Prop                     | Type                                                         | Description                            |
| ------------------------ | ------------------------------------------------------------ | -------------------------------------- |
| `url`                    | `string`                                                     | URL to fetch the remote component from |
| `CustomLoadingComponent` | `React.ComponentType`                                        | (Optional) Custom loading UI           |
| `CustomErrorComponent`   | `React.ComponentType<{ error: Error; onRetry: () => void }>` | (Optional) Custom error UI             |

## License

MIT 