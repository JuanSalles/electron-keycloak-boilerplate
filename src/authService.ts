import axios from 'axios';

interface TokenInfo {
    active: boolean;
    username?: string;
    realm_access?: {
        roles: string[];
    };
    exp?: number;
    [key: string]: any;
}

class AuthService {
    private keycloakUrl: string;
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private accessToken: string | null = null;
    private refreshToken: string | null = null;
    private idToken: string | null = null;
    private tokenInfo: TokenInfo | null = null;

    constructor(keycloakUrl: string, clientId: string, clientSecret: string, redirectUri: string) {
        this.keycloakUrl = keycloakUrl;
        this.clientId = clientId;
        this.clientSecret = clientSecret;
        this.redirectUri = redirectUri;
    }
    public getIdToken(): string | null {
        return this.idToken;
    }
    // Função para iniciar o login e redirecionar para o Keycloak
    public getLoginUrl(): string {
        return `${this.keycloakUrl}/auth?client_id=${this.clientId}&redirect_uri=${this.redirectUri}&response_type=code&scope=openid`;
    }
    public getLogoutUrl(idToken: string): string {
        return `${this.keycloakUrl}/logout?id_token_hint=${idToken}`;
    }
    // Troca o código de autorização por um token de acesso
    public async exchangeCodeForToken(code: string): Promise<void> {
        try {
            const response = await axios.post(
                `${this.keycloakUrl}/token`,
                new URLSearchParams({
                    grant_type: 'authorization_code',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    redirect_uri: this.redirectUri,
                    code: code
                }).toString(),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            this.accessToken = response.data.access_token;
            this.refreshToken = response.data.refresh_token;
            this.idToken = response.data.id_token; // Armazena o id_token
            console.log("Tokens recebidos:", {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                idToken: this.idToken
            });
        } catch (error) {
            console.error("Erro ao trocar o código por um token:", error);
            throw error;
        }
    }

    // Valida o token usando o endpoint de introspecção
    public async introspectToken(): Promise<TokenInfo | null> {
        if (!this.accessToken) {
            console.error("Nenhum token de acesso disponível para introspecção.");
            return null;
        }

        try {
            const response = await axios.post(
                `${this.keycloakUrl}/token/introspect`,
                new URLSearchParams({
                    token: this.accessToken,
                    client_id: this.clientId,
                    client_secret: this.clientSecret
                }).toString(),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            this.tokenInfo = response.data;
            // console.log("Token Introspection Result:", this.tokenInfo);

            if (this.tokenInfo ? this.tokenInfo!.active : false) {
                // console.log("Token válido:", this.tokenInfo);
                return this.tokenInfo;
            } else {
                console.error("Token inválido ou expirado.");
                return null;
            }
        } catch (error) {
            console.error("Erro ao validar o token:", error);
            return null;
        }
    }

    // Obtém informações do token armazenado
    public getTokenInfo(): TokenInfo | null {
        return this.tokenInfo;
    }

    // Salva a sessão em memória
    public saveSession(): void {
        console.log("Sessão salva em memória");
    }
    public clearSession(): void {
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenInfo = null;
        this.idToken = null;
        console.log("Sessão limpa.");
    }
    // Atualiza o token usando o refresh token
    public async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            console.error("Nenhum refresh token disponível.");
            return;
        }

        try {
            const response = await axios.post(
                `${this.keycloakUrl}/token`,
                new URLSearchParams({
                    grant_type: 'refresh_token',
                    client_id: this.clientId,
                    client_secret: this.clientSecret,
                    refresh_token: this.refreshToken
                }).toString(),
                {
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                }
            );

            this.accessToken = response.data.access_token;
            this.refreshToken = response.data.refresh_token;
            this.idToken = response.data.id_token; // Armazena o id_token
            console.log("Tokens recebidos:", {
                accessToken: this.accessToken,
                refreshToken: this.refreshToken,
                idToken: this.idToken
            });
        } catch (error) {
            console.error("Erro ao atualizar o token:", error);
            throw error;
        }
    }
}

export default AuthService;