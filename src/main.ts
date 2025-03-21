import { app, BrowserWindow, session } from 'electron';
import path from 'path';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();
let mainWindow: BrowserWindow | null;

const KEYCLOAK_URL = process.env.KEYCLOAK_URL!;
const CLIENT_ID = process.env.CLIENT_ID!;
const CLIENT_SECRET = process.env.CLIENT_SECRET!;
const REDIRECT_URI = process.env.REDIRECT_URI!;

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
    mainWindow.loadURL(`${KEYCLOAK_URL}/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code`);
    mainWindow.webContents.openDevTools();

    mainWindow.webContents.on('will-redirect', async (event, url) => {
        if (url.startsWith(REDIRECT_URI)) {
            event.preventDefault();

            // Extrai o código de autorização da URL
            const code = new URL(url).searchParams.get('code');
            if (code) {
                console.log("Authorization Code:", code);

                // Troca o código de autorização por um token de acesso
                try {
                    const response = await axios.post(
                        `${KEYCLOAK_URL}/token`,
                        new URLSearchParams({
                            grant_type: 'authorization_code',
                            client_id: CLIENT_ID,
                            client_secret: CLIENT_SECRET,
                            redirect_uri: REDIRECT_URI,
                            code: code
                        }).toString(),
                        {
                            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                        }
                    );

                    const { access_token } = response.data;
                    console.log("Access Token:", access_token);

                    // Carrega a interface principal após a autenticação
                    mainWindow?.loadFile(path.join(__dirname, '../public/index.html'));
                } catch (error: any) {
                    console.error("Erro ao trocar o código por um token:", error);
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