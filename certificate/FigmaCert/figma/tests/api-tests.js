/**
 * Automated API Tests for Certificate Engine Integration
 * 
 * Run with: node tests/api-tests.js
 * Prerequisites: Next.js dev server must be running on port 3001
 */

const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3001';
let passed = 0;
let failed = 0;

function log(icon, message) {
    console.log(`${icon} ${message}`);
}

async function test(name, fn) {
    try {
        await fn();
        passed++;
        log('[PASS]', name);
    } catch (err) {
        failed++;
        log('[FAIL]', `${name}: ${err.message}`);
    }
}

function assert(condition, message) {
    if (!condition) throw new Error(message);
}

// ============================================================================
// TEST 1: Page loads
// ============================================================================
async function testPageLoads() {
    await test('Main page loads (GET /)', async () => {
        const res = await fetch(`${BASE_URL}/`);
        assert(res.status === 200, `Expected 200, got ${res.status}`);
        const html = await res.text();
        assert(html.includes('SportsKeyz'), 'Page should contain SportsKeyz');
        assert(html.length > 1000, `Page HTML too small: ${html.length}`);
    });
}

// ============================================================================
// TEST 2: Download Sample CSV
// ============================================================================
async function testDownloadSampleCsv() {
    await test('Download sample CSV (GET /api/download-sample-csv)', async () => {
        const res = await fetch(`${BASE_URL}/api/download-sample-csv`);
        assert(res.status === 200, `Expected 200, got ${res.status}`);

        const contentType = res.headers.get('content-type');
        assert(contentType.includes('text/csv'), `Expected text/csv, got ${contentType}`);

        const csv = await res.text();
        assert(csv.includes('firstName'), 'CSV should contain firstName header');
        assert(csv.includes('lastName'), 'CSV should contain lastName header');
        assert(csv.includes('certificateType'), 'CSV should contain certificateType header');
        assert(csv.split('\n').length > 2, 'CSV should have data rows');
    });
}

// ============================================================================
// TEST 3: Upload CSV
// ============================================================================
async function testUploadCsv() {
    await test('Upload CSV - valid file (POST /api/upload-csv)', async () => {
        const csvPath = path.resolve(__dirname, '..', '..', '..', 'certificate-engine', 'data', 'participants.csv');
        assert(fs.existsSync(csvPath), `CSV file not found at ${csvPath}`);

        const csvContent = fs.readFileSync(csvPath);
        const boundary = '----TestBoundary' + Date.now();

        const bodyParts = [
            `--${boundary}\r\n`,
            `Content-Disposition: form-data; name="csvFile"; filename="participants.csv"\r\n`,
            `Content-Type: text/csv\r\n\r\n`,
            csvContent,
            `\r\n--${boundary}--\r\n`,
        ];

        const body = Buffer.concat(bodyParts.map(p => typeof p === 'string' ? Buffer.from(p) : p));

        const res = await fetch(`${BASE_URL}/api/upload-csv`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body,
        });

        const data = await res.json();
        assert(res.status === 200, `Expected 200, got ${res.status}. Error: ${data.error || 'none'}`);
        assert(data.success === true, `Expected success=true, got ${data.success}`);
        assert(Array.isArray(data.participants), 'participants should be an array');
        assert(data.participants.length > 0, 'Should have at least one participant');
        assert(data.totalRows > 0, `Expected totalRows > 0, got ${data.totalRows}`);

        // Check first participant has required fields
        const first = data.participants[0];
        assert(first.firstName, 'Participant should have firstName');
        assert(first.lastName, 'Participant should have lastName');
        assert(first.certificateType, 'Participant should have certificateType');

        log('  ', `Parsed ${data.totalRows} participants successfully`);
    });

    await test('Upload CSV - missing file (POST /api/upload-csv)', async () => {
        const boundary = '----TestBoundary' + Date.now();
        const body = `--${boundary}\r\nContent-Disposition: form-data; name="otherField"\r\n\r\ntest\r\n--${boundary}--\r\n`;

        const res = await fetch(`${BASE_URL}/api/upload-csv`, {
            method: 'POST',
            headers: {
                'Content-Type': `multipart/form-data; boundary=${boundary}`,
            },
            body,
        });

        const data = await res.json();
        assert(res.status === 400, `Expected 400, got ${res.status}`);
        assert(data.success === false, 'Expected success=false for missing file');
    });

    await test('Upload CSV - wrong method (GET /api/upload-csv)', async () => {
        const res = await fetch(`${BASE_URL}/api/upload-csv`);
        assert(res.status === 405, `Expected 405, got ${res.status}`);
    });
}

