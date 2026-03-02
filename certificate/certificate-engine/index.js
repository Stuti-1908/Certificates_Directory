const path = require('path');
const { parseCSV, parseSponsorsCSV } = require('./lib/csv-parser');
const { generateBatch, loadCustomFonts } = require('./lib/generator');

// ============================================================================
// CONFIGURATION
// ============================================================================
const CSV_FILE = './data/participants.csv';
const SPONSORS_CSV_FILE = './data/sponsors.csv';

// ============================================================================
// MAIN EXECUTION (CLI mode)
// ============================================================================
(async function main() {
    console.log('');
    console.log('=== CERTIFICATE GENERATION ENGINE ===');
    console.log('');

    // Load custom fonts
    console.log('Loading custom fonts...');
    loadCustomFonts();
    console.log('');

    // Parse CSV files
    console.log(`Reading CSV: ${CSV_FILE}`);
    const participants = parseCSV(CSV_FILE);

    if (participants.length === 0) {
        console.error('No participants found in CSV. Exiting.');
        return;
    }

    console.log(`Found ${participants.length} participant(s)`);

    // Parse sponsors CSV
    console.log(`Reading Sponsors: ${SPONSORS_CSV_FILE}`);
    const sponsorsByEvent = parseSponsorsCSV(SPONSORS_CSV_FILE);
    const totalSponsors = Object.values(sponsorsByEvent).reduce((sum, arr) => sum + arr.length, 0);
    console.log(`Found ${totalSponsors} sponsor(s) across ${Object.keys(sponsorsByEvent).length} event(s)\n`);
    console.log('-'.repeat(65));

    // Generate all certificates
    const batchResult = await generateBatch(participants, sponsorsByEvent);

    console.log('');
    console.log('='.repeat(65));
    console.log(`Generated ${batchResult.successCount}/${batchResult.total} certificates successfully!`);
    console.log(`Output folder: ${path.resolve('./output')}`);
    console.log('='.repeat(65));

    // Print summary by category
    console.log('\nSUMMARY BY CATEGORY:\n');

    if (batchResult.byType.gold.length > 0) {
        console.log(`GOLD (${batchResult.byType.gold.length}):`);
        batchResult.byType.gold.forEach(r => console.log(`   - ${r.name}`));
    }

    if (batchResult.byType.silver.length > 0) {
        console.log(`SILVER (${batchResult.byType.silver.length}):`);
        batchResult.byType.silver.forEach(r => console.log(`   - ${r.name}`));
    }

    if (batchResult.byType.bronze.length > 0) {
        console.log(`BRONZE (${batchResult.byType.bronze.length}):`);
        batchResult.byType.bronze.forEach(r => console.log(`   - ${r.name}`));
    }

    if (batchResult.byType.participation.length > 0) {
        console.log(`PARTICIPATION (${batchResult.byType.participation.length}):`);
        batchResult.byType.participation.forEach(r => console.log(`   - ${r.name}`));
    }

    console.log('');
})();