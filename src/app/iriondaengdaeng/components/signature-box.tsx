/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";
import SignaturePad, {
  FromDataOptions,
  PointGroup,
  ToSVGOptions,
} from "signature_pad";

export interface SignatureBoxRef {
  clear: () => void;
  toData(): PointGroup[];
  fromData(pointGroups: PointGroup[], { clear }?: FromDataOptions): void;
  isEmpty: () => boolean;
  toDataURL(type?: string, encoderOptions?: number): string;
  fromDataURL(
    dataUrl: string,
    options?: {
      ratio?: number;
      width?: number;
      height?: number;
      xOffset?: number;
      yOffset?: number;
    },
  ): Promise<void>;
  toSVG({ includeBackgroundColor }?: ToSVGOptions): string;
}

const SignatureBox = forwardRef<SignatureBoxRef>((_, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const signaturePadRef = useRef<SignaturePad | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      clear: () => signaturePadRef.current?.clear(),
      toData: () => signaturePadRef.current?.toData(),
      fromData: (data: any) => signaturePadRef.current?.fromData(data),
      isEmpty: () => signaturePadRef.current?.isEmpty() ?? true,
      toDataURL: (type?: string) => signaturePadRef.current?.toDataURL(type),
      fromDataURL: (dataURL: string) =>
        signaturePadRef.current?.fromDataURL(dataURL),
      toSVG: (options?: ToSVGOptions) =>
        signaturePadRef.current?.toSVG(options) ?? "",
    }),
    [],
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext("2d")?.scale(ratio, ratio);

      signaturePadRef.current = new SignaturePad(canvas, {
        backgroundColor: "rgb(238, 242, 249)",
      });
    }

    return () => {
      signaturePadRef.current?.off();
      signaturePadRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: "100%", height: "200px", border: "1px solid black" }}
    />
  );
});

SignatureBox.displayName = "SignatureBox";

export default SignatureBox;
