import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8085';

export async function GET(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('session_token');

        if (!token || !token.value) {
            return NextResponse.json(
                { message: "Não autenticado" }, 
                { status: 401 }
            );
        }

        const roleRes = await fetch(`${BACKEND_URL}/ecologic/auth/role`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token.value}`,
                'Content-Type': 'application/json'
            },
        });

        if (!roleRes.ok) {
            return NextResponse.json(
                { message: "Não autenticado" },
                { status: 401 }
            );
        }

        const roleData = await roleRes.json();

        return NextResponse.json({
            success: true,
            role: roleData?.role || 'CLIENTE'
        });
    } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        return NextResponse.json(
            { message: "Erro ao verificar sessão" }, 
            { status: 500 }
        );
    }
}
