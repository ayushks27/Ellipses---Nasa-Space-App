"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current; // ESLint-safe ref copy

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();

    // Texture loader
    const textureLoader = new THREE.TextureLoader();

    const starTexture = textureLoader.load("./image/stars.jpg");
    const sunTexture = textureLoader.load("/image/sun.jpg");
    const mercuryTexture = textureLoader.load("/image/mercury.jpg");
    const venusTexture = textureLoader.load("/image/venus.jpg");
    const earthTexture = textureLoader.load("/image/earth.jpg");
    const marsTexture = textureLoader.load("/image/mars.jpg");
    const jupiterTexture = textureLoader.load("/image/jupiter.jpg");
    const saturnTexture = textureLoader.load("/image/saturn.jpg");
    const uranusTexture = textureLoader.load("/image/uranus.jpg");
    const neptuneTexture = textureLoader.load("/image/neptune.jpg");
    const plutoTexture = textureLoader.load("/image/pluto.jpg");
    const saturnRingTexture = textureLoader.load("/image/saturn_ring.png");
    const uranusRingTexture = textureLoader.load("/image/uranus_ring.png");

    // Background
    const cubeTextureLoader = new THREE.CubeTextureLoader();
    const cubeTexture = cubeTextureLoader.load([
      "/image/stars.jpg",
      "/image/stars.jpg",
      "/image/stars.jpg",
      "/image/stars.jpg",
      "/image/stars.jpg",
      "/image/stars.jpg",
    ]);
    scene.background = cubeTexture;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(-50, 90, 150);

    // Controls
    const orbit = new OrbitControls(camera, renderer.domElement);

    // Sun
    const sunGeo = new THREE.SphereGeometry(15, 50, 50);
    const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, color: 0xffcc55 });
    const sun = new THREE.Mesh(sunGeo, sunMaterial);
    scene.add(sun);

    // Lights
    const sunLight = new THREE.PointLight(0xffffff, 4, 4000);
    sunLight.position.set(0, 0, 0);
    scene.add(sunLight);
    const ambientLight = new THREE.AmbientLight(0xffffff, 2);
    scene.add(ambientLight);
    
    // Helper: create planet orbits
    const path_of_planets = [];
    const createLineLoopWithMesh = (radius, color, width) => {
      const material = new THREE.LineBasicMaterial({ color, linewidth: width });
      const geometry = new THREE.BufferGeometry();
      const points = [];
      const segments = 100;
      for (let i = 0; i <= segments; i++) {
        const angle = (i / segments) * Math.PI * 2;
        points.push(radius * Math.cos(angle), 0, radius * Math.sin(angle));
      }
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
      const lineLoop = new THREE.LineLoop(geometry, material);
      scene.add(lineLoop);
      path_of_planets.push(lineLoop);
    };

    // Helper: generate planet
    const generatePlanet = (size, texture, distance, ring) => {
      const planetGeo = new THREE.SphereGeometry(size, 50, 50);
      const planetMat = new THREE.MeshStandardMaterial({ map: texture });
      const planet = new THREE.Mesh(planetGeo, planetMat);

      const planetObj = new THREE.Object3D();
      planet.position.set(distance, 0, 0);

      if (ring) {
        const ringGeo = new THREE.RingGeometry(ring.innerRadius, ring.outerRadius, 32);
        const ringMat = new THREE.MeshBasicMaterial({
          map: ring.ringmat,
          side: THREE.DoubleSide,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        planetObj.add(ringMesh);
        ringMesh.position.set(distance, 0, 0);
        ringMesh.rotation.x = -0.5 * Math.PI;
      }

      planetObj.add(planet);
      scene.add(planetObj);

      createLineLoopWithMesh(distance, 0xffffff, 3);
      return planetObj;
    };

    // Planets with rotation speeds
    const planets = [
      { obj: generatePlanet(3.2, mercuryTexture, 28), aroundSun: 0.004, self: 0.004 },
      { obj: generatePlanet(5.8, venusTexture, 44), aroundSun: 0.015, self: 0.002 },
      { obj: generatePlanet(6, earthTexture, 62), aroundSun: 0.01, self: 0.02 },
      { obj: generatePlanet(4, marsTexture, 78), aroundSun: 0.008, self: 0.018 },
      { obj: generatePlanet(12, jupiterTexture, 100), aroundSun: 0.002, self: 0.04 },
      {
        obj: generatePlanet(10, saturnTexture, 138, {
          innerRadius: 10,
          outerRadius: 20,
          ringmat: saturnRingTexture,
        }),
        aroundSun: 0.0009,
        self: 0.038,
      },
      {
        obj: generatePlanet(7, uranusTexture, 176, {
          innerRadius: 7,
          outerRadius: 12,
          ringmat: uranusRingTexture,
        }),
        aroundSun: 0.0004,
        self: 0.03,
      },
      { obj: generatePlanet(7, neptuneTexture, 200), aroundSun: 0.0001, self: 0.032 },
      { obj: generatePlanet(2.8, plutoTexture, 216), aroundSun: 0.0007, self: 0.008 },
    ];

    // Animate function
    const animate = () => {
      sun.rotateY(0.004);
      planets.forEach(({ obj, aroundSun, self }) => {
        obj.rotateY(aroundSun);
        const planetMesh = obj.children.find((c) => c.isMesh && c.geometry.type === "SphereGeometry");
        if (planetMesh) planetMesh.rotateY(self);// self-rotation of planet mesh
      });
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef}></div>;
}
