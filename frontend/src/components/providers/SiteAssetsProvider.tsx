'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { siteAssetsApi } from '../../lib/siteAssetsApi';

export type SiteAssetDictionary = Record<string, { url: string; publicId: string | null }>;

interface SiteAssetsContextType {
  assets: SiteAssetDictionary;
  isLoading: boolean;
  getAssetUrl: (key: string, fallbackUrl?: string) => string;
}

const SiteAssetsContext = createContext<SiteAssetsContextType>({
  assets: {},
  isLoading: true,
  getAssetUrl: () => '',
});

export const useSiteAssets = () => useContext(SiteAssetsContext);

export function SiteAssetsProvider({ children }: { children: React.ReactNode }) {
  const [assets, setAssets] = useState<SiteAssetDictionary>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        const data = await siteAssetsApi.getAssets();
        setAssets(data);
      } catch (error) {
        console.error('Failed to load global site assets:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssets();
  }, []);

  const getAssetUrl = (key: string, fallbackUrl = '') => {
    return assets[key]?.url || fallbackUrl;
  };

  return (
    <SiteAssetsContext.Provider value={{ assets, isLoading, getAssetUrl }}>
      {children}
    </SiteAssetsContext.Provider>
  );
}
