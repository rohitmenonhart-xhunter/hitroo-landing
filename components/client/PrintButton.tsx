'use client';

import { Printer } from 'lucide-react';
import { RING } from './ui';

/** Print the page, or save it as a PDF from the print dialog. */
export default function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className={`inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-char ring-1 ring-char/10 hover:bg-[#FFF8F5] ${RING}`}>
      <Printer aria-hidden="true" className="h-4 w-4" />
      Print or save as PDF
    </button>
  );
}
