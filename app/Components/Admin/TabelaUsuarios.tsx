'use client'

import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function TabelaUsuarios() {

    interface Usuario {
        id: number;
        email: string;
        tipo: "INTERNO" | "CLIENTE";
        status: "Ativo" | "Inativo";
        ultimoLogin: string;
        dataCadastro: string;
    }

    const [usuarioSelecionado, setUsuarioSelecionado] = useState<Usuario>({
        id: 1,
        email: "gestor@empresa.com.br",
        tipo: "INTERNO",
        status: "Ativo",
        ultimoLogin: "27/05/2026 09:12",
        dataCadastro: "15/03/2026 10:22"
    });

    const usuariosLista: Usuario[] = [
        { id: 1, email: "administrador@empresa.com.br", tipo: "INTERNO", status: "Ativo", ultimoLogin: "28/05/2026 14:35", dataCadastro: "15/03/2026 10:22" },
        { id: 2, email: "gestor@empresa.com.br", tipo: "INTERNO", status: "Ativo", ultimoLogin: "27/05/2026 09:12", dataCadastro: "10/02/2026 08:41" },
        { id: 3, email: "financeiro@empresa.com.br", tipo: "INTERNO", status: "Ativo", ultimoLogin: "26/05/2026 16:48", dataCadastro: "05/02/2026 11:15" },
        { id: 4, email: "cliente1@empresa.com.br", tipo: "CLIENTE", status: "Ativo", ultimoLogin: "28/05/2026 10:22", dataCadastro: "20/04/2026 13:30" },
        { id: 5, email: "cliente2@empresa.com.br", tipo: "CLIENTE", status: "Ativo", ultimoLogin: "24/05/2026 08:55", dataCadastro: "18/04/2026 09:05" },
        { id: 6, email: "cliente3@empresa.com.br", tipo: "CLIENTE", status: "Inativo", ultimoLogin: "—", dataCadastro: "12/04/2026 15:22" },
        { id: 7, email: "suporte@empresa.com.br", tipo: "INTERNO", status: "Ativo", ultimoLogin: "28/05/2026 11:03", dataCadastro: "22/03/2026 16:10" },
    ];

    return (
        <div className="rounded-lg bg-white lg:flex-[3] shadow-md overflow-hidden flex flex-col">

            {/*Cabeçalho com filtros*/}
            <div className="p-4 md:p-6 border-b border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center">
                <input type="text" placeholder="Buscar por e-mail..." className="w-full sm:w-64 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4a54ff]" />
                <div className="flex gap-2 w-full sm:w-auto">
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4a54ff] flex-1 sm:flex-none">
                        <option>Todos</option>
                        <option>INTERNO</option>
                        <option>CLIENTE</option>
                    </select>
                    <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#4a54ff] flex-1 sm:flex-none">
                        <option>Todos</option>
                        <option>Ativo</option>
                        <option>Inativo</option>
                    </select>
                </div>
            </div>

            {/*Tabela de usuários*/}
            <div className="overflow-x-auto flex-1">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                            <th className="px-4 md:px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase">E-Mail</th>
                            <th className="px-4 md:px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase">Tipo de Acesso</th>
                            <th className="px-4 md:px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase">Status</th>
                            <th className="px-4 md:px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase">Último Login</th>
                            <th className="px-4 md:px-6 py-3 text-left font-bold text-gray-600 text-xs uppercase">Data de Cadastro</th>
                            <th className="px-4 md:px-6 py-3 text-center font-bold text-gray-600 text-xs uppercase">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuariosLista.map((usuario) => (
                            <tr
                                key={usuario.id}
                                className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${usuarioSelecionado.id === usuario.id ? 'bg-blue-50' : ''}`}
                                onClick={() => setUsuarioSelecionado(usuario)}
                            >
                                <td className="px-4 md:px-6 py-3 text-blue-600 text-xs md:text-sm">{usuario.email}</td>
                                <td className="px-4 md:px-6 py-3">
                                    <span className={`text-xs font-bold uppercase px-2 py-1 rounded ${usuario.tipo === "INTERNO" ? 'text-blue-600' : 'text-green-600'}`}>
                                        {usuario.tipo}
                                    </span>
                                </td>
                                <td className="px-4 md:px-6 py-3">
                                    <div className="flex items-center gap-1">
                                        <div className={`w-2 h-2 rounded-full ${usuario.status === "Ativo" ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                        <span className="text-xs text-gray-600">{usuario.status}</span>
                                    </div>
                                </td>
                                <td className="px-4 md:px-6 py-3 text-gray-600 text-xs md:text-sm">{usuario.ultimoLogin}</td>
                                <td className="px-4 md:px-6 py-3 text-gray-600 text-xs md:text-sm">{usuario.dataCadastro}</td>
                                <td className="px-4 md:px-6 py-3 text-center">
                                    <button className="inline-flex items-center justify-center text-gray-400 hover:text-[#4a54ff] transition-colors">
                                        <FontAwesomeIcon icon={faEllipsisVertical} className="w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/*Rodapé com paginação*/}
            <div className="p-4 md:p-6 border-t border-gray-100 flex flex-col sm:flex-row gap-3 justify-between items-center text-xs text-gray-600">
                <span>Mostrando 1 a 10 de 128 usuários</span>
                <div className="flex gap-1">
                    <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">‹</button>
                    <button className="px-2 py-1 bg-[#4a54ff] text-white rounded">1</button>
                    <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">2</button>
                    <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">3</button>
                    <button className="px-2 py-1 border border-gray-200 rounded hover:bg-gray-50">›</button>
                </div>
            </div>
        </div>
    )
}