const express = require('express');

const app = express();

app.use(express.static('out'));

app.listen(process.env.PORT || 9778, () => {
  console.log('Server started.. Check port: 9778');
});
