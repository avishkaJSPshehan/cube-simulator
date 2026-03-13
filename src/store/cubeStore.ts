import { create } from 'zustand';
import * as THREE from 'three';

export type CubeFace = 'front' | 'back' | 'left' | 'right' | 'top' | 'bottom';

export interface CubeletState {
    id: string;
    initialPos: THREE.Vector3; // The original grid position
    currentPos: THREE.Vector3; // Current position in the NxNxN grid
    quaternion: THREE.Quaternion; // Total rotation applied to this cubelet
    colors: Record<CubeFace, string>;
    isSelected: boolean;
}

export interface CubeStore {
    width: number;
    height: number;
    depth: number;
    cubelets: CubeletState[];
    isExploded: boolean;
    explosionFactor: number;
    isAnimating: boolean;

    interactionMode: 'paint' | 'select';
    selectedIds: string[];

    // Actions
    setSize: (size: number) => void;
    setDimensions: (width: number, height: number, depth: number) => void;
    resetCube: () => void;
    setExploded: (exploded: boolean) => void;
    setExplosionFactor: (factor: number) => void;
    setAnimating: (animating: boolean) => void;
    updateCubelets: (newCubelets: CubeletState[]) => void;
    setCubeletFaceColor: (id: string, face: CubeFace, color: string) => void;
    activeColor: string;
    setActiveColor: (color: string) => void;
    setInteractionMode: (mode: 'paint' | 'select') => void;
    toggleCubeletSelection: (id: string) => void;
    clearSelection: () => void;
    deleteSelectedCubelets: () => void;
}

export const useCubeStore = create<CubeStore>((set, get) => ({
    width: 3,
    height: 3,
    depth: 3,
    cubelets: [],
    isExploded: false,
    explosionFactor: 0.1,
    isAnimating: false,
    activeColor: '#3b82f6',
    interactionMode: 'paint',
    selectedIds: [],

    setSize: (size: number) => {
        set({ width: size, height: size, depth: size });
        get().resetCube();
    },

    setDimensions: (width: number, height: number, depth: number) => {
        set({ width, height, depth });
        get().resetCube();
    },

    resetCube: () => {
        const { width, height, depth } = get();
        const newCubelets: CubeletState[] = [];
        const offsetX = (width - 1) / 2;
        const offsetY = (height - 1) / 2;
        const offsetZ = (depth - 1) / 2;

        for (let x = 0; x < width; x++) {
            for (let y = 0; y < height; y++) {
                for (let z = 0; z < depth; z++) {
                    const pos = new THREE.Vector3(x - offsetX, y - offsetY, z - offsetZ);

                    // All faces start blue
                    const cubeletColors: Record<CubeFace, string> = {
                        front: '#3b82f6',
                        back: '#3b82f6',
                        left: '#3b82f6',
                        right: '#3b82f6',
                        top: '#3b82f6',
                        bottom: '#3b82f6',
                    };

                    newCubelets.push({
                        id: `${x}-${y}-${z}`,
                        initialPos: pos.clone(),
                        currentPos: pos.clone(),
                        quaternion: new THREE.Quaternion(),
                        colors: cubeletColors,
                        isSelected: false
                    });
                }
            }
        }
        set({ cubelets: newCubelets, isAnimating: false, selectedIds: [] });
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

    setActiveColor: (activeColor: string) => set({ activeColor }),

    setInteractionMode: (interactionMode) => set({ interactionMode }),

    toggleCubeletSelection: (id) => {
        const cubelets = get().cubelets.map(c =>
            c.id === id ? { ...c, isSelected: !c.isSelected } : c
        );
        const selectedIds = cubelets.filter(c => c.isSelected).map(c => c.id);
        set({ cubelets, selectedIds });
    },

    clearSelection: () => {
        const cubelets = get().cubelets.map(c => ({ ...c, isSelected: false }));
        set({ cubelets, selectedIds: [] });
    },

    deleteSelectedCubelets: () => {
        const cubelets = get().cubelets.filter(c => !c.isSelected);
        set({ cubelets, selectedIds: [] });
    }
}));
