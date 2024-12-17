import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent {

  // Event emitters for the connect and run button actions
  @Output() connectClicked = new EventEmitter<void>();
  @Output() runClicked = new EventEmitter<void>();

  // Method to handle the connect button click
  onConnectClick() {
    this.connectClicked.emit();
  }

  // Method to handle the run button click
  onRunClick() {
    this.runClicked.emit();
  }
}
