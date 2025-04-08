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
  { label: string; field: keyof Site; color: string }
> = {
  proposed: {
    label: "Proposed",
    field: "dateProposed",
    color: "text-amber-500",
  },
  listed: { label: "Listed", field: "dateListed", color: "text-primary" },
  cleaning: {
    label: "Cleaning",
    field: "dateCompleted",
    color: "text-fuchsia-500",
  },
  cleaned: { label: "Cleaned", field: "dateNOID", color: "text-violet-500" },
  completed: {
    label: "Completed",
    field: "dateDeleted",
    color: "text-indigo-500",
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
