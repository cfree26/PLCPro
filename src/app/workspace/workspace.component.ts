import { Component, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnChanges {
  
  @Input() isConnected: boolean = false;  // Input to accept the connection status
  message: string = 'Please connect to the controller to begin.';  // Default message

  // This method is called when the input property changes
  ngOnChanges() {
    // Update the workspace message based on connection state
    this.message = this.isConnected ? 'You are connected. Start programming!' : 'Please connect to the controller to begin.';
  }
}
