# SparkleJS Core Tests

This directory contains tests for the SparkleJS core package.

## Running Tests

You can run tests using the following npm commands:

```bash
# Run tests once
npm test

# Run tests in watch mode
npm run test:watch
```

## Test Structure

- `setup.ts` - Global test setup file that configures Vitest and mocks
- `app.test.ts` - Tests for the Sparkle class

## Adding New Tests

When adding new tests, follow these guidelines:

1. Create a new test file for each module/class you're testing
2. Use descriptive test names that explain the expected behavior
3. Follow the Arrange-Act-Assert pattern in your tests

## Test Coverage

To run tests with coverage:

```bash
npm test:coverage
```
