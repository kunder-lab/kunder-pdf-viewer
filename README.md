# kunder-pdf-viewer

## About
kunder-pdf viewer is an angular directive that uses [PDF.js](https://github.com/mozilla/pdf.js) to show PDF files inside your ionic app. It transforms
the PDF data (a String in base64) to images and then adds them dinamically inside a custom div. It has zoom in, zoom out and scroll
functionalities implemented by default.

## Installation
1. Install the bower component,a new folder should be created in your /lib.  

`bower install kunder-pdf-viewer` 
 
2. Import the following files to your index.html.

```
<link rel="stylesheet" type="text/css" href="lib/kunder-pdf-viewer/pdfViewer.min.css">    
<script src="lib/kunder-pdf-viewer/directives/pdfViewer.js"></script>  
<script src="lib/kunder-pdf-viewer/dependencies/pdf.min.js"></script>
<script src="lib/kunder-pdf-viewer/dependencies/pdf.worker.min.js"></script>    
```  
3. Include the pdfViewer module as a dependency when defining your angular app.  

``` js
angular.module('myApp', ['kunder.pdfViewer,...'])
``` 

## Use
1. Declare the directive in the selected HTML file, here you should define your ideal scale (WARNING: for best performance
keep it around 1.0) and the PDF data that should be transformed, be sure to have it as a String and loaded before the directive gets initialized.  

``` html
<pdf-viewer scale="1.0" pdf-data="model.pdfData"></pdf-viewer>  
```  

## Optionals
The directive also accepts "onScrollBottom" and "noScrollBottom" function parameters. "onScrollBottom" is called when the bottom
end of the PDF is reached. "noScrollBottom" gets called after "onScrollBottom" is invoked and the user performs another scroll on the document.  
``` html
<pdf-viewer onScrollBottom="iHitBottom()
            noScrollBottom="iGetCalledAfterTheOtherOne()" 
            scale="1.0" pdf-data="model.pdfData"></pdf-viewer>`           
```

[Read the license!](./LICENSE)