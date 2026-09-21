import React from "react";

/* Minimal stroke SVG icons — 20×20 viewBox, strokeWidth 1.5 */

const props = { width: 20, height: 20, viewBox: "0 0 20 20", fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export const IconSearch      = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="9" cy="9" r="5.5"/><path d="M13.5 13.5 17 17"/></svg>;
export const IconCart        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M2 2h2l2.4 9.6A1 1 0 0 0 7.36 12.5h7.28a1 1 0 0 0 .96-.73L17 6H5"/><circle cx="7.5" cy="16.5" r="1.5"/><circle cx="14.5" cy="16.5" r="1.5"/></svg>;
export const IconBell        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M10 2a6 6 0 0 1 6 6v3l1.5 2.5H2.5L4 11V8a6 6 0 0 1 6-6z"/><path d="M8 17a2 2 0 0 0 4 0"/></svg>;
export const IconUser        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="10" cy="7" r="3.5"/><path d="M3 18a7 7 0 0 1 14 0"/></svg>;
export const IconMenu        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M3 5h14M3 10h14M3 15h14"/></svg>;
export const IconChevronDown = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M5 8l5 5 5-5"/></svg>;
export const IconChevronRight= (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M8 5l5 5-5 5"/></svg>;
export const IconArrowRight  = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M4 10h12M11 5l5 5-5 5"/></svg>;
export const IconDashboard   = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="11" y="3" width="6" height="6" rx="1.5"/><rect x="3" y="11" width="6" height="6" rx="1.5"/><rect x="11" y="11" width="6" height="6" rx="1.5"/></svg>;
export const IconStore       = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M3 9.5V17a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5"/><path d="M2 4h16l-1.5 5.5a1 1 0 0 1-.96.73H4.46a1 1 0 0 1-.96-.73z"/><path d="M10 4V2"/></svg>;
export const IconPackage     = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M10 2 2 6v8l8 4 8-4V6z"/><path d="M2 6l8 4 8-4M10 10v8M6 4l8 4"/></svg>;
export const IconCheck       = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M4 10l4.5 4.5L16 6"/></svg>;
export const IconX           = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M5 5l10 10M15 5 5 15"/></svg>;
export const IconPlus        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M10 4v12M4 10h12"/></svg>;
export const IconEdit        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M13 3l4 4-9 9H4v-4z"/><path d="M11 5l4 4"/></svg>;
export const IconTrash       = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M4 6h12M8 6V4h4v2M7 6v10a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V6"/></svg>;
export const IconEye         = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><ellipse cx="10" cy="10" rx="8" ry="5"/><circle cx="10" cy="10" r="2"/></svg>;
export const IconTrendUp     = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M2 15l5-5 3 3 5-6"/><path d="M13 7h4v4"/></svg>;
export const IconTrendDown   = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M2 5l5 5 3-3 5 6"/><path d="M13 13h4v-4"/></svg>;
export const IconCreditCard  = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><rect x="2" y="5" width="16" height="12" rx="2"/><path d="M2 9h16M6 13h2"/></svg>;
export const IconBarChart    = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M4 16V9M8 16V5M12 16v-6M16 16v-3"/></svg>;
export const IconSettings    = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="10" cy="10" r="2.5"/><path d="M10 2v2M10 16v2M2 10h2M16 10h2M4.22 4.22l1.41 1.41M14.37 14.37l1.41 1.41M4.22 15.78l1.41-1.41M14.37 5.63l1.41-1.41"/></svg>;
export const IconLogout      = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M13 10H3M10 6l4 4-4 4"/><path d="M8 4H4a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h4"/></svg>;
export const IconFolder      = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M3 6a2 2 0 0 1 2-2h3l2 2h5a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>;
export const IconAdmin       = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="10" cy="6" r="3"/><path d="M5 18a5 5 0 0 1 10 0"/><path d="M14 13l1.5 1.5L18 12"/></svg>;
export const IconShield      = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M10 2 3 5v5c0 4 3 7 7 8 4-1 7-4 7-8V5z"/><path d="M7 10l2 2 4-4"/></svg>;
export const IconStar        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M10 2l2.4 5.4H18l-4.5 3.3 1.7 5.6L10 13.6l-5.2 2.7 1.7-5.6L2 7.4h5.6z"/></svg>;
export const IconMapPin      = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="10" cy="8" r="3"/><path d="M10 2a6 6 0 0 1 6 6c0 5-6 10-6 10S4 13 4 8a6 6 0 0 1 6-6z"/></svg>;
export const IconMoney       = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="10" cy="10" r="8"/><path d="M10 6v8M7.5 8.5A2.5 2.5 0 0 1 12.5 10 2.5 2.5 0 0 1 7.5 11.5"/></svg>;
export const IconClock       = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><circle cx="10" cy="10" r="8"/><path d="M10 6v4l2.5 2.5"/></svg>;
export const IconHome        = (p: React.SVGProps<SVGSVGElement>) => <svg {...props} {...p}><path d="M2 9.5L10 3l8 6.5V18a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1z"/><path d="M7 19v-7h6v7"/></svg>;
