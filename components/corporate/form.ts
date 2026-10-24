/** Shared form styles: paper fields with a hairline that turn white with a dark edge on focus, a dark pill to send. */
export const FIELD =
  'block w-full rounded-[14px] border border-[#12110B]/10 bg-paper px-4 py-3 text-[16px] font-medium text-char placeholder:text-stone transition-colors focus:border-char focus:bg-white focus:outline-none disabled:opacity-60';
export const LABEL = 'mb-2 block text-[14px] font-medium text-stone';
export const SUBMIT =
  'inline-flex h-12 items-center justify-center gap-2 rounded-full bg-char px-8 text-[16px] font-medium text-white transition-colors hover:bg-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-char disabled:cursor-not-allowed disabled:opacity-30';
/** The confirmation after sending: an ember check and one line. */
export const SENT_ICON = 'flex h-11 w-11 items-center justify-center rounded-full bg-ember text-white';
export const SENT_TEXT = 'font-display text-[24px] font-bold tracking-[-0.03em] text-char';
