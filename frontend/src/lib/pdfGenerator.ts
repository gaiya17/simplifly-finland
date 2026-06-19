// ─────────────────────────────────────────────────────────────────
// Simplifly Finland – PDF Brochure Generator
// Uses jsPDF + jspdf-autotable for vector-quality PDFs
// ─────────────────────────────────────────────────────────────────
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Brand constants
const NAVY  = [4,  29, 60]  as [number, number, number];
const BLUE  = [26, 132, 255] as [number, number, number];
const LGRAY = [240, 244, 249] as [number, number, number];
const MGRAY = [155, 165, 180] as [number, number, number];
const WHITE = [255, 255, 255] as [number, number, number];
const GREEN = [16, 185, 129] as [number, number, number];
const RED   = [239, 68, 68]  as [number, number, number];

const CONTACT = {
  finland : '+358 40 819 2758',
  srilanka: '+94 76 342 7054',
  emailFI : 'sales@simpliflyfinland.fi',
  emailSL : 'sales@simpliflysrilanka.com',
  emailMV : 'sales@simpliflymaldives.com',
  web     : 'www.simpliflyfinland.fi',
};

// ── Helpers ──────────────────────────────────────────────────────
function setFill(doc: jsPDF, rgb: [number,number,number]){ doc.setFillColor(rgb[0],rgb[1],rgb[2]); }
function setDraw(doc: jsPDF, rgb: [number,number,number]){ doc.setDrawColor(rgb[0],rgb[1],rgb[2]); }
function setTxt (doc: jsPDF, rgb: [number,number,number]){ doc.setTextColor(rgb[0],rgb[1],rgb[2]); }

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

function addPageFooter(doc: jsPDF, pageNum: number, totalPages: number, type: 'resort' | 'tour') {
  const pW = doc.internal.pageSize.getWidth();
  const pH = doc.internal.pageSize.getHeight();
  
  setFill(doc, NAVY); doc.rect(0, pH - 14, pW, 14, 'F');
  setTxt(doc, WHITE);
  doc.setFontSize(7.5); doc.setFont('helvetica','normal');
  const email = type === 'resort' ? CONTACT.emailMV : CONTACT.emailSL;
  doc.text(`${CONTACT.web}  |  ${email}  |  ${CONTACT.finland}`, pW/2, pH - 5.5, { align: 'center' });
  setTxt(doc, MGRAY);
  doc.text(`Page ${pageNum} of ${totalPages}`, pW - 14, pH - 5.5, { align: 'right' });
}

