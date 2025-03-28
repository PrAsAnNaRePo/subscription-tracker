"use client";

import { useEffect, useRef } from "react";

export default function DashboardBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    const resizeCanvas = () => {
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // Initial resize
    resizeCanvas();

    // Handle window resize
    window.addEventListener("resize", resizeCanvas);

    // Particle class
    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      baseColor: string;
      pulse: number;
      pulseSpeed: number;

      constructor() {
        // Safe access with null checks
        const canvasWidth = canvas?.width || window.innerWidth;
        const canvasHeight = canvas?.height || window.innerHeight;
        
        this.x = Math.random() * canvasWidth;
        this.y = Math.random() * canvasHeight;
        this.size = Math.random() * 1.5 + 0.4;
        this.speedX = Math.random() * 0.4 - 0.2;
        this.speedY = Math.random() * 0.4 - 0.2;
        
        // Create a richer color palette with purples, blues, and cyans
        const colorChoice = Math.random();
        if (colorChoice < 0.33) {
          // Purple tones
          this.baseColor = `rgba(${70 + Math.random() * 30}, ${50 + Math.random() * 20}, ${220 + Math.random() * 35}, 0.2)`;
        } else if (colorChoice < 0.66) {
          // Blue tones
          this.baseColor = `rgba(${30 + Math.random() * 20}, ${90 + Math.random() * 30}, ${210 + Math.random() * 45}, 0.2)`;
        } else {
          // Cyan tones
          this.baseColor = `rgba(${20 + Math.random() * 20}, ${150 + Math.random() * 50}, ${200 + Math.random() * 55}, 0.2)`;
        }
        
        this.color = this.baseColor;
        this.pulse = Math.random() * Math.PI * 2; // Random start position in the pulse cycle
        this.pulseSpeed = 0.02 + Math.random() * 0.03; // Different speeds for different particles
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        // Safe access with null checks
        const canvasWidth = canvas?.width || window.innerWidth;
        const canvasHeight = canvas?.height || window.innerHeight;

        if (this.x > canvasWidth) this.x = 0;
        else if (this.x < 0) this.x = canvasWidth;
        if (this.y > canvasHeight) this.y = 0;
        else if (this.y < 0) this.y = canvasHeight;
        
        // Pulse effect - make particles subtly change opacity
        this.pulse += this.pulseSpeed;
        const sinValue = Math.sin(this.pulse);
        const opacityShift = (sinValue + 1) / 2; // Convert from -1,1 to 0,1 range
        
        // Extract rgba values from baseColor
        const rgbaMatch = this.baseColor.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
        if (rgbaMatch) {
          const r = parseInt(rgbaMatch[1]);
          const g = parseInt(rgbaMatch[2]);
          const b = parseInt(rgbaMatch[3]);
          const baseOpacity = parseFloat(rgbaMatch[4]);
          
          // Create a new color with pulsing opacity and slightly varying color
          const newOpacity = baseOpacity * (0.7 + (opacityShift * 0.6));
          const rShift = r + (sinValue * 10);
          const gShift = g + (sinValue * 5);
          const bShift = b + (sinValue * 15);
          
          this.color = `rgba(${rShift}, ${gShift}, ${bShift}, ${newOpacity})`;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Create particles
    const particlesArray: Particle[] = [];
    const canvasWidth = canvas?.width || window.innerWidth;
    const canvasHeight = canvas?.height || window.innerHeight;
    const numberOfParticles = Math.min(100, Math.floor(canvasWidth * canvasHeight / 15000));
    
    for (let i = 0; i < numberOfParticles; i++) {
      particlesArray.push(new Particle());
    }

    // Animation loop
    const animate = () => {
      if (!ctx || !canvas) return;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw rich, dark gradient background
      const gradient = ctx.createRadialGradient(
        canvas.width * 0.3, canvas.height * 0.3, 0,
        canvas.width * 0.5, canvas.height * 0.5, Math.max(canvas.width, canvas.height)
      );
      gradient.addColorStop(0, "rgba(10, 10, 25, 1)");
      gradient.addColorStop(0.3, "rgba(5, 5, 15, 1)");
      gradient.addColorStop(0.6, "rgba(3, 3, 10, 1)");
      gradient.addColorStop(1, "rgba(0, 0, 5, 1)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Add subtle noise texture
      const noiseOpacity = 0.03;
      for (let i = 0; i < 5000; i++) {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const size = Math.random() * 1;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * noiseOpacity})`;
        ctx.fillRect(x, y, size, size);
      }
      
      // Update and draw particles
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      
      // Draw connections between particles
      connectParticles();
      
      requestAnimationFrame(animate);
    };

    // Connect particles with lines
    const connectParticles = () => {
      if (!ctx) return;
      
      const maxDistance = 170;
      
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          const dx = particlesArray[a].x - particlesArray[b].x;
          const dy = particlesArray[a].y - particlesArray[b].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < maxDistance) {
            const opacity = 1 - distance / maxDistance;
            
            // Extract color from the particles to create matching connections
            const colorA = particlesArray[a].color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
            const colorB = particlesArray[b].color.match(/rgba\((\d+),\s*(\d+),\s*(\d+)/);
            
            if (colorA && colorB) {
              // Blend the colors of the two connected particles
              const r = Math.floor((parseInt(colorA[1]) + parseInt(colorB[1])) / 2);
              const g = Math.floor((parseInt(colorA[2]) + parseInt(colorB[2])) / 2);
              const b = Math.floor((parseInt(colorA[3]) + parseInt(colorB[3])) / 2);
              
              // Create a gradient for the line
              const gradient = ctx.createLinearGradient(
                particlesArray[a].x, particlesArray[a].y,
                particlesArray[b].x, particlesArray[b].y
              );
              
              gradient.addColorStop(0, `rgba(${parseInt(colorA[1])}, ${parseInt(colorA[2])}, ${parseInt(colorA[3])}, ${opacity * 0.15})`);
              gradient.addColorStop(1, `rgba(${parseInt(colorB[1])}, ${parseInt(colorB[2])}, ${parseInt(colorB[3])}, ${opacity * 0.15})`);
              
              ctx.strokeStyle = gradient;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
              ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
              ctx.stroke();
            }
          }
        }
      }
    };

    // Start animation
    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10"
      aria-hidden="true"
    />
  );
}
