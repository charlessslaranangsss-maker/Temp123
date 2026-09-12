// Editorial planning prompts, not claims of local inventory, delivery times,
// permitting approval or completed projects. Service labels live in serviceMenu.
const stateGuideDetails: Record<
  string,
  { focus: string; intro: string; question: string }
> = {
  Alabama: {
    focus: "Keep the work area connected",
    intro:
      "For an Alabama plant shutdown or kitchen renovation, map the route between the temporary cooking area and the people it serves. Separate food deliveries from construction traffic and leave room for refrigeration and dishwashing access.",
    question: "Can the kitchen stay in place through every phase of the work?",
  },
  Alaska: {
    focus: "Start with transport feasibility",
    intro:
      "An Alaska rental enquiry should identify the community and the final delivery route before equipment is selected. For a site without direct road access, discuss transport feasibility, unloading arrangements and the return journey at the outset.",
    question:
      "Which transport connections are available for the exact site and rental dates?",
  },
  Arizona: {
    focus: "Plan the working environment",
    intro:
      "For an Arizona outdoor operation, include shaded staff breaks, drinking-water access and the proposed location of refrigerated storage in the site brief. Discuss the equipment's operating conditions and utility demands before choosing a layout.",
    question:
      "Where will staff rest and supplies be stored during the busiest service period?",
  },
  Arkansas: {
    focus: "Check the last stretch of access",
    intro:
      "An Arkansas project outside a town center may depend on a private access road rather than the main highway. Provide gate measurements, photographs of turns and the proposed trailer position so delivery access can be reviewed.",
    question:
      "Can a delivery vehicle enter, turn and leave without crossing the active work zone?",
  },
  California: {
    focus: "Make limited space work",
    intro:
      "For a California renovation on an occupied property, show the available footprint alongside pedestrian routes, deliveries and emergency access. The kitchen, refrigeration and dishwashing layout should support the existing operation throughout construction.",
    question: "Which activities must continue beside the temporary facility?",
  },
  Colorado: {
    focus: "Match the plan to the elevation",
    intro:
      "A Colorado site brief should distinguish an urban property from a mountain location. Include access gradients, the operating season and the exact site elevation for the equipment and delivery teams to assess.",
    question:
      "Do the approach road and proposed setup area have slopes that need review?",
  },
  Connecticut: {
    focus: "Protect the occupied campus",
    intro:
      "For a Connecticut school, healthcare or workplace renovation, plan temporary food service around the people who remain on site. Identify delivery windows and a clear route from preparation to serving that avoids construction activity.",
    question:
      "How will food move from the temporary kitchen to the dining area?",
  },
  Delaware: {
    focus: "Coordinate arrival and service",
    intro:
      "For a Delaware property with a shared service entrance, schedule trailer placement separately from routine food and waste collections. Mark connection points and check that servicing vehicles can reach them once the facility is operating.",
    question:
      "Who controls the service entrance and can reserve the installation window?",
  },
  Florida: {
    focus: "Include a weather contingency",
    intro:
      "A Florida temporary facility plan should include a site-specific weather contingency as well as the normal operating layout. Discuss who will monitor conditions, make operational decisions and coordinate any change to servicing or access.",
    question:
      "Who is responsible for the site's weather response and communication plan?",
  },
  Georgia: {
    focus: "Design around shift changes",
    intro:
      "For a Georgia production or construction project, use the busiest shift change to size the food service and welfare brief. Staggered breaks and separate supply access can influence the arrangement of kitchens, restrooms and handwashing facilities.",
    question:
      "How many people need to use the facilities within the same break period?",
  },
  Hawaii: {
    focus: "Identify the island first",
    intro:
      "A Hawaii enquiry needs the island and site address before delivery options can be assessed. Discuss equipment availability, any required freight connections, receiving access and the removal plan together rather than assuming a mainland-style delivery.",
    question:
      "Who will receive the equipment and coordinate the final movement to site?",
  },
  Idaho: {
    focus: "Prepare for a remote operating day",
    intro:
      "For an Idaho project away from established services, document how food, potable water and waste collections will reach the site. A temporary kitchen plan should account for replenishment between deliveries, as well as the initial installation.",
    question:
      "What supplies must remain on site between scheduled service visits?",
  },
  Illinois: {
    focus: "Keep public and service routes clear",
    intro:
      "For an Illinois urban property, review the delivery approach and the working area separately. Show where the trailer will sit, how staff will enter and where supply vehicles can stop without obstructing public access.",
    question:
      "Does installation require coordination with another property or loading-area operator?",
  },
  Indiana: {
    focus: "Bridge the shutdown period",
    intro:
      "For an Indiana facility shutdown, build the rental schedule around commissioning and handover as well as the construction dates. Allow the project team to verify the temporary kitchen's connections before normal food service transfers across.",
    question: "What must be checked before the existing kitchen can close?",
  },
  Iowa: {
    focus: "Account for changing crew numbers",
    intro:
      "An Iowa seasonal or phased project may have different staffing levels during setup, peak work and demobilization. Share those stages so kitchen capacity, washing facilities and storage can be discussed against actual demand.",
    question: "When does the project reach its highest daily occupancy?",
  },
  Kansas: {
    focus: "Lay out an exposed work site",
    intro:
      "For a Kansas open-site operation, discuss the proposed equipment positions and site conditions with the installation team. Keep staff routes, utility runs and service access visible on the same plan rather than arranging each facility independently.",
    question: "Who will review the placement plan before delivery is booked?",
  },
  Kentucky: {
    focus: "Follow the food service route",
    intro:
      "For a Kentucky renovation or event, work backward from the serving point to preparation, storage and washing. This makes it easier to identify whether a standalone kitchen or coordinated supporting facilities suit the operation.",
    question:
      "Where do clean dishes, used dishes and incoming ingredients move?",
  },
  Louisiana: {
    focus: "Confirm the usable setup area",
    intro:
      "For a Louisiana site, identify a suitable setup surface and discuss drainage and access conditions with the property team. Include a servicing route that remains usable for food deliveries and waste collection during the rental.",
    question:
      "Has the property team reviewed the proposed ground conditions and drainage?",
  },
  Maine: {
    focus: "Plan beyond the delivery date",
    intro:
      "A Maine rental extending across seasons should include operating dates and access arrangements for the whole stay. For an island or remote property, identify any transport connection that affects both equipment movement and routine supplies.",
    question:
      "Could the supply or removal route change before the rental ends?",
  },
  Maryland: {
    focus: "Coordinate a controlled-access site",
    intro:
      "For a Maryland institutional or secured property, include vehicle entry procedures and a named receiving contact in the brief. Plan deliveries and servicing around the site's access process so the temporary facility can be supported after installation.",
    question:
      "What information must drivers provide before arriving at the gate?",
  },
  Massachusetts: {
    focus: "Fit around an existing building",
    intro:
      "For a Massachusetts renovation with a constrained yard or loading area, provide measured access and photographs before selecting equipment. Consider the staff entrance and the route to dining alongside the trailer's footprint.",
    question: "Are there overhead obstructions or tight turns on the approach?",
  },
  Michigan: {
    focus: "Specify the actual destination",
    intro:
      "A Michigan enquiry should name the peninsula, city and exact property location. Discuss delivery routing and the operating season together, especially when a project spans several sites with different access arrangements.",
    question:
      "Will the facilities stay at one property or move between project phases?",
  },
  Minnesota: {
    focus: "Define seasonal operating needs",
    intro:
      "For a Minnesota rental that continues into colder months, discuss connection protection and servicing arrangements with the equipment team. The project brief should give the full operating period, including any planned shutdowns.",
    question:
      "Will the facility operate continuously or be unused for part of the rental?",
  },
  Mississippi: {
    focus: "Connect food service and welfare",
    intro:
      "For a Mississippi field project, plan kitchen service, handwashing and restroom access together. Show where crews gather and how service vehicles will reach the facilities without cutting across the main pedestrian route.",
    question:
      "How far will workers travel from the work area to meals and washing facilities?",
  },
  Missouri: {
    focus: "Sequence a phased installation",
    intro:
      "For a Missouri project with several construction stages, identify when each temporary facility becomes necessary. Reserving installation space and connection routes early can help the temporary operation fit alongside later phases.",
    question:
      "Which part of the site must remain available for the entire rental?",
  },
  Montana: {
    focus: "Build a replenishment plan",
    intro:
      "For a Montana remote crew operation, discuss the interval between food, water and servicing deliveries. Storage and welfare requirements should reflect the working schedule and resupply plan rather than crew numbers alone.",
    question:
      "How often can supply and servicing vehicles realistically reach the site?",
  },
  Nebraska: {
    focus: "Separate meals from deliveries",
    intro:
      "For a Nebraska agricultural or construction project, show how supply vehicles and staff will use the site during meal periods. A clear unloading point and sufficient storage help the team plan food service around the daily workflow.",
    question:
      "Can replenishment happen without interrupting meal preparation or serving?",
  },
  Nevada: {
    focus: "Describe the whole utility setup",
    intro:
      "A Nevada enquiry for an undeveloped site should identify what power, water and wastewater arrangements already exist. Review the complete support setup before selecting a kitchen or accommodation layout.",
    question:
      "Which utilities are installed, and which still need to be arranged?",
  },
  "New Hampshire": {
    focus: "Review access before selecting size",
    intro:
      "For a New Hampshire hillside or rural property, provide the access route and proposed installation position together. Measured turns, gradients and available working space give the delivery team more useful information than a street address alone.",
    question:
      "Can you provide photographs from the entrance to the setup area?",
  },
  "New Jersey": {
    focus: "Use a shared loading area carefully",
    intro:
      "For a New Jersey commercial renovation, list other users of the loading dock or service yard. Discuss trailer placement, waste collection and ingredient deliveries so the temporary operation fits the property's daily logistics.",
    question:
      "Which loading-area activities cannot be rescheduled during installation?",
  },
  "New Mexico": {
    focus: "Plan the distance between facilities",
    intro:
      "For a New Mexico project spread across a large site, show the working areas and staff travel routes. The placement of food service, washing and rest facilities should reflect where people spend their shifts.",
    question:
      "Would one central facility serve the team, or do work areas need separate access?",
  },
  "New York": {
    focus: "Distinguish the property conditions",
    intro:
      "A New York city-center renovation and an upstate field operation need different delivery briefs. Specify the property type, usable access, installation window and distance between the temporary kitchen and the serving area.",
    question:
      "What property-specific constraint will determine equipment placement?",
  },
  "North Carolina": {
    focus: "Explain the site's setting",
    intro:
      "For a North Carolina enquiry, describe whether the site is coastal, inland or in a mountain area, then provide its actual access conditions. Pair those details with the project schedule so delivery and ongoing servicing can be assessed.",
    question:
      "Are there site access conditions that change during the planned rental period?",
  },
  "North Dakota": {
    focus: "Connect occupancy to daily servicing",
    intro:
      "For a North Dakota crew camp or field project, give the expected overnight occupancy as well as shift headcount. Sleeping, shower, laundry and meal requirements can differ even when they support the same workforce.",
    question:
      "How many people will live on site compared with those arriving for each shift?",
  },
  Ohio: {
    focus: "Support a working facility",
    intro:
      "For an Ohio workplace renovation, define which parts of the existing food service will remain operational. Temporary cooking, cold storage or washing capacity can then be discussed around the specific gap in the current facility.",
    question:
      "Which functions must move outside, and which can stay in the building?",
  },
  Oklahoma: {
    focus: "Prepare a flexible operating brief",
    intro:
      "For an Oklahoma field operation, identify the minimum facilities needed at startup and what changes as the workforce grows. Include the site's contingency arrangements and the person authorized to adjust the rental scope.",
    question:
      "What change in crew size would require a different facility arrangement?",
  },
  Oregon: {
    focus: "Keep service access usable",
    intro:
      "For an Oregon outdoor project, review the setup surface and the route used by servicing vehicles throughout the rental. Include drainage, staff walkways and the distance to utility connections in the placement discussion.",
    question:
      "Can the servicing route remain separate from the main staff walkway?",
  },
  Pennsylvania: {
    focus: "Coordinate with the renovation team",
    intro:
      "For a Pennsylvania institutional renovation, align temporary food service with construction phasing and building access. Share the meal schedule and handover dates so installation and removal can be planned around continued occupancy.",
    question:
      "Who will coordinate the temporary facility with the main contractor?",
  },
  "Rhode Island": {
    focus: "Measure a compact site",
    intro:
      "For a Rhode Island property with limited outdoor space, start with a measured site sketch. Include neighboring entrances, the unloading area and the staff route to the building before discussing equipment combinations.",
    question:
      "What usable space remains once delivery and pedestrian access are reserved?",
  },
  "South Carolina": {
    focus: "Match facilities to service periods",
    intro:
      "For a South Carolina hospitality or renovation project, list the number of meals and the timing of each service. Include dish return and ingredient storage so the temporary setup supports the complete daily cycle.",
    question:
      "Which service period creates the highest demand for cooking and washing?",
  },
  "South Dakota": {
    focus: "Plan for peak attendance",
    intro:
      "For a South Dakota event or temporary workforce site, distinguish average attendance from the busiest day. Give the team the operating hours and expected arrival pattern to discuss restrooms, showers and food service access.",
    question:
      "Does demand arrive steadily or in a short peak after shifts or events?",
  },
  Tennessee: {
    focus: "Allow for a changing daily program",
    intro:
      "For a Tennessee event, venue or workplace project, describe how food service demand changes through the day. Preparation, serving and cleanup may require different access arrangements even when they use the same temporary kitchen.",
    question:
      "Can the site support preparation and cleanup while guests or staff are present?",
  },
  Texas: {
    focus: "Locate the crew and the supply route",
    intro:
      "For a Texas project, provide the exact job-site address and explain whether the workforce is local or staying on site. Distance from suppliers and the shift pattern will help shape the discussion about storage, food service and crew facilities.",
    question:
      "What needs to be available on site between scheduled supply deliveries?",
  },
  Utah: {
    focus: "Clarify the approach and operating area",
    intro:
      "For a Utah site beyond an established service yard, share the final approach route and the area available for installation. Discuss gradients, turning space and the utility plan before equipment dimensions are finalized.",
    question:
      "Where can the delivery vehicle safely maneuver after placing the facility?",
  },
  Vermont: {
    focus: "Include the full operating season",
    intro:
      "For a Vermont renovation or rural project, explain how long the temporary facility will remain in use and whether access changes during that period. Plan staff entry, supply deliveries and connection protection with the property team.",
    question:
      "Who will maintain access to the facility for the duration of the rental?",
  },
  Virginia: {
    focus: "Plan the transition between kitchens",
    intro:
      "For a Virginia campus or government-site project, outline how food service will transfer to the temporary facility and back again. Include site entry procedures, connection checks and the people responsible for each handover.",
    question:
      "What needs to be ready before meals move to the temporary kitchen?",
  },
  Washington: {
    focus: "Identify any transport connection",
    intro:
      "For a Washington island or otherwise constrained location, flag any ferry connection or restricted approach in the initial enquiry. Discuss both equipment transport and the regular supply route before agreeing the rental schedule.",
    question:
      "Does any part of the journey require a separate booking or receiving arrangement?",
  },
  "West Virginia": {
    focus: "Review turns and gradients",
    intro:
      "For a West Virginia hillside or valley site, the final approach can be as important as the installation footprint. Provide photographs and measurements of gates, tight turns and slopes for a route review.",
    question:
      "Is there enough space to position the trailer without blocking the access road?",
  },
  Wisconsin: {
    focus: "Link rental dates to facility demand",
    intro:
      "For a Wisconsin school, workplace or seasonal operation, explain whether demand changes during the rental. Include closure dates, staff numbers and the peak meal schedule so the temporary capacity matches the operating calendar.",
    question:
      "Will occupancy or meal production change before the permanent facility reopens?",
  },
  Wyoming: {
    focus: "Keep a remote crew supplied",
    intro:
      "For a Wyoming remote project, describe the on-site workforce and the distance between work, meals and sleeping areas. Discuss supply storage and servicing access as part of the facility layout, including the final removal route.",
    question:
      "Who coordinates food, water and servicing deliveries during the working week?",
  },
};

const firstSentence = (copy: string) =>
  copy.match(/^.*?[.!?](?:\s|$)/)?.[0].trim() || copy;

const rentalContext = (name: string) =>
  `Compare temporary facility rental options in ${name}, USA. Rent short-term or ask about a longer lease across the United States.`;

export const stateGuides = Object.fromEntries(
  Object.entries(stateGuideDetails).map(([name, guide]) => [
    name,
    { ...guide, intro: `${firstSentence(guide.intro)} ${rentalContext(name)}` },
  ]),
) as typeof stateGuideDetails;

export const stateAnchor = (name: string) =>
  `planning-${name.toLowerCase().replaceAll(" ", "-")}`;
