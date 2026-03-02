/**
 * Certificate Engine Bridge
 * 
 * Runtime bridge to access certificate-engine modules from Next.js API routes.
 * Uses process.cwd() for reliable path resolution in both dev and production.
 * Uses eval('require') to prevent webpack from statically analyzing dynamic requires.
 */
const path = require('path');

// Webpack-safe dynamic require (prevents static analysis)
// eslint-disable-next-line no-eval
const dynamicRequire = eval('require');

/**
 * Resolve the certificate-engine root directory at runtime.
 * process.cwd() = figma/ directory (Next.js project root)
 * figma/ -> FigmaCert/ -> certificate/ -> certificate-engine/
 */
function getEngineRoot() {
    return path.resolve(process.cwd(), '..', '..', 'certificate-engine');
}

function getGenerator() {
    return dynamicRequire(path.join(getEngineRoot(), 'lib', 'generator.js'));
}

function getCsvParser() {
    return dynamicRequire(path.join(getEngineRoot(), 'lib', 'csv-parser.js'));
}

function getEngineAssetPaths() {
    const engineRoot = getEngineRoot();
    return {
        templatesDir: path.join(engineRoot, 'assets', 'templates'),
        fontsDir: path.join(engineRoot, 'assets', 'fonts'),
        dataDir: path.join(engineRoot, 'data'),
        sponsorsCsvPath: path.join(engineRoot, 'data', 'sponsors.csv'),
        participantsCsvPath: path.join(engineRoot, 'data', 'participants.csv'),
    };
}

module.exports = {
    getGenerator,
    getCsvParser,
    getEngineRoot,
    getEngineAssetPaths,
};
