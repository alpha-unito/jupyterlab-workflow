import * as React from 'react';
import { Widget } from '@lumino/widgets';
import { ReactWidget } from '@jupyterlab/ui-components';

function TopArea() {
  return <div className="jp-TopArea">Hello JupyterLab Workflow!</div>;
}

export const topArea: Widget = ReactWidget.create(<TopArea />);

export function createDivWithText() {
  return (
    <div className="jp-PanelContainer">
      <h1>Welcome to the metadata editor!</h1>
      <hr />
      <div>
        <h2>prima scelta</h2>
        <input type="text" placeholder="Type here..." />
      </div>
    </div>
  );
}
