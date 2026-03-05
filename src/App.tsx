import React, { useMemo, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useCubeStore } from './store/cubeStore';
import { Cube } from './components/Cube';
import { UI } from './components/UI';

const App: React.FC = () => {
    const { resetCube } = useCubeStore();

    useEffect(() => {
        resetCube();
    }, [resetCube]);

    return (
        <div className="w-full h-full bg-white text-black flex flex-col md:flex-row overflow-hidden font-sans">
            {/* 3D Scene */}
            <div className="flex-grow order-2 md:order-1 relative">
                <Canvas shadows gl={{ antialias: true, stencil: false, powerPreference: 'high-performance' }}>
                    <color attach="background" args={['white']} />
                    <PerspectiveCamera makeDefault position={[5, 5, 5]} fov={45} />
                    <OrbitControls minDistance={3} maxDistance={20} makeDefault />

                    <ambientLight intensity={0.5} />
                    <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                    <pointLight position={[-10, -10, -10]} intensity={0.5} />

                    <Cube />

                    <Environment preset="city" />
                    <ContactShadows
                        position={[0, -2, 0]}
                        opacity={0.4}
                        scale={10}
                        blur={2.4}
                        far={4.5}
                    />
                </Canvas>
            </div>

            {/* UI Overlay / Side Panel */}
            <UI />
        </div>
    );
};

export default App;
