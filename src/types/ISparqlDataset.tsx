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

export default interface ISparqlDataset {
    iri: {
        type: string;
        value: string;
    };
    downloadURL: {
        type: string;
        value: string;
    };
    creator?: {
        type: string;
        value: string;
    };
    creationDate?: {
        type: string;
        value: string;
    };
}
