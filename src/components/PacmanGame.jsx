import React, { useRef, useEffect, useState } from 'react';
import { sound } from '../game/SoundEffects';

export const PacmanGame = ({ engine, isMuted, showCRT }) => {
    const canvasRef = useRef(null);
    const animationFrameIdRef = useRef(null);
    const particlesRef = useRef([]); // Particle pool: { x, y, vx, vy, color, size, life, maxLife, type }
    const [scorePoppers, setScorePoppers] = useState([]); // { id, x, y, text, life }

    // Keyboard bindings
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!engine) return;
            let dir = null;
            switch (e.key) {
                case 'ArrowUp':
                case 'w':
                case 'W':
                    dir = 'up';
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    dir = 'down';
                    break;
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    dir = 'left';
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    dir = 'right';
                    break;
                case 'p':
                case 'P':
                    engine.togglePause();
                    break;
                default:
                    return; // Let other keys propagate
            }

            if (dir) {
                engine.setNextDirection(dir);
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [engine]);

    // Swipe controls for mobile devices
    useEffect(() => {
        let touchStart = null;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const handleTouchStart = (e) => {
            const touch = e.touches[0];
            touchStart = { x: touch.clientX, y: touch.clientY };
        };

        const handleTouchMove = (e) => {
            if (!touchStart || !engine) return;
            const touch = e.touches[0];
            const dx = touch.clientX - touchStart.x;
            const dy = touch.clientY - touchStart.y;

            // Threshold of 30px swipe
            if (Math.abs(dx) > 30 || Math.abs(dy) > 30) {
                if (Math.abs(dx) > Math.abs(dy)) {
                    engine.setNextDirection(dx > 0 ? 'right' : 'left');
                } else {
                    engine.setNextDirection(dy > 0 ? 'down' : 'up');
                }
                touchStart = null; // Reset
                e.preventDefault();
            }
        };

        canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });

        return () => {
            canvas.removeEventListener('touchstart', handleTouchStart);
            canvas.removeEventListener('touchmove', handleTouchMove);
        };
    }, [engine]);

    // Main animation and canvas update loop
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !engine) return;

        const ctx = canvas.getContext('2d');
        let lastTime = performance.now();

        // Canvas scaling helper
        const resizeCanvas = () => {
            const size = 19 * 20; // 19 rows/cols * 20px
            const parent = canvas.parentElement;
            if (parent) {
                const parentWidth = parent.clientWidth - 20;
                const scale = Math.min(parentWidth / size, 1.8);
                canvas.width = size * scale;
                canvas.height = size * scale;
                ctx.scale(scale, scale);
            }
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const spawnDeathParticles = (x, y) => {
            // Tron style pixels dissolving
            const colors = ['#ff0055', '#ffff00', '#00ffff', '#fff'];
            for (let i = 0; i < 40; i++) {
                particlesRef.current.push({
                    x: x * 20 + 10,
                    y: y * 20 + 10,
                    vx: (Math.random() - 0.5) * 4,
                    vy: (Math.random() - 0.5) * 4,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    size: Math.random() * 3 + 2,
                    life: 1.0,
                    decay: 0.02 + Math.random() * 0.02
                });
            }
        };

        const spawnShatterParticles = (x, y, color) => {
            // Cyber shards
            for (let i = 0; i < 20; i++) {
                particlesRef.current.push({
                    x: x * 20 + 10,
                    y: y * 20 + 10,
                    vx: (Math.random() - 0.5) * 5,
                    vy: (Math.random() - 0.5) * 5,
                    color: color || '#00ffff',
                    size: Math.random() * 4 + 1,
                    life: 1.0,
                    decay: 0.03 + Math.random() * 0.03
                });
            }
        };

        const spawnDotParticles = (x, y) => {
            // Small sparks
            for (let i = 0; i < 4; i++) {
                particlesRef.current.push({
                    x: x * 20 + 10,
                    y: y * 20 + 10,
                    vx: (Math.random() - 0.5) * 1.5,
                    vy: (Math.random() - 0.5) * 1.5,
                    color: '#00ffcc',
                    size: Math.random() * 2 + 1,
                    life: 1.0,
                    decay: 0.08
                });
            }
        };

        // Listeners for game-engine state events to trigger visual effects
        let prevScore = engine.score;
        let prevLives = engine.lives;

        const loop = (time) => {
            const dt = time - lastTime;
            lastTime = time;

            // Max cap dt to prevent huge jumps when tab is inactive
            const boundedDt = Math.min(dt, 100);

            // Update physics simulation
            engine.update(boundedDt);

            // Detect score jumps (eating ghosts/dots) and trigger particles
            if (engine.score > prevScore) {
                const diff = engine.score - prevScore;
                const pacX = engine.pacman.x;
                const pacY = engine.pacman.y;

                if (diff === 10) {
                    spawnDotParticles(pacX, pacY);
                } else if (diff === 200 || diff === 400 || diff === 800) {
                    spawnShatterParticles(pacX, pacY, '#ffff00');
                    // Add floating text popups
                    setScorePoppers(prev => [...prev, {
                        id: Math.random(),
                        x: pacX * 20 + 10,
                        y: pacY * 20 - 5,
                        text: `+${diff}`,
                        life: 1.0
                    }]);
                }
                prevScore = engine.score;
            }

            // Detect life loss
            if (engine.lives < prevLives) {
                spawnDeathParticles(engine.pacman.x, engine.pacman.y);
                prevLives = engine.lives;
            }

            // Draw everything
            draw(ctx, engine);

            animationFrameIdRef.current = requestAnimationFrame(loop);
        };

        animationFrameIdRef.current = requestAnimationFrame(loop);

        return () => {
            cancelAnimationFrame(animationFrameIdRef.current);
            window.removeEventListener('resize', resizeCanvas);
        };
    }, [engine]);

    // Color helpers for glow styles
    const lightenColor = (color, percent) => {
        let r = parseInt(color.substring(1, 3), 16);
        let g = parseInt(color.substring(3, 5), 16);
        let b = parseInt(color.substring(5, 7), 16);
        r = Math.min(255, Math.floor(r * (1 + percent / 100)));
        g = Math.min(255, Math.floor(g * (1 + percent / 100)));
        b = Math.min(255, Math.floor(b * (1 + percent / 100)));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    };

    const draw = (ctx, eng) => {
        const ts = eng.tileSize;
        ctx.fillStyle = '#050517'; // Cyberpunk background
        ctx.fillRect(0, 0, eng.cols * ts, eng.rows * ts);

        // 1. Draw grid scanlines/lines in background
        ctx.strokeStyle = 'rgba(0, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let i = 0; i < eng.cols; i++) {
            ctx.beginPath();
            ctx.moveTo(i * ts, 0);
            ctx.lineTo(i * ts, eng.rows * ts);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(0, i * ts);
            ctx.lineTo(eng.cols * ts, i * ts);
            ctx.stroke();
        }

        // 2. Draw Walls with cyberpunk glow
        ctx.save();
        ctx.shadowColor = eng.mapType === 'circuit' ? '#ff00aa' : (eng.mapType === 'nexus' ? '#00ffaa' : '#0077ff');
        ctx.shadowBlur = 12;
        ctx.lineWidth = 2.5;

        for (let y = 0; y < eng.rows; y++) {
            for (let x = 0; x < eng.cols; x++) {
                if (eng.map[y][x] === 1) {
                    ctx.fillStyle = 'rgba(10, 15, 60, 0.7)';
                    ctx.fillRect(x * ts + 1.5, y * ts + 1.5, ts - 3, ts - 3);

                    ctx.strokeStyle = eng.mapType === 'circuit' ? 'rgba(255, 0, 170, 0.8)' : (eng.mapType === 'nexus' ? 'rgba(0, 255, 170, 0.8)' : 'rgba(0, 119, 255, 0.8)');
                    ctx.strokeRect(x * ts + 2.5, y * ts + 2.5, ts - 5, ts - 5);
                }
            }
        }
        ctx.restore();

        // 3. Draw Dots & Power Pellets
        for (let y = 0; y < eng.rows; y++) {
            for (let x = 0; x < eng.cols; x++) {
                const cell = eng.map[y][x];
                const cx = x * ts + ts / 2;
                const cy = y * ts + ts / 2;

                if (cell === 2) {
                    // Normal dot: Glowing cyan bead
                    ctx.fillStyle = '#00ffff';
                    ctx.shadowColor = '#00ffff';
                    ctx.shadowBlur = 4;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                } else if (cell === 3) {
                    // Power pellet: Pulsating magenta nodes
                    const scale = 1 + Math.sin(Date.now() / 150) * 0.25;
                    ctx.fillStyle = '#ff00cc';
                    ctx.shadowColor = '#ff00cc';
                    ctx.shadowBlur = 10;
                    ctx.beginPath();
                    ctx.arc(cx, cy, 6 * scale, 0, Math.PI * 2);
                    ctx.fill();
                    ctx.shadowBlur = 0;
                }
            }
        }

        // 4. Draw Cyber-Hack Chip
        if (eng.spawnedChip) {
            const chip = eng.spawnedChip;
            const cx = chip.x * ts + ts / 2;
            const cy = chip.y * ts + ts / 2;
            
            ctx.save();
            ctx.translate(cx, cy);
            
            // Rotating microprocessor shape
            const rot = (Date.now() / 400) % (Math.PI * 2);
            ctx.rotate(rot);

            let chipColor = '#00ffff'; // freeze
            if (chip.type === 'turbo') chipColor = '#ff7700';
            else if (chip.type === 'invisibility') chipColor = '#b300ff';

            ctx.shadowColor = chipColor;
            ctx.shadowBlur = 12;
            
            // Draw central chip block
            ctx.fillStyle = '#0b0e1a';
            ctx.strokeStyle = chipColor;
            ctx.lineWidth = 1.5;
            ctx.fillRect(-6, -6, 12, 12);
            ctx.strokeRect(-6, -6, 12, 12);

            // Draw chip pins
            ctx.fillStyle = chipColor;
            for (let i = -4; i <= 4; i += 3) {
                ctx.fillRect(i - 1, -8, 2, 2);  // Top
                ctx.fillRect(i - 1, 6, 2, 2);   // Bottom
                ctx.fillRect(-8, i - 1, 2, 2);  // Left
                ctx.fillRect(6, i - 1, 2, 2);   // Right
            }
            
            ctx.restore();
        }

        // 5. Draw Pacman with glow & trail
        const pac = eng.pacman;
        
        // Draw Turbo Hack neon trail
        if (eng.activeHack === 'turbo' && pac.trail.length > 0) {
            ctx.save();
            ctx.lineWidth = ts - 6;
            ctx.lineCap = 'round';
            ctx.lineJoin = 'round';
            ctx.strokeStyle = 'rgba(255, 120, 0, 0.25)';
            ctx.shadowColor = '#ff5500';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            pac.trail.forEach((pos, idx) => {
                const tx = pos.x * ts + ts / 2;
                const ty = pos.y * ts + ts / 2;
                if (idx === 0) ctx.moveTo(tx, ty);
                else ctx.lineTo(tx, ty);
            });
            ctx.stroke();
            ctx.restore();
        }

        ctx.save();
        ctx.translate(pac.x * ts + ts / 2, pac.y * ts + ts / 2);
        
        // Face rotation
        switch (pac.direction) {
            case 'up': ctx.rotate(-Math.PI / 2); break;
            case 'down': ctx.rotate(Math.PI / 2); break;
            case 'left': ctx.rotate(Math.PI); break;
        }

        // Custom glow colors based on hacks
        let pacGlowColor = '#ffff00';
        let pacFill = ctx.createRadialGradient(0, 0, 0, 0, 0, ts / 2);
        
        if (eng.activeHack === 'turbo') {
            pacGlowColor = '#ff6a00';
            pacFill.addColorStop(0, '#ffa200');
            pacFill.addColorStop(0.8, '#ff5100');
            pacFill.addColorStop(1, '#9e2b00');
        } else if (eng.activeHack === 'invisibility') {
            pacGlowColor = 'rgba(179, 0, 255, 0.4)';
            pacFill.addColorStop(0, 'rgba(212, 128, 255, 0.5)');
            pacFill.addColorStop(0.8, 'rgba(149, 0, 255, 0.3)');
            pacFill.addColorStop(1, 'rgba(85, 0, 153, 0.1)');
        } else {
            pacFill.addColorStop(0, '#ffff80');
            pacFill.addColorStop(0.8, '#ffff00');
            pacFill.addColorStop(1, '#b5b500');
        }

        ctx.shadowColor = pacGlowColor;
        ctx.shadowBlur = eng.activeHack === 'invisibility' ? 4 : 12;
        ctx.fillStyle = pacFill;

        ctx.beginPath();
        ctx.arc(0, 0, ts / 2 - 1, pac.mouthOpen * Math.PI, (2 - pac.mouthOpen) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // 6. Draw Ghosts
        eng.ghosts.forEach(ghost => {
            const gx = ghost.x * ts + ts / 2;
            const gy = ghost.y * ts + ts / 2;
            const radius = ts / 2 - 1.5;

            ctx.save();
            ctx.translate(gx, gy);

            if (ghost.isDead) {
                // If dead: Only draw cyber-goggles (eyes)
                ctx.fillStyle = '#ffffff';
                ctx.beginPath();
                ctx.arc(-3.5, -2, 3, 0, Math.PI * 2);
                ctx.arc(3.5, -2, 3, 0, Math.PI * 2);
                ctx.fill();
                
                ctx.fillStyle = '#0066ff';
                ctx.beginPath();
                ctx.arc(-3.5, -2, 1.2, 0, Math.PI * 2);
                ctx.arc(3.5, -2, 1.2, 0, Math.PI * 2);
                ctx.fill();
            } else {
                // Normal or Scared Ghost drawing
                let colorBase = ghost.color;
                let ghostGlow = ghost.color;

                if (eng.powerMode) {
                    // Scared pulse blue/white near end
                    const blink = eng.powerModeTimer < 2500 && Math.floor(Date.now() / 200) % 2 === 0;
                    colorBase = blink ? '#ffffff' : '#001eff';
                    ghostGlow = blink ? '#ffffff' : '#001eff';
                } else if (eng.activeHack === 'freeze') {
                    // Frozen: Cyan tint with a frosty texture
                    colorBase = '#55ffff';
                    ghostGlow = '#00ffff';
                }

                // Setup body gradient
                const grad = ctx.createRadialGradient(0, -2, 0, 0, 0, radius);
                if (eng.powerMode) {
                    grad.addColorStop(0, lightenColor(colorBase, 40));
                    grad.addColorStop(0.7, colorBase);
                    grad.addColorStop(1, '#000044');
                } else {
                    grad.addColorStop(0, lightenColor(colorBase, 50));
                    grad.addColorStop(0.6, colorBase);
                    grad.addColorStop(1, '#1c000c');
                }

                ctx.shadowColor = ghostGlow;
                ctx.shadowBlur = eng.activeHack === 'freeze' ? 5 : 10;
                ctx.fillStyle = grad;

                // Wavy skirt floats using sine wave
                const waveOffset = Math.sin((Date.now() / 150) + ghost.id * 1.5) * 2;

                ctx.beginPath();
                // Top arc
                ctx.arc(0, -1, radius, Math.PI, 0, false);
                // Right side wall
                ctx.lineTo(radius, radius + waveOffset / 2);
                // Bottom waves
                const waveCount = 3;
                const waveWidth = (radius * 2) / waveCount;
                for (let i = 0; i < waveCount; i++) {
                    const waveX = radius - i * waveWidth;
                    ctx.quadraticCurveTo(
                        waveX - waveWidth / 2, radius + (i % 2 === 0 ? 3 : -1) + waveOffset,
                        waveX - waveWidth, radius + waveOffset / 2
                    );
                }
                // Left side wall
                ctx.lineTo(-radius, -1);
                ctx.closePath();
                ctx.fill();
                ctx.shadowBlur = 0;

                // Eyes
                ctx.fillStyle = '#ffffff';
                const eyeDx = ghost.direction === 'left' ? -1.5 : (ghost.direction === 'right' ? 1.5 : 0);
                const eyeDy = ghost.direction === 'up' ? -1.5 : (ghost.direction === 'down' ? 1.5 : 0);

                ctx.beginPath();
                ctx.arc(-3.5 + eyeDx, -2 + eyeDy, 3, 0, Math.PI * 2);
                ctx.arc(3.5 + eyeDx, -2 + eyeDy, 3, 0, Math.PI * 2);
                ctx.fill();

                // Pupils
                ctx.fillStyle = eng.powerMode ? '#ff0000' : '#000000';
                ctx.beginPath();
                ctx.arc(-3.5 + eyeDx * 1.6, -2 + eyeDy * 1.6, 1.3, 0, Math.PI * 2);
                ctx.arc(3.5 + eyeDx * 1.6, -2 + eyeDy * 1.6, 1.3, 0, Math.PI * 2);
                ctx.fill();

                // Vulnerable face mouth wiggle
                if (eng.powerMode) {
                    ctx.strokeStyle = '#ff00ff';
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.moveTo(-5, 4);
                    ctx.lineTo(-3, 2);
                    ctx.lineTo(-1, 4);
                    ctx.lineTo(1, 2);
                    ctx.lineTo(3, 4);
                    ctx.lineTo(5, 2);
                    ctx.stroke();
                }
            }

            ctx.restore();
        });

        // 7. Update and Draw Particles
        const particles = particlesRef.current;
        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.life -= p.decay;

            if (p.life <= 0) {
                particles.splice(i, 1);
                continue;
            }

            ctx.save();
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.life;
            ctx.fillRect(p.x - p.size / 2, p.y - p.size / 2, p.size, p.size);
            ctx.restore();
        }

        // 8. Update and Draw Score Poppers
        const now = Date.now();
        setScorePoppers(prev => {
            const next = [];
            prev.forEach(pop => {
                const updatedPop = { ...pop, y: pop.y - 0.4, life: pop.life - 0.02 };
                if (updatedPop.life > 0) {
                    ctx.save();
                    ctx.fillStyle = '#00ffcc';
                    ctx.font = '7px "Press Start 2P", cursive';
                    ctx.shadowColor = '#00ffcc';
                    ctx.shadowBlur = 4;
                    ctx.globalAlpha = updatedPop.life;
                    ctx.fillText(updatedPop.text, updatedPop.x - 12, updatedPop.y);
                    ctx.restore();
                    next.push(updatedPop);
                }
            });
            return next;
        });
    };

    return (
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
            <canvas
                id="gameCanvas"
                ref={canvasRef}
                style={{
                    display: 'block',
                    background: '#00000e',
                    border: '3px solid #00f3ff',
                    borderRadius: '12px',
                    boxShadow: '0 0 20px rgba(0, 243, 255, 0.45)',
                    imageRendering: 'pixelated'
                }}
            />
            {/* CRT overlay scanlines */}
            {showCRT && (
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        pointerEvents: 'none',
                        background: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%)',
                        backgroundSize: '100% 4px',
                        opacity: 0.15,
                        borderRadius: '12px'
                    }}
                />
            )}
        </div>
    );
};
export default PacmanGame;
