import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import * as Matter from 'matter-js';
import { towerService } from '../services/towerService';
import { canvasCaptureService } from '../services/canvasCaptureService';
import { TowerManifest, Chunk } from '../types/tower';

interface GameCanvasProps {
  onGameFinish: (time: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameFinish }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [timer, setTimer] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<'countdown' | 'playing' | 'finished' | 'failed'>('countdown');
  const [countdown, setCountdown] = useState(3);
  const [lastCheckpoint, setLastCheckpoint] = useState({ x: 0, y: 350 });
  const [nextCheckpoint, setNextCheckpoint] = useState(0);
  const [fadeOpacity, setFadeOpacity] = useState(0);
  const [checkpointPositions, setCheckpointPositions] = useState<Array<{x: number, y: number}>>([]);
  const [towerManifest, setTowerManifest] = useState<TowerManifest | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Load tower manifest
    const loadManifest = async () => {
      try {
        const manifest = await towerService.loadTowerManifest();
        setTowerManifest(manifest);
      } catch (error) {
        console.error('Failed to load tower manifest:', error);
        // Use default manifest from service
        try {
          const defaultManifest = await towerService.loadTowerManifest();
          setTowerManifest(defaultManifest);
        } catch (fallbackError) {
          console.error('Failed to load default manifest:', fallbackError);
          // Continue with hardcoded platforms as final fallback
        }
      }
    };
    loadManifest();

    // Initialize canvas capture with error handling
    try {
      canvasCaptureService.init(canvasRef.current!);
    } catch (error) {
      console.error('Failed to initialize canvas capture:', error);
      // Continue without recording capability
    }

    // Three.js setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); // Sky blue

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(10, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);

    // Matter.js setup
    const engine = Matter.Engine.create();
    engine.world.gravity.y = 1;

    const world = engine.world;

    // Ground
    const ground = Matter.Bodies.rectangle(0, 400, 800, 20, { isStatic: true, friction: 0.8 });
    Matter.World.add(world, ground);

