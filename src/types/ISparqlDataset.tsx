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
