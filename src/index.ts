import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { DOMUtils } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';
import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';
import { Panel } from '@lumino/widgets';
import { INotebookTracker } from '@jupyterlab/notebook';
import { Cell } from '@jupyterlab/cells';
import { topArea } from './widget';
import { settingsIcon } from '@jupyterlab/ui-components';
import { Dialog, showDialog } from '@jupyterlab/apputils';
import { createEditorWidget } from './widget';
import { CreateDivWithText } from './widget';
import { checkIcon } from '@jupyterlab/ui-components';
import { errorIcon } from '@jupyterlab/ui-components';
/**
 * Initialization data for the jupyterlab_workflow extension.
 */

class EditBar extends Widget {
  private panel: Panel | null = null;
  constructor(
    private app: JupyterFrontEnd,
    metadata: any,
    cell: any
  ) {
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

    const newPageButton = document.createElement('button');
    newPageButton.className = 'jp-EditBarButton';
    newPageButton.textContent = 'Json Editor';

    newPageButton.onclick = () => {
      const newPanel = new Panel();
      newPanel.id = DOMUtils.createDomID();
      newPanel.node.classList.add('jp-PanelBackground');
      newPanel.title.label = 'Json Editor';
      newPanel.node.style.opacity = '0';
      newPanel.node.style.transition = 'opacity 0.8s ease-in-out';
      newPanel.title.closable = true;
      this.app.shell.add(newPanel, 'main', { mode: 'split-right' });

      const titleWidget = new Widget();
      titleWidget.node.innerText = 'Welcome to the JSON editor!';
      titleWidget.node.classList.add('jp-jsonEditTitle'); // Add a CSS class to the title widget

      const descriptionWidget = new Widget();
      descriptionWidget.node.innerText =
        'This is a JSON editor. You can use it to edit the metadata.';
      descriptionWidget.node.classList.add('jp-jsonEditDescription'); // Add a CSS class to the description widget

      newPanel.addWidget(titleWidget);
      newPanel.addWidget(descriptionWidget);

      let editorValue = JSON.stringify(metadata, null, 2);

      const editorWidget = createEditorWidget(metadata, value => {
        editorValue = value;
      });

      newPanel.addWidget(editorWidget);

      // Create a new button widget
      const buttonWidget = new Widget();
      buttonWidget.node.innerText = 'Update Metadata';
      buttonWidget.node.classList.add('jp-jsonEditButton'); // Add a CSS class to the button widget

      // Add an onclick event to the button
      buttonWidget.node.onclick = () => {
        try {
          const newValue = JSON.parse(editorValue);
          console.log('newValue', newValue);
          // Update the metadata with the new value
          metadata = newValue;
          console.log('CLICKED');
          cell.metadata = metadata;

          // Create a widget with the success message and an icon
          const successWidget = new Widget();
          const iconElement = checkIcon.element({
            tag: 'span',
            height: '50px',
            width: '50px',
            elementPosition: 'center',
            padding: '8px',
            marginBottom: '20px',
            backgroundColor: '#37DC27',
            borderRadius: '50%'
          });

          successWidget.node.innerHTML = `${iconElement.outerHTML} Metadata update successfully!`;

          // Show a dialog with the success widget
          showDialog({
            title: 'Success',
            body: successWidget,
            buttons: [Dialog.okButton({ label: 'OK' })]
          });
        } catch (error) {
          console.error('Invalid JSON:', error);

          const errorWidget = new Widget();
          const iconElement = errorIcon.element({
            tag: 'span',
            height: '50px',
            width: '50px',
            elementPosition: 'center',
            padding: '8px',
            marginBottom: '20px',
            backgroundColor: '#FF3600',
            borderRadius: '50%'
          });

          errorWidget.node.innerHTML = `${iconElement.outerHTML} Metadata fail to update!`;

          // Show a dialog with the success widget
          showDialog({
            title: 'Error',
            body: errorWidget,
            buttons: [Dialog.okButton({ label: 'OK' })]
          });
        }
      };

      // Add the button widget to the panel
      newPanel.addWidget(buttonWidget);

      setTimeout(() => {
        if (newPanel) {
          newPanel.node.style.opacity = '1';
        }
      }, 0);
    };

    button.onclick = () => {
      // If a panel is already open, remove it from the shell and dispose it
      if (this.panel) {
        return;
      }

      // Create a new panel and add it to the main area
      this.panel = new Panel();
      this.panel.node.classList.add('jp-PanelBackground');
      this.panel.node.style.overflowY = 'auto';
      this.panel.node.style.opacity = '0';
      this.panel.node.style.transition = 'opacity 0.8s ease-in-out';
      // Create buttons
      const CancelButton = document.createElement('button');
      CancelButton.textContent = 'Cancel';

      const ResetButton = document.createElement('button');
      ResetButton.textContent = 'Reset';

      const EditButton = document.createElement('button');
      EditButton.textContent = 'Edit';

      EditButton.onclick = () => {
        console.log('EDITT: ', metadata);
        console.log('EDITT UPDATED: ', EditorUpdatedMetadata);
        metadata = JSON.parse(JSON.stringify(EditorUpdatedMetadata));
        cell.model.deleteMetadata();
        cell.model.setMetadata('workflow', EditorUpdatedMetadata.workflow);
        console.log('METADATA DOPO SET: ', cell.model.metadata);
      };

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
      console.log(CreateDivWithText);

      const EditorUpdatedMetadata = JSON.parse(JSON.stringify(metadata));
      const divWithText = React.createElement(CreateDivWithText, {
        metadata: EditorUpdatedMetadata
      });

      console.log(divWithText);
      // Wrap the divWithText element inside a Widget
      const widget = ReactWidget.create(divWithText);

      // Add the widget directly to the panel
      this.panel.addWidget(widget);

      // After adding the elements to the DOM, make it visible
      setTimeout(() => {
        if (this.panel) {
          this.panel.node.style.opacity = '1';
        }
      }, 0);
    };

    div.appendChild(button);
    div.appendChild(newPageButton); // Append the new button to the div
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
        const cellMetadata = cell.model.metadata;
        const editBar = new EditBar(app, cellMetadata, cell);
        cell.node.insertBefore(editBar.node, cell.node.firstChild);
      }

      tracker.forEach(notebookPanel => {
        notebookPanel.content.widgets.forEach(cell => {
          const cellMetadata = cell.model.metadata;
          const metadataJson = JSON.stringify(cellMetadata);
          console.log('Metadata JSON:', metadataJson);

          if ('workflow' in cell.model.metadata) {
            // Change the background color of the cell
            cell.node.style.backgroundColor = '#DBF9FF';
          }
        });
      });

      // Update the previous cell
      previousCell = cell;
    });
  }
};

export default plugin;
