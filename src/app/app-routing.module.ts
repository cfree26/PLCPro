import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router'; // Import necessary modules
import { WorkspaceComponent } from './workspace/workspace.component'; // Import WorkspaceComponent

// Define the routes
const routes: Routes = [
  { path: '', component: WorkspaceComponent },  // Default route for the workspace
  // You can add more routes if needed in the future
  // Example:
  // { path: 'other', component: OtherComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)], // Configure the routes
  exports: [RouterModule] // Export the RouterModule so it can be used in the app
})
export class AppRoutingModule {}
