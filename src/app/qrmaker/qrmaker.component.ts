import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserQRCodeSvgWriter } from '@zxing/browser';
import { EncodeHintType } from '@zxing/library';

@Component({
  selector: 'app-qrmaker',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './qrmaker.component.html',
  styleUrl: './qrmaker.component.scss'
})
export class QrmakerComponent {
  @ViewChild('qrcode') svgElement!: ElementRef<HTMLDivElement>;
  qrCodeText: string = "";
  errorCorrectionLevel: string = "H";
  hasQrCode: boolean = false;
  transparentBackground: boolean = false;

  generateQRCode() {
    // Efface l'ancien QR code
    console.log("generateQRCode");

    this.svgElement.nativeElement.innerHTML = ''; // Reset du contenu SVG
    this.hasQrCode = false;

    if (this.qrCodeText.trim() !== '') {
      console.log("generateQRCode: ", this.qrCodeText)
      const codeWriter = new BrowserQRCodeSvgWriter();

      const toto: Map<EncodeHintType, any> = new Map([
        [EncodeHintType.ERROR_CORRECTION, this.errorCorrectionLevel],

      ]);
       
      
      // Crée un nouveau QR code et l'ajoute au div
      let sVGSVGElement = codeWriter.write(this.qrCodeText, 300, 300, toto);
      this.svgElement.nativeElement.appendChild(sVGSVGElement);
      this.hasQrCode = true;
    }
  }

  downloadAsPNG() {
    const svg = this.svgElement.nativeElement.querySelector('svg');
    if (!svg) return;

    // Récupérer le contenu XML du SVG
    const serializer = new XMLSerializer();
    let svgString = serializer.serializeToString(svg);

    // Créer un Blob à partir du SVG
    const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const URL = window.URL || window.webkitURL || window;
    const blobURL = URL.createObjectURL(svgBlob);

    // Créer une image pour pouvoir dessiner sur un canvas
    const image = new Image();
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = svg.clientWidth || 300;
      canvas.height = svg.clientHeight || 300;
      const context = canvas.getContext('2d');

      if (context) {
        // Appliquer un fond blanc si l'option transparent est désactivée
        if (!this.transparentBackground) {
          context.fillStyle = '#FFFFFF';
          context.fillRect(0, 0, canvas.width, canvas.height);
        }

        // Dessiner le SVG sur le Canvas
        context.drawImage(image, 0, 0);

        // Convertir le canvas en PNG et forcer le téléchargement
        const pngURL = canvas.toDataURL('image/png');
        const downloadLink = document.createElement('a');
        downloadLink.href = pngURL;
        
        // Nom du fichier téléchargé basé sur le texte du QR code ou "qrcode" par défaut
        const sanitizedText = this.qrCodeText.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 30);
        downloadLink.download = `qrcode_${sanitizedText || 'quckoo'}.png`;
        
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      }
    };
    image.src = blobURL;
  }
}
