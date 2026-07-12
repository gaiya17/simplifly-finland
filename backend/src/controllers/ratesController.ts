import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthenticatedRequest } from '../middleware/auth';

export class RatesController {

  // GET /api/rates/:resortId
  // Returns saved rates for a resort, or null if none saved yet.
  static async getRates(req: AuthenticatedRequest, res: Response) {
    try {
      const { resortId } = req.params;

      // Verify resort exists first
      const resort = await prisma.resort.findUnique({ where: { id: resortId } });
      if (!resort) {
        return res.status(404).json({ error: 'Resort not found.' });
      }

      const rates = await prisma.resortRates.findUnique({ where: { resortId } });

      if (!rates) {
        return res.status(200).json(null); // No saved rates yet — not an error
      }

      res.status(200).json(rates);
    } catch (error) {
      console.error('getRates error:', error);
      res.status(500).json({ error: 'Failed to fetch rates.' });
    }
  }

  // PUT /api/rates/:resortId
  // Creates or updates (upserts) saved rates for a resort.
  static async upsertRates(req: AuthenticatedRequest, res: Response) {
    try {
      const { resortId } = req.params;
      const {
        pageTitle,
        bookBefore,
        currency,
        nightColumns,
        villaGroups,
        transferDetails,
        mealPlan,
        inclusions,
        specialBenefits,
        customSections,
      } = req.body;

      // Verify resort exists
      const resort = await prisma.resort.findUnique({ where: { id: resortId } });
      if (!resort) {
        return res.status(404).json({ error: 'Resort not found.' });
      }

      // Basic validation
      if (!pageTitle || typeof pageTitle !== 'string') {
        return res.status(400).json({ error: 'pageTitle is required.' });
      }
      if (!Array.isArray(nightColumns) || nightColumns.length === 0) {
        return res.status(400).json({ error: 'At least one nightColumn is required.' });
      }
      if (!Array.isArray(villaGroups)) {
        return res.status(400).json({ error: 'villaGroups must be an array.' });
      }

      const data = {
        pageTitle:       pageTitle.trim(),
        bookBefore:      bookBefore   || null,
        currency:        currency     || '$',
        nightColumns:    nightColumns as string[],
        villaGroups:     villaGroups  as any,
        transferDetails: Array.isArray(transferDetails) ? transferDetails : [],
        mealPlan:        mealPlan     || null,
        inclusions:      Array.isArray(inclusions)      ? inclusions      : [],
        specialBenefits: Array.isArray(specialBenefits) ? specialBenefits : [],
        customSections:  Array.isArray(customSections)  ? customSections  : [],
      };

      const rates = await prisma.resortRates.upsert({
        where:  { resortId },
        update: data,
        create: { resortId, ...data },
      });

      res.status(200).json(rates);
    } catch (error) {
      console.error('upsertRates error:', error);
      res.status(500).json({ error: 'Failed to save rates.' });
    }
  }
}
