import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

  // BehaviorSubject to manage connection state (true for connected, false for disconnected)
  private isConnectedSource = new BehaviorSubject<boolean>(false);
  isConnected$ = this.isConnectedSource.asObservable(); // Observable for other components to subscribe to

  constructor() { }

  // Method to toggle the connection state
  toggleConnection() {
    const currentState = this.isConnectedSource.value; // Get current connection state
    this.isConnectedSource.next(!currentState); // Toggle the connection state
  }
}
