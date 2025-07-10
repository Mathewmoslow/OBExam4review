// @ts-nocheck
'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const HeroScene = () => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ 
      alpha: true, 
      antialias: true 
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // DNA Helix Geometry
    const createDNAHelix = () => {
      const group = new THREE.Group();
      const radius = 2;
      const height = 20;
      const turns = 4;
      const pointsPerTurn = 30;
      const totalPoints = turns * pointsPerTurn;

      // Create two helixes
      for (let strand = 0; strand < 2; strand++) {
        const points = [];
        const offset = strand * Math.PI;

        for (let i = 0; i < totalPoints; i++) {
          const angle = (i / pointsPerTurn) * Math.PI * 2;
          const y = (i / totalPoints) * height - height / 2;
          const x = Math.cos(angle + offset) * radius;
          const z = Math.sin(angle + offset) * radius;
          points.push(new THREE.Vector3(x, y, z));
        }

        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeometry = new THREE.TubeGeometry(curve, 200, 0.1, 8, false);
        const material = new THREE.MeshPhongMaterial({
          color: strand === 0 ? 0xff006e : 0x8338ec,
          emissive: strand === 0 ? 0xff006e : 0x8338ec,
          emissiveIntensity: 0.2,
          shininess: 100,
        });
        const tube = new THREE.Mesh(tubeGeometry, material);
        group.add(tube);

        // Add connecting bars
        if (strand === 0) {
          for (let i = 0; i < totalPoints; i += 5) {
            const angle1 = (i / pointsPerTurn) * Math.PI * 2;
            const y1 = (i / totalPoints) * height - height / 2;
            const x1 = Math.cos(angle1) * radius;
            const z1 = Math.sin(angle1) * radius;
            const x2 = Math.cos(angle1 + Math.PI) * radius;
            const z2 = Math.sin(angle1 + Math.PI) * radius;

            const barGeometry = new THREE.CylinderGeometry(0.05, 0.05, radius * 2);
            const barMaterial = new THREE.MeshPhongMaterial({
              color: 0x3a86ff,
              emissive: 0x3a86ff,
              emissiveIntensity: 0.1,
            });
            const bar = new THREE.Mesh(barGeometry, barMaterial);
            bar.position.set((x1 + x2) / 2, y1, (z1 + z2) / 2);
            bar.rotation.z = Math.atan2(z2 - z1, x2 - x1);
            bar.rotation.y = Math.PI / 2;
            group.add(bar);
          }
        }
      }

      return group;
    };

    const dnaHelix = createDNAHelix();
    scene.add(dnaHelix);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i++) {
      posArray[i] = (Math.random() - 0.5) * 50;
    }

    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(posArray, 3)
    );

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.05,
      color: 0x06ffa5,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
    });

    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0xff006e, 1);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x8338ec, 1);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    // Camera position
    camera.position.z = 15;
    camera.position.y = 0;

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);

      // Rotate DNA helix
      dnaHelix.rotation.y += 0.005;

      // Animate particles
      particlesMesh.rotation.y += 0.001;
      particlesMesh.rotation.x += 0.0005;

      // Floating animation
      dnaHelix.position.y = Math.sin(Date.now() * 0.001) * 0.5;

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
      }}
    />
  );
};

export default HeroScene;