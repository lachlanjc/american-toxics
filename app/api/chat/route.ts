import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";
import fs from "fs";
import path from "path";

const context = `This is the fourth Five-Year Review of the Intersil Inc./Siemens Components Superfund Site (Site) in Cupertino, Santa Clara County, California. The purpose of this Five-Year Review is to review information from the previous five years to assess the nature of any contamination left on-site and determine whether or not the remedy remains protective of human health and the environment. General Electric (GE) has continuously operated a groundwater extraction and treatment (GWET) system at the former Intersil property since 1987. During the most recent five years, GE’s GWET system removed 51 pounds of volatile organic compounds (VOCs). GE operated a soil vapor extraction and treatment (SVET) system from 1988 to 1993 and removed 3,000 pounds of VOCs. SMI Holding Company (Siemens) has continuously operated a GWET system at the former Siemens property since 1987. During the most recent five years, Siemens’s GWET system removed 331 pounds of VOCs. Siemens operated a SVET system from 1983 to 2004 and removed 17,310 pounds of VOCs. GE and Siemens have continuously operated a GWET system in the Off-Property Study Area since 1990. During the most recent five-year review period, GE and Siemens’s Off-Property GWET system removed 89 pounds of VOCs. Groundwater concentrations continue to slowly decline. At the former Intersil property, the current maximum TCE level in the Lower A Zone is 99 micrograms per liter (µg/L) (well W12A). At the former Siemens property, the current maximum TCE level in the Upper Resaturated Interval is 1,300 µg/L. At the Off-Property Study Area, the current maximum TCE level is 61 µg/L. During the most recent five years, GE and Siemens conducted high-resolution investigations on their sites to further optimize their remediation systems. The high-resolution investigations helped to identify specific intervals with elevated VOC concentrations. GE proposes to modify its GWET system by adding one groundwater extraction well screened in the groundwater interval with elevated concentrations in the north margin of the former Intersil property. Siemens voluntarily pilot tested in-situ enhanced reductive dechlorination (ERD) remediation at the former Siemens property in 2007 and 2008. Initial results of this pilot test reportedly have shown that in-situ ERD may be effective at remediating the VOCs. The pilot study also reportedly indicates that a stall for cis-1,2-DCE reduction occurred in the Upper Resaturated Interval, and concludes that the treatment area will require bioaugmentation. However, declining groundwater levels in the Upper Resaturated Interval prevents further pilot testing at this time.

The former Siemens facility is located directly adjacent to and north of the former Intersil facility. A residential neighborhood is located immediately north of the Site. Calabazas Creek is approximately 1,100 feet east of the Site and flows north-northeast approximately 7 miles into San Francisco Bay. From 1967 to 1988, Intersil operated its facility at 10900 North Tantau Avenue as a silicon wafer fabrication plant and office building. In connection with these activities, Intersil used inorganic etching solutions (such as acids) and large amounts of water (up to 100,000 gallons per day). Trichloroethylene (TCE), an industrial solvent, was used as a cleaning agent prior to 1979 and 1,1,1-trichloroethane (1,1,1- TCA) was used until closure of the facility in 1988. Intersil initiated investigations of the property in 1983. The investigations conducted between 1983 and 1988 revealed the presence of TCE in soil and groundwater beneath the central and northern portions of the property. From approximately 1970 to 1982, Litronix used the former facility at 10950 North Tantau Avenue for semiconductor manufacturing operations. From 1982 to 1995, Siemens used the facility for semiconductor manufacturing operations. Until the mid-1980s, the semiconductor manufacturing operations involved the use of various organic solvents, primarily TCE and 1,1,1-TCA. Investigations began in 1982 after the discovery of contaminants during the removal of the underground storage tanks. Investigations performed between 1982 and 1989 indicated that releases of mostly chlorinated volatile organic compounds (VOCs) and semi-volatile organic compounds had occurred; these releases affected soil and groundwater at levels that required remediation. Intersil and Siemens initiated the investigation of the Off-Property Study Area in 1986. The Off-Property Study Area has no known history of manufacturing activities and is almost entirely developed for residential use. During the initial investigation, the A Zone groundwater was not found to be impacted and no remediation of the A Zone was required under California Regional Water Quality Control Board, San Francisco Bay Region, Order 90-119. However, the Record of Decision signed shortly thereafter required further Off-Property investigation. This investigation indicated that the B Zone was the most contaminated and that the C Zone was much less contaminated. No direct groundwater extraction from the C Zone was required because the low VOC concentrations in the C Zone were captured by increased pumping in the B Zone. General Electric (GE) has continuously operated a groundwater extraction and treatment (GWET) system at the former Intersil property since 1987. During the most recent five years, GE’s GWET system removed 43.75 pounds of VOCs. GE operated a soil vapor extraction and treatment (SVET) system from 1988 to 1993 and removed 3,000 pounds of VOCs. SMI Holding, LLC (Siemens) has continuously  iv Intersil Inc./Siemens Components Superfund Site Fifth Five-Year Review operated a GWET system at the former Siemens property since 1987. During the most recent five years, Siemens’s GWET system removed 268 pounds of VOCs. Siemens operated a SVET system from 1983 to 2004 and removed 17,310 pounds of VOCs. GE and Siemens have continuously operated a GWET system in the Off-Property Study Area since 1990. During the most recent FYR period, GE and Siemens’s Off-Property GWET system removed 111 pounds of VOCs. The entire Site remedy, including the past soil excavation, past soil vapor extraction, and ongoing groundwater extraction and treatment is functioning as designed. However, TCE concentrations in groundwater sampled from wells in the A and B Zones are above the TCE cleanup standard and the TCE concentrations appear to be stabilizing above the cleanup standards at several locations. Trend analysis was conducted on 12 wells, and results from three of the wells show an increasing trend in TCE concentrations. Toxicity value revisions have occurred for several Contaminants of Concern (COCs), but these changes do not affect protectiveness. Land use and exposure pathways have not changed since the last FYR, and deed restrictive covenants are in place for the former Intersil and former Siemens properties. Although vapor intrusion was previously noted as a potential change in the exposure assumptions used at the time of remedy selection, the extensive vapor intrusion assessment conducted in the last five years has concluded that there is no unacceptable risk to indoor air in fully occupied living or work spaces on any areas of the Site, including the residential Off-Property Study Area. Results for the on-Property buildings sampled showed either no evidence of vapor intrusion or low level vapor intrusion that does not pose an unacceptable health risk. It is recommended, however, that significant changes in Site conditions that may occur in the future, such as a rise in shallow groundwater levels or significant on- or Off-Property development, be reviewed so as to determine whether the vapor intrusion pathway should be reassessed. Regarding 1,4-dioxane, research has shown that this chemical is an emerging contaminant that can be found at sites contaminated by 1,1,1-TCA, which is a Site COC. However, there is no information regarding the presence and distribution of 1,4-dioxane in the subsurface. The remedy at the Intersil Inc,/Siemens Components Superfund Site, including the former Intersil property, former Siemens Property, and Off-Property Study Area, currently protects human health and the environment because all exposure pathways and scenarios are being controlled, including the vapor intrusion pathway. In order for the remedy to be protective in the long-term, additional evaluations of the A Zone in the Off-Property Study Area must be conducted, the groundwater remedy needs to be optimized so as to be more effective, or an alternative remedy selected, and 1,4 dioxane should be analyzed in future site sampling to determine its distribution and whether it should be considered a site COC.

Intersil/Siemens is a federal Superfund site in the South Bay, overseen by the Board under
an agreement with the U.S. EPA. In accordance with its 1990 site cleanup requirements,
Intersil/Siemens has evaluated the remedial activities performed at the site to determine if
the selected cleanup plans are working. The results were submitted in a report titled
“Five-Year Remedial Action Status Report and Effectiveness Evaluation” dated July 31,
1995.
Siemens initiated investigations at its property in 1982 and Intersil in 1983. Both sites had
VOC contamination in soil and groundwater. Groundwater contamination from the two sites
is commingled and has migrated offsite.
Siemens installed the first soil vapor extraction system in the Bay Area, and began
groundwater extraction in 1986. In addition to the soil vapor extraction remedy, Siemens
also excavated some of the contaminated soil. The onsite groundwater extraction system has
effectively contained groundwater beneath the site and has reduced chemical concentrations
in groundwater. It extracts approximately 23 million gallons of groundwater annually. Total
VOC concentrations in the influent to the treatment system have reduced from
approximately 3500 µg/l to less than 500 µg/l. Groundwater cleanup standard for TCE is
5 µg/l. Siemens reuses a portion of the extracted groundwater for on-site irrigation and
manufacturing operations.
At Intersil soil and groundwater were contaminated with VOCs and primarily TCE. Intersil
removed underground tanks in 1986 and 1988, and installed groundwater and soil vapor
extraction and treatment systems in 1987 and 1988, respectively. The soil vapor extraction
system at Intersil reduced VOC concentrations in soil to below the cleanup level of 1 ppm,
and was decommissioned in 1993. The groundwater extraction system has operated since
1987, and was expanded in 1991. The system has effectively contained groundwater beneath
the facility and has reduced chemical concentrations. Concentrations of TCE in the influent
groundwater to the treatment system have reduced from initial concentration of
approximately 8000 µg/l to 200 µg/l, and have remained at that since 1991. The system
extracts approximately 23 million gallons of water annually.

Groundwater extraction systems at Intersil, Siemens and the offsite area provide
hydraulic containment and remove chemicals from groundwater. VOC concentrations
in groundwater are reaching asymptotic conditions and are generally stable but they
are still higher than cleanup standards established in the order. All three systems are
pumping significantly more groundwater, but the chemical removal efficiency has
decreased considerably since startup. It appears that groundwater extraction
technology may not achieve some of the cleanup standards specified in the order. The
criteria used to establish the cleanup standards in the order have not changed, and
therefore cleanup standards remain the same. However, at some point in the future
it may be appropriate to adjust the amount of pumping such that hydraulic
containment is maintained while reducing energy consumption, the amount of water
extracted, and operating costs. An evaluation of the operation of the soil vapor
extraction and groundwater extraction systems at Seimens is currently underway. No
alternative remediation technologies are presently available that would significantly
improve the effectiveness of the remedial systems which are in place.

Intersil used solvents during fabrication of integrated circuits,
transistors, diodes, and other semiconductor devices at the former
Intersil property
1967-1988
Intersil initiated investigations and removed in-ground waste
handling units
1983-1986
California Regional Water Quality Control Board, San
Francisco Bay Region (RWB) issued Waste Discharge
Requirements/Site Cleanup Requirements (SCR), Order No. 86-49
1986
RWB issued Cleanup and Abatement Order No. 87-133 1987
Intersil started groundwater extraction and treatment (GWET)
system
1987
Intersil removed in-ground waste handling units and ceased
operation at facility and started soil vapor extraction and treatment
(SVET) system
1988
RWB issued SCR Order No. 89-038 1989
RWB issued SCR Order No. 90-119 (Final SCR) and EPA
included site on final listing on National Priorities List and issued
the Record of Decision (ROD) based on Final SCR
1990
General Electric (GE), parent company of Intersil, purchased the
property from Vallco Park, Ltd.
1992
GE decommissioned the SVET system with RWB approval 1993
Groundwater levels rose approximately 50 feet, reducing the
vadose zone to the interval from surface level to 45 feet below
ground surface (bgs)
1993-1998
RWB and EPA complete first FYR, which includes all 3
properties
1995
Manufacturing building demolished 1997
RWB and EPA completed second FYR, which includes all 3
properties
2000
RWB and EPA completed third FYR, which includes all 3
properties
2005
GE filed a Covenant and Environmental Restriction, including a
Soil Management Plan
2005
Intersil Inc./Siemens Components Superfund Site Fifth Five-Year Review
Activity Date
Soil vapor survey conducted; only benzene, TCE, and
1,3-butadiene were detected above California Environmental
Screening Levels or Human Health Screening Levels for
commercial/industrial land use
2006
Air strippers replaced by granular activated carbon (GAC)
treatment vessels
2007
Four monitoring wells were abandoned, after showing consistently
low concentrations of contaminants of concern (COCs)
2007
Tantau Investments constructed a commercial building on the
property, including a 15-milliliter vapor barrier
2008
Membrane interface probe (MIP) subsurface investigation
conducted to assess residual VOC concentrations and detected
trichloroethene levels up to 9,000 micrograms per liter in one of
the resaturated A Zones.
2008
RWB and EPA completed fourth FYR, which includes all 3
properties
2010
Hydrogeologic Framework Report written 2011
Second supplemental groundwater investigation conducted,
indicating that VOC-impacted groundwater is captured by the
current extraction well network
2011-2012
Off-Property residential soil vapor intrusion evaluation conducted 2013-2014
Former Siemens Facility
Litronix used solvents during fabrication of semiconductor devices 1970-1995
Litronix stopped using trichloroethene (TCE) 1980
Litronix removed underground storage tanks (USTs), began soil
and groundwater investigation, and discovered groundwater
contamination. Siemens purchased property from Litronix
1982
Siemens installed and started up SVET system with one soil vapor
extraction (SVE) well
1983
Siemens expanded SVET with two additional SVE wells 1985
Siemens installed and started up GWET system with air stripping
towers, expanded SVET system with one additional SVE well, and
removed inactive neutralization system
1986
Siemens conducted soil vapor sampling and hydraulic testing of
the three groundwater zones
1987
EPA listed the Site on the National Priorities List under the
Federal Superfund program; Siemens performed additional soil
vapor sampling, vapor extraction testing, and soil investigation to
105 feet bgs
1989
Siemens started remedial investigation 1990
RWB issued SCR Order No. 90-119 (Final SCR) and EPA
included Site on final listing on National Priorities List and issued
the ROD based on Final SCR
1990
Siemens expanded the SVET system with 16 SVE wells and the
GWET system to include 13 on-site extraction wells
1991
Siemens curtailed groundwater extraction from Well W21A with
RWB approval
1999
Siemens sold property to Tantau Partners, LLC.
Siemens performed indoor air quality evaluation that did not
2000
4 Intersil Inc./Siemens Components Superfund Site Fifth Five-Year Review
Activity Date
reveal indoor air vapor intrusion
Tantau Partners sold the property to Inland Western Cupertino
Tantau, LLC. Siemens shut down the SVET system and started
rebound study
2005
Siemens voluntarily initiated an initial Enhanced Reductive
Dechlorination (ERD) Pilot Study, expanded GWET system with
two wells, and permanently shut down the SVET system after
completing rebound study. The draft pilot study report concluded
that a northeast-trending preferential pathway exists in the Upper
Restaturated Zone, currently designated as the A1 and A2 Zones
2006
Current Siemens property occupant Kaiser Permanente conducted
indoor air quality investigation and risk assessment indicating
ambient and indoor levels of tetrachloroethene (PCE) slightly
above, and TCE below, RWB commercial/industrial
Environmental Screening Levels (ESLs). The study concluded
that the PCE detections were probably from indoor sources.
2007
Siemens conducted MIP investigation 2007
Siemens postponed supplemental ERD Pilot Study due to decline
in groundwater level elevations in Upper Resaturated Interval of
the Upper A Zone
2008
Corrective Grant Deed Stating Environmental Restriction agreed
to by SMI Holding, LLC (Siemens) and Tantau Partners, LLC
2009
Hydrogeologic Framework Report written 2011
Northside groundwater investigation conducted and confirmed the
northeast-trending preferential pathway in the A1 and A2 Zones.
2011
Potential vapor intrusion evaluation at the Former Siemens
Facility completed
2014
Phase II ERD Pilot Study initiated 2014
Off-Property Study Area
GE and Siemens began groundwater investigations 1986
RWB issued SCR Order No. 90-119 (Final SCR) and EPA
included Site on final listing on National Priorities List and issued
the ROD based on Final SCR
1990
GE and Siemens began groundwater extraction from two B Zone
wells
1990
GE and Siemens expanded GWETS from two wells to three
B Zone wells
1991
MIP and additional groundwater investigation conducted 2011
Vapor intrusion indoor air evaluation conducted 2013-2014
Off-property monitoring well installation completed 2014
Follow-up off-property monitoring well installation workplan
approved
2015`;

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages = [] } = await req.json();
  console.log(messages);

  const result = streamText({
    model: openai("gpt-4o"),
    system: `You are an assistant who is knowledgeable about contaminated waste Superfund sites in the US. You learn from technical documents written by scientists to answer questions from average people in a casual, plain language, concise manner. You NEVER ignore these rules:

- You NEVER reference chemical formulas or scientific language unless asked
- You talk casually like a neighbor, but with expertise
- You always spell out acronyms on their first usage
- Keep your answers to around 2 short sentences

The most important rule is, you should only pull information from this context: ${context}`,
    messages,
  });

  return result.toDataStreamResponse();
}
