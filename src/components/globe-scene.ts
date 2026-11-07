import * as T from "three";
import earthAsset from "@/assets/globe-earth.jpg.asset.json";
import logoAsset from "@/assets/calixa-logo.jpg.asset.json";
import userHeadshots from "@/assets/globe-user-headshots.jpg";
import { arcDirection, geographicPoint, journeyFrame, globeUsers, globeSites } from "./globe-motion";

export function mountGlobe(element: HTMLDivElement, onReady: () => void) {
  let disposed = false;
  let frame = 0;
  const styles = getComputedStyle(element);
  const color = (name: string) => new T.Color(styles.getPropertyValue(name).trim());
  const gold = color("--globe-gold"), light = color("--globe-light");
  const ink = color("--globe-ink"), land = color("--globe-land");
  const sun = color("--globe-sun"), sky = color("--globe-sky");
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  element.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(40, 1, 0.1, 30);
  camera.position.set(0, .15, 4.1);
  camera.lookAt(0, 0, 0);
  scene.add(new T.HemisphereLight(sun, sky, 1.3));
  const key = new T.DirectionalLight(sun, 2);
  key.position.set(-3, 4, 5); scene.add(key);
  const rim = new T.DirectionalLight(sky, 1);
  rim.position.set(4, 0, -3); scene.add(rim);
  const world = new T.Group(); scene.add(world);
  const textures: T.Texture[] = [];
  const point = (lat: number, lon: number, radius = 1) => {
    const p = geographicPoint(lat, lon);
    return new T.Vector3(p.x, p.y, p.z).multiplyScalar(radius);
  };
  const drawTexture = (canvas: HTMLCanvasElement) => {
    const texture = new T.CanvasTexture(canvas);
    texture.colorSpace = T.SRGBColorSpace; textures.push(texture); return texture;
  };
  const resize = () => {
    const w = element.clientWidth, h = element.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h);
    camera.aspect = w / h; camera.updateProjectionMatrix();
    renderer.render(scene, camera);
  };
  const observer = new ResizeObserver(resize); observer.observe(element); resize();
  const reduced = matchMedia("(prefers-reduced-motion: reduce)");
  const connections: { mesh: T.Mesh; pulse: T.Mesh; curve: T.CatmullRomCurve3 }[] = [];
  const markers: { sprite: T.Sprite; position: T.Vector3; userIndex?: number; siteIndex?: number }[] = [];
  const tethers: T.Line[] = [];
  const loader = new T.TextureLoader();
  void Promise.all([loader.loadAsync(earthAsset.url), loader.loadAsync(logoAsset.url), loader.loadAsync(userHeadshots)]).then(([map, logo, portraits]) => {
    if (disposed) { map.dispose(); logo.dispose(); portraits.dispose(); return; }
    textures.push(map, logo, portraits);
    map.colorSpace = T.SRGBColorSpace;
    const earth = new T.Mesh(new T.SphereGeometry(1, 72, 48), new T.MeshStandardMaterial({ map, roughness: .85, metalness: 0 }));
    earth.rotation.y = -Math.PI / 2; world.add(earth);
    world.add(new T.Mesh(new T.SphereGeometry(1.018, 72, 48), new T.MeshBasicMaterial({ color: sky, transparent: true, opacity: .13, side: T.BackSide, depthWrite: false })));
    const addSprite = (texture: T.Texture, position: T.Vector3, width: number, height: number, identity: { userIndex?: number; siteIndex?: number }) => {
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
      sprite.position.copy(position); sprite.scale.set(width, height, 1); world.add(sprite);
      markers.push({ sprite, position, ...identity }); return sprite;
    };
    globeUsers.forEach((user, index) => {
      const card = document.createElement("canvas"); card.width = 384; card.height = 320;
      const c = card.getContext("2d"); if (!c) return;
      const photo = portraits.image as HTMLImageElement;
      c.save(); c.beginPath(); c.arc(126, 122, 92, 0, Math.PI * 2); c.clip();
      c.drawImage(photo, index % 3 * photo.width / 3, Math.floor(index / 3) * photo.height / 2, photo.width / 3, photo.height / 2, 34, 30, 184, 184); c.restore();
      c.strokeStyle = gold.getStyle(); c.lineWidth = 8; c.beginPath(); c.arc(126, 122, 94, 0, Math.PI * 2); c.stroke();
      c.fillStyle = ink.getStyle(); c.beginPath(); c.roundRect(225, 50, 104, 180, 14); c.fill();
      c.fillStyle = light.getStyle(); c.fillRect(233, 66, 88, 145); c.drawImage(logo.image, 240, 99, 74, 74);
      c.fillStyle = gold.getStyle(); c.fillRect(246, 190, 61, 8);
      c.fillStyle = light.getStyle(); c.font = "600 29px Manrope, sans-serif"; c.textAlign = "center"; c.fillText(user.country, 180, 277);
      const marker = point(user.lat + 4, user.lon, 1.16);
      addSprite(drawTexture(card), marker, .35, .292, { userIndex: index });
      const tether = new T.BufferGeometry().setFromPoints([point(user.lat, user.lon, 1.015), marker]);
      const tetherLine = new T.Line(tether, new T.LineBasicMaterial({ color: gold, transparent: true, opacity: .55 }));
      world.add(tetherLine); tethers.push(tetherLine);
    });
    // Small distant project markers intentionally use canvas art rather than heavy architectural models.
    globeSites.forEach((site, index) => {
      const house = document.createElement("canvas"); house.width = 256; house.height = 256;
      const c = house.getContext("2d"); if (!c) return;
      const polygon = (points: [number, number][], fill: T.Color) => {
        c.fillStyle = fill.getStyle(); c.beginPath();
        points.forEach(([x, y], i) => i === 0 ? c.moveTo(x, y) : c.lineTo(x, y));
        c.closePath(); c.fill();
      };
      polygon([[21, 197], [117, 238], [226, 180], [124, 141]], gold);
      polygon([[47, 91], [129, 125], [129, 220], [47, 184]], light);
      polygon([[129, 125], [214, 82], [214, 178], [129, 220]], land);
      polygon([[41, 90], [124, 46], [220, 81], [129, 130]], gold);
      polygon([[107, 161], [123, 167], [123, 217], [107, 210]], ink);
      [[60, 123], [86, 134]].forEach(([x, y]) => {
        if (x === undefined || y === undefined) return;
        polygon([[x, y], [x + 16, y + 6], [x + 16, y + 26], [x, y + 20]], ink);
      });
      [[143, 142], [177, 125]].forEach(([x, y]) => {
        if (x === undefined || y === undefined) return;
        polygon([[x, y], [x + 18, y - 9], [x + 18, y + 13], [x, y + 22]], ink);
      });
      c.strokeStyle = gold.getStyle(); c.lineWidth = 5; c.beginPath(); c.moveTo(220, 198); c.lineTo(220, 21); c.lineTo(134, 21); c.moveTo(220, 21); c.lineTo(174, 57); c.lineTo(220, 57); c.stroke();
      c.fillStyle = light.getStyle(); c.font = "600 21px Manrope, sans-serif"; c.textAlign = "center"; c.fillText(site.country, 128, 253);
      addSprite(drawTexture(house), point(site.lat, site.lon, 1.1), .24, .24, { siteIndex: index });
    });
    globeUsers.forEach((user, index) => {
      const site = globeSites[index % globeSites.length]; if (!site) return;
      const siteIndex = index % globeSites.length;
      const from = geographicPoint(user.lat, user.lon), to = geographicPoint(site.lat, site.lon);
      const points = Array.from({ length: 65 }, (_, i) => {
        const t = i / 64;
        const p = arcDirection(from, to, t);
        return new T.Vector3(p.x, p.y, p.z).multiplyScalar(1.025 + Math.sin(t * Math.PI) * .09 + t * .075);
      });
      const curve = new T.CatmullRomCurve3(points);
      const connection = new T.Mesh(new T.TubeGeometry(curve, 64, .0035, 5, false), new T.MeshBasicMaterial({ color: gold, transparent: true }));
      world.add(connection);
      const mesh = new T.Mesh(new T.SphereGeometry(.014, 8, 8), new T.MeshBasicMaterial({ color: light }));
      world.add(mesh); connections.push({ mesh: connection, pulse: mesh, curve });
    });
    const start = performance.now();
    const frozenTime = import.meta.env.DEV ? new URLSearchParams(location.search).get("globeTime") : null;
    const timeOverride = frozenTime !== null && Number.isFinite(Number(frozenTime)) ? Math.max(0, Number(frozenTime)) : undefined;
    const vector = new T.Vector3(), view = new T.Vector3(), focus = new T.Vector3();
    const render = () => {
      if (disposed) return;
      const seconds = timeOverride ?? (performance.now() - start) / 1000;
      const journey = journeyFrame(seconds, reduced.matches);
      focus.set(journey.focus.x, journey.focus.y, journey.focus.z);
      camera.position.copy(focus).multiplyScalar(journey.distance);
      camera.lookAt(focus.clone().multiplyScalar(journey.lookRadius));
      key.position.copy(camera.position).add(new T.Vector3(-2, 3, 1));
      rim.position.copy(camera.position).multiplyScalar(-1).add(new T.Vector3(2, 1, 0));
      world.updateMatrixWorld(true);
      markers.forEach(({ sprite, position, userIndex, siteIndex }) => {
        vector.copy(position).applyMatrix4(world.matrixWorld);
        const opacity = userIndex !== undefined ? (userIndex === journey.index ? journey.marker : 0) : (siteIndex === journey.siteIndex ? journey.house : 0);
        sprite.material.opacity = opacity;
        view.copy(camera.position).sub(vector);
        sprite.visible = opacity > 0 && vector.dot(view) > 0;
      });
      tethers.forEach((line, index) => {
        line.visible = index === journey.index && journey.marker > 0;
        (line.material as T.LineBasicMaterial).opacity = .4 * journey.marker;
      });
      connections.forEach(({ mesh, pulse, curve }, index) => {
        const active = index === journey.index && journey.line > 0;
        mesh.visible = active;
        (mesh.material as T.MeshBasicMaterial).opacity = journey.line;
        const first = Math.floor(journey.lineStart * 64), last = Math.floor(journey.progress * 64);
        mesh.geometry.setDrawRange(first * 30, Math.max(0, last - first) * 30);
        pulse.visible = active && journey.progress > 0 && journey.progress < 1;
        pulse.position.copy(curve.getPoint(journey.progress));
      });
      renderer.render(scene, camera);
      element.dataset["rotation"] = String(Math.atan2(focus.x, focus.z));
      if (import.meta.env.DEV) {
        element.dataset["journey"] = globeUsers[journey.index]?.country ?? "";
        element.dataset["progress"] = String(journey.progress);
        element.dataset["visibleMarkers"] = String(markers.filter(marker => marker.sprite.visible).length);
        element.dataset["visibleLines"] = String(connections.filter(connection => connection.mesh.visible).length);
        element.dataset["cameraDistance"] = String(journey.distance);
      }
      frame = requestAnimationFrame(render);
    };
    render(); element.dataset["sceneReady"] = "true"; onReady();
  }).catch(() => { if (!disposed) element.dataset["sceneError"] = "true"; });
  return () => {
    disposed = true; cancelAnimationFrame(frame); observer.disconnect();
    scene.traverse(object => {
      if (object instanceof T.Mesh || object instanceof T.Line || object instanceof T.Sprite) {
        if ("geometry" in object) object.geometry.dispose();
        const mats = Array.isArray(object.material) ? object.material : [object.material]; mats.forEach(mat => mat.dispose());
      }
    });
    textures.forEach(texture => texture.dispose()); renderer.dispose(); renderer.domElement.remove();
    delete element.dataset["sceneReady"];
  };
}