const path = require('path');

module.exports = {
    verbose: true,
    rootDir: path.join(__dirname, './'),
    testMatch: [path.join(__dirname, '**/?(*.)+(spec|test).[tj]s?(x)')],
    transform: {
        '^.+\\.js$': 'babel-jest',
    },
    testEnvironment: 'node',
};
