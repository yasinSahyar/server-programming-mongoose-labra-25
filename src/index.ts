import app from './app';
import mongoConnect from './utils/db';

const port = process.env.PORT || 3000;

mongoConnect()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening: http://localhost:${port}`);
    });
  })
  .catch(() => {
    console.log('Server not started!');
  });
