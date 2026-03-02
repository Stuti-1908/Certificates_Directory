import type { NextApiRequest, NextApiResponse } from 'next';
import path from 'path';
import fs from 'fs';

// Runtime bridge to certificate-engine (avoids webpack bundling issues)
const bridge = require('../../lib/certificate-engine/bridge');

interface GenerateResponse {
    success: boolean;
    results?: any[];
    successCount?: number;
    failCount?: number;
    total?: number;
    byType?: Record<string, any[]>;
    error?: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<GenerateResponse>
) {
    if (req.method !== 'POST') {
        return res.status(405).json({ success: false, error: 'Method not allowed' });
    }

    try {
        const generator = bridge.getGenerator();
        const csvParser = bridge.getCsvParser();
        const assetPaths = bridge.getEngineAssetPaths();

        const { participants, sponsorsCsv } = req.body;

        if (!participants || !Array.isArray(participants) || participants.length === 0) {
            return res.status(400).json({
                success: false,
                error: 'No participants provided. Send an array of participant objects.',
            });
        }

        // Parse sponsors if provided, else try default
        let sponsorsByEvent: Record<string, any[]> = {};
        if (sponsorsCsv) {
            sponsorsByEvent = csvParser.parseSponsorsCSV(sponsorsCsv);
        } else if (fs.existsSync(assetPaths.sponsorsCsvPath)) {
            sponsorsByEvent = csvParser.parseSponsorsCSV(assetPaths.sponsorsCsvPath);
        }

        // Output to public/generated-certificates so Next.js can serve them
        const outputDir = path.resolve(process.cwd(), 'public', 'generated-certificates');

        // Generate certificates
        const batchResult = await generator.generateBatch(participants, sponsorsByEvent, {
            outputDir,
            templatesDir: assetPaths.templatesDir,
            fontsDir: assetPaths.fontsDir,
        });

        // Map file paths to URLs that can be served by Next.js
        const resultsWithUrls = batchResult.results.map((r: any) => {
            if (r.error) return r;
            return {
                ...r,
                url: `/generated-certificates/${r.fileName}`,
            };
        });

        return res.status(200).json({
            success: true,
            results: resultsWithUrls,
            successCount: batchResult.successCount,
            failCount: batchResult.failCount,
            total: batchResult.total,
            byType: batchResult.byType,
        });
    } catch (error: any) {
        console.error('Certificate generation error:', error);
        return res.status(500).json({
            success: false,
            error: error.message || 'Failed to generate certificates.',
        });
    }
}
