'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../Components/Header/page';
import { getStoredSession, loginLocalUser } from '../utils/localAuth';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [showRecovery, setShowRecovery] = useState(false);
    const [recoveryEmail, setRecoveryEmail] = useState('');
    const [recoveryMsg, setRecoveryMsg] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    useEffect(() => {
        const session = getStoredSession();
        if (session) {
            router.replace('/dashboard');
        }
    }, [router]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!username.trim() || !password.trim()) {
            setError('Preencha todos os campos');
            setLoading(false);
            return;
        }

        try {
            loginLocalUser(username, password);
            router.push('/dashboard');
        } catch {
            setError('Erro ao processar login local');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <div className='absolute w-full' >
            <Header />
        </div>

        <div className="flex min-h-screen items-center justify-center bg-[#4a54ff] bg-[url('/images/auth/background.png')] bg-cover bg-center p-4 font-sans text-zinc-800 transition-colors duration-300">
            <div className="w-full max-w-md p-10 rounded-3xl shadow-2xl transition-all duration-300 border bg-white border-white/20 mt-10">
                <div className="flex flex-col items-center mb-8 text-center">
                    <h1 className="text-2xl font-black text-[#4a54ff] tracking-tighter uppercase ">Login</h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">Acesso ao Painel</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic">E-mail</label>
                        <input
                            type="email"
                            required
                            autoComplete="username"
                            className="w-full border-2 p-3 rounded-xl outline-none font-medium transition-all border-gray-100 bg-gray-50 focus:border-[#4a54ff]"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic">Senha</label>
                        <input
                            type="password"
                            required
                            autoComplete="current-password"
                            className="w-full border-2 p-3 rounded-xl outline-none transition-all border-gray-100 bg-gray-50 focus:border-[#4a54ff]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <div className="flex justify-between items-center mt-2">
                        <button
                            type="button"
                            className="text-xs text-[#4a54ff] font-bold underline hover:text-[#131ff8] focus:outline-none"
                            onClick={() => setShowRecovery(true)}
                            tabIndex={0}
                        >
                            Esqueci minha senha
                        </button>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full p-4 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 flex justify-center items-center hover:cursor-pointer hover:scale-[1.02] disabled:bg-gray-300 bg-[#4a54ff] text-white hover:bg-[#131ff8]"
                    >
                        {loading ? <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div> : 'ENTRAR NO SISTEMA'}
                    </button>
                </form>

                <div className="mt-8 pt-6 border-t border-gray-100 text-center">
                    <p className="text-xs text-gray-400 font-medium italic">
                        Precisa de uma conta? <Link href="/register" className="text-[#4a54ff] font-bold underline hover:text-[#131ff8]">Cadastre-se</Link>
                    </p>
                </div>
            </div>
        </div>

        {/* Modal de recuperação de senha */}
        {showRecovery && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-sm border border-white/20 flex flex-col items-center text-center">
                    <h2 className="text-xl font-black text-[#4a54ff] uppercase tracking-tighter mb-2">Recuperar Senha</h2>
                    <p className="text-xs text-gray-500 mb-4">A recuperação por e-mail não está disponível no modo local.</p>
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            setRecoveryMsg('Use o cadastro local para iniciar uma nova sessão.');
                        }}
                        className="w-full flex flex-col gap-3"
                    >
                        <input
                            type="email"
                            required
                            placeholder="Seu e-mail"
                            className="w-full border-2 p-3 rounded-xl outline-none font-medium border-gray-100 bg-gray-50 focus:border-[#4a54ff]"
                            value={recoveryEmail}
                            onChange={e => setRecoveryEmail(e.target.value)}
                        />
                        <button
                            type="submit"
                            className="w-full p-3 rounded-xl font-black text-sm transition-all shadow-lg bg-[#4a54ff] text-white hover:bg-[#131ff8] disabled:bg-gray-300"
                        >
                            Continuar
                        </button>
                        {recoveryMsg && <div className="text-xs mt-2 text-[#4a54ff] font-bold">{recoveryMsg}</div>}
                    </form>
                    <button
                        className="mt-5 text-xs text-gray-400 underline hover:text-[#4a54ff]"
                        onClick={() => {
                            setShowRecovery(false);
                            setRecoveryEmail('');
                            setRecoveryMsg('');
                        }}
                    >
                        Voltar ao login
                    </button>
                </div>
            </div>
        )}
        </>
    );
}