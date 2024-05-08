import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';
import { DOMUtils } from '@jupyterlab/apputils';
import { Widget } from '@lumino/widgets';

const TOP_AREA_CSS_CLASS = 'jp-TopArea';

/**
 * Initialization data for the jupyterlab_workflow extension.
 */

const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_workflow:plugin',
  description:
    'Manage and modify HPC workflows directly from your jupyterLab environment with an intuitive interface.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('jupyterlab_workflow is activated!');
    const node = document.createElement('div');
    node.textContent = 'Hello JupyterLab Workflow!';
    const widget = new Widget({ node });
    widget.id = DOMUtils.createDomID();
    widget.addClass(TOP_AREA_CSS_CLASS);
    app.shell.add(widget, 'top', { rank: 1000 });
  }
};

export default plugin;
