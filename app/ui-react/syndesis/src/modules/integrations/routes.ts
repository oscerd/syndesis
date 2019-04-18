/* tslint:disable:object-literal-sort-keys */
import { include } from 'named-urls';

/**
 * Both the integration creator and editor share the same routes when the creator
 * reaches the third step in the wizard. This object is to keep them DRY.
 */
const editorRoutes = {
  index: 'add-step',
  addStep: include(':position/connection', {
    selectConnection: '',
    selectAction: `:connectionId`,
    configureAction: `:connectionId/:actionId/:step?`,
  }),
  editStep: include(':position/edit-connection', {
    selectAction: `select-action/:connectionId`,
    configureAction: `:actionId/:step?`,
  }),
  saveAndPublish: 'save',
  root: '',
};

export default include('/integrations', {
  list: '',
  create: include('create', {
    start: include('start', {
      selectConnection: '',
      selectAction: `:connectionId`,
      configureAction: `:connectionId/:actionId/:step?`,
    }),
    finish: include('finish', {
      selectConnection: ``,
      selectAction: `:connectionId`,
      configureAction: `:connectionId/:actionId/:step?`,
    }),
    configure: include('configure', editorRoutes),
    root: '',
  }),
  integration: include(':integrationId', {
    details: 'details',
    activity: 'activity',
    metrics: 'metrics',
    edit: include('edit', editorRoutes),
    root: '',
  }),
});
