import { Component, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import * as fabric from 'fabric';

@Component({
  selector: 'app-workspace',
  templateUrl: './workspace.component.html',
  styleUrls: ['./workspace.component.css']
})
export class WorkspaceComponent implements OnChanges {

  @Input() isConnected: boolean = false;  // Input to accept the connection status
  message: string = 'Please connect to the controller to begin.';  // Default message

  // Data structure to hold the rungs and their components
  rungs: any[] = []; // Array to hold rungs
  currentRungId: number = 0; // To keep track of which rung is being worked on

  // Fabric.js canvas reference
  @ViewChild('ladderCanvas', { static: true }) ladderCanvas!: ElementRef<HTMLCanvasElement>;
  canvas: any;

  constructor() {}

  ngOnInit(): void {
    this.initializeCanvas();
  }

  // Initialize the fabric.js canvas
  initializeCanvas(): void {
    this.canvas = new fabric.Canvas(this.ladderCanvas.nativeElement);
  }

  // This method is called when the input property changes
  ngOnChanges() {
    // Update the workspace message based on connection state
    this.message = this.isConnected ? 'You are connected. Start programming!' : 'Please connect to the controller to begin.';
  }

  // Create a new rung
  addRung(): void {
    const newRung = {
      id: this.currentRungId++,  // Increment rung ID
      components: []  // Initially, no components in the rung
    };

    this.rungs.push(newRung);  // Add the new rung to the array
    this.renderRungs(); // Re-render the rungs to the canvas
  }

  // Render all rungs to the canvas
  renderRungs(): void {
    this.canvas.clear();
    let yPosition = 50; // Starting Y position for rendering rungs
    this.rungs.forEach(rung => {
      this.renderRung(rung, yPosition);
      yPosition += 150; // Increment Y position for next rung
    });
  }

  // Render a single rung
  renderRung(rung: any, yPosition: number): void {
    const rungLine = new fabric.Line([50, yPosition, 500, yPosition], {
      left: 50,
      top: yPosition,
      stroke: 'black',
      strokeWidth: 2
    });

    this.canvas.add(rungLine);

    // Render components inside the rung
    let xPosition = 100; // Starting X position for components
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

        contact.on('mouse:down' as keyof fabric.ObjectEvents, () => this.toggleContactState(rung.id, rung.components.indexOf(component)));
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

        coil.on('mouse:down' as keyof fabric.ObjectEvents, () => this.toggleCoilState(rung.id, rung.components.indexOf(component)));
        this.canvas.add(coil);
      }
    });
  }

  // Add a contact (NO or NC) to a rung
  addContactToRung(rungId: number, type: string): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const contact = { type: type, state: false }; // Each contact has a type (NO or NC) and a state
      rung.components.push(contact);  // Add contact to the rung's components
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  // Add a coil to a rung
  addCoilToRung(rungId: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const coil = { state: false }; // Each coil has a state (true or false)
      rung.components.push(coil);  // Add coil to the rung's components
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  // Toggle the state of a contact (NO or NC)
  toggleContactState(rungId: number, contactIndex: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const contact = rung.components[contactIndex];
      contact.state = !contact.state;  // Toggle the contact state
      this.evaluateRung(rungId);  // Re-evaluate the rung after toggling
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  // Toggle the state of a coil
  toggleCoilState(rungId: number, coilIndex: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      const coil = rung.components[coilIndex];
      coil.state = !coil.state;  // Toggle the coil state
      this.renderRungs(); // Re-render the rungs to the canvas
    }
  }

  // Evaluate rung logic (based on contact states)
  evaluateRung(rungId: number): void {
    const rung = this.rungs.find(r => r.id === rungId);
    if (rung) {
      let rungActive = true;

      // Check all contacts in the rung and evaluate
      for (let component of rung.components) {
        if (component.type === 'contact' && !component.state) {
          rungActive = false;
          break; // If any contact is false, the rung is inactive
        }
      }

      // Update coil state based on rung evaluation
      for (let component of rung.components) {
        if (component.type === 'coil') {
          component.state = rungActive;
        }
      }
    }
  }
}
