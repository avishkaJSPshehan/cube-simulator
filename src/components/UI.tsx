import React from 'react';
import { MousePointer2, Palette, Trash2, Layers } from 'lucide-react';
import { useCubeStore } from '../store/cubeStore';

export const UI: React.FC = () => {
    const {
        width, height, depth, setDimensions,
        isExploded, setExploded,
        explosionFactor, setExplosionFactor,
        activeColor, setActiveColor,
        interactionMode, setInteractionMode,
        selectedIds, clearSelection, deleteSelectedCubelets
    } = useCubeStore();

    return (
        <div className="w-full md:w-80 h-[30vh] md:h-full bg-white/90 backdrop-blur-xl border-l border-slate-200 p-6 flex flex-col gap-8 order-1 md:order-2 overflow-y-auto shadow-2xl">
            <header className="flex flex-col gap-2">
                <h1 className="text-3xl font-black tracking-tighter bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent italic leading-tight uppercase flex items-center gap-2">
                    Cube Paint
                </h1>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] w-fit px-2 py-0.5 border border-slate-200 rounded-sm">
                    Simulator v0.2
                </p>
            </header>

            {/* Core Controls */}
            <div className="flex flex-col gap-6">
                <section>
                    <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase text-xs tracking-widest border-b border-slate-100 pb-2">
                        <MousePointer2 size={14} className="text-emerald-500" />
                        Interaction Mode
                    </div>
                    <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl mb-4">
                        {(['paint', 'select'] as const).map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setInteractionMode(mode)}
                                className={`py-2 text-[10px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                                    interactionMode === mode 
                                    ? 'bg-white text-blue-600 shadow-sm' 
                                    : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-4">
                        {interactionMode === 'select' && (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider">
                                    <span className="text-slate-400">Selected</span>
                                    <span className="font-mono text-blue-600">{selectedIds.length} cubelets</span>
                                </div>
                                <button
                                    onClick={clearSelection}
                                    className="w-full py-2 bg-slate-50 border border-slate-200 rounded-lg text-[10px] font-bold uppercase text-slate-600 hover:bg-slate-100 transition-colors"
                                >
                                    Clear Selection
                                </button>
                            </div>
                        )}

                        {interactionMode === 'select' && selectedIds.length > 0 && (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                                <button
                                    onClick={deleteSelectedCubelets}
                                    className="w-full py-2 bg-red-50 border border-red-200 rounded-lg text-[10px] font-bold uppercase text-red-600 hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                >
                                    <Trash2 size={12} />
                                    Delete Selected
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-slate-400 text-[10px]">Width (X)</span>
                                <span className="font-mono text-blue-600">{width}</span>
                            </div>
                            <input
                                type="range" min="1" max="10" step="1"
                                value={width}
                                onChange={(e) => setDimensions(parseInt(e.target.value), height, depth)}
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-slate-400 text-[10px]">Height (Y)</span>
                                <span className="font-mono text-blue-600">{height}</span>
                            </div>
                            <input
                                type="range" min="1" max="10" step="1"
                                value={height}
                                onChange={(e) => setDimensions(width, parseInt(e.target.value), depth)}
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                                <span className="text-slate-400 text-[10px]">Depth (Z)</span>
                                <span className="font-mono text-blue-600">{depth}</span>
                            </div>
                            <input
                                type="range" min="1" max="10" step="1"
                                value={depth}
                                onChange={(e) => setDimensions(width, height, parseInt(e.target.value))}
                                className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600 hover:accent-blue-500 transition-all"
                            />
                        </div>

                        <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-all cursor-pointer group shadow-sm"
                            onClick={() => setExploded(!isExploded)}>
                            <div className="flex items-center gap-3">
                                <Layers size={16} className={isExploded ? 'text-blue-500' : 'text-slate-400'} />
                                <span className={`text-sm font-bold ${isExploded ? 'text-slate-900' : 'text-slate-500'}`}>Exploded View</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full transition-colors relative ${isExploded ? 'bg-blue-600' : 'bg-slate-200'}`}>
                                <div className={`absolute top-1 left-1 w-2 h-2 rounded-full bg-white transition-transform ${isExploded ? 'translate-x-4' : 'translate-x-0 shadow-sm'}`} />
                            </div>
                        </div>

                        {isExploded && (
                            <div className="flex flex-col gap-2 animate-in fade-in slide-in-from-top-2">
                                <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                                    <span className="text-slate-400">Explosion</span>
                                    <span className="font-mono text-blue-600">{(explosionFactor * 10).toFixed(1)}</span>
                                </div>
                                <input
                                    type="range" min="0" max="0.5" step="0.05"
                                    value={explosionFactor}
                                    onChange={(e) => setExplosionFactor(parseFloat(e.target.value))}
                                    className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                                />
                            </div>
                        )}
                    </div>
                </section>

                {interactionMode === 'paint' && (
                    <section className="animate-in fade-in slide-in-from-bottom-2">
                        <div className="flex items-center gap-2 mb-4 text-slate-800 font-bold uppercase text-xs tracking-widest border-b border-slate-100 pb-2">
                            <Palette size={14} className="text-indigo-500" />
                            Paint Mode
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4 p-3 rounded-xl bg-slate-50 border border-slate-200 shadow-sm">
                                <div className="relative group">
                                    <input
                                        type="color"
                                        value={activeColor}
                                        onChange={(e) => setActiveColor(e.target.value)}
                                        className="w-12 h-12 bg-transparent border-none cursor-pointer rounded-lg overflow-hidden p-0 shadow-inner"
                                    />
                                    <div className="absolute inset-0 rounded-lg border-2 border-slate-200 pointer-events-none group-hover:border-blue-400 transition-colors" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Current Brush</span>
                                    <span className="text-sm font-mono font-bold text-slate-900 uppercase">{activeColor}</span>
                                </div>
                            </div>
                            <p className="text-[10px] text-slate-400 font-medium italic px-1 leading-relaxed">
                                Tip: Pick a color, then click any small cube face in the viewport to paint it individually.
                            </p>
                        </div>
                    </section>
                )}
            </div>

            <footer className="mt-auto pt-6 border-t border-slate-100 flex flex-col gap-2">
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest leading-loose">
                    © copyright by <br/>
                    <span className="text-blue-600 font-black">Amarasri Herath Technical Team</span>
                </p>
            </footer>
        </div>
    );
};
