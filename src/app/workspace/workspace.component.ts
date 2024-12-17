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
    
    // Draw the initial ladder logic elements (example with one rung)
    this.drawLadderRung(50, 50);
  }

  // This method is called when the input property changes
  ngOnChanges() {
    // Update the workspace message based on connection state
    this.message = this.isConnected ? 'You are connected. Start programming!' : 'Please connect to the controller to begin.';
  }

  // Method to draw a simple ladder rung
  drawLadderRung(x: number, y: number): void {
    const rungLine = new fabric.Line([x, y, x + 200, y], {
      left: x,
      top: y,
      stroke: 'black',
      strokeWidth: 2
    });

    const contact = new fabric.Rect({
      left: x + 50,
      top: y - 25,
      fill: 'blue',
      width: 30,
      height: 30,
      hasBorders: true,
      hasControls: false,
      selectable: true
    });

    const coil = new fabric.Rect({
      left: x + 150,
      top: y - 25,
      fill: 'red',
      width: 30,
      height: 30,
      hasBorders: true,
      hasControls: false,
      selectable: true
    });

    // Add elements to the canvas
    this.canvas.add(rungLine);
    this.canvas.add(contact);
    this.canvas.add(coil);

    // Store the elements in rungElements array
    this.rungElements.push({ type: 'contact', object: contact, state: false });
    this.rungElements.push({ type: 'coil', object: coil, state: false });

    // Set event listeners for interactions (click to toggle state)
    contact.on('mousedown', () => this.toggleContactState(contact));
    coil.on('mousedown', () => this.toggleCoilState(coil));
  }

  // Toggle contact state
  toggleContactState(contact: any): void {
    // Toggle contact state and change color to indicate state
    const currentState = this.rungElements.find(e => e.object === contact).state;
    const newState = !currentState;
    this.rungElements.find(e => e.object === contact).state = newState;

    // Change the color based on state
    contact.set({ fill: newState ? 'green' : 'blue' });
    this.canvas.renderAll();

    // Re-evaluate rung logic
    this.evaluateRung();
  }

  // Toggle coil state (based on contact state)
  toggleCoilState(coil: any): void {
    // In this simple example, we can toggle the coil manually too
    const currentState = this.rungElements.find(e => e.object === coil).state;
    const newState = !currentState;
    this.rungElements.find(e => e.object === coil).state = newState;

    // Change the color based on state
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
