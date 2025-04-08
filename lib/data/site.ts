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

export enum SiteNPLStatus {
  Proposed = "proposed",
  Deleted = "deleted",
  Active = "active",
  // Other = "",
}

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
