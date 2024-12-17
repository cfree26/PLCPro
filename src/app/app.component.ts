import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ConnectionService } from './connection.service'; // Import the service
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'PLCPro';
  isConnected: boolean = false; // Keep track of connection state
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
      // You could trigger any project-specific logic here
    } else {
      console.log('Please connect first!');
    }
  }

  // Clean up the subscription when the component is destroyed
  ngOnDestroy() {
    this.connectionSubscription.unsubscribe();
  }
}
