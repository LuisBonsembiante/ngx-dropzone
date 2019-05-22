import { Injectable } from '@angular/core';

export interface ParsedFile extends File {
  preview: string | ArrayBuffer;
}

export interface RejectedFile extends File {
  error: any
}

export interface FileSelectResult {
  addedFiles: ParsedFile[],
  rejectedFiles: RejectedFile[]
}

@Injectable()
export class NgxDropzoneService {
  // Parses a single file for the dropzone
  parseFile(file: File, accept: string, maxFileSize: number, preserveFiles: boolean,
    showPreviews: boolean): Promise<ParsedFile> {
    return new Promise<ParsedFile>(async (resolve, reject) => {
      if (accept !== '*')
        if (!accept.endsWith('/*') ? !accept.includes(file.type) :
          accept.split('/')[0] !== file.type.split('/')[0])
          return reject("File has unaccepted file type");

      if (maxFileSize && file.size > maxFileSize)
        return reject("File size exceeds maximum file limit");

      let result: ParsedFile = {
        lastModified: file.lastModified,
        name: file.name,
        preview: null,
        size: file.size,
        type: file.type,
        slice: file.slice
      };

      if (showPreviews && file.type.startsWith('image'))
        this.readFile(file).then(preview => {
          result.preview = preview;
          resolve(result);
        }).catch(error => reject(error));
      else resolve(result);
    });
  }

  // Parses a set of files for the dropzone
  parseFiles(files: File[], accept: string, maxFileSize: number,
    preserveFiles: boolean, showPreviews: boolean): Promise<FileSelectResult> {
    return new Promise<FileSelectResult>((resolve, reject) => {
      let results: FileSelectResult = {
        addedFiles: [],
        rejectedFiles: []
      };

      let promises: Promise<void>[] = files.map(file => {
        return this.parseFile(file, accept, maxFileSize, preserveFiles, showPreviews)
          .then(parsed => {
            results.addedFiles.push(parsed);
          }).catch(error => {
            results.rejectedFiles.push({
              error: error,
              lastModified: file.lastModified,
              name: file.name,
              size: file.size,
              slice: file.slice,
              type: file.type
            });
          })
      });

      Promise.all(promises).then(() => {
        resolve(results);
      });
    });
  }

  // Read a file to generate a preview
  private readFile(file: File): Promise<string | ArrayBuffer> {
    return new Promise<string | ArrayBuffer>((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = e => {
        return resolve((e.target as FileReader).result);
      };

      reader.onerror = e => {
        return reject(`FileReader failed on file ${file.name}. No preview image created.`);
      }

      reader.readAsDataURL(file);
    })
  }
}
