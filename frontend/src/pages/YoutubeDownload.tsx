import React, { useState } from 'react';
import { api } from '../services/axios-setup';

interface VideoInfo {
    title: string;
    duration: string;
    thumbnail: string;
}

const YoutubeDownload: React.FC = () => {
    const [url, setUrl] = useState('');
    const [videoInfo, setVideoInfo] = useState<VideoInfo | null>(null);
    const [loading, setLoading] = useState(false);
    const [downloading, setDownloading] = useState(false);
    const [error, setError] = useState('');

    const handleGetInfo = async () => {
        if (!url.trim()) return;
        setError('');
        setVideoInfo(null);
        setLoading(true);
        try {
            const res = await api.get('/youtube/info', { params: { url } });
            setVideoInfo(res.data);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Failed to get video info');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        if (!url.trim()) return;
        setError('');
        setDownloading(true);
        try {
            const res = await api.get('/youtube/download', {
                params: { url },
                responseType: 'blob',
            });

            const disposition = res.headers['content-disposition'] || '';
            let filename = 'audio.mp3';
            const match = disposition.match(/filename\*=UTF-8''(.+)/i) || disposition.match(/filename="?([^"]+)"?/i);
            if (match) filename = decodeURIComponent(match[1]);

            const blobUrl = window.URL.createObjectURL(new Blob([res.data], { type: 'audio/mpeg' }));
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = filename;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (err: any) {
            if (err.response?.data) {
                const text = await err.response.data.text?.();
                try {
                    const json = JSON.parse(text || '');
                    setError(json.error || 'Download failed');
                } catch {
                    setError('Download failed');
                }
            } else {
                setError('Download failed');
            }
        } finally {
            setDownloading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') handleGetInfo();
    };

    return (
        <div className="uk-section">
            <div className="uk-container uk-container-small">
                <h2 className="uk-heading-small uk-text-center">YouTube to MP3</h2>
                <p className="uk-text-center uk-text-muted">Paste a YouTube URL and download the audio as MP3</p>

                <div className="uk-margin">
                    <div className="uk-inline uk-width-1-1">
                        <input
                            className="uk-input uk-form-large"
                            type="url"
                            placeholder="https://www.youtube.com/watch?v=..."
                            value={url}
                            onChange={e => setUrl(e.target.value)}
                            onKeyDown={handleKeyDown}
                            disabled={loading || downloading}
                        />
                    </div>
                </div>

                <div className="uk-margin uk-text-center">
                    <button
                        className="uk-button uk-button-default uk-margin-small-right"
                        onClick={handleGetInfo}
                        disabled={!url.trim() || loading || downloading}
                    >
                        {loading ? <span uk-spinner="ratio: 0.6"></span> : 'Get Info'}
                    </button>
                    <button
                        className="uk-button uk-button-primary"
                        onClick={handleDownload}
                        disabled={!url.trim() || loading || downloading}
                    >
                        {downloading ? <><span uk-spinner="ratio: 0.6"></span> Downloading...</> : 'Download MP3'}
                    </button>
                </div>

                {error && (
                    <div className="uk-alert uk-alert-danger" uk-alert="true">
                        <p>{error}</p>
                    </div>
                )}

                {videoInfo && (
                    <div className="uk-card uk-card-default uk-card-body uk-margin">
                        <div className="uk-grid uk-grid-small" uk-grid="true">
                            {videoInfo.thumbnail && (
                                <div className="uk-width-auto">
                                    <img
                                        src={videoInfo.thumbnail}
                                        alt="thumbnail"
                                        style={{ width: 160, borderRadius: 4 }}
                                    />
                                </div>
                            )}
                            <div className="uk-width-expand">
                                <h3 className="uk-card-title uk-margin-remove">{videoInfo.title}</h3>
                                {videoInfo.duration && (
                                    <p className="uk-text-muted uk-margin-small-top">Duration: {videoInfo.duration}</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {downloading && (
                    <div className="uk-alert uk-alert-primary" uk-alert="true">
                        <p>Preparing your MP3... this may take a moment.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default YoutubeDownload;
