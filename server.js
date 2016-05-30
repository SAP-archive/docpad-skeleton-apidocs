const express = require('express');
const fs = require('fs');

try {

  stats = fs.statSync('out');

  if (stats.isDirectory()) {

    const app = express();

    app.use(express.static('out'));

    app.listen(process.env.PORT || 9778, () => {
      console.log('Server started.. Open the following link in the browser: http://localhost:9778/');
    });
  }
}
catch (e) {
  console.log('Unable to start the server because of errors described above in red');
}
