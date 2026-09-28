'use client'

import { useEffect, useState } from "react";

interface ItemDado {
    label: string;
    valor: number;
    cor: string;
}

interface Props {
    anoSelecionado: number;
    periodoSelecionado: number; // 0 para ano todo, ou 1-12 para meses
    tipoVisao: "bancada" | "cnpj" | "material";
}

export default function GraficoRosca({ anoSelecionado, periodoSelecionado, tipoVisao }: Props) {
    const [dadosFormatados, setDadosFormatados] = useState<any[]>([]);
    const [totalKg, setTotalKg] = useState(0);

    useEffect(() => {
        async function carregarDados() {
            try {
                const response = await fetch("/Json/AnaliseComparativa/distribuicao.json");
                const json = await response.json();
                const registros = json.registros;

                const ano = Number(anoSelecionado);
                const periodo = Number(periodoSelecionado);

                let itensFiltrados: ItemDado[] = [];

                if (periodo === 0) {
                    // Lógica para ANO INTEIRO: Soma todos os meses do ano X
                    const mesesDoAno = registros.filter((r: any) => Math.floor(r.ano_mes / 100) === ano);
                    
                    const mapaSoma = new Map();
                    mesesDoAno.forEach((mes: any) => {
                        mes[tipoVisao]?.forEach((item: ItemDado) => {
                            const atual = mapaSoma.get(item.label) || { valor: 0, cor: item.cor };
                            mapaSoma.set(item.label, { valor: atual.valor + item.valor, cor: item.cor });
                        });
                    });
                    itensFiltrados = Array.from(mapaSoma, ([label, info]) => ({ label, valor: info.valor, cor: info.cor }));
                } else {
                    // Lógica para MÊS ESPECÍFICO
                    const codigoBusca = ano * 100 + periodo;
                    const registroMes = registros.find((r: any) => r.ano_mes === codigoBusca);
                    if (registroMes) {
                        itensFiltrados = registroMes[tipoVisao];
                    }
                }

                const somaTotal = itensFiltrados.reduce((acc, i) => acc + i.valor, 0);
                const comPorcentagem = itensFiltrados.map(i => ({
                    ...i,
                    porcentagem: somaTotal > 0 ? (i.valor / somaTotal) * 100 : 0
                }));

                setDadosFormatados(comPorcentagem);
                setTotalKg(somaTotal);
            } catch (e) {
                console.error("Erro no gráfico:", e);
            }
        }
        carregarDados();
    }, [anoSelecionado, periodoSelecionado, tipoVisao]);

    // Lógica do Gradiente
    let acumulado = 0;
    const conicGradient = dadosFormatados.map(i => {
        const str = `${i.cor} ${acumulado}% ${acumulado + i.porcentagem}%`;
        acumulado += i.porcentagem;
        return str;
    }).join(", ");

    return (
        <div className="w-1/2 flex flex-col p-4 items-center justify-center relative bg-white shrink-0 border border-gray-300 rounded-xl shadow-md">
            <h4 className="text-[12px] font-bold text-center  absolute top-2 uppercase text-[#4a54ff]">Distribuição por {tipoVisao}</h4>
            
            {/* Gráfico Ajustado para 1080p */}
            <div 
                className="relative w-44 h-44 md:w-52 md:h-52 rounded-full flex items-center justify-center shadow-lg group mt-3"
                style={{ background: totalKg > 0 ? `conic-gradient(${conicGradient})` : "#e5e7eb" }}
            >
                <div className="w-24 h-24 md:w-28 md:h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner ">
                    <span className="text-[10px] text-gray-400 font-bold">TOTAL</span>
                    <span className="text-sm font-black">{(totalKg / 1000).toFixed(1)}t</span>
                </div>

                {/* Tooltip */}
                <div className="absolute hidden group-hover:flex flex-col bg-zinc-900 text-white p-2 rounded text-[10px] z-50 -top-10 shadow-xl border border-white/20">
                    {dadosFormatados.map((d, i) => (
                        <p key={i}>{d.label}: <strong>{d.porcentagem.toFixed(1)}%</strong></p>
                    ))}
                </div>
            </div>

            {/* Legendas */}
            <div className="mt-6 grid grid-cols-2 gap-x-4 gap-y-1">
                {dadosFormatados.map((d, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-[10px] font-bold">
                        <div className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: d.cor }}></div>
                        {d.label}
                    </div>
                ))}
            </div>
        </div>
    );
}