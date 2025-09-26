const { exec } = require('child_process');
const path = require('path');

(async () => {
  const open = (await import('open')).default;

  const server = exec('node index.js', { cwd: __dirname });

  server.stdout.on('data', data => console.log(`Server: ${data}`));
  server.stderr.on('data', data => console.error(`Server Error: ${data}`));

  setTimeout(() => {
    open('http://localhost:3000/index.html');
  }, 1000);
})();
