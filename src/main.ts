import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
import AuthService from './authService';
dotenv.config();
import { ipcMain } from 'electron';
let mainWindow: BrowserWindow | null;

const KEYCLOAK_URL = process.env.KEYCLOAK_URL!;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

const authService = new AuthService(KEYCLOAK_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Redireciona para a página de login do Keycloak
    mainWindow.loadURL(authService.getLoginUrl());
    // mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('will-redirect', async (event, url) => {
        if (url.startsWith(REDIRECT_URI)) {
            event.preventDefault();

            const code = new URL(url).searchParams.get('code');
            if (code) {
                // console.log("Authorization Code:", code);

                try {
                    // Troca o código por um token
                    await authService.exchangeCodeForToken(code);

                    // Valida o token
                    const tokenInfo = await authService.introspectToken();
                    if (tokenInfo) {

                        // Salva a sessão em memória
                        authService.saveSession();

                        // Carrega a interface principal
                        mainWindow?.loadFile(path.join(__dirname, '../public/index.html'));


                        // Envia as informações do token para o processo de renderização
                        mainWindow?.webContents.once('did-finish-load', () => {
                            mainWindow?.webContents.send('token-info', tokenInfo);
                        });
                    } else {
                        console.error("Token inválido. Encerrando a aplicação.");
                        app.quit();
                    }
                } catch (error) {
                    console.error("Erro durante o processo de autenticação:", error);
                }
            }
        }
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});

// Lógica de logout
ipcMain.on('logout', async (event) => {
    console.log('Usuário solicitou logout.');
    const idToken = authService.getIdToken(); // Obtenha o id_token armazenado
    // Limpa a sessão em memória
    authService.clearSession();

    // Limpa os cookies da sessão
    try {
        const session = mainWindow?.webContents.session;
        if (session) {
            const cookies = await session.cookies.get({});
            for (const cookie of cookies) {
                const cookieUrl = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
                await session.cookies.remove(cookieUrl, cookie.name);
            }
            console.log('Cookies limpos com sucesso.');
        }
    } catch (error) {
        console.error('Erro ao limpar os cookies:', error);
    }
    // Redireciona para o endpoint de logout do Keycloak
    const logoutUrl = authService.getLogoutUrl(idToken!);
    console.log('Redirecionando para:', logoutUrl);
    mainWindow?.loadURL(logoutUrl);

    // Monitora o carregamento da página de logout
    mainWindow?.webContents.once('did-finish-load', () => {
        console.log('Logout concluído. Redirecionando para a tela de login...');
        mainWindow?.loadURL(authService.getLoginUrl());
    });
});