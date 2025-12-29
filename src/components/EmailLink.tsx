"use client";

import { useState } from "react";

export function EmailLink({
  email,
  className
}: {
  email: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      // ignore
    }
  }

  return (
    <span className={className}>
      <button
        type="button"
        className="link"
        onClick={copy}
        aria-label={`Copy email address ${email}`}
        title="Copy email"
      >
        {email}
      </button>
      {copied ? <span className="ml-2 text-xs text-white/55">Copied</span> : null}
    </span>
  );
}


