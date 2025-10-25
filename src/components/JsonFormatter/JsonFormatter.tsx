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

  

  console.log(leftJson, rightJson);

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