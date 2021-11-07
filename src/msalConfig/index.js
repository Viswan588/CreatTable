export const msalConfig = {
    auth: {
        clientId: "811ba117-edae-4f84-a037-6bfa036c7a2a", 
        authority: "https://login.microsoftonline.com/intelliswift.com", 
        redirectUri: "/",
        postLogoutRedirectUri: "/",
        navigateToLoginRequestUrl: false, 
    },
    cache: {
        cacheLocation: "sessionStorage", 
        storeAuthStateInCookie: false, 
    }
}