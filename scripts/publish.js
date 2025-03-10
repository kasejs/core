#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

// Read current version from package.json
const packageJsonPath = path.join(rootDir, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// Get the version bump type from command line arguments
const args = process.argv.slice(2);
const validBumpTypes = ['patch', 'minor', 'major', 'prepatch', 'preminor', 'premajor', 'prerelease'];
const bumpType = args[0] || 'patch';

if (!validBumpTypes.includes(bumpType)) {
    console.error(`Invalid bump type: ${bumpType}`);
    console.error(`Valid bump types: ${validBumpTypes.join(', ')}`);
    process.exit(1);
}

try {
    // Run tests
    console.log('Running tests...');
    execSync('npm test', { stdio: 'inherit', cwd: rootDir });

    // Build the package
    console.log('Building the package...');
    execSync('npm run build', { stdio: 'inherit', cwd: rootDir });

    // Bump the version
    console.log(`Bumping version (${bumpType})...`);
    execSync(`npm version ${bumpType} --no-git-tag-version`, { stdio: 'inherit', cwd: rootDir });

    // Read the new version
    const updatedPackageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const newVersion = updatedPackageJson.version;

    // Publish to npm
    console.log(`Publishing version ${newVersion} to npm...`);
    execSync('npm publish', { stdio: 'inherit', cwd: rootDir });

    console.log(`\n🚀 Successfully published @sparklejs/core@${newVersion} to npm!`);
} catch (error) {
    console.error('Error during publishing process:', error.message);
    process.exit(1);
} 