// ── Brand Header bar ─────────────────────────────────────────────
function addHeader(doc: jsPDF, logoBase64: string | null, subtitle: string) {
  const pW = doc.internal.pageSize.getWidth();
  setFill(doc, NAVY); doc.rect(0, 0, pW, 20, 'F');
  // Blue accent line
  setFill(doc, BLUE); doc.rect(0, 20, pW, 1.5, 'F');

  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', 10, 3, 40, 14); } catch { drawTextLogo(doc, 10, 14); }
  } else {
    drawTextLogo(doc, 10, 14);
  }

  setTxt(doc, MGRAY);
  doc.setFontSize(7.5); doc.setFont('helvetica','normal');
  doc.text(subtitle, pW - 14, 9, { align: 'right' });
  doc.setFontSize(7); 
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}`, pW - 14, 15, { align: 'right' });
}

function drawTextLogo(doc: jsPDF, x: number, y: number) {
  doc.setFont('helvetica','bold'); doc.setFontSize(11);
  setTxt(doc, WHITE); doc.text('Simplifly', x, y);
  const w = doc.getTextWidth('Simplifly');
  setTxt(doc, BLUE); doc.text(' Finland', x + w, y);
}

// ═══════════════════════════════════════════════════════════════════
// RESORT BROCHURE
// ═══════════════════════════════════════════════════════════════════
export async function generateResortBrochure(resort: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pW = doc.internal.pageSize.getWidth();
  const pH = doc.internal.pageSize.getHeight();

  // Pre-load images
  const [logoB64, heroB64] = await Promise.all([
    loadImageAsBase64('/simplifly-logo.svg'),
    resort.heroImage ? loadImageAsBase64(resort.heroImage) : Promise.resolve(null)
  ]);

  // ── PAGE 1: COVER ───────────────────────────────────────────────
  // Full-bleed hero image
  if (heroB64) {
    doc.addImage(heroB64, 'JPEG', 0, 0, pW, pH);
  } else {
    setFill(doc, NAVY); doc.rect(0, 0, pW, pH, 'F');
  }

  // Dark overlay panel covering bottom 40% of page for text legibility
  setFill(doc, NAVY); doc.rect(0, pH * 0.55, pW, pH * 0.45, 'F');

  // Logo on cover
  if (logoB64) {
    try { doc.addImage(logoB64, 'PNG', 14, 12, 50, 18); } catch { drawTextLogo(doc, 14, 26); }
  } else { drawTextLogo(doc, 14, 26); }

  // "MALDIVES RESORT" label
  setFill(doc, BLUE); doc.roundedRect(14, pH - 75, 46, 7, 2, 2, 'F');
  doc.setFontSize(7); doc.setFont('helvetica','bold');
  setTxt(doc, WHITE); doc.text('✦  MALDIVES RESORT', 37, pH - 70, { align: 'center' });

  // Resort name
  setTxt(doc, WHITE);
  doc.setFontSize(28); doc.setFont('helvetica','bold');
  const titleLines = doc.splitTextToSize(resort.title, pW - 28);
  doc.text(titleLines, 14, pH - 62);

  // Location + price row
  doc.setFontSize(11); doc.setFont('helvetica','normal');
  setTxt(doc, MGRAY);
  doc.text(`📍 ${resort.location}`, 14, pH - 46);
  setTxt(doc, BLUE);
  doc.setFontSize(16); doc.setFont('helvetica','bold');
  doc.text(`From €${Number(resort.price).toLocaleString()}`, pW - 14, pH - 46, { align: 'right' });

  // Divider
  setFill(doc, BLUE); doc.rect(14, pH - 41, pW - 28, 0.5, 'F');

  // Quick stats bar
  const stats = [
    { label: 'TRANSFER',  val: resort.transfer || 'Seaplane Transfer' },
    { label: 'DURATION',  val: resort.duration || 'Flexible' },
    { label: 'VILLAS',    val: `${resort.villas?.length || 0} Types` },
    { label: 'DINING',    val: `${resort.restaurants?.length || 0} Restaurants` },
  ];
  const sw = (pW - 28) / stats.length;
  stats.forEach((s, i) => {
    const x = 14 + i * sw;
    doc.setFontSize(7); doc.setFont('helvetica','bold');
    setTxt(doc, BLUE); doc.text(s.label, x, pH - 33);
    doc.setFontSize(9); doc.setFont('helvetica','normal');
    setTxt(doc, WHITE); doc.text(s.val, x, pH - 27);
  });

  // Ratings (if available)
  if (resort.tripAdvisorRating) {
    const stars = '★'.repeat(Math.round(resort.tripAdvisorRating)) + '☆'.repeat(5 - Math.round(resort.tripAdvisorRating));
    setTxt(doc, [255, 196, 0]);
    doc.setFontSize(12);
    doc.text(stars, 14, pH - 17);
    setTxt(doc, MGRAY); doc.setFontSize(8);
    doc.text(` TripAdvisor ${resort.tripAdvisorRating}/5 (${resort.tripAdvisorReviews} reviews)`, 14 + doc.getTextWidth(stars) + 2, pH - 17);
  }

  // ── PAGE 2: OVERVIEW ────────────────────────────────────────────
  doc.addPage();
  addHeader(doc, logoB64, 'Resort Overview & Experience');

  let y = 30;
  const col1 = 14, col2 = pW / 2 + 4, colW = pW / 2 - 18;

  // Section: About
  setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  setTxt(doc, NAVY); doc.text('ABOUT THIS RESORT', col1 + 4, y + 4);
  y += 10;

  if (resort.summary) {
    const sumLines = doc.splitTextToSize(resort.summary, pW - 28);
    doc.setFontSize(9.5); doc.setFont('helvetica','normal');
    setTxt(doc, [50, 60, 80]);
    doc.text(sumLines, col1, y);
    y += sumLines.length * 5.5 + 8;
  }

  // Gallery images grid (load first 4)
  const galleryUrls = (resort.gallery || []).slice(0, 4).map((g:any) => g.url || g.src);
  if (galleryUrls.length > 0) {
    const galImages = await Promise.all(galleryUrls.map((u: string) => loadImageAsBase64(u)));
    const gW = (pW - 28 - 6) / 4, gH = 30;
    setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    setTxt(doc, NAVY); doc.text('RESORT GALLERY', col1 + 4, y + 4);
    y += 10;
    galImages.forEach((b64, i) => {
      if (b64) {
        try { doc.addImage(b64, 'JPEG', col1 + i * (gW + 2), y, gW, gH, undefined, 'FAST'); } catch {}
      } else {
        setFill(doc, LGRAY); doc.roundedRect(col1 + i * (gW + 2), y, gW, gH, 2, 2, 'F');
      }
    });
    y += gH + 10;
  }

  // Facilities
  if (resort.facilities?.length > 0) {
    setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    setTxt(doc, NAVY); doc.text('LUXURY FACILITIES', col1 + 4, y + 4);
    y += 10;
    const cols = 3;
    const fW = (pW - 28) / cols;
    resort.facilities.forEach((fac: string, i: number) => {
      const fx = col1 + (i % cols) * fW;
      const fy = y + Math.floor(i / cols) * 7;
      setFill(doc, BLUE); doc.circle(fx + 2, fy - 1.5, 1.2, 'F');
      doc.setFontSize(8.5); doc.setFont('helvetica','normal');
      setTxt(doc, [50, 60, 80]); doc.text(fac, fx + 6, fy);
    });
    y += Math.ceil(resort.facilities.length / cols) * 7 + 8;
  }

  addPageFooter(doc, 2, resort.villas?.length > 0 ? 3 : 2, 'resort');

  // ── PAGE 3+: VILLAS & RESTAURANTS ───────────────────────────────
  if (resort.villas?.length > 0 || resort.restaurants?.length > 0) {
    doc.addPage();
    addHeader(doc, logoB64, 'Villa Accommodations & Dining');
    y = 30;

    // VILLAS
    if (resort.villas?.length > 0) {
      setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
      doc.setFontSize(8); doc.setFont('helvetica','bold');
      setTxt(doc, NAVY); doc.text('VILLA ACCOMMODATIONS', col1 + 4, y + 4);
      y += 10;

      for (const villa of resort.villas) {
        if (y > pH - 50) { doc.addPage(); addHeader(doc, logoB64, 'Villa Accommodations & Dining'); y = 30; }

        // Villa card bg
        setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 28, 2, 2, 'F');
        setFill(doc, NAVY); doc.roundedRect(col1, y, 2, 28, 1, 1, 'F');

        // Load villa image
        const villaImg = villa.images?.[0]?.url;
        if (villaImg) {
          const vImgB64 = await loadImageAsBase64(villaImg);
          if (vImgB64) {
            try { doc.addImage(vImgB64, 'JPEG', col1 + 4, y + 3, 38, 22, undefined, 'FAST'); doc.roundedRect(col1 + 4, y + 3, 38, 22, 1.5, 1.5, 'S'); } catch {}
          }
        }

        const vx = villaImg ? col1 + 46 : col1 + 6;
        const vW = villaImg ? pW - 28 - 36 : pW - 28 - 10;

        doc.setFontSize(10); doc.setFont('helvetica','bold');
        setTxt(doc, NAVY); doc.text(villa.title, vx, y + 8);

        const meta = [villa.size && `📐 ${villa.size}`, villa.bedType && `🛏 ${villa.bedType}`].filter(Boolean).join('   ');
        if (meta) { doc.setFontSize(8); doc.setFont('helvetica','normal'); setTxt(doc, MGRAY); doc.text(meta, vx, y + 14); }

        // Features as pills
        const feats = typeof villa.features === 'string'
          ? villa.features.split(',').map((s:string)=>s.trim()).filter(Boolean)
          : (villa.features || []);
        if (feats.length > 0) {
          let fx = vx, fy = y + 20;
          feats.slice(0, 5).forEach((f: string) => {
            const fW = doc.getTextWidth(f) + 5;
            if (fx + fW > pW - 14) return;
            setFill(doc, BLUE); doc.setFillColor(230, 242, 255); doc.roundedRect(fx, fy - 3.5, fW, 4.5, 1, 1, 'F');
            doc.setFontSize(6.5); doc.setFont('helvetica','normal');
            setTxt(doc, BLUE); doc.text(f, fx + 2.5, fy);
            fx += fW + 2;
          });
        }
        y += 33;
      }
    }

    // RESTAURANTS
    if (resort.restaurants?.length > 0) {
      if (y > pH - 50) { doc.addPage(); addHeader(doc, logoB64, 'Dining Experiences'); y = 30; }
      y += 4;
      setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
      doc.setFontSize(8); doc.setFont('helvetica','bold');
      setTxt(doc, NAVY); doc.text('DINING EXPERIENCES', col1 + 4, y + 4);
      y += 10;

      autoTable(doc, {
        startY: y,
        head: [['Restaurant', 'Description', 'Meal Schedule']],
        body: resort.restaurants.map((r: any) => [
          r.title,
          r.description || '–',
          (r.schedules || []).map((s: any) => `${s.meal}: ${s.time || `${s.timeFrom || ''}–${s.timeTo || ''}`}`).join('\n') || '–'
        ]),
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, textColor: [50, 60, 80], font: 'helvetica' },
        headStyles: { fillColor: NAVY, textColor: WHITE, fontStyle: 'bold', fontSize: 8 },
        alternateRowStyles: { fillColor: LGRAY },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 45 }, 1: { cellWidth: 80 }, 2: { cellWidth: 50 } },
        margin: { left: 14, right: 14 },
      });
    }

    const finalPage = (doc.internal as any).getNumberOfPages();
    for (let p = 3; p <= finalPage; p++) {
      doc.setPage(p);
      addPageFooter(doc, p, finalPage, 'resort');
    }
    // also fix page 2 total
    doc.setPage(2);
    addPageFooter(doc, 2, finalPage, 'resort');
  }

  // Fix cover page footer
  doc.setPage(1);
  const totalPagesF = (doc.internal as any).getNumberOfPages();
  addPageFooter(doc, 1, totalPagesF, 'resort');

  doc.save(`Simplifly-${resort.title.replace(/[^a-z0-9]/gi,'_')}-Brochure.pdf`);
}

// ═══════════════════════════════════════════════════════════════════
// TOUR BROCHURE
// ═══════════════════════════════════════════════════════════════════
export async function generateTourBrochure(tour: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pW = doc.internal.pageSize.getWidth();
  const pH = doc.internal.pageSize.getHeight();

  const [logoB64, heroB64] = await Promise.all([
    loadImageAsBase64('/simplifly-logo.svg'),
    tour.heroImage ? loadImageAsBase64(tour.heroImage) : Promise.resolve(null)
  ]);

  // ── PAGE 1: COVER ───────────────────────────────────────────────
  // Full-bleed hero image
  if (heroB64) {
    doc.addImage(heroB64, 'JPEG', 0, 0, pW, pH);
  } else {
    setFill(doc, NAVY); doc.rect(0, 0, pW, pH, 'F');
  }

  // Dark overlay covering bottom 45% for text legibility
  setFill(doc, NAVY); doc.rect(0, pH * 0.5, pW, pH * 0.5, 'F');

  if (logoB64) {
    try { doc.addImage(logoB64, 'PNG', 14, 12, 50, 18); } catch { drawTextLogo(doc, 14, 26); }
  } else { drawTextLogo(doc, 14, 26); }

  // Category badge
  setFill(doc, GREEN); doc.roundedRect(14, pH - 82, 50, 7, 2, 2, 'F');
  doc.setFontSize(7); doc.setFont('helvetica','bold');
  setTxt(doc, WHITE); doc.text(`✦  ${tour.category?.name?.toUpperCase() || 'SRI LANKA TOUR'}`, 39, pH - 77, { align: 'center' });

  // Tour title
  setTxt(doc, WHITE);
  doc.setFontSize(24); doc.setFont('helvetica','bold');
  const titleLines = doc.splitTextToSize(tour.title, pW - 28);
  doc.text(titleLines, 14, pH - 68);

  const titleH = titleLines.length * 10;

  // Duration badge
  setFill(doc, BLUE);
  doc.roundedRect(14, pH - 68 + titleH - 4, 38, 8, 2, 2, 'F');
  doc.setFontSize(9); doc.setFont('helvetica','bold');
  setTxt(doc, WHITE);
  doc.text(`${tour.nights}N / ${tour.days}D`, 33, pH - 68 + titleH + 1.5, { align: 'center' });

  // Price
  doc.setFontSize(18); doc.setFont('helvetica','bold');
  setTxt(doc, WHITE);
  const priceStr = tour.discount ? `€${Math.round(tour.price * (1 - tour.discount / 100)).toLocaleString()}` : `€${Number(tour.price).toLocaleString()}`;
  doc.text(priceStr, pW - 14, pH - 52, { align: 'right' });
  if (tour.discount) {
    doc.setFontSize(10); doc.setFont('helvetica','normal'); setTxt(doc, MGRAY);
    doc.text(`€${Number(tour.price).toLocaleString()} (${tour.discount}% off)`, pW - 14, pH - 45, { align: 'right' });
  }

  // Destinations strip
  setFill(doc, NAVY); doc.rect(0, pH - 28, pW, 28, 'F');
  const dests: string[] = tour.destinations ? tour.destinations.split(',').map((s:string)=>s.trim()).filter(Boolean) : [];
  if (dests.length > 0) {
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    setTxt(doc, MGRAY); doc.text('DESTINATIONS:', 14, pH - 18);
    setTxt(doc, WHITE);
    const destStr = dests.join('  →  ');
    doc.text(destStr, 14, pH - 11);
  }

  addPageFooter(doc, 1, 3, 'tour');

  // ── PAGE 2: ITINERARY ───────────────────────────────────────────
  doc.addPage();
  addHeader(doc, logoB64, 'Day-by-Day Itinerary');
  let y = 30;
  const col1 = 14;

  // Summary bar
  setFill(doc, NAVY); doc.roundedRect(col1, y, pW - 28, 12, 2, 2, 'F');
  doc.setFontSize(8.5); doc.setFont('helvetica','bold');
  setTxt(doc, WHITE);
  doc.text(tour.title, col1 + 5, y + 7.5);
  setTxt(doc, BLUE);
  doc.text(priceStr, pW - col1 - 4, y + 7.5, { align: 'right' });
  y += 18;

  if (tour.summary) {
    const sumLines = doc.splitTextToSize(tour.summary, pW - 28);
    doc.setFontSize(8.5); doc.setFont('helvetica','normal');
    setTxt(doc, [50, 60, 80]);
    doc.text(sumLines.slice(0,4), col1, y);
    y += Math.min(sumLines.length, 4) * 4.5 + 8;
  }

  // Itinerary section header
  setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
  doc.setFontSize(8); doc.setFont('helvetica','bold');
  setTxt(doc, NAVY); doc.text('DETAILED ITINERARY', col1 + 4, y + 4);
  y += 10;

  // Itinerary days
  const itinerary = tour.itinerary || [];
  for (let i = 0; i < itinerary.length; i++) {
    const day = itinerary[i];
    const dayLabel = day.dayNumberEnd
      ? `DAY ${String(day.dayNumber).padStart(2,'0')}–${String(day.dayNumberEnd).padStart(2,'0')}`
      : `DAY ${String(day.dayNumber).padStart(2,'0')}`;

    const descLines = day.description ? doc.splitTextToSize(day.description, pW - 52) : [];
    const cardH = Math.max(18, 9 + descLines.length * 4.5 + (day.stay ? 5.5 : 0));

    if (y + cardH > pH - 20) { doc.addPage(); addHeader(doc, logoB64, 'Itinerary (continued)'); y = 30; }

    // Timeline dot + line
    setFill(doc, BLUE); doc.circle(col1 + 7, y + 5, 3.5, 'F');
    doc.setFontSize(7.5); doc.setFont('helvetica','bold');
    setTxt(doc, WHITE); doc.text(String(day.dayNumber), col1 + 7, y + 6.2, { align: 'center' });
    if (i < itinerary.length - 1) {
      setDraw(doc, BLUE); doc.setDrawColor(200, 220, 245); doc.setLineWidth(0.5);
      doc.line(col1 + 7, y + 9, col1 + 7, y + cardH + 4);
    }

    // Card
    setFill(doc, LGRAY); doc.roundedRect(col1 + 15, y, pW - col1 - 29, cardH, 2, 2, 'F');

    doc.setFontSize(7); doc.setFont('helvetica','bold');
    setTxt(doc, BLUE); doc.text(dayLabel, col1 + 19, y + 5.5);

    doc.setFontSize(9.5); doc.setFont('helvetica','bold');
    setTxt(doc, NAVY); doc.text(day.title || '', col1 + 19, y + 11);

    if (descLines.length > 0) {
      doc.setFontSize(8); doc.setFont('helvetica','normal');
      setTxt(doc, [80, 90, 110]);
      doc.text(descLines, col1 + 19, y + 16.5);
    }

    if (day.stay || day.mealPlan) {
      const metaY = y + cardH - 3;
      const meta: string[] = [];
      if (day.stay) meta.push(`🏨 ${day.stay}`);
      if (day.mealPlan) meta.push(`🍽 ${day.mealPlan}`);
      doc.setFontSize(7.5); doc.setFont('helvetica','bold');
      setTxt(doc, MGRAY); doc.text(meta.join('   '), col1 + 19, metaY);
    }

    y += cardH + 5;
  }

  if (itinerary.length === 0) {
    setTxt(doc, MGRAY); doc.setFontSize(9);
    doc.text('No itinerary details available.', col1, y);
  }

  addPageFooter(doc, 2, 3, 'tour');

  // ── PAGE 3: INCLUSIONS & GALLERY ────────────────────────────────
  doc.addPage();
  addHeader(doc, logoB64, 'Inclusions & Exclusions');
  y = 30;

  // Inclusions / exclusions
  const included = (tour.inclusions || []).filter((i:any) => i.isIncluded);
  const excluded = (tour.inclusions || []).filter((i:any) => !i.isIncluded);

  const half = (pW - 28 - 6) / 2;

  if (included.length > 0) {
    setFill(doc, [230, 255, 243]); doc.roundedRect(col1, y, half, 6, 1.5, 1.5, 'F');
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    setTxt(doc, GREEN); doc.text('✓  WHAT\'S INCLUDED', col1 + 4, y + 4);
    y += 10;
    included.forEach((inc: any) => {
      setFill(doc, GREEN); doc.circle(col1 + 3, y - 0.5, 1.5, 'F');
      doc.setFontSize(8.5); doc.setFont('helvetica','normal');
      setTxt(doc, [50, 60, 80]);
      doc.text(inc.text, col1 + 8, y);
      y += 6;
    });
  }

  if (excluded.length > 0) {
    const excX = col1 + half + 6;
    let excY = 30;
    setFill(doc, [255, 240, 240]); doc.roundedRect(excX, excY, half, 6, 1.5, 1.5, 'F');
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    setTxt(doc, RED); doc.text('✗  WHAT\'S NOT INCLUDED', excX + 4, excY + 4);
    excY += 10;
    excluded.forEach((exc: any) => {
      setFill(doc, RED); doc.circle(excX + 3, excY - 0.5, 1.5, 'F');
      doc.setFontSize(8.5); doc.setFont('helvetica','normal');
      setTxt(doc, [50, 60, 80]);
      doc.text(exc.text, excX + 8, excY);
      excY += 6;
    });
  }

  y = Math.max(y + 10, 90);

  // Gallery grid
  const galleryItems = (tour.gallery || []).slice(0, 6);
  if (galleryItems.length > 0) {
    setFill(doc, LGRAY); doc.roundedRect(col1, y, pW - 28, 6, 1.5, 1.5, 'F');
    doc.setFontSize(8); doc.setFont('helvetica','bold');
    setTxt(doc, NAVY); doc.text('DESTINATION GALLERY', col1 + 4, y + 4);
    y += 10;

    const galImgs = await Promise.all(galleryItems.map((g:any) => loadImageAsBase64(g.url || g.src)));
    const cols3 = 3, gW3 = (pW - 28 - 4) / cols3, gH3 = 35;
    galImgs.forEach((b64, i) => {
      const gx = col1 + (i % cols3) * (gW3 + 2);
      const gy = y + Math.floor(i / cols3) * (gH3 + 3);
      if (b64) {
        try { doc.addImage(b64, 'JPEG', gx, gy, gW3, gH3, undefined, 'FAST'); } catch {}
      } else {
        setFill(doc, LGRAY); doc.roundedRect(gx, gy, gW3, gH3, 2, 2, 'F');
      }
    });
  }

  // CTA box
  const ctaY = pH - 38;
  setFill(doc, NAVY); doc.roundedRect(col1, ctaY, pW - 28, 20, 3, 3, 'F');
  setFill(doc, BLUE); doc.roundedRect(col1, ctaY, 3, 20, 1.5, 1.5, 'F');
  doc.setFontSize(11); doc.setFont('helvetica','bold');
  setTxt(doc, WHITE); doc.text('Ready to book this journey?', col1 + 8, ctaY + 8);
  doc.setFontSize(8); doc.setFont('helvetica','normal');
  setTxt(doc, MGRAY);
  doc.text(`Email: ${CONTACT.emailSL}  |  Phone: ${CONTACT.srilanka}  |  ${CONTACT.web}`, col1 + 8, ctaY + 14);

  const totalPagesT = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPagesT; p++) {
    doc.setPage(p);
    addPageFooter(doc, p, totalPagesT, 'tour');
  }

  doc.save(`Simplifly-${tour.title.replace(/[^a-z0-9]/gi,'_')}-Brochure.pdf`);
}
