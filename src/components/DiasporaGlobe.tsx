import { useEffect, useRef, useState } from "react";
import globePoster from "@/assets/globe-diaspora-approved.jpg.asset.json";
import { Rotate3D, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import earthAsset from "@/assets/globe-earth.jpg.asset.json";
import logoAsset from "@/assets/calixa-logo.jpg.asset.json";
import userHeadshots from "@/assets/globe-user-headshots.jpg";

export default function DiasporaGlobe() {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [interactive, setInteractive] = useState(false);

  useEffect(() => {
    if (!interactive) return;
    const element = host.current;
    if (!element) return;
    let disposed = false;
    let cleanup = () => {};
    void import("three").then(async (T) => {
      if (disposed) return;
      const palette = getComputedStyle(element);
      const color = (token: string) => new T.Color(palette.getPropertyValue(token).trim());
      const gold = color("--globe-gold");
      const teal = color("--globe-project");
      const dark = color("--globe-ink");
      const light = color("--globe-light");
      const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.domElement.setAttribute("aria-hidden", "true");
      element.appendChild(renderer.domElement);
      const scene = new T.Scene();
      const camera = new T.PerspectiveCamera(38, 1, 0.1, 100);
      camera.position.set(0, 0, 3.7);
      scene.add(new T.AmbientLight(light, 2));
      const lamp = new T.DirectionalLight(light, 3);
      lamp.position.set(-3, 4, 5);
      scene.add(lamp);
      const world = new T.Group();
      world.rotation.y = -0.2;
      scene.add(world);
      const loader = new T.TextureLoader();
      const map = await loader.loadAsync(earthAsset.url);
      const logo = await loader.loadAsync(logoAsset.url);
      const portraits = await loader.loadAsync(userHeadshots);
      map.colorSpace = logo.colorSpace = T.SRGBColorSpace;
      if (disposed) { map.dispose(); logo.dispose(); portraits.dispose(); renderer.dispose(); return; }
      const earth = new T.Mesh(new T.SphereGeometry(1, 96, 64), new T.MeshStandardMaterial({ map, roughness: 0.65, metalness: 0.15 }));
      earth.rotation.y = -Math.PI / 2;
      world.add(earth);
      const shell = new T.Mesh(new T.SphereGeometry(1.015, 48, 32), new T.MeshBasicMaterial({ color: gold, wireframe: true, transparent: true, opacity: 0.035 }));
      world.add(shell);
      const point = (lat: number, lon: number, radius = 1) => {
        const phi = lat * Math.PI / 180;
        const theta = lon * Math.PI / 180;
        return new T.Vector3(radius * Math.cos(phi) * Math.sin(theta), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(theta));
      };
      const material = (c: InstanceType<typeof T.Color>) => new T.MeshStandardMaterial({ color: c, roughness: 0.55 });
      const goldMat = material(gold), darkMat = material(dark), lightMat = material(light), tealMat = material(teal);
      const box = (group: InstanceType<typeof T.Group>, w: number, h: number, d: number, x: number, y: number, z: number, mat: InstanceType<typeof T.MeshStandardMaterial>) => {
        const mesh = new T.Mesh(new T.BoxGeometry(w, h, d), mat);
        mesh.position.set(x, y, z); group.add(mesh); return mesh;
      };
      const anchor = (lat: number, lon: number) => {
        const group = new T.Group();
        group.position.copy(point(lat, lon, 1.015));
        group.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), group.position.clone().normalize());
        world.add(group); return group;
      };
      const origins: [number, number, string][] = [[40.7,-74,"USA"], [45.5,-73.6,"Canada"], [51.5,-0.1,"UK"], [48.9,2.4,"France"], [52.5,13.4,"Germany"], [-33.9,151.2,"Australia"]];
      const destinations: [number, number][] = [[5.6,-0.2], [6.5,3.4], [-1.3,36.8], [-26.2,28]];
      const markerTextures: InstanceType<typeof T.CanvasTexture>[] = [];
      origins.forEach(([lat, lon, country], index) => {
        const canvas = document.createElement("canvas");
        canvas.width = 384; canvas.height = 320;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        const source = portraits.image as HTMLImageElement;
        const cellWidth = source.width / 3, cellHeight = source.height / 2;
        ctx.save();
        ctx.beginPath(); ctx.arc(126, 128, 96, 0, Math.PI * 2); ctx.clip();
        ctx.drawImage(source, (index % 3) * cellWidth, Math.floor(index / 3) * cellHeight, cellWidth, cellHeight, 30, 32, 192, 192);
        ctx.restore();
        ctx.strokeStyle = gold.getStyle(); ctx.lineWidth = 7;
        ctx.beginPath(); ctx.arc(126, 128, 96, 0, Math.PI * 2); ctx.stroke();
        ctx.fillStyle = dark.getStyle();
        ctx.beginPath(); ctx.roundRect(225, 62, 104, 174, 15); ctx.fill();
        ctx.fillStyle = light.getStyle();
        ctx.fillRect(233, 79, 88, 139);
        ctx.drawImage(logo.image, 239, 104, 76, 76);
        ctx.fillStyle = teal.getStyle(); ctx.fillRect(245, 191, 64, 10);
        ctx.fillStyle = light.getStyle(); ctx.font = "600 30px sans-serif";
        ctx.textAlign = "center"; ctx.fillText(country, 178, 279);
        const texture = new T.CanvasTexture(canvas);
        texture.colorSpace = T.SRGBColorSpace;
        markerTextures.push(texture);
        const marker = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, depthTest: true, depthWrite: false }));
        marker.position.copy(point(lat, lon, 1.16));
        marker.scale.set(.26, .217, 1);
        world.add(marker);
      });
      destinations.forEach(([lat, lon]) => {
        const house = anchor(lat, lon);
        box(house,.105,.01,.09,0,.008,0,tealMat);
        box(house,.09,.065,.07,0,.046,0,lightMat);
        box(house,.021,.04,.003,0,.032,.037,darkMat);
        [-1,1].forEach(side => box(house,.018,.019,.003,side*.028,.054,.037,tealMat));
        const roof = new T.Mesh(new T.ConeGeometry(.075,.041,4),goldMat);
        roof.rotation.y = Math.PI/4; roof.position.y=.099; house.add(roof);
        box(house,.004,.19,.004,.08,.1,0,goldMat);
        box(house,.13,.004,.004,.04,.19,0,goldMat);
      });
      const pulses: { mesh: InstanceType<typeof T.Mesh>; curve: InstanceType<typeof T.QuadraticBezierCurve3> }[] = [];
      origins.forEach(([lat,lon], i) => {
        const destination = destinations[i % destinations.length];
        if (!destination) return;
        const from=point(lat,lon,1.04), to=point(destination[0],destination[1],1.04);
        const curve = new T.QuadraticBezierCurve3(from,from.clone().add(to).normalize().multiplyScalar(1.6),to);
        world.add(new T.Mesh(new T.TubeGeometry(curve,60,.0035,5,false),new T.MeshBasicMaterial({color: gold, transparent:true, opacity:.8})));
        const pulse = new T.Mesh(new T.SphereGeometry(.012,10,10),new T.MeshBasicMaterial({color:light}));
        world.add(pulse); pulses.push({mesh:pulse,curve});
      });
      const resize = new ResizeObserver(() => {
        renderer.setSize(element.clientWidth, element.clientHeight);
        camera.aspect=element.clientWidth/element.clientHeight; camera.updateProjectionMatrix();
      });
      resize.observe(element);
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
      let dragging=false, previousX=0, offset=-.2, frame=0;
      const down=(e: PointerEvent) => {dragging=true; previousX=e.clientX; element.setPointerCapture(e.pointerId);};
      const move=(e: PointerEvent) => {if(dragging){offset+=(e.clientX-previousX)*.005;previousX=e.clientX;}};
      const up=()=>{dragging=false;};
      element.addEventListener("pointerdown",down); element.addEventListener("pointermove",move); element.addEventListener("pointerup",up); element.addEventListener("pointercancel",up);
      const start=performance.now();
      const render=() => {
        if(disposed) return;
        const time=(performance.now()-start)/1000;
        world.rotation.y=offset+(reduced.matches ? 0 : time*.055);
        pulses.forEach(({mesh,curve},i)=>mesh.position.copy(curve.getPoint(reduced.matches ? .5 : (time*.15+i*.2)%1)));
        renderer.render(scene,camera); frame=requestAnimationFrame(render);
      };
      render(); setReady(true); element.dataset["sceneReady"] = "true";
      cleanup=()=>{
        cancelAnimationFrame(frame); resize.disconnect();
        element.removeEventListener("pointerdown",down); element.removeEventListener("pointermove",move); element.removeEventListener("pointerup",up); element.removeEventListener("pointercancel",up);
        scene.traverse(object=>{if(object instanceof T.Mesh){object.geometry.dispose();const mats=Array.isArray(object.material)?object.material:[object.material];mats.forEach(mat=>mat.dispose());} else if (object instanceof T.Sprite) { object.material.dispose(); }});
        markerTextures.forEach(texture => texture.dispose());
        map.dispose();logo.dispose();portraits.dispose();renderer.dispose();renderer.domElement.remove();
      };
    }).catch(() => { /* Keep the illustrated fallback if WebGL is unavailable. */ });
    return () => { disposed=true; cleanup(); delete element.dataset["sceneReady"]; };
  }, [interactive]);

  return (
    <div className="relative w-full">
      <div className="relative aspect-[3/2] max-h-[42rem] w-full overflow-hidden" role="img" aria-label="Globe connecting CalixaHomes users in the USA, Canada, UK, France, Germany and Australia to home construction in Ghana, Nigeria, Kenya and South Africa">
        <img src={globePoster.url} alt="" className={`absolute inset-0 h-full w-full object-contain transition-opacity ${interactive && ready ? "opacity-0" : "opacity-100"}`} />
        {interactive && <div ref={host} className="absolute inset-0 cursor-grab touch-pan-y active:cursor-grabbing" />}
      </div>
      <div className="mt-4 flex justify-center">
        <Button variant="secondary" onClick={() => { setReady(false); setInteractive(value => !value); }}>
          {interactive ? <Image /> : <Rotate3D />}
          {interactive ? "View illustration" : "Rotate globe"}
        </Button>
      </div>
    </div>
  );
}