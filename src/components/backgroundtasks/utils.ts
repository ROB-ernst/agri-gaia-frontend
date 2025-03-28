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

import { TaskStatus, TaskStatusType } from '../../types/TaskStatus';

export function getTaskStatusColor(status: TaskStatusType) {
    switch (status) {
        case TaskStatus.created:
            return 'textPrimary';
        case TaskStatus.inprogress:
            return '#00838f';
        case TaskStatus.completed:
            return 'green';
        case TaskStatus.failed:
            return 'red';
    }
    return 'textPrimary';
}
