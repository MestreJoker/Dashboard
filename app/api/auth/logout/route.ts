import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        
        // Limpar cookie de sessão
        cookieStore.delete('session_token');

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json(
            { message: "Erro ao fazer logout" }, 
            { status: 500 }
        );
    }
}
