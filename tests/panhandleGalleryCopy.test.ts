import { describe, expect, it } from "vitest";
import { panhandleGalleryCopy } from "../src/panhandleGalleryCopy";
import { pageSchema } from "../scripts/structured-data";

describe("Panhandle laundry copy and structured data", () => {
  it("keeps rental descriptions specific to location and equipment", () => {
    const title = "Oklahoma Panhandle Laundry Facility Rental";
    expect(panhandleGalleryCopy(title, "model-08")?.caption).toContain("Oklahoma Panhandle Commercial Project and Base Camp 30 ft Laundry Trailer Rental or Lease");
    expect(panhandleGalleryCopy(title, "model-06")?.caption).toContain("Oklahoma Panhandle Commercial Facility and Base Camp 20 ft Laundry Container Rental or Lease");
    expect(panhandleGalleryCopy("Texas Panhandle Laundry Rental", "model-08")).toBeUndefined();
    expect(panhandleGalleryCopy(title, "unknown")).toBeUndefined();
  });
  it("uses the production URL and relevant service type in schema", () => {
    const schema = pageSchema({path: "/service-areas/oklahoma/panhandle/", title: "Oklahoma Panhandle Laundry Rental", description: "Temporary laundry rental", crumbs: [], service: true, serviceType: "Laundry trailer and laundry container rental", area: { name: "Panhandle", state: "Oklahoma" }});
    const service = schema["@graph"].find((item: any) => item["@type"] === "Service") as any;
    expect(service.url).toBe("https://temporary123.com/service-areas/oklahoma/panhandle/");
    expect(service.serviceType).toBe("Laundry trailer and laundry container rental");
    expect(service.areaServed.containedInPlace.name).toBe("Oklahoma");
  });
});
