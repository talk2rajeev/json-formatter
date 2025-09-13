import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

const Test = () => {
  const [jsonContent, setJsonContent] = useState('{\n  "name": "John Doe",\n  "age": 30\n}');
  const [error, setError] = useState<string>();
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const formatJson = () => {
    try {
      const json = JSON.parse(jsonContent);
      const formatted = JSON.stringify(json, null, 2);
      setJsonContent(formatted);
      if(editorRef.current){
        editorRef.current.setValue(formatted);
        setError('');
      }
    } catch (error: unknown) {
      if (error instanceof SyntaxError) {
        setError('Invalid JSON: ' + error.message);
      } else {
        setError('Unexpected error: ' + String(error));
      }
    }
  };

  const closeError = () => {
    setError('');
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md shadow-md flex justify-between items-center">
          <div>
            <p className="font-bold">Invalid JSON</p>
            <p>{error}</p>
          </div>
          <button
            onClick={closeError}
            className="text-red-700 hover:text-red-900 font-bold"
            aria-label="Close alert"
          >
            ✕
          </button>
        </div>
      )}
      <div className="flex justify-end">
        <button
          onClick={formatJson}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Format JSON
        </button>
      </div>
      <Editor
        height="80vh"
        language="json"
        theme="vs-dark"
        value={jsonContent}
        onChange={(value) => setJsonContent(value || '')}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default Test;