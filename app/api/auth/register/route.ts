import { NextResponse } from 'next/server';

const VALID_ROLES = ['INTERNO', 'CLIENTE'];

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body.username || !body.password || !body.role) {
            return NextResponse.json({ message: 'Campos obrigatórios não preenchidos' }, { status: 400 });
        }

        if (typeof body.username !== 'string' || typeof body.password !== 'string' || typeof body.role !== 'string') {
            return NextResponse.json({ message: 'Formato de dados inválido' }, { status: 400 });
        }

        if (body.username.trim().length < 3 || body.username.trim().length > 100) {
            return NextResponse.json({ message: 'Nome de usuário deve ter entre 3 e 100 caracteres' }, { status: 400 });
        }

        if (body.password.length < 6 || body.password.length > 255) {
            return NextResponse.json({ message: 'Senha deve ter entre 6 e 255 caracteres' }, { status: 400 });
        }

        if (!VALID_ROLES.includes(body.role)) {
            return NextResponse.json({ message: 'Role inválido' }, { status: 400 });
        }

        const storedUsers = JSON.parse(globalThis.localStorage?.getItem?.('localAuthUsers') ?? '[]');
        const normalizedUsername = body.username.trim().toLowerCase();
        const existingUser = storedUsers.find((item: { username: string }) => item.username.toLowerCase() === normalizedUsername);

        if (existingUser) {
            return NextResponse.json({ message: 'Usuário já cadastrado' }, { status: 400 });
        }

        storedUsers.push({
            username: body.username.trim(),
            password: body.password,
            role: body.role
        });

        globalThis.localStorage?.setItem?.('localAuthUsers', JSON.stringify(storedUsers));

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Erro de registro local:', error);
        return NextResponse.json({ message: 'Erro ao processar requisição' }, { status: 500 });
    }
}