import * as T from "three";
import earthAsset from "@/assets/globe-earth.jpg.asset.json";
import logoAsset from "@/assets/calixa-logo.jpg.asset.json";
import userHeadshots from "@/assets/globe-user-headshots.jpg";
import gulfAsiaHeadshots from "@/assets/globe-user-headshots-uae-china.jpg";
import { arcDirection, geographicPoint, journeyFrame, globeUsers, globeSites } from "./globe-motion";

export function mountGlobe(element: HTMLDivElement, onReady: () => void) {
  let disposed = false;
  let frame = 0;
  const styles = getComputedStyle(element);
  const color = (name: string) => new T.Color(styles.getPropertyValue(name).trim());
  const gold = color("--globe-gold"), light = color("--globe-light");
  const ink = color("--globe-ink"), land = color("--globe-land");
  const sun = color("--globe-sun"), sky = color("--globe-sky");
  const roofColor = color("--globe-roof"), concreteColor = color("--globe-concrete");
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
  const connections: { mesh: T.Mesh; pulse: T.Mesh; curve: T.CatmullRomCurve3; userIndex: number; siteIndex: number }[] = [];
  const markers: { sprite: T.Sprite; userIndex: number }[] = [];
  const constructionSites: {
    group: T.Group; foundation: T.Group; walls: T.Group; roof: T.Group; siteIndex: number;
    materials: (T.MeshStandardMaterial | T.SpriteMaterial)[];
  }[] = [];
  const tethers: T.Line[] = [];
  const loader = new T.TextureLoader();
  void Promise.all([loader.loadAsync(earthAsset.url), loader.loadAsync(logoAsset.url), loader.loadAsync(userHeadshots), loader.loadAsync(gulfAsiaHeadshots)]).then(([map, logo, portraits, gulfAsiaPortraits]) => {
    if (disposed) { map.dispose(); logo.dispose(); portraits.dispose(); gulfAsiaPortraits.dispose(); return; }
    textures.push(map, logo, portraits, gulfAsiaPortraits);
    map.colorSpace = T.SRGBColorSpace;
    const earth = new T.Mesh(new T.SphereGeometry(1, 72, 48), new T.MeshStandardMaterial({ map, roughness: .85, metalness: 0 }));
    earth.rotation.y = -Math.PI / 2; world.add(earth);
    world.add(new T.Mesh(new T.SphereGeometry(1.018, 72, 48), new T.MeshBasicMaterial({ color: sky, transparent: true, opacity: .13, side: T.BackSide, depthWrite: false })));
    const addSprite = (texture: T.Texture, position: T.Vector3, width: number, height: number, identity: { userIndex: number }) => {
      const sprite = new T.Sprite(new T.SpriteMaterial({ map: texture, transparent: true, depthTest: false, depthWrite: false, toneMapped: false }));
      sprite.position.copy(position); sprite.scale.set(width, height, 1); world.add(sprite);
      markers.push({ sprite, ...identity }); return sprite;
    };
    globeUsers.forEach((user, index) => {
      const card = document.createElement("canvas"); card.width = 384; card.height = 320;
      const c = card.getContext("2d"); if (!c) return;
      const additionalPhoto = gulfAsiaPortraits.image as HTMLImageElement;
      const photo = index < 6 ? portraits.image as HTMLImageElement : additionalPhoto;
      const sourceX = index < 6 ? index % 3 * photo.width / 3 : (index - 6) * photo.width / 2;
      const sourceY = index < 6 ? Math.floor(index / 3) * photo.height / 2 : 0;
      const sourceWidth = index < 6 ? photo.width / 3 : photo.width / 2;
      const sourceHeight = index < 6 ? photo.height / 2 : photo.height;
      c.save(); c.beginPath(); c.arc(126, 122, 92, 0, Math.PI * 2); c.clip();
      c.drawImage(photo, sourceX, sourceY, sourceWidth, sourceHeight, 34, 30, 184, 184); c.restore();
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
    // Lightweight architectural meshes give each small site a real foundation-to-roof build.
    globeSites.forEach((site, siteIndex) => {
      const group = new T.Group(), foundation = new T.Group(), walls = new T.Group(), roof = new T.Group();
      const materials: (T.MeshStandardMaterial | T.SpriteMaterial)[] = [];
      const material = (color: T.Color, roughness = .8) => {
        const value = new T.MeshStandardMaterial({ color, roughness, transparent: true });
        materials.push(value); return value;
      };
      const concrete = material(concreteColor), plaster = material(light), roofTiles = material(roofColor, .65);
      const dark = material(ink), glass = material(sky, .25);
      const box = (parent: T.Group, size: [number, number, number], position: [number, number, number], surface: T.MeshStandardMaterial) => {
        const mesh = new T.Mesh(new T.BoxGeometry(...size), surface);
        mesh.position.set(...position); parent.add(mesh); return mesh;
      };
      box(foundation, [.25, .025, .19], [0, 0, 0], concrete);
      box(foundation, [.22, .012, .16], [0, .018, 0], plaster);
      box(walls, [.2, .11, .14], [0, .055, 0], plaster);
      box(walls, [.035, .065, .006], [0, .034, .073], dark);
      [-0.06, 0.06].forEach(x => box(walls, [.04, .035, .007], [x, .069, .074], glass));
      [-0.035, 0.035].forEach(z => box(walls, [.007, .035, .035], [.103, .069, z], glass));
      walls.position.y = .024;
      const roofMesh = new T.Mesh(new T.ConeGeometry(.155, .08, 4), roofTiles);
      roofMesh.rotation.y = Math.PI / 4; roofMesh.scale.z = .75; roofMesh.position.y = .04; roof.add(roofMesh);
      box(roof, [.025, .06, .025], [.05, .065, 0], dark);
      roof.position.y = .134;
      const label = document.createElement("canvas"); label.width = 256; label.height = 64;
      const c = label.getContext("2d");
      if (c) {
        c.fillStyle = ink.getStyle(); c.beginPath(); c.roundRect(3, 3, 250, 58, 14); c.fill();
        c.fillStyle = light.getStyle(); c.font = "600 25px Manrope, sans-serif"; c.textAlign = "center"; c.fillText(site.country, 128, 41);
        const labelMaterial = new T.SpriteMaterial({ map: drawTexture(label), transparent: true, depthTest: false, depthWrite: false, toneMapped: false });
        const labelSprite = new T.Sprite(labelMaterial); labelSprite.position.set(0, .06, -.17); labelSprite.scale.set(.16, .04, 1);
        materials.push(labelMaterial); group.add(labelSprite);
      }
      group.add(foundation, walls, roof);
      const position = point(site.lat, site.lon, 1.055);
      group.position.copy(position); group.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), position.clone().normalize());
      group.scale.setScalar(.58); group.visible = false; world.add(group);
      constructionSites.push({ group, foundation, walls, roof, siteIndex, materials });
    });
    globeUsers.forEach((user, userIndex) => {
      globeSites.forEach((site, siteIndex) => {
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
        world.add(mesh); connections.push({ mesh: connection, pulse: mesh, curve, userIndex, siteIndex });
      });
    });
    const start = performance.now();
    const frozenTime = import.meta.env.DEV ? new URLSearchParams(location.search).get("globeTime") : null;
    const timeOverride = frozenTime !== null && Number.isFinite(Number(frozenTime)) ? Math.max(0, Number(frozenTime)) : undefined;
    const focus = new T.Vector3(), side = new T.Vector3(), worldUp = new T.Vector3(0, 1, 0);
    const render = () => {
      if (disposed) return;
      const seconds = timeOverride ?? (performance.now() - start) / 1000;
      const journey = journeyFrame(seconds, reduced.matches);
      focus.set(journey.focus.x, journey.focus.y, journey.focus.z);
      side.crossVectors(focus, worldUp).normalize();
      camera.position.copy(focus).multiplyScalar(journey.distance).addScaledVector(side, .75 * journey.house);
      camera.lookAt(focus.clone().multiplyScalar(journey.lookRadius));
      key.position.copy(camera.position).add(new T.Vector3(-2, 3, 1));
      rim.position.copy(camera.position).multiplyScalar(-1).add(new T.Vector3(2, 1, 0));
      markers.forEach(({ sprite, userIndex }) => {
        const opacity = userIndex === journey.index ? journey.marker : 0;
        sprite.material.opacity = opacity;
        sprite.visible = opacity > 0;
      });
      constructionSites.forEach(({ group, foundation, walls, roof, siteIndex, materials }) => {
        const active = siteIndex === journey.siteIndex && journey.house > 0;
        group.visible = active;
        if (!active) return;
        const foundationProgress = Math.min(1, journey.construction / .22);
        const wallProgress = T.MathUtils.smoothstep(journey.construction, .15, .78);
        const roofProgress = T.MathUtils.smoothstep(journey.construction, .72, 1);
        foundation.scale.set(foundationProgress, 1, foundationProgress);
        walls.visible = wallProgress > .001; walls.scale.y = Math.max(.001, wallProgress);
        roof.visible = roofProgress > .001; roof.scale.setScalar(Math.max(.001, roofProgress));
        roof.position.y = .134 + .1 * (1 - roofProgress);
        materials.forEach(material => { material.opacity = journey.house; });
      });
      tethers.forEach((line, index) => {
        line.visible = index === journey.index && journey.marker > 0;
        (line.material as T.LineBasicMaterial).opacity = .4 * journey.marker;
      });
      connections.forEach(({ mesh, pulse, curve, userIndex, siteIndex }) => {
        const active = userIndex === journey.index && siteIndex === journey.siteIndex && journey.line > 0;
        mesh.visible = active;
        (mesh.material as T.MeshBasicMaterial).opacity = journey.line;
        const first = 0, last = Math.floor(journey.progress * 64);
        mesh.geometry.setDrawRange(first * 30, Math.max(0, last - first) * 30);
        pulse.visible = active && journey.progress > 0 && journey.progress < 1;
        pulse.position.copy(curve.getPoint(journey.progress));
      });
      renderer.render(scene, camera);
      element.dataset["rotation"] = String(Math.atan2(focus.x, focus.z));
      if (import.meta.env.DEV) {
        element.dataset["journey"] = globeUsers[journey.index]?.country ?? "";
        element.dataset["progress"] = String(journey.progress);
        element.dataset["visibleMarkers"] = String(markers.filter(marker => marker.sprite.visible).length + constructionSites.filter(site => site.group.visible).length);
        element.dataset["visibleLines"] = String(connections.filter(connection => connection.mesh.visible).length);
        element.dataset["visibleHouses"] = String(constructionSites.filter(site => site.group.visible).length);
        element.dataset["houseProgress"] = String(journey.construction);
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