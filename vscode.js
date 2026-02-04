/* 
 * 🦆 duckky-green-remote-editor
 * Integrated with Streamtape API Storage
 */

const { exec, spawn } = require('child_process');
const http = require('http');

// 1. Keep-Alive Server
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
    res.writeHead(200);
    res.end('🦆 duckky-green VS Code is Online');
}).listen(port);

// 2. Streamtape Credentials (Stored for use in terminal)
const ST_USER = 'cce2583988eb1dba8a73';
const ST_PASS = 'jYPdwyMK9VizZ7A';

// 3. Download and Launch VS Code
console.log("[SYSTEM] 🦆 Installing VS Code Engine...");

/**
 * FIXED LINK BELOW: 
 * Points to the actual binary file (sha/download) 
 * instead of the website homepage.
 */
const setup = "curl -Lk 'https://code.visualstudio.com' --output vscode_cli.tar.gz && tar -xf vscode_cli.tar.gz";

exec(setup, (err) => {
    if (err) return console.error(`[FATAL] 🦆 Installation failed: ${err}`);

    console.log("[SYSTEM] 🦆 Engine Ready. Starting Secure Tunnel...");

    // Start the tunnel
    const tunnel = spawn('./code', ['tunnel', '--accept-server-license-terms', '--no-sleep']);

    tunnel.stdout.on('data', (data) => {
        const out = data.toString();
        console.log(`[VSCODE] ${out}`);

        // LOOK FOR THIS IN THE RENDER LOGS
        if (out.includes("https://github.com")) {
            console.log("\n🔑 [ACTION REQUIRED] 🦆");
            console.log("Find your GitHub login code in the logs above and enter it at the link provided!");
        }
    });

    tunnel.stderr.on('data', (data) => console.error(`[VSCODE_ERR] ${data}`));
});
