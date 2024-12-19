import { Component } from '@angular/core';
import { ConnectionService } from './connection.service'; // Import the service
import { Subscription } from 'rxjs';
import { WorkspaceComponent } from './workspace/workspace.component';  // Import the WorkspaceComponent
import { RouterModule } from '@angular/router'; // Import RouterModule for routing functionality
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet for routing functionality

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: true,  // Ensuring the component is standalone
  imports: [RouterModule, WorkspaceComponent, RouterOutlet] // Import RouterModule and WorkspaceComponent for routing
})
export class AppComponent {
  title = 'PLCPro';
  isConnected: boolean = false;  // Track connection state
  private connectionSubscription: Subscription;

  constructor(private connectionService: ConnectionService) {
    // Subscribe to the connection status observable from the service
    this.connectionSubscription = this.connectionService.isConnected$.subscribe(status => {
      this.isConnected = status;
    });
  }

  // Toggle connection state when the "Connect" button is clicked
  toggleConnection() {
    this.connectionService.toggleConnection();
  }

  // Handle "Run" button click
  runProject() {
    if (this.isConnected) {
      console.log('Running the project...');
    } else {
      console.log('Please connect first!');
    }
  }

  // Clean up the subscription when the component is destroyed
  ngOnDestroy() {
    if (this.connectionSubscription) {
      this.connectionSubscription.unsubscribe();
    }
  }
}
