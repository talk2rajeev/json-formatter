# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```


## JSON compare component
```
import React, { useEffect, useRef } from 'react';
import { DiffEditor, useMonaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import { useDispatch, useSelector } from 'react-redux';
import { updateLeftJson, updateRightJson, selectLeftJson, selectRightJson } from '../../slices/jsonSlice';

const JsonCompare = () => {

  const leftJson = useSelector(selectLeftJson);
  const rightJson = useSelector(selectRightJson);
  
  const originalModelRef = useRef<editor.ITextModel | null>(null);
  const modifiedModelRef = useRef<editor.ITextModel | null>(null);
  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);
  const dispatch = useDispatch();

  const monaco = useMonaco();

  // Initialize models only once
  useEffect(() => {
    if (monaco && !originalModelRef.current && !modifiedModelRef.current) {
      console.log('Creating new models');
      originalModelRef.current = monaco.editor.createModel(JSON.stringify(leftJson, null, 2), 'json');
      modifiedModelRef.current = monaco.editor.createModel(JSON.stringify(rightJson, null, 2), 'json');
    }

    // Cleanup on unmount
    return () => {
      console.log('Disposing models');
      if (originalModelRef.current) {
        originalModelRef.current.dispose();
        originalModelRef.current = null;
      }
      if (modifiedModelRef.current) {
        modifiedModelRef.current.dispose();
        modifiedModelRef.current = null;
      }
    };
  }, [monaco]);
  

  const handleEditorDidMount = (editorInstance: editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editorInstance;
    console.log('DiffEditor mounted');

    // Ensure editors are editable
    editorInstance.getOriginalEditor().updateOptions({ readOnly: false });
    editorInstance.getModifiedEditor().updateOptions({ readOnly: false });

    // Set models explicitly to ensure they're linked correctly
    if (originalModelRef.current && modifiedModelRef.current) {
      editorInstance.setModel({
        original: originalModelRef.current,
        modified: modifiedModelRef.current,
      });
    }

    // Listener for LEFT editor changes
    const originalEditor = editorInstance.getOriginalEditor();
    originalEditor.onDidChangeModelContent(() => {
      const leftJsonData = originalModelRef.current?.getValue();
      if (leftJsonData !== undefined) {
        try {
          const parsedJson = JSON.parse(leftJsonData);
          dispatch(updateLeftJson(parsedJson));
        } catch (error) {
          console.error('Invalid JSON in original pane:', error);
        }
      }
    });

    // Listener for RIGHT editor changes
    const modifiedEditor = editorInstance.getModifiedEditor();
    modifiedEditor.onDidChangeModelContent(() => {
      const rightJsonData = modifiedModelRef.current?.getValue();
      if (rightJsonData !== undefined) {
        try {
          const parsedJson = JSON.parse(rightJsonData);
          dispatch(updateRightJson(parsedJson));
        } catch (error) {
          console.error('Invalid JSON in modified pane:', error);
        }
      }
    });
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      <DiffEditor
        height="80vh"
        language="json"
        theme="vs-dark"
        // Only set initial values, avoid re-rendering with getValue()
        original={originalModelRef.current ? originalModelRef.current.getValue() : '{"initial": "original"}'}
        modified={modifiedModelRef.current ? modifiedModelRef.current.getValue() : '{"initial": "modified"}'}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 13,
          automaticLayout: true,
          renderSideBySide: true,
          originalEditable: true,
          readOnly: false,
        }}
        // Prevent model recreation on re-render
        keepCurrentOriginalModel={true}
        keepCurrentModifiedModel={true}
      />
    </div>
  );
};

export default React.memo(JsonCompare);
```
