'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Header from '../Components/Header/page';
import { registerLocalUser } from '../utils/localAuth';

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        confirmacao: '',
        role: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const router = useRouter();

    // Validação no cliente
    const validateForm = (): boolean => {
        const newErrors: { [key: string]: string } = {};

        // Validar username (Tratado agora como E-mail devido à nova regra de negócio)
        if (!formData.username.trim()) {
            newErrors.username = 'E-mail é obrigatório';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.username)) {
            newErrors.username = 'Digite um e-mail válido';
        } else if (formData.username.length > 100) {
            newErrors.username = 'Máximo 100 caracteres';
        }

        // Validar role
        if (!formData.role || formData.role === '0') {
            newErrors.role = 'Selecione um tipo de acesso';
        }

        // Validar senha
        if (!formData.password) {
            newErrors.password = 'Senha é obrigatória';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Mínimo 6 caracteres';
        } else if (formData.password.length > 255) {
            newErrors.password = 'Máximo 255 caracteres';
        }

        // Validar confirmação
        if (!formData.confirmacao) {
            newErrors.confirmacao = 'Confirme a senha';
        } else if (formData.password !== formData.confirmacao) {
            newErrors.confirmacao = 'Senhas não coincidem';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);

        try {
            const result = registerLocalUser(formData.username, formData.password, formData.role as 'CLIENTE' | 'INTERNO');

            if (result.success) {
                alert('Usuário cadastrado com sucesso!');
                router.push('/dashboard');
            } else {
                setErrors({ submit: result.message });
            }
        } catch (error) {
            setErrors({ submit: 'Erro ao processar cadastro local' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className='absolute w-full z-0' >
                <Header />
            </div>

            <div className="flex h-screen w-full items-center justify-center bg-[#4a54ff] bg-[url('/images/auth/background.png')] bg-cover bg-center p-4 font-sans text-zinc-800 transition-colors duration-300">

                <div className="
                w-full max-w-md rounded-3xl shadow-2xl border transition-all duration-300 flex flex-col overflow-hidden
                bg-white border-white/20 mt-12 z-10
            ">

                    <div className="p-8 pb-4 text-center">
                        <h2 className="text-2xl font-black text-[#4a54ff] mb-1 uppercase tracking-tighter ">Cadastro</h2>
                        <p className="text-gray-400 text-sm font-medium italic ">Criação de novo usuário</p>
                    </div>

                    {errors.submit && (
                        <div className="mx-8 mt-4 p-3 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
                            {errors.submit}
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="px-8 py-4 space-y-4">
                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic">E-mail</label>
                            <input
                                type="email"
                                required
                                autoComplete="email"
                                disabled={loading}
                                className={`
                                w-full border-2 p-3 rounded-xl outline-none font-medium transition-all
                                /* Tema Claro */
                                bg-gray-50 focus:border-[#131ff8]
                                ${errors.username ? 'border-red-300' : 'border-gray-100'}
                            `}
                                value={formData.username}
                                onChange={(e) => {
                                    setFormData({ ...formData, username: e.target.value });
                                    if (errors.username) setErrors({ ...errors, username: '' });
                                }}
                            />
                            {errors.username && <p className="text-red-600 text-xs mt-1">{errors.username}</p>}
                        </div>

                        <div>
                            <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic">Tipo de Acesso</label>
                            <select
                                required
                                disabled={loading}
                                className={`
                                border-2 w-full p-3 rounded-xl outline-none transition-all font-bold
                                /* Tema Claro */
                                bg-gray-50 focus:border-[#131ff8] text-[#4a54ff]
                                ${errors.role ? 'border-red-300' : 'border-gray-100'}
                            `}
                                value={formData.role}
                                onChange={(e) => {
                                    setFormData({ ...formData, role: e.target.value });
                                    if (errors.role) setErrors({ ...errors, role: '' });
                                }}
                            >
                                <option value="0">Selecione...</option>
                                <option value="INTERNO">INTERNO</option>
                                <option value="CLIENTE">CLIENTE</option>
                            </select>
                            {errors.role && <p className="text-red-600 text-xs mt-1">{errors.role}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic ">Senha</label>
                                <input
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className={`
                                    w-full border-2 p-3 rounded-xl outline-none transition-all
                                    /* Tema Claro */
                                    bg-gray-50 focus:border-[#131ff8]
                                    ${errors.password ? 'border-red-300' : 'border-gray-100'}
                                `}
                                    value={formData.password}
                                    onChange={(e) => {
                                        setFormData({ ...formData, password: e.target.value });
                                        if (errors.password) setErrors({ ...errors, password: '' });
                                    }}
                                />
                                {errors.password && <p className="text-red-600 text-xs mt-1">{errors.password}</p>}
                            </div>
                            <div>
                                <label className="text-[10px] font-black uppercase text-gray-400 ml-1 italic">Confirmar</label>
                                <input
                                    type="password"
                                    required
                                    autoComplete="new-password"
                                    disabled={loading}
                                    className={`
                                    w-full border-2 p-3 rounded-xl outline-none transition-all
                                    /* Tema Claro */
                                    bg-gray-50
                                    ${errors.confirmacao || (formData.confirmacao && formData.password !== formData.confirmacao) ? 'border-red-300' : 'border-gray-100 focus:border-[#131ff8]'}
                                `}
                                    value={formData.confirmacao}
                                    onChange={(e) => {
                                        setFormData({ ...formData, confirmacao: e.target.value });
                                        if (errors.confirmacao) setErrors({ ...errors, confirmacao: '' });
                                    }}
                                />
                                {errors.confirmacao && <p className="text-red-600 text-xs mt-1">{errors.confirmacao}</p>}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="
                            w-full p-4 rounded-xl font-black text-sm transition-all shadow-lg active:scale-95 flex justify-center items-center gap-2 mt-4
                            hover:cursor-pointer hover:scale-[1.02] disabled:bg-gray-300
                            /* Tema Claro */
                            bg-[#4a54ff] text-white hover:bg-[#131ff8]
                        "
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin "></div>
                            ) : (
                                'CADASTRAR E ENTRAR'
                            )}
                        </button>
                    </form>

                    <div className="p-8 pt-2 text-center border-t border-gray-100 mt-2">
                        <p className="text-xs text-gray-400 font-medium italic ">
                            Já possui conta? <Link href="/login" className="text-[#4a54ff] font-bold underline hover:text-[#131ff8] ">Voltar ao login</Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}