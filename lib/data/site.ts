export interface Site {
  id: string;
  name: string;
  semsId: string;
  stateName: string;
  stateCode: string;
  city: string;
  county: string;
  npl: SiteNPLStatus;
  dateProposed: string;
  dateListed: string;
  dateCompleted: string;
  dateNOID: string;
  dateDeleted: string;
  hasPartialDeletion: boolean;
  lng: number;
  lat: number;
}

export type SiteNPLStatus = keyof typeof nplStatuses;

export const nplStatuses: Record<
  string,
  { label: string; field: keyof Site; color: string; desc: string }
> = {
  proposed: {
    label: "Proposed",
    field: "dateProposed",
    color: "text-amber-500",
    desc: "Contaminated sites flagged as potentially requiring federal cleanup.",
  },
  listed: {
    label: "Hazardous",
    field: "dateListed",
    color: "text-primary",
    desc: "Toxic sites requiring federal cleanup that is not yet underway.",
  },
  cleaning: {
    label: "Cleaning",
    field: "dateCompleted",
    color: "text-fuchsia-500",
    desc: "Cleanup equipment is constructed, but the site remains hazardous while treated.",
  },
  cleaned: {
    label: "Cleaned",
    field: "dateNOID",
    color: "text-violet-500",
    desc: "Successfully cleaned up and in the final paperwork stage.",
  },
  completed: {
    label: "Completed",
    field: "dateDeleted",
    color: "text-indigo-500",
    desc: "Cleanup is completely finished and the site can be reused.",
  },
};

export function hasPlainSiteImage(id: string): boolean {
  return [
    "CA2170090078",
    "CAD001864081",
    "CAD009103318",
    "CAD9111444",
    "CAD009138488",
    "CAD9159088",
    "CAD009205097",
    "CAD9212838",
    "CAD029295706",
    "CAD041472341",
    "CAD041472986",
    "CAD042728840",
    "CAD048634059",
    "CAD049236201",
    "CAD061620217",
    "CAD92212497",
    "CAD095989778",
    "CAD97012298",
    "CAD980884209",
    "CAD980894885",
    "CAD990832735",
    "CAT000612184",
  ].includes(id);
}
