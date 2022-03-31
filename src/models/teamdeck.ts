export interface GraphQlResponse<T> {
    data: T;
    extensions: any;
}

export interface GoogleLoginResponse {
    googleAuthUrl: string
}

export interface TeamdeckApiData {
    googleToken: string
    accessToken: string;
    refreshToken: string;
}

export interface TeamdeckTokenExchangeResponse {
    exchangeAuthorizationCodeForToken: {
        accessToken: string;
        refreshToken: string;
        expiresIn: number;
    }
}