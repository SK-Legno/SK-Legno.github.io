module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(gif|ttf|eot|svg|png)$': '<rootDir>/__mocks__/fileMock.js'
    },
    collectCoverageFrom: [
        'js/**/*.js',
        '!js/analytics.js', // Exclude analytics from coverage
        '!**/node_modules/**'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 70,
            statements: 70
        }
    },
    testMatch: [
        '<rootDir>/__tests__/**/*.test.js'
    ],
    transform: {
        '^.+\\.js$': 'babel-jest'
    }
} 