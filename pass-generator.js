import { PKPass } from "passkit-generator";
import { readFile, mkdir, writeFile } from "fs/promises";
import { join } from "path";
import QRCode from "qrcode";

async function generateAppleWalletPass(page, baseUrl) {
  try {
    const pageUrl = `${baseUrl}/${page.slug}`;
    
    // Create a temporary model directory
    const modelDir = join("temp-model", `${page.slug}.pass`);
    await mkdir(modelDir, { recursive: true });

    // Generate QR code images and save to model directory
    // Icon at 29x29 (1x)
    await QRCode.toFile(join(modelDir, "icon.png"), pageUrl, {
      width: 29,
      margin: 0,
      errorCorrectionLevel: "H",
    });

    // Icon at 58x58 (2x)
    await QRCode.toFile(join(modelDir, "icon@2x.png"), pageUrl, {
      width: 58,
      margin: 0,
      errorCorrectionLevel: "H",
    });

    // Icon at 87x87 (3x)
    await QRCode.toFile(join(modelDir, "icon@3x.png"), pageUrl, {
      width: 87,
      margin: 0,
      errorCorrectionLevel: "H",
    });

    // Logo at 160x50
    await QRCode.toFile(join(modelDir, "logo.png"), pageUrl, {
      width: 160,
      margin: 1,
      errorCorrectionLevel: "H",
    });

    // Logo at 320x100 (2x)
    await QRCode.toFile(join(modelDir, "logo@2x.png"), pageUrl, {
      width: 320,
      margin: 1,
      errorCorrectionLevel: "H",
    });

    // Create pass.json
    const passJson = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.links.rrd.sh",
      serialNumber: `${page.slug}-${Date.now()}`,
      teamIdentifier: "TEAM123456",
      organizationName: "Links.rrd.sh",
      description: `${page.name} - Contact Links`,
      backgroundColor: "rgb(102, 126, 234)",
      foregroundColor: "rgb(255, 255, 255)",
      labelColor: "rgb(255, 255, 255)",
      logoText: page.name,
      generic: {
        primaryFields: [
          {
            key: "name",
            label: "NAME",
            value: page.name,
            textAlignment: "PKTextAlignmentLeft",
          },
        ],
        secondaryFields: [
          {
            key: "title",
            label: "TITLE",
            value: page.title,
            textAlignment: "PKTextAlignmentLeft",
          },
        ],
        auxiliaryFields: [
          {
            key: "website",
            label: "WEBSITE",
            value: "links.rrd.sh",
            textAlignment: "PKTextAlignmentLeft",
          },
        ],
        backFields: [
          {
            key: "url",
            label: "Profile URL",
            value: pageUrl,
            textAlignment: "PKTextAlignmentLeft",
          },
          {
            key: "links",
            label: "Quick Links",
            value: page.links
              .map((link) => `• ${link.title}: ${link.url}`)
              .join("\n"),
            textAlignment: "PKTextAlignmentLeft",
          },
        ],
      },
    };

    await writeFile(
      join(modelDir, "pass.json"),
      JSON.stringify(passJson, null, 2)
    );

    // Read certificates
    const signerCert = await readFile("certs/signerCert.pem");
    const signerKey = await readFile("certs/signerKey.pem");
    const wwdr = await readFile("certs/wwdr.pem");

    // Create pass from model directory (images are already in the model dir)
    const pass = await PKPass.from({
      model: modelDir,
      certificates: {
        wwdr,
        signerCert,
        signerKey,
      },
    });

    const buffer = pass.getAsBuffer();
    return buffer;
  } catch (error) {
    console.error(`Error generating pass for ${page.slug}:`, error.message);
    throw error;
  }
}

export { generateAppleWalletPass };
