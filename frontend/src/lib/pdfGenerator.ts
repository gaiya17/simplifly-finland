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
const TAGREEN = [0, 175, 135] as [number, number, number];
const BKBLUE  = [0, 53, 128] as [number, number, number];
const GOLD    = [212, 175, 55] as [number, number, number];

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


async function loadFont(doc: jsPDF, url: string, name: string, style: string) {
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    const b64 = await new Promise<string>(resolve => {
      const r = new FileReader();
      r.onloadend = () => resolve((r.result as string).split(',')[1]);
      r.readAsDataURL(blob);
    });
    doc.addFileToVFS(name + '.ttf', b64);
    doc.addFont(name + '.ttf', name, style);
  } catch (e) { console.error("Font load failed", e); }
}

async function loadImageAsBase64(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const blob = await res.blob();
    return new Promise<string>(resolve => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch { return null; }
}

// Measure natural dimensions of a base64 image
function getImageDimensions(b64: string): Promise<{w: number, h: number}> {
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => resolve({ w: img.naturalWidth, h: img.naturalHeight });
    img.onerror = () => resolve({ w: 1, h: 1 });
    img.src = b64;
  });
}

// Draw image cropped to fill a box (object-fit: cover)
async function addCoverImage(
  doc: jsPDF,
  b64: string,
  x: number, y: number, boxW: number, boxH: number
) {
  try {
    const dims = await getImageDimensions(b64);
    const naturalAR = dims.w / dims.h;
    const boxAR     = boxW / boxH;

    let srcX = 0, srcY = 0, srcW = dims.w, srcH = dims.h;
    if (naturalAR > boxAR) {
      // Image wider → crop left/right
      srcW = Math.round(dims.h * boxAR);
      srcX = Math.round((dims.w - srcW) / 2);
    } else {
      // Image taller → crop top/bottom
      srcH = Math.round(dims.w / boxAR);
      srcY = Math.round((dims.h - srcH) / 2);
    }

    // Create a canvas to crop
    const canvas = document.createElement('canvas');
    canvas.width  = srcW;
    canvas.height = srcH;
    const ctx = canvas.getContext('2d')!;
    const img = new Image();
    await new Promise<void>(res => {
      img.onload = () => {
        ctx.drawImage(img, srcX, srcY, srcW, srcH, 0, 0, srcW, srcH);
        res();
      };
      img.onerror = () => res();
      img.src = b64;
    });
    const cropped = canvas.toDataURL('image/jpeg', 0.92);
    doc.addImage(cropped, 'JPEG', x, y, boxW, boxH);
  } catch {
    // Fallback: just add image uncropped
    doc.addImage(b64, 'JPEG', x, y, boxW, boxH);
  }
}

function addPageFooter(doc: jsPDF, pageNum: number, totalPages: number, type: 'resort' | 'tour') {
  const pW = doc.internal.pageSize.getWidth();
  const pH = doc.internal.pageSize.getHeight();
  
  setFill(doc, NAVY); doc.rect(0, pH - 12, pW, 12, 'F');
  setTxt(doc, WHITE);
  doc.setFontSize(7); doc.setFont('Poppins','normal');
  const email = CONTACT.emailFI;
  doc.text(`${CONTACT.web}  |  ${email}  |  ${CONTACT.finland}  |  ${CONTACT.srilanka}`, pW/2, pH - 4.5, { align: 'center' });
  setTxt(doc, MGRAY);
  doc.text(`${pageNum} / ${totalPages}`, pW - 12, pH - 4.5, { align: 'right' });
}

function drawWatermark(doc: jsPDF, birdLogoB64: string | null) {
  if (!birdLogoB64) return;
  const pW = doc.internal.pageSize.getWidth();
  const pH = doc.internal.pageSize.getHeight();
  try {
    doc.setGState(new (doc as any).GState({ opacity: 0.02 }));
    const w = 170;
    const h = 170;
    doc.addImage(birdLogoB64, 'PNG', (pW - w) / 2, (pH - h) / 2, w, h);
    doc.setGState(new (doc as any).GState({ opacity: 1.0 }));
  } catch (e) {
    console.warn("Watermark failed", e);
  }
}

// ── Page header bar (for pages 2+) ───────────────────────────────
function addPageHeader(doc: jsPDF, logoBase64: string | null, subtitle: string) {
  const pW = doc.internal.pageSize.getWidth();
  // Navy header bar
  setFill(doc, NAVY); doc.rect(0, 0, pW, 18, 'F');
  // Blue accent line
  setFill(doc, BLUE); doc.rect(0, 18, pW, 1.2, 'F');

  if (logoBase64) {
    try { doc.addImage(logoBase64, 'PNG', 10, 4.5, 36, 9); } catch { drawTextLogo(doc, 10, 13); }
  } else {
    drawTextLogo(doc, 10, 13);
  }

  setTxt(doc, MGRAY);
  doc.setFontSize(7); doc.setFont('Poppins','normal');
  doc.text(subtitle, pW - 12, 8, { align: 'right' });
  doc.setFontSize(6.5);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'})}`, pW - 12, 14, { align: 'right' });
}

function drawTextLogo(doc: jsPDF, x: number, y: number) {
  doc.setFont('Poppins','bold'); doc.setFontSize(11);
  setTxt(doc, WHITE); doc.text('Simplifly', x, y);
  const w = doc.getTextWidth('Simplifly');
  setTxt(doc, BLUE); doc.text(' Finland', x + w, y);
}

// ── Section header band ───────────────────────────────────────────
function sectionHeader(doc: jsPDF, label: string, x: number, y: number, w: number): number {
  setFill(doc, LGRAY); doc.roundedRect(x, y, w, 7, 1.5, 1.5, 'F');
  setFill(doc, BLUE);  doc.roundedRect(x, y, 3, 7, 1, 1, 'F');
  doc.setFontSize(8); doc.setFont('Poppins','bold');
  setTxt(doc, NAVY); doc.text(label, x + 7, y + 5);
  return y + 11;
}

// ── Check page overflow and add new page if needed ────────────────
function checkNewPage(
  doc: jsPDF,
  y: number,
  neededH: number,
  logoB64: string | null,
  subtitle: string,
  pH: number
): number {
  if (y + neededH > pH - 18) {
    doc.addPage();
    addPageHeader(doc, logoB64, subtitle);
    return 27;
  }
  return y;
}

