import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';  // Correct path for AppComponent
import { WorkspaceComponent } from './app/workspace/workspace.component';  // Correct path for WorkspaceComponent
import { ToolbarComponent } from './app/toolbar/toolbar.component';  // Correct path for ToolbarComponent
import { StatusBarComponent } from './app/status-bar/status-bar.component';  // Correct path for StatusBarComponent

// Bootstrapping the AppComponent directly
bootstrapApplication(AppComponent, {
  providers: [
    // Add any global providers here if needed
  ]
})
  .catch((err) => console.error(err));
