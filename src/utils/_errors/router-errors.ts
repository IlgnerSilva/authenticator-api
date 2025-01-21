import type { FastifyError, FastifyReply } from 'fastify';
import {
	hasZodFastifySchemaValidationErrors,
	isResponseSerializationError,
} from 'fastify-type-provider-zod';

export class RouterError {
	constructor(
		protected error: FastifyError,
		protected reply: FastifyReply,
	) {}

	handle() {
		if (hasZodFastifySchemaValidationErrors(this.error)) {
			return this.reply.code(400).send({
				error: true,
				statusCode: 400,
				message: 'Validation error.',
				details: {
					issues: this.error.validation.map((issue) => issue.message),
				},
			});
		}

		if (isResponseSerializationError(this.error)) {
			return this.reply.code(500).send({
				error: true,
				message: 'An internal error has occurred.',
				statusCode: 500,
				details: {
					issues: this.error.cause.issues,
				},
			});
		}
	}
}
