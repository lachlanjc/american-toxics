import { SupabaseSite } from "@/lib/data/site";
import { WellRoot, WellTitle } from "@/lib/ui/well";

export function Contact({ site }: { site: SupabaseSite }) {
  return (
    <WellRoot className="py-4">
      <p className="uppercase font-bold mb-2 text-xs text-neutral-600">
        EPA site administrator
      </p>
      <WellTitle>{site.contactName}</WellTitle>
      <p className="text-neutral-600 text-xs mt-2">
        <a href={`mailto:${site.contactEmail}`}>{site.contactEmail}</a>
      </p>
      <p className="text-neutral-600 text-xs mt-2">
        <a href={`tel:${site.contactPhone}`}>{site.contactPhone}</a>
      </p>
    </WellRoot>
  );
}
