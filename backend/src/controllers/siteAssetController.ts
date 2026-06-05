import { Request, Response } from 'express';
import { prisma } from '../config/db';

export const getAssets = async (req: Request, res: Response) => {
  try {
    const assets = await prisma.siteAsset.findMany();
    // Return as a dictionary for easy frontend access
    const assetDict = assets.reduce((acc: any, asset: any) => {
      acc[asset.key] = { url: asset.url, publicId: asset.publicId };
      return acc;
    }, {} as Record<string, { url: string; publicId: string | null }>);
    
    res.json(assetDict);
  } catch (error) {
    console.error('Error fetching site assets:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};

export const updateAsset = async (req: Request, res: Response) => {
  try {
    const { key, url, publicId } = req.body;

    if (!key || !url) {
      return res.status(400).json({ error: 'Key and URL are required' });
    }

    const asset = await prisma.siteAsset.upsert({
      where: { key },
      update: { url, publicId },
      create: { key, url, publicId }
    });

    res.json(asset);
  } catch (error) {
    console.error('Error updating site asset:', error);
    res.status(500).json({ error: 'Failed to update asset' });
  }
};

export const getAssetsArray = async (req: Request, res: Response) => {
  try {
    const assets = await prisma.siteAsset.findMany();
    res.json(assets);
  } catch (error) {
    console.error('Error fetching site assets array:', error);
    res.status(500).json({ error: 'Failed to fetch assets' });
  }
};
