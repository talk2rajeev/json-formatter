import React, { useState, useRef, useEffect } from 'react';
import * as monaco from 'monaco-editor';
interface JsonEditorProps {
  initialJson?: string;
}

const JsonEditor: React.FC<JsonEditorProps> = ({ initialJson = '' }) => {
  const [error, setError] = useState<string | null>(null);
  const editorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Initialize Monaco Editor
      editorRef.current = monaco.editor.create(containerRef.current, {
        value: initialJson,
        language: 'json',
        lineNumbers: 'on',
        minimap: { enabled: true },
        scrollBeyondLastLine: false,
        automaticLayout: true,
      });

      // Clean up editor on component unmount
      return () => {
        editorRef.current?.dispose();
      };
    }
  }, [initialJson]);

  const handleFormatJson = () => {
    if (!editorRef.current) return;

    const jsonInput = editorRef.current.getValue();
    try {
      const parsedJson = JSON.parse(jsonInput);
      const formattedJson = JSON.stringify(parsedJson, null, 2);
      editorRef.current.setValue(formattedJson);
      setError(null);
    } catch (err) {
      if (err instanceof SyntaxError) {
        const errorMessage = err.message;
        const match = errorMessage.match(/position (\d+)/);
        let detailedError = 'Invalid JSON format: ' + errorMessage;
        if (match) {
          const position = parseInt(match[1], 10);
          const lines = jsonInput.substring(0, position).split('\n');
          const lineNumber = lines.length;
          const columnNumber = lines[lines.length - 1].length + 1;
          detailedError += ` at line ${lineNumber}, column ${columnNumber}`;
          // Highlight the error line in Monaco Editor
          editorRef.current.revealLineInCenter(lineNumber);
          monaco.editor.setModelMarkers(editorRef.current.getModel()!, 'owner', [
            {
              startLineNumber: lineNumber,
              startColumn: columnNumber,
              endLineNumber: lineNumber,
              endColumn: columnNumber + 1,
              message: errorMessage,
              severity: monaco.MarkerSeverity.Error,
            },
          ]);
        } else {
          monaco.editor.setModelMarkers(editorRef.current.getModel()!, 'owner', []);
        }
        setError(detailedError);
      } else {
        setError('Unexpected error while parsing JSON');
        monaco.editor.setModelMarkers(editorRef.current.getModel()!, 'owner', []);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">JSON Editor</h2>
      <div
        ref={containerRef}
        className="w-full h-[500px] border rounded-md overflow-hidden"/>
      <button
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-400"
        onClick={handleFormatJson}
        disabled={!editorRef.current?.getValue().trim()}
      >
        Format JSON
      </button>
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
};

export default JsonEditor;