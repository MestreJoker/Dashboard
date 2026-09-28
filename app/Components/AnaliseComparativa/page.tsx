'use client'

import { useEffect, useState } from "react";
import GraficoRosca from "./GraficoRosca/page";
import GraficoBarras from "./GraficoBarras/page";

interface Material {
    material: string;
    volume: number;
}

interface MesDados {
    ano_mes: number;
    materiais: Material[];
}

interface Props {
    anoSelecionado: number;
    periodoSelecionado: number;       // Pode ser 0 (tudo), 1-4 (trimestre) ou 1-12 (mês)
    tipoIntervalo: "trimestre" | "mes";
    clienteSelecionado: string;
}

export default function AnaliseComparativa({
    anoSelecionado,
    periodoSelecionado,
    tipoIntervalo,
    clienteSelecionado
}: Props) {
    const [isMounted, setIsMounted] = useState(false);
    const [dadosAno, setDadosAno] = useState<{ materiais: Material[] } | null>(null);
    const [cores, setCores] = useState<string[]>([]);
    const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: "" });
    const [temDados, setTemDados] = useState(true);

    useEffect(() => {
        async function carregarESomarDados() {
            try {
                setIsMounted(false);
                // No futuro, aqui você trocaria para: 
                // `/api/sua-rota?cliente=${clienteSelecionado}&ano=${anoSelecionado}...`
                const response = await fetch("/Json/AnaliseComparativa/volumeMaterial.json", { cache: 'no-store' });
                const data = await response.json();

                const todosOsRegistros = data.materiais_por_ano || [];
                let mesesFiltrados = [];

                // NOVA LÓGICA DE FILTRAGEM
                if (periodoSelecionado === 0) {
                    // ANO TODO: Pega todos os meses do ano X
                    mesesFiltrados = todosOsRegistros.filter((item: any) =>
                        Math.floor(Number(item.ano_mes) / 100) === Number(anoSelecionado)
                    );
                } else if (tipoIntervalo === "trimestre") {
                    // POR TRIMESTRE
                    const mesFim = periodoSelecionado * 3;
                    const codigosTrimestre = [
                        Number(anoSelecionado) * 100 + (mesFim - 2),
                        Number(anoSelecionado) * 100 + (mesFim - 1),
                        Number(anoSelecionado) * 100 + mesFim
                    ];
                    mesesFiltrados = todosOsRegistros.filter((item: any) =>
                        codigosTrimestre.includes(Number(item.ano_mes))
                    );
                } else {
                    // POR MÊS INDIVIDUAL
                    const codigoMesAlvo = Number(anoSelecionado) * 100 + Number(periodoSelecionado);
                    mesesFiltrados = todosOsRegistros.filter((item: any) =>
                        Number(item.ano_mes) === codigoMesAlvo
                    );
                }

                if (mesesFiltrados.length === 0) {
                    setTemDados(false);
                    setDadosAno(null);
                } else {
                    const mapaSoma = new Map<string, number>();

                    mesesFiltrados.forEach((mes: any) => {
                        mes.materiais.forEach((m: Material) => {
                            const totalAtual = mapaSoma.get(m.material) || 0;
                            mapaSoma.set(m.material, totalAtual + m.volume);
                        });
                    });

                    // Mantendo todos os materiais (incluindo volume 0)
                    const materiaisSomados = Array.from(mapaSoma.entries())
                        .map(([material, volume]) => ({ material, volume }))
                        .sort((a, b) => b.volume - a.volume); // Ordenado para melhor visualização

                    setTemDados(true);
                    setDadosAno({ materiais: materiaisSomados });

                    const novasCores = materiaisSomados.map(m => {
                        let hash = 0;
                        for (let i = 0; i < m.material.length; i++) {
                            hash = m.material.charCodeAt(i) + ((hash << 5) - hash);
                        }
                        return `hsl(${Math.abs(hash) % 360}, 65%, 50%)`;
                    });
                    setCores(novasCores);
                }
                setIsMounted(true);
            } catch (error) {
                console.error("Erro AnaliseComparativa:", error);
                setTemDados(false);
                setIsMounted(true);
            }
        }
        carregarESomarDados();
    }, [anoSelecionado, periodoSelecionado, tipoIntervalo, clienteSelecionado]);

    const handleMouseMove = (e: React.MouseEvent, content: string, isText: boolean) => {
        if (isText) {
            const target = e.currentTarget as HTMLElement;
            if (target.scrollWidth <= target.clientWidth) return;
        }
        setTooltip({ show: true, x: e.clientX + 10, y: e.clientY + 10, content });
    };

    if (!isMounted) return <div className="h-full min-h-[400px] bg-white border-2 border-black rounded-lg animate-pulse" />;

    return (
        <div id="analiseComparativa" className="bg-[#fafbfe] flex flex-col h-full shadow-md border-gray-300 border rounded-lg overflow-hidden font-sans relative ">
            {tooltip.show && (
                <div className="fixed z-[9999] bg-zinc-900 text-white p-2 rounded text-[10px] pointer-events-none border border-white/20 whitespace-nowrap"
                    style={{ left: tooltip.x, top: tooltip.y }}>
                    {tooltip.content}
                </div>
            )}

            <h3 className=" text-sm font-bold p-2  shrink-0 uppercase text-[#4a54ff]">
                {periodoSelecionado === 0
                    ? `Análise Anual - ${anoSelecionado}`
                    : `Análise ${tipoIntervalo === 'trimestre' ? periodoSelecionado + 'º Trim.' : 'Mês ' + periodoSelecionado} - ${anoSelecionado}`
                }
            </h3>

            {temDados && dadosAno ? (
                <>
                    <div className="flex flex-1 px-3 gap-3 min-h-0">
                        <GraficoBarras
                            materiais={dadosAno.materiais}
                            cores={cores}
                            maiorVolume={Math.max(...dadosAno.materiais.map(m => m.volume), 1)}
                            handleMouseMove={handleMouseMove}
                            setTooltip={setTooltip}
                        />
                        <GraficoRosca anoSelecionado={anoSelecionado} periodoSelecionado={periodoSelecionado} tipoVisao={"material"} />
                    </div>

                    <div className="p-2 flex justify-around items-center shrink-0">
                        <div className="flex items-center gap-1 text-[10px] font-bold text-[#4a54ff]">
                            Total Volume: {dadosAno.materiais.reduce((acc, cur) => acc + cur.volume, 0).toLocaleString()} kg
                        </div>
                    </div>
                </>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 text-gray-400 p-10 text-center">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="48"
                        height="48"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="mb-2 opacity-20"
                    >
                        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="9" y1="13" x2="15" y2="13" />
                        <line x1="9" y1="17" x2="15" y2="17" />
                        <line x1="9" y1="9" x2="10" y2="9" />
                    </svg>
                    <p className="text-sm font-bold uppercase tracking-widest">Nenhum dado disponível</p>
                    <p className="text-[10px]">Não encontramos registros para os filtros selecionados.</p>
                </div>
            )}
        </div>
    );
}