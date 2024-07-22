import * as React from 'react';
import { useState } from 'react';
import { Widget } from '@lumino/widgets';
import { ReactWidget } from '@jupyterlab/ui-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

function TopArea() {
  return <div className="jp-TopArea">Hello JupyterLab Workflow!</div>;
}

export const topArea: Widget = ReactWidget.create(<TopArea />);

export function CreateDivWithText({ metadata }: { metadata: any }) {
  console.log('editorWIDGET', metadata);

  const initialWorkflowStepIn = metadata?.workflow?.step?.in || [];
  const [workflowStepIn, setWorkflowStepIn] = useState(initialWorkflowStepIn);
  const [inputName, setInputName] = useState('');
  const [inputError, setInputError] = useState(false);
  const [inputRepeatError, setInputRepeatError] = useState(false);
  const [outputRepeatError, setOutputRepeatError] = useState(false);

  const handleAddInputClick = () => {
    setInputRepeatError(false); // clear the error state
    setInputError(false); // clear the error state

    if (inputName.trim() === '') {
      setInputError(true);
      return;
    }

    if (workflowStepIn.some((item: any) => item.name === inputName)) {
      setInputRepeatError(true);
      return;
    }

    const newItem = {
      name: inputName,
      type: 'name', // default type
      valueFrom: '' // default value
    };
    setWorkflowStepIn([...workflowStepIn, newItem]);

    metadata.workflow.step.in = [...workflowStepIn, newItem];
    console.log('metadata', metadata);

    setInputName(''); // clear the input field
    setInputRepeatError(false); // clear the error state
    setInputError(false); // clear the error state
  };

  const initialWorkflowStepOut = metadata?.workflow?.step?.out || [];
  const [workflowStepOut, setWorkflowStepOut] = useState(
    initialWorkflowStepOut
  );
  const [outputName, setOutputName] = useState('');
  const [outputError, setOutputError] = useState(false);

  const handleDeleteInputClick = (name: string) => {
    setWorkflowStepIn(workflowStepIn.filter((item: any) => item.name !== name));
  };

  const handleDeleteOutputClick = (name: string) => {
    setWorkflowStepOut(
      workflowStepOut.filter((item: any) => item.name !== name)
    );
  };

  const handleAddOutputClick = () => {
    setOutputRepeatError(false); // clear the error state
    setOutputError(false); // clear the error state

    if (outputName.trim() === '') {
      setOutputError(true);
      return;
    }

    if (workflowStepOut.some((item: any) => item.name === outputName)) {
      setOutputRepeatError(true);
      return;
    }

    const newItem = {
      name: outputName,
      type: 'name', // default type
      valueFrom: '' // default value
    };
    setWorkflowStepOut([...workflowStepOut, newItem]);

    metadata.workflow.step.out = [...workflowStepOut, newItem];
    console.log('metadata', metadata);

    setOutputName(''); // clear the output field
    setOutputRepeatError(false); // clear the error state
    setOutputError(false); // clear the error state
  };

  const scatter = metadata?.workflow?.step?.scatter || [];

  console.log('workflowStepIn', workflowStepIn);
  console.log('workflowStepOut', workflowStepOut);

  return (
    <div className="jp-PanelContainer">
      <div className="jp-PanelHeader">
        <h1>Welcome to the metadata editor!</h1>
        <hr className="jp-StartHR" />
      </div>
      <div className="jp-ConfigurationContainer">
        <h2>Configuration</h2>
        <div className="jp-CheckboxInline">
          <input type="checkbox" />
          <p>Execute in background</p>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            title="A cell without output ports can run in background"
          />
        </div>
      </div>
      <hr />
      <div className="jp-OutputsInputsContainer">
        <h2>Inputs</h2>
        <div className="jp-List">
          <div className="jp-CheckboxInline">
            <input type="checkbox" defaultChecked />
            <p>Automatically infer input dependencies</p>
            <button className="jp-ButtonEye">
              <FontAwesomeIcon icon={faEye} title="Toggle visibility" />
            </button>
          </div>
          <div className="jp-AddNameContainer">
            <input
              type="text"
              placeholder="Input Name"
              value={inputName}
              onChange={e => setInputName(e.target.value)}
              className={inputError || inputRepeatError ? 'jp-InputError' : ''}
            />
            <button className="jp-Button" onClick={handleAddInputClick}>
              Add
            </button>
          </div>
          <div className="jp-InputErrorText jp-ErrorText">
            {inputError && 'WARNING: Specify the input name you want to add.'}
            {inputRepeatError &&
              'WARNING: This name is already used. Please choose a different name.'}
          </div>
          {workflowStepIn.map((item: any, index: any) => (
            <div className="jp-Row" key={index}>
              <div className="jp-Delete">
                <p>{item.name}</p>
                <button
                  className="jp-Button"
                  onClick={() => handleDeleteInputClick(item.name)}
                >
                  Delete
                </button>
              </div>
              <div className="jp-Group">
                <h3>Type</h3>
                <select defaultValue={item.type}>
                  <option>name</option>
                  <option>file</option>
                  <option>control</option>
                  <option>environment</option>
                </select>
              </div>
              <div className="jp-Group">
                <h3>Value</h3>
                <input
                  type="text"
                  placeholder="Type"
                  defaultValue={item.valueFrom}
                />
              </div>
              <div className="jp-Group">
                <div className="jp-CheckboxInline">
                  <input type="checkbox" defaultChecked />
                  <p>From name</p>
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    title="When checked, the Value field is interpreted as a variable name from which to derive the actual value. When unchecked, the Value field is instead interpreted as a string value for the variable."
                  />
                </div>
                <div className="jp-Group">
                  <h3>Serializer</h3>
                  <select defaultValue="Auto">
                    <option>Auto</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="jp-ScatterContainer">
        <h2>Scatter</h2>
        <MyEditor metadata={{ scatter }} onValueChange={() => {}} />
      </div>
      <hr />
      <div className="jp-OutputsInputsContainer">
        <h2>Outputs</h2>
        <div className="jp-List">
          <div className="jp-AddNameContainer">
            <input
              type="text"
              placeholder="Output Name"
              value={outputName}
              onChange={e => setOutputName(e.target.value)}
              className={
                outputError || outputRepeatError ? 'jp-InputError' : ''
              }
            />
            <button className="jp-Button" onClick={handleAddOutputClick}>
              Add
            </button>
          </div>
          <div className="jp-InputErrorText jp-ErrorText">
            {outputError && 'WARNING: Specify the input name you want to add.'}
            {outputRepeatError &&
              'WARNING: This name is already used. Please choose a different name.'}
          </div>
          {workflowStepOut.map((item: any, index: any) => (
            <div className="jp-Row" key={index}>
              <div className="jp-Delete">
                <p>{item.name}</p>
                <button
                  className="jp-Button"
                  onClick={() => handleDeleteOutputClick(item.name)}
                >
                  Delete
                </button>
              </div>
              <div className="jp-Group">
                <h3>Type</h3>
                <select defaultValue={item.type}>
                  <option>name</option>
                  <option>file</option>
                  <option>control</option>
                </select>
              </div>
              <div className="jp-Group">
                <h3>Value</h3>
                <input
                  type="text"
                  placeholder="Type"
                  defaultValue={item.value || item.valueFrom}
                />
              </div>
              <div className="jp-Group">
                <div className="jp-CheckboxInline">
                  <input type="checkbox" defaultChecked />
                  <p>From name</p>
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    title="When checked, the Value field is interpreted as a variable name from which to derive the actual value. When unchecked, the Value field is instead interpreted as a string value for the variable."
                  />
                </div>
                <div className="jp-Group">
                  <h3>Serializer</h3>
                  <select defaultValue="Auto">
                    <option>Auto</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <hr />
      <div className="jp-TargetContainer">
        <h2>Target</h2>
        <div className="jp-Group">
          <h3>Deployment</h3>
          <select defaultValue="Auto">
            <option>Auto</option>
          </select>
        </div>
        <div className="jp-Group">
          <h3>Locations</h3>
          <InputWithButtons />
        </div>
        <div className="jp-Group">
          <h3>Service</h3>
          <input type="text" />
        </div>
        <div className="jp-Group">
          <h3>Workdir</h3>
          <input type="text" placeholder="/tmp/streamflow" />
        </div>
        <div className="jp-Group">
          <h3>Python interpreter</h3>
          <input type="text" placeholder="iphyton" />
        </div>
      </div>
      <hr />
      {/* <div className="jp-BottomButtons">
        <button>Cancel</button>
        <button>Reset</button>
        <button>Edit</button>
      </div> */}
    </div>
  );
}

function InputWithButtons() {
  const [value, setValue] = useState(1);

  const increase = () => {
    setValue(value + 1);
  };

  const decrease = () => {
    if (value > 1) {
      setValue(value - 1);
    }
  };

  return (
    <div>
      <button className="jp-LocationButton" onClick={decrease}>
        -
      </button>
      <input type="text" placeholder="Type" value={value} readOnly />
      <button className="jp-LocationButton" onClick={increase}>
        +
      </button>
    </div>
  );
}

export function MyEditor({
  metadata,
  onValueChange
}: {
  metadata: any;
  onValueChange: (value: string) => void;
}) {
  const [value, setValue] = useState(JSON.stringify(metadata, null, 2));

  useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  return (
    <div className="editorContainer">
      <div className="editorCodeMirror">
        <CodeMirror
          value={value}
          options={{
            lineNumbers: true,
            theme: 'darcula',
            mode: 'application/json',
            lineWrapping: true
          }}
          onBeforeChange={(editor, data, value) => {
            setValue(value);
          }}
        />
      </div>
    </div>
  );
}

export function createEditorWidget(
  metadata: any,
  onValueChange: (value: string) => void
) {
  return ReactWidget.create(
    <MyEditor metadata={metadata} onValueChange={onValueChange} />
  );
}

/* function MyEditor() {
  const [value, setValue] = useState('');

  return (
    <CodeMirror
      value={value}
      options={{
        mode: 'javascript',
        theme: 'material',
        lineNumbers: true
      }}
      onBeforeChange={(editor, data, value) => {
        setValue(value);
      }}
    />
  );
} */