// ============================================================================
// TEST 4: Generate Certificates
// ============================================================================
async function testGenerateCertificates() {
    await test('Generate certificates - valid request (POST /api/generate-certificates)', async () => {
        const participants = [
            {
                firstName: 'Test',
                middleName: 'Auto',
                lastName: 'User',
                certificateType: 'gold',
                sport: 'Tennis',
                eventName: 'Test Tournament 2026',
                organization: 'Test Org',
                association: 'Test Association',
                startDate: '2026-01-01',
                endDate: '2026-01-03',
            },
            {
                firstName: 'Jane',
                lastName: 'Doe',
                certificateType: 'participation',
                sport: 'Swimming',
                role: 'Athlete',
                eventName: 'Test Tournament 2026',
                organization: 'Test Org',
                association: 'Test Association',
                startDate: '2026-01-01',
                endDate: '2026-01-03',
            },
        ];

        const res = await fetch(`${BASE_URL}/api/generate-certificates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participants }),
        });

        const data = await res.json();
        assert(res.status === 200, `Expected 200, got ${res.status}. Error: ${data.error || 'none'}`);
        assert(data.success === true, `Expected success=true. Error: ${data.error || 'none'}`);
        assert(data.successCount === 2, `Expected 2 successes, got ${data.successCount}`);
        assert(data.total === 2, `Expected total=2, got ${data.total}`);
        assert(Array.isArray(data.results), 'results should be an array');

        // Check results have URLs
        const firstResult = data.results[0];
        assert(firstResult.url, 'Result should have url');
        assert(firstResult.certId, 'Result should have certId');
        assert(firstResult.fileName, 'Result should have fileName');

        log('  ', `Generated ${data.successCount} certificates: ${data.results.map(r => r.fileName).join(', ')}`);

        // Verify generated files exist
        const outputDir = path.resolve(__dirname, '..', 'public', 'generated-certificates');
        if (fs.existsSync(outputDir)) {
            const files = fs.readdirSync(outputDir);
            log('  ', `Output directory has ${files.length} files`);
        }
    });

    await test('Generate certificates - empty participants (POST /api/generate-certificates)', async () => {
        const res = await fetch(`${BASE_URL}/api/generate-certificates`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ participants: [] }),
        });

        const data = await res.json();
        assert(res.status === 400, `Expected 400, got ${res.status}`);
        assert(data.success === false, 'Expected success=false for empty participants');
    });

    await test('Generate certificates - wrong method (GET /api/generate-certificates)', async () => {
        const res = await fetch(`${BASE_URL}/api/generate-certificates`);
        assert(res.status === 405, `Expected 405, got ${res.status}`);
    });
}

// ============================================================================
// TEST 5: Download Certificate
// ============================================================================
async function testDownloadCertificate() {
    await test('Download certificate - existing file (GET /api/download-certificate/[id])', async () => {
        // First, check if any certificates were generated
        const outputDir = path.resolve(__dirname, '..', 'public', 'generated-certificates');
        if (!fs.existsSync(outputDir)) {
            log('  ', 'Skipping - no generated certificates directory');
            return;
        }

        const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
        if (files.length === 0) {
            log('  ', 'Skipping - no generated certificate files');
            return;
        }

        const fileName = files[0];
        const res = await fetch(`${BASE_URL}/api/download-certificate/${fileName}`);
        assert(res.status === 200, `Expected 200, got ${res.status}`);

        const contentType = res.headers.get('content-type');
        assert(contentType.includes('image/jpeg'), `Expected image/jpeg, got ${contentType}`);
    });

    await test('Download certificate - non-existent file (GET /api/download-certificate/[id])', async () => {
        const res = await fetch(`${BASE_URL}/api/download-certificate/nonexistent.jpg`);
        assert(res.status === 404, `Expected 404, got ${res.status}`);
    });
}

// ============================================================================
// MAIN
// ============================================================================
async function main() {
    console.log('\n=== Certificate Engine Integration - API Tests ===\n');
    console.log(`Target: ${BASE_URL}\n`);

    await testPageLoads();
    await testDownloadSampleCsv();
    await testUploadCsv();
    await testGenerateCertificates();
    await testDownloadCertificate();

    console.log('\n' + '='.repeat(50));
    console.log(`Results: ${passed} passed, ${failed} failed, ${passed + failed} total`);
    console.log('='.repeat(50) + '\n');

    process.exit(failed > 0 ? 1 : 0);
}

main().catch(err => {
    console.error('Test runner error:', err);
    process.exit(1);
});
