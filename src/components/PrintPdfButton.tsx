"use client";

export function PrintPdfButton({
  className,
  label = "Download PDF"
}: {
  className?: string;
  label?: string;
}) {
  return (
    <button
      type="button"
      className={className ?? "btn btnPrimary"}
      onClick={() => window.print()}
      title="Opens the print dialog so you can Save as PDF"
    >
      {label}
    </button>
  );
}


