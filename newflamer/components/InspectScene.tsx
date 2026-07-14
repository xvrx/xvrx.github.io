"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

/*
 * The field agent: a free rigged character (Soldier.glb from the three.js
 * examples, © Mixamo/Adobe, free to use) wearing a Verlet-simulated cloth
 * cape that reacts to a gusting wind field. Drag to inspect — the camera
 * orbits on x/y but is clamped to the positive-z hemisphere, so the wheel
 * stays free for the scroll-to-blog handoff.
 */

const INK = 0x16161e;
const SEG_X = 12;
const SEG_Y = 16;
const CLOTH_W = 0.92;
const CLOTH_H = 1.18;

export default function InspectScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "live">("loading");
  const [wind, setWind] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let disposed = false;
    let raf = 0;

    /* ——— renderer / scene / camera ——— */
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(INK);
    scene.fog = new THREE.Fog(INK, 7, 16);

    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      60
    );
    camera.position.set(2.1, 1.75, 3.6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.02, 0);
    controls.enableDamping = true;
    controls.dampingFactor = 0.04; /* long, silky settle after a drag */
    controls.rotateSpeed = 0.75;
    controls.enablePan = false;
    controls.enableZoom = false; /* wheel is reserved for the blog handoff */
    controls.minPolarAngle = 0.25;
    controls.maxPolarAngle = 1.52;
    controls.minAzimuthAngle = -1.35; /* keep the camera on +z */
    controls.maxAzimuthAngle = 1.35;

    /* ——— lights ——— */
    scene.add(new THREE.HemisphereLight(0x7aa2f7, 0x14151d, 0.85));

    const key = new THREE.DirectionalLight(0xfff4e0, 2.4);
    key.position.set(3, 5, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 1;
    key.shadow.camera.far = 15;
    scene.add(key);

    const rim = new THREE.PointLight(0xbb9af7, 6, 12);
    rim.position.set(-2.2, 2.4, -2.4);
    scene.add(rim);

    /* ——— stage ——— */
    const grid = new THREE.GridHelper(16, 32, 0x3a3e5c, 0x232538);
    scene.add(grid);

    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(30, 30),
      new THREE.ShadowMaterial({ opacity: 0.35 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    /* ——— the cloth (cape) — classic Verlet integration ——— */
    const cols = SEG_X + 1;
    const rows = SEG_Y + 1;
    const count = cols * rows;
    const pos = new Float32Array(count * 3);
    const prev = new Float32Array(count * 3);
    const restX = CLOTH_W / SEG_X;
    const restY = CLOTH_H / SEG_Y;
    const shoulderY = 1.44;
    const backZ = -0.16;

    const idx = (u: number, v: number) => v * cols + u;

    for (let v = 0; v < rows; v++) {
      for (let u = 0; u < cols; u++) {
        const i = idx(u, v) * 3;
        pos[i] = (u / SEG_X - 0.5) * CLOTH_W;
        pos[i + 1] = shoulderY - (v / SEG_Y) * CLOTH_H;
        pos[i + 2] = backZ - v * 0.006;
        prev[i] = pos[i];
        prev[i + 1] = pos[i + 1];
        prev[i + 2] = pos[i + 2];
      }
    }

    /* structural constraints: right + down neighbours */
    const constraints: [number, number, number][] = [];
    for (let v = 0; v < rows; v++) {
      for (let u = 0; u < cols; u++) {
        if (u < SEG_X) constraints.push([idx(u, v), idx(u + 1, v), restX]);
        if (v < SEG_Y) constraints.push([idx(u, v), idx(u, v + 1), restY]);
      }
    }

    const clothGeo = new THREE.PlaneGeometry(CLOTH_W, CLOTH_H, SEG_X, SEG_Y);
    const clothMat = new THREE.MeshStandardMaterial({
      color: 0xc9414e,
      roughness: 0.85,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });
    const cloth = new THREE.Mesh(clothGeo, clothMat);
    cloth.castShadow = true;
    scene.add(cloth);

    let windStrength = 0;

    function stepCloth(dt: number, t: number) {
      const dt2 = dt * dt;
      windStrength = 2.4 + Math.sin(t * 0.37) * 1.5 + Math.sin(t * 1.13) * 0.6;

      for (let v = 0; v < rows; v++) {
        for (let u = 0; u < cols; u++) {
          const i = idx(u, v) * 3;
          if (v === 0) continue; /* pinned at the shoulders */

          const y = pos[i + 1];
          const gust = 0.65 + 0.35 * Math.sin(t * 1.4 + y * 2.4 + u * 0.5);
          const fx = Math.sin(t * 0.8 + y * 3.1) * windStrength * 0.5;
          const fy = -3.2;
          const fz = -windStrength * gust;

          for (let a = 0; a < 3; a++) {
            const p = pos[i + a];
            const force = a === 0 ? fx : a === 1 ? fy : fz;
            const next = p + (p - prev[i + a]) * 0.97 + force * dt2;
            prev[i + a] = p;
            pos[i + a] = next;
          }
        }
      }

      for (let k = 0; k < 3; k++) {
        for (const [a, b, rest] of constraints) {
          const i = a * 3;
          const j = b * 3;
          const dx = pos[j] - pos[i];
          const dy = pos[j + 1] - pos[i + 1];
          const dz = pos[j + 2] - pos[i + 2];
          const dist = Math.sqrt(dx * dx + dy * dy + dz * dz) || 1e-6;
          const diff = (dist - rest) / dist;
          const aPinned = a < cols;
          const bPinned = b < cols;
          const wA = aPinned ? 0 : bPinned ? 1 : 0.5;
          const wB = bPinned ? 0 : aPinned ? 1 : 0.5;
          pos[i] += dx * diff * wA;
          pos[i + 1] += dy * diff * wA;
          pos[i + 2] += dz * diff * wA;
          pos[j] -= dx * diff * wB;
          pos[j + 1] -= dy * diff * wB;
          pos[j + 2] -= dz * diff * wB;
        }
      }

      clothGeo.attributes.position.array.set(pos);
      clothGeo.attributes.position.needsUpdate = true;
      clothGeo.computeVertexNormals();
    }

    /* ——— the person ——— */
    let mixer: THREE.AnimationMixer | undefined;

    function fallbackFigure() {
      /* stylised mannequin, in case the GLB ever goes missing */
      const mat = new THREE.MeshStandardMaterial({
        color: 0x2e3454,
        roughness: 0.6,
      });
      const g = new THREE.Group();
      const torso = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.19, 0.5, 8, 16),
        mat
      );
      torso.position.y = 1.05;
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.13, 24, 16), mat);
      head.position.y = 1.58;
      const legs = new THREE.Mesh(
        new THREE.CapsuleGeometry(0.15, 0.55, 8, 16),
        mat
      );
      legs.position.y = 0.45;
      g.add(torso, head, legs);
      g.traverse((o) => (o.castShadow = true));
      scene.add(g);
      setStatus("live");
    }

    new GLTFLoader().load(
      "/models/soldier.glb",
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;
        model.rotation.y = Math.PI; /* face the camera side (+z) */
        model.traverse((o) => {
          o.castShadow = true;
        });
        /* stand on the grid */
        const box = new THREE.Box3().setFromObject(model);
        model.position.y -= box.min.y;
        scene.add(model);

        const idle =
          gltf.animations.find((c) => /idle/i.test(c.name)) ??
          gltf.animations[0];
        if (idle) {
          mixer = new THREE.AnimationMixer(model);
          mixer.clipAction(idle).play();
        }
        setStatus("live");
      },
      undefined,
      (err) => {
        console.error("[inspect-scene] model failed, using mannequin", err);
        if (!disposed) fallbackFigure();
      }
    );

    /* ——— loop ——— */
    const clock = new THREE.Clock();
    let simTime = 0;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const tick = () => {
      if (disposed) return;
      raf = requestAnimationFrame(tick);
      const dt = Math.min(clock.getDelta(), 0.05);
      if (!reduceMotion) {
        mixer?.update(dt);
        /* fixed-step the cloth for stability */
        let steps = Math.max(1, Math.round(dt / (1 / 90)));
        steps = Math.min(steps, 5);
        for (let s = 0; s < steps; s++) {
          simTime += dt / steps;
          stepCloth(dt / steps, simTime);
        }
      }
      controls.update();
      renderer.render(scene, camera);
    };
    tick();

    const windTimer = setInterval(
      () => setWind(Math.abs(windStrength)),
      250
    );

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearInterval(windTimer);
      window.removeEventListener("resize", onResize);
      controls.dispose();
      renderer.dispose();
      clothGeo.dispose();
      clothMat.dispose();
      mount.replaceChildren();
    };
  }, []);

  return (
    <div className="scene">
      <div ref={mountRef} className="scene-map" />

      {status === "loading" && (
        <div className="radar" aria-hidden="true">
          <div className="radar-rings" />
          <div className="radar-sweep" />
          <div className="radar-grid" />
        </div>
      )}

      <div className="reticle" aria-hidden="true">
        <span className="reticle-bracket tl" />
        <span className="reticle-bracket tr" />
        <span className="reticle-bracket bl" />
        <span className="reticle-bracket br" />
        <span className="reticle-label">
          {status === "live"
            ? "SUBJECT LOCKED · DRAG TO INSPECT"
            : "ACQUIRING SUBJECT…"}
        </span>
      </div>

      <div className="telemetry" aria-hidden="true">
        <span>
          <em>LAT</em> 1.16077° N
        </span>
        <span>
          <em>LNG</em> 104.01085° E
        </span>
        <span>
          <em>WND</em>{" "}
          {status === "live" ? `${wind.toFixed(1)} m/s` : "———"}
        </span>
        <span>
          <em>MODE</em> DRAG·INSPECT
        </span>
      </div>

      <div className="scene-vignette" />
    </div>
  );
}
