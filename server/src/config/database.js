const dns = require("dns");

// Set public DNS servers to resolve MongoDB SRV records (prevents querySrv ECONNREFUSED on local network DNS)
try {
    dns.setServers(['1.1.1.1', '8.8.8.8', '8.8.4.4']);
} catch (e) {
    // Ignore error if dns.setServers fails
}

const mongodb = require("mongoose");
require('dotenv').config();

mongodb.connect(`${process.env.DB_URI}`)
    .then(() => {
        console.log("Database Connected Successfully 👾");
    })
    .catch((err) => {
        console.log("Database Connection Failed:", err.message);
    });
