import { create } from 'zustand';
import * as THREE from 'three';

export type CubeFace = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

export interface CubeletState {
    id: string;
    initialPos: THREE.Vector3; // The original grid position
    currentPos: THREE.Vector3; // Current position in the NxNxN grid
    quaternion: THREE.Quaternion; // Total rotation applied to this cubelet
    colors: Record<CubeFace, string>;
}

export interface CubeStore {
    size: number;
    cubelets: CubeletState[];
    isExploded: boolean;
    explosionFactor: number;
    isAnimating: boolean;

    // Actions
    setSize: (size: number) => void;
    resetCube: () => void;
    setExploded: (exploded: boolean) => void;
    setExplosionFactor: (factor: number) => void;
    setAnimating: (animating: boolean) => void;
    updateCubelets: (newCubelets: CubeletState[]) => void;
    setCubeletFaceColor: (id: string, face: CubeFace, color: string) => void;
    activeColor: string;
    setActiveColor: (color: string) => void;
}

export const useCubeStore = create<CubeStore>((set, get) => ({
    size: 3,
    cubelets: [],
    isExploded: false,
    explosionFactor: 0.1,
    isAnimating: false,
    activeColor: '#3b82f6',

    setSize: (size: number) => {
        set({ size });
        get().resetCube();
    },

    resetCube: () => {
        const size = get().size;
        const newCubelets: CubeletState[] = [];
        const offset = (size - 1) / 2;

        for (let x = 0; x < size; x++) {
            for (let y = 0; y < size; y++) {
                for (let z = 0; z < size; z++) {
                    const pos = new THREE.Vector3(x - offset, y - offset, z - offset);

                    // All faces start black
                    const cubeletColors: Record<CubeFace, string> = {
                        front: '#111111',
                        back: '#111111',
                        left: '#111111',
                        right: '#111111',
                        top: '#111111',
                        bottom: '#111111',
                    };

                    newCubelets.push({
                        id: `${x}-${y}-${z}`,
                        initialPos: pos.clone(),
                        currentPos: pos.clone(),
                        quaternion: new THREE.Quaternion(),
                        colors: cubeletColors
                    });
                }
            }
        }
        set({ cubelets: newCubelets, isAnimating: false });
    },

    setExploded: (isExploded: boolean) => set({ isExploded }),
    setExplosionFactor: (explosionFactor: number) => set({ explosionFactor }),
    setAnimating: (isAnimating: boolean) => set({ isAnimating }),
    updateCubelets: (cubelets: CubeletState[]) => set({ cubelets }),

    setCubeletFaceColor: (id: string, face: CubeFace, color: string) => {
        const updatedCubelets = get().cubelets.map(c => {
            if (c.id === id) {
                return {
                    ...c,
                    colors: { ...c.colors, [face]: color }
                };
            }
            return c;
        });
        set({ cubelets: updatedCubelets });
    },

    setActiveColor: (activeColor: string) => set({ activeColor })
}));
