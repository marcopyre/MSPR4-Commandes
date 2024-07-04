'use strict';

import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import * as opentelemetry from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';

const exporterOptions = {
  url: 'http://localhost:4318/v1/traces',
};

const traceExporter = new OTLPTraceExporter(exporterOptions);

// Configure the SDK to use the BatchSpanProcessor with the trace exporter
const sdk = new opentelemetry.NodeSDK({
  spanProcessor: new BatchSpanProcessor(traceExporter),
  instrumentations: [new HttpInstrumentation(), new ExpressInstrumentation()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'orders-api',
  }),
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  sdk
    .shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});

export default sdk;
