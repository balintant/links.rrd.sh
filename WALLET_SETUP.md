# Apple Wallet Pass Setup

This project generates Apple Wallet passes (.pkpass files) for each profile's QR code page.

## Certificate Requirements

**Important:** The passes are currently signed with self-signed certificates for demonstration purposes. To use these passes on actual iOS devices, you need to:

1. **Enroll in Apple Developer Program** ($99/year)
   - Visit https://developer.apple.com/programs/

2. **Create a Pass Type ID**
   - Go to https://developer.apple.com/account/resources/identifiers/list/passTypeId
   - Create a new Pass Type ID (e.g., `pass.com.links.rrd.sh`)

3. **Generate Signing Certificate**
   - Create a Certificate Signing Request (CSR)
   - Request a "Pass Type ID Certificate" in Apple Developer Portal
   - Download the certificate and export as `.pem` files

4. **Download Apple WWDR Certificate**
   - Download from https://www.apple.com/certificateauthority/
   - Convert to PEM format if needed

5. **Replace Certificates**
   - Place your certificates in the `certs/` directory:
     - `signerCert.pem` - Your Pass Type ID certificate
     - `signerKey.pem` - Your private key
     - `wwdr.pem` - Apple WWDR certificate

6. **Update Pass Configuration**
   - Edit `pass-generator.js` and update:
     - `passTypeIdentifier` - Your Pass Type ID
     - `teamIdentifier` - Your Apple Team ID

## How It Works

During the build process:
1. For each profile, a temporary `.pass` directory is created
2. QR codes are generated as images (icon and logo at multiple resolutions)
3. A `pass.json` file is created with profile information
4. All files are signed and packaged into a `.pkpass` file
5. The pass is placed in the `dist/[slug]/qr/` directory

## Pass Design

The Apple Wallet passes match the website's visual design:
- **Background color:** Purple gradient (`rgb(102, 126, 234)`)
- **Text colors:** White
- **Logo:** QR code for the profile URL
- **Primary field:** Name
- **Secondary field:** Title/Job
- **Back fields:** Profile URL and quick links

## Testing

To test the passes locally:
1. Run `bun build.js` to generate the passes
2. Start a local server: `python3 -m http.server -d dist 8080`
3. Navigate to `http://localhost:8080/[slug]/qr/`
4. Click "Add to Apple Wallet" to download the pass

**Note:** Self-signed passes will show a warning on iOS devices and may not be installable. Use proper Apple Developer certificates for production.
