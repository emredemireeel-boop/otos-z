"use client";

import { useEffect, useRef } from "react";

interface Star {
    x: number;
    y: number;
    z: number;
    size: number;
    brightness: number;
    baseBrightness: number;
    twinkleSpeed: number;
    color: string;
}

interface Meteor {
    x: number;
    y: number;
    length: number;
    speed: number;
    angle: number;
    active: boolean;
    opacity: number;
}

interface Planet {
    x: number;
    y: number;
    radius: number;
    type: "gas" | "rocky" | "ice";
    orbitSpeed: number;
    image: HTMLImageElement | null;
    opacity: number; // For distant/faded effect
}

interface FloatingWord {
    text: string;
    x: number;
    y: number;
    z: number;
    vx: number;
    vy: number;
    rotation: number;
    rotationSpeed: number;
    opacity: number;
    size: number;
}

export default function SpaceBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let stars: Star[] = [];
        let meteors: Meteor[] = [];
        let planets: Planet[] = [];
        let words: FloatingWord[] = [];

        // Define planet images
        const planetImgGas = new Image();
        planetImgGas.src = "/planet_gas.png";

        const planetImgRocky = new Image();
        planetImgRocky.src = "/planet_rocky.png";

        const planetImgIce = new Image();
        planetImgIce.src = "/planet_ice.png";

        // Strictly Turkish automotive terms
        const carTerms = [
            "Tork", "Beygir", "0-100", "V8", "Turbo", "Drift", "Jant", "Egzoz",
            "Makas", "Lastik", "Şanzıman", "Karbüratör", "Piston", "Krank",
            "Eksantrik", "Supercharger", "Devir", "Viraj", "Patinaj",
            "Süspansiyon", "Diferansiyel", "Manifold", "Enjektör", "Buji",
            "Debriyaj", "Volan", "Radyatör", "Alternatör", "Marş", "Segman",
            "Conta", "Karter", "Aks", "Rot", "Salıncak", "Amortisör", "Helezon",
            "Kaliper", "Balata", "Disk", "Kampana", "Abs", "Esp", "Airbag",
            "Kelebek", "Subap", "Blok", "Silindir", "Tramer", "Ruhsat", "Muayene",
            "Rotil", "Z-Rot", "Travers", "Kaporta", "Tampon", "Çamurluk", "Far"
        ];

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initScene();
        };

        const initScene = () => {
            // Stars
            stars = [];
            const numStars = Math.floor((canvas.width * canvas.height) / 3000);
            for (let i = 0; i < numStars; i++) {
                const isRed = Math.random() < 0.20;
                const brightness = Math.random();

                const z = isRed ? (Math.random() * 3 + 3) : (Math.random() * 3 + 0.5);

                stars.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: z,
                    size: isRed ? (Math.random() * 1.5 + 0.5) : (Math.random() * 1.5),
                    brightness: brightness,
                    baseBrightness: brightness,
                    twinkleSpeed: (Math.random() * 0.015) + 0.002,
                    color: isRed ? "#ff4d4d" : "#ffffff"
                });
            }

            // Planets
            planets = [];

            // Major Planets
            planets.push({
                x: canvas.width * 0.85,
                y: canvas.height * 0.2,
                radius: 70,
                type: "gas",
                orbitSpeed: 0.0002,
                image: planetImgGas,
                opacity: 1
            });
            planets.push({
                x: canvas.width * 0.1,
                y: canvas.height * 0.85,
                radius: 50,
                type: "rocky",
                orbitSpeed: 0.0001,
                image: planetImgRocky,
                opacity: 1
            });

            // Distant Small Planets (3-4 random ones)
            const numDistantPlanets = 4;
            for (let i = 0; i < numDistantPlanets; i++) {
                const typeRand = Math.random();
                let type: "gas" | "rocky" | "ice" = "ice";
                let img = planetImgIce;

                if (typeRand < 0.33) { type = "gas"; img = planetImgGas; }
                else if (typeRand < 0.66) { type = "rocky"; img = planetImgRocky; }

                planets.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    radius: Math.random() * 15 + 10, // Small radius (10-25px)
                    type: type,
                    orbitSpeed: 0.00005, // Very slow
                    image: img,
                    opacity: 0.6 // Faded for distance
                });
            }

            // Words
            words = [];
            const numWords = 15;
            for (let i = 0; i < numWords; i++) {
                spawnWord(true);
            }

            // Meteors
            meteors = [];
        };

        const spawnWord = (randomPos: boolean = false) => {
            const text = carTerms[Math.floor(Math.random() * carTerms.length)];
            const z = Math.random() * 3 + 1;

            const x = Math.random() * canvas.width;
            const y = randomPos ? Math.random() * canvas.height : canvas.height + 50;

            const vx = (Math.random() - 0.5) * 0.5;
            const vy = (Math.random() - 0.5) * 0.5;

            words.push({
                text: text,
                x: x,
                y: y,
                z: z,
                vx: vx,
                vy: vy,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.004,
                opacity: 0,
                size: Math.floor((Math.random() * 24 + 16) / z)
            });
        };

        const spawnMeteor = () => {
            const startX = Math.random() * canvas.width;
            const startY = Math.random() * (canvas.height * 0.5);
            meteors.push({
                x: startX,
                y: startY,
                length: Math.random() * 80 + 100,
                speed: Math.random() * 15 + 10,
                angle: Math.PI / 4 + (Math.random() * 0.4 - 0.2),
                active: true,
                opacity: 0,
            });
        };

        const drawPlanet = (planet: Planet) => {
            if (planet.image && planet.image.complete) {
                ctx.save();
                ctx.globalAlpha = planet.opacity; // Apply distance fading
                ctx.beginPath();
                ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
                ctx.clip();

                ctx.drawImage(
                    planet.image,
                    planet.x - planet.radius,
                    planet.y - planet.radius,
                    planet.radius * 2,
                    planet.radius * 2
                );

                const gradient = ctx.createRadialGradient(
                    planet.x - planet.radius / 3,
                    planet.y - planet.radius / 3,
                    planet.radius / 10,
                    planet.x,
                    planet.y,
                    planet.radius
                );
                // Distant planets are darker/more shadowy
                const shadowStrength = planet.opacity < 1 ? 0.9 : 0.8;

                gradient.addColorStop(0, "rgba(255,255,255,0)");
                gradient.addColorStop(0.8, "rgba(0,0,0,0.1)");
                gradient.addColorStop(1, `rgba(0,0,0,${shadowStrength})`);

                ctx.fillStyle = gradient;
                ctx.fill();
                ctx.restore();
            } else {
                ctx.fillStyle = "rgba(100, 100, 100, 0.5)";
                ctx.beginPath();
                ctx.arc(planet.x, planet.y, planet.radius, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        const drawMeteor = (meteor: Meteor) => {
            if (!meteor.active) return;

            if (meteor.opacity < 1 && meteor.y < canvas.height / 2) {
                meteor.opacity += 0.05;
            }

            const tailX = meteor.x - Math.cos(meteor.angle) * meteor.length;
            const tailY = meteor.y - Math.sin(meteor.angle) * meteor.length;

            const gradient = ctx.createLinearGradient(meteor.x, meteor.y, tailX, tailY);
            gradient.addColorStop(0, "rgba(255, 255, 255, 1)");
            gradient.addColorStop(0.4, "rgba(255, 255, 255, 0.4)");
            gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

            ctx.strokeStyle = gradient;
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(meteor.x, meteor.y);
            ctx.lineTo(tailX, tailY);
            ctx.stroke();

            ctx.shadowBlur = 10;
            ctx.shadowColor = "white";
            ctx.fillStyle = "white";
            ctx.beginPath();
            ctx.arc(meteor.x, meteor.y, 2, 0, Math.PI * 2);
            ctx.fill();
            ctx.shadowBlur = 0;
        };

        const drawWord = (word: FloatingWord, index: number) => {
            word.x += word.vx;
            word.y += word.vy;
            word.rotation += word.rotationSpeed;

            if (word.x < -100) word.x = canvas.width + 100;
            if (word.x > canvas.width + 100) word.x = -100;
            if (word.y < -100) word.y = canvas.height + 100;
            if (word.y > canvas.height + 100) word.y = -100;

            const targetOpacity = 0.5 / word.z;
            if (word.opacity < targetOpacity) word.opacity += 0.01;

            ctx.save();
            ctx.translate(word.x, word.y);
            ctx.rotate(word.rotation);

            ctx.font = `${word.size}px 'Inter', sans-serif`;
            ctx.fillStyle = `rgba(165, 180, 252, ${word.opacity})`;
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.fillText(word.text, 0, 0);

            ctx.restore();
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // 1. Stars
            stars.forEach(star => {
                star.brightness += star.twinkleSpeed;
                if (star.brightness > star.baseBrightness + 0.3 || star.brightness < star.baseBrightness - 0.2) {
                    star.twinkleSpeed = -star.twinkleSpeed;
                }
                const displayBrightness = Math.max(0, Math.min(1, star.brightness));

                // Movement (Parallax)
                star.x -= 0.1 / star.z;
                if (star.x < 0) {
                    star.x = canvas.width;
                    star.y = Math.random() * canvas.height;
                }

                if (star.color !== "#ffffff") {
                    ctx.fillStyle = `rgba(255, 77, 77, ${displayBrightness * 0.8})`;
                    ctx.shadowBlur = 2;
                    ctx.shadowColor = "#ff4d4d";
                } else {
                    ctx.fillStyle = `rgba(255, 255, 255, ${displayBrightness})`;
                    ctx.shadowBlur = 0;
                }

                ctx.beginPath();
                const radius = Math.max(0.1, star.size / star.z);
                ctx.arc(star.x, star.y, radius, 0, Math.PI * 2);
                ctx.fill();
            });

            // 2. Planets
            planets.forEach(planet => {
                drawPlanet(planet);
            });

            // 3. Floating Words
            words.forEach((word, index) => {
                drawWord(word, index);
            });

            // 4. Meteors
            if (Math.random() < 0.005) spawnMeteor();

            meteors.forEach((meteor, index) => {
                if (!meteor.active) return;
                meteor.x += Math.cos(meteor.angle) * meteor.speed;
                meteor.y += Math.sin(meteor.angle) * meteor.speed;
                if (meteor.x > canvas.width + 100 || meteor.y > canvas.height + 100) {
                    meteor.active = false;
                    meteors.splice(index, 1);
                } else {
                    drawMeteor(meteor);
                }
            });

            animationFrameId = requestAnimationFrame(draw);
        };

        window.addEventListener("resize", resizeCanvas);
        resizeCanvas();
        draw();

        return () => {
            window.removeEventListener("resize", resizeCanvas);
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 0
            }}
        />
    );
}
