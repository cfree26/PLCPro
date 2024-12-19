import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule to use ngFor and ngIf

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  standalone: true,
  imports: [CommonModule]  // Ensure CommonModule is imported for ngFor, ngIf, etc.
})
export class WorkspaceComponent implements OnChanges {

  @Input() isConnected: boolean = false;  // Input to accept the connection status
  message: string = 'Please connect to the controller to begin.';  // Default message

  rungs: any[] = [];  // Data structure to hold the rungs and their components
  currentRungId: number = 0;  // To keep track of which rung is being worked on

  constructor() {}

  ngOnChanges() {
    this.message = this.isConnected ? 'You are connected. Start programming!' : 'Please connect to the controller to begin.';
  }

  // Create a new rung
  addRung(): void {
    const newRung = { id: this.currentRungId++, components: [] };
    this.rungs.push(newRung);
  }

  // Add a contact (NO or NC) to a rung
  addContactToRung(rungId: number, type: string): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const contact = { type: type, state: false };
      rung.components.push(contact);
    }
  }

  // Add a coil to a rung
  addCoilToRung(rungId: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const coil = { state: false };
      rung.components.push(coil);
    }
  }

  // Toggle the state of a contact (NO or NC)
  toggleContactState(rungId: number, contactIndex: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const contact = rung.components[contactIndex];
      contact.state = !contact.state;
      this.evaluateRung(rungId);  // Re-evaluate the rung after toggling
    }
  }

  // Toggle the state of a coil
  toggleCoilState(rungId: number, coilIndex: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const coil = rung.components[coilIndex];
      coil.state = !coil.state;
    }
  }

  // Evaluate rung logic (based on contact states)
  evaluateRung(rungId: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      let rungActive = true;

      for (let component of rung.components) {
        if (component.type === 'contact' && !component.state) {
          rungActive = false;
          break;
        }
      }

      for (let component of rung.components) {
        if (component.type === 'coil') {
          component.state = rungActive;
        }
      }
    }
  }
}
