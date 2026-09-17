require("dotenv").config();
const app = require("./app");

app.listen(process.env.PORT, () => {
    console.log(`Server Initiated at port ${process.env.PORT}`);
});