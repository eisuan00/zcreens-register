const fs = require('fs');
const path = require('path');

async function testPdfParse() {
  try {
    console.log('Testing pdf-parse...');
    
    // Try to import pdf-parse
    const pdfParse = require('pdf-parse');
    console.log('✅ pdf-parse imported successfully');
    
    // Create a simple test PDF buffer (this is a minimal PDF structure)
    const testPdfContent = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
>>
endobj

4 0 obj
<<
/Length 44
>>
stream
BT
/F1 12 Tf
72 720 Td
(Hello World) Tj
ET
endstream
endobj

xref
0 5
0000000000 65535 f 
0000000009 00000 n 
0000000058 00000 n 
0000000115 00000 n 
0000000206 00000 n 
trailer
<<
/Size 5
/Root 1 0 R
>>
startxref
299
%%EOF`;

    const buffer = Buffer.from(testPdfContent);
    console.log('📄 Test PDF buffer created, size:', buffer.length);
    
    // Try to parse the PDF
    const data = await pdfParse(buffer);
    console.log('✅ PDF parsed successfully!');
    console.log('📊 Pages:', data.numpages);
    console.log('📝 Text length:', data.text.length);
    console.log('📄 Text content:', JSON.stringify(data.text));
    
  } catch (error) {
    console.error('❌ Error testing pdf-parse:', error);
    console.error('Stack trace:', error.stack);
  }
}

testPdfParse();
