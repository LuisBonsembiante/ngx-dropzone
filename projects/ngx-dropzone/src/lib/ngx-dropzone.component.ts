import {
  Component,
  Input, Output, ElementRef, ViewChild,
  EventEmitter, TemplateRef,
  HostListener,
  HostBinding,
  ContentChild,
  OnInit
} from '@angular/core';
import { NgxDropzoneService, FileSelectResult, ParsedFile, RejectedFile } from './ngx-dropzone.service';
import { reject } from 'q';

@Component({
  selector: 'ngx-dropzone',
  templateUrl: './ngx-dropzone.component.html',
  styleUrls: ['./ngx-dropzone.component.scss'],
  providers: [NgxDropzoneService] // Create a new service instance for each component.
})
export class NgxDropzoneComponent implements OnInit {
  constructor(
    public service: NgxDropzoneService
  ) { }

  @ContentChild('droparea') dropareaTemplate: TemplateRef<ElementRef>;
  @ContentChild('preview') previewTemplate: TemplateRef<ElementRef>;

  @Input() multiple = true;
  @Input() accept = '*';
  @Input() maxFileSize: number;
  @Input() showPreviews = false;
  @Input() preserveFiles = true;

  files: ParsedFile[] = [];
  @Input('files') filesInput: File[] = [];

  @Output() filesAdded: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() filesRemoved: EventEmitter<File[]> = new EventEmitter<File[]>();
  @Output() filesRejected: EventEmitter<RejectedFile[]> = new EventEmitter<RejectedFile[]>();
  @Output('filesChange') filesChanged: EventEmitter<File[]> = new EventEmitter<File[]>();

  @HostBinding('class.disabled') @Input() disabled = false;
  @HostBinding('class.hovered') hovering = false;

  @ViewChild('fileInput') private fileInput: ElementRef;

  showFileSelector() {
    if (!this.disabled)
      this.fileInput.nativeElement.click();
  }

  ngOnInit(): void {
    this.handleFilesSelection(this.filesInput);
  }

  onFilesSelected(event) {
    const files: FileList = event.target.files;

    this.handleFileListSelection(files).then(() => {
      // Reset the file input value to trigger the event on new selection.
      (this.fileInput.nativeElement as HTMLInputElement).value = '';
    });
  }

  /**
   * UPDATE 10.03.2019:
   * Refactored to use HostListener and HostBindings to allow
   * for easier style overwriting from outside the component.
   */
  @HostListener('dragover', ['$event'])
  onDragOver(event) {
    if (this.disabled) return;

    this.preventDefault(event);
    this.hovering = true;
  }

  @HostListener('dragleave', ['$event'])
  onDragLeave(event) {
    if (!event.currentTarget.contains(event.relatedTarget))
      this.hovering = false;
  }

  @HostListener('drop', ['$event'])
  onDrop(event) {
    this.preventDefault(event);
    this.hovering = false;
    this.handleFileListSelection(event.dataTransfer.files);
  }

  removeFile(file: ParsedFile) {
    var precount = this.files.length;
    this.files = this.files.filter(x => x != file);
    if (precount == this.files.length) return;
    this.filesChanged.emit(this.files);
    this.filesRemoved.emit([file]);
  }

  private handleFilesSelection(files: File[]): Promise<void> {
    return new Promise<void>(resolve => {
      if (this.disabled) return reject("Dropzone is disabled");

      if (!this.multiple && files.length > 1)
        return reject("Cannot accept multiple files");

      this.service.parseFiles(files, this.accept, this.maxFileSize,
        this.preserveFiles, this.showPreviews)
        .then((result: FileSelectResult) => {
          if (result.addedFiles.length) {
            if (!this.multiple || !this.preserveFiles) this.files = result.addedFiles;
            else this.files = this.files.concat(result.addedFiles);
            this.filesChanged.emit(this.files);
            this.filesAdded.emit(result.addedFiles);
          }

          if (result.rejectedFiles.length)
            this.filesRejected.emit(result.rejectedFiles);

          resolve();
        });
    });
  }

  private handleFileListSelection(files: FileList): Promise<void> {
    return this.handleFilesSelection(Array.from(files));
  }

  private preventDefault(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
  }
}
