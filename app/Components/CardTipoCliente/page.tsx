interface PropsCardTipoUsuario {
    tipoUsuario: string;
    corUsuario: string;
    corTextoUsuario: string;
    quantidadeUsuario: number;
    porcetagemUsuario: number;
    isAll: boolean;
    children: React.ReactNode;
}

export default function CardTipoCliente(props: PropsCardTipoUsuario) {

    // CORREÇÃO: Em vez de useState (que gerava loop), calculamos o texto direto em uma constante lógica
    const textoPorcentagem = props.isAll
        ? "Todos os usuários cadastrados"
        : `${props.porcetagemUsuario}% do total`;




    return (
        <div className="shadow-md bg-white rounded-lg p-3 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 hover:scale-101 transition-all">

            <div className={`p-2 md:p-3 rounded-lg w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 items-center justify-center ${props.corUsuario}`}>
                <div className={`p-2 md:p-3 rounded-lg ${props.corUsuario} w-10 h-10 md:w-12 md:h-12 flex flex-shrink-0 justify-center items-center`}>
                    {props.children}
                </div>
            </div>

            <div className="min-w-0">
                <p className="text-xs md:text-sm text-gray-500">{props.tipoUsuario}</p>


                <p className={`text-2xl md:text-3xl font-bold ${props.corTextoUsuario}`}>{props.quantidadeUsuario}</p>
                <p className="text-[0.6rem] md:text-[0.7rem] text-gray-500">{textoPorcentagem}</p>
            </div>
        </div>
    );
}