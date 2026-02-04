/* 
 * 🦆 duckky-green-remote-editor
 * Integrated with Streamtape API for persistent storage
 */

const { exec, spawn } = require('child_process');
const http = require('http');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// 1. Keep-Alive Server (Prevents Render from sleeping)
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('🦆 duckky-green VS Code is Online');
}).listen(port);

// 2. Streamtape Credentials
const ST_USER = 'cce2583988eb1dba8a73';
const ST_PASS = 'jYPdwyMK9VizZ7A';

// 3. Automated Backup Function
// Use this to save your code to Streamtape
async function backupFile(fileName) {
    try {
        const { data: srv } = await axios.get(`https://api.streamtape.com{ST_USER}&key=${ST_PASS}`);
        const form = new FormData();
        form.append('file1', fs.createReadStream(fileName));
        const upload = await axios.post(srv.result.url, form, { headers: form.getHeaders() });
        console.log(`[STORAGE] 🦆 File backed up to Streamtape: ${upload.data.result.url}`);
    } catch (e) {
        console.log(`[ERROR] 🦆 Backup failed: ${e.message}`);
    }
}

// 4. Download and Launch VS Code
console.log("[SYSTEM] 🦆 Installing VS Code Engine...");

// Direct download for Alpine Linux (Render environment)
const setup = "curl -Lk 'https://code.visualstudio.com' --output vscode_cli.tar.gz && tar -xf vscode_cli.tar.gz";

exec(setup, (err) => {
    if (err) return console.error(`[FATAL] 🦆 Installation failed: ${err}`);

    console.log("[SYSTEM] 🦆 Engine Ready. Starting Secure Tunnel...");

    const tunnel = spawn('./code', ['tunnel', '--accept-server-license-terms', '--no-sleep']);

    tunnel.stdout.on('data', (data) => {
        const out = data.toString();
        console.log(`[VSCODE] ${out}`);

        // This is where you get your Login Code for GitHub
        if (out.includes("https://github.com")) {
            console.log("\n🔑 [ACTION REQUIRED] 🦆");
            console.log("Check the logs above for your GitHub Device Code!\n");
        }
    });

    tunnel.stderr.on('data', (data) => console.error(`[VSCODE_ERR] ${data}`));
});
