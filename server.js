const app = require('./app')
require('dotenv').config()

const port = 3000 || process.env.PORT

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})