    // Ground mesh
    const groundGeometry = new THREE.PlaneGeometry(800, 20);
    const groundMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
    const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);
    groundMesh.position.set(0, -10, 0);
    groundMesh.rotation.x = -Math.PI / 2;
    groundMesh.receiveShadow = true;
    scene.add(groundMesh);

    // Player
    const playerBody = Matter.Bodies.rectangle(0, 350, 20, 20, {
      friction: 0.1,
      frictionAir: 0.01,
      restitution: 0.1
    });
    Matter.World.add(world, playerBody);

    // Player mesh
    const playerGeometry = new THREE.BoxGeometry(20, 20, 20);
    const playerMaterial = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
    playerMesh.castShadow = true;
    scene.add(playerMesh);

    // Platforms with checkpoints - use manifest if available, otherwise fallback
    const platforms = towerManifest ? towerManifest.chunks.map(chunk => ({
      x: chunk.position.x,
      y: chunk.position.y,
      width: chunk.size.width,
      height: chunk.size.height,
      isCheckpoint: chunk.type === 'CheckpointPlatform',
      color: chunk.properties.color || '#FFFFFF',
      type: chunk.type,
    })) : [
      { x: -100, y: 300, width: 100, height: 10, isCheckpoint: true, color: '#FFD700', type: 'CheckpointPlatform' },
      { x: 100, y: 250, width: 100, height: 10, isCheckpoint: false, color: '#228B22', type: 'StaticPlatform' },
      { x: -50, y: 200, width: 80, height: 10, isCheckpoint: true, color: '#FFD700', type: 'CheckpointPlatform' },
      { x: 50, y: 150, width: 80, height: 10, isCheckpoint: false, color: '#228B22', type: 'StaticPlatform' },
      { x: 0, y: 100, width: 60, height: 10, isCheckpoint: true, color: '#FFD700', type: 'CheckpointPlatform' }, // Finish platform
    ];

    const platformMeshes: THREE.Mesh[] = [];
    const checkpoints = platforms.filter(p => p.isCheckpoint).map(p => ({ x: p.x, y: p.y }));
    setCheckpointPositions(checkpoints);

    platforms.forEach(platform => {
      const body = Matter.Bodies.rectangle(platform.x, platform.y, platform.width, platform.height, { isStatic: true });
      Matter.World.add(world, body);

      const geometry = new THREE.BoxGeometry(platform.width, platform.height, 10);
      const color = platform.color ? parseInt(platform.color.replace('#', ''), 16) : (platform.isCheckpoint ? 0xFFD700 : 0x228B22);
      const material = new THREE.MeshLambertMaterial({ color });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(platform.x, 400 - platform.y, 0);
      mesh.receiveShadow = true;
      scene.add(mesh);
      platformMeshes.push(mesh);
    });

    // Moving platform
    const movingPlatformBody = Matter.Bodies.rectangle(0, 100, 100, 10, { isStatic: true });
    Matter.World.add(world, movingPlatformBody);

    const movingPlatformGeometry = new THREE.BoxGeometry(100, 10, 10);
    const movingPlatformMaterial = new THREE.MeshLambertMaterial({ color: 0xFFD700 });
    const movingPlatformMesh = new THREE.Mesh(movingPlatformGeometry, movingPlatformMaterial);
    movingPlatformMesh.receiveShadow = true;
    scene.add(movingPlatformMesh);

    // Controls
    const keys: { [key: string]: boolean } = {};
    let jumpPressed = false;
    let jumpStartTime = 0;

    const handleKeyDown = (event: KeyboardEvent) => {
      keys[event.code] = true;
      if (event.code === 'Space') {
        event.preventDefault();
        if (!jumpPressed) {
          jumpPressed = true;
          jumpStartTime = Date.now();
        }
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      keys[event.code] = false;
      if (event.code === 'Space') {
        const jumpDuration = Date.now() - jumpStartTime;
        const jumpForce = Math.min(jumpDuration / 500, 1) * 0.15 + 0.05; // Variable jump
        Matter.Body.applyForce(playerBody, playerBody.position, { x: 0, y: -jumpForce });
        jumpPressed = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    // Game loop
    let animationId: number;
    let startTime = Date.now();
    let countdownStart = Date.now();

    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (gameState === 'countdown') {
        const elapsed = (Date.now() - countdownStart) / 1000;
        const newCountdown = Math.max(0, 3 - Math.floor(elapsed));
        setCountdown(newCountdown);
        if (newCountdown === 0) {
          setGameState('playing');
          startTime = Date.now();
        }
      } else if (gameState === 'playing') {
        // Start recording when gameplay begins
        if (!canvasCaptureService.isCurrentlyRecording()) {
          canvasCaptureService.startRecording();
        }

        // Update physics
        Matter.Engine.update(engine, 16.666);

        // Update player position
        playerMesh.position.set(playerBody.position.x, 400 - playerBody.position.y, 0);

        // Handle movement
        const moveForce = 0.005;
        if (keys['KeyA'] || keys['ArrowLeft']) {
          Matter.Body.applyForce(playerBody, playerBody.position, { x: -moveForce, y: 0 });
        }
        if (keys['KeyD'] || keys['ArrowRight']) {
          Matter.Body.applyForce(playerBody, playerBody.position, { x: moveForce, y: 0 });
        }

        // Update moving platform
        const time = Date.now() * 0.001;
        const platformX = Math.sin(time) * 100;
        Matter.Body.setPosition(movingPlatformBody, { x: platformX, y: 100 });
        movingPlatformMesh.position.set(platformX, 400 - 100, 0);

        // Camera follow
        const playerY = playerBody.position.y;
        if (playerY < 200) { // Above midpoint
          camera.position.y = 400 - playerY + 5;
        } else {
          camera.position.y = 5;
        }
        camera.position.x = playerBody.position.x;
        camera.lookAt(playerBody.position.x, 400 - playerY, 0);

        // Update timer
        const currentTime = (Date.now() - startTime) / 1000;
        setTimer(currentTime);

        // Update score (height-based)
        const currentScore = Math.max(0, Math.floor((400 - playerY) / 10));
        setScore(currentScore);

        // Record frame for GIF if recording
        canvasCaptureService.recordFrame();

        // Check for checkpoint reach
        checkpoints.forEach((checkpoint, index) => {
          if (Math.abs(playerBody.position.x - checkpoint.x) < 60 &&
              Math.abs(playerBody.position.y - checkpoint.y) < 30 &&
              nextCheckpoint === index) {
            setLastCheckpoint({ x: checkpoint.x, y: checkpoint.y });
            setNextCheckpoint(index + 1);
            // Light up platform
            if (platformMeshes[index]) {
              (platformMeshes[index].material as THREE.MeshLambertMaterial).color.setHex(0xFFFF00);
            }
            // Play chime sound (placeholder)
            console.log('Checkpoint reached!');
          }
        });

        // Check for finish
        if (nextCheckpoint >= checkpoints.length) {
          setGameState('finished');
          onGameFinish(currentTime);
          // Stop recording and generate GIF
          canvasCaptureService.stopRecording().catch(error => {
            console.error('Failed to stop recording:', error);
          });
        }

        // Check for fall below bottom
        if (playerBody.position.y > 450) {
          setGameState('failed');
          setFadeOpacity(1);
          setTimeout(() => {
            // Respawn at last checkpoint
            Matter.Body.setPosition(playerBody, lastCheckpoint);
            Matter.Body.setVelocity(playerBody, { x: 0, y: 0 });
            setGameState('playing');
            setFadeOpacity(0);
          }, 1000);
        }
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      Matter.Engine.clear(engine);
    };
  }, [towerManifest]);

  return (
    <>
      <canvas ref={canvasRef} style={{ display: 'block' }} />

      {/* Countdown Overlay */}
      {gameState === 'countdown' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          fontSize: '5rem',
          fontFamily: 'Arial, sans-serif',
          fontWeight: 'bold',
          zIndex: 200
        }}>
          {countdown === 0 ? 'GO!' : countdown}
        </div>
      )}

      {/* HUD */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
        zIndex: 100
      }}>
        <div>Time: {timer.toFixed(2)}s</div>
        <div>Score: {score}</div>
        <div>Next Checkpoint: {nextCheckpoint + 1}/{checkpointPositions.length}</div>
      </div>

      {/* Finish Overlay */}
      {gameState === 'finished' && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          color: 'white',
          zIndex: 200
        }}>
          <h1 style={{ fontSize: '4rem', marginBottom: '2rem' }}>FINISH!</h1>
          <p style={{ fontSize: '2rem', marginBottom: '2rem' }}>Time: {timer.toFixed(2)}s</p>
          <div>
            <button
              onClick={() => window.open(`https://reddit.com/r/gaming/submit?title=My%20Tower%20of%20Challenges%20Time&text=I%20just%20completed%20the%20Tower%20of%20Challenges%20in%20${timer.toFixed(2)}%20seconds!%20Can%20you%20beat%20my%20time%3F%20%23TowerOfChallenges`, '_blank')}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.5rem',
                margin: '0 1rem',
                backgroundColor: '#FF4500',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Share to Reddit
            </button>
            <button
              onClick={() => window.location.reload()}
              style={{
                padding: '1rem 2rem',
                fontSize: '1.5rem',
                margin: '0 1rem',
                backgroundColor: '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer'
              }}
            >
              Retry Tower
            </button>
          </div>
        </div>
      )}

      {/* Fade to black on failure */}
      {fadeOpacity > 0 && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'black',
          opacity: fadeOpacity,
          zIndex: 150,
          transition: 'opacity 0.5s'
        }} />
      )}
    </>
  );
};

export default GameCanvas;