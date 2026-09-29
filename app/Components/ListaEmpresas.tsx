'use client'

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

interface EmpresaMensal {
    nome: string;
    cnpj: string;
    volume_coletado: number;
}

interface RegistroMensal {
    ano_mes: number;
    empresas: EmpresaMensal[];
    total: number;
}

// ATUALIZAÇÃO: Interface alinhada com as novas props do Dashboard
interface PropsLista {
    anoSelecionado: number;
    periodoSelecionado: number;
    tipoIntervalo: "trimestre" | "mes";
    clienteSelecionado: string;
}

interface EmpresaConsolidada {
    nome: string;
    cnpj: string;
    volume_total: number;
}

export default function ListaEmpresas({ 
    anoSelecionado, 
    periodoSelecionado, 
    tipoIntervalo, 
    clienteSelecionado 
}: PropsLista) {
    const [dadosExibicao, setDadosExibicao] = useState<EmpresaConsolidada[]>([]);
    const [totalGeral, setTotalGeral] = useState<number>(0);

    async function resgatarDados() {
        try {
            const response = await fetch("/Json/listaEmpresas.json");
            const data = await response.json();
            const registros: RegistroMensal[] = data.registros_mensais || [];

            let registrosFiltrados: RegistroMensal[] = [];

            // NOVA LÓGICA DE FILTRAGEM (Ano, Trimestre ou Mês)
            if (periodoSelecionado === 0) {
                // TUDO (Ano Inteiro)
                registrosFiltrados = registros.filter(reg => 
                    Math.floor(reg.ano_mes / 100) === anoSelecionado
                );
            } else if (tipoIntervalo === "trimestre") {
                // POR TRIMESTRE
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
                // POR MÊS INDIVIDUAL
                const codigoMes = anoSelecionado * 100 + periodoSelecionado;
                registrosFiltrados = registros.filter(reg => reg.ano_mes === codigoMes);
            }

            // Consolidar volumes
            const mapaEmpresas: { [cnpj: string]: EmpresaConsolidada } = {};
            let somaTotalPeriodo = 0;

            registrosFiltrados.forEach(mes => {
                mes.empresas.forEach(emp => {
                    // Aqui no futuro você poderá filtrar pelo clienteSelecionado se necessário
                    if (!mapaEmpresas[emp.cnpj]) {
                        mapaEmpresas[emp.cnpj] = {
                            nome: emp.nome,
                            cnpj: emp.cnpj,
                            volume_total: 0
                        };
                    }
                    mapaEmpresas[emp.cnpj].volume_total += emp.volume_coletado;
                    somaTotalPeriodo += emp.volume_coletado;
                });
            });

            const listaFinal = Object.values(mapaEmpresas).sort((a, b) => b.volume_total - a.volume_total);

            setDadosExibicao(listaFinal);
            setTotalGeral(somaTotalPeriodo);
        }
        catch (erro) {
            console.error(`Erro ao buscar empresas: ${erro}`);
        }
    }

    useEffect(() => {
        resgatarDados();
    }, [anoSelecionado, periodoSelecionado, tipoIntervalo, clienteSelecionado]);

    // Função para gerar o texto do título dinamicamente
    const getTitulo = () => {
        if (periodoSelecionado === 0) return `Empresas - Ano ${anoSelecionado}`;
        if (tipoIntervalo === "trimestre") return `Empresas - ${periodoSelecionado}° trimestre de ${anoSelecionado}`;
        return `Empresas - Mês ${periodoSelecionado} de ${anoSelecionado}`;
    };

    return (
        <div id="listaEmpresa" className="bg-white flex flex-col h-full shadow-md rounded-lg overflow-hidden">
            <h3 className="text-lg font-bold px-4 py-2 text-[#4a54ff]">
                {getTitulo()}
            </h3>
            <hr className="mx-7 text-gray-100 mb-3"/>

            <div className="flex-1 overflow-y-auto overflow-x-hidden custom-scrollbar px-5">
                <table className="w-full border-collapse text-sm">
                    <thead className="sticky top-0 bg-white z-10">
                        <tr className="text-left text-[#4a54ff]">
                            <th className="p-2 font-bold">Empresa</th>
                            <th className="p-2 font-bold">CNPJ</th>
                            <th className="p-2 font-bold text-right">Volume (Ton)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {dadosExibicao.length > 0 ? (
                            dadosExibicao.map((emp, i) => (
                                <tr key={i} className="hover:bg-gray-50">
                                    <td className="p-2 flex gap-3.5 items-center">
                                        <div className="rounded-full bg-[#eeeefd] px-2 py-1.5">
                                            <FontAwesomeIcon icon={faBuilding} className="text-[#4a54ff]"/>
                                        </div>
                                        {emp.nome}
                                    </td>
                                    <td className="p-2 text-gray-600 text-xs">{emp.cnpj}</td>
                                    <td className="p-2 text-right font-medium">
                                        {(emp.volume_total / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={3} className="p-10">
                                    <div className="flex flex-col items-center justify-center text-gray-400 text-center">
                                        {/* ÍCONE DE ARQUIVO SOLICITADO */}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-20"><path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="9" y1="9" x2="10" y2="9"/></svg>
                                        <p className="text-sm font-bold uppercase tracking-widest">Sem dados para este período</p>
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div className="bg-[#f8f7fd] border-t border-gray-300 p-2 flex justify-between font-bold text-[#4a54ff]">
                <span>TOTAL NO PERÍODO</span>
                <span>{(totalGeral / 1000).toLocaleString('pt-BR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} ton</span>
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