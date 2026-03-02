const fs = require('fs');

/**
 * Parse a single CSV line (handles quoted values)
 */
function parseCSVLine(line) {
    const result = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
        const char = line[i];

        if (char === '"') {
            inQuotes = !inQuotes;
        } else if (char === ',' && !inQuotes) {
            result.push(current);
            current = '';
        } else {
            current += char;
        }
    }
    result.push(current);

    return result;
}

/**
 * Parse CSV file and return array of participant objects.
 * Accepts either a file path (string) or raw CSV content (string with newlines).
 */
function parseCSV(input) {
    let content;

    // If input contains newlines, treat it as raw CSV content
    if (input.includes('\n')) {
        content = input;
    } else {
        // Treat as file path
        if (!fs.existsSync(input)) {
            console.error(`CSV file not found: ${input}`);
            return [];
        }
        content = fs.readFileSync(input, 'utf-8');
    }

    const lines = content.trim().split('\n');

    if (lines.length < 2) {
        console.error('CSV file is empty or has no data rows');
        return [];
    }

    // Parse header
    const headers = lines[0].split(',').map(h => h.trim().replace(/\r$/, ''));

    // Parse data rows
    const participants = [];
    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i].replace(/\r$/, ''));
        if (values.length === headers.length) {
            const participant = {};
            headers.forEach((header, index) => {
                participant[header] = values[index].trim();
            });
            participant.rowNumber = i + 1;
            participants.push(participant);
        } else {
            console.warn(`Skipping row ${i + 1}: column count mismatch (got ${values.length}, expected ${headers.length})`);
        }
    }

    return participants;
}

/**
 * Parse sponsors CSV and group by event name.
 * Accepts either a file path or raw CSV content.
 */
function parseSponsorsCSV(input) {
    let content;

    if (input.includes('\n')) {
        content = input;
    } else {
        if (!fs.existsSync(input)) {
            console.warn(`Sponsors CSV not found: ${input}`);
            return {};
        }
        content = fs.readFileSync(input, 'utf-8');
    }

    const lines = content.trim().split('\n');

    if (lines.length < 2) {
        console.warn('Sponsors CSV is empty');
        return {};
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/\r$/, ''));
    const sponsorsByEvent = {};

    for (let i = 1; i < lines.length; i++) {
        const values = parseCSVLine(lines[i].replace(/\r$/, ''));
        if (values.length === headers.length) {
            const sponsor = {};
            headers.forEach((header, index) => {
                sponsor[header] = values[index].trim();
            });

            const eventName = sponsor.eventName;
            if (!sponsorsByEvent[eventName]) {
                sponsorsByEvent[eventName] = [];
            }
            sponsorsByEvent[eventName].push(sponsor);
        }
    }

    // Sort by priority and limit to max 3 sponsors per event
    Object.keys(sponsorsByEvent).forEach(eventName => {
        sponsorsByEvent[eventName].sort((a, b) =>
            parseInt(a.priority || 999) - parseInt(b.priority || 999)
        );
        sponsorsByEvent[eventName] = sponsorsByEvent[eventName].slice(0, 3);
    });

    return sponsorsByEvent;
}

/**
 * Validate that a CSV has the required columns for certificate generation.
 * Returns { valid: boolean, missingColumns: string[], headers: string[] }
 */
function validateCSVHeaders(csvContent) {
    const requiredColumns = ['firstName', 'lastName', 'certificateType'];
    const optionalColumns = ['middleName', 'sport', 'role', 'eventName', 'organization', 'association', 'startDate', 'endDate'];

    const lines = csvContent.trim().split('\n');
    if (lines.length < 1) {
        return { valid: false, missingColumns: requiredColumns, headers: [] };
    }

    const headers = lines[0].split(',').map(h => h.trim().replace(/\r$/, ''));
    const missingColumns = requiredColumns.filter(col => !headers.includes(col));

    return {
        valid: missingColumns.length === 0,
        missingColumns,
        headers,
        totalRows: lines.length - 1
    };
}

module.exports = {
    parseCSV,
    parseCSVLine,
    parseSponsorsCSV,
    validateCSVHeaders
};
