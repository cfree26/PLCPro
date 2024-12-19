import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component'; // Correct path for AppComponent

// Bootstrapping the standalone AppComponent directly
bootstrapApplication(AppComponent, {
  providers: [
    // Add any global providers here if needed
  ],
}).catch((err) => console.error(err));
