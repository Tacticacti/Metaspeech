export class UnsupportedFileError extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'UnsupportedFileError';
	}
}
