const { exec, spawn } = require('child_process');
const http = require('http');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

// 🦆 1. Keep-Alive Web Server
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('🦆 Duckky VS Code Tunnel is running!');
}).listen(port);

// 🦆 2. Streamtape Storage Config
const ST_USER = 'cce2583988eb1dba8a73';
const ST_PASS = 'jYPdwyMK9VizZ7A';

async function backupToStreamtape(filePath) {
    try {
        const { data } = await axios.get(`https://api.streamtape.com{ST_USER}&key=${ST_PASS}`);
        const form = new FormData();
        form.append('file1', fs.createReadStream(filePath));
        const upload = await axios.post(data.result.url, form, { headers: form.getHeaders() });
        console.log(`[ST_STORAGE] 🦆 Backup successful: ${upload.data.result.url}`);
    } catch (e) { console.log(`[ST_ERROR] 🦆 Backup failed: ${e.message}`); }
}

// 🦆 3. VS Code Installation & Startup
console.log("[SYSTEM] 🦆 Downloading VS Code Server...");

const setupCmd = "curl -Lk 'https://code.visualstudio.com' --output vscode_cli.tar.gz && tar -xf vscode_cli.tar.gz";

exec(setupCmd, (err) => {
    if (err) return console.error(`[ERROR] 🦆 Download failed: ${err}`);

    console.log("[SYSTEM] 🦆 VS Code Downloaded. Starting Tunnel...");

    // Start the tunnel
    const tunnel = spawn('./code', ['tunnel', '--accept-server-license-terms', '--no-sleep']);

    tunnel.stdout.on('data', (data) => {
        const output = data.toString();
        console.log(`[VSCODE] ${output}`);

        // Look for the GitHub Device Code in the logs
        if (output.includes("https://github.com")) {
            console.log("\n⚠️  ACTION REQUIRED ⚠️");
            console.log("🦆 Go to the Render 'Logs' tab to find your GitHub login code!");
        }
    });

    tunnel.stderr.on('data', (data) => console.error(`[VSCODE_ERR] ${data}`));
});
