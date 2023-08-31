import { LOGIN, LOGOUT } from "../action/auth";

interface AuthState {
    token: string;
}

const initialState: AuthState = {
    token: ''
};

export default function AuthReducer(state = initialState, content: any) {
    const { type, payload } = content;
    switch (type) {
        case LOGIN:
            return {
                ...state,
                token: payload
            };
        case LOGOUT:
            return {
                ...state,
                token: ''
            };
        default:
            return state;
    }
}
