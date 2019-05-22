import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  files: File[] = [];

  onFilesAdded(event: File[]) {
    console.log("Filed added event", event);
  }

  onFilesChanged(event: File[]) {
    console.log("Files changed event", event);
    this.printLocalFiles();
  }

  onFilesRemoved(event: File[]) {
    console.log("Files removed event", event);
  }

  onFilesRejected(event: File[]) {
    console.log("Files rejected event", event);
  }

  printLocalFiles() {
    console.log("Current files", this.files);
  }
}
