# ngx- dropzone

A lightweight and highly customizable Angular dropzone component to initialize file uploads.

[![NPM](https://img.shields.io/npm/v/ngx-dropzone.svg)](https://www.npmjs.com/package/ngx-dropzone) [![Build Status](https://travis-ci.com/peterfreeman/ngx-dropzone.svg?branch=master)](https://travis-ci.com/peterfreeman/ngx-dropzone)

<img src="_images/default.png">

<img src="_images/default_hovered.png">

## Install

```
$ npm install --save ngx-dropzone
```

## Usage

Import the module

```js
// in app.module.ts
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgxDropzoneModule } from 'ngx-dropzone';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    NgxDropzoneModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```html
<!-- in app.component.html -->
<ngx-dropzone></ngx-dropzone>
```

## Options

### Attributes

| Property |   Type  | Description | Default  |
|--------------|-------|------------------------------------------------|---------|
| `[label]`    | `string`  | Change the label text.   | `'Drop your files here (or click)'` |
| `[multiple]` | `boolean` | Allow drop or selection of more than one file. | `true` |
| `[accept]`    | `string`  | Specify the accepted file types.   | `'*'` |
| `[maxFileSize]`    | `number`  | Set the maximum file size in bytes.   | `undefined` |
| `[showPreviews]`    | `boolean`  | Show file previews in the dropzone.   | `false` |
| `[preserveFiles]`    | `boolean`  | Preserve all selected files since the last reset.   | `true` |
| `[disabled]`    | `boolean`  | Disable any drop or click interaction.   | `false` |

### Methods

| Method |  Description | Return value  |
|--------------|-----------------------------------------------|---------|
| `showFileSelector()`    | Opens up the file selector dialog.   | `void` |
| `reset()`    | Resets all selected files.   | `void` |

### Examples

```html
<ngx-dropzone [multiple]="false"></ngx-dropzone>
```

```html
<ngx-dropzone [label]="'This is a custom label text'"></ngx-dropzone>
```

```html
<ngx-dropzone [accept]="'image/png,image/jpeg'"></ngx-dropzone>
```

```html
<ngx-dropzone [maxFileSize]="2000"></ngx-dropzone>
```

```html
<ngx-dropzone [showPreviews]="true" [preserveFiles]="false"></ngx-dropzone>
```

```html
<ngx-dropzone [showPreviews]="true" #dropzone></ngx-dropzone>
<button (click)="dropzone.reset()">Reset</button>
<button (click)="dropzone.showFileSelector()">Show file selector</button>
```

```html
<ngx-dropzone [disabled]="true"></ngx-dropzone>
```

<img src="_images/default_disabled.png">

### Input/Output Events

There are three primary event listeners available. Each returns a `File[]`.
* Newly added files get output by the `(filesAdded)` event.
* Newly removed files get output by the `(filesRemoved)` event.
* Newly rejected files get output by the `(filesRejected)` event.

A fourth primary event listener allows you to handle any file change event.\
It will include a list of all files the dropzone has after any of the above events occur.\
Even though the list will reflect the above events, this output event fires before any of the others.\
This gets outputted by the `(filesChange)` event.

Example of available output events:
```html
<ngx-dropzone (filesAdded)="onFilesAdded($event)" 
              (filesRejected)="onFilesRejected($event)"
              (filesChange)="onFilesChanged($event)"
              (filesRemoved)="onFilesRemoved($event)">
</ngx-dropzone>
```

You may also pass in a `File[]` to the dropzone component using the input `files`.\
In combination with the above `(filesChange)` event, you can accomplish two way binding as seen below:

```html
<ngx-dropzone [(files)]="files">
</ngx-dropzone>
```

```js
// in app.component.ts
onFilesAdded(files: File[]) {
  console.log(files);

  files.forEach(file => {
    const reader = new FileReader();

    reader.onload = (e: ProgressEvent) => {
      const content = (e.target as FileReader).result;

      // this content string could be used directly as an image source
      // or be uploaded to a webserver via HTTP request.
      console.log(content);
    };

    // use this for basic text files like .txt or .csv
    reader.readAsText(file);

    // use this for images
    // reader.readAsDataURL(file);
  });
}

onFilesRejected(files: File[]) {
  console.log(files);
}
```

## Custom style component

You can provide a custom style for the dropzone container which still keeps the behaviour.\
When the user hovers over the component, the css class `hovered` is added. The `disabled` class will be added automatically.\
See the following example on how to do it and provide custom styles.

```html
<!-- in app.component.html -->
<ngx-dropzone class="custom-dropzone"
              (filesAdded)="onFilesAdded($event)">
</ngx-dropzone>
```

```scss
/* in app.component.scss */
ngx-dropzone {
  margin: 20px;

  &.custom-dropzone {
    height: 250px;
    background: #333;
    color: #fff;
    border: 5px dashed rgb(235, 79, 79);
    border-radius: 5px;
    font-size: 20px;

    &.hovered {
      border-style: solid;
    }
  }
}
```

<img src="_images/custom.png">

<img src="_images/custom_hovered.png">


You can still use the same properties like for the default styling.

```html
<!-- in app.component.html -->
<ngx-dropzone class="custom-dropzone" [showPreviews]="true"></ngx-dropzone>
```

<img src="_images/custom_preview.png">

```html
<ngx-dropzone class="custom-dropzone" [disabled]="true"></ngx-dropzone>
```

<img src="_images/custom_disabled.png">

Additionally, you may overhaul the interior of the droparea and provide templates for the previews if desired.\
See example below:

```html
<ngx-dropzone class="custom-dropzone" (filesAdded)="onFilesAdded($event)" [showPreviews]="true">
  <ng-template #droparea>
    <div class="ngx-dropzone-droparea" style="width: 100%; height: 100%;">Drop it!</div>
  </ng-template>
  <ng-template #preview>
    This is a test
  </ng-template>
</ngx-dropzone>
```

This allows you, for example, to include images, or anything really, within the droparea.\
You could also, potentially, replace the preview template to maybe show an 'x' button instead of our default 'remove' button.

## License

MIT © Peter Freeman
