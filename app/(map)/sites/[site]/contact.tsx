import { SupabaseSite } from "@/lib/data/site";
import SvgMail from "@/lib/icons/Mail";
import SvgPhoneCall from "@/lib/icons/PhoneCall";
import { WellRoot, WellTitle } from "@/lib/ui/well";

export function Contact({ site }: { site: SupabaseSite }) {
  return (
    <WellRoot className="">
      <p className="uppercase font-sans font-medium mb-1 text-xs text-neutral-600">
        EPA site administrator
      </p>
      <WellTitle>{site.contactName}</WellTitle>
      <a
        href={`mailto:${site.contactEmail}`}
        className="flex items-center gap-1 text-neutral-600 text-xs mt-2 -ml-px"
      >
        <SvgMail width={20} height={20} aria-hidden />
        {site.contactEmail}
      </a>
      <a
        href={`tel:${site.contactPhone}`}
        className="flex items-center gap-1 text-neutral-600 text-xs mt-2 -ml-px"
      >
        <SvgPhoneCall width={20} height={20} aria-hidden />
        {site.contactPhone}
      </a>
    </WellRoot>
  );
}
