import React, { useState, useEffect } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast} from 'sonner';
import { shortenUrl } from '../../../Utility/ShortenUrl';

const ShareContent = () => {
  const [activeTab, setActiveTab] = useState('Link');
  const [shortLink, setShortLink] = useState('');
  const [copyStates, setCopyStates] = useState({
    url: false,
    shortLink: false,
    geoUri: false
  });
  
  const url = typeof window !== 'undefined' ? window.location.href : '';
  const [geoUri, setGeoUri] = useState('');

  const generateShortLink = async (longUrl) => {
    const shortUrl = await shortenUrl(longUrl);
    setShortLink(shortUrl || 'Server Error');
  };

  const extractGeoUri = () => {
    const mapFragment = window.location.hash.split('#map=')[1]; 
    const parts = mapFragment.split('/'); 
  
    const zoom = parts[0] || 4; // First part is the zoom level
    const lat = parts[1] || 28.6139; // Second part is latitude
    const lon = parts[2] || 77.209; // Third part is longitude
  
    setGeoUri(`geo:${lat},${lon}?z=${zoom}`);
  };
  
  useEffect(() => {
    generateShortLink(url);
    extractGeoUri();
  }, [url]);

  const handleCopy = async (text, type) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopyStates(prev => ({ ...prev, [type]: true }));
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopyStates(prev => ({ ...prev, [type]: false })), 2000);
    } catch (err) {
      toast.error('Failed to copy')
    }
  };

  const handleDownload = (type) => {
    toast.info(`Downloading ${type}...`)
  };

  const CopyButton = ({ onClick, copied }) => {
    return (
      <button
        className="ml-2 p-2 hover:bg-gray-700 rounded-full transition-colors"
        onClick={onClick}
        aria-label={copied ? "Copied" : "Copy"}
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4 text-gray-300" />
        )}
      </button>
    );
  };
  
  return (
    <div className="w-full max-w-md text-gray-100 rounded-lg shadow-lg">
      
      <div className="space-y-6">
        <div>
          <h3 className="text-xl font-semibold mb-4">Link or HTML</h3>
          <div className="flex gap-2 mb-4">
            {['Link', 'Short Link'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-md transition-colors ${
                  activeTab === tab 
                    ? 'bg-[#0d9488] text-white' 
                    : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center bg-gray-700 rounded-md">
            <input
              value={activeTab === 'Link' ? url : shortLink}
              readOnly
              className="flex-1 bg-transparent text-gray-200 px-3 py-2 focus:outline-none"
            />
            <CopyButton 
              onClick={() => handleCopy(
                activeTab === 'Link' ? url : shortLink,
                activeTab === 'Link' ? 'url' : 'shortLink'
              )}
              copied={activeTab === 'Link' ? copyStates.url : copyStates.shortLink}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Geo URI</h3>
          <div className="flex items-center bg-gray-700 rounded-md">
            <input
              value={geoUri}
              readOnly
              className="flex-1 bg-transparent text-gray-200 px-3 py-2 focus:outline-none"
            />
            <CopyButton 
              onClick={() => handleCopy(geoUri, 'geoUri')}
              copied={copyStates.geoUri}
            />
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Downloads</h3>
          <div className="space-y-3">
            <button
              className="w-full bg-button-select-color hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors"
              onClick={() => handleDownload('PDF')}
            >
              Download PDF
            </button>
            <button
              className="w-full bg-button-select-color hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors"
              onClick={() => handleDownload('GeoJSON')}
            >
              Download GeoJSON
            </button>
            <button
              className="w-full bg-button-select-color hover:bg-teal-700 text-white py-2 px-4 rounded-md transition-colors"
              onClick={() => handleDownload('GeoJSON')}
            >
              Download Tiff
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShareContent;