// ═══════════════════════════════════════════════════════════════════
// RESORT BROCHURE
// ═══════════════════════════════════════════════════════════════════
export async function generateResortBrochure(resort: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pW = doc.internal.pageSize.getWidth();  // 210
  const pH = doc.internal.pageSize.getHeight(); // 297

  // Pre-load images
  const [logoB64, heroB64, taB64, bkB64, birdLogoB64] = await Promise.all([
    loadImageAsBase64('/simplifly-logo-white.png'),
    resort.packageImage
      ? loadImageAsBase64(resort.packageImage)
      : resort.heroImage
        ? loadImageAsBase64(resort.heroImage)
        : Promise.resolve(null),
    loadImageAsBase64('/images/tripadvisor-logo.png'),
    loadImageAsBase64('/images/booking-logo.png'),
    loadImageAsBase64('/images/simplifly-bird-logo-attached.png'),
    loadFont(doc, '/fonts/Poppins-Regular.ttf', 'Poppins', 'normal'),
    loadFont(doc, '/fonts/Poppins-Bold.ttf', 'Poppins', 'bold')
  ]);

  // ══════════════════════════════════════════════════════════════
  // PAGE 1: COVER & ABOUT THIS RESORT
  // ══════════════════════════════════════════════════════════════
  const coverImgH = 130; // Height of the cover image area in mm

  // 1a. Full-width cover image (cropped to fill — object-fit: cover)
  if (heroB64) {
    await addCoverImage(doc, heroB64, 0, 0, pW, coverImgH);
  } else {
    // Fallback gradient-like navy rect
    setFill(doc, NAVY); doc.rect(0, 0, pW, coverImgH, 'F');
  }

  // 1b. Simplifly logo — top-center over the image
  if (logoB64) {
    // Use an aspect ratio that doesn't stretch. Width 40, Height 10 is typical for this logo.
    try { doc.addImage(logoB64, 'PNG', pW/2 - 20, 10, 40, 10); } catch { drawTextLogo(doc, pW/2 - 15, 18); }
  } else {
    drawTextLogo(doc, pW/2 - 15, 18);
  }

  // 1c. Blue separator line below image
  setFill(doc, BLUE); doc.rect(0, coverImgH, pW, 1.5, 'F');

  let y = coverImgH + 18;

  // 1d. "MALDIVES RESORT" pill badge (centered below image)
  const stars = Number(resort.starRating) || 5;
  const badgeText = `MALDIVES RESORT  •  ${stars}-STAR LUXURY`;
  setFill(doc, BLUE); doc.roundedRect(pW/2 - 38, y, 76, 7.5, 2.5, 2.5, 'F');
  doc.setFontSize(7.5); doc.setFont('Poppins','bold');
  setTxt(doc, WHITE); doc.text(badgeText, pW/2, y + 5.2, { align: 'center' });
  
  y += 22; // Excellent breathing room before Title

  // 1e. Resort Name — large, bold, centered
  doc.setFontSize(28); doc.setFont('Poppins','bold');
  setTxt(doc, NAVY);
  const titleLines = doc.splitTextToSize(resort.title, pW - 24);
  const titleLineH = 12; // Large modern line-height
  titleLines.forEach((line: string, i: number) => {
    doc.text(line, pW/2, y + i * titleLineH, { align: 'center' });
  });
  
  // Move y to the baseline of the last line, then add a 9mm gap for the line
  y += (titleLines.length - 1) * titleLineH + 9;

  // Gold accent underline centered
  setFill(doc, GOLD); doc.roundedRect(pW/2 - 14, y, 28, 1.5, 0.5, 0.5, 'F');
  
  y += 18; // Spacious gap before About section

  // 1f. ABOUT THIS RESORT
  const margin = 12;
  const contentW = pW - margin * 2;
  
  y = sectionHeader(doc, 'ABOUT THIS RESORT', margin, y, contentW);
  y += 2; // Extra padding between header and text

  if (resort.summary) {
    doc.setFontSize(9.5); doc.setFont('Poppins','normal');
    const sumLines = doc.splitTextToSize(resort.summary, contentW - 2); 
    setTxt(doc, [80, 90, 110]); // Modern airy gray
    
    const lh = 5.8; // Perfect custom line-height for readability
    sumLines.forEach((line: string, idx: number) => {
      doc.text(line, margin, y + idx * lh);
    });

    y += sumLines.length * lh + 8;
  }

  addPageFooter(doc, 1, 1, 'resort'); // placeholder, updated at end

  // ══════════════════════════════════════════════════════════════
  // PAGE 2: INFO CHIPS
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  addPageHeader(doc, logoB64, 'Resort Details & Facilities');
  y = 27; // Reset to 27 to maximize space for 4 sections

  // ── 1. RESORT DETAILS ────────────────────────────────────────
  y = sectionHeader(doc, 'RESORT DETAILS', margin, y, contentW);
  y += 2; // Extra padding

  const colW3 = (contentW - 6) / 3;
  const chipH = 24; // Compact height
  const chipData = [
    { label: 'LOCATION', val: resort.location || '—' },
    { label: 'TRANSFER METHOD', val: resort.transfer || 'Seaplane Transfer' },
    { label: 'DURATION', val: resort.duration || 'Customizable' },
  ];

  chipData.forEach((chip, i) => {
    const cx = margin + i * (colW3 + 3);
    setFill(doc, WHITE); doc.roundedRect(cx, y, colW3, chipH, 2.5, 2.5, 'F');
    setDraw(doc, [230, 235, 240]); doc.setLineWidth(0.5); doc.roundedRect(cx, y, colW3, chipH, 2.5, 2.5, 'S');
    
    doc.setFontSize(8); doc.setFont('Poppins','bold');
    setTxt(doc, [120, 130, 140]); doc.text(chip.label, cx + 8, y + 8);
    
    doc.setFontSize(10.5); doc.setFont('Poppins','bold');
    setTxt(doc, NAVY);
    const valLines = doc.splitTextToSize(chip.val, colW3 - 16);
    valLines.slice(0, 2).forEach((line: string, li: number) => {
      doc.text(line, cx + 8, y + 15 + li * 5.5);
    });
  });
  y += chipH + 8; // standard gap

  // ── 2. GUEST REVIEWS ─────────────────────────────────────────
  y = sectionHeader(doc, 'GUEST REVIEWS', margin, y, contentW);
  y += 2; // Extra padding

  const reviewColW = (contentW - 5) / 2;
  const reviewH    = 42; // Compact height

  // TripAdvisor card
  const tax = margin;
  // Modern soft tinted background instead of harsh stroke lines
  setFill(doc, [242, 250, 246]); doc.roundedRect(tax, y, reviewColW, reviewH, 3, 3, 'F');
  
  // Floating accent pill
  setFill(doc, TAGREEN); doc.roundedRect(tax, y + 5, 2.5, reviewH - 10, 1.2, 1.2, 'F');

  const tx = tax + 8; // Internal left padding
  if (taB64) { 
    try { 
      const props = doc.getImageProperties(taB64);
      const h = 11; // Greatly increased scale
      const w = h * (props.width / props.height);
      doc.addImage(taB64, 'PNG', tx, y + 4.5, w, h); 
    } catch{} 
  } else { 
    doc.setFontSize(10); doc.setFont('Poppins','bold'); setTxt(doc, TAGREEN); doc.text('TripAdvisor', tx, y + 12); 
  }

  const taRating = Number(resort.tripAdvisorRating || 5);
  const circleR = 2.8; 
  const cy = y + 23; 
  for (let i = 0; i < 5; i++) {
    const cx = tx + i * (circleR * 2 + 2) + circleR;
    if (i < Math.floor(taRating)) {
      setFill(doc, TAGREEN); doc.circle(cx, cy, circleR, 'F');
    } else if (i === Math.floor(taRating) && taRating % 1 !== 0) {
      setFill(doc, [220, 245, 240]); doc.circle(cx, cy, circleR, 'F');
      setFill(doc, TAGREEN); doc.circle(cx, cy, circleR * 0.6, 'F'); 
    } else {
      setFill(doc, [220, 245, 240]); doc.circle(cx, cy, circleR, 'F');
    }
    setDraw(doc, TAGREEN); doc.setLineWidth(0.4); doc.circle(cx, cy, circleR, 'S');
  }

  doc.setFontSize(16); doc.setFont('Poppins','bold');
  setTxt(doc, NAVY); doc.text(`${resort.tripAdvisorRating || '5.0'}`, tx, y + 34);
  const scoreW = doc.getTextWidth(`${resort.tripAdvisorRating || '5.0'}`);
  doc.setFontSize(9); doc.setFont('Poppins','normal');
  setTxt(doc, MGRAY); doc.text('/ 5.0', tx + scoreW + 1, y + 34);
  
  doc.setFontSize(7.5); setTxt(doc, [120, 130, 140]);
  doc.text(`Based on ${resort.tripAdvisorReviews || 0} reviews`, tx, y + 39);

  // Booking.com card
  const bkx = margin + reviewColW + 5;
  // Modern soft tinted background instead of harsh stroke lines
  setFill(doc, [240, 246, 252]); doc.roundedRect(bkx, y, reviewColW, reviewH, 3, 3, 'F');
  
  // Floating accent pill
  setFill(doc, BKBLUE as [number,number,number]); doc.roundedRect(bkx, y + 5, 2.5, reviewH - 10, 1.2, 1.2, 'F');

  const bx = bkx + 8; // Internal left padding
  if (bkB64) { 
    try { 
      const props = doc.getImageProperties(bkB64);
      const h = 7; 
      const w = h * (props.width / props.height);
      doc.addImage(bkB64, 'PNG', bx, y + 6.5, w, h); 
    } catch{} 
  } else { 
    doc.setFontSize(10); doc.setFont('Poppins','bold'); setTxt(doc, BKBLUE as [number,number,number]); doc.text('Booking.com', bx, y + 12); 
  }

  const bkScore = resort.bookingScore || '9.0';
  setFill(doc, BKBLUE as [number,number,number]);
  doc.roundedRect(bx, y + 19.25, 14, 7.5, 1.5, 1.5, 'F');
  doc.setFontSize(9.5); doc.setFont('Poppins','bold');
  setTxt(doc, WHITE); doc.text(`${bkScore}`, bx + 7, y + 24.5, { align: 'center' });

  doc.setFontSize(8.5); doc.setFont('Poppins','bold');
  setTxt(doc, BKBLUE as [number,number,number]); doc.text('SUPERB', bx + 17, y + 24.5);

  doc.setFontSize(16); doc.setFont('Poppins','bold');
  setTxt(doc, NAVY); doc.text(`${bkScore}`, bx, y + 34);
  const bkScoreW = doc.getTextWidth(`${bkScore}`);
  doc.setFontSize(9); doc.setFont('Poppins','normal');
  setTxt(doc, MGRAY); doc.text('/ 10', bx + bkScoreW + 1, y + 34);

  doc.setFontSize(7.5); setTxt(doc, [120, 130, 140]);
  doc.text(`Based on ${resort.bookingReviews || 0} reviews`, bx, y + 39);

  y += reviewH + 8;

  // ── 3. RESORT HIGHLIGHTS ─────────────────────────────────────
  y = sectionHeader(doc, 'RESORT HIGHLIGHTS', margin, y, contentW);
  y += 2; // Extra padding

  const statData = [
    { label: 'VILLA TYPES',     val: `${resort.villas?.length || 0}`,       sub: 'unique accommodations' },
    { label: 'RESTAURANTS',     val: `${resort.restaurants?.length || 0}`,   sub: 'dining experiences' },
    { label: 'STARTING PRICE',  val: `€${Number(resort.price).toLocaleString()}`, sub: 'per night' },
  ];

  const statCardH = 32; 
  statData.forEach((stat, i) => {
    const sx = margin + i * (colW3 + 3);
    setFill(doc, NAVY); doc.roundedRect(sx, y, colW3, statCardH, 2.5, 2.5, 'F');
    const midX = sx + colW3 / 2;
    
    doc.setFontSize(7); doc.setFont('Poppins','bold');
    setTxt(doc, BLUE); doc.text(stat.label, midX, y + 9, { align: 'center' });
    
    doc.setFontSize(18); doc.setFont('Poppins','bold'); 
    setTxt(doc, WHITE); doc.text(stat.val, midX, y + 21, { align: 'center' });
    
    doc.setFontSize(7); doc.setFont('Poppins','normal');
    setTxt(doc, [150, 160, 180]); 
    doc.text(stat.sub, midX, y + 27, { align: 'center' });
  });

  y += statCardH + 8;

  // ── 4. LUXURY FACILITIES ─────────────────────────────────────
  if (resort.facilities?.length > 0) {
    y = sectionHeader(doc, 'LUXURY FACILITIES', margin, y, contentW);
    y += 4; 

    const facCols = 2; // Modern 2-column layout
    const colW = contentW / facCols;
    const rowH = 11.5; // Compact row height
    const facs = Array.isArray(resort.facilities) 
      ? resort.facilities 
      : typeof resort.facilities === 'string'
        ? resort.facilities.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

    doc.setFontSize(9); doc.setFont('Poppins','normal');
    
    facs.forEach((fac: string, i: number) => {
      const col = i % facCols;
      const row = Math.floor(i / facCols);
      
      const fx = margin + col * colW;
      const fy = y + row * rowH;

      if (col === 0) {
        setDraw(doc, [230, 235, 240]); doc.setLineWidth(0.3);
        doc.line(margin, fy, margin + contentW, fy);
      }

      setFill(doc, GOLD); doc.rect(fx + 2, fy + 3.5, 1.5, 4.5, 'F');
      
      setTxt(doc, [70, 80, 100]); 
      const facText = doc.splitTextToSize(fac, colW - 14);
      doc.text(facText[0] || fac, fx + 9, fy + 7);
    });

    const totalRows = Math.ceil(facs.length / facCols);
    const finalY = y + totalRows * rowH;
    setDraw(doc, [230, 235, 240]); doc.setLineWidth(0.3);
    doc.line(margin, finalY, margin + contentW, finalY);

    y = finalY + 8;
  }

  addPageFooter(doc, 2, 1, 'resort'); // placeholder

  // ══════════════════════════════════════════════════════════════
  // PAGE 3: RESORT GALLERY
  // ══════════════════════════════════════════════════════════════
  doc.addPage();
  addPageHeader(doc, logoB64, 'Resort Gallery');
  y = 27;

  y = sectionHeader(doc, 'RESORT GALLERY', margin, y, contentW);
  y += 4;

  const galleryUrls = (resort.gallery || []).map((g: any) => g.url || g.src).filter(Boolean);

  if (galleryUrls.length > 0) {
    const galImages = await Promise.all(galleryUrls.slice(0, 5).map((u: string) => loadImageAsBase64(u)));
    let gy = y;

    // Line 1: Big Hero Image (Index 0)
    if (galImages[0]) {
      const gW = contentW;
      const gH = 100; // MASSIVE Full-page top image
      try {
        await addCoverImage(doc, galImages[0], margin, gy, gW, gH);
        // Magic trick: Thick white stroke masks the sharp image corners!
        setDraw(doc, WHITE); doc.setLineWidth(3); // Thick enough to swallow the tip
        doc.roundedRect(margin, gy, gW, gH, 2.5, 2.5, 'S'); // Radius optimized for math
      } catch {}
      gy += gH + 4;
    }

    // Line 2 & 3: 2 Images per line
    for (let row = 0; row < 2; row++) {
      for (let col = 0; col < 2; col++) {
        const i = 1 + row * 2 + col;
        if (i < galImages.length && galImages[i]) {
          const gW = (contentW - 4) / 2;
          const gH = 65; // MASSIVE sub-images
          const gx = margin + col * (gW + 4);
          const currY = gy + row * (gH + 4);
          try {
            await addCoverImage(doc, galImages[i], gx, currY, gW, gH);
            // Thick white rounded mask over the image
            setDraw(doc, WHITE); doc.setLineWidth(3);
            doc.roundedRect(gx, currY, gW, gH, 2.5, 2.5, 'S');
          } catch {}
        }
      }
    }

    const rowsUsed = Math.ceil((Math.min(galImages.length, 5) - 1) / 2);
    y = gy + (rowsUsed * 69) + 5;
  } else {
    setFill(doc, LGRAY); doc.roundedRect(margin, y, contentW, 25, 2, 2, 'F');
    doc.setFontSize(8); doc.setFont('Poppins','normal');
    setTxt(doc, MGRAY); doc.text('No gallery images available.', pW / 2, y + 15, { align: 'center' });
    y += 30;
  }

  addPageFooter(doc, 3, 1, 'resort'); // placeholder

  // PAGE 4+: VILLA TYPES
  // ══════════════════════════════════════════════════════════════
  if (resort.villas?.length > 0) {
    doc.addPage();
    addPageHeader(doc, logoB64, 'Villa Accommodations');
    y = 27;
    y = sectionHeader(doc, 'VILLA TYPES', margin, y, contentW);

    for (let vi = 0; vi < resort.villas.length; vi++) {
      const villa = resort.villas[vi];
      const villaImgUrl = villa.images?.[0]?.url || villa.images?.[0]?.src;
      let villaImgB64: string | null = null;
      if (villaImgUrl) {
        villaImgB64 = await loadImageAsBase64(villaImgUrl);
      }

      // Estimate card height
      doc.setFontSize(8); doc.setFont('Poppins','normal');
      const descLines = villa.description
        ? doc.splitTextToSize(villa.description, contentW - 75)
        : [];
      const features: string[] = typeof villa.features === 'string'
        ? villa.features.split(',').map((s: string) => s.trim()).filter(Boolean)
        : (villa.features || []);
      const featureCols = 2;
      const featureRows = Math.ceil(features.length / featureCols);
      const cardH = Math.max(60, 14 + descLines.length * 4.5 + featureRows * 6 + 16);

      y = checkNewPage(doc, y, cardH + 8, logoB64, 'Villa Accommodations', pH);

      const imgW = 60, imgH = 45;
      const imgPadding = 7;

      // Card background
      setFill(doc, [250, 252, 255]); doc.roundedRect(margin, y, contentW, cardH, 3, 3, 'F');
        // Elegant dark blue accent line
        setFill(doc, NAVY); doc.roundedRect(margin, y + 6, 2.5, cardH - 12, 1.25, 1.25, 'F');
      
      // Villa image (left column)
      if (villaImgB64) {
        try {
          await addCoverImage(doc, villaImgB64, margin + imgPadding, y + 6, imgW, imgH);
          // Seamless rounded corners perfectly blending with the card's soft blue background
          setDraw(doc, [250, 252, 255]); doc.setLineWidth(3); 
          doc.roundedRect(margin + imgPadding, y + 6, imgW, imgH, 2.5, 2.5, 'S');
        } catch {
          setFill(doc, LGRAY); doc.roundedRect(margin + imgPadding, y + 6, imgW, imgH, 2.5, 2.5, 'F');
        }
      } else {
        setFill(doc, LGRAY); doc.roundedRect(margin + imgPadding, y + 6, imgW, imgH, 2.5, 2.5, 'F');
        doc.setFontSize(7); setTxt(doc, MGRAY);
        doc.text('No Image', margin + imgPadding + imgW / 2, y + 6 + imgH / 2 + 2, { align: 'center' });
      }

      // Right content area
      const rx = margin + imgW + 10;
      const rW  = contentW - imgW - 14;

      // Villa title
      doc.setFontSize(11); doc.setFont('Poppins','bold');
      setTxt(doc, NAVY); doc.text(villa.title || 'Villa', rx, y + 10.5);

      // Meta strip: size | capacity | bed type
      const metaParts = [];
      if (villa.size)     metaParts.push(`Size: ${villa.size.toString().replace(/sqm/i,'').trim()} sqm`);
      if (villa.capacity) {
        const capStr = villa.capacity.split('|').map((combo: string) =>
          combo.split(',').map((s: string) => s.trim()).filter((s: string) => !s.startsWith('0 ')).join(' & ')
        ).filter(Boolean).join(' or ');
        metaParts.push(`Cap: ${capStr}`);
      }
      if (villa.bedType)  metaParts.push(`Bed: ${villa.bedType}`);

      let innerY = y + 15;
        if (metaParts.length > 0) {
          doc.setFontSize(7.5); doc.setFont('Poppins','normal');
          
          // Join the meta parts
          const fullMetaStr = metaParts.join('   •   ');
          // Dynamically split into lines based on the box width
          const lines = doc.splitTextToSize(fullMetaStr, rW - 10);
          
          // Calculate dynamic height: 4.5 per line + 3px padding
          const boxH = lines.length * 4.5 + 3;
          
          setFill(doc, [238, 245, 252]); doc.roundedRect(rx, y + 14.5, rW, boxH, 1.5, 1.5, 'F');
          setTxt(doc, NAVY);
          
          // Render the text array centered, using middle baseline to perfectly center vertically inside the box
          doc.text(lines, rx + rW / 2, y + 14.5 + (boxH / 2) + 0.5, { align: 'center', baseline: 'middle' });
          
          // Push down the description starting point dynamically
          innerY = y + 14.5 + boxH + 5;
        }

        // Description
        if (descLines.length > 0) {
        setTxt(doc, [70, 80, 100]);
        doc.text(descLines.slice(0, 4), rx, innerY);
        innerY += Math.min(descLines.length, 4) * 4.5 + 5;
      }

      // Feature tags (2-column)
      if (features.length > 0) {
        features.slice(0, 8).forEach((f: string, fi: number) => {
          const fcol = fi % featureCols;
          const frow = Math.floor(fi / featureCols);
          const fx2  = rx + fcol * (rW / featureCols);
          const fy2  = innerY + frow * 6.5;
          
          // Elegant vertical gold accent bar
          setFill(doc, GOLD); doc.rect(fx2, fy2 - 2.5, 1.2, 3.5, 'F');
          doc.setFontSize(7.5); doc.setFont('Poppins','normal');
          setTxt(doc, [60, 70, 90]); doc.text(f, fx2 + 4, fy2);
        });
      }

      // Divider between villas
      if (vi < resort.villas.length - 1) {
        setFill(doc, LGRAY); doc.rect(margin, y + cardH + 3, contentW, 0.4, 'F');
      }

      y += cardH + 7;
    }

    addPageFooter(doc, (doc.internal as any).getNumberOfPages(), 1, 'resort');
  }

  // ══════════════════════════════════════════════════════════════
  // PAGE 5+: RESTAURANT TYPES
  // ══════════════════════════════════════════════════════════════
  if (resort.restaurants?.length > 0) {
    doc.addPage();
    addPageHeader(doc, logoB64, 'Dining Experiences');
    y = 27;
    y = sectionHeader(doc, 'RESTAURANT TYPES', margin, y, contentW);

    for (let ri = 0; ri < resort.restaurants.length; ri++) {
      const r = resort.restaurants[ri];
      const restImgUrl = r.image || resort.gallery?.[ri % (resort.gallery?.length || 1)]?.url;
      let restImgB64: string | null = null;
      if (restImgUrl) {
        restImgB64 = await loadImageAsBase64(restImgUrl);
      }

      doc.setFontSize(8); doc.setFont('Poppins','normal');
      const descLines = r.description
        ? doc.splitTextToSize(r.description, contentW - 75)
        : [];
      const schedules = r.schedules || [];
      const cardH = Math.max(55, 14 + descLines.length * 4.5 + schedules.length * 6 + 10);

      y = checkNewPage(doc, y, cardH + 8, logoB64, 'Dining Experiences', pH);

      // Card background
      setFill(doc, [250, 252, 255]); doc.roundedRect(margin, y, contentW, cardH, 3, 3, 'F');
      setFill(doc, [16, 185, 129]); doc.roundedRect(margin, y, 2.5, cardH, 1.5, 1.5, 'F');

      // Restaurant image (left)
      const imgW = 60, imgH = 45;
      if (restImgB64) {
        try {
          await addCoverImage(doc, restImgB64, margin + 5, y + 5, imgW, imgH);
          setDraw(doc, LGRAY); doc.setLineWidth(0.3); doc.roundedRect(margin + 5, y + 5, imgW, imgH, 2, 2, 'S');
        } catch {
          setFill(doc, LGRAY); doc.roundedRect(margin + 5, y + 5, imgW, imgH, 2, 2, 'F');
        }
      } else {
        setFill(doc, LGRAY); doc.roundedRect(margin + 5, y + 5, imgW, imgH, 2, 2, 'F');
      }

      // Right content
      const rx = margin + imgW + 10;
      const rW  = contentW - imgW - 14;

      // Restaurant title
      doc.setFontSize(11); doc.setFont('Poppins','bold');
      setTxt(doc, NAVY); doc.text(r.title || 'Restaurant', rx, y + 10);

      // Description
      let innerY = y + 16;
      if (descLines.length > 0) {
        doc.setFontSize(8); doc.setFont('Poppins','normal');
        setTxt(doc, [70, 80, 100]);
        doc.text(descLines.slice(0, 3), rx, innerY);
        innerY += Math.min(descLines.length, 3) * 4.5 + 5;
      }

      // Meal schedule
      if (schedules.length > 0) {
        doc.setFontSize(7); doc.setFont('Poppins','bold');
        setTxt(doc, [0, 0, 0]); doc.text('MEAL SCHEDULE', rx, innerY);
        innerY += 5;

        schedules.forEach((s: any, si: number) => {
          const mealTime = s.time || (s.timeFrom && s.timeTo ? `${s.timeFrom} – ${s.timeTo}` : '');
          const mealLabel = s.meal || '';

          // Dotted row
          doc.setFontSize(8); doc.setFont('Poppins','normal');
            setTxt(doc, [0, 0, 0]); doc.text(mealLabel, rx, innerY + si * 6);

          doc.setFont('Poppins','normal');
            setTxt(doc, [0, 0, 0]); doc.text(mealTime, rx + rW, innerY + si * 6, { align: 'right' });

          // Dotted rule
          setDraw(doc, [210, 218, 230]);
          doc.setLineWidth(0.3);
          const dotStart = rx + doc.getTextWidth(mealLabel) + 3;
          const dotEnd   = rx + rW - doc.getTextWidth(mealTime) - 3;
          if (dotEnd > dotStart + 5) {
            doc.setLineDashPattern([0.5, 1.5], 0);
            doc.line(dotStart, innerY - 0.8 + si * 6, dotEnd, innerY - 0.8 + si * 6);
            doc.setLineDashPattern([], 0);
          }
        });
      }

      // Divider between restaurants
      if (ri < resort.restaurants.length - 1) {
        setFill(doc, LGRAY); doc.rect(margin, y + cardH + 3, contentW, 0.4, 'F');
      }

      y += cardH + 7;
    }

    addPageFooter(doc, (doc.internal as any).getNumberOfPages(), 1, 'resort');
  }

  // ── Fix all page footers with correct total ───────────────────
  const totalPages = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    if (p > 1) {
      drawWatermark(doc, birdLogoB64);
    }
    addPageFooter(doc, p, totalPages, 'resort');
  }

  doc.save(`Simplifly-${resort.title.replace(/[^a-z0-9]/gi,'_')}-Brochure.pdf`);
}

