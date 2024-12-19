import { Routes } from '@angular/router';
import { WorkspaceComponent } from './workspace/workspace.component'; // Import your workspace component

// Define routes
export const routes: Routes = [
  { path: '', component: WorkspaceComponent }, // Default route to the workspace component
  // Add more routes as needed, for example:
  // { path: 'other-component', component: OtherComponent },
];
