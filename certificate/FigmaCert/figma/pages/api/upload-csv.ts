import type { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

// Runtime bridge to certificate-engine (avoids webpack bundling issues)
const bridge = require('../../lib/certificate-engine/bridge');

export const config = {
    api: {
        bodyParser: false, // Required for formidable file parsing
    },
};

interface UploadResponse {
    success: boolean;
    participants?: any[];
    headers?: string[];
    totalRows?: number;
    error?: string;
    validation?: {
        valid: boolean;
        missingColumns: string[];
    };
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<UploadResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const csvParser = bridge.getCsvParser();

        const form = formidable({
            maxFileSize: 5 * 1024 * 1024, // 5MB limit
            filter: (part) => {
                return part.mimetype === 'text/csv' ||
                    part.mimetype === 'application/vnd.ms-excel' ||
                    (part.originalFilename?.endsWith('.csv') ?? false);
            },
        });

        const [fields, files] = await form.parse(req);

        const csvFile = files.csvFile?.[0];
        if (!csvFile) {
            return res.status(400).json({
                success: false,
                error: 'No CSV file provided. Please upload a file with the field name "csvFile".',
            });
        }

        // Read CSV content
        const csvContent = fs.readFileSync(csvFile.filepath, 'utf-8');

        // Validate CSV headers
        const validation = csvParser.validateCSVHeaders(csvContent);
        if (!validation.valid) {
            fs.unlinkSync(csvFile.filepath);
            return res.status(400).json({
                success: false,
                error: `CSV is missing required columns: ${validation.missingColumns.join(', ')}`,
                validation,
            });
        }

        // Parse CSV into participant objects
        const participants = csvParser.parseCSV(csvContent);

        // Clean up temp file
        fs.unlinkSync(csvFile.filepath);

        if (participants.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'CSV file contains no data rows.',
            });
        }

        return res.status(200).json({
            success: true,
            participants,
            headers: validation.headers,
            totalRows: participants.length,
        });
    } catch (error: any) {
        console.error('CSV upload error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to process CSV file.',
        });
    }
}
