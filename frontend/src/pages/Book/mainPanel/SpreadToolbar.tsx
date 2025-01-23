import * as Slider from '@radix-ui/react-slider';
import * as fabric from 'fabric';
import {
  ArrowDownOnSquareStackIcon,
  MagnifyingGlassIcon,
  DocumentArrowDownIcon,
  DocumentArrowUpIcon,
  ArrowDownTrayIcon,
  PrinterIcon,
} from '@heroicons/react/24/outline';
import { ToolbarButton } from './ToolbarButton';
import React, { useContext } from 'react';
import { CanvasContext } from '../BookPage';
import jsPDF from 'jspdf';

const iconProps = {
  className: 'w-12 h-12',
  strokeWidth: 0.5,
};

const exportToPDF = ({
  canvas,
  dimensions,
}: {
  canvas: fabric.Canvas;
  dimensions: { width: number; height: number };
}) => {
  // const canvas = canvas.current;
  if (canvas) {
    const pdf = new jsPDF('p', 'px', [dimensions.width, dimensions.height]);

    const imgData = canvas.toDataURL({
      format: 'png',
      quality: 1,
      multiplier: 1,
    });

    // Les dimensions du PDF doivent correspondre à celles du canvas
    pdf.addImage(imgData, 'PNG', 0, 0, dimensions.width, dimensions.height);
    pdf.save('canvas.pdf');
  }
};

export const printPDF = ({
  canvas,
}: // dimensions,
{
  canvas: fabric.Canvas;
  // dimensions: { width: number; height: number };
}) => {
  const dataUrl = canvas.toDataURL({
    format: 'png',
    quality: 1,
    multiplier: 2,
  });

  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(
      `<img src='${dataUrl}' onload='window.print();window.close()' />`
    );
  }
};

export const SpreadToolbar: React.FC<{
  className?: string;
  children?: React.ReactNode;
}> = () => {
  const { canvas } = useContext(CanvasContext);

  return (
    <div className="flex justify-center  items-center gap-4 p-4">
      <MagnifyingGlassIcon className="w-6 h-6" />
      <Slider.Root
        className="relative flex h-5 w-[200px] touch-none select-none items-center"
        defaultValue={[50]}
        max={100}
        step={1}
      >
        <Slider.Track className="relative h-[3px] grow rounded-full bg-primary-200">
          <Slider.Range className="absolute h-full rounded-full bg-white" />
        </Slider.Track>
        <Slider.Thumb
          className="block size-5 rounded-[10px] bg-white shadow-[0_2px_10px] shadow-white hover:bg-violet300 focus:shadow-[0_0_0_5px] focus:shadow-black focus:outline-none transition-all"
          aria-label="Volume"
        />
      </Slider.Root>
      <div className="flex gap-2">
        <ToolbarButton tooltipContent="Save">
          <ArrowDownOnSquareStackIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton tooltipContent="Export">
          <DocumentArrowDownIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton tooltipContent="Import">
          <DocumentArrowUpIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton
          tooltipContent="Download"
          onClick={() => {
            if (canvas) {
              exportToPDF({
                canvas: canvas,
                dimensions: { width: 640, height: 480 },
              });
            }
          }}
        >
          <ArrowDownTrayIcon {...iconProps} />
        </ToolbarButton>
        <ToolbarButton
          tooltipContent="Print"
          onClick={() => {
            if (canvas) {
              printPDF({
                canvas: canvas,
              });
            }
          }}
        >
          <PrinterIcon {...iconProps} />
        </ToolbarButton>
      </div>
    </div>
  );
};
