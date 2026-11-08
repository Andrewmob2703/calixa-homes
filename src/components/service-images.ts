import buildDelivery from "@/assets/calixa-build-branded-delivery.jpg";
import buildFoundations from "@/assets/calixa-build-foundations-branded.jpg";
import buildCompleted from "@/assets/calixa-build-completed-homes-branded.jpg";
import carePlumbing from "@/assets/calixa-care-plumbing.jpg";
import careMaintenance from "@/assets/calixa-care-home-maintenance-branded.jpg";
import careGardening from "@/assets/calixa-care-gardening.jpg";

export const buildImages = [
  { src: buildDelivery, alt: "CalixaHomes workers delivering building materials to a Ghanaian construction site" },
  { src: buildFoundations, alt: "Construction team pouring reinforced foundations for a home in Ghana" },
  { src: buildCompleted, alt: "Completed Ghanaian homes with a supervisor and homeowner" },
];

export const careImages = [
  { src: carePlumbing, alt: "CalixaHomes plumber repairing a kitchen sink pipe" },
  { src: careMaintenance, alt: "Electrician checking a wall outlet in a Ghanaian family home" },
  { src: careGardening, alt: "CalixaHomes gardener maintaining hedges outside a home" },
];

export const landingImages = buildImages.flatMap((image, index) => {
  const care = careImages[index];
  return care ? [image, care] : [image];
});