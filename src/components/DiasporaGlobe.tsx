import globePoster from "@/assets/globe-diaspora-approved.jpg.asset.json";

export default function DiasporaGlobe() {
  return (
    <div className="globe-illustration relative aspect-[3/2] max-h-[42rem] w-full overflow-hidden" role="img" aria-label="Globe connecting CalixaHomes users in the USA, Canada, UK, France, Germany and Australia to home construction in Ghana, Nigeria, Kenya and South Africa">
      <img
        src={globePoster.url}
        alt=""
        className="globe-illustration-art absolute inset-0 h-full w-full object-contain"
      />
    </div>
  );
}
