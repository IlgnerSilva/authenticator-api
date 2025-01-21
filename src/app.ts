import { fastify } from 'fastify';
import { appRoutes } from './http/routes';

import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUI from '@fastify/swagger-ui';
import {
	ZodTypeProvider,
	createJsonSchemaTransform,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from 'fastify-type-provider-zod';

export const app = fastify();
app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(fastifySwagger, {
	openapi: {
		info: {
			title: 'Authenticator API',
			description: 'Sample backend service',
			version: '1.0.0',
		},
		servers: [],
	},
	transform: jsonSchemaTransform,
});

app.register(fastifySwaggerUI, {
	routePrefix: '/doc',
});

app.register(appRoutes);
