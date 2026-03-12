import React, { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import { useCubeStore, CubeletState, CubeFace } from '../store/cubeStore';

interface CubeletProps {
    data: CubeletState;
}

const stickerConfigs: { face: CubeFace; pos: [number, number, number]; rot: [number, number, number] }[] = [
    { face: 'front', pos: [0, 0, 0.48], rot: [0, 0, 0] },
    { face: 'back', pos: [0, 0, -0.48], rot: [0, Math.PI, 0] },
    { face: 'top', pos: [0, 0.48, 0], rot: [-Math.PI / 2, 0, 0] },
    { face: 'bottom', pos: [0, -0.48, 0], rot: [Math.PI / 2, 0, 0] },
    { face: 'right', pos: [0.48, 0, 0], rot: [0, Math.PI / 2, 0] },
    { face: 'left', pos: [-0.48, 0, 0], rot: [0, -Math.PI / 2, 0] },
];

const Cubelet: React.FC<CubeletProps> = ({ data }) => {
    const meshRef = useRef<THREE.Group>(null);
    const { 
        isExploded, explosionFactor, activeColor, 
        setCubeletFaceColor, interactionMode, toggleCubeletSelection
    } = useCubeStore();

    useFrame(() => {
        if (meshRef.current) {
            const targetPos = data.currentPos.clone();
            if (isExploded) {
                targetPos.multiplyScalar(1 + explosionFactor);
            }

            meshRef.current.position.lerp(targetPos, 0.1);
            meshRef.current.quaternion.slerp(data.quaternion, 0.1);
        }
    });

    const onPointerDown = (e: any, face: CubeFace = 'front') => {
        e.stopPropagation();
        if (interactionMode === 'paint') {
            setCubeletFaceColor(data.id, face, activeColor);
        } else if (interactionMode === 'select') {
            toggleCubeletSelection(data.id);
        }
    };

    return (
        <group ref={meshRef}>
            {/* The main body of the small cube */}
            <RoundedBox
                args={[0.95, 0.95, 0.95]}
                radius={0.08}
                smoothness={4}
                onPointerDown={(e) => onPointerDown(e)}
            >
                <meshStandardMaterial
                    color={data.isSelected ? "#3b82f6" : "#111111"}
                    metalness={0.9}
                    roughness={0.1}
                    emissive={data.isSelected ? "#3b82f6" : "#000000"}
                    emissiveIntensity={data.isSelected ? 0.5 : 0}
                />
            </RoundedBox>

            {/* Individual stickers for each face */}
            {stickerConfigs.map((config) => (
                <group
                    key={config.face}
                    position={config.pos}
                    rotation={config.rot}
                >
                    <RoundedBox
                        args={[0.82, 0.82, 0.02]}
                        radius={0.05}
                        smoothness={4}
                        onPointerDown={(e) => onPointerDown(e, config.face)}
                        onPointerOver={(e) => {
                            e.stopPropagation();
                            document.body.style.cursor = 'pointer';
                        }}
                        onPointerOut={() => {
                            document.body.style.cursor = 'auto';
                        }}
                    >
                        <meshStandardMaterial
                            color={data.colors[config.face]}
                            emissive={data.colors[config.face]}
                            emissiveIntensity={0.1}
                            metalness={0.4}
                            roughness={0.2}
                        />
                    </RoundedBox>
                </group>
            ))}
        </group>
    );
};

export const Cube: React.FC = () => {
    const cubelets = useCubeStore((state) => state.cubelets);

    return (
        <group>
            {cubelets.map((cubelet) => (
                <Cubelet key={cubelet.id} data={cubelet} />
            ))}
        </group>
    );
};
