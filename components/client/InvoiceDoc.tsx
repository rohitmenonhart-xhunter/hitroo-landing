import Wordmark from '@/components/brand/Wordmark';
import type { Invoice } from '@/lib/client/types';
import { inr, longDate } from '@/lib/client/format';
import PrintButton from './PrintButton';

/** One invoice, laid out to print or save as a PDF. */
export default function InvoiceDoc({ invoice: i }: { invoice: Invoice }) {
  return (
    <div className="mx-auto max-w-[820px]">
      <div className="mb-5 flex justify-end print:hidden">
        <PrintButton />
      </div>
      <article className="rounded-[24px] bg-white p-8 ring-1 ring-char/5 sm:p-12 print:rounded-none print:p-0 print:ring-0">
        <header className="flex flex-col justify-between gap-8 sm:flex-row">
          <div>
            <Wordmark className="text-[30px] text-char" />
            <h1 className="mt-6 font-display text-[34px] font-extrabold tracking-[-0.04em]">Invoice</h1>
            <p className="mt-1 text-[15px] font-semibold text-stone">
              {i.number} · {longDate(i.at)}
            </p>
          </div>
          <address className="text-[14px] font-medium not-italic leading-relaxed text-char/75 sm:text-right">
            <strong className="text-char">{i.from.name}</strong>
            {i.from.trade && <span className="block">{i.from.trade}</span>}
            <span className="block max-w-[280px] sm:ml-auto">{i.from.address}</span>
            {i.from.gstin && <span className="block">GSTIN {i.from.gstin}</span>}
            {i.from.pan && <span className="block">PAN {i.from.pan}</span>}
            {i.from.email && <span className="block">{i.from.email}</span>}
          </address>
        </header>
        <div className="mt-10">
          <p className="text-[12.5px] font-semibold uppercase tracking-[0.06em] text-stone">Billed to</p>
          <p className="mt-1 text-[17px] font-bold">{i.client}</p>
        </div>
        <table className="mt-8 w-full text-[15px]">
          <thead>
            <tr className="border-b border-char/10 text-left text-[12.5px] font-semibold uppercase tracking-[0.06em] text-stone">
              <th className="pb-3 font-semibold">Description</th>
              <th className="pb-3 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody className="font-medium">
            <tr className="border-b border-char/5">
              <td className="py-4">
                {i.description}
                <span className="block text-[13.5px] text-stone">{i.line}</span>
              </td>
              <td className="py-4 text-right">{inr(i.amount)}</td>
            </tr>
            {i.gst > 0 && (
              <tr className="border-b border-char/5">
                <td className="py-4">GST {i.gstPct}%</td>
                <td className="py-4 text-right">{inr(i.gst)}</td>
              </tr>
            )}
            {i.charge > 0 && (
              <tr className="border-b border-char/5">
                <td className="py-4">Online payment charges</td>
                <td className="py-4 text-right">{inr(i.charge)}</td>
              </tr>
            )}
            <tr>
              <td className="pt-5 font-display text-[18px] font-extrabold">Total paid</td>
              <td className="pt-5 text-right font-display text-[22px] font-extrabold tabular-nums">{inr(i.total)}</td>
            </tr>
          </tbody>
        </table>
        <p className="mt-10 text-[13.5px] font-medium text-stone">
          Paid {longDate(i.at)} via {i.payment.via} ({i.payment.id}). Thank you.
        </p>
      </article>
    </div>
  );
}
