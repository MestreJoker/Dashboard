'use client'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Header from "../Components/Header/page";
import { faGear, faLock, faShield, faShieldHalved, faUser, faUserGroup, faUserLock, faUserTie, faPencil, faTrash, faEllipsisVertical, faCalendar } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import CardsTipoCliente from "../Widgets/CardsTipoCliente/page";
import TabelaUsuarios from "../Components/Admin/TabelaUsuarios/page";
import MenuLateral from "../Components/Admin/MenuLateral/page";



export default function Admin() {

    return (
        <div className="min-h-screen flex flex-col">
            <Header color="bg-[#4a54ff]" estilos="h-fit">
                <></>
            </Header>
            <main className="bg-[#f6f6fe] py-4 md:py-8 px-4 sm:px-6 md:px-8 lg:px-25 flex flex-col gap-4 md:gap-8 flex-1 overflow-y-auto">

                {/*Parte Superior: Logo e Novo Usuário*/}
                <div id="adminParteSuperior" className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
                    {/*Logo, título e subtítulo*/}
                    <div className="flex gap-2 sm:gap-3 items-center">
                        <div className="p-2 sm:p-3 bg-[#4a54ff] rounded-2xl shadow-md border-gray-300 border flex-shrink-0">
                            <FontAwesomeIcon icon={faGear} className="text-white w-7 sm:w-11 hover:rotate-40 transition-all duration-300"/>
                        </div>
                        <div className="min-w-0">
                            <h3 className="font-bold text-lg sm:text-xl md:text-2xl break-words">Administração de Usuários</h3>
                            <p className="text-xs sm:text-sm text-gray-600 -mt-1">Gerencie os acessos e perfis de todos os usuários</p>
                        </div>
                    </div>
                    {/*Botão de novo usuário */}
                    <button className="w-full sm:w-auto py-2 px-3 sm:px-4 text-white font-semibold rounded-lg bg-[#4a54ff] hover:bg-[#131ff8] hover:cursor-pointer hover:scale-103 transition-all text-sm md:text-base whitespace-nowrap">
                        Novo usuário
                    </button>
                </div>

                {/*Quantidade de usuários por tipo*/}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                    <CardsTipoCliente />
                </div>

                {/*Menu principal (tabela) e Menu lateral (detalhes)*/}
                <div className="flex flex-col lg:flex-row gap-3 md:gap-4 flex-1 min-h-0">
                    {/*Menu Principal: Tabela de Usuários*/}
                    <TabelaUsuarios />

                    {/*Menu Lateral: Detalhes do Usuário*/}
                    <MenuLateral />
                </div>

            </main>
        </div>
    )
}