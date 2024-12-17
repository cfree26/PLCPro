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

  // Fabric.js canvas reference
  @ViewChild('ladderCanvas', { static: true }) ladderCanvas!: ElementRef<HTMLCanvasElement>;
  canvas: any;

  rungElements: any[] = []; // Array to hold the ladder logic elements (contacts, coils)

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

  // Add a contact (NO or NC)
  addContact(type: string): void {
    const x = 50; // X position of the contact
    const y = 50 + this.rungElements.length * 100; // Y position based on the number of elements

    const contact = new fabric.Rect({
      left: x,
      top: y,
      fill: type === 'NO' ? 'blue' : 'red', // NO = blue, NC = red
      width: 30,
      height: 30,
      hasBorders: true,
      hasControls: false,
      selectable: true
    });

    // Store the element in the rungElements array
    this.rungElements.push({ type: 'contact', object: contact, state: false, contactType: type });

    // Add contact to the canvas
    this.canvas.add(contact);

    // Set event listener for contact interaction (click to toggle state)
    contact.on('mouse:down' as keyof fabric.ObjectEvents, () => this.toggleContactState(contact));
  }

  // Add a coil to the canvas
  addCoil(): void {
    const x = 200; // X position of the coil
    const y = 50 + this.rungElements.length * 100; // Y position based on the number of elements

    const coil = new fabric.Rect({
      left: x,
      top: y,
      fill: 'red', // Default coil color
      width: 30,
      height: 30,
      hasBorders: true,
      hasControls: false,
      selectable: true
    });

    // Store the element in the rungElements array
    this.rungElements.push({ type: 'coil', object: coil, state: false });

    // Add coil to the canvas
    this.canvas.add(coil);

    // Set event listener for coil interaction (click to toggle state)
    coil.on('mouse:down' as keyof fabric.ObjectEvents, () => this.toggleCoilState(coil));
  }

  // Toggle contact state
  toggleContactState(contact: any): void {
    const currentState = this.rungElements.find(e => e.object === contact).state;
    const newState = !currentState;
    this.rungElements.find(e => e.object === contact).state = newState;

    // Change the color based on state (blue for false, green for true)
    contact.set({ fill: newState ? 'green' : contact.contactType === 'NO' ? 'blue' : 'red' });
    this.canvas.renderAll();

    // Re-evaluate rung logic
    this.evaluateRung();
  }

  // Toggle coil state (based on contact state)
  toggleCoilState(coil: any): void {
    const currentState = this.rungElements.find(e => e.object === coil).state;
    const newState = !currentState;
    this.rungElements.find(e => e.object === coil).state = newState;

    // Change the color based on state (red for inactive, yellow for active)
    coil.set({ fill: newState ? 'yellow' : 'red' });
    this.canvas.renderAll();
  }

  // Evaluate rung logic (based on contact state)
  evaluateRung(): void {
    let rungActive = true;

    // Check all contacts in the rung and evaluate
    for (let element of this.rungElements) {
      if (element.type === 'contact' && !element.state) {
        rungActive = false;
        break; // If any contact is false, the rung is inactive
      }
    }

    // Update the state of coils based on rung evaluation
    this.rungElements.forEach(element => {
      if (element.type === 'coil') {
        element.object.set({ fill: rungActive ? 'yellow' : 'red' });
      }
    });

    this.canvas.renderAll();
  }
}
