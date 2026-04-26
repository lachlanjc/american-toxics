import type { SupabaseSite } from "@/lib/data/site";
import SvgMail from "@/lib/icons/Mail";
import SvgPhoneCall from "@/lib/icons/PhoneCall";
import { WellRoot, WellTitle } from "@/lib/ui/well";

export function Contact({ site }: { site: SupabaseSite }) {
  return (
    <WellRoot className="">
      <p className="mb-1 font-medium font-sans text-neutral-600 text-sm uppercase">
        EPA site contact
      </p>
      <WellTitle>{site.contactName}</WellTitle>
      <a
        className="-ml-px mt-2 flex items-center gap-1 text-neutral-600 text-sm"
        href={`mailto:${site.contactEmail}`}
      >
        <SvgMail aria-hidden height={20} width={20} />
        {site.contactEmail}
      </a>
      <a
        className="-ml-px mt-2 flex items-center gap-1 text-neutral-600 text-sm"
        href={`tel:${site.contactPhone}`}
      >
        <SvgPhoneCall aria-hidden height={20} width={20} />
        {site.contactPhone}
      </a>
    </WellRoot>
  );
}
