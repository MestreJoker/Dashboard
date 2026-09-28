type UserRole = 'CLIENTE' | 'INTERNO';

export type LocalAuthUser = {
  username: string;
  password: string;
  role: UserRole;
};

export type LocalAuthSession = {
  username: string;
  role: UserRole;
};

const USERS_STORAGE_KEY = 'localAuthUsers';
const SESSION_STORAGE_KEY = 'localAuthSession';
const USER_NAME_STORAGE_KEY = 'userName';
const USER_ROLE_STORAGE_KEY = 'userRole';
const SESSION_COOKIE_NAME = 'session_token';
const SESSION_TTL_SECONDS = 60 * 60 * 8;

const isBrowser = () => typeof window !== 'undefined';

function readStoredUsers(): LocalAuthUser[] {
  if (!isBrowser()) return [];

  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];

    const parsed = JSON.parse(stored);
    return Array.isArray(parsed)
      ? parsed.filter((item): item is LocalAuthUser => Boolean(item && typeof item === 'object' && typeof item.username === 'string' && typeof item.password === 'string' && (item.role === 'CLIENTE' || item.role === 'INTERNO')))
      : [];
  } catch {
    return [];
  }
}

function writeStoredUsers(users: LocalAuthUser[]) {
  if (!isBrowser()) return;
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function writeSessionCookie() {
  if (!isBrowser()) return;
  const expires = new Date(Date.now() + SESSION_TTL_SECONDS * 1000).toUTCString();
  document.cookie = `${SESSION_COOKIE_NAME}=local-auth; path=/; max-age=${SESSION_TTL_SECONDS}; expires=${expires}; SameSite=Lax`;
}

function clearSessionCookie() {
  if (!isBrowser()) return;
  document.cookie = `${SESSION_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
}

export function saveSession(user: LocalAuthSession) {
  if (!isBrowser()) return;

  localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  localStorage.setItem(USER_NAME_STORAGE_KEY, user.username);
  localStorage.setItem(USER_ROLE_STORAGE_KEY, user.role);
  writeSessionCookie();
}

export function clearSession() {
  if (!isBrowser()) return;

  localStorage.removeItem(SESSION_STORAGE_KEY);
  localStorage.removeItem(USER_NAME_STORAGE_KEY);
  localStorage.removeItem(USER_ROLE_STORAGE_KEY);
  clearSessionCookie();
}

export function getStoredSession(): LocalAuthSession | null {
  if (!isBrowser()) return null;

  try {
    const session = localStorage.getItem(SESSION_STORAGE_KEY);
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed && typeof parsed.username === 'string' && (parsed.role === 'CLIENTE' || parsed.role === 'INTERNO')) {
        return parsed;
      }
    }

    const username = localStorage.getItem(USER_NAME_STORAGE_KEY);
    const role = localStorage.getItem(USER_ROLE_STORAGE_KEY);

    if (username && (role === 'CLIENTE' || role === 'INTERNO')) {
      return { username, role };
    }
  } catch {
    return null;
  }

  return null;
}

export function registerLocalUser(username: string, password: string, role: UserRole) {
  const users = readStoredUsers();

  const newUser: LocalAuthUser = {
    username: username.trim(),
    password,
    role,
  };

  const normalizedUsername = newUser.username.toLowerCase();
  const existingUserIndex = users.findIndex((user) => user.username.toLowerCase() === normalizedUsername);
  if (existingUserIndex >= 0) {
    users[existingUserIndex] = newUser;
  } else {
    users.push(newUser);
  }
  writeStoredUsers(users);

  saveSession({ username: newUser.username, role });

  return { success: true, user: newUser };
}

export function loginLocalUser(username: string, _password: string) {
  const normalizedUsername = username.trim().toLowerCase();
  const users = readStoredUsers();
  const existingUser = users.find((user) => user.username.toLowerCase() === normalizedUsername);
  const sessionUser = {
    username: username.trim(),
    role: existingUser?.role ?? 'CLIENTE' as UserRole,
  };

  saveSession(sessionUser);
  return sessionUser;
}
