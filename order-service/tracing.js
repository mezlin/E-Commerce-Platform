const { NodeSDK } = require('@opentelemetry/sdk-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const {resourceFromAttributes} = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

//Get the service name 
const SERVICE_NAME = process.env.npm_package_name || 'order-service';

//Configure OTLP exporter to send to Jaeger
const exporter = new OTLPTraceExporter({
    url: 'http://localhost:4318/v1/traces', // Jaeger OTLP endpoint
});

//Configure OTel SDK
const sdk = new NodeSDK({
    resource: resourceFromAttributes({
        [SemanticResourceAttributes.SERVICE_NAME]: SERVICE_NAME,
    }),
    traceExporter: exporter,
    instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log(`Tracing initialized for: ${SERVICE_NAME}`);

//Graceful shutdown
process.on('SIGTERM', () => {
    sdk.shutdown()
        .then(() => console.log('Tracing terminated'))
        .catch((e) => console.log('Error terminating tracing', e))
        .finally(() => process.exit(0));
});