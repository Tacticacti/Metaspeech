/**
 * Error class for when a file is not supported by the application.
 */
export class UnsupportedFileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnsupportedFileError';
	}
}
