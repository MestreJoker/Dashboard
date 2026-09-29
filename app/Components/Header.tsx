import Link from "next/link";
import Image from "next/image";

interface HeaderProps {
    children?: React.ReactNode;
    shadow?: string;
    border?: string;
    color?: string;
    estilos?: string
}

export default function Header(props: HeaderProps) {
    return (
        <header className={`${props.estilos} w-full ${props.color} text-white font-bold p-0.5 flex items-center justify-between px-7 ${props.shadow} ${props.border} border-white/5`}>
            <div className="flex items-center gap-7">
                <Link href="/" className="hover:opacity-80 transition-opacity">
                    <Image
                        id="logo"
                        src="/images/InfinityLogo2.png"
                        width={110}
                        height={21}
                        alt="Logo"
                        className="brightness-0 invert"
                        loading="eager"
                    />
                </Link>

                <h1 className="hidden lg:block md:text-xl tracking-tight text-zinc-100">
                    Gestão de Resíduos Eletrônicos
                </h1>
            </div>

            <div className="py-0.5">
                {props.children}
            </div>
        </header>
    )
}