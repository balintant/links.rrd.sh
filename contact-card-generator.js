/**
 * Generates a vCard (VCF) contact card that can be saved to Apple Wallet
 * and other contact management systems without requiring certificates.
 */

function generateContactCard(page, baseUrl) {
  const pageUrl = `${baseUrl}/${page.slug}`;
  
  // Create vCard 3.0 format
  const vCardLines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${page.name}`,
    `TITLE:${page.title}`,
    `ORG:${page.title.split('@').pop()?.trim() || 'Links.rrd.sh'}`,
    `URL:${pageUrl}`,
  ];

  // Add each link as a URL field with a label
  page.links.forEach((link) => {
    // Clean up the title for use as a type
    const type = link.title.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
    vCardLines.push(`URL;type=${type}:${link.url}`);
  });

  // Add a note with the QR code URL
  vCardLines.push(`NOTE:Scan QR code or visit ${pageUrl} to view all links`);
  
  vCardLines.push('END:VCARD');
  
  return vCardLines.join('\r\n');
}

export { generateContactCard };
