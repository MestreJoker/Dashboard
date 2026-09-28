import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.username || !body.password) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 400 });
        }

        if (typeof body.username !== 'string' || typeof body.password !== 'string') {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 400 });
        }

        const normalizedUsername = body.username.trim().toLowerCase();
        const storedUsers = JSON.parse(globalThis.localStorage?.getItem?.('localAuthUsers') ?? '[]');
        const user = storedUsers.find((item: { username: string; password: string; role: string }) => item.username.toLowerCase() === normalizedUsername);

        if (!user || user.password !== body.password) {
            return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
        }

        return NextResponse.json({
            success: true,
            username: user.username,
            role: user.role
        });
    } catch (error) {
        console.error('Erro de login local:', error);
        return NextResponse.json({ message: 'Credenciais inválidas' }, { status: 401 });
    }
}