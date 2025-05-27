/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
    // clearMocks: true,
    coverageDirectory: "coverage",
    collectCoverageFrom: [
        "src/**/*.{js,ts}",
        "!src/**/*.d.ts",
        "!src/index.{js,ts}",
        "!src/types/**/*",
    ],
    preset: "ts-jest",
    setupFilesAfterEnv: ["./src/tests/setup.ts"],
    testEnvironment: "node",
    testMatch: ["**/__tests__/**/*.test.{js,ts}"],
    testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
