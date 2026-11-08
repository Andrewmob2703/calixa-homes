import buildDelivery from "@/assets/calixa-build-branded-delivery.jpg";
import buildFoundations from "@/assets/calixa-build-foundations-branded.jpg";
import buildCompleted from "@/assets/calixa-build-completed-homes-branded.jpg";
import careHome from "@/assets/calixa-care-team-branded.jpg";
import careMaintenance from "@/assets/calixa-care-home-maintenance-branded.jpg";
import careFamily from "@/assets/calixa-care-family-support-branded.jpg";

export const buildImages = [
  { src: buildDelivery, alt: "CalixaHomes workers delivering building materials to a Ghanaian construction site" },
  { src: buildFoundations, alt: "Construction team pouring reinforced foundations for a home in Ghana" },
  { src: buildCompleted, alt: "Completed Ghanaian homes with a supervisor and homeowner" },
];

export const careImages = [
  { src: careHome, alt: "Electrician and caregiver at work in a family home" },
  { src: careMaintenance, alt: "Electrician checking a wall outlet in a Ghanaian family home" },
  { src: careFamily, alt: "Caregiver and elderly woman tending flowers with a pet dog nearby" },
];

export const landingImages = buildImages.flatMap((image, index) => {
  const care = careImages[index];
  return care ? [image, care] : [image];
});