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
import { useParams } from 'react-router-dom';
import { httpGet } from '../api';
import useKeycloak from '../contexts/KeycloakContext';

import Grid from '@mui/material/Grid';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';

import { MODELS_PATH } from '../endpoints';
import IModel from '../types/IModel';
import ModelDetailsGrid from '../components/models/ModelDetailsGrid';

export default function ModelDetails() {
    const keycloak = useKeycloak();
    const modelId = useParams().id;

    const [model, setModel] = useState<IModel>();

    const fetchModel = async (modelId: string | undefined) => {
        httpGet(keycloak, `${MODELS_PATH}/${modelId}`)
            .then((data) => {
                setModel(data);
            })
            .catch((error) => {
                console.error(error);
            });
    };

    const updateModel = (model: IModel) => {
        setModel(model);
    };

    useEffect(() => {
        fetchModel(modelId);
    }, [keycloak]);

    return model ? (
        <>
            <Grid container spacing={4} justifyContent="space-between">
                <Grid item xs={12}>
                    <Typography variant="h4" component="h4">
                        Model: {model?.name ?? 'No Device Found'}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Divider />
                </Grid>
                <Grid item xs={12}>
                    <Paper elevation={3} sx={{ p: 2 }}>
                        <ModelDetailsGrid model={model} onEditSuccessful={updateModel} />
                    </Paper>
                </Grid>
            </Grid>
        </>
    ) : null;
}
