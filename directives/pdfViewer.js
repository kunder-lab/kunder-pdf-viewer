/* global ionic, angular, PDFJS */
'use strict';
angular.module('kunder.pdfViewer',[])
.directive('pdfViewer',
[
'$ionicLoading',
'$ionicScrollDelegate',
function($ionicLoading, $ionicScrollDelegate) {
  return {
    restrict: 'E',
    scope: {
      scaleInfo: '=scale',
      onScrollBottom: '&scrollBottom',
      noScrollBottom: '&noScrollBottom',
      pdfData: '=pdfData'
    },
    templateUrl: 'lib/kunder-pdf-viewer/templates/pdfViewer.html',
    link: function(scope) {
      PDFJS.workerSrc = 'lib/kunder-pdf-viewer/dependencies/pdf.worker.min.js';
      var globalPdf = null;
      var pdfContainer = null;
      var pdfViewerScroll = null;
      var scrollHandle = null;
      var currentPage = 1;
      var zoomInicial = null;
      var isBottom = false;
      var widthMinimo = null;
      scope.onScrollBottom = !scope.onScrollBottom ? function() {} : scope.onScrollBottom;
      scope.noScrollBottom = !scope.noScrollBottom ? function() {} : scope.noScrollBottom;


      var touchEndEvent = function() {
        var zoomActual = scrollHandle.getScrollPosition().zoom;
        if (zoomActual < zoomInicial) {
          scrollHandle.zoomTo(zoomInicial, true);
        }
      };

      scope.onScrollEvent = function() {

        var scrollTopActual = scrollHandle.getScrollPosition().top;
        var widthpdfViewerScroll = pdfViewerScroll.clientHeight;
        var widthContainerPDF = pdfContainer.clientHeight;
        var zoomActual = scrollHandle.getScrollPosition().zoom;
        var coeficiente = widthContainerPDF * zoomActual - widthpdfViewerScroll;

        if (coeficiente >= (scrollTopActual - 1) && coeficiente <= (scrollTopActual + 1) || scrollTopActual > coeficiente) {
          if (isBottom) {
            return;
          }
          //caso contrario, ejecuta onScrollBottom
          isBottom = true;
          scope.onScrollBottom();
        } else {
          if (!isBottom) {
            return;
          }
          //caso contrario, ejecuta noScrollBottom
          isBottom = false;
          scope.noScrollBottom();
        }
      };

      var renderPage = function(page) {
        var newCanvas = document.createElement('canvas');
        var viewport = page.getViewport(scope.scaleInfo);
        var context = newCanvas.getContext('2d');
        newCanvas.height = viewport.height;
        newCanvas.width = viewport.width;
        widthMinimo = newCanvas.width;
        var renderContext = {
          canvasContext: context,
          viewport: viewport
        };

        page.render(renderContext).then(function() {
          //con cada nuevo canvas se transforma a imagen
          var dataUrl = newCanvas.toDataURL();
          var imageTag = document.createElement('img');
          imageTag.src = dataUrl;
          angular.element(newCanvas).empty();
          newCanvas = null;
          pdfContainer.appendChild(imageTag);

          if (currentPage < globalPdf.numPages) {
            currentPage++;
            globalPdf.getPage(currentPage).then(renderPage);
          } else {

            zoomInicial = pdfViewerScroll.clientWidth / widthMinimo;
            scrollHandle.zoomTo(zoomInicial);
            $ionicLoading.hide();
          }
        });
      };

      function decodeBase64(input) {
        input = input.replace(/\s/g, '');
        return atob(input);
      }

      ionic.Platform.ready(function() {
        pdfContainer = document.getElementById('visor-pdf');
        pdfViewerScroll = document.getElementById('pdfViewerScroll');
        scrollHandle = $ionicScrollDelegate.$getByHandle('mainScroll');
        $ionicLoading.show();
        pdfViewerScroll.addEventListener('touchend', touchEndEvent, false);
        PDFJS.getDocument({data: decodeBase64(scope.pdfData)}).then(function (pdf) {
          if (!globalPdf) {
            globalPdf = pdf;
          }
          pdf.getPage(currentPage).then(renderPage);
        });
      });
    }
  };
}]);
