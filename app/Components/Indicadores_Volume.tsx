'use client'

import { useEffect, useState } from "react";

interface OS {
    os: string;
    processado: number;
}

interface RegistroMensal {
    ano_mes: number;
    meta_mensal: number;
    indicadores: {
        co2: number;
        agua: number;
        energia: number;
    };
    ordens_servico: OS[];
}

interface Props {
    anoSelecionado: number;
    periodoSelecionado: number;
    tipoIntervalo: "trimestre" | "mes";
    clienteSelecionado: string;
}

interface LinhaTabela {
    label: string;
    volumeProcessado: number;
    meta: number;
    status: number;
    isOS?: boolean; // Flag para identificar se é uma linha de Ordem de Serviço
}

export default function Indicadores_Volume({
    anoSelecionado,
    periodoSelecionado,
    tipoIntervalo,
    clienteSelecionado
}: Props) {
    const [linhas, setLinhas] = useState<LinhaTabela[]>([]);
    const [indicadoresTotais, setIndicadoresTotais] = useState({ co2: 0, agua: 0, energia: 0 });
    const [totalGeral, setTotalGeral] = useState(0);

    const calcularVolumeOS = (ordens: OS[]) => ordens.reduce((acc, os) => acc + os.processado, 0);

    const criarLinha = (label: string, volume: number, meta: number, isOS = false): LinhaTabela => ({
        label,
        volumeProcessado: volume,
        meta,
        status: meta > 0 ? Math.min((volume / meta) * 100, 100) : 0,
        isOS
    });

    useEffect(() => {
        async function carregarDados() {
            try {
                const response = await fetch("/Json/indicadoresVolume.json");
                if (!response.ok) throw new Error("Arquivo JSON não encontrado");

                const data = await response.json();
                const todosRegistros: RegistroMensal[] = data.registros || [];

                const anoAlvo = Number(anoSelecionado);
                const periodoAlvo = Number(periodoSelecionado);

                let registrosParaExibicao: RegistroMensal[] = [];
                let novasLinhas: LinhaTabela[] = [];

                if (periodoAlvo === 0) {
                    const registrosDoAno = todosRegistros.filter(r => Math.floor(r.ano_mes / 100) === anoAlvo);
                    registrosParaExibicao = registrosDoAno;

                    if (tipoIntervalo === "trimestre") {
                        [1, 2, 3, 4].forEach(q => {
                            const meses = [q * 3 - 2, q * 3 - 1, q * 3].map(m => anoAlvo * 100 + m);
                            const registrosTri = registrosDoAno.filter(r => meses.includes(r.ano_mes));
                            if (registrosTri.length > 0) {
                                const vol = registrosTri.reduce((acc, r) => acc + calcularVolumeOS(r.ordens_servico), 0);
                                const meta = registrosTri.reduce((acc, r) => acc + r.meta_mensal, 0);
                                novasLinhas.push(criarLinha(`${q}° Trimestre de ${anoAlvo}`, vol, meta));
                            }
                        });
                    } else {
                        novasLinhas = registrosDoAno.map(r =>
                            criarLinha(`Mês ${r.ano_mes.toString().slice(4)} / ${anoAlvo}`, calcularVolumeOS(r.ordens_servico), r.meta_mensal)
                        );
                    }
                }
                else if (tipoIntervalo === "trimestre") {
                    const meses = [periodoAlvo * 3 - 2, periodoAlvo * 3 - 1, periodoAlvo * 3].map(m => anoAlvo * 100 + m);
                    const registrosTri = todosRegistros.filter(r => meses.includes(r.ano_mes));
                    registrosParaExibicao = registrosTri;

                    registrosTri.forEach(r => {
                        novasLinhas.push(criarLinha(`Mês ${r.ano_mes.toString().slice(4)} / ${anoAlvo}`, calcularVolumeOS(r.ordens_servico), r.meta_mensal));
                    });
                    if (registrosTri.length > 0) {
                        const vol = registrosTri.reduce((acc, r) => acc + calcularVolumeOS(r.ordens_servico), 0);
                        const meta = registrosTri.reduce((acc, r) => acc + r.meta_mensal, 0);
                        novasLinhas.push(criarLinha(`TOTAL DO ${periodoAlvo}° TRIMESTRE`, vol, meta));
                    }
                }
                else {
                    const codigoMes = anoAlvo * 100 + periodoAlvo;
                    const registroMes = todosRegistros.find(r => r.ano_mes === codigoMes);
                    if (registroMes) {
                        registrosParaExibicao = [registroMes];
                        // Linha principal do mês
                        novasLinhas.push(criarLinha(`Resumo Mês ${periodoAlvo} / ${anoAlvo}`, calcularVolumeOS(registroMes.ordens_servico), registroMes.meta_mensal));

                        // Detalhamento por Ordens de Serviço
                        registroMes.ordens_servico.forEach(os => {
                            // Para as OS individuais, não aplicamos meta (0) para não exibir barra de status ou meta fixa
                            novasLinhas.push(criarLinha(os.os, os.processado, 0, true));
                        });
                    }
                }

                const indicadores = registrosParaExibicao.reduce((acc, curr) => ({
                    co2: acc.co2 + curr.indicadores.co2,
                    agua: acc.agua + curr.indicadores.agua,
                    energia: acc.energia + curr.indicadores.energia,
                }), { co2: 0, agua: 0, energia: 0 });

                const totalVolume = registrosParaExibicao.reduce((acc, curr) => acc + calcularVolumeOS(curr.ordens_servico), 0);

                setLinhas(novasLinhas);
                setIndicadoresTotais(indicadores);
                setTotalGeral(totalVolume);

            } catch (error) {
                console.error("Erro no componente Indicadores_Volume:", error);
            }
        }
        carregarDados();
    }, [anoSelecionado, periodoSelecionado, tipoIntervalo]);

    return (
        <div id="indicadoresVolume" className=" flex flex-col gap-2 h-full w-full rounded-lg overflow-hidden">

            <div className="p-2 flex-shrink-0 bg-[#f8fafd] rounded-lg border border-gray-300 shadow-md">
                <h3 className="text-sm font-bold mb-2 text-[#4a54ff]">Indicadores Ambientais</h3>
                <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
                    <CardIndicador emoji="🍃" valor={indicadoresTotais.co2} unidade="t" desc="CO₂ Mitigado" cor="text-green-700" />
                    <CardIndicador emoji="💧" valor={indicadoresTotais.agua} unidade="m³" desc="Agua poupada" cor="text-blue-600" />
                    <CardIndicador emoji="⚡" valor={indicadoresTotais.energia} unidade="MWh" desc="Energia poupada" cor="text-yellow-600 " />
                </div>
            </div>

            <div className="flex-1 flex flex-col px-2 overflow-hidden min-h-0 bg-[#f8fafd] py-1 rounded-lg border-gray-300 shadow-md">
                <h3 className="text-sm font-bold mb-1 text-[#4a54ff]">Volumes Processados</h3>
                <div className="flex-grow overflow-y-auto border border-gray-300 rounded-t-md bg-white custom-scrollbar ">
                    <table className="w-full text-[11px] text-left border-collapse table-fixed">
                        <thead className="bg-[#f3f2fe] sticky top-0 z-20 border-b border-gray-300 ">
                            <tr className="text-[#4a54ff] font-bold">
                                <th className="p-2 w-[40%] font-bold">Período / OS</th>
                                <th className="p-2 w-[30%] text-center font-bold">Status (Meta)</th>
                                <th className="p-2 w-[30%] text-right font-bold px-4">Vol. Proc. (kg)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 ">
                            {linhas.length > 0 ? (
                                linhas.map((linha, i) => (
                                    <tr key={i} className={`hover:bg-gray-50 ${linha.label.includes('TOTAL') ? 'bg-blue-50 font-bold' : ''} ${linha.isOS ? 'bg-zinc-50' : ''}`}>
                                        <td className={`p-2 text-gray-700 ${linha.isOS ? 'pl-6 italic text-gray-500' : 'font-semibold'}`}>
                                            {linha.isOS ? `↳ ${linha.label}` : linha.label}
                                        </td>
                                        <td className="p-2 text-center">
                                            {!linha.isOS ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="flex-1 bg-gray-200 rounded-full h-1.5 overflow-hidden">
                                                        <div
                                                            className={`h-full transition-all duration-500 ${linha.status >= 100 ? 'bg-green-600' : 'bg-[#ffad81]'}`}
                                                            style={{ width: `${linha.status}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-[9px] text-gray-500 w-6">{Math.round(linha.status)}%</span>
                                                </div>
                                            ) : (
                                                <span className="text-[9px] text-gray-400">---</span>
                                            )}
                                        </td>
                                        <td className={`p-2 text-right px-4 ${linha.isOS ? 'text-gray-600 font-normal' : 'font-bold text-gray-800'}`}>
                                            {linha.volumeProcessado.toLocaleString('pt-BR')}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3} className="p-10 text-center text-gray-400">Nenhum registro encontrado</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="p-2 flex-shrink-0 flex justify-between text-xs font-bold text-[#4a54ff]">
                    <span>TOTAL PROCESSADO NO PERÍODO</span>
                    <span>{totalGeral.toLocaleString('pt-BR')} kg</span>
                </div>
            </div>


        </div>
    );
}

function CardIndicador({ emoji, valor, unidade, desc, cor }: any) {
    return (
        <div className="min-w-[130px] flex-1 bg-white p-2 rounded border border-gray-300 flex flex-col items-center">
            <div className={`flex items-center gap-1 text-lg font-bold ${cor}`}>
                {emoji} {valor.toLocaleString('pt-BR')} {unidade}
            </div>
            <p className="text-[9px] text-gray-500 text-center ">{desc}</p>
        </div>
    );
}