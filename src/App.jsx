import React, { useState, useEffect, useRef } from 'react';
import { 
  Volume2, VolumeX, Settings, Trophy, Play, Pause, RotateCcw, 
  Cpu, Zap, EyeOff, Shield, RefreshCw, Radio
} from 'lucide-react';
import { sound } from './game/SoundEffects';
import { GameEngine } from './game/GameEngine';
import PacmanGame from './components/PacmanGame';

export default function App() {
    const [engine, setEngine] = useState(null);
    const [mapType, setMapType] = useState('core');
    const [difficulty, setDifficulty] = useState('normal');
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(0.3);
    const [showCRT, setShowCRT] = useState(true);
    const [showStartScreen, setShowStartScreen] = useState(true);
    const [initials, setInitials] = useState('');
    const [scoreSaved, setScoreSaved] = useState(false);

    // Sync state from engine
    const [gameState, setGameState] = useState({
        score: 0,
        lives: 3,
        highScore: 0,
        gameOver: false,
        win: false,
        paused: false,
        powerMode: false,
        powerModeTimer: 0,
        activeHack: null,
        hackTimer: 0,
        spawnedChip: null
    });

    const [leaderboard, setLeaderboard] = useState([]);

    // Load leaderboard
    useEffect(() => {
        const stored = localStorage.getItem('pacman_leaderboard');
        if (stored) {
            setLeaderboard(JSON.parse(stored));
        } else {
            const defaultScores = [
                { initials: 'NEO', score: 3200, map: 'The Circuit', diff: 'hard', date: '2026-06-12' },
                { initials: 'TRN', score: 2500, map: 'The Nexus', diff: 'normal', date: '2026-06-15' },
                { initials: 'KNG', score: 1800, map: 'The Core', diff: 'normal', date: '2026-06-17' },
                { initials: 'CYB', score: 1200, map: 'The Core', diff: 'easy', date: '2026-06-18' }
            ];
            localStorage.setItem('pacman_leaderboard', JSON.stringify(defaultScores));
            setLeaderboard(defaultScores);
        }
    }, []);

    // Initialize/start the game
    const handleStartGame = () => {
        sound.init();
        sound.setMuted(isMuted);
        sound.setVolume(volume);
        
        setShowStartScreen(false);
        setScoreSaved(false);
        setInitials('');

        const newEngine = new GameEngine(mapType, difficulty, (state) => {
            setGameState(state);
        });

        setEngine(newEngine);
        sound.playStart();
        
        // Start background siren loop slightly delayed after intro tune
        setTimeout(() => {
            if (newEngine && !newEngine.paused && !newEngine.gameOver && !newEngine.win) {
                sound.startSiren();
            }
        }, 3000);
    };

    // Restart game
    const handleRestart = () => {
        if (engine) {
            sound.stopSiren();
        }
        handleStartGame();
    };

    // Pause toggle
    const handleTogglePause = () => {
        if (engine) {
            engine.togglePause();
        }
    };

    // Muted sync
    const handleToggleMute = () => {
        const nextMuted = !isMuted;
        setIsMuted(nextMuted);
        sound.setMuted(nextMuted);
    };

    // Volume Slider
    const handleVolumeChange = (e) => {
        const val = parseFloat(e.target.value);
        setVolume(val);
        sound.setVolume(val);
        if (isMuted && val > 0) {
            setIsMuted(false);
            sound.setMuted(false);
        }
    };

    // Save initials to leaderboard
    const handleSaveScore = (e) => {
        e.preventDefault();
        if (initials.trim().length !== 3) return;

        const record = {
            initials: initials.toUpperCase(),
            score: gameState.score,
            map: mapType === 'core' ? 'The Core' : (mapType === 'nexus' ? 'The Nexus' : 'The Circuit'),
            diff: difficulty,
            date: new Date().toISOString().split('T')[0]
        };

        const updated = [...leaderboard, record]
            .sort((a, b) => b.score - a.score)
            .slice(0, 7); // keep top 7

        localStorage.setItem('pacman_leaderboard', JSON.stringify(updated));
        setLeaderboard(updated);
        setScoreSaved(true);
    };

    // Cleanup sound siren on unmount
    useEffect(() => {
        return () => sound.stopSiren();
    }, []);

    return (
        <div className="app-container">
            {/* Header Glitch Section */}
            <div className="title-section">
                <h1 className="glitch-title">PAC-MAN</h1>
                <p className="subtitle">CYBER-GRID PROTOCOL</p>
            </div>

            {/* Start Screen Overlay */}
            {showStartScreen ? (
                <div className="cyber-panel" style={{ width: '100%', maxWidth: '600px', padding: '40px 25px', textAlign: 'center', marginTop: '40px' }}>
                    <h2 style={{ fontFamily: 'Orbitron', fontSize: '1.8rem', color: 'var(--primary-neon)', marginBottom: '30px', textShadow: 'var(--glow-cyan)' }}>
                        INITIALIZE CONNECTION
                    </h2>
                    
                    {/* Setup Config Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px', textAlign: 'left' }}>
                        <div>
                            <label style={{ display: 'block', color: 'var(--primary-neon)', marginBottom: '8px', fontSize: '0.9rem' }}>SELECT MAP CONFIG</label>
                            <select 
                                value={mapType} 
                                onChange={(e) => setMapType(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#0a0d1a',
                                    border: '1px solid var(--primary-neon)',
                                    color: '#fff',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <option value="core">The Core (Standard Grid)</option>
                                <option value="nexus">The Nexus (Warp Gateways)</option>
                                <option value="circuit">The Circuit (Micro-Maze)</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ display: 'block', color: 'var(--primary-neon)', marginBottom: '8px', fontSize: '0.9rem' }}>DIFFICULTY PROTOCOL</label>
                            <select 
                                value={difficulty} 
                                onChange={(e) => setDifficulty(e.target.value)}
                                style={{
                                    width: '100%',
                                    background: '#0a0d1a',
                                    border: '1px solid var(--primary-neon)',
                                    color: '#fff',
                                    padding: '8px 12px',
                                    borderRadius: '6px',
                                    fontFamily: 'inherit'
                                }}
                            >
                                <option value="easy">EASY (Slower Ghosts)</option>
                                <option value="normal">NORMAL (Balanced Core)</option>
                                <option value="hard">HARD (Insane Chase Algorithm)</option>
                            </select>
                        </div>
                    </div>

                    <button className="cyber-btn accent" onClick={handleStartGame} style={{ padding: '16px 32px', fontSize: '0.9rem', width: '100%' }}>
                        EXECUTE PROTOCOL.EXE
                    </button>
                </div>
            ) : (
                /* Main Game Area Split Grid */
                <div className="game-grid-layout">
                    {/* Left Column: Canvas and controls */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* Pacman Canvas Component */}
                        <PacmanGame engine={engine} isMuted={isMuted} showCRT={showCRT} />

                        {/* Controls Panel */}
                        <div className="cyber-panel" style={{ width: '100%', marginTop: '20px', padding: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button className="cyber-btn" onClick={handleTogglePause}>
                                        {gameState.paused ? <Play size={14} style={{ marginRight: '6px' }} /> : <Pause size={14} style={{ marginRight: '6px' }} />}
                                        {gameState.paused ? 'RESUME' : 'PAUSE'}
                                    </button>
                                    <button className="cyber-btn accent" onClick={handleRestart}>
                                        <RotateCcw size={14} style={{ marginRight: '6px' }} />
                                        REBOOT
                                    </button>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <button 
                                        className="cyber-btn" 
                                        onClick={handleToggleMute}
                                        style={{ border: 'none', padding: '8px' }}
                                    >
                                        {isMuted ? <VolumeX size={18} color="var(--secondary-neon)" /> : <Volume2 size={18} color="var(--primary-neon)" />}
                                    </button>
                                    <input 
                                        type="range" 
                                        min="0" 
                                        max="1" 
                                        step="0.1" 
                                        value={volume} 
                                        onChange={handleVolumeChange} 
                                        style={{ width: '80px', accentColor: 'var(--primary-neon)' }} 
                                    />
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', cursor: 'pointer' }}>
                                        <input 
                                            type="checkbox" 
                                            checked={showCRT} 
                                            onChange={(e) => setShowCRT(e.target.checked)}
                                            style={{ accentColor: 'var(--primary-neon)' }} 
                                        />
                                        CRT
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Virtual Mobile D-pad */}
                        <div className="cyber-panel" style={{ width: '100%', marginTop: '15px', padding: '15px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255, 255, 255, 0.4)', marginBottom: '8px', letterSpacing: '1px' }}>VIRTUAL CORE NAVIGATION</span>
                            <div className="dpad-container">
                                <button className="dpad-btn up" onClick={() => engine.setNextDirection('up')}>↑</button>
                                <button className="dpad-btn down" onClick={() => engine.setNextDirection('down')}>↓</button>
                                <button className="dpad-btn left" onClick={() => engine.setNextDirection('left')}>←</button>
                                <button className="dpad-btn right" onClick={() => engine.setNextDirection('right')}>→</button>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: HUD Details and score board */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {/* HUD Panels */}
                        <div className="cyber-panel hud-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.6rem', marginBottom: '4px' }}>SCORE</div>
                                <div style={{ fontSize: '1.2rem', color: '#fff', textShadow: 'var(--glow-cyan)' }}>{gameState.score}</div>
                            </div>
                            <div>
                                <div style={{ color: 'rgba(255, 255, 255, 0.4)', fontSize: '0.6rem', marginBottom: '4px' }}>LIVES</div>
                                <div style={{ fontSize: '1.1rem', color: 'var(--secondary-neon)' }}>
                                    {'▲ '.repeat(Math.max(0, gameState.lives))}
                                </div>
                            </div>
                        </div>

                        {/* Power Mode & Cyber-Hack Status indicator */}
                        <div className="cyber-panel" style={{ padding: '15px' }}>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--primary-neon)', borderBottom: '1px solid rgba(0, 243, 255, 0.15)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <Cpu size={14} /> CYBERNETIC SUBSYSTEMS
                            </h3>

                            {/* Vulnerable Frightened state */}
                            {gameState.powerMode && (
                                <div style={{ marginTop: '12px', background: 'rgba(255, 0, 204, 0.15)', border: '1px solid #ff00cc', borderRadius: '6px', padding: '8px 12px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#ff00cc', fontWeight: 'bold' }}>
                                        <span>VIRUS INJECTED</span>
                                        <span>{Math.ceil(gameState.powerModeTimer / 1000)}s</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#ffccf2', marginTop: '4px' }}>Ghosts are vulnerable and routing away.</p>
                                </div>
                            )}

                            {/* Custom Cyber Hacks */}
                            {gameState.activeHack ? (
                                <div style={{ 
                                    marginTop: '12px', 
                                    background: gameState.activeHack === 'freeze' ? 'rgba(0, 243, 255, 0.15)' : (gameState.activeHack === 'turbo' ? 'rgba(255, 120, 0, 0.15)' : 'rgba(179, 0, 255, 0.15)'), 
                                    border: `1px solid ${gameState.activeHack === 'freeze' ? 'var(--hack-freeze)' : (gameState.activeHack === 'turbo' ? 'var(--hack-turbo)' : 'var(--hack-invis)')}`, 
                                    borderRadius: '6px', 
                                    padding: '8px 12px' 
                                }}>
                                    <div style={{ 
                                        display: 'flex', 
                                        justifyContent: 'space-between', 
                                        fontSize: '0.8rem', 
                                        color: gameState.activeHack === 'freeze' ? 'var(--hack-freeze)' : (gameState.activeHack === 'turbo' ? 'var(--hack-turbo)' : 'var(--hack-invis)'), 
                                        fontWeight: 'bold',
                                        textTransform: 'uppercase' 
                                    }}>
                                        <span>{gameState.activeHack} ACTIVE</span>
                                        <span>{Math.ceil(gameState.hackTimer / 1000)}s</span>
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: '#e0e0f8', marginTop: '4px' }}>
                                        {gameState.activeHack === 'freeze' && 'All ghosts frozen in grid place.'}
                                        {gameState.activeHack === 'turbo' && 'Pacman speed increased by +45% with neon trail.'}
                                        {gameState.activeHack === 'invisibility' && 'Pass through ghosts safely. Ghosts wander randomly.'}
                                    </p>
                                </div>
                            ) : !gameState.powerMode && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px 0', color: 'rgba(255, 255, 255, 0.25)' }}>
                                    <Radio size={24} className="pulse-siren" />
                                    <span style={{ fontSize: '0.75rem', marginTop: '6px' }}>SYSTEM MONITOR STABLE</span>
                                </div>
                            )}
                        </div>

                        {/* Leaderboard panel */}
                        <div className="cyber-panel" style={{ padding: '15px' }}>
                            <h3 style={{ fontSize: '0.9rem', color: 'var(--primary-neon)', borderBottom: '1px solid rgba(0, 243, 255, 0.15)', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '10px' }}>
                                <Trophy size={14} /> PERSISTENT SCOREBOARD
                            </h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                                <thead>
                                    <tr style={{ color: 'rgba(255, 255, 255, 0.4)', textAlign: 'left' }}>
                                        <th style={{ padding: '6px 4px' }}>PLR</th>
                                        <th style={{ padding: '6px 4px' }}>MAP</th>
                                        <th style={{ padding: '6px 4px' }}>DIFF</th>
                                        <th style={{ padding: '6px 4px', textAlign: 'right' }}>SCORE</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leaderboard.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', color: idx === 0 ? 'var(--primary-neon)' : '#fff' }}>
                                            <td style={{ padding: '6px 4px', fontFamily: '"Press Start 2P"', fontSize: '0.65rem' }}>{item.initials}</td>
                                            <td style={{ padding: '6px 4px' }}>{item.map}</td>
                                            <td style={{ padding: '6px 4px', textTransform: 'capitalize' }}>{item.diff}</td>
                                            <td style={{ padding: '6px 4px', textAlign: 'right', fontWeight: 'bold' }}>{item.score}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}

            {/* Game Over & Win Overlays */}
            {engine && (gameState.gameOver || gameState.win) && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'rgba(3, 3, 16, 0.85)',
                    backdropFilter: 'blur(10px)',
                    zIndex: 999,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className="cyber-panel" style={{ width: '90%', maxWidth: '450px', padding: '30px', textAlign: 'center' }}>
                        <h2 style={{ 
                            fontFamily: 'Orbitron', 
                            fontSize: '2rem', 
                            color: gameState.win ? 'var(--tertiary-neon)' : 'var(--secondary-neon)', 
                            textShadow: gameState.win ? '0 0 10px rgba(0,255,136,0.5)' : '0 0 10px rgba(255,0,127,0.5)',
                            marginBottom: '10px'
                        }}>
                            {gameState.win ? 'COMPILING SUCCESS' : 'SYSTEM CRASHED'}
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '20px' }}>
                            {gameState.win ? 'Level cleared with complete optimization.' : 'Pacman was dissembled by cybersecurity grid.'}
                        </p>

                        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '15px', marginBottom: '25px' }}>
                            <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>FINAL REVOLUTION SCORE</span>
                            <div style={{ fontSize: '2.2rem', fontWeight: 'bold', color: 'var(--primary-neon)', textShadow: 'var(--glow-cyan)' }}>{gameState.score}</div>
                        </div>

                        {/* Save Score Initials form */}
                        {!scoreSaved && gameState.score > 0 ? (
                            <form onSubmit={handleSaveScore} style={{ marginBottom: '20px' }}>
                                <label style={{ display: 'block', fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.8)', marginBottom: '8px' }}>
                                    RECORD PLR INITIALS (3 CHARS)
                                </label>
                                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                    <input 
                                        type="text" 
                                        maxLength="3" 
                                        value={initials} 
                                        onChange={(e) => setInitials(e.target.value.toUpperCase())}
                                        placeholder="CYB"
                                        style={{
                                            background: '#0a0d1a',
                                            border: '1px solid var(--primary-neon)',
                                            color: '#fff',
                                            padding: '8px 12px',
                                            width: '80px',
                                            textAlign: 'center',
                                            fontSize: '1.1rem',
                                            fontFamily: '"Press Start 2P"',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <button type="submit" className="cyber-btn">SAVE</button>
                                </div>
                            </form>
                        ) : scoreSaved ? (
                            <div style={{ color: 'var(--tertiary-neon)', fontSize: '0.85rem', marginBottom: '20px' }}>
                                SCORE RECORDED SUCCESSFULLY!
                            </div>
                        ) : null}

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <button className="cyber-btn accent" onClick={handleRestart} style={{ padding: '14px' }}>
                                REBOOT TERMINAL
                            </button>
                            <button className="cyber-btn" onClick={() => setShowStartScreen(true)} style={{ padding: '14px' }}>
                                CONFIGURATION PROTOCOL
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
