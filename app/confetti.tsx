"use client";

import { useEffect, useRef, useState } from "react";

import { checkHasPurchased } from "./utils";

const CONFETTI_COLORS = [
  "rgb(174,63,86)",
  "rgb(233,206,74)",
  "rgb(193,218,229)",
  "rgb(236,187,194)",
  "rgb(244,241,240)",
];

const FRAME_INTERVAL_MS = 250; // 4 fps for a stop-motion feel

type ShapeType = "strip" | "stub" | "trapezoid" | "triangle";

interface Particle {
  x: number;
  y: number;
  stepX: number;
  stepY: number;
  width: number;
  length: number;
  slantTop: number;
  slantBottom: number;
  shape: ShapeType;
  color: string;
  rotation: number;
  rotationStep: number;
  swayPhase: number;
}

function createParticle(width: number, height: number): Particle {
  const rand = Math.random();
  let shape: ShapeType;
  let pWidth: number;
  let pLength: number;

  // Weighted shape distribution with randomized cutout dimensions (in px)
  if (rand < 0.35) {
    // 35% long thin rectangular strips (8-12px wide, 24-42px long)
    shape = "strip";
    pWidth = 8 + Math.random() * 4;
    pLength = 24 + Math.random() * 18;
  } else if (rand < 0.65) {
    // 30% angled-cut ribbons (9-13px wide, 20-36px long)
    shape = "trapezoid";
    pWidth = 9 + Math.random() * 4;
    pLength = 20 + Math.random() * 16;
  } else if (rand < 0.85) {
    // 20% stubby rectangles (9-13px wide, 11-19px long)
    shape = "stub";
    pWidth = 9 + Math.random() * 4;
    pLength = 11 + Math.random() * 8;
  } else {
    // 15% triangles (13-18px base, 13-19px tall)
    shape = "triangle";
    pWidth = 13 + Math.random() * 5;
    pLength = 13 + Math.random() * 6;
  }

  // Randomize clockwise vs counter-clockwise spin
  const direction = Math.random() < 0.5 ? -1 : 1;

  return {
    x: Math.random() * width,
    // Start between 40% above the viewport and 15% down so initial frame has visible pieces
    y: -height * 0.4 + Math.random() * height * 0.55,
    stepX: (Math.random() - 0.5) * 22, // Base horizontal drift per frame
    stepY: 114 + Math.random() * 38, // Base vertical fall distance per frame
    width: pWidth,
    length: pLength,
    // Vertical offsets applied to top/bottom corners to create angled scissor cuts on trapezoids
    slantTop: (Math.random() - 0.5) * pWidth * 1.2,
    slantBottom: (Math.random() - 0.5) * pWidth * 1.2,
    shape,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    rotation: Math.random() * Math.PI * 2,
    rotationStep: direction * (0.35 + Math.random() * 0.55),
    swayPhase: Math.floor(Math.random() * 6), // 0-5 counter used to alternate left/right sway every 3 ticks
  };
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save();
  // Snap coordinates to whole pixels and rotate around the particle's center
  ctx.translate(Math.round(p.x), Math.round(p.y));
  ctx.rotate(p.rotation);
  ctx.fillStyle = p.color;

  // Half-dimensions for drawing centered around (0, 0)
  const hw = p.width / 2;
  const hl = p.length / 2;

  if (p.shape === "strip" || p.shape === "stub") {
    ctx.fillRect(-hw, -hl, p.width, p.length);
  } else if (p.shape === "trapezoid") {
    // 4-sided strip with slanted top and bottom edges
    ctx.beginPath();
    ctx.moveTo(-hw, -hl + p.slantTop);
    ctx.lineTo(hw, -hl - p.slantTop);
    ctx.lineTo(hw, hl + p.slantBottom);
    ctx.lineTo(-hw, hl - p.slantBottom);
    ctx.closePath();
    ctx.fill();
  } else {
    // Isosceles triangle centered at origin
    ctx.beginPath();
    ctx.moveTo(0, -hl);
    ctx.lineTo(hw, hl);
    ctx.lineTo(-hw, hl);
    ctx.closePath();
    ctx.fill();
  }

  ctx.restore();
}

export default function Confetti() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const hasPurchased = checkHasPurchased();
    const params = new URLSearchParams(window.location.search);
    const isSuccess = hasPurchased && params.get("success") === "true";
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (isSuccess && !prefersReducedMotion) {
      setActive(true);
    }
  }, []);

  useEffect(() => {
    if (!active) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }

    let animationFrameId: number;
    let lastStepTime: number;
    let width = window.innerWidth;
    let height = window.innerHeight;
    let particles: Particle[] = [];

    // Scale backing store for high-DPI screens while keeping drawing coordinates in CSS pixels
    const updateSize = () => {
      const dpr = window.devicePixelRatio || 1;
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawAll = () => {
      ctx.clearRect(0, 0, width, height);
      for (const p of particles) {
        // Only draw particles within the visible vertical bounds (plus padding for particle length)
        if (p.y < height + 50 && p.y > -60) {
          drawParticle(ctx, p);
        }
      }
    };

    const handleResize = () => {
      updateSize();
      drawAll();
    };

    const loop = (now: number) => {
      // Only advance particle positions once per stop-motion frame interval
      if (now - lastStepTime >= FRAME_INTERVAL_MS) {
        lastStepTime = now;

        let remaining = 0;

        for (const p of particles) {
          // Flip sway direction every 3 frames
          p.swayPhase = (p.swayPhase + 1) % 6;
          const swayDir = p.swayPhase < 3 ? 1 : -1;

          // Step position and angle with small random jitter for a hand-animated feel
          p.x += p.stepX + swayDir * 14 + (Math.random() - 0.5) * 10;
          p.y += p.stepY + (Math.random() - 0.5) * 10;
          p.rotation += p.rotationStep + (Math.random() - 0.5) * 0.22;

          if (p.y < height + 50) {
            remaining++;
          }
        }

        drawAll();

        // Unmount canvas once all particles have fallen past the bottom of the screen
        if (remaining === 0) {
          setActive(false);
          return;
        }
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    const init = () => {
      updateSize();
      const particleCount = width < 1024 ? 55 : 110;
      particles = Array.from({ length: particleCount }, () =>
        createParticle(width, height),
      );
      drawAll();
      window.addEventListener("resize", handleResize);
      lastStepTime = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    };

    init();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
    };
  }, [active]);

  if (!active) {
    return null;
  }

  return (
    <canvas
      className="pointer-events-none fixed inset-0 z-50 w-full h-full motion-reduce:hidden"
      ref={canvasRef}
    />
  );
}
