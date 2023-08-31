export const OPEN_SIDENAV = 'OPEN_SIDENAV';
export const SIDENAV_TYPE = 'SIDENAV_TYPE';
export const SIDENAV_COLOR = 'SIDENAV_COLOR';

export const openSidenav = (open: boolean) => ({
    type: OPEN_SIDENAV,
    payload: open
});

export const sidenavType = (type: string) => ({
    type: SIDENAV_TYPE,
    payload: type
});

export const sidenavColor = (color: string) => ({
    type: SIDENAV_COLOR,
    payload: color
});
