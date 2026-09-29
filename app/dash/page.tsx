'use client'

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import AnaliseComparativa from "@/app/Components/AnaliseComparativa/page"
import FiltrosDashboard from "@/app/Components/FiltrosDashboard"
import Indicadores_Volume from "@/app/Components/Indicadores_Volume"
import ListaEmpresas from "@/app/Components/ListaEmpresas"
import VisaoGeral from "@/app/Components/VisaoGeral"
import TabelaListaOS from "@/app/Components/TabelaListaOs";
import Header from "../Components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserGear } from "@fortawesome/free-solid-svg-icons";

type TipoUsuario = "CLIENTE" | "INTERNO";

export default function Dashboard() {
    // Definido automaticamente como "INTERNO" e autenticado como true
    const [userName, setUserName] = useState('Usuário Interno');
    const [tipoUsuario, setTipoUsuario] = useState<TipoUsuario>("INTERNO");
    const [autenticado, setAutenticado] = useState(true);
    const [mostrarModalSair, setMostrarModalSair] = useState(false);

    const [ano, setAno] = useState(2026);
    const [cliente, setCliente] = useState("todos");
    const [intervalo, setIntervalo] = useState<"trimestre" | "mes">("trimestre");
    const [periodo, setPeriodo] = useState(0);

    const router = useRouter();

    const [corLinkPerfil, setCorLinkPerfil] = useState("text-zinc-100 ")

    useEffect(() => {
        // Pega o nome do localStorage apenas se existir, senão mantém o padrão
        const storedName = localStorage.getItem('userName');
        if (storedName && storedName.trim() !== "") {
            setUserName(storedName);
        }
    }, []);

    function confirmarSaida() {
        // Apenas limpa o localStorage e redireciona, sem requisições de API
        localStorage.removeItem('userName');
        router.push('/login');
    }

    function exibirTipoTexto() {
        if (tipoUsuario === "INTERNO") return "Acesso Interno";
        if (tipoUsuario === "CLIENTE") return "Acesso Cliente";
        return "Carregando...";
    }

    function exibirTabela() {
        if (tipoUsuario === "INTERNO") {
            return (
                <ListaEmpresas
                    anoSelecionado={ano}
                    periodoSelecionado={periodo}
                    tipoIntervalo={intervalo}
                    clienteSelecionado={cliente}
                />
            )
        }

        return (
            <TabelaListaOS
                anoSelecionado={ano}
                periodoSelecionado={periodo}
                tipoIntervalo={intervalo}
                clienteSelecionado={cliente}
            />
        )
    }

    const renderizarComponenteComFiltros = (Componente: any) => {
        return (
            <Componente
                anoSelecionado={ano}
                periodoSelecionado={periodo}
                tipoIntervalo={intervalo}
                clienteSelecionado={cliente}
            />
        );
    }

    if (!autenticado) {
        return (
            <div className="min-h-screen bg-[#f4f4f5] flex items-center justify-center">
                <div className="animate-pulse text-[#4a54ff] font-black uppercase tracking-widest text-xs">
                    Carregando Dashboard...
                </div>
            </div>
        )
    }

    return (
        <main className="flex flex-col min-h-screen bg-[#efeefd]">

            <Header shadow="shadow-xl" border="border-b" color="bg-[#4a54ff]">
                <div className="flex items-center gap-6 bg-zinc-900/50  px-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-2 hover:scale-103 hover:cursor-pointer transition-all py-1.5" onMouseEnter={() => setCorLinkPerfil("text-[#fc764a]")} onMouseLeave={() => setCorLinkPerfil("text-zinc-80")}>
                        <FontAwesomeIcon icon={faUserGear} className={`${corLinkPerfil}`}/>
                        <div className="flex flex-col items-end">
                            <span className="text-[9px] uppercase tracking-[0.15em] text-[#fa4242] font-black mb-1">
                                {exibirTipoTexto()}
                            </span>

                            <span className={`text-sm md:text-base font-bold  italic -mt-2 ${corLinkPerfil}`}>
                                {userName || 'Carregando...'}
                            </span>
                        </div>

                    </div>

                    <div className="w-[1px] h-8 bg-white/10 mx-1"></div>

                    <button
                        onClick={() => setMostrarModalSair(true)}
                        className="group flex items-center gap-2 text-[10px] uppercase tracking-widest bg-transparent hover:bg-red-500/10 text-zinc-400 hover:text-red-500 hover:cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 border border-transparent hover:border-red-500/50"
                    >
                        <span className="font-black">Sair</span>

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" x2="9" y1="12" y2="12" />
                        </svg>
                    </button>
                </div>
            </Header>

            <div id="content" className="py-2 px-5 flex flex-col gap-3 flex-1">
                <FiltrosDashboard
                    onAnoChange={setAno}
                    onClienteChange={setCliente}
                    onIntervaloChange={setIntervalo}
                    onPeriodoChange={setPeriodo}
                />

                <div
                    id="graficosDashboard"
                    className="grid grid-cols-1 xl:grid-cols-2 w-full gap-2 flex-1"
                >
                    <div className="min-h-[400px] lg:max-h-[402.5px]">
                        {renderizarComponenteComFiltros(VisaoGeral)}
                    </div>

                    <div className="min-h-[400px] max-h-[402.5px]">
                        {exibirTabela()}
                    </div>

                    <div className="min-h-[400px] max-h-[402.5px]">
                        <Indicadores_Volume
                            anoSelecionado={ano}
                            periodoSelecionado={periodo}
                            tipoIntervalo={intervalo}
                            clienteSelecionado={cliente}
                        />
                    </div>

                    <div className="min-h-[400px] max-h-[402.5px]">
                        {renderizarComponenteComFiltros(AnaliseComparativa)}
                    </div>
                </div>
            </div>

            {mostrarModalSair && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20 flex flex-col items-center text-center">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4">
                            <svg
                                className="text-red-500"
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                        </div>

                        <h3 className="text-xl font-black text-[#4a54ff] uppercase tracking-tighter">
                            Finalizar Sessão?
                        </h3>

                        <p className="text-gray-500 text-sm mt-2 font-medium">
                            Você precisará fazer login novamente para acessar os dados.
                        </p>

                        <div className="flex w-full gap-3 mt-8">
                            <button
                                onClick={() => setMostrarModalSair(false)}
                                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-400 font-black text-xs uppercase hover:bg-gray-50 transition-all hover:cursor-pointer hover:scale-103"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={confirmarSaida}
                                className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-black text-xs uppercase hover:bg-red-600 transition-all shadow-lg hover:cursor-pointer hover:scale-103"
                            >
                                Sair Agora
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @media(max-width: 390px) {
                    header {
                        height: 45px;
                    }

                    #logo {
                        width: 100px;
                        margin-left: -20px;
                    }
                }
            `}</style>
        </main>
    )
}