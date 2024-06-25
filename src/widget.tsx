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

export function createDivWithText(metadata: any) {
  console.log('editorWIDGET', metadata);

  const workflowStepIn = metadata?.workflow?.step?.in || [];
  const workflowStepOut = metadata?.workflow?.step?.out || [];
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
          {workflowStepIn.map((item: any, index: any) => (
            <div className="jp-Row" key={index}>
              <div className="jp-Delete">
                <p>{item.name}</p>
                <button className="jp-Button">Delete</button>
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
                    title="When checked....."
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
          <div className="jp-AddNameContainer">
            <input type="text" placeholder="Input Name" />
            <button className="jp-Button">Add</button>
          </div>
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
          {workflowStepOut.map((item: any, index: any) => (
            <div className="jp-Row" key={index}>
              <div className="jp-Delete">
                <p>{item.name}</p>
                <button className="jp-Button">Delete</button>
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
                    title="When checked....."
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
          <div className="jp-AddNameContainer">
            <input type="text" placeholder="Output Name" />
            <button className="jp-Button">Add</button>
          </div>
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
