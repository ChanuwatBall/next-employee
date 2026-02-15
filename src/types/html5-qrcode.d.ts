declare module 'html5-qrcode' {
  export class Html5Qrcode {
    constructor(elementId: string);
    start(cameraIdOrConfig: any, config?: any, qrCodeSuccessCallback?: any, qrCodeErrorCallback?: any): Promise<void>;
    stop(): Promise<void>;
    clear(): Promise<void>;
  }
  export default Html5Qrcode;
}
