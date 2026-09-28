'use client'

import { faCalendar, faLock, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function MenuLateral() {
    interface Usuario {
        id: number;
        email: string;
        tipo: "INTERNO" | "CLIENTE";
        status: "Ativo" | "Inativo";
        ultimoLogin: string;
        dataCadastro: string;
    }

    const [usuarioSelecionado] = useState<Usuario>({
        id: 1,
        email: "gestor@empresa.com.br",
        tipo: "INTERNO",
        status: "Ativo",
        ultimoLogin: "27/05/2026 09:12",
        dataCadastro: "15/03/2026 10:22"
    });

    return (
        <div className="rounded-lg bg-white lg:flex-1 shadow-md overflow-hidden flex flex-col">

            {/*Cabeçalho do painel lateral*/}
            <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-start">
                <h3 className="font-bold text-lg">Detalhes do usuário</h3>
                <button className="text-gray-400 hover:text-gray-600 text-xl">×</button>
            </div>

            {/*Avatar e email do usuário selecionado*/}
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-[#4a54ff] flex items-center justify-center mb-3">
                    <FontAwesomeIcon icon={faUser} className="text-white text-2xl" />
                </div>
                <p className="font-bold text-sm md:text-base">{usuarioSelecionado.email}</p>
                <span className={`text-xs font-bold uppercase px-2 py-1 rounded mt-2 ${usuarioSelecionado.tipo === "INTERNO" ? 'text-blue-600' : 'text-green-600'}`}>
                    {usuarioSelecionado.tipo}
                </span>
                <p className="text-xs text-gray-500 mt-2">Status: <span className="font-bold text-green-600">● {usuarioSelecionado.status}</span></p>
                <p className="text-xs text-gray-500 mt-1">Cadastrado em: {usuarioSelecionado.dataCadastro}</p>
            </div>

            {/*Informações do usuário*/}
            <div className="p-4 md:p-6 border-b border-gray-100">
                <p className="font-bold text-sm mb-3">Informações</p>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                        <FontAwesomeIcon icon={faUser} className="w-4 text-[#4a54ff]" />
                        <div>
                            <p className="text-xs text-gray-500">E-mail</p>
                            <p className="text-xs font-semibold">{usuarioSelecionado.email}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FontAwesomeIcon icon={faCalendar} className="w-4 text-[#4a54ff]" />
                        <div>
                            <p className="text-xs text-gray-500">Último login</p>
                            <p className="text-xs font-semibold">{usuarioSelecionado.ultimoLogin}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <FontAwesomeIcon icon={faCalendar} className="w-4 text-[#4a54ff]" />
                        <div>
                            <p className="text-xs text-gray-500">Data de cadastro</p>
                            <p className="text-xs font-semibold">{usuarioSelecionado.dataCadastro}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/*Ações disponíveis*/}
            <div className="p-4 md:p-6">
                <p className="font-bold text-sm mb-3">Ações disponíveis</p>
                <div className="space-y-2">
                    <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <FontAwesomeIcon icon={faUser} className="w-4 text-[#4a54ff]" />
                        <div className="text-left">
                            <p className="text-xs font-bold">Alterar tipo de acesso</p>
                            <p className="text-[0.65rem] text-gray-500">Modifique o nível de acesso deste usuário.</p>
                        </div>
                        <span className="ml-auto">›</span>
                    </button>
                    <button className="w-full flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-red-50 transition-colors">
                        <FontAwesomeIcon icon={faLock} className="w-4 text-red-500" />
                        <div className="text-left">
                            <p className="text-xs font-bold text-red-600">Desativar usuário</p>
                            <p className="text-[0.65rem] text-gray-500">O usuário não poderá mais acessar o sistema.</p>
                        </div>
                        <span className="ml-auto text-red-600">›</span>
                    </button>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-[0.65rem] text-blue-700 mt-3">
                        <p className="font-bold mb-1">ⓘ Informação</p>
                        <p>As alterações de acesso são aplicadas imediatamente. Use com responsabilidade.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}