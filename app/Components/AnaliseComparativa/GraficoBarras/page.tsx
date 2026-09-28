'use client'

interface Material {
    material: string;
    volume: number;
}

interface Props {
    materiais: Material[];
    cores: string[];
    maiorVolume: number;
    handleMouseMove: (e: React.MouseEvent, content: string, isText: boolean) => void; 
    setTooltip: (val: any) => void;
}

export default function GraficoBarras({ materiais, cores, maiorVolume, handleMouseMove, setTooltip }: Props) {
    return (
        <div className="w-1/2 flex flex-col bg-white rounded-xl border border-gray-300 shadow-md p-2 overflow-hidden">
            <h4 className="text-[11px] font-bold text-center mb-2 uppercase tracking-tighter shrink-0 text-[#4a54ff]">Volume por Material</h4>
            
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-400 space-y-5 py-2">
                {materiais?.map((mat, i) => (
                    <div key={i} className="flex flex-col w-full">
                        <div className="flex justify-between items-center mb-1">
                            <span 
                                className="text-[9px] font-bold text-gray-600 truncate max-w-[75%] cursor-default dark:text-white"
                                onMouseMove={(e) => handleMouseMove(e, mat.material, true)}
                                onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, content: "" })}
                            >
                                {mat.material}
                            </span>
                            <span className="text-[9px] font-bold text-gray-400 shrink-0">
                                {mat.volume.toLocaleString()}kg
                            </span>
                        </div>
                        <div 
                            style={{ 
                                width: `${(mat.volume / maiorVolume) * 100}%`, 
                                backgroundColor: cores[i] 
                            }} 
                            className="h-5 border border-black/20 rounded-sm hover:brightness-75 transition-all cursor-help"
                            onMouseMove={(e) => handleMouseMove(e, `${mat.material}: ${mat.volume.toLocaleString()}kg`, false)}
                            onMouseLeave={() => setTooltip({ show: false, x: 0, y: 0, content: "" })}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}