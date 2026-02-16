const libre = require('libreoffice-convert');
const path = require('path');
const fs = require('fs');

const inputPath = path.join(__dirname, 'node_modules', 'libreoffice-convert', 'tests', 'resources', 'hello.docx');
const outputPath = path.join(__dirname, 'test_output.pdf');

// Check if input file exists
if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    process.exit(1);
}

const inputBuf = fs.readFileSync(inputPath);

console.log('Starting conversion...');

libre.convert(inputBuf, '.pdf', undefined, (err, done) => {
    if (err) {
        console.error(`Error converting file: ${err}`);
        process.exit(1);
    }

    fs.writeFileSync(outputPath, done);
    console.log(`Conversion successful! Output saved to ${outputPath}`);
});
