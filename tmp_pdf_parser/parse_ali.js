const fs = require('fs');
const PDFParser = require('pdf2json');
const file = '/Users/ali/Library/CloudStorage/GoogleDrive-aliahm1208@gmail.com/My Drive/appian-job-scrub/Ali-Ahmed-Resume-3-2.pdf';

const pdfParser = new PDFParser(this, 1);
pdfParser.on("pdfParser_dataError", errData => console.error(errData.parserError));
pdfParser.on("pdfParser_dataReady", pdfData => {
  console.log(`\n--- TEXT FOR ${file} ---\n`);
  console.log(pdfParser.getRawTextContent());
});
pdfParser.loadPDF(file);
