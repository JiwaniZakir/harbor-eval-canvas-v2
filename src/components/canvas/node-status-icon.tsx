"use client";

import type { DomainState } from "@/lib/types";

interface NodeStatusIconProps {
  status: DomainState["status"];
  className?: string;
}

/**
 * 14×14 pixel-art SVG icons for domain node status.
 * Uses currentColor for parent CSS tinting. (#38)
 */
export function NodeStatusIcon({ status, className }: NodeStatusIconProps) {
  const svg = STATUS_ICONS[status] ?? STATUS_ICONS.untested;
  return (
    <span
      className={`node-status-icon ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

const S = 14; // icon size
const c = `currentColor`;
const sw = 1.5; // stroke width

const STATUS_ICONS: Record<string, string> = {
  untested: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}" opacity="0.4"/>
  </svg>`,

  probe_queued: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M6 5l3 2-3 2z" fill="${c}"/>
  </svg>`,

  probing: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}" stroke-dasharray="8 24" stroke-linecap="round">
      <animateTransform attributeName="transform" type="rotate" values="0 7 7;360 7 7" dur="1s" repeatCount="indefinite"/>
    </circle>
  </svg>`,

  probe_complete: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M4.5 7l2 2 3-3.5" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  promoted: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" fill="${c}" opacity="0.15"/>
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M7 3.5l1 2.2 2.4.2-1.8 1.6.5 2.3L7 8.6 4.9 9.8l.5-2.3L3.6 5.9l2.4-.2z" fill="${c}" opacity="0.7"/>
  </svg>`,

  gate_passed: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1.5L12 4v4c0 2.8-2.2 4.8-5 5.5C4.2 12.8 2 10.8 2 8V4z" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M5 7l1.5 1.5L9.5 5" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  scaffold_queued: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="8" height="5" rx="1" stroke="${c}" stroke-width="${sw}"/>
    <rect x="5" y="3" width="6" height="5" rx="1" stroke="${c}" stroke-width="${sw}" opacity="0.4"/>
  </svg>`,

  scaffolding: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="6" width="8" height="5" rx="1" stroke="${c}" stroke-width="${sw}"/>
    <rect x="5" y="3" width="6" height="5" rx="1" stroke="${c}" stroke-width="${sw}">
      <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite"/>
    </rect>
  </svg>`,

  scaffold_complete: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="2" y="4" width="10" height="7" rx="1.5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M5 7.5l1.5 1.5L9.5 6" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  validation_gate: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 3h10M2 11h10" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M4 3v8M10 3v8" stroke="${c}" stroke-width="${sw}"/>
    <path d="M6 5.5h2M6 8.5h2" stroke="${c}" stroke-width="1" stroke-linecap="round" opacity="0.5"/>
  </svg>`,

  published: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2l1.5 3.5h-3z" fill="${c}"/>
    <path d="M5.5 5.5L4 10.5h6L8.5 5.5" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M5 12h4" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
  </svg>`,

  rejected: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M5 5l4 4M9 5L5 9" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
  </svg>`,

  redesign: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11 5.5A4.5 4.5 0 003 7" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M3 8.5A4.5 4.5 0 0011 7" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
    <path d="M10 3.5l1 2-2 .5" stroke="${c}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M4 10.5l-1-2 2-.5" stroke="${c}" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  iterating: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2a5 5 0 014 2M11 4a5 5 0 010 6M11 10a5 5 0 01-4 2M7 12a5 5 0 01-4-2M3 10a5 5 0 010-6M3 4a5 5 0 014-2" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-dasharray="3 3">
      <animateTransform attributeName="transform" type="rotate" values="0 7 7;360 7 7" dur="3s" repeatCount="indefinite"/>
    </path>
  </svg>`,

  gate_failed: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 1.5L12 4v4c0 2.8-2.2 4.8-5 5.5C4.2 12.8 2 10.8 2 8V4z" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M5.5 5.5l3 3M8.5 5.5l-3 3" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
  </svg>`,

  target_sweep: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <circle cx="7" cy="7" r="2.5" stroke="${c}" stroke-width="1"/>
    <circle cx="7" cy="7" r="0.8" fill="${c}"/>
  </svg>`,

  sweep_complete: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <circle cx="7" cy="7" r="2.5" stroke="${c}" stroke-width="1"/>
    <path d="M5 7l1.5 1.5L9 5.5" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`,

  ready_to_publish: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 2l1.5 3.5h-3z" fill="${c}" opacity="0.4"/>
    <path d="M5.5 5.5L4 10.5h6L8.5 5.5" stroke="${c}" stroke-width="${sw}" stroke-linejoin="round"/>
    <path d="M5 12h4" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" opacity="0.4"/>
  </svg>`,

  calibrating: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M7 4v3l2 1.5" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">
      <animateTransform attributeName="transform" type="rotate" values="0 7 7;360 7 7" dur="2s" repeatCount="indefinite"/>
    </path>
  </svg>`,

  needs_review: `<svg width="${S}" height="${S}" viewBox="0 0 ${S} ${S}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="7" cy="7" r="5" stroke="${c}" stroke-width="${sw}"/>
    <path d="M5.5 5.5c0-1 .7-1.5 1.5-1.5s1.5.5 1.5 1.5c0 .8-.7 1-1.5 1.3" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>
    <circle cx="7" cy="10" r="0.6" fill="${c}"/>
  </svg>`,
};
