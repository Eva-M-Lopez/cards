const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '..');

const config = getDefaultConfig(projectRoot);

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Tell Metro where to find node_modules (including root)
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),  // This is key - look in root node_modules
];

// Add shared package
config.resolver.extraNodeModules = {
  '@cards/shared': path.resolve(workspaceRoot, 'shared'),
};

module.exports = config;