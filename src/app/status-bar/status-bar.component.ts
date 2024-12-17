import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.css']
})
export class StatusBarComponent {
  @Input() isConnected: boolean = false;
  statusText: string = 'Status: Disconnected';

  ngOnChanges() {
    this.statusText = this.isConnected ? 'Status: Connected' : 'Status: Disconnected';
  }
}
