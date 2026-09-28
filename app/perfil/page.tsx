"use client"
import { useState, useEffect } from "react";
import Header from "../Components/Header/page";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGear, faPencil, faEnvelope as faEnvelopeSolid, faLock, faUserGroup, faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { faEnvelope as faEnvelopeRegular } from "@fortawesome/free-regular-svg-icons";
import Link from "next/link";

interface UserData {
    email: string;
    role: "INTERNO" | "CLIENTE";
}

export default function Perfil() {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [mostrarModalSair, setMostrarModalSair] = useState(false);
    const [mostrarModalSenha, setMostrarModalSenha] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [loadingPerfil, setLoadingPerfil] = useState(true);
    const [loadingSenha, setLoadingSenha] = useState(false);
    const [merrorSenha, setErrorSenha] = useState("");
    const [successSenha, setSuccessSenha] = useState("");

    const router = useRouter();

    useEffect(() => {
        const carregarDadosPerfil = async () => {
            try {
                const response = await fetch('/api/auth/perfil', {
                    method: 'GET',
                    credentials: 'include'
                });

                if (!response.ok) {
                    router.push('/login');
                    return;
                }

                const data = await response.json();
                setUserData({
                    email: data.email || localStorage.getItem('userName') || 'usuario@email.com',
                    role: data.role || 'CLIENTE'
                });
            } catch (error) {
                console.error("Erro ao carregar perfil:", error);
                setUserData({
                    email: localStorage.getItem('userName') || 'usuario@email.com',
                    role: 'CLIENTE'
                });
            } finally {
                setLoadingPerfil(false);
            }
        };

        carregarDadosPerfil();
    }, [router]);


    async function confirmarSaida() {
        try {
            await fetch('/api/auth/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch (error) {
            console.error("Erro ao fazer logout:", error);
        }

        localStorage.removeItem('userName');
        router.push('/login');
    }

    async function handleAlterarSenha(e: React.FormEvent) {
        e.preventDefault();
        setErrorSenha("");
        setSuccessSenha("");

        if (!senhaAtual.trim() || !novaSenha.trim() || !confirmarSenha.trim()) {
            setErrorSenha("Preencha todos os campos");
            return;
        }

        if (novaSenha.length < 6) {
            setErrorSenha("Nova senha deve ter no mínimo 6 caracteres");
            return;
        }

        if (novaSenha !== confirmarSenha) {
            setErrorSenha("As senhas não coincidem");
            return;
        }

        if (senhaAtual === novaSenha) {
            setErrorSenha("Nova senha não pode ser igual à senha atual");
            return;
        }

        setLoadingSenha(true);

        try {
            const response = await fetch('/api/auth/alterar-senha', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({
                    senhaAtual,
                    novaSenha
                })
            });

            if (response.ok) {
                setSuccessSenha("Senha alterada com sucesso!");
                setSenhaAtual("");
                setNovaSenha("");
                setConfirmarSenha("");
                setTimeout(() => {
                    setMostrarModalSenha(false);
                    setSuccessSenha("");
                }, 2000);
            } else {
                setErrorSenha("Falha ao alterar senha. Senha atual pode estar incorreta.");
            }
        } catch (error) {
            setErrorSenha("Erro de conexão. Tente novamente.");
        } finally {
            setLoadingSenha(false);
        }
    }

    return (
        <>
            {/* Correção do posicionamento do Header para ficar fixo e esticado no topo */}
            <div className="fixed top-0 left-0 w-full z-50">
                <Header>
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
                </Header>
            </div>

            <main className="w-screen min-h-screen bg-[url('/images/perfil/background.jpg')] bg-cover bg-center flex flex-col items-center justify-center px-3 pt-20">

                <div className="px-40 mb-7 text-white font-bold w-full">
                    <Link href={"/dashboard"} className="flex gap-1 items-center hover:scale-101 transition-all">
                        <FontAwesomeIcon icon={faArrowLeft} style={{color: "white",}} />
                        Voltar para Dashboard
                    </Link>
                </div>
                <div className="w-190 min-h-145 bg-white rounded-xl py-4 px-7 relative overflow-hidden">

                    <div className="flex flex-col items-center w-full">
                        <div className="w-24 h-24 rounded-full overflow-hidden shadow-md mb-3 flex justify-center items-center border border-gray-100 ">
                            <FontAwesomeIcon icon={faGear} style={{ color: "#4a54ff", }} className="text-5xl hover:rotate-[-50deg] transition-all duration-300" />
                        </div>
                        <h2 className="text-[1.9rem] font-bold">Meu Perfil</h2>
                        <p className="text-[0.85rem] text-gray-500">Gerencie suas informações de acesso e preferência</p>
                    </div>

                    {loadingPerfil ? (
                        <div className="flex justify-center items-center h-32 text-[#4a54ff] font-bold">
                            Carregando dados...
                        </div>
                    ) : userData ? (
                        <>
                            {/*E-mail*/}
                            <div className="rounded-lg shadow-md border border-gray-50 p-3 mt-4 px-7">
                                <div className="flex items-center gap-2 text-[1.3rem]">
                                    <FontAwesomeIcon icon={faEnvelopeRegular} style={{ color: "#4a54ff", }} />
                                    <span className="text-sm font-bold text-[1.05rem]">E-mail</span>
                                </div>
                                <p className="text-sm text-gray-600 mt-1">Este é o e-mail utilizado para acessar o sistema</p>
                                <p className="text-sm my-4 rounded-md border border-gray-200 p-2 bg-[#f9fafa]">{userData.email}</p>
                            </div>

                            {/*Senha*/}
                            <div className="rounded-lg shadow-md border border-gray-50 p-3 mt-4 px-7">
                                <div className="flex items-center gap-2 text-[1.3rem]">
                                    <FontAwesomeIcon icon={faLock} style={{ color: "#4a54ff", }} />
                                    <span className="text-sm font-bold text-[1.05rem]">Senha de Acesso</span>
                        </div>
                        <div className="flex justify-between">
                            <p className="text-sm text-gray-600 mt-1">Altere sua senha regularmente para manter sua conta segura</p>
                            <button 
                                onClick={() => setMostrarModalSenha(true)}
                                className="rounded-lg border border-gray-300 py-2 px-3 text-[#4a54ff] flex gap-1 items-center hover:bg-blue-50 transition-all"
                            >
                                <FontAwesomeIcon icon={faLock} style={{ color: "#4a54ff", }} />
                                <span className="text-sm font-bold">Alterar senha</span>
                            </button>
                        </div>
                    </div>

                    {/*Tipo de perfil*/}
                    <div className="rounded-lg shadow-md border border-[#dbd9f7] p-3 mt-4 px-7 bg-[#edecfc]">
                        <div className="flex items-center gap-2 text-[1.3rem]">
                            <div className="w-9 h-9 flex items-center justify-center rounded-full bg-[#e0dffd]">
                                <FontAwesomeIcon icon={faUserGroup} style={{ color: "#4a54ff", }} />
                            </div>
                            <div>
                                <p className="text-sm text-[0.7rem] text-gray-600 mt-2">Tipo de perfil</p>
                                <p className="text-[#4a54ff] font-bold text-[1.07rem] -mt-1">{userData.role}</p>
                                <p className="text-sm text-sm text-gray-600 ">Este é o nível de acesso atual da sua conta no sistema</p>

                            </div>

                        </div>
                    </div>
                        </>
                    ) : null}
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

                {/* Modal de alterar senha */}
                {mostrarModalSenha && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
                        <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-sm border border-white/20 flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                                <FontAwesomeIcon icon={faLock} style={{ color: "#4a54ff", fontSize: "32px" }} />
                            </div>

                            <h3 className="text-xl font-black text-[#4a54ff] uppercase tracking-tighter mb-2">
                                Alterar Senha
                            </h3>

                            {merrorSenha && (
                                <div className="mb-4 p-3 w-full bg-red-50 border border-red-300 rounded-lg text-red-700 text-xs font-bold">
                                    {merrorSenha}
                                </div>
                            )}

                            {successSenha && (
                                <div className="mb-4 p-3 w-full bg-green-50 border border-green-300 rounded-lg text-green-700 text-xs font-bold">
                                    {successSenha}
                                </div>
                            )}

                            <form onSubmit={handleAlterarSenha} className="w-full space-y-3">
                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Senha Atual</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Digite sua senha atual"
                                        className="w-full border-2 p-3 rounded-xl outline-none font-medium border-gray-100 bg-gray-50 focus:border-[#4a54ff]"
                                        value={senhaAtual}
                                        onChange={e => setSenhaAtual(e.target.value)}
                                        disabled={loadingSenha}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Nova Senha</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Digite sua nova senha (mín 6 caracteres)"
                                        className="w-full border-2 p-3 rounded-xl outline-none font-medium border-gray-100 bg-gray-50 focus:border-[#4a54ff]"
                                        value={novaSenha}
                                        onChange={e => setNovaSenha(e.target.value)}
                                        disabled={loadingSenha}
                                    />
                                </div>

                                <div>
                                    <label className="text-[10px] font-black uppercase text-gray-400 ml-1">Confirmar Nova Senha</label>
                                    <input
                                        type="password"
                                        required
                                        placeholder="Confirme sua nova senha"
                                        className="w-full border-2 p-3 rounded-xl outline-none font-medium border-gray-100 bg-gray-50 focus:border-[#4a54ff]"
                                        value={confirmarSenha}
                                        onChange={e => setConfirmarSenha(e.target.value)}
                                        disabled={loadingSenha}
                                    />
                                </div>

                                <div className="flex w-full gap-3 mt-6 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setMostrarModalSenha(false);
                                            setSenhaAtual("");
                                            setNovaSenha("");
                                            setConfirmarSenha("");
                                            setErrorSenha("");
                                        }}
                                        disabled={loadingSenha}
                                        className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-100 text-gray-400 font-black text-xs uppercase hover:bg-gray-50 transition-all hover:cursor-pointer"
                                    >
                                        Cancelar
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={loadingSenha}
                                        className="flex-1 px-4 py-3 rounded-xl bg-[#4a54ff] text-white font-black text-xs uppercase hover:bg-[#131ff8] transition-all shadow-lg disabled:bg-gray-300"
                                    >
                                        {loadingSenha ? 'Alterando...' : 'Alterar Senha'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

            </main>
        </>
    )
}