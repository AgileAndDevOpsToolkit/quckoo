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

  generateQRCode() {
    // Efface l'ancien QR code
    console.log("generateQRCode");

    this.svgElement.nativeElement.innerHTML = ''; // Reset du contenu SVG

    if (this.qrCodeText.trim() !== '') {
      console.log("generateQRCode: ", this.qrCodeText)
      const codeWriter = new BrowserQRCodeSvgWriter();

      const toto: Map<EncodeHintType, any> = new Map([
        [EncodeHintType.ERROR_CORRECTION, this.errorCorrectionLevel],

      ]);
       
      
      // Crée un nouveau QR code et l'ajoute au div
      let sVGSVGElement = codeWriter.write(this.qrCodeText, 300, 300, toto);
      this.svgElement.nativeElement.appendChild(sVGSVGElement);
    }
  }
}
