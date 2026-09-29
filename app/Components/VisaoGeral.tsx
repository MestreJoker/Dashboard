'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

interface PropsVisao {
    anoSelecionado: number;
    periodoSelecionado: number;
    tipoIntervalo: "trimestre" | "mes";
    clienteSelecionado: string;
}

interface DadosMensais {
    ano_mes: number;
    dados: {
        coletado: number;
        processado: number;
        nao_processado: number;
        total: number;
    };
}

export default function VisaoGeral({
    anoSelecionado,
    periodoSelecionado,
    tipoIntervalo,
    clienteSelecionado
}: PropsVisao) {
    const [volumeColetado, setVolumeColetado] = useState<number>(0);
    const [volumeProcessado, setVolumeProcessado] = useState<number>(0);
    const [volume_Nao_Processado, setVolume_Nao_Processado] = useState<number>(0);
    const [total, setTotal] = useState<number>(0);
    const [temDados, setTemDados] = useState(true);
    const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);

    // Monitora a largura da tela no lado do cliente para remover o background dinamicamente
    useEffect(() => {
        const handleResize = () => {
            setIsMobileOrTablet(window.innerWidth < 768);
        };
        
        handleResize(); // Executa no mount inicial
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    async function resgatarDados() {
        try {
            const response = await fetch("/Json/visaoGeral.json", { cache: 'no-store' });
            const data = await response.json();
            const lista: DadosMensais[] = data.indicadores_mensais;

            let codigosDesejados: number[] = [];

            if (periodoSelecionado === 0) {
                for (let i = 1; i <= 12; i++) {
                    codigosDesejados.push(anoSelecionado * 100 + i);
                }
            } else if (tipoIntervalo === "trimestre") {
                const mesFim = periodoSelecionado * 3;
                codigosDesejados = [
                    anoSelecionado * 100 + (mesFim - 2),
                    anoSelecionado * 100 + (mesFim - 1),
                    anoSelecionado * 100 + mesFim
                ];
            } else {
                codigosDesejados = [anoSelecionado * 100 + periodoSelecionado];
            }

            const mesesFiltrados = lista.filter(item => codigosDesejados.includes(item.ano_mes));

            if (mesesFiltrados.length === 0) {
                setTemDados(false);
                setVolumeColetado(0);
                setVolumeProcessado(0);
                setVolume_Nao_Processado(0);
                setTotal(0);
                return;
            }

            const soma = mesesFiltrados.reduce((acc, curr) => ({
                coletado: acc.coletado + curr.dados.coletado,
                processado: acc.processado + curr.dados.processado,
                nao_processado: acc.nao_processado + curr.dados.nao_processado,
                total: acc.total + curr.dados.total,
            }), { coletado: 0, processado: 0, nao_processado: 0, total: 0 });

            setVolumeColetado(soma.coletado);
            setVolumeProcessado(soma.processado);
            setVolume_Nao_Processado(soma.nao_processado);
            setTotal(soma.total);
            setTemDados(true);

        } catch (erro) {
            console.error("ERRO ao carregar visão geral", erro);
            setTemDados(false);
        }
    }

    useEffect(() => {
        resgatarDados();
    }, [anoSelecionado, periodoSelecionado, tipoIntervalo, clienteSelecionado]);

    return (
        <div id="visaoGeral" className="flex flex-col h-full gap-4 w-full rounded-lg overflow-hidden">

            {/* Primeira metade: Cards de Métricas */}
            <div className="min-h-[45%] flex flex-col w-full">
                {temDados ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 w-full h-full">
                        
                        {/* Card Coletado */}
                        <div className="w-full bg-white rounded-2xl flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-3 p-4 shadow-md border border-zinc-100 hover:scale-[1.01] transition-all duration-200 text-center xl:text-left">
                            <div className="bg-[#feece9] p-2.5 sm:p-3 rounded-full flex-shrink-0 flex items-center justify-center">
                                <Image 
                                    src="/images/icons/dashboard1/coletado.png" 
                                    width={35} 
                                    height={35} 
                                    className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] md:w-[35px] md:h-[35px]" 
                                    alt="Ícone Coletado" 
                                    priority
                                />
                            </div>
                            <div className="flex flex-col min-w-0 leading-tight w-full">
                                <span className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block whitespace-normal break-words">Coletado</span>
                                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#fc764a] tracking-tight whitespace-normal break-all xl:break-normal">
                                    {(volumeColetado / 1000).toFixed(1)}t
                                </span>
                            </div>
                        </div>

                        {/* Card Processado */}
                        <div className="w-full bg-white rounded-2xl flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-3 p-4 shadow-md border border-zinc-100 hover:scale-[1.01] transition-all duration-200 text-center xl:text-left">
                            <div className="bg-[#feece9] p-2.5 sm:p-3 rounded-full flex-shrink-0 flex items-center justify-center">
                                <Image 
                                    src="/images/icons/dashboard1/processado1.png" 
                                    width={35} 
                                    height={35} 
                                    className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] md:w-[34px] md:h-[34px]" 
                                    alt="Ícone Processado" 
                                    priority
                                />
                            </div>
                            <div className="flex flex-col min-w-0 leading-tight w-full">
                                <span className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block whitespace-normal break-words">Processado</span>
                                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#fc764a] tracking-tight whitespace-normal break-all xl:break-normal">
                                    {(volumeProcessado / 1000).toFixed(1)}t
                                </span>
                            </div>
                        </div>

                        {/* Card Pendente */}
                        <div className="w-full bg-white rounded-2xl flex flex-col xl:flex-row items-center justify-center xl:justify-start gap-3 p-4 shadow-md border border-zinc-100 hover:scale-[1.01] transition-all duration-200 text-center xl:text-left sm:col-span-2 lg:col-span-1">
                            <div className="bg-[#feece9] p-2.5 sm:p-3 rounded-full flex-shrink-0 flex items-center justify-center">
                                <Image 
                                    src="/images/icons/dashboard1/naoProcessado.png" 
                                    width={35} 
                                    height={35} 
                                    className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px] md:w-[35px] md:h-[35px]" 
                                    alt="Ícone Pendente" 
                                    priority
                                />
                            </div>
                            <div className="flex flex-col min-w-0 leading-tight w-full">
                                <span className="text-[11px] sm:text-xs font-bold text-gray-400 uppercase tracking-wider block whitespace-normal break-words">Pendente</span>
                                <span className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-[#fc764a] tracking-tight whitespace-normal break-all xl:break-normal">
                                    {(volume_Nao_Processado / 1000).toFixed(1)}t
                                </span>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white border border-gray-100 rounded-2xl text-gray-400 p-6 text-center shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-30">
                            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="9" y1="13" x2="15" y2="13" />
                            <line x1="9" y1="17" x2="15" y2="17" />
                        </svg>
                        <p className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Sem dados para este período</p>
                    </div>
                )}
            </div>

            {/* Segunda metade: Banner de Total Geral */}
            <div className="mt-30 sm:mt-17 md:mt-19 lg:mt-0 min-h-[50%] flex-1 flex">
                <div
                    className={
                        `flex justify-between items-center w-full h-full px-6 sm:px-10 md:px-16 rounded-2xl transition-all duration-300 text-white shadow-md border border-white/5 ` +
                        (temDados
                            ? 'bg-[#4a54ff] bg-cover bg-right md:bg-center'
                            : 'bg-zinc-300')
                    }
                    style={
                        temDados && !isMobileOrTablet
                            ? { backgroundImage: "url('/images/dash/backgroundTotalGeral.png')" } 
                            : undefined
                    }
                >
                    <div className="w-full flex flex-col justify-center py-4">
                        <span className="font-bold text-xs sm:text-sm uppercase tracking-widest text-zinc-300">Total Geral</span>
                        <h2 className="font-black text-2xl sm:text-4xl md:text-5xl tracking-tight my-1 drop-shadow-sm">
                            {temDados ? (total / 1000).toFixed(1) : "0.0"} ton
                        </h2>
                        <span className="text-xs sm:text-sm text-zinc-300 font-medium opacity-90">Total de resíduos eletrônicos gerenciados</span>
                    </div>
                </div>
            </div>

        </div>
    );
}