import { sound } from './SoundEffects';

// Maps: 19 columns x 19 rows
// Legend: 0 = empty, 1 = wall, 2 = dot, 3 = power pellet
// Chip Spawns are handled dynamically.

export const MAPS = {
    core: {
        name: 'The Core',
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
            [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
            [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
            [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0], // Ghost House at (9,9)
            [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
            [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
            [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
            [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
            [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
            [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        pacmanStart: { x: 9, y: 15 },
        ghostStarts: [
            { x: 9, y: 9, color: '#FF0055', direction: 'right' }, // Red (Blinky)
            { x: 8, y: 9, color: '#00FFFF', direction: 'left' },  // Cyan (Inky)
            { x: 10, y: 9, color: '#FF77FF', direction: 'right' }, // Pink (Pinky)
            { x: 9, y: 8, color: '#FF9900', direction: 'up' }     // Orange (Clyde)
        ]
    },
    nexus: {
        name: 'The Nexus',
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 3, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 3, 1],
            [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
            [1, 2, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 2, 2, 2, 1],
            [1, 1, 2, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 2, 1, 1],
            [0, 0, 2, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 2, 0, 0],
            [1, 1, 2, 1, 2, 1, 0, 1, 0, 0, 0, 1, 0, 1, 2, 1, 2, 1, 1],
            [1, 2, 2, 2, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 1], // Center ring
            [1, 2, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 2, 2, 2, 1],
            [1, 1, 2, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 2, 1, 1],
            [0, 0, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 0, 0], // Left/Right side tunnels
            [1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1],
            [1, 3, 1, 1, 1, 1, 2, 1, 1, 2, 1, 1, 2, 1, 1, 1, 1, 3, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        pacmanStart: { x: 9, y: 14 },
        ghostStarts: [
            { x: 9, y: 8, color: '#FF0055', direction: 'right' },
            { x: 8, y: 8, color: '#00FFFF', direction: 'left' },
            { x: 10, y: 8, color: '#FF77FF', direction: 'right' },
            { x: 9, y: 7, color: '#FF9900', direction: 'up' }
        ]
    },
    circuit: {
        name: 'The Circuit',
        grid: [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 2, 1, 2, 2, 2, 1],
            [1, 3, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 2, 1, 3, 1],
            [1, 2, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 1, 2, 2, 2, 1, 2, 1],
            [1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 2, 1, 1, 1, 1, 0, 1, 0, 1, 1, 1, 1, 2, 1, 1, 1],
            [0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
            [1, 1, 1, 2, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 1, 2, 1, 1, 1],
            [0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0], // Tunnels
            [1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1],
            [0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
            [1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 1],
            [1, 3, 2, 2, 1, 2, 1, 1, 2, 0, 2, 1, 1, 2, 1, 2, 2, 3, 1],
            [1, 1, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 1, 1, 1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ],
        pacmanStart: { x: 9, y: 15 },
        ghostStarts: [
            { x: 9, y: 9, color: '#FF0055', direction: 'right' },
            { x: 8, y: 9, color: '#00FFFF', direction: 'left' },
            { x: 10, y: 9, color: '#FF77FF', direction: 'right' },
            { x: 9, y: 7, color: '#FF9900', direction: 'up' }
        ]
    }
};

export class GameEngine {
    constructor(mapType = 'core', difficulty = 'normal', onStateChange = () => {}) {
        this.mapType = mapType;
        this.difficulty = difficulty;
        this.onStateChange = onStateChange;

        this.tileSize = 20;
        this.rows = 19;
        this.cols = 19;

        // Sound state callback wrapper
        this.soundMuted = false;

        // High score
        this.highScore = parseInt(localStorage.getItem('pacman_highScore') || '0', 10);

        // Core states
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.paused = false;
        this.win = false;

        // Power Pellet Mode
        this.powerMode = false;
        this.powerModeTimer = 0;
        this.powerModeDuration = difficulty === 'easy' ? 12000 : (difficulty === 'hard' ? 6000 : 9000);

        // Cyber-Hacks (spawning items)
        this.activeHack = null; // 'freeze', 'turbo', 'invisibility'
        this.hackTimer = 0;
        this.hackDuration = 6000; // 6 seconds duration default
        this.spawnedChip = null; // { x, y, type: 'freeze'/'turbo'/'invisibility', spawnedAt }
        this.chipSpawnInterval = 20000; // 20 seconds
        this.chipLifetime = 12000; // 12 seconds to collect
        this.lastChipSpawnTime = Date.now();

        // Game Loop Timestep
        this.timestep = 1000 / 90; // 90 updates per second for logic

        // Initialize objects
        this.initializeGame();
    }

    initializeGame() {
        const config = MAPS[this.mapType] || MAPS.core;
        
        // Deep copy the grid map
        this.map = config.grid.map(row => [...row]);
        this.dotsLeft = this.countDots();

        // Speeds adjusted based on difficulty
        let basePacmanSpeed = 0.08;
        let baseGhostSpeed = 0.06;

        if (this.difficulty === 'easy') {
            basePacmanSpeed = 0.09;
            baseGhostSpeed = 0.045;
        } else if (this.difficulty === 'hard') {
            basePacmanSpeed = 0.08;
            baseGhostSpeed = 0.07;
        }

        // Initialize Pacman
        this.pacman = {
            x: config.pacmanStart.x,
            y: config.pacmanStart.y,
            direction: 'right',
            nextDirection: 'right',
            speed: basePacmanSpeed,
            mouthOpen: 0.2,
            mouthSpeed: 0.02,
            isAtGridCenter: true,
            pendingTurn: false,
            trail: [] // Trails for visual styling during turbo hack
        };

        // Initialize Ghosts
        this.ghosts = config.ghostStarts.map((g, idx) => ({
            id: idx,
            x: g.x,
            y: g.y,
            startX: g.x,
            startY: g.y,
            direction: g.direction,
            speed: baseGhostSpeed * (0.9 + Math.random() * 0.2), // slight variance in speed
            color: g.color,
            isDead: false,
            deadTimer: 0,
            lastDecisionX: -1,
            lastDecisionY: -1
        }));

        this.spawnedChip = null;
        this.activeHack = null;
        this.hackTimer = 0;
        this.lastChipSpawnTime = Date.now();

        // Force initial offset so ghosts can leave the house
        this.ghosts.forEach(g => {
            if (g.direction === 'right') g.x += 0.1;
            if (g.direction === 'left') g.x -= 0.1;
            if (g.direction === 'down') g.y += 0.1;
            if (g.direction === 'up') g.y -= 0.1;
        });

        this.triggerStateUpdate();
    }

    countDots() {
        let count = 0;
        for (let y = 0; y < this.map.length; y++) {
            for (let x = 0; x < this.map[y].length; x++) {
                if (this.map[y][x] === 2 || this.map[y][x] === 3) {
                    count++;
                }
            }
        }
        return count;
    }

    triggerStateUpdate() {
        this.onStateChange({
            score: this.score,
            lives: this.lives,
            highScore: this.highScore,
            gameOver: this.gameOver,
            win: this.win,
            paused: this.paused,
            powerMode: this.powerMode,
            powerModeTimer: this.powerModeTimer,
            activeHack: this.activeHack,
            hackTimer: this.hackTimer,
            spawnedChip: this.spawnedChip
        });
    }

    togglePause() {
        this.paused = !this.paused;
        if (this.paused) {
            sound.stopSiren();
        } else {
            if (!this.gameOver && !this.win) {
                sound.startSiren();
            }
        }
        this.triggerStateUpdate();
    }

    setNextDirection(dir) {
        if (this.gameOver || this.paused) return;
        this.pacman.nextDirection = dir;
        this.tryChangeDirectionImmediate();
    }

    tryChangeDirectionImmediate() {
        if (this.pacman.direction === this.pacman.nextDirection) return;

        // Immediate reverse direction
        const opposites = {
            up: 'down',
            down: 'up',
            left: 'right',
            right: 'left'
        };

        if (opposites[this.pacman.direction] === this.pacman.nextDirection) {
            this.pacman.direction = this.pacman.nextDirection;
            return;
        }

        // Check if close to grid center to turn immediately
        const distFromCenterX = Math.abs(this.pacman.x - Math.round(this.pacman.x));
        const distFromCenterY = Math.abs(this.pacman.y - Math.round(this.pacman.y));

        if (distFromCenterX < 0.25 && distFromCenterY < 0.25) {
            let testX = Math.round(this.pacman.x);
            let testY = Math.round(this.pacman.y);

            switch (this.pacman.nextDirection) {
                case 'up': testY -= 0.2; break;
                case 'down': testY += 0.2; break;
                case 'left': testX -= 0.2; break;
                case 'right': testX += 0.2; break;
            }

            if (this.canMove(testX, testY)) {
                this.pacman.x = Math.round(this.pacman.x);
                this.pacman.y = Math.round(this.pacman.y);
                this.pacman.direction = this.pacman.nextDirection;
            }
        }
    }

    canMove(x, y, isGhost = false) {
        // Get the grid cell that the center point is in
        const centerGridX = Math.floor(x);
        const centerGridY = Math.floor(y);
        
        // Check if center is within map limits (horizontal wrap exception)
        if (centerGridY < 0 || centerGridY >= this.rows) {
            return false;
        }
        if (centerGridX < 0 || centerGridX >= this.cols) {
            // Allow wrapping in tunnel rows
            if (centerGridY === 9 || centerGridY === 8 || centerGridY === 10) {
                return true;
            }
            return false;
        }

        // Check if the center position contains a wall
        if (this.map[centerGridY][centerGridX] === 1) {
            return false;
        }

        // Edge checks with 0.3 buffer - only if Pacman is encroaching on neighbor tiles
        const fracX = x - Math.floor(x);
        const fracY = y - Math.floor(y);
        const checkPoints = [];

        if (fracX > 0.7) {
            checkPoints.push({ x: Math.ceil(x), y: Math.floor(y) });
            // Add diagonal corners only if we're also near the top/bottom boundary
            if (fracY > 0.7) checkPoints.push({ x: Math.ceil(x), y: Math.ceil(y) });
            if (fracY < 0.3) checkPoints.push({ x: Math.ceil(x), y: Math.floor(y) });
        }
        if (fracX < 0.3) {
            checkPoints.push({ x: Math.floor(x), y: Math.floor(y) });
            if (fracY > 0.7) checkPoints.push({ x: Math.floor(x), y: Math.ceil(y) });
            if (fracY < 0.3) checkPoints.push({ x: Math.floor(x), y: Math.floor(y) });
        }
        if (fracY > 0.7) {
            checkPoints.push({ x: Math.floor(x), y: Math.ceil(y) });
            if (fracX > 0.7) checkPoints.push({ x: Math.ceil(x), y: Math.ceil(y) });
            if (fracX < 0.3) checkPoints.push({ x: Math.floor(x), y: Math.ceil(y) });
        }
        if (fracY < 0.3) {
            checkPoints.push({ x: Math.floor(x), y: Math.floor(y) });
            if (fracX > 0.7) checkPoints.push({ x: Math.ceil(x), y: Math.floor(y) });
            if (fracX < 0.3) checkPoints.push({ x: Math.floor(x), y: Math.floor(y) });
        }

        // Check all calculated edge points
        for (const pt of checkPoints) {
            if (pt.y < 0 || pt.y >= this.rows) return false;
            
            // Exclude wrap boundaries
            if ((pt.x < 0 || pt.x >= this.cols) && (pt.y === 9 || pt.y === 8 || pt.y === 10)) {
                continue;
            }
            if (pt.x < 0 || pt.x >= this.cols) return false;

            if (this.map[pt.y][pt.x] === 1) {
                return false;
            }
        }

        return true;
    }

    isValidGridPosition(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    // BFS Pathfinding for smart ghost movements
    findNextBFSMove(ghost, targetX, targetY) {
        const startX = Math.round(ghost.x);
        const startY = Math.round(ghost.y);
        const target = { x: Math.round(targetX), y: Math.round(targetY) };

        // Directions definition
        const directions = [
            { name: 'up', dx: 0, dy: -1 },
            { name: 'down', dx: 0, dy: 1 },
            { name: 'left', dx: -1, dy: 0 },
            { name: 'right', dx: 1, dy: 0 }
        ];

        // Do not turn around back to opposite direction if possible
        const opposites = { up: 'down', down: 'up', left: 'right', right: 'left' };
        const backDir = opposites[ghost.direction];

        // Queue holds: [currentGridPosition, pathOfDirections]
        const queue = [[{ x: startX, y: startY }, []]];
        const visited = new Set();
        visited.add(`${startX},${startY}`);

        let shortestPath = null;

        while (queue.length > 0) {
            const [curr, path] = queue.shift();

            if (curr.x === target.x && curr.y === target.y) {
                shortestPath = path;
                break;
            }

            // Shuffle directions slightly to add randomness when choosing equal paths
            const shuffledDirs = [...directions].sort(() => Math.random() - 0.5);

            for (const dir of shuffledDirs) {
                let nextX = curr.x + dir.dx;
                let nextY = curr.y + dir.dy;

                // Wrap tunnels
                if (nextX < 0) nextX = this.cols - 1;
                if (nextX >= this.cols) nextX = 0;

                if (nextY < 0 || nextY >= this.rows) continue;

                const key = `${nextX},${nextY}`;
                if (!visited.has(key) && this.map[nextY][nextX] !== 1) {
                    visited.add(key);
                    queue.push([{ x: nextX, y: nextY }, [...path, dir.name]]);
                }
            }
        }

        // If path found, check if first move is not reversing (unless trapped)
        if (shortestPath && shortestPath.length > 0) {
            const nextDir = shortestPath[0];
            if (nextDir !== backDir || shortestPath.length === 1) {
                return nextDir;
            }
        }

        // Default: Find any valid moves that don't reverse
        const validDirs = directions.filter(d => {
            if (d.name === backDir) return false;
            let testX = startX + d.dx * 0.5;
            let testY = startY + d.dy * 0.5;
            return this.canMove(testX, testY);
        });

        if (validDirs.length > 0) {
            return validDirs[Math.floor(Math.random() * validDirs.length)].name;
        }

        // Ultimate fallback (reverse)
        return backDir || 'right';
    }

    update(deltaTime) {
        if (this.gameOver || this.paused || this.win) return;

        if (this.accumulator === undefined) {
            this.accumulator = 0;
        }
        this.accumulator += deltaTime;

        // Fixed timestep updates to lock speed to 90 FPS simulation rate
        while (this.accumulator >= this.timestep) {
            this.tickSimulation(this.timestep);
            this.accumulator -= this.timestep;
        }
    }

    tickSimulation(step) {
        // 1. Spawn dynamic Cyber-Hack Chips
        const now = Date.now();
        if (!this.spawnedChip && !this.activeHack && (now - this.lastChipSpawnTime > this.chipSpawnInterval)) {
            this.spawnChip();
        }

        // Despawn chip if lifetime expired
        if (this.spawnedChip && (now - this.spawnedChip.spawnedAt > this.chipLifetime)) {
            this.spawnedChip = null;
            this.lastChipSpawnTime = Date.now();
            this.triggerStateUpdate();
        }

        // 2. Update powerups/hacks timers
        if (this.powerMode) {
            this.powerModeTimer -= step;
            if (this.powerModeTimer <= 0) {
                this.powerMode = false;
                this.triggerStateUpdate();
            }
        }

        if (this.activeHack) {
            this.hackTimer -= step;
            if (this.hackTimer <= 0) {
                this.activeHack = null;
                this.triggerStateUpdate();
            }
        }

        // 3. Move Pacman
        this.movePacman();

        // 4. Move Ghosts
        if (this.activeHack !== 'freeze') {
            this.moveGhosts();
        }

        // 5. Collisions & Win conditions
        this.checkCollisions();
    }

    spawnChip() {
        // Find a random dot cell or empty cell
        const vacantCells = [];
        for (let y = 1; y < this.rows - 1; y++) {
            for (let x = 1; x < this.cols - 1; x++) {
                // Ensure it's not a wall, and not inside ghost house (y: 8, 9, 10 around x: 8, 9, 10)
                if (this.map[y][x] !== 1 && !(y >= 7 && y <= 11 && x >= 7 && x <= 11)) {
                    vacantCells.push({ x, y });
                }
            }
        }

        if (vacantCells.length > 0) {
            const cell = vacantCells[Math.floor(Math.random() * vacantCells.length)];
            const types = ['freeze', 'turbo', 'invisibility'];
            const chosenType = types[Math.floor(Math.random() * types.length)];
            this.spawnedChip = {
                x: cell.x,
                y: cell.y,
                type: chosenType,
                spawnedAt: Date.now()
            };
            this.triggerStateUpdate();
        }
    }

    movePacman() {
        const pac = this.pacman;
        const pacX = pac.x;
        const pacY = pac.y;

        // If we have a next direction, try to apply it near grid intersections
        if (pac.nextDirection !== pac.direction) {
            const distFromCenterX = Math.abs(pacX - Math.round(pacX));
            const distFromCenterY = Math.abs(pacY - Math.round(pacY));

            if (distFromCenterX < 0.3 && distFromCenterY < 0.3) {
                let testX = Math.round(pacX);
                let testY = Math.round(pacY);

                switch (pac.nextDirection) {
                    case 'up': testY -= 0.1; break;
                    case 'down': testY += 0.1; break;
                    case 'left': testX -= 0.1; break;
                    case 'right': testX += 0.1; break;
                }

                if (this.canMove(testX, testY)) {
                    // Snap to turn cleanly
                    if (pac.nextDirection === 'up' || pac.nextDirection === 'down') {
                        pac.x = Math.round(pacX);
                    } else {
                        pac.y = Math.round(pacY);
                    }
                    pac.direction = pac.nextDirection;
                }
            }
        }

        // Apply speed boosts during turbo hack
        let currentSpeed = pac.speed;
        if (this.activeHack === 'turbo') {
            currentSpeed *= 1.45;
            // Record tail path for trail effect
            pac.trail.push({ x: pac.x, y: pac.y, time: Date.now() });
            if (pac.trail.length > 8) pac.trail.shift();
        } else {
            pac.trail = [];
        }

        // Advance position
        let newX = pac.x;
        let newY = pac.y;

        switch (pac.direction) {
            case 'up': newY -= currentSpeed; break;
            case 'down': newY += currentSpeed; break;
            case 'left': newX -= currentSpeed; break;
            case 'right': newX += currentSpeed; break;
        }

        // Collision check with safe rollback alignment
        if (this.canMove(newX, newY)) {
            pac.x = newX;
            pac.y = newY;
        } else {
            // Safe alignment: snap to nearest grid point
            const prevX = pac.x;
            const prevY = pac.y;
            pac.x = Math.round(pac.x);
            pac.y = Math.round(pac.y);

            // If snapping grid puts us inside a wall, back off and align
            if (!this.canMove(pac.x, pac.y)) {
                switch (pac.direction) {
                    case 'up': pac.y = Math.ceil(prevY); break;
                    case 'down': pac.y = Math.floor(prevY); break;
                    case 'left': pac.x = Math.ceil(prevX); break;
                    case 'right': pac.x = Math.floor(prevX); break;
                }
                
                // Final safety fallback
                if (!this.canMove(pac.x, pac.y)) {
                    pac.x = prevX;
                    pac.y = prevY;
                }
            }
        }

        // Tunnel wrapping
        if (pac.x < -0.5) pac.x = this.cols - 0.5;
        if (pac.x > this.cols - 0.5) pac.x = -0.5;

        // Mouth animation
        pac.mouthOpen += pac.mouthSpeed;
        if (pac.mouthOpen >= 0.55 || pac.mouthOpen <= 0.05) {
            pac.mouthSpeed = -pac.mouthSpeed;
        }
    }

    moveGhosts() {
        const pacX = this.pacman.x;
        const pacY = this.pacman.y;

        this.ghosts.forEach(ghost => {
            if (ghost.isDead) {
                // Return to house
                const distToHomeX = Math.abs(ghost.x - ghost.startX);
                const distToHomeY = Math.abs(ghost.y - ghost.startY);
                if (distToHomeX < 0.2 && distToHomeY < 0.2) {
                    ghost.isDead = false;
                    ghost.x = ghost.startX;
                    ghost.y = ghost.startY;
                    ghost.speed = (this.difficulty === 'easy' ? 0.045 : (this.difficulty === 'hard' ? 0.07 : 0.06));
                } else {
                    // Fast fly back home
                    ghost.direction = this.findNextBFSMove(ghost, ghost.startX, ghost.startY);
                    ghost.speed = 0.15; // Speed fly back
                }
            } else {
                // Regular ghost movement AI - speed-relative snapping threshold
                const distToGrid = Math.abs(ghost.x - Math.round(ghost.x)) + Math.abs(ghost.y - Math.round(ghost.y));
                const atGridPosition = distToGrid < (ghost.speed * 0.85);

                if (atGridPosition) {
                    // Snap for pathing grid alignment
                    ghost.x = Math.round(ghost.x);
                    ghost.y = Math.round(ghost.y);

                    // Compute routing target based on personality and modes
                    let targetX = pacX;
                    let targetY = pacY;

                    if (this.powerMode) {
                        // Vulnerable ghosts run to corners
                        const corners = [
                            { x: 1, y: 1 },
                            { x: this.cols - 2, y: 1 },
                            { x: 1, y: this.rows - 2 },
                            { x: this.cols - 2, y: this.rows - 2 }
                        ];
                        const corner = corners[ghost.id % corners.length];
                        targetX = corner.x;
                        targetY = corner.y;
                    } else if (this.activeHack === 'invisibility') {
                        // Invisibility Hack: Ghosts lose track of Pacman and wander
                        targetX = 1 + Math.random() * (this.cols - 2);
                        targetY = 1 + Math.random() * (this.rows - 2);
                    } else {
                        // Intelligent targeting personalities
                        switch (ghost.id) {
                            case 0: // Red (Blinky): Aggressive chaser
                                targetX = pacX;
                                targetY = pacY;
                                break;
                            case 2: // Pink (Pinky): Ambush 2 tiles ahead
                                const offsetDist = 2;
                                if (this.pacman.direction === 'up') { targetX = pacX; targetY = pacY - offsetDist; }
                                else if (this.pacman.direction === 'down') { targetX = pacX; targetY = pacY + offsetDist; }
                                else if (this.pacman.direction === 'left') { targetX = pacX - offsetDist; targetY = pacY; }
                                else { targetX = pacX + offsetDist; targetY = pacY; }
                                break;
                            case 1: // Cyan (Inky): Intercept patrol
                                // Combines Blinky's position and Pacman's
                                const redX = this.ghosts[0].x;
                                const redY = this.ghosts[0].y;
                                targetX = pacX + (pacX - redX);
                                targetY = pacY + (pacY - redY);
                                break;
                            case 3: // Orange (Clyde): Wanders if too close, chases if far
                                const dist = Math.sqrt(Math.pow(ghost.x - pacX, 2) + Math.pow(ghost.y - pacY, 2));
                                if (dist < 5) {
                                    targetX = 1;
                                    targetY = this.rows - 2; // bottom left corner
                                } else {
                                    targetX = pacX;
                                    targetY = pacY;
                                }
                                break;
                        }
                    }

                    // Compute routing decision via BFS
                    ghost.direction = this.findNextBFSMove(ghost, targetX, targetY);
                }
            }

            // Apply movement step
            let step = ghost.speed;
            if (this.powerMode && !ghost.isDead) {
                step *= 0.55; // Vulnerable ghosts crawl slowly
            }

            let newX = ghost.x;
            let newY = ghost.y;

            switch (ghost.direction) {
                case 'up': newY -= step; break;
                case 'down': newY += step; break;
                case 'left': newX -= step; break;
                case 'right': newX += step; break;
            }

            // Ghost collision check with safe alignment
            if (this.canMove(newX, newY, true)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // Trap recovery: safe alignment
                const prevX = ghost.x;
                const prevY = ghost.y;
                ghost.x = Math.round(ghost.x);
                ghost.y = Math.round(ghost.y);

                if (!this.canMove(ghost.x, ghost.y, true)) {
                    switch (ghost.direction) {
                        case 'up': ghost.y = Math.ceil(prevY); break;
                        case 'down': ghost.y = Math.floor(prevY); break;
                        case 'left': ghost.x = Math.ceil(prevX); break;
                        case 'right': ghost.x = Math.floor(prevX); break;
                    }
                    if (!this.canMove(ghost.x, ghost.y, true)) {
                        ghost.x = prevX;
                        ghost.y = prevY;
                    }
                }

                // Force random direction change since we hit a wall
                const dirs = ['up', 'down', 'left', 'right'];
                ghost.direction = dirs[Math.floor(Math.random() * dirs.length)];
            }

            // Tunnels wrap
            if (ghost.x < -0.5) ghost.x = this.cols - 0.5;
            if (ghost.x > this.cols - 0.5) ghost.x = -0.5;
        });
    }

    checkCollisions() {
        const pac = this.pacman;
        const gridX = Math.floor(pac.x + 0.5);
        const gridY = Math.floor(pac.y + 0.5);

        if (!this.isValidGridPosition(gridX, gridY)) return;

        // 1. Consume normal dots
        if (this.map[gridY][gridX] === 2) {
            this.map[gridY][gridX] = 0;
            this.score += 10;
            this.dotsLeft--;
            sound.playWaka();
            this.checkWinCondition();
            this.triggerStateUpdate();
        }

        // 2. Consume power pellets
        if (this.map[gridY][gridX] === 3) {
            this.map[gridY][gridX] = 0;
            this.score += 50;
            this.dotsLeft--;
            this.powerMode = true;
            this.powerModeTimer = this.powerModeDuration;
            sound.playWaka();
            this.checkWinCondition();
            this.triggerStateUpdate();
        }

        // 3. Consume Cyber-Hack Chips
        if (this.spawnedChip) {
            const distToChip = Math.sqrt(Math.pow(pac.x - this.spawnedChip.x, 2) + Math.pow(pac.y - this.spawnedChip.y, 2));
            if (distToChip < 0.8) {
                // Hack triggered!
                this.activeHack = this.spawnedChip.type;
                this.hackTimer = this.hackDuration;
                this.score += 100;
                sound.playHackPickup();
                
                // Clear chip
                this.spawnedChip = null;
                this.lastChipSpawnTime = Date.now();
                this.triggerStateUpdate();
            }
        }

        // 4. Ghost collision
        this.ghosts.forEach(ghost => {
            const distToGhost = Math.sqrt(Math.pow(pac.x - ghost.x, 2) + Math.pow(pac.y - ghost.y, 2));
            if (distToGhost < 0.7) {
                if (ghost.isDead) return;

                if (this.powerMode) {
                    // Eat ghost!
                    ghost.isDead = true;
                    this.score += 200;
                    sound.playGhostEat();
                    this.triggerStateUpdate();
                } else if (this.activeHack === 'invisibility') {
                    // Invulnerable / Ghost cannot see Pacman. Pass through!
                } else {
                    // Death!
                    this.lives--;
                    sound.playDeath();
                    if (this.lives <= 0) {
                        this.gameOver = true;
                        sound.stopSiren();
                        this.saveHighScore();
                    } else {
                        this.resetPositions();
                    }
                    this.triggerStateUpdate();
                }
            }
        });
    }

    resetPositions() {
        const config = MAPS[this.mapType] || MAPS.core;
        
        // Reset Pacman
        this.pacman.x = config.pacmanStart.x;
        this.pacman.y = config.pacmanStart.y;
        this.pacman.direction = 'right';
        this.pacman.nextDirection = 'right';
        this.pacman.trail = [];

        // Reset Ghosts
        this.ghosts.forEach(ghost => {
            ghost.x = ghost.startX;
            ghost.y = ghost.startY;
            ghost.direction = 'up';
            ghost.isDead = false;
            ghost.speed = (this.difficulty === 'easy' ? 0.045 : (this.difficulty === 'hard' ? 0.07 : 0.06)) * (0.9 + Math.random() * 0.2);
        });

        // Force spacing
        this.ghosts.forEach(g => {
            if (g.direction === 'right') g.x += 0.1;
            if (g.direction === 'left') g.x -= 0.1;
            if (g.direction === 'down') g.y += 0.1;
            if (g.direction === 'up') g.y -= 0.1;
        });
    }

    checkWinCondition() {
        if (this.dotsLeft <= 0) {
            this.win = true;
            sound.stopSiren();
            sound.playWin();
            this.saveHighScore();
        }
    }

    saveHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem('pacman_highScore', this.highScore.toString());
        }
    }
}
