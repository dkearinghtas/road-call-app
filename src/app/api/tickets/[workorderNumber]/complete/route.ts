import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getGraphClient } from '@/lib/sharepoint';
import { PDFDocument, rgb } from 'pdf-lib';

export const dynamic = 'force-dynamic';

export async function POST(request: Request, { params }: { params: Promise<{ workorderNumber: string }> }) {
  try {
    const resolvedParams = await params;
    const formData = await request.formData();
    
    // Parse Tech fields
    const causeOfFailure = formData.get('causeOfFailure') as string;
    const scrapTire = formData.get('scrapTire') as string;
    const remaining32nds = formData.get('remaining32nds') as string;
    const removeInstallVehicleQty = formData.get('removeInstallVehicleQty') as string;
    const dismountMountTireQty = formData.get('dismountMountTireQty') as string;
    const aluminumValveQty = formData.get('aluminumValveQty') as string;
    const brassValveQty = formData.get('brassValveQty') as string;
    const flowThroughCapQty = formData.get('flowThroughCapQty') as string;
    const rollTime = formData.get('rollTime') as string;
    const additionalItems = formData.get('additionalItems') as string;
    const comments = formData.get('comments') as string;
    const signatureDataUrl = formData.get('signatureDataUrl') as string;
    
    // Extracted photos
    const photoFiles = [
      { name: 'UnitNumber', file: formData.get('photoUnitNumber') as File },
      { name: 'LicensePlate', file: formData.get('photoLicensePlate') as File },
      { name: 'Mileage', file: formData.get('photoMileage') as File },
      { name: 'OffTire', file: formData.get('photoOffTire') as File },
      { name: 'DOT', file: formData.get('photoDOT') as File },
      { name: 'Damage', file: formData.get('photoDamage') as File },
      { name: 'ReplacementType', file: formData.get('photoReplacementType') as File },
      { name: 'WorkComplete', file: formData.get('photoWorkComplete') as File },
    ].filter(p => p.file && p.file.size > 0);

    // Update SQLite DB
    const ticket = await prisma.ticket.update({
      where: { workorderNumber: resolvedParams.workorderNumber },
      data: {
        status: 'COMPLETED',
        causeOfFailure,
        scrapTire,
        remaining32nds,
        removeInstallVehicleQty,
        dismountMountTireQty,
        aluminumValveQty,
        brassValveQty,
        flowThroughCapQty,
        rollTime,
        additionalItems,
        comments,
        signatureDataUrl
      }
    });

    // Generate PDF Summary
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    
    page.drawText(`Road Call Ticket: ${ticket.workorderNumber}`, { x: 50, y: height - 50, size: 24 });
    page.drawText(`Customer: ${ticket.customer} | Unit: ${ticket.unitNumber}`, { x: 50, y: height - 80, size: 14 });
    page.drawText(`Dispatcher: ${ticket.dispatcher} | Call Time: ${ticket.callTime}`, { x: 50, y: height - 100, size: 14 });
    page.drawText(`Tire: ${ticket.tireSize} (${ticket.tirePosition})`, { x: 50, y: height - 120, size: 14 });

    page.drawText(`--- Technician Report ---`, { x: 50, y: height - 160, size: 18 });
    page.drawText(`Cause of Failure: ${causeOfFailure}`, { x: 50, y: height - 190, size: 12 });
    page.drawText(`Scrap Tire: ${scrapTire}`, { x: 50, y: height - 210, size: 12 });
    page.drawText(`Roll Time: ${rollTime}`, { x: 50, y: height - 230, size: 12 });
    page.drawText(`Comments: ${comments}`, { x: 50, y: height - 250, size: 12 });
    
    // Embed signature if exists
    if (signatureDataUrl) {
      try {
        const base64Data = signatureDataUrl.replace(/^data:image\/png;base64,/, "");
        const signatureImage = await pdfDoc.embedPng(Buffer.from(base64Data, 'base64'));
        page.drawText(`Driver Signature:`, { x: 50, y: height - 300, size: 12 });
        page.drawImage(signatureImage, { x: 50, y: height - 400, width: 200, height: 80 });
      } catch (e) {
        console.error("Failed to embed signature", e);
      }
    }

    const pdfBytes = await pdfDoc.save();

    // SharePoint Upload Placeholder
    const graphClient = await getGraphClient();
    if (graphClient) {
      const folderName = `${ticket.workorderNumber} - ${ticket.customer?.replace(/[^a-zA-Z0-9 ]/g, "")}`;
      console.log(`Would create SharePoint folder: ${folderName}`);
      console.log(`Would upload ${photoFiles.length} photos and PDF to folder.`);
      // Real graph API upload loglc would go here.
    }

    return NextResponse.json({ success: true, message: "Job completed successfully!" });
  } catch (error: any) {
    console.error('Complete job error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
