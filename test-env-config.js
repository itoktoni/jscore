// Test script to verify environment configuration
const fs = require('fs');
const path = require('path');

console.log('Testing environment configuration...\n');

// Function to read and display environment file contents
function readEnvFile(filename) {
    try {
        const filePath = path.join(__dirname, filename);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            console.log(`${filename}:`);
            console.log(content);
            console.log('------------------------\n');
        } else {
            console.log(`${filename}: File not found\n`);
        }
    } catch (error) {
        console.log(`Error reading ${filename}:`, error.message, '\n');
    }
}

// Read and display all environment files
console.log('Environment Files Content:\n');
readEnvFile('.env');
readEnvFile('.env.development');
readEnvFile('.env.production');

// Check if required environment variables are set
console.log('Environment Variables Check:\n');

// Simulate checking for VITE_API_URL in different environments
const envFiles = ['.env', '.env.development', '.env.production'];
const expectedUrls = {
    '.env.development': 'http://newcore.test',
    '.env.production': 'https://newcore.nexeratech.co.id'
};

envFiles.forEach(file => {
    try {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf8');
            if (content.includes('VITE_API_URL')) {
                console.log(`✓ ${file} contains VITE_API_URL`);

                // Check if it matches expected URL
                if (expectedUrls[file]) {
                    if (content.includes(expectedUrls[file])) {
                        console.log(`✓ ${file} has correct VITE_API_URL: ${expectedUrls[file]}\n`);
                    } else {
                        console.log(`✗ ${file} does not have expected VITE_API_URL. Expected: ${expectedUrls[file]}\n`);
                    }
                }
            } else {
                console.log(`✗ ${file} does not contain VITE_API_URL\n`);
            }
        }
    } catch (error) {
        console.log(`Error checking ${file}:`, error.message, '\n');
    }
});

console.log('Environment configuration test completed.');