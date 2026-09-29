'use client'

import { useState } from "react";

interface FiltrosProps {
    onAnoChange: (ano: number) => void;
    onPeriodoChange: (periodo: number) => void;
    onClienteChange: (cliente: string) => void;
    onIntervaloChange: (tipo: "mes" | "trimestre") => void;
}

export default function FiltrosDashboard({ 
    onAnoChange, onPeriodoChange, onClienteChange, onIntervaloChange 
}: FiltrosProps) {
    const [intervalo, setIntervalo] = useState<"mes" | "trimestre">("trimestre");

    const meses = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    return (
        <div className="bg-white w-full p-2.5 flex flex-wrap items-center justify-evenly gap-4 rounded-xl shadow-md">
            
            {/* Filtro de Cliente */}
            <div className="flex gap-2 items-center">
                <label className="font-medium">Cliente</label>
                <select 
                    className="rounded-lg p-1 bg-white border border-gray-300"
                    onChange={(e) => onClienteChange(e.target.value)}
                >
                    <option value="todos">Todos os Clientes</option>
                    <option value="cliente_a">Cliente A</option>
                    <option value="cliente_b">Cliente B</option>
                </select>
            </div>

            {/* Filtro de Ano */}
            <div className="flex gap-2 items-center">
                <label className="font-medium">Ano</label>
                <select 
                    className="rounded-lg p-1 bg-white border border-gray-300"
                    onChange={(e) => onAnoChange(Number(e.target.value))}
                    defaultValue="2026"
                >
                    <option value="2026">2026</option>
                    <option value="2025">2025</option>
                </select>
            </div>

            {/* Filtro de Intervalo (Mês ou Trimestre) */}
            <div className="flex gap-2 items-center">
                <label className="font-medium">Intervalo</label>
                <select 
                    className="rounded-lg p-1 bg-white border border-gray-300"
                    onChange={(e) => {
                        const val = e.target.value as "mes" | "trimestre";
                        setIntervalo(val);
                        onIntervaloChange(val);
                    }}
                >
                    <option value="trimestre">Por Trimestre</option>
                    <option value="mes">Por Mês</option>
                </select>
            </div>

            {/* Filtro Dinâmico de Período */}
            <div className="flex gap-2 items-center">
                <label className="font-medium">Período</label>
                <select 
                    className="rounded-lg p-1 bg-white border border-gray-300"
                    onChange={(e) => onPeriodoChange(Number(e.target.value))}
                >
                    <option value="0">Tudo</option>
                    {intervalo === "trimestre" ? (
                        <>
                            <option value="1">1º Trimestre</option>
                            <option value="2">2º Trimestre</option>
                            <option value="3">3º Trimestre</option>
                            <option value="4">4º Trimestre</option>
                        </>
                    ) : (
                        meses.map((mes, index) => (
                            <option key={index} value={index + 1}>{mes}</option>
                        ))
                    )}
                </select>
            </div>
        </div>
    );
}