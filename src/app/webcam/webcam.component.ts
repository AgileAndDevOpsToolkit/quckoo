import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { BrowserMultiFormatReader, BrowserQRCodeReader } from '@zxing/browser';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-webcam',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './webcam.component.html',
  styleUrl: './webcam.component.scss'
})
export class WebcamComponent implements OnInit {

  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  isCameraActive = false;
  qrCodeReader: BrowserQRCodeReader = new BrowserQRCodeReader();
  qrResultString: string = "";

  constructor() {}
  
  ngOnInit(): void {

  }

  startCamera() {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.info("Webcam supportée dans ce navigateur.mm");

      const constraints = {
        video: {
          facingMode: { ideal: 'environment' }, // 'environment' utilise la caméra arrière
          width: { min: 640, ideal: 1280, max: 1920 },  // Plage pour la largeur
          height: { min: 480, ideal: 720, max: 1080 },  // Plage pour la hauteur
          // frameRate: { min: 15, ideal: 30, max: 60 },   // Taux de rafraîchissement
        },
        audio: false,
      };

      navigator.mediaDevices.getUserMedia(constraints)
        .then(stream => {
          this.videoElement.nativeElement.srcObject = stream;
          this.videoElement.nativeElement.play();
          this.isCameraActive = true;


          let isTimeout = false;
          setTimeout(() => {
            isTimeout = true;
          }, 10000); // Timeout de 5 secondes


          const codeReader = new BrowserQRCodeReader();
          // const codeReader = new BrowserMultiFormatReader();

          console.log("starting  decodeFromVideoElement")
          codeReader.decodeFromVideoElement(this.videoElement.nativeElement, (result, error, scannerControls) => {

              if(isTimeout) {
                scannerControls.stop();
                this.stopCamera();
                console.log("scan timeout");
              }
    

              if (result) {
                console.log(result)
                this.qrResultString = result.getText()
                scannerControls.stop();
                this.stopCamera();
              } else {
                console.log("no result");
              }

          });
        });

    } else {
      alert("Webcam non supportée dans ce navigateur.");
    }
  }

  stopCamera() {
    const stream = this.videoElement.nativeElement.srcObject as MediaStream;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      this.videoElement.nativeElement.srcObject = null;
      this.isCameraActive = false;
    }
  }

}
