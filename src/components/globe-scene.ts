import * as T from "three";
import earthAsset from "@/assets/globe-earth.jpg.asset.json";
import logoAsset from "@/assets/calixa-logo.jpg.asset.json";
import userHeadshots from "@/assets/globe-user-headshots.jpg";
import { globeRotation, globeUsers, globeSites } from "./globe-motion";

export function mountGlobe(element: HTMLDivElement, onReady: () => void) {
  let disposed = false;
  let frame = 0;
  const styles = getComputedStyle(element);
  const color = (name: string) => new T.Color(styles.getPropertyValue(name).trim());
  const gold = color("--globe-gold"), light = color("--globe-light");
  const ink = color("--globe-ink"), land = color("--globe-land"), ocean = color("--globe-ocean");
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.domElement.setAttribute("aria-hidden", "true");
  element.appendChild(renderer.domElement);
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(38, 1, 0.1, 30);
  camera.position.set(0, .15, 4.1);
  camera.lookAt(0, 0, 0);
  scene.add(new T.HemisphereLight(light, gold, 2));
  const key = new T.DirectionalLight(light, 3);
  key.position.set(-3, 4, 5); scene.add(key);
  const rim = new T.DirectionalLight(gold, 2);
  rim.position.set(4, 0, -3); scene.add(rim);
  const world = new T.Group(); scene.add(world);
  const textures: T.Texture[] = [];
  const point = (lat: number, lon: number, radius = 1) => {
    const phi = lat * Math.PI / 180, theta = lon * Math.PI / 180;
    return new T.Vector3(radius * Math.cos(phi) * Math.sin(theta), radius * Math.sin(phi), radius * Math.cos(phi) * Math.cos(theta));
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
  const pulses: { mesh: T.Mesh; curve: T.CatmullRomCurve3 }[] = [];
  const markers: { sprite: T.Sprite; position: T.Vector3 }[] = [];
  const loader = new T.TextureLoader();
  void Promise.all([loader.loadAsync(earthAsset.url), loader.loadAsync(logoAsset.url), loader.loadAsync(userHeadshots)]).then(([map, logo, portraits]) => {
    if (disposed) { map.dispose(); logo.dispose(); portraits.dispose(); return; }
    textures.push(map, logo, portraits);
    const source = map.image as HTMLImageElement;
    const canvas = document.createElement("canvas"); canvas.width = 2048; canvas.height = 1024;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Globe texture unavailable");
    ctx.drawImage(source, 0, 0, canvas.width, canvas.height);
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const oceanRGB = ocean.clone().convertLinearToSRGB(), landRGB = land.clone().convertLinearToSRGB();
    for (let i = 0; i < pixels.data.length; i += 4) {
      const r = pixels.data[i] ?? 0, g = pixels.data[i + 1] ?? 0, b = pixels.data[i + 2] ?? 0;
      const isOcean = b > r * 1.18 && b > g * 1.04;
      const c = isOcean ? oceanRGB : landRGB;
      const shade = isOcean ? .65 + b / 550 : .55 + (r + g) / 700;
      pixels.data[i] = c.r * 255 * shade;
      pixels.data[i + 1] = c.g * 255 * shade;
      pixels.data[i + 2] = c.b * 255 * shade;
    }
    ctx.putImageData(pixels, 0, 0);
    const earth = new T.Mesh(new T.SphereGeometry(1, 72, 48), new T.MeshStandardMaterial({ map: drawTexture(canvas), roughness: .38, metalness: .38, emissive: gold, emissiveIntensity: .1 }));
    earth.rotation.y = -Math.PI / 2; world.add(earth);
    const lineMat = new T.LineBasicMaterial({ color: gold, transparent: true, opacity: .23 });
    for (let lat = -60; lat <= 60; lat += 30) {
      const points = Array.from({ length: 129 }, (_, i) => point(lat, i / 128 * 360, 1.006));
      world.add(new T.Line(new T.BufferGeometry().setFromPoints(points), lineMat));
    }
    for (let lon = 0; lon < 360; lon += 30) {
      const points = Array.from({ length: 65 }, (_, i) => point(-90 + i / 64 * 180, lon, 1.006));
      world.add(new T.Line(new T.BufferGeometry().setFromPoints(points), lineMat));
    }
    const addSprite = (texture: T.Texture, position: T.Vector3, width: number, height: number) => {
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, depthWrite: false, toneMapped: false }));
      sprite.position.copy(position); sprite.scale.set(width, height, 1); world.add(sprite);
      markers.push({ sprite, position }); return sprite;
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
      const marker = point(user.markerLat, user.markerLon, 1.22);
      addSprite(drawTexture(card), marker, .35, .292);
      const tether = new T.BufferGeometry().setFromPoints([point(user.lat, user.lon, 1.015), marker]);
      world.add(new T.Line(tether, new T.LineBasicMaterial({ color: gold, transparent: true, opacity: .55 })));
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
      const lonOffset = index === 0 ? -6 : index === 1 ? 6 : 0;
      addSprite(drawTexture(house), point(site.lat, site.lon + lonOffset, 1.1), .21, .21);
    });
    globeUsers.forEach((user, index) => {
      const site = globeSites[index % globeSites.length]; if (!site) return;
      const from = point(user.lat, user.lon), to = point(site.lat, site.lon);
      const dot = Math.max(-1, Math.min(1, from.dot(to))), angle = Math.acos(dot);
      const points = Array.from({ length: 65 }, (_, i) => {
        const t = i / 64;
        const direction = angle < .001 ? from.clone() : from.clone().multiplyScalar(Math.sin((1 - t) * angle)).add(to.clone().multiplyScalar(Math.sin(t * angle))).divideScalar(Math.sin(angle));
        return direction.normalize().multiplyScalar(1.018 + Math.sin(t * Math.PI) * .25);
      });
      const curve = new T.CatmullRomCurve3(points);
      world.add(new T.Mesh(new T.TubeGeometry(curve, 64, .004, 5, false), new T.MeshBasicMaterial({ color: gold })));
      const mesh = new T.Mesh(new T.SphereGeometry(.014, 8, 8), new T.MeshBasicMaterial({ color: light }));
      world.add(mesh); pulses.push({ mesh, curve });
    });
    const start = performance.now();
    const vector = new T.Vector3();
    const render = () => {
      if (disposed) return;
      const seconds = (performance.now() - start) / 1000;
      world.rotation.y = globeRotation(seconds, reduced.matches);
      world.updateMatrixWorld(true);
      markers.forEach(({ sprite, position }) => {
        vector.copy(position).applyMatrix4(world.matrixWorld);
        sprite.visible = vector.dot(camera.position) > .52;
      });
      pulses.forEach(({ mesh, curve }, i) => mesh.position.copy(curve.getPoint(reduced.matches ? .5 : (seconds * .1 + i * .16) % 1)));
      renderer.render(scene, camera);
      element.dataset["rotation"] = String(world.rotation.y);
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