// ═══════════════════════════════════════════════════════════════════
// TOUR BROCHURE
// ═══════════════════════════════════════════════════════════════════
export async function generateTourBrochure(tour: any) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pW = doc.internal.pageSize.getWidth();
  const pH = doc.internal.pageSize.getHeight();
  const margin = 14;
  const contentW = pW - 28;

  // Pre-load images & fonts
  const [colorLogoB64, whiteLogoB64, heroB64, birdLogoB64, fontReg, fontBold] = await Promise.all([
    loadImageAsBase64('/simplifly-logo-color.png'),
    loadImageAsBase64('/simplifly-logo-white.png'),
    tour.packageImage ? loadImageAsBase64(tour.packageImage) : (tour.heroImage ? loadImageAsBase64(tour.heroImage) : Promise.resolve(null)),
    loadImageAsBase64('/images/simplifly-bird-logo-attached.png'),
    loadFont(doc, '/fonts/Poppins-Regular.ttf', 'Poppins', 'normal'),
    loadFont(doc, '/fonts/Poppins-Bold.ttf', 'Poppins', 'bold')
  ]);

  const colorLogo = colorLogoB64 || whiteLogoB64;

  // ── PAGE 1: COVER & OVERVIEW ───────────────────────────────────────────────
  setFill(doc, [255, 255, 255]); doc.rect(0, 0, pW, pH, 'F');

  const coverImgH = 130; 
  if (heroB64) {
    await addCoverImage(doc, heroB64, 0, 0, pW, coverImgH);
  } else {
    setFill(doc, NAVY); doc.rect(0, 0, pW, coverImgH, 'F');
  }

  // Logo in Center on top of cover image (Reduced to original aspect ratio scale)
  if (colorLogo) {
    try { 
      const lW = 45; const lH = 12; // Adjusted smaller and proportionate
      doc.addImage(colorLogo, 'PNG', pW/2 - lW/2, 14, lW, lH); 
    } catch { drawTextLogo(doc, pW/2 - 25, 24); }
  } else { drawTextLogo(doc, pW/2 - 25, 24); }

  setFill(doc, BLUE); doc.rect(0, coverImgH, pW, 1.5, 'F');

  let y = coverImgH + 15;

  setFill(doc, GREEN); doc.roundedRect(pW/2 - 25, y, 50, 6.5, 2, 2, 'F');
  doc.setFontSize(7); doc.setFont('Poppins','bold');
  setTxt(doc, WHITE); doc.text(`✦  ${tour.category?.name?.toUpperCase() || 'SRI LANKA TOUR'}`, pW/2, y + 4.5, { align: 'center' });
  y += 16;

  setTxt(doc, NAVY);
  doc.setFontSize(30); doc.setFont('Poppins','bold');
  const titleLines = doc.splitTextToSize(tour.title, contentW - 10);
  doc.text(titleLines, pW/2, y, { align: 'center' });
  y += titleLines.length * 12 + 10;

  // Tour Overview on Page 1
  if (tour.summary) {
    y = sectionHeader(doc, 'TOUR OVERVIEW', margin, y, contentW);
    doc.setFontSize(9.5); doc.setFont('Poppins','normal');
    const sumLines = doc.splitTextToSize(tour.summary, contentW);
    setTxt(doc, [70, 80, 100]);
    doc.text(sumLines, margin, y);
    y += sumLines.length * 5 + 8;
  }

  // ── PAGE 2: STATS & DESTINATIONS ───────────────────────────────────────────
  doc.addPage();
  addPageHeader(doc, colorLogo, 'Highlights & Destinations');
  y = 27;

  // Stats Split Box
  y = sectionHeader(doc, 'TOUR DETAILS', margin, y, contentW);
  setFill(doc, [245, 248, 252]); doc.roundedRect(margin, y, contentW, 26, 3, 3, 'F');
  setDraw(doc, [220, 230, 240]); doc.setLineWidth(0.3);
  doc.line(pW/2, y + 4, pW/2, y + 22);

  doc.setFontSize(8); doc.setFont('Poppins','bold'); setTxt(doc, MGRAY);
  doc.text('DURATION', pW/4 + 7, y + 10, { align: 'center' });
  doc.setFontSize(14); doc.setFont('Poppins','bold'); setTxt(doc, NAVY);
  doc.text(`${tour.nights} Nights / ${tour.days} Days`, pW/4 + 7, y + 18, { align: 'center' });

  doc.setFontSize(8); doc.setFont('Poppins','bold'); setTxt(doc, MGRAY);
  doc.text('STARTING FROM', (pW*3)/4 - 7, y + 10, { align: 'center' });
  doc.setFontSize(14); doc.setFont('Poppins','bold'); setTxt(doc, NAVY);
  const priceStr = tour.discount ? `€${Math.round(tour.price * (1 - tour.discount / 100)).toLocaleString()}` : `€${Number(tour.price).toLocaleString()}`;
  doc.text(`${priceStr} / person`, (pW*3)/4 - 7, y + 18, { align: 'center' });
  y += 38;

  // Destinations: 3-Column Modern Pill Badge Layout
  if (tour.destinations) {
    let rawStr = tour.destinations;
    const items = rawStr.split(/[!,'’→]+/).map((s: string) => {
      let cln = s.trim();
      if (cln.match(/^(?:[A-Za-z]\s)+[A-Za-z]$/)) {
        cln = cln.replace(/\s/g, '');
      }
      return cln;
    }).filter(Boolean);

    if (items.length > 0) {
      y = sectionHeader(doc, 'DESTINATIONS COVERED', margin, y, contentW);
      y += 2; // small padding before pills

      doc.setFontSize(8); doc.setFont('Poppins','normal');
      
      const cols = 3;
      const colW = contentW / cols;
      const pillHeight = 8;
      const pillMarginY = 5;
      const pillPaddingX = 4;
      
      items.forEach((dest: string, i: number) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const currentX = margin + col * colW;
        const currentY = y + row * (pillHeight + pillMarginY);
        
        const pillWidth = colW - 5; // Leave 5mm gap between columns

        setFill(doc, [240, 246, 252]); 
        doc.roundedRect(currentX, currentY, pillWidth, pillHeight, 2, 2, 'F');
        setDraw(doc, [210, 225, 240]); doc.setLineWidth(0.2);
        doc.roundedRect(currentX, currentY, pillWidth, pillHeight, 2, 2, 'S');
        
        // Truncate text if it's too long for the 3-column pill
        setTxt(doc, [40, 60, 90]);
        let txt = dest;
        while(doc.getTextWidth(txt) > pillWidth - (pillPaddingX * 2) && txt.length > 3) {
           txt = txt.substring(0, txt.length - 2) + '…';
        }
        
        // Center text within the pill
        doc.text(txt, currentX + (pillWidth/2), currentY + 5.5, { align: 'center' });
      });
      
      y += Math.ceil(items.length / cols) * (pillHeight + pillMarginY) + 8;
    }
  }

  // ── PAGE 3: DESTINATION GALLERY ──────────────────────────────────
  doc.addPage();
  addPageHeader(doc, colorLogo, 'Destination Gallery');
  y = 27;

  // Custom Gallery layout (1, 2, 2)
  const galleryItems = (tour.gallery || []).slice(0, 5); // Max 5 images
  if (galleryItems.length > 0) {
    y = sectionHeader(doc, 'TOUR GALLERY', margin, y, contentW);
    
    const galImgs = await Promise.all(galleryItems.map((g:any) => loadImageAsBase64(g.url || g.src)));
    const gap = 4; // 4mm gap between images

    // Line 1: Big Image (Full width)
    if (galImgs[0]) {
      const h1 = contentW * (9/21); // Aspect ratio for large cover image
      try { 
        await addCoverImage(doc, galImgs[0], margin, y, contentW, h1); 
        setDraw(doc, WHITE); doc.setLineWidth(2.5); doc.roundedRect(margin, y, contentW, h1, 3, 3, 'S');
      } catch {}
      y += h1 + gap;
    }

    // Line 2: Two Images (50% each)
    if (galImgs[1] || galImgs[2]) {
      const w2 = (contentW - gap) / 2;
      const h2 = w2 * (2/3); // Standard 3:2 ratio
      if (galImgs[1]) try { 
        await addCoverImage(doc, galImgs[1], margin, y, w2, h2); 
        setDraw(doc, WHITE); doc.setLineWidth(2.5); doc.roundedRect(margin, y, w2, h2, 3, 3, 'S');
      } catch {}
      if (galImgs[2]) try { 
        await addCoverImage(doc, galImgs[2], margin + w2 + gap, y, w2, h2); 
        setDraw(doc, WHITE); doc.setLineWidth(2.5); doc.roundedRect(margin + w2 + gap, y, w2, h2, 3, 3, 'S');
      } catch {}
      y += h2 + gap;
    }

    // Line 3: Two Images (50% each)
    if (galImgs[3] || galImgs[4]) {
      const w2 = (contentW - gap) / 2;
      const h2 = w2 * (2/3); 
      if (galImgs[3]) try { 
        await addCoverImage(doc, galImgs[3], margin, y, w2, h2); 
        setDraw(doc, WHITE); doc.setLineWidth(2.5); doc.roundedRect(margin, y, w2, h2, 3, 3, 'S');
      } catch {}
      if (galImgs[4]) try { 
        await addCoverImage(doc, galImgs[4], margin + w2 + gap, y, w2, h2); 
        setDraw(doc, WHITE); doc.setLineWidth(2.5); doc.roundedRect(margin + w2 + gap, y, w2, h2, 3, 3, 'S');
      } catch {}
      y += h2 + gap;
    }
  }

  // ── PAGE 4: DETAILED ITINERARY ──────────────────────────────────
  doc.addPage();
  addPageHeader(doc, colorLogo, 'Detailed Itinerary');
  y = 27;

  y = sectionHeader(doc, 'DETAILED ITINERARY', margin, y, contentW);

  const itinerary = tour.itinerary || [];
  for (let i = 0; i < itinerary.length; i++) {
    const day = itinerary[i];
    const dayLabel = day.dayNumberEnd
      ? `DAY ${String(day.dayNumber).padStart(2,'0')}–${String(day.dayNumberEnd).padStart(2,'0')}`
      : `DAY ${String(day.dayNumber).padStart(2,'0')}`;

    doc.setFontSize(8.5); doc.setFont('Poppins','normal');
    
    let descLines: string[] = [];
    if (day.description) {
      let cleanText = day.description.replace(/<br\s*\/?>/gi, '\n').replace(/<\/p>/gi, '\n\n').replace(/<[^>]*>?/gm, '');
      const rawLines = cleanText.split(/\r?\n/);
      rawLines.forEach((line: string) => {
        if (line.trim() === '') {
          descLines.push('');
        } else {
          descLines.push(...doc.splitTextToSize(line.trim(), pW - 52));
        }
      });
    }
    
    let metaLines: string[] = [];
    let metaH = 0;
    let metaW = 0;
    if (day.stay || day.mealPlan) {
      const meta = [];
      if (day.stay) meta.push(`🛌 ${day.stay}`);
      if (day.mealPlan) meta.push(`🍽️ ${day.mealPlan}`);
      metaLines = doc.splitTextToSize(meta.join('   •   '), pW - margin - 49);
      metaH = metaLines.length * 4.5 + 1; // reduced padding for tighter box
      doc.setFontSize(7.5); doc.setFont('Poppins','normal');
      metaLines.forEach((l: string) => {
        const w = doc.getTextWidth(l);
        if (w > metaW) metaW = w;
      });
    }
    
    let currentLineIndex = 0;
    let isFirstChunk = true;
    const cardX = margin + 15;
    const cardW = pW - margin - 29;

    while (currentLineIndex < descLines.length || isFirstChunk) {
      let availableH = (pH - 20) - y;
      if (availableH < 35) {
        y = checkNewPage(doc, y, 999, colorLogo, 'Detailed Itinerary (continued)', pH);
        availableH = (pH - 20) - y;
      }

      let headerH = isFirstChunk ? 17 : 0; 
      let remainingDescH = (descLines.length - currentLineIndex) * 4.5;
      let totalNeeded = headerH + remainingDescH + (metaH > 0 ? metaH + 8 : 0) + 10;
      
      let footerH = 0;
      let linesThatFit = 0;

      if (totalNeeded <= availableH) {
         linesThatFit = descLines.length - currentLineIndex;
         footerH = metaH > 0 ? metaH + 8 : 0;
      } else {
         linesThatFit = Math.floor((availableH - headerH - 10) / 4.5);
         if (linesThatFit >= descLines.length - currentLineIndex) {
             linesThatFit = descLines.length - currentLineIndex - 1; 
         }
         
         if (linesThatFit <= 0 && currentLineIndex < descLines.length) {
            y = checkNewPage(doc, y, 999, colorLogo, 'Detailed Itinerary (continued)', pH);
            availableH = (pH - 20) - y;
            totalNeeded = headerH + remainingDescH + (metaH > 0 ? metaH + 8 : 0) + 10;
            if (totalNeeded <= availableH) {
               linesThatFit = descLines.length - currentLineIndex;
               footerH = metaH > 0 ? metaH + 8 : 0;
            } else {
               linesThatFit = Math.floor((availableH - headerH - 10) / 4.5);
               if (linesThatFit >= descLines.length - currentLineIndex) {
                   linesThatFit = descLines.length - currentLineIndex - 1; 
               }
            }
         }
      }

      if (linesThatFit === 0 && currentLineIndex >= descLines.length) {
         footerH = metaH > 0 ? metaH + 8 : 0;
      }

      let linesToDraw = descLines.slice(currentLineIndex, currentLineIndex + linesThatFit);
      let chunkDescH = linesToDraw.length * 4.5;
      
      let chunkH = headerH + chunkDescH + footerH + (isFirstChunk ? 5 : 5);
      if (chunkH < 22 && isFirstChunk && linesThatFit >= (descLines.length - currentLineIndex)) {
         chunkH = 22; 
      }

      if (i < itinerary.length - 1 || !isFirstChunk || currentLineIndex + linesThatFit < descLines.length) {
        setDraw(doc, BLUE); doc.setDrawColor(210, 225, 245); doc.setLineWidth(0.6);
        let lineStartY = isFirstChunk ? y + 10 : y;
        let lineEndY = y + chunkH + 5; 
        doc.line(margin + 7, lineStartY, margin + 7, lineEndY);
      }

      if (isFirstChunk) {
        setFill(doc, BLUE); doc.circle(margin + 7, y + 6, 3.5, 'F');
        doc.setFontSize(7.5); doc.setFont('Poppins','bold');
        setTxt(doc, WHITE); doc.text(String(day.dayNumber), margin + 7, y + 7.2, { align: 'center' });
      }

      setFill(doc, [250, 252, 255]); doc.roundedRect(cardX, y, cardW, chunkH, 3, 3, 'F');
      setFill(doc, NAVY); doc.roundedRect(cardX, y + (isFirstChunk ? 6 : 0), 2.5, chunkH - (isFirstChunk ? 12 : 0), 1.25, 1.25, 'F');

      let textY = y;

      if (isFirstChunk) {
        doc.setFontSize(7); doc.setFont('Poppins','bold');
        setTxt(doc, BLUE); doc.text(dayLabel, margin + 22, y + 6.5);

        doc.setFontSize(10); doc.setFont('Poppins','bold');
        setTxt(doc, NAVY); doc.text(day.title || '', margin + 22, y + 12);
        textY += 17.5;
      } else {
        textY += 5;
      }

      if (linesToDraw.length > 0) {
        doc.setFontSize(8.5); doc.setFont('Poppins','normal');
        setTxt(doc, [70, 80, 100]);
        doc.text(linesToDraw, margin + 22, textY);
      }

      currentLineIndex += linesThatFit;
      if (currentLineIndex >= descLines.length) {
        if (metaLines.length > 0) {
          const metaBoxY = y + chunkH - metaH - 4;
          const metaBoxW = metaW + 12; // tighter box around text
          setFill(doc, [238, 245, 252]); doc.roundedRect(margin + 20, metaBoxY, metaBoxW, metaH, 1.5, 1.5, 'F');
          doc.setFontSize(7.5); doc.setFont('Poppins','normal');
          setTxt(doc, NAVY);
          doc.text(metaLines, margin + 20 + metaBoxW / 2, metaBoxY + (metaH / 2) + 0.5, { align: 'center', baseline: 'middle' });
        }
        y += chunkH + 6;
        break; 
      } else {
        y += chunkH + 2; 
        isFirstChunk = false;
      }
    }
  }

  if (itinerary.length === 0) {
    setFill(doc, LGRAY); doc.roundedRect(margin, y, contentW, 25, 2, 2, 'F');
    setTxt(doc, MGRAY); doc.setFontSize(8.5);
    doc.text('No itinerary details available.', pW/2, y + 14, { align: 'center' });
  }

  // ── PAGE 5: INCLUSIONS & TIPS ────────────────────────────────
  doc.addPage();
  addPageHeader(doc, colorLogo, 'Important Details');
  y = 35; // Start a bit lower

  const DEFAULT_INCLUDED = [
    "All transportation and guided excursions as per the program, including entrance fees",
    "Flight taxes, tourist taxes, and all mandatory government fees",
    "Tips for local guides and bus drivers included",
    "Experienced English-speaking tour guide for added comfort and clear communication",
    "Optional late check-out: on additional charge"
  ];
  
  const DEFAULT_NOT_INCLUDED = [
    "International Flights Charges to Sri Lanka",
    "No meals are included unless specifically stated in the tour itinerary.",
    "Alcoholic and soft drinks (available to purchase)",
    "Tips & porterage.",
    "VISA Fee"
  ];
  
  const DEFAULT_INSIGHTFUL_TIPS = [
    "Climate: Warm tropical weather year-round, approx. 25 - 30°C during the day; brief afternoon showers possible",
    "Clothing: Light summer wear recommended; bring a light jacket for air-conditioned spaces",
    "Footwear: Comfortable shoes for sightseeing; sandals ideal for temple visits",
    "Essentials: Swimwear, sunglasses, sunscreen, and mosquito repellent",
    "Travel Comfort: Some longer bus journeys - choose loose, breathable clothing",
    "Temple Dress Code: Shoulders and knees covered; shoes removed; temple socks useful",
    "Evenings: Casual but neat attire recommended in hotels",
    "Wellness & Activities: Hotel spas offer massages and treatments (extra charge); yoga and water sports available",
    "Health Info: No antimalarial medication needed; protect against daytime mosquitoes due to dengue risk",
    "Sri Lanka Electronic Travel Authorization (eTA) (Link : https://eta.gov.lk/slvisa/)"
  ];
  
  const TERMS_AND_CONDITIONS = [
    { title: '1. Booking & Confirmation', body: 'All bookings are subject to availability. A booking is confirmed only upon receipt of the specified deposit. We reserve the right to decline any booking at our discretion.' },
    { title: '2. Passport & Visas', body: "It is the traveler's responsibility to ensure that their passport is valid for at least 6 months from the date of entry into Sri Lanka. Appropriate tourist visas must be obtained prior to arrival or via ETA." },
    { title: '3. Insurance', body: 'We strongly recommend that all travelers purchase comprehensive travel insurance covering trip cancellation, medical emergencies, and baggage loss.' },
    { title: '4. Alterations to Itinerary', body: 'While every effort is made to adhere to the planned itinerary, we reserve the right to modify routes, accommodations, or activities due to unforeseen circumstances, ensuring the alternative is of a similar standard.' },
  ];
  
  const PAYMENT_SCHEDULE = [
    '30% deposit required at the time of booking to secure your reservation.',
    'Remaining 70% balance must be paid at least 30 days prior to your arrival.',
    'For bookings made within 30 days of arrival, full payment is required immediately.',
  ];
  
  const CANCELLATION_TERMS = [
    { period: '31+ days before arrival', charge: 'Full Refund (minus processing fees)' },
    { period: '15 – 30 days before arrival', charge: '50% Cancellation Fee' },
    { period: '14 days or less / No Shows', charge: '100% No Refund' },
  ];

  const half = (contentW - 6) / 2;
  const incMaxY = [y, y];

  let incY = sectionHeader(doc, 'WHAT\'S INCLUDED', margin, y, half);
  incY += 3; // spacing after header
  DEFAULT_INCLUDED.forEach((inc: any) => {
    setFill(doc, GREEN); doc.circle(margin + 3, incY - 1, 1.4, 'F');
    doc.setFontSize(8.5); doc.setFont('Poppins','normal'); setTxt(doc, [50, 60, 80]);
    const txtLines = doc.splitTextToSize(inc, half - 8);
    doc.text(txtLines, margin + 7, incY);
    incY += txtLines.length * 5.5 + 4; // increased line height and gap
  });
  incMaxY[0] = incY;

  const excX = margin + half + 6;
  let excY = sectionHeader(doc, 'WHAT\'S NOT INCLUDED', excX, y, half);
  excY += 3;
  DEFAULT_NOT_INCLUDED.forEach((exc: any) => {
    setFill(doc, RED); doc.circle(excX + 3, excY - 1, 1.4, 'F');
    doc.setFontSize(8.5); doc.setFont('Poppins','normal'); setTxt(doc, [50, 60, 80]);
    const txtLines = doc.splitTextToSize(exc, half - 8);
    doc.text(txtLines, excX + 7, excY);
    excY += txtLines.length * 5.5 + 4;
  });
  incMaxY[1] = excY;

  // Push Tips box further down to distribute space
  y = Math.max(incMaxY[0], incMaxY[1]) + 15; 

  y = sectionHeader(doc, 'INSIGHTFUL TIPS', margin, y, contentW);
  y += 3;
  doc.setFontSize(8.5); doc.setFont('Poppins','normal'); setTxt(doc, [50, 60, 80]);
  
  let tipsH = 0;
  DEFAULT_INSIGHTFUL_TIPS.forEach((tip: string) => {
    const txtLines = doc.splitTextToSize(tip, contentW - 14);
    tipsH += txtLines.length * 5 + 3.5; // wider spacing
  });

  // Check if we need to stretch to bottom
  const availableTipsSpace = (pH - 25) - y;
  if (tipsH < availableTipsSpace - 20) {
     tipsH = availableTipsSpace - 10; // stretch box to fill bottom nicely
  }

  setFill(doc, [254, 252, 245]); doc.roundedRect(margin, y, contentW, tipsH + 6, 2, 2, 'F');
  setDraw(doc, GOLD); doc.setLineWidth(0.3); doc.roundedRect(margin, y, contentW, tipsH + 6, 2, 2, 'S');

  y += 6;
  // Recalculate dynamic spacing inside the box if we stretched it
  let tipGap = 3.5;
  let tipLineH = 5;
  if (tipsH > availableTipsSpace - 20) {
     let totalLines = 0;
     DEFAULT_INSIGHTFUL_TIPS.forEach(tip => totalLines += doc.splitTextToSize(tip, contentW - 14).length);
     let leftover = tipsH - (totalLines * tipLineH);
     tipGap = leftover / DEFAULT_INSIGHTFUL_TIPS.length;
  }

  DEFAULT_INSIGHTFUL_TIPS.forEach((tip: string) => {
    setFill(doc, GOLD); doc.circle(margin + 5, y + 2, 1.2, 'F');
    const txtLines = doc.splitTextToSize(tip, contentW - 14);
    doc.text(txtLines, margin + 9, y + 3);
    y += txtLines.length * tipLineH + tipGap;
  });

  // ── PAGE 6: TERMS & POLICIES ────────────────────────────────
  doc.addPage();
  addPageHeader(doc, colorLogo, 'Terms & Policies');
  y = 35; // Start a bit higher so it doesn't push off the bottom

  y = sectionHeader(doc, 'TERMS & CONDITIONS', margin, y, contentW);
  y += 6;
  TERMS_AND_CONDITIONS.forEach((t) => {
    doc.setFontSize(9); doc.setFont('Poppins','bold'); setTxt(doc, NAVY);
    doc.text(t.title, margin, y);
    y += 5.5;
    doc.setFontSize(8.5); doc.setFont('Poppins','normal'); setTxt(doc, [80, 90, 110]);
    const bLines = doc.splitTextToSize(t.body, contentW);
    doc.text(bLines, margin, y);
    y += bLines.length * 5 + 6; // Reduced gap between items
  });

  y += 8; // Reduced separation between the two sections

  y = sectionHeader(doc, 'PAYMENT & CANCELLATION', margin, y, contentW);
  y += 6;
  
  doc.setFontSize(9); doc.setFont('Poppins','bold'); setTxt(doc, NAVY);
  doc.text('Payment Schedule:', margin, y); y += 6;
  doc.setFontSize(8.5); doc.setFont('Poppins','normal'); setTxt(doc, [80, 90, 110]);
  PAYMENT_SCHEDULE.forEach((p) => {
    setFill(doc, BLUE); doc.circle(margin + 2.5, y - 1, 1.4, 'F');
    const pLines = doc.splitTextToSize(p, contentW - 7);
    doc.text(pLines, margin + 7, y);
    y += pLines.length * 5 + 4; // Reduced gap
  });
  
  y += 8;
  
  doc.setFontSize(9); doc.setFont('Poppins','bold'); setTxt(doc, NAVY);
  doc.text('Cancellation Terms:', margin, y); y += 6;
  CANCELLATION_TERMS.forEach((c) => {
    doc.setFontSize(8.5); doc.setFont('Poppins','bold'); setTxt(doc, [50, 60, 80]);
    doc.text(c.period, margin, y); 
    doc.setFont('Poppins','normal');
    // Perfectly align the charge to the right edge of the page margin
    doc.text(c.charge, margin + contentW - doc.getTextWidth(c.charge), y); 
    
    // Draw a subtle dotted line connecting the period and charge
    setDraw(doc, [220, 225, 235]); doc.setLineWidth(0.5); doc.setLineDashPattern([1, 1.5], 0);
    const startX = margin + doc.getTextWidth(c.period) + 4;
    const endX = margin + contentW - doc.getTextWidth(c.charge) - 4;
    if (endX > startX) {
      doc.line(startX, y - 1, endX, y - 1);
    }
    doc.setLineDashPattern([], 0); // reset dash
    
    y += 7; // Reduced line height
  });

  const totalPagesT = (doc.internal as any).getNumberOfPages();
  for (let p = 1; p <= totalPagesT; p++) {
    doc.setPage(p);
    if (p > 1) {
      drawWatermark(doc, birdLogoB64);
    }
    if (p >= 2) {
      addPageFooter(doc, p, totalPagesT, 'tour');
    }
  }

  doc.save(`Simplifly-${tour.title.replace(/[^a-z0-9]/gi,'_')}-Brochure.pdf`);
}
