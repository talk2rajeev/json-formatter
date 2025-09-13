import { useState, useRef } from 'react';
import Editor from '@monaco-editor/react';

const Test = () => {
  const [jsonContent, setJsonContent] = useState('{\n  "name": "John Doe",\n  "age": 30\n}');
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor) => {
    editorRef.current = editor;
  };

  const formatJson = () => {
    try {
      const json = JSON.parse(jsonContent);
      const formatted = JSON.stringify(json, null, 2);
      setJsonContent(formatted);
      editorRef.current.setValue(formatted);
    } catch (error) {
      alert('Invalid JSON: ' + error.message);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
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
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default Test;