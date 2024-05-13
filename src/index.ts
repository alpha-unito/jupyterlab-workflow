import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { DOMUtils } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { ReactWidget } from '@jupyterlab/apputils';
import { Panel } from '@lumino/widgets';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
import { topArea } from './widget';
import { settingsIcon } from '@jupyterlab/ui-components';
import { createDivWithText } from './widget';
/**
 * Initialization data for the jupyterlab_workflow extension.
 */

class EditBar extends Widget {
  private panel: Panel | null = null;
  constructor(private app: JupyterFrontEnd) {
    super();
    const div = document.createElement('div');
    div.className = 'jp-EditBarContainer';

    const button = document.createElement('button');
    button.className = 'jp-EditBarButton';

    const icon = settingsIcon.element({ tag: 'span' });
    icon.classList.add('jp-GearIcon');
    button.appendChild(icon);

    const text = document.createElement('span');
    text.textContent = 'Edit Workflow Step';
    button.appendChild(text);

    button.onclick = () => {
      // If a panel is already open, remove it from the shell and dispose it
      if (this.panel) {
        return;
      }

      // Create a new panel and add it to the main area
      this.panel = new Panel();
      this.panel.node.style.overflowY = 'auto';
      // Create buttons
      const CancelButton = document.createElement('button');
      CancelButton.textContent = 'Cancel';
      CancelButton.style.position = 'sticky';
      CancelButton.style.bottom = '0';

      const ResetButton = document.createElement('button');
      ResetButton.textContent = 'Reset';
      ResetButton.style.position = 'sticky';
      ResetButton.style.bottom = '0';

      const EditButton = document.createElement('button');
      EditButton.textContent = 'Edit';
      EditButton.style.position = 'sticky';
      EditButton.style.bottom = '0';

      // Create div with class 'BottomButtons'
      const div = document.createElement('div');
      div.className = 'jp-BottomButtons';
      div.style.position = 'sticky';
      div.style.bottom = '0';

      // Append buttons to div
      div.appendChild(CancelButton);
      div.appendChild(ResetButton);
      div.appendChild(EditButton);

      // Append div to panel node
      this.panel.node.appendChild(div);
      this.panel.id = DOMUtils.createDomID();
      this.panel.title.label = 'Metadata Editor';
      this.panel.title.closable = true;
      this.app.shell.add(this.panel, 'main', { mode: 'split-right' });

      // Create a div with text using the createDivWithText function
      console.log(createDivWithText);
      const divWithText = createDivWithText();

      console.log(divWithText);
      // Wrap the divWithText element inside a Widget
      const widget = ReactWidget.create(divWithText);

      // Add the widget directly to the panel
      this.panel.addWidget(widget);
    };

    div.appendChild(button);
    this.node.appendChild(div);
  }
}

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_workflow:plugin',
  description:
    'Manage and modify HPC workflows directly from your jupyterLab environment with an intuitive interface.',
  autoStart: true,
  requires: [INotebookTracker],
  activate: (app: JupyterFrontEnd, tracker: INotebookTracker) => {
    console.log('jupyterlab_workflow is activated!');

    // Add the imported widget to the top area of the application shell
    topArea.id = DOMUtils.createDomID();
    app.shell.add(topArea, 'top', { rank: 1000 });

    let previousCell: Cell | null = null;

    // Add a blue bar to the top of the active cell
    tracker.activeCellChanged.connect(() => {
      // If there was a previous cell, remove the blue bar from it
      if (previousCell && previousCell.model.type === 'code') {
        const editBar = previousCell.node.firstChild;
        if (editBar) {
          previousCell.node.removeChild(editBar);
        }
      }

      const cell = tracker.activeCell;
      if (cell && cell.model.type === 'code') {
        const editBar = new EditBar(app);
        cell.node.insertBefore(editBar.node, cell.node.firstChild);
      }

      // Update the previous cell
      previousCell = cell;
    });
  }
};

export default plugin;
