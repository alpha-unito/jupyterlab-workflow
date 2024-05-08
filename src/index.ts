import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

/**
 * Initialization data for the jupyterlab_workflow extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_workflow:plugin',
  description: 'Manage and modify HPC workflows directly from your jupyterLab environment with an intuitive interface.',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab_workflow is activated!');
  }
};

export default plugin;
