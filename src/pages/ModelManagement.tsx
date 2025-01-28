// SPDX-FileCopyrightText: 2024 University of Applied Sciences Osnabrück
// SPDX-FileContributor: Andreas Schliebitz
// SPDX-FileContributor: Henri Graf
// SPDX-FileContributor: Jonas Tüpker
// SPDX-FileContributor: Lukas Hesse
// SPDX-FileContributor: Maik Fruhner
// SPDX-FileContributor: Prof. Dr.-Ing. Heiko Tapken
// SPDX-FileContributor: Tobias Wamhof
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { useEffect, useState } from 'react';
import { httpGet, httpPatch } from '../api';
import useKeycloak from '../contexts/KeycloakContext';

import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Fab from '@mui/material/Fab';

import UploadModelDialog from '../components/models/UploadModelDialog';
import ModelsList from '../components/models/List';

import IModel from '../types/IModel';
import { MODELS_PATH, NETWORK_PATH } from '../endpoints';
import NoDataYet from '../components/common/NoDataYet';
import AgrovocSearchbar from '../components/common/AgrovocSearchbar';
import React from 'react';
import ModelInferenceButton from '../components/models/ModelInferenceButton';
import { Speed } from '@mui/icons-material';
import DownloadIcon from '@mui/icons-material/Download';
import { downloadBlob } from '../util';

export default function ModelManagement() {
    const keycloak = useKeycloak();

    const [models, setModels] = useState<Array<IModel>>([]);
    const [username, setUsername] = useState<string | undefined>(undefined);
    const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
    const [inferenceDialogOpen, setInferenceDialogOpen] = useState(false);
    const [selected, setSelected] = React.useState<readonly number[]>([]);
    const [connectorAvailable, setConnectorAvailable] = useState<boolean>(false);

    const fetchModels = async () => {
        httpGet(keycloak, MODELS_PATH)
            .then((models: IModel[]) => {
                models.sort((a, b) => a.name.localeCompare(b.name));
                setModels(models);
                console.log('Models:', models);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const fetchConnectorInformation = () => {
        httpGet(keycloak, NETWORK_PATH + '/info')
            .then((result) => {
                console.log(result);
                setConnectorAvailable(result['available']);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        fetchConnectorInformation;
        fetchModels();
        fetchUsername();
    }, [keycloak]);

    const fetchUsername = async () => {
        if (keycloak?.authenticated && username === undefined) {
            keycloak.loadUserProfile().then((profile) => {
                setUsername(profile.username);
            });
        }
    };

    const handleUploadDialogOpen = () => {
        setUploadDialogOpen(true);
    };

    const handleUploadDialogClose = () => {
        setUploadDialogOpen(false);
        fetchModels();
    };

    const handleInferenceDialogOpen = () => {
        setInferenceDialogOpen(true);
    };

    const handleInferenceDialogClose = () => {
        setInferenceDialogOpen(false);
        fetchModels();
    };

    const downloadModels = async () => {
        for (const modelId in selected) {
            httpGet(keycloak, `${MODELS_PATH}/${selected[modelId]}/download`)
                .then(({ blob, fileName }) => {
                    downloadBlob(blob, fileName);
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    };

    const handleTogglePublic = (model_id: number) => {
        httpPatch(keycloak, MODELS_PATH + `/${model_id}/toggle-public`)
            .then(() => {
                fetchModels();
            })
            .catch((error) => {
                console.error(error);
            });
    };

    return (
        <>
            {uploadDialogOpen ? <UploadModelDialog handleClose={handleUploadDialogClose} /> : null}
            {inferenceDialogOpen ? (
                <ModelInferenceButton modelIds={selected} handleClose={handleInferenceDialogClose} />
            ) : null}
            <Grid container spacing={2} justifyContent="space-between" alignItems={'flex-start'}>
                <Grid item xs={1}>
                    <Typography variant="h4" component="h4">
                        Models
                    </Typography>
                </Grid>
                <Grid item md={12} lg={6}>
                    <Grid container spacing={1} justifyContent="right" alignItems={'center'}>
                        <Grid item xs="auto">
                            {selected.length ? (
                                <Typography variant="h6">
                                    {selected.length + ' Model' + (selected.length == 1 ? '' : 's') + ' selected'}
                                </Typography>
                            ) : null}
                        </Grid>
                        <Grid item>
                            <Fab
                                color="primary"
                                aria-label="add"
                                size="small"
                                sx={{ float: 'right' }}
                                disabled={!selected.length}
                                onClick={downloadModels}
                            >
                                <DownloadIcon />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab
                                color="primary"
                                aria-label="add"
                                size="small"
                                sx={{ float: 'right' }}
                                disabled={!selected.length}
                                onClick={handleInferenceDialogOpen}
                            >
                                <Speed />
                            </Fab>
                        </Grid>
                        <Grid item>
                            <Fab
                                color="primary"
                                aria-label="add"
                                size="small"
                                sx={{ float: 'right' }}
                                onClick={handleUploadDialogOpen}
                            >
                                <AddIcon />
                            </Fab>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <AgrovocSearchbar searchRoute={MODELS_PATH} handleResponse={setModels} resetResult={fetchModels} />
            <ModelsList
                models={models}
                connectorAvailable={connectorAvailable}
                onDelete={fetchModels}
                onTogglePublic={handleTogglePublic}
                selected={selected}
                setSelected={setSelected}
            />
            <NoDataYet data={models} name="Models" />
        </>
    );
}
