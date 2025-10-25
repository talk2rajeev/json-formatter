import { useEffect, useRef } from 'react';
import { DiffEditor, useMonaco } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
// import ThemeSelector from '../ThemeSelector/ThemeSelector';
// import {themes, type Theme} from '../../utils/constants/constants';

const JsonCompare = () => {

  const diffEditorRef = useRef<editor.IStandaloneDiffEditor | null>(null);

  const originalModelRef = useRef<editor.ITextModel | null>(null);
  const modifiedModelRef = useRef<editor.ITextModel | null>(null);
  // const [theme, setTheme] = useState<Theme>(themes[0]);

  const monaco = useMonaco();

  useEffect(() => {
    // Check if monaco is loaded and models don't already exist
    if (monaco && !originalModelRef.current) {
      originalModelRef.current = monaco.editor.createModel('{}', 'json');
    }
    if (monaco && !modifiedModelRef.current) {
      modifiedModelRef.current = monaco.editor.createModel('{}', 'json');
    }

    // This cleanup function runs when the component unmounts.
    // We use a type guard to ensure the model exists before calling dispose().
    return () => {
      // Check if the current value of the ref is not null
      if (originalModelRef.current) {
        originalModelRef.current.dispose();
      }
      if (modifiedModelRef.current) {
        modifiedModelRef.current.dispose();
      }
    };
  }, [monaco]);

  const handleEditorDidMount = (editorInstance: editor.IStandaloneDiffEditor) => {
    diffEditorRef.current = editorInstance;
    editorInstance.getOriginalEditor().updateOptions({ readOnly: false });
    editorInstance.getModifiedEditor().updateOptions({ readOnly: false });

    
  };

  // const handleSetTheme = (value: Theme) => {
  //   setTheme(value);
  // }


  return (
    <div className="flex flex-col gap-4 p-4 h-screen">
      {/* <ThemeSelector theme={theme} setTheme={handleSetTheme}/> */}
      <DiffEditor
        height="80vh"
        language="json"
        theme="vs-dark"
        original={originalModelRef.current?.getValue()} 
        modified={modifiedModelRef.current?.getValue()}
        onMount={handleEditorDidMount}
        options={{
          minimap: { enabled: true },
          scrollBeyondLastLine: false,
          fontSize: 13,
          automaticLayout: true,
          renderSideBySide: true,
          originalEditable: true,
        }}
      />
    </div>
  );
};

export default JsonCompare;