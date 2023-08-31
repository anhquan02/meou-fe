export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

// login add token to session storage
export const login = (token: string) => ({
    type: LOGIN,
    payload: token
});

// logout remove token from session storage
export const logout = () => ({
    type: LOGOUT
});