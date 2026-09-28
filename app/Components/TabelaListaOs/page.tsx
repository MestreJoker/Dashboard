'use client'

import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";

// Interfaces baseadas no seu indicadoresVolume.json
interface OS {
    os: string;
    processado: number;
    data: string;
}

interface RegistroMensal {
    ano_mes: number;
    ordens_servico: OS[];
}

interface PropsLista {
    anoSelecionado: number;
    periodoSelecionado: number;
    tipoIntervalo: "trimestre" | "mes";
    clienteSelecionado: string;
}

export default function TabelaListaOS({
    anoSelecionado,
    periodoSelecionado,
    tipoIntervalo,
    clienteSelecionado
}: PropsLista) {
    const [dadosExibicao, setDadosExibicao] = useState<OS[]>([]);
    const [totalGeral, setTotalGeral] = useState<number>(0);

    async function resgatarDados() {
        try {
            const response = await fetch("/Json/indicadoresVolume.json");
            const data = await response.json();
            const registros: RegistroMensal[] = data.registros || [];

            let registrosFiltrados: RegistroMensal[] = [];

            // Lógica de Filtragem idêntica à page.tsx
            if (periodoSelecionado === 0) {
                registrosFiltrados = registros.filter(reg =>
                    Math.floor(reg.ano_mes / 100) === anoSelecionado
                );
            } else if (tipoIntervalo === "trimestre") {
                const mesInicio = (periodoSelecionado - 1) * 3 + 1;
                const mesesDoTrimestre = [
                    anoSelecionado * 100 + mesInicio,
                    anoSelecionado * 100 + (mesInicio + 1),
                    anoSelecionado * 100 + (mesInicio + 2)
                ];
                registrosFiltrados = registros.filter(reg =>
                    mesesDoTrimestre.includes(reg.ano_mes)
                );
            } else {
                const codigoMes = anoSelecionado * 100 + periodoSelecionado;
                registrosFiltrados = registros.filter(reg => reg.ano_mes === codigoMes);
            }

            // Extrair e achatar a lista de OS dos meses filtrados
            const todasOS: OS[] = [];
            let somaTotal = 0;

            registrosFiltrados.forEach(mes => {
                mes.ordens_servico.forEach(os => {
                    todasOS.push(os);
                    somaTotal += os.processado;
                });
            });

            // Ordenar por data (opcional) ou manter a ordem do JSON
            setDadosExibicao(todasOS);
            setTotalGeral(somaTotal);
        }
        catch (erro) {
            console.error(`Erro ao buscar ordens de serviço: ${erro}`);
        }
    }

    useEffect(() => {
        resgatarDados();

        const intervalo = setInterval(() => {
            resgatarDados();
        }, 3000);

        return () => clearInterval(intervalo);
    }, [anoSelecionado, periodoSelecionado, tipoIntervalo, clienteSelecionado]);

    const getTitulo = () => {
        if (periodoSelecionado === 0) return `Detalhamento OS - Ano ${anoSelecionado}`;
        if (tipoIntervalo === "trimestre") return `Detalhamento OS - ${periodoSelecionado}° trimestre de ${anoSelecionado}`;
        return `Detalhamento OS - Mês ${periodoSelecionado} de ${anoSelecionado}`;
    };

    return (
        <div id="listaOS" className="bg-white flex flex-col h-full  rounded-lg overflow-hidden">
            <h3 className="text-lg font-bold px-4 py-2 text-[#4a54ff]">
                {getTitulo()}
            </h3>

            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-5">
                <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-white z-10 ">
                        <tr className="text-left">
                            <th className="p-2 font-bold text-[#4a54ff]">N° OS</th>
                            <th className="p-2 font-bold text-center text-[#4a54ff]">Data</th>
                            <th className="p-2 font-bold text-right text-[#4a54ff]">Volume (Kg)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 ">
                        {dadosExibicao.length > 0 ? (
                            dadosExibicao.map((item, i) => (
                                <tr key={i} className="hover:bg-gray-50 ">
                                    <td className="p-2 font-medium flex gap-3.5 items-center">
                                        <div className="py-2 px-2 items-center bg-[#eeeefd] rounded-full">
                                            <FontAwesomeIcon icon={faGear} className="text-[#4a54ff]" />
                                        </div>
                                        {item.os}
                                    </td>
                                    <td className="p-2 text-center text-gray-600 text-xs ">{item.data}</td>
                                    <td className="p-2 text-right font-bold">
                                        {item.processado.toLocaleString('pt-BR')}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-10 text-center text-gray-400">
                                    <p className="text-sm font-bold uppercase tracking-widest">Sem ordens de serviço</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#f8f7fd] border-t border-gray-300 p-2 flex justify-between font-bold text-sm text-[#4a54ff]">
                <span>TOTAL PROCESSADO</span>
                <span>{totalGeral.toLocaleString('pt-BR')} kg</span>
            </div>

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #888; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #555; }
            `}</style>
        </div>
    );
}