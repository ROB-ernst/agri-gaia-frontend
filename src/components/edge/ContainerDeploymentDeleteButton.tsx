// SPDX-FileCopyrightText: 2024 Osnabrück University of Applied Sciences
// SPDX-FileContributor: Andreas Schliebitz
// SPDX-FileContributor: Henri Graf
// SPDX-FileContributor: Jonas Tüpker
// SPDX-FileContributor: Lukas Hesse
// SPDX-FileContributor: Maik Fruhner
// SPDX-FileContributor: Prof. Dr.-Ing. Heiko Tapken
// SPDX-FileContributor: Tobias Wamhof
//
// SPDX-License-Identifier: MIT

import { useState } from 'react';

import { httpDelete } from '../../api';
import useKeycloak from '../../contexts/KeycloakContext';

import LoadingButton from '@mui/lab/LoadingButton';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../common/ConfirmationDialog';

import { CONTAINER_DEPLOYMENTS_PATH } from '../../endpoints';

export default function ({
    containerDeploymentId,
    containerDeploymentName,
    onDelete,
}: {
    containerDeploymentId: number;
    containerDeploymentName: string;
    onDelete: () => void;
}) {
    const keycloak = useKeycloak();

    const [isDeleting, setIsDeleting] = useState(false);
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

    const deleteContainerDeployment = async () => {
        setIsDeleting(true);
        httpDelete(keycloak, `${CONTAINER_DEPLOYMENTS_PATH}/${containerDeploymentId}`)
            .then(onDelete)
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setIsDeleting(false);
            });
    };

    const handleConfirmationResult = (result: boolean) => {
        setConfirmDialogOpen(false);
        if (result) deleteContainerDeployment();
    };

    return (
        <>
            {confirmDialogOpen ? (
                <ConfirmationDialog
                    title="Delete Container Deployment"
                    message={`Do you really want to delete the container Deployment ${containerDeploymentName}?`}
                    handleResult={handleConfirmationResult}
                />
            ) : null}
            <Tooltip title="Delete">
                <LoadingButton loading={isDeleting} onClick={() => setConfirmDialogOpen(true)}>
                    <DeleteIcon />
                </LoadingButton>
            </Tooltip>
        </>
    );
}
