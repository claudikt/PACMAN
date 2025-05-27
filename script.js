class Pacman {
    // Color utility methods
    lightenColor(color, percent) {
        // Convert hex to RGB
        let r, g, b;
        if (color.charAt(0) === '#') {
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
        } else {
            // Handle rgb/rgba strings
            const rgbMatch = color.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\)$/i);
            if (rgbMatch) {
                r = parseInt(rgbMatch[1], 10);
                g = parseInt(rgbMatch[2], 10);
                b = parseInt(rgbMatch[3], 10);
            } else {
                return color; // Return original if format not recognized
            }
        }
        
        // Increase each component by percent
        r = Math.min(255, Math.floor(r * (1 + percent / 100)));
        g = Math.min(255, Math.floor(g * (1 + percent / 100)));
        b = Math.min(255, Math.floor(b * (1 + percent / 100)));
        
        // Convert back to hex
        return `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
    }
    
    darkenColor(color, percent) {
        // Convert hex to RGB
        let r, g, b;
        if (color.charAt(0) === '#') {
            r = parseInt(color.substring(1, 3), 16);
            g = parseInt(color.substring(3, 5), 16);
            b = parseInt(color.substring(5, 7), 16);
        } else {
            // Handle rgb/rgba strings
            const rgbMatch = color.match(/^rgba?\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*[\d.]+)?\)$/i);
            if (rgbMatch) {
                r = parseInt(rgbMatch[1], 10);
                g = parseInt(rgbMatch[2], 10);
                b = parseInt(rgbMatch[3], 10);
            } else {
                return color; // Return original if format not recognized
            }
        }
        
        // Decrease each component by percent
        r = Math.max(0, Math.floor(r * (1 - percent / 100)));
        g = Math.max(0, Math.floor(g * (1 - percent / 100)));
        b = Math.max(0, Math.floor(b * (1 - percent / 100)));
        
        // Convert back to hex
        return `#${(r).toString(16).padStart(2, '0')}${(g).toString(16).padStart(2, '0')}${(b).toString(16).padStart(2, '0')}`;
    }
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.tileSize = 20;
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.paused = false;
        
        // Initialize game state
        this.initializeGame();
        
        // Event listeners
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        this.setupControls();
        
        // Game loop with improved timing but lower FPS for slower gameplay
        this.lastTime = 0;
        this.accumulator = 0;
        this.timestep = 1000/90; // 90 FPS - balanced between smoothness and speed
        
        // Start screen initially visible
        document.getElementById('startBtn').addEventListener('click', () => {
            document.getElementById('startScreen').classList.add('hidden');
            this.startGame();
        });
        
        document.getElementById('restartGameBtn').addEventListener('click', () => {
            document.getElementById('gameOverScreen').classList.add('hidden');
            this.resetGame();
        });
    }

    initializeGame() {
        // Map layout: 0 = empty, 1 = wall, 2 = dot, 3 = power pellet
        this.map = [
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 3, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 3, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1],
            [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 2, 1, 1, 1, 0, 1, 0, 1, 1, 1, 2, 1, 1, 1, 1],
            [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
            [1, 1, 1, 1, 2, 1, 0, 1, 1, 0, 1, 1, 0, 1, 2, 1, 1, 1, 1],
            [0, 0, 0, 0, 2, 0, 0, 1, 0, 0, 0, 1, 0, 0, 2, 0, 0, 0, 0],
            [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
            [0, 0, 0, 1, 2, 1, 0, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0, 0],
            [1, 1, 1, 1, 2, 1, 0, 1, 1, 1, 1, 1, 0, 1, 2, 1, 1, 1, 1],
            [1, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 1],
            [1, 2, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 2, 1],
            [1, 3, 2, 1, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 1, 2, 3, 1],
            [1, 1, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 1, 1],
            [1, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 1],
            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
        ];
        
        // Initialize pacman with better controls and slower speed
        this.pacman = {
            x: 9,
            y: 15,
            direction: 'right',
            nextDirection: 'right',
            speed: 0.08,          // Reduced speed for more controlled gameplay
            mouthOpen: 0.2,
            mouthSpeed: 0.02,     // Slower animation speed
            isAtGridCenter: true,  // Track if pacman is at grid center
            pendingTurn: false,    // For better turn responsiveness
            lastKeyTime: 0         // Track key press timing for responsive controls
        };
        
        // Initialize ghosts with better positioning and speeds
        this.ghosts = [
            { x: 9, y: 9, direction: 'right', speed: 0.06, color: '#FF0000', lastDecision: 0 }, // Red
            { x: 8, y: 9, direction: 'left', speed: 0.055, color: '#00FFFF', lastDecision: 0 },  // Cyan
            { x: 10, y: 9, direction: 'right', speed: 0.065, color: '#FFB8FF', lastDecision: 0 }, // Pink
            { x: 9, y: 8, direction: 'up', speed: 0.06, color: '#FFB852', lastDecision: 0 }     // Orange
        ];
        
        // Force initial movement to get out of center
        this.ghosts[0].x += 0.3; // Red - move right
        this.ghosts[1].x -= 0.3; // Cyan - move left
        this.ghosts[2].y += 0.3; // Pink - move down
        this.ghosts[3].y -= 0.3; // Orange - move up
        
        // Power mode
        this.powerMode = false;
        this.powerModeTimer = 0;
        this.powerModeDuration = 10000; // 10 seconds
        
        // Count dots
        this.dotsLeft = this.countDots();
    }

    countDots() {
        let count = 0;
        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                if(this.map[y][x] === 2 || this.map[y][x] === 3) {
                    count++;
                }
            }
        }
        return count;
    }

    setupControls() {
        // Keyboard controls are set in handleKeyPress
        
        // Button controls
        document.getElementById('playBtn').addEventListener('click', () => {
            if (this.gameOver || this.paused) {
                this.paused = false;
                this.startGame();
            }
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        // Mobile controls
        document.getElementById('upBtn').addEventListener('click', () => {
            this.pacman.nextDirection = 'up';
        });
        
        document.getElementById('downBtn').addEventListener('click', () => {
            this.pacman.nextDirection = 'down';
        });
        
        document.getElementById('leftBtn').addEventListener('click', () => {
            this.pacman.nextDirection = 'left';
        });
        
        document.getElementById('rightBtn').addEventListener('click', () => {
            this.pacman.nextDirection = 'right';
        });
    }

    handleKeyPress(e) {
        if (this.gameOver) return;
        
        let newDirection = null;
        
        switch(e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                newDirection = 'up';
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                newDirection = 'down';
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                newDirection = 'left';
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                newDirection = 'right';
                break;
            case 'p':
            case 'P':
                this.togglePause();
                break;
        }
        
        if (newDirection) {
            // Set the next direction
            this.pacman.nextDirection = newDirection;
            
            // For immediate response, try changing direction right away
            this.tryChangeDirection();
            
            // Prevent default to avoid scrolling with arrow keys
            e.preventDefault();
        }
    }
    
    // New method to attempt direction change immediately on key press
    tryChangeDirection() {
        // If no direction change is requested, don't do anything
        if (this.pacman.direction === this.pacman.nextDirection) return;
        
        // For reversing direction, always allow immediate change
        if ((this.pacman.direction === 'up' && this.pacman.nextDirection === 'down') ||
            (this.pacman.direction === 'down' && this.pacman.nextDirection === 'up') ||
            (this.pacman.direction === 'left' && this.pacman.nextDirection === 'right') ||
            (this.pacman.direction === 'right' && this.pacman.nextDirection === 'left')) {
            this.pacman.direction = this.pacman.nextDirection;
            return;
        }
        
        // Check if we're near a grid intersection
        const pacX = this.pacman.x;
        const pacY = this.pacman.y;
        const distFromCenterX = Math.abs(pacX - Math.round(pacX));
        const distFromCenterY = Math.abs(pacY - Math.round(pacY));
        
        // Allow turns if close to center point (more forgiving)
        if (distFromCenterX < 0.25 && distFromCenterY < 0.25) {
            // Try to turn at this position
            let testX = Math.round(pacX);
            let testY = Math.round(pacY);
            
            switch(this.pacman.nextDirection) {
                case 'up': testY -= 0.1; break;
                case 'down': testY += 0.1; break;
                case 'left': testX -= 0.1; break;
                case 'right': testX += 0.1; break;
            }
            
            if (this.canMove(testX, testY)) {
                // Snap to grid for clean turn
                this.pacman.x = Math.round(pacX);
                this.pacman.y = Math.round(pacY);
                this.pacman.direction = this.pacman.nextDirection;
            }
        }
    }

    canMove(x, y) {
        // Simpler collision detection that won't prevent movement
        
        // Get the grid cell that the center point is in
        const centerGridX = Math.floor(x);
        const centerGridY = Math.floor(y);
        
        // Check if the center position is valid
        if (centerGridX < 0 || centerGridX >= this.map[0].length || 
            centerGridY < 0 || centerGridY >= this.map.length) {
            return false;
        }
        
        // Check if the center position contains a wall
        if (this.map[centerGridY][centerGridX] === 1) {
            return false;
        }
        
        // Add a small buffer only in the direction of movement
        // to prevent clipping into walls, but allow movement in corridors
        const buffer = 0.35; // Reduced buffer size
        
        // Determine which edge points to check based on current direction
        let checkPoints = [];
        
        // Add check points based on position within grid cell
        const fracX = x - Math.floor(x);
        const fracY = y - Math.floor(y);
        
        // Right edge check
        if (fracX > 0.7) {
            checkPoints.push({ x: Math.ceil(x), y: Math.floor(y + 0.5) });
        }
        // Left edge check
        if (fracX < 0.3) {
            checkPoints.push({ x: Math.floor(x), y: Math.floor(y + 0.5) });
        }
        // Bottom edge check
        if (fracY > 0.7) {
            checkPoints.push({ x: Math.floor(x + 0.5), y: Math.ceil(y) });
        }
        // Top edge check
        if (fracY < 0.3) {
            checkPoints.push({ x: Math.floor(x + 0.5), y: Math.floor(y) });
        }
        
        // Check if any of these points are in walls
        for (const point of checkPoints) {
            if (point.x < 0 || point.x >= this.map[0].length || 
                point.y < 0 || point.y >= this.map.length) {
                continue; // Skip out of bounds points
            }
            
            if (this.map[point.y][point.x] === 1) {
                return false;
            }
        }
        
        return true;
    }

    moveGhosts() {
        for(let ghost of this.ghosts) {
            // Current position
            let currentX = ghost.x;
            let currentY = ghost.y;
            
            // Possible directions
            const directions = ['up', 'down', 'left', 'right'];
            
            // Check if we're at a grid position (or very close)
            const atGridPosition = Math.abs(currentX - Math.round(currentX)) < 0.05 && 
                                  Math.abs(currentY - Math.round(currentY)) < 0.05;
            
            // If at a grid center or hitting a wall, maybe change direction
            if(atGridPosition) {
                // Snap to grid for precision
                ghost.x = Math.round(currentX);
                ghost.y = Math.round(currentY);
                currentX = ghost.x;
                currentY = ghost.y;
                
                // Don't go back the way we came if possible
                let possibleDirections = directions.filter(dir => {
                    if((dir === 'up' && ghost.direction === 'down') ||
                       (dir === 'down' && ghost.direction === 'up') ||
                       (dir === 'left' && ghost.direction === 'right') ||
                       (dir === 'right' && ghost.direction === 'left')) {
                        return false;
                    }
                    
                    // Check if direction is valid with a smaller step
                    let testX = currentX;
                    let testY = currentY;
                    
                    switch(dir) {
                        case 'up': testY -= 0.5; break;
                        case 'down': testY += 0.5; break;
                        case 'left': testX -= 0.5; break;
                        case 'right': testX += 0.5; break;
                    }
                    
                    return this.canMove(testX, testY);
                });
                
                // If trapped, allow reversing
                if(possibleDirections.length === 0) {
                    possibleDirections = directions.filter(dir => {
                        let testX = currentX;
                        let testY = currentY;
                        
                        switch(dir) {
                            case 'up': testY -= 0.5; break;
                            case 'down': testY += 0.5; break;
                            case 'left': testX -= 0.5; break;
                            case 'right': testX += 0.5; break;
                        }
                        
                        return this.canMove(testX, testY);
                    });
                }
                
                // Choose new direction
                if(possibleDirections.length > 0) {
                    // Always pick a valid direction when at grid position
                    if(this.powerMode) {
                        // In power mode, ghosts try to run away
                        ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                    } else {
                        // Otherwise, try to chase pacman with some randomness
                        let pacmanX = this.pacman.x;
                        let pacmanY = this.pacman.y;
                        
                        // Calculate scores for each direction based on distance to pacman
                        const directionScores = [];
                        
                        for(let dir of possibleDirections) {
                            let newX = currentX;
                            let newY = currentY;
                            
                            switch(dir) {
                                case 'up': newY -= 1; break;
                                case 'down': newY += 1; break;
                                case 'left': newX -= 1; break;
                                case 'right': newX += 1; break;
                            }
                            
                            // Calculate distance to pacman
                            const dx = pacmanX - newX;
                            const dy = pacmanY - newY;
                            const distanceSquared = dx * dx + dy * dy;
                            
                            directionScores.push({
                                direction: dir,
                                score: this.powerMode ? distanceSquared : -distanceSquared
                            });
                        }
                        
                        // Sort by score
                        directionScores.sort((a, b) => b.score - a.score);
                        
                        // 70% chance to choose the best direction, 30% to choose random
                        if(Math.random() < 0.7 && directionScores.length > 0) {
                            ghost.direction = directionScores[0].direction;
                        } else {
                            ghost.direction = possibleDirections[Math.floor(Math.random() * possibleDirections.length)];
                        }
                    }
                }
            }
            
            // Move ghost in current direction
            let newX = ghost.x;
            let newY = ghost.y;
            
            switch(ghost.direction) {
                case 'up': newY -= ghost.speed; break;
                case 'down': newY += ghost.speed; break;
                case 'left': newX -= ghost.speed; break;
                case 'right': newX += ghost.speed; break;
            }
            
            // Check if new position is valid
            if(this.canMove(newX, newY)) {
                ghost.x = newX;
                ghost.y = newY;
            } else {
                // If we hit a wall, we need to choose a new direction
                // First, make sure we're on a grid position
                ghost.x = Math.round(ghost.x);
                ghost.y = Math.round(ghost.y);
                
                // Then find valid directions
                const validDirections = [];
                for(let dir of directions) {
                    let testX = ghost.x;
                    let testY = ghost.y;
                    
                    switch(dir) {
                        case 'up': testY -= 0.5; break;
                        case 'down': testY += 0.5; break;
                        case 'left': testX -= 0.5; break;
                        case 'right': testX += 0.5; break;
                    }
                    
                    if(this.canMove(testX, testY)) {
                        validDirections.push(dir);
                    }
                }
                
                // Pick a new direction if possible
                if(validDirections.length > 0) {
                    ghost.direction = validDirections[Math.floor(Math.random() * validDirections.length)];
                    
                    // Move a tiny bit in the new direction to get unstuck
                    switch(ghost.direction) {
                        case 'up': ghost.y -= 0.1; break;
                        case 'down': ghost.y += 0.1; break;
                        case 'left': ghost.x -= 0.1; break;
                        case 'right': ghost.x += 0.1; break;
                    }
                }
            }
            
            // Tunnel wrap
            if(ghost.x < 0) ghost.x = this.map[0].length - 1;
            if(ghost.x >= this.map[0].length) ghost.x = 0;
        }
    }

    checkCollisions() {
        // Current tile position
        const pacmanX = Math.floor(this.pacman.x);
        const pacmanY = Math.floor(this.pacman.y);
        
        // Check for dot collection
        if(this.map[pacmanY][pacmanX] === 2) {
            this.map[pacmanY][pacmanX] = 0;
            this.score += 10;
            this.dotsLeft--;
        }
        
        // Check for power pellet
        if(this.map[pacmanY][pacmanX] === 3) {
            this.map[pacmanY][pacmanX] = 0;
            this.score += 50;
            this.dotsLeft--;
            this.powerMode = true;
            this.powerModeTimer = this.powerModeDuration;
        }
        
        // Update power mode timer
        if(this.powerMode) {
            this.powerModeTimer -= this.timestep;
            if(this.powerModeTimer <= 0) {
                this.powerMode = false;
            }
        }
        
        // Check for ghost collisions
        for(let i = 0; i < this.ghosts.length; i++) {
            const ghost = this.ghosts[i];
            const dx = this.pacman.x - ghost.x;
            const dy = this.pacman.y - ghost.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if(distance < 0.7) { // Close enough for collision
                if(this.powerMode) {
                    // Eat ghost
                    this.score += 200;
                    this.resetGhostPosition(ghost);
                } else {
                    // Lose a life
                    this.lives--;
                    if(this.lives <= 0) {
                        this.gameOver = true;
                        document.getElementById('gameOverScreen').classList.remove('hidden');
                        document.getElementById('finalScore').textContent = this.score;
                    } else {
                        this.resetPositions();
                    }
                    break;
                }
            }
        }
    }

    resetGhostPosition(ghost) {
        ghost.x = 9;
        ghost.y = 9;
    }

    resetPositions() {
        // Reset pacman position
        this.pacman.x = 9;
        this.pacman.y = 15;
        this.pacman.direction = 'right';
        this.pacman.nextDirection = 'right';
        
        // Reset ghost positions
        this.ghosts[0].x = 9;
        this.ghosts[0].y = 9;
        this.ghosts[1].x = 8;
        this.ghosts[1].y = 9;
        this.ghosts[2].x = 10;
        this.ghosts[2].y = 9;
        this.ghosts[3].x = 9;
        this.ghosts[3].y = 8;
    }

    togglePause() {
        this.paused = !this.paused;
        if (!this.paused) {
            // Reset timing when unpausing
            this.lastTime = 0;
        }
    }

    update(timestamp) {
        // First update, just set the time
        if(this.lastTime === 0) {
            this.lastTime = timestamp;
            return;
        }
        
        // Calculate delta time
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;
        
        // Add to accumulator
        this.accumulator += deltaTime;
        
        // Fixed timestep updates
        while(this.accumulator >= this.timestep) {
            // Enhanced direction change logic for better responsiveness
            const pacX = this.pacman.x;
            const pacY = this.pacman.y;
            
            // Calculate how close we are to grid center
            const distFromCenterX = Math.abs(pacX - Math.round(pacX));
            const distFromCenterY = Math.abs(pacY - Math.round(pacY));
            
            // Consider 'close enough' to center for turns
            const closeToCenter = distFromCenterX < 0.1 && distFromCenterY < 0.1;
            this.pacman.isAtGridCenter = closeToCenter;
            
                // Use the more responsive direction change logic
            if (this.pacman.nextDirection !== this.pacman.direction) {
                // More forgiving turn window - allow turns slightly before/after grid centers
                if (distFromCenterX < 0.3 && distFromCenterY < 0.3) {
                    let testX = Math.round(pacX);
                    let testY = Math.round(pacY);
                    
                    // Snap to grid center depending on current and next direction
                    if ((this.pacman.nextDirection === 'up' || this.pacman.nextDirection === 'down') && 
                        (this.pacman.direction === 'left' || this.pacman.direction === 'right')) {
                        // Align to column when turning up/down from left/right
                        this.pacman.x = Math.round(pacX);
                    } else if ((this.pacman.nextDirection === 'left' || this.pacman.nextDirection === 'right') && 
                               (this.pacman.direction === 'up' || this.pacman.direction === 'down')) {
                        // Align to row when turning left/right from up/down
                        this.pacman.y = Math.round(pacY);
                    }
                    
                    // Test if new direction is valid
                    switch(this.pacman.nextDirection) {
                        case 'up': testY -= 0.1; break;
                        case 'down': testY += 0.1; break;
                        case 'left': testX -= 0.1; break;
                        case 'right': testX += 0.1; break;
                    }
                    
                    if(this.canMove(testX, testY)) {
                        this.pacman.direction = this.pacman.nextDirection;
                    }
                }
                // Even if not close to center, allow reverse direction immediately
                else if ((this.pacman.direction === 'up' && this.pacman.nextDirection === 'down') ||
                         (this.pacman.direction === 'down' && this.pacman.nextDirection === 'up') ||
                         (this.pacman.direction === 'left' && this.pacman.nextDirection === 'right') ||
                         (this.pacman.direction === 'right' && this.pacman.nextDirection === 'left')) {
                    this.pacman.direction = this.pacman.nextDirection;
                }
                // Look ahead for the next intersection and predict if turn will be valid
                else {
                    // Determine the next grid intersection based on current direction
                    let nextIntersectionX = pacX;
                    let nextIntersectionY = pacY;
                    
                    switch(this.pacman.direction) {
                        case 'right': nextIntersectionX = Math.ceil(pacX); break;
                        case 'left': nextIntersectionX = Math.floor(pacX); break;
                        case 'down': nextIntersectionY = Math.ceil(pacY); break;
                        case 'up': nextIntersectionY = Math.floor(pacY); break;
                    }
                    
                    // Calculate distance to next intersection
                    const distToIntersection = Math.sqrt(
                        Math.pow(nextIntersectionX - pacX, 2) + 
                        Math.pow(nextIntersectionY - pacY, 2)
                    );
                    
                    // If very close to next intersection, pre-check if turn will be valid
                    if (distToIntersection < 0.5) {
                        let testX = nextIntersectionX;
                        let testY = nextIntersectionY;
                        
                        switch(this.pacman.nextDirection) {
                            case 'up': testY -= 0.1; break;
                            case 'down': testY += 0.1; break;
                            case 'left': testX -= 0.1; break;
                            case 'right': testX += 0.1; break;
                        }
                        
                        // Store next valid turn for executing when we reach the intersection
                        if(this.canMove(testX, testY)) {
                            // We'll turn at the intersection, but don't change direction yet
                            // This makes the game appear more responsive even though the actual
                            // turn happens at the intersection
                            this.pacman.pendingTurn = true;
                        }
                    }
                }
            }
            
            // Move in current direction with improved collision handling
            let newX = this.pacman.x;
            let newY = this.pacman.y;
            
            switch(this.pacman.direction) {
                case 'up': newY -= this.pacman.speed; break;
                case 'down': newY += this.pacman.speed; break;
                case 'left': newX -= this.pacman.speed; break;
                case 'right': newX += this.pacman.speed; break;
            }
            
            // Check if new position is valid
            if(this.canMove(newX, newY)) {
                this.pacman.x = newX;
                this.pacman.y = newY;
                
                // Look ahead for the next turn opportunity with more responsive thresholds
                if (this.pacman.nextDirection !== this.pacman.direction) {
                    // More forgiving turn threshold
                    const nearGridX = Math.abs(this.pacman.x - Math.round(this.pacman.x)) < 0.3;
                    const nearGridY = Math.abs(this.pacman.y - Math.round(this.pacman.y)) < 0.3;
                    
                    // If we're nearing a grid point, or we have a pending turn from earlier look-ahead
                    if ((nearGridX && nearGridY) || this.pacman.pendingTurn) {
                        let testX = Math.round(this.pacman.x);
                        let testY = Math.round(this.pacman.y);
                        
                        switch(this.pacman.nextDirection) {
                            case 'up': testY -= 0.1; break;
                            case 'down': testY += 0.1; break;
                            case 'left': testX -= 0.1; break;
                            case 'right': testX += 0.1; break;
                        }
                        
                        if(this.canMove(testX, testY)) {
                            // Improved grid snapping to avoid getting stuck
                            // First completely snap to grid position
                            if (this.pacman.nextDirection === 'up' || this.pacman.nextDirection === 'down') {
                                this.pacman.x = Math.round(this.pacman.x);
                            } else {
                                this.pacman.y = Math.round(this.pacman.y);
                            }
                            
                            // Then validate the position again to be safe
                            if (this.canMove(this.pacman.x, this.pacman.y)) {
                                this.pacman.direction = this.pacman.nextDirection;
                                this.pacman.pendingTurn = false;
                            }
                        }
                    }
                }
            } else {
                // If hit wall, use a safer approach to reset position
                const prevX = this.pacman.x;
                const prevY = this.pacman.y;
                
                // Try aligning to nearest grid position
                this.pacman.x = Math.round(this.pacman.x);
                this.pacman.y = Math.round(this.pacman.y);
                
                // If that doesn't work, try floor/ceil depending on direction
                if (!this.canMove(this.pacman.x, this.pacman.y)) {
                    switch(this.pacman.direction) {
                        case 'up': 
                            this.pacman.y = Math.ceil(prevY);
                            break;
                        case 'down': 
                            this.pacman.y = Math.floor(prevY);
                            break;
                        case 'left': 
                            this.pacman.x = Math.ceil(prevX);
                            break;
                        case 'right': 
                            this.pacman.x = Math.floor(prevX);
                            break;
                    }
                    
                    // One final check to make sure we're not in a wall
                    if (!this.canMove(this.pacman.x, this.pacman.y)) {
                        // Last resort - revert to previous position
                        this.pacman.x = prevX;
                        this.pacman.y = prevY;
                    }
                }
                
                // Now try the requested direction change if any
                if (this.pacman.nextDirection !== this.pacman.direction) {
                    let testX = this.pacman.x;
                    let testY = this.pacman.y;
                    
                    switch(this.pacman.nextDirection) {
                        case 'up': testY -= 0.1; break;
                        case 'down': testY += 0.1; break;
                        case 'left': testX -= 0.1; break;
                        case 'right': testX += 0.1; break;
                    }
                    
                    if(this.canMove(testX, testY)) {
                        this.pacman.direction = this.pacman.nextDirection;
                    }
                }
            }
            
            // Tunnel wrap
            if(this.pacman.x < 0) this.pacman.x = this.map[0].length - 1;
            if(this.pacman.x >= this.map[0].length) this.pacman.x = 0;
            
            // Update mouth animation
            this.pacman.mouthOpen += this.pacman.mouthSpeed;
            if(this.pacman.mouthOpen >= 0.5 || this.pacman.mouthOpen <= 0) {
                this.pacman.mouthSpeed = -this.pacman.mouthSpeed;
            }
            
            // Update game state
            this.moveGhosts();
            this.checkCollisions();
            
            // Update HUD
            this.updateHUD();
            
            // Check win condition
            this.checkWinCondition();
            
            this.accumulator -= this.timestep;
        }
    }

    updateHUD() {
        document.getElementById('score').textContent = this.score;
        document.getElementById('lives').textContent = this.lives;
    }

    checkWinCondition() {
        if(this.dotsLeft === 0) {
            this.gameOver = true;
            document.getElementById('gameOverScreen').classList.remove('hidden');
            document.getElementById('finalScore').textContent = this.score;
        }
    }

    draw() {
        if (this.gameOver) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw map
        this.drawMap();
        
        // Draw Pacman
        this.ctx.save();
        this.ctx.translate(
            this.pacman.x * this.tileSize + this.tileSize/2, 
            this.pacman.y * this.tileSize + this.tileSize/2
        );
        
        switch(this.pacman.direction) {
            case 'up': this.ctx.rotate(-Math.PI/2); break;
            case 'down': this.ctx.rotate(Math.PI/2); break;
            case 'left': this.ctx.rotate(Math.PI); break;
        }
        
        // Create a radial gradient for Pacman
        const pacGradient = this.ctx.createRadialGradient(
            0, 0, 0,
            0, 0, this.tileSize/2 - 2
        );
        pacGradient.addColorStop(0, '#ffff00');
        pacGradient.addColorStop(0.8, '#ffd600');
        pacGradient.addColorStop(1, '#ffab00');
        
        this.ctx.fillStyle = pacGradient;
        this.ctx.beginPath();
        this.ctx.arc(
            0, 
            0, 
            this.tileSize/2 - 2, 
            this.pacman.mouthOpen * Math.PI, 
            (2 - this.pacman.mouthOpen) * Math.PI
        );
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
        
        // Add a glow effect
        this.ctx.shadowColor = '#ffff00';
        this.ctx.shadowBlur = 8;
        this.ctx.beginPath();
        this.ctx.arc(
            0, 
            0, 
            this.tileSize/2 - 2, 
            this.pacman.mouthOpen * Math.PI, 
            (2 - this.pacman.mouthOpen) * Math.PI
        );
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
        this.ctx.restore();
        
        // Draw ghosts
        for(let ghost of this.ghosts) {
            // Ghost body with gradient and glow
            const ghostX = ghost.x * this.tileSize + this.tileSize/2;
            const ghostY = ghost.y * this.tileSize + this.tileSize/2;
            const ghostRadius = this.tileSize/2 - 2;
            
            // Create gradient
            const ghostGradient = this.ctx.createRadialGradient(
                ghostX, ghostY - 2, 0,
                ghostX, ghostY, ghostRadius
            );
            
            if (this.powerMode) {
                // Vulnerable ghost gradient (blue with pulse)
                const pulseIntensity = 0.7 + 0.3 * Math.sin(Date.now() / 200);
                ghostGradient.addColorStop(0, '#5050ff');
                ghostGradient.addColorStop(0.6, '#3030ff');
                ghostGradient.addColorStop(1, '#0000ff');
                this.ctx.shadowColor = 'rgba(0, 0, 255, ' + pulseIntensity + ')';
            } else {
                // Normal ghost gradient
                const baseColor = ghost.color;
                // Create lighter and darker versions of the base color
                const lighterColor = this.lightenColor(baseColor, 30);
                const darkerColor = this.darkenColor(baseColor, 20);
                
                ghostGradient.addColorStop(0, lighterColor);
                ghostGradient.addColorStop(0.6, baseColor);
                ghostGradient.addColorStop(1, darkerColor);
                this.ctx.shadowColor = baseColor;
            }
            
            // Draw ghost with glow
            this.ctx.shadowBlur = 10;
            this.ctx.fillStyle = ghostGradient;
            this.ctx.beginPath();
            this.ctx.arc(
                ghostX,
                ghostY,
                ghostRadius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
            
            // Ghost eyes
            this.ctx.fillStyle = 'white';
            const eyeOffset = 3;
            const eyeRadius = 2;
            
            // Left eye
            this.ctx.beginPath();
            this.ctx.arc(
                ghost.x * this.tileSize + this.tileSize/2 - eyeOffset,
                ghost.y * this.tileSize + this.tileSize/2 - 2,
                eyeRadius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Right eye
            this.ctx.beginPath();
            this.ctx.arc(
                ghost.x * this.tileSize + this.tileSize/2 + eyeOffset,
                ghost.y * this.tileSize + this.tileSize/2 - 2,
                eyeRadius,
                0,
                Math.PI * 2
            );
            this.ctx.fill();
            
            // Draw scared expression when in power mode
            if (this.powerMode) {
                this.ctx.strokeStyle = 'white';
                this.ctx.lineWidth = 1;
                this.ctx.beginPath();
                this.ctx.moveTo(
                    ghost.x * this.tileSize + this.tileSize/2 - 4,
                    ghost.y * this.tileSize + this.tileSize/2 + 3
                );
                this.ctx.lineTo(
                    ghost.x * this.tileSize + this.tileSize/2 + 4,
                    ghost.y * this.tileSize + this.tileSize/2 + 3
                );
                this.ctx.stroke();
            }
        }
        
        // Draw pause overlay if paused with scanlines effect
        if (this.paused) {
            // Semi-transparent overlay
            this.ctx.fillStyle = 'rgba(8, 8, 33, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Draw scanlines
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
            for (let i = 0; i < this.canvas.height; i += 4) {
                this.ctx.fillRect(0, i, this.canvas.width, 2);
            }
            
            // Glowing PAUSED text
            const pauseTextX = this.canvas.width/2;
            const pauseTextY = this.canvas.height/2;
            
            // Text shadow/glow
            this.ctx.font = '30px "Press Start 2P", cursive';
            this.ctx.textAlign = 'center';
            this.ctx.fillStyle = 'rgba(0, 255, 255, 0.5)';
            this.ctx.fillText('PAUSED', pauseTextX + 2, pauseTextY + 2);
            
            // Magenta offset (glitch effect)
            this.ctx.fillStyle = 'rgba(255, 0, 255, 0.5)';
            this.ctx.fillText('PAUSED', pauseTextX - 2, pauseTextY - 2);
            
            // Main text
            this.ctx.fillStyle = '#00ffff';
            this.ctx.fillText('PAUSED', pauseTextX, pauseTextY);
            
            // Reset alignment
            this.ctx.textAlign = 'start';
        }
    }

    drawMap() {
        for(let y = 0; y < this.map.length; y++) {
            for(let x = 0; x < this.map[y].length; x++) {
                const cell = this.map[y][x];
                const centerX = x * this.tileSize + this.tileSize/2;
                const centerY = y * this.tileSize + this.tileSize/2;
                
                switch(cell) {
                    case 1: // Wall
                        // Create a gradient for the walls
                        const wallGradient = this.ctx.createLinearGradient(
                            x * this.tileSize,
                            y * this.tileSize,
                            x * this.tileSize + this.tileSize,
                            y * this.tileSize + this.tileSize
                        );
                        wallGradient.addColorStop(0, '#1a237e');
                        wallGradient.addColorStop(1, '#3949ab');
                        
                        this.ctx.fillStyle = wallGradient;
                        this.ctx.fillRect(
                            x * this.tileSize, 
                            y * this.tileSize, 
                            this.tileSize, 
                            this.tileSize
                        );
                        
                        // Add animated neon edge
                        const pulseIntensity = 0.7 + 0.3 * Math.sin(Date.now() / 500);
                        this.ctx.strokeStyle = `rgba(0, 255, 255, ${pulseIntensity})`;
                        this.ctx.lineWidth = 1;
                        this.ctx.strokeRect(
                            x * this.tileSize, 
                            y * this.tileSize, 
                            this.tileSize, 
                            this.tileSize
                        );
                        break;
                    case 2: // Dot
                        this.ctx.fillStyle = '#fff';
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, 2, 0, Math.PI * 2);
                        this.ctx.fill();
                        break;
                    case 3: // Power pellet
                        this.ctx.fillStyle = '#fff';
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
                        this.ctx.fill();
                        
                        // Add pulsating effect
                        const pulseSize = 1 + Math.sin(Date.now() / 200) * 0.5;
                        this.ctx.strokeStyle = '#0f0';
                        this.ctx.lineWidth = pulseSize;
                        this.ctx.beginPath();
                        this.ctx.arc(centerX, centerY, 8, 0, Math.PI * 2);
                        this.ctx.stroke();
                        break;
                }
            }
        }
    }

    startGame() {
        // Set canvas dimensions based on map size
        this.canvas.width = this.map[0].length * this.tileSize;
        this.canvas.height = this.map.length * this.tileSize;
        
        // Reset game state
        this.gameOver = false;
        this.paused = false;
        this.score = 0;
        this.lives = 3;
        this.dotsLeft = this.countDots();
        
        // Start the game loop
        requestAnimationFrame(this.gameLoop.bind(this));
    }

    gameLoop(timestamp) {
        if (this.gameOver) {
            return;
        }

        if (!this.paused) {
            this.update(timestamp);
            this.draw();
        } else {
            this.draw(); // Keep drawing while paused
        }

        requestAnimationFrame(this.gameLoop.bind(this));
    }

    resetGame() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.powerMode = false;
        this.powerModeTimer = 0;
        this.initializeGame();
        this.startGame();
    }
}

window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    new Pacman(canvas);
});
