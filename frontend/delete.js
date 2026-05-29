const fs = require('fs');
try {
  fs.unlinkSync('./src/imports/image-1.png');
  console.log('image-1.png deleted');
} catch (e) {
  console.log('failed to delete image-1.png', e.message);
}
