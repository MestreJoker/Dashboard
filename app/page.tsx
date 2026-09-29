'use client'
import Link from 'next/link';
import Image from 'next/image';

export default function LandingPage() {
    return (
            
                <div className="flex h-screen flex-col items-center justify-center bg-[#4a54ff] bg-[url('/images/backgroundInicial.jpg')] bg-cover bg-center text-white p-6 overflow-hidden">

                    {/* Logo - Aparece primeiro */}
                    <div className="animate-reveal" style={{ animationDelay: '0.1s' }}>
                        <Image
                            src="/images/InfinityLogo2.png"
                            width={250} height={50} alt="Logo" className="mb-8 brightness-0 invert"
                        />
                    </div>

                    {/* Título - Aparece segundo */}
                    <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-4 text-center animate-reveal"
                        style={{ animationDelay: '0.3s' }}>
                        Gestão de Resíduos Eletrônicos
                    </h1>

                    {/* Texto - Aparece terceiro */}
                    <p className="text-zinc-300 mb-10 text-center max-w-md font-medium italic animate-reveal"
                        style={{ animationDelay: '0.5s' }}>
                        Bem-vindo ao sistema. Monitore seus indicadores e gerencie suas operações em tempo real.
                    </p>

                    {/* Botão - Aparece por último */}
                    <button className="animate-reveal" style={{ animationDelay: '0.7s' }}>
                        <Link href="/login" className="bg-white text-[#4a54ff] sm:bg-[#ffa575] sm:text-white px-10 py-4 rounded-2xl font-black uppercase italic sm:hover:bg-[#ff7c36] 
                    sm:hover:border-white sm:hover:scale-105 transition-all shadow-2xl active:scale-95 block">
                            Acessar o Painel
                        </Link>
                    </button>

                    {/* Estilos da Animação */}
                    <style jsx>{`
                @keyframes revealUp {
                    0% {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-reveal {
                    opacity: 0; /* Começa invisível */
                    animation: revealUp 0.8s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
                </div>
    );
}