import CardTipoCliente from "@/app/Components/CardTipoCliente/page"
import { faUser, faUserGroup, faUserLock, faUserTie } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

export default function CardsTipoCliente(){
    const usuarios = [
        {tipoUsuario: "Total de usuários", qtdUsuarios: 128, porcentagemUsuario: 100, corIcone: "bg-[#131ff8]", corTexto: "text-[#131ff8]", isAll: true},
        {tipoUsuario: "Usuários INTERNOS", qtdUsuarios: 42, porcentagemUsuario: 32.8, corIcone: "bg-[#188df0]", corTexto: "text-[#188df0]", isAll: false},
        {tipoUsuario: "Usuários CLIENTES", qtdUsuarios: 86, porcentagemUsuario: 67.2, corIcone: "bg-[#0aa46a]", corTexto: "text-[#0aa46a]", isAll: false},
        {tipoUsuario: "Usuários Inativos", qtdUsuarios: 7, porcentagemUsuario: 5.5, corIcone: "bg-[#f0182d]", corTexto: "text-[#f0182d]", isAll: false}

    ]

    const icones = [
        <FontAwesomeIcon icon={faUserGroup} className="w-5 md:w-7 text-white"  />,
        <FontAwesomeIcon icon={faUser} className="w-5 md:w-7 text-white"  />,
        <FontAwesomeIcon icon={faUserTie} className="w-5 md:w-7 text-white"  />,
        <FontAwesomeIcon icon={faUserLock} className="w-5 md:w-7 text-white"  />
    ]

    return(
        usuarios.map((item, index) =>(
            <CardTipoCliente key={index} tipoUsuario={item.tipoUsuario} corUsuario={item.corIcone} corTextoUsuario={item.corTexto} quantidadeUsuario={item.qtdUsuarios} porcetagemUsuario={item.porcentagemUsuario} isAll={item.isAll}>
                    {icones[index]}
            </CardTipoCliente>
        ))
    )
}