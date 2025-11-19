import React from 'react'
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';

const SnackBar = ({
    variant = 'sucess',
    message = 'Proceso Realizado com sucesso!'
}) => {
    const { enqueueSnackbar } = useSnackbar();

    const handleClickVariant = (variant) => () => {
        // variant could be success, error, warning, info, or default
        enqueueSnackbar(message, { variant });
    };

    return (
        <>
            <Button onClick={handleClickVariant(variant)}></Button>
        </>
    );
}

export default SnackBar