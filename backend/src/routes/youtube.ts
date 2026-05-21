import { Router, Request, Response } from 'express';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import os from 'os';
import rateLimit from 'express-rate-limit';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();

const downloadLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: { error: 'Too many download requests, please try again later' }
});

const YOUTUBE_REGEX = /^(https?:\/\/)?(www\.|m\.)?(youtube\.com\/(watch|shorts\/)|youtu\.be\/)/;

router.get('/info', async (req: Request, res: Response) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
    }
    if (!YOUTUBE_REGEX.test(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await new Promise<{ title: string; duration: string; thumbnail: string }>((resolve, reject) => {
            const ytDlp = spawn('yt-dlp', ['--dump-json', '--no-playlist', url]);

            let output = '';
            ytDlp.stdout.on('data', (data) => { output += data.toString(); });
            ytDlp.stderr.on('data', (data) => { console.log('[yt-dlp info]', data.toString().trim()); });

            ytDlp.on('close', (code) => {
                if (code === 0) {
                    try {
                        const json = JSON.parse(output);
                        resolve({
                            title: json.title,
                            duration: json.duration_string,
                            thumbnail: json.thumbnail
                        });
                    } catch {
                        reject(new Error('Failed to parse video info'));
                    }
                } else {
                    reject(new Error('Failed to get video info'));
                }
            });

            ytDlp.on('error', reject);
        });

        return res.json(info);
    } catch (error) {
        console.error('Info error:', error);
        return res.status(500).json({ error: 'Failed to get video info' });
    }
});

router.get('/download', downloadLimiter, async (req: Request, res: Response) => {
    const { url } = req.query;

    if (!url || typeof url !== 'string') {
        return res.status(400).json({ error: 'URL is required' });
    }
    if (!YOUTUBE_REGEX.test(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ytmp3-'));

    try {
        const outputTemplate = path.join(tmpDir, '%(title)s.%(ext)s');

        await new Promise<void>((resolve, reject) => {
            const ytDlp = spawn('yt-dlp', [
                '-f', 'bestaudio/best',
                '--extract-audio',
                '--audio-format', 'mp3',
                '--audio-quality', '0',
                '--no-playlist',
                '--ffmpeg-location', '/usr/bin/ffmpeg',
                '-o', outputTemplate,
                url
            ]);

            ytDlp.stderr.on('data', (data) => {
                console.log('[yt-dlp]', data.toString().trim());
            });

            ytDlp.on('close', (code) => {
                if (code === 0) resolve();
                else reject(new Error(`yt-dlp exited with code ${code}`));
            });

            ytDlp.on('error', reject);
        });

        const files = fs.readdirSync(tmpDir);
        const mp3File = files.find(f => f.endsWith('.mp3'));

        if (!mp3File) {
            throw new Error('MP3 file not generated');
        }

        const filePath = path.join(tmpDir, mp3File);
        const stat = fs.statSync(filePath);

        const safeFilename = encodeURIComponent(mp3File);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${safeFilename}`);
        res.setHeader('Content-Type', 'audio/mpeg');
        res.setHeader('Content-Length', stat.size);

        const fileStream = fs.createReadStream(filePath);
        fileStream.pipe(res);

        const cleanup = () => {
            try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
        };

        fileStream.on('end', cleanup);
        req.on('close', () => {
            fileStream.destroy();
            cleanup();
        });

    } catch (error) {
        console.error('Download error:', error);
        try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
        if (!res.headersSent) {
            res.status(500).json({ error: 'Failed to download audio' });
        }
    }
});

export default router;
