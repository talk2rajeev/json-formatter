import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

const JsonEditor = () => {
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState<string>();
  const editorRef = useRef<editor.IStandaloneCodeEditor>(null);

  const handleEditorDidMount = (editor: editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
  };

  const formatJson = () => {
    console.log('format json start');
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

  const isJsonFormatterButtonDisabled = !jsonContent;
  console.log('isJsonFormatterButtonDisabled > ', isJsonFormatterButtonDisabled);

  const handleEditorChange = (value: string | undefined) => {
    setJsonContent(value || '');
  }

  

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      {error && <ErrorAlert msg={error} closeError={closeError} />}
      <div className="flex justify-end">
        {
          isJsonFormatterButtonDisabled ? <button
          onClick={formatJson}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:bg-gray-400 disabled:text-gray-200"
          disabled
        >
          Format JSON
        </button> : <button
          onClick={formatJson}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
        >
          Format JSON
        </button>
        }
      </div>
      <Editor
        height="80vh"
        language="json"
        theme="vs-dark"
        value={jsonContent}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 13,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default JsonEditor;