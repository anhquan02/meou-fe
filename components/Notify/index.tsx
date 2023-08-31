import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Loading from '../Loading';
import Alert from '../Alert';

const Notify = (props:any) => {
    const { openSnack, snackMsg, alertType, openLoading, onClose } = props;

    return (
        <>
            <Loading open={openLoading} />
            <Snackbar
                open={openSnack}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                className=""
                autoHideDuration={3000}
                onClose={onClose}
            >
                <Alert onClose={onClose} sx={{ width: '100%' }} severity={alertType}>
                    {snackMsg}
                </Alert>
            </Snackbar>
        </>
    );
};

export default Notify;
