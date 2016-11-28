import 'core-js';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';

require('zone.js/dist/zone');

import 'ts-helpers';

if (process.env.ENV === 'build') {
    enableProdMode();
} else {
    Error['stackTraceLimit'] = Infinity;
    require('zone.js/dist/long-stack-trace-zone');
}
