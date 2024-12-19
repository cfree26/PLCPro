import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';  // Import CommonModule to use ngFor and ngIf
import * as fabric from 'fabric';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css'],
  standalone: true,
  imports: [CommonModule]  // Ensure CommonModule is imported
})
export class WorkspaceComponent implements OnChanges {

  @Input() isConnected: boolean = false;  // Input to accept the connection status
  message: string = 'Please connect to the controller to begin.';  // Default message

  rungs: any[] = []; // Data structure to hold the rungs and their components
  currentRungId: number = 0; // To keep track of which rung is being worked on

  @ViewChild('ladderCanvas', { static: true }) ladderCanvas!: ElementRef<HTMLCanvasElement>;
  canvas: any;

  constructor() {}

  ngOnInit(): void {
    this.initializeCanvas();
  }

  initializeCanvas(): void {
    this.canvas = new fabric.Canvas(this.ladderCanvas.nativeElement);
  }

  ngOnChanges() {
    this.message = this.isConnected ? 'You are connected. Start programming!' : 'Please connect to the controller to begin.';
  }

  // Create a new rung
  addRung(): void {
    const newRung = { id: this.currentRungId++, components: [] };
    this.rungs.push(newRung);
    this.renderRungs(); // Re-render the rungs to the canvas
  }

  renderRungs(): void {
    this.canvas.clear();  // Clear the canvas before rendering
    let yPosition = 50; // Starting Y position for rendering rungs
    this.rungs.forEach(rung => {
      this.renderRung(rung, yPosition);
      yPosition += 150; // Increment Y position for next rung
    });
  }

  renderRung(rung: any, yPosition: number): void {
    const rungLine = new fabric.Line([50, yPosition, 500, yPosition], {
      left: 50,
      top: yPosition,
      stroke: 'black',
      strokeWidth: 2
    });

    this.canvas.add(rungLine);

    let xPosition = 100;  // Starting X position for components
    rung.components.forEach((component: any) => {
      if (component.type === 'contact') {
        const contact = new fabric.Rect({
          left: xPosition,
          top: yPosition - 25,
          fill: component.state ? 'green' : component.contactType === 'NO' ? 'blue' : 'red',
          width: 30,
          height: 30,
          hasBorders: true,
          hasControls: false,
          selectable: true
        });

        contact.on('mousedown', () => this.toggleContactState(rung.id, rung.components.indexOf(component)));
;
        this.canvas.add(contact);
        xPosition += 50;
      } else if (component.type === 'coil') {
        const coil = new fabric.Rect({
          left: xPosition,
          top: yPosition - 25,
          fill: component.state ? 'yellow' : 'red',
          width: 30,
          height: 30,
          hasBorders: true,
          hasControls: false,
          selectable: true
        });

        coil.on('mousedown', () => this.toggleCoilState(rung.id, rung.components.indexOf(component)));
        this.canvas.add(coil);
      }
    });
  }

  addContactToRung(rungId: number, type: string): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const contact = { type: type, state: false };
      rung.components.push(contact);
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  addCoilToRung(rungId: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const coil = { state: false };
      rung.components.push(coil);
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  toggleContactState(rungId: number, contactIndex: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const contact = rung.components[contactIndex];
      contact.state = !contact.state;
      this.evaluateRung(rungId); // Re-evaluate the rung after toggling
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  toggleCoilState(rungId: number, coilIndex: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const coil = rung.components[coilIndex];
      coil.state = !coil.state;
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

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
