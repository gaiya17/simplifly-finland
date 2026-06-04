const fs = require('fs');
const path = require('path');

// Create a dummy 1x1 png image
const imgData = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=', 'base64');
fs.writeFileSync('dummy.png', imgData);

const FormData = require('form-data');
const form = new FormData();
form.append('image', fs.createReadStream('dummy.png'));
form.append('folder', 'simplifly/test');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function run() {
  console.log('Sending upload request...');
  try {
    const res = await fetch('http://localhost:5000/api/upload/image', {
      method: 'POST',
      body: form,
      // Fake auth token if needed, but wait, the endpoint requires admin role!
      // Let's create an admin token or disable auth for the test
    });
    
    console.log('Status:', res.status);
    const text = await res.text();
    console.log('Response:', text);
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
