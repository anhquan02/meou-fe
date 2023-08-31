import { OPEN_SIDENAV,SIDENAV_COLOR,SIDENAV_TYPE } from "../action/sidenav";

interface SidenavState {
    sidenavOpen: boolean;
    sidenavType: string;
    sidenavColor: string;
}

const initialState: SidenavState = {
    sidenavOpen: false,
    sidenavType: 'dark',
    sidenavColor: 'blue'
};

export default function SidenavReducer(state = initialState, content: any) {
    const { type, payload } = content;
    switch (type) {
        case OPEN_SIDENAV:
            return {
                ...state,
                sidenavOpen: payload
            };
        case SIDENAV_TYPE:
            return {
                ...state,
                sidenavType: payload
            };
        case SIDENAV_COLOR:
            return {
                ...state,
                sidenavColor: payload
            };
        default:
            return state;
    }
}
