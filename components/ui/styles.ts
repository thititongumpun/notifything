// Shared class strings. ponytail: plain strings, promote to components if variants multiply.
const btn =
  "inline-flex min-h-[44px] items-center justify-center gap-2 rounded-[var(--radius-input)] px-[var(--space-sm)] text-[length:var(--text-sm)] font-medium leading-none transition-[background-color,transform] duration-[var(--dur-short)] ease-[var(--ease-out)] active:translate-y-px disabled:opacity-50 disabled:cursor-not-allowed";

export const btnPrimary = `${btn} bg-[var(--color-accent)] text-[var(--color-accent-ink)] hover:bg-[var(--color-ink-2)] disabled:hover:bg-[var(--color-accent)]`;

export const btnSecondary = `${btn} border border-[var(--color-rule)] bg-[var(--color-paper-2)] text-[var(--color-ink)] hover:bg-[var(--color-paper-3)] disabled:hover:bg-[var(--color-paper-2)]`;

export const backLink =
  "inline-flex min-h-[44px] items-center gap-1.5 text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-ink-2)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] hover:text-[var(--color-ink)] active:translate-y-[1px]";

export const dangerCallout =
  "rounded-[var(--radius-input)] border px-[var(--space-xs)] py-[var(--space-2xs)] text-[length:var(--text-sm)] leading-[var(--leading-body)] text-[var(--color-danger)] border-[color-mix(in_oklab,var(--color-danger)_30%,transparent)] bg-[color-mix(in_oklab,var(--color-danger)_10%,transparent)]";

export const card =
  "rounded-[var(--radius-card)] border border-[var(--color-rule)] bg-[var(--color-paper-2)]";

export const input =
  "min-h-[44px] w-full rounded-[var(--radius-input)] border border-[var(--color-rule)] bg-[var(--color-paper-3)] px-[var(--space-xs)] text-[length:var(--text-sm)] text-[var(--color-ink)] transition-colors duration-[var(--dur-short)] ease-[var(--ease-out)] placeholder:text-[var(--color-ink-2)] focus:bg-[var(--color-paper-2)] disabled:opacity-50";
