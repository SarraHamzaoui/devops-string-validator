const { isValidUrl, server } = require('./server');

describe('isValidUrl', () => {
    test('should return true for a valid HTTP URL', () => {
        expect(isValidUrl('http://www.google.com')).toBe(true);
    });

    test('should return true for a valid HTTPS URL with path', () => {
        expect(isValidUrl('https://api.test.io/v1/data')).toBe(true);
    });

    test('should return false for a plain text string', () => {
        expect(isValidUrl('Ceci est une phrase')).toBe(false);
    });

    test('should return true for an invalid protocol', () => {
        expect(isValidUrl('ftp://invalide')).toBe(true);
    });

    test('should return false for null or empty input', () => {
        expect(isValidUrl('')).toBe(false);
    });


}
);
afterAll(done => {
    if (server) {
        server.close(done);
    } else {
        done();
    }
});