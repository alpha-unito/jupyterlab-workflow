import * as React from 'react';
/* import { UnControlled as CodeMirror } from 'react-codemirror2';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript'; */
import { Widget } from '@lumino/widgets';
import { ReactWidget } from '@jupyterlab/ui-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { faEye } from '@fortawesome/free-solid-svg-icons';

function TopArea() {
  return <div className="jp-TopArea">Hello JupyterLab Workflow!</div>;
}

export const topArea: Widget = ReactWidget.create(<TopArea />);

export function createDivWithText() {
  return (
    <div className="jp-PanelContainer">
      <h1>Welcome to the metadata editor!</h1>
      <hr className="jp-StartHR" />
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
      <div className="jp-InputsContainer">
        <h2>Inputs</h2>
        <div className="jp-List">
          <div className="jp-CheckboxInline">
            <input type="checkbox" defaultChecked />
            <p>Automatically infer input dependencies</p>
            <button className="jp-ButtonEye">
              <FontAwesomeIcon icon={faEye} title="Toggle visibility" />
            </button>
          </div>
          <div className="jp-Row">
            <div className="jp-Delete">
              <button className="jp-Button">Delete</button>
            </div>
            <div className="jp-Group">
              <h3>Type</h3>
              <select defaultValue="File">
                <option>Name</option>
                <option>File</option>
                <option>Control</option>
                <option>Environment</option>
              </select>
            </div>
            <div className="jp-Group">
              <h3>Value</h3>
              <input type="text" placeholder="Type" defaultValue="merged" />
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
          <div className="jp-Row">
            <div className="jp-Delete">
              <button className="jp-Button">Delete</button>
            </div>
            <div className="jp-Group">
              <h3>Type</h3>
              <select defaultValue="File">
                <option>Name</option>
                <option>File</option>
                <option>Control</option>
                <option>Environment</option>
              </select>
            </div>
            <div className="jp-Group">
              <h3>Value</h3>
              <input type="text" placeholder="Type" defaultValue="merged" />
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
          <div className="jp-AddNameContainer">
            <input type="text" placeholder="Name" />
            <button className="jp-Button">Add</button>
          </div>
        </div>
      </div>
      <hr />
      <div className="jp-ScatterContainer">
        <h2>Scatter</h2>
        <div className="jp-CheckboxInline">
          <input type="checkbox" />
          <p>Scatter over inputs</p>
          <FontAwesomeIcon
            icon={faQuestionCircle}
            title="Scatter over inputs"
          />
        </div>
      </div>
      <div className="jp-BottomButtons">
        <button className="jp-Button">Add Input</button>
        <button className="jp-Button">Add Output</button>
      </div>
    </div>
  );
}
/* 
function CodeMirrorComponent() {
  return (
    <CodeMirror
      options={{
        lineNumbers: true,
        mode: 'javascript',
        theme: 'material'
      }}
    />
  );
} */
