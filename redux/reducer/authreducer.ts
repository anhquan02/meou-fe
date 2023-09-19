import { LOGIN, LOGOUT } from "../action/auth";

interface AuthState {
    token: string;
    user: any;
}

const initialState: AuthState = {
    token: '',
    user :{}
};

export default function AuthReducer(state = initialState, content: any) {
    const { type, payload } = content;
    switch (type) {
        case LOGIN:
            return {
                ...state,
                token: payload.token,
                user: payload.user
            };
        case LOGOUT:
            return {
                ...state,
                token: '',
                user: {}
            };
        default:
            return state;
    }
}
