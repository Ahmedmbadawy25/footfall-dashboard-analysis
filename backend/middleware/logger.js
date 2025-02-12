const { format } = require('date-fns');
const { v4: uuid } = require('uuid');
const fs = require('fs');
const path = require('path');
const fsPromises = require('fs').promises;

const logEvents = async (message, logFileName) => {
    const dateTime = `${format(new Date(), 'dd-MM-yyyy HH:mm:ss')}`;
    const logMessage = `${dateTime} \t ${uuid()} \t ${message}\n`;

    try {
        if (!fs.existsSync(path.join(__dirname, '../logs'))) {
            await fsPromises.mkdir(path.join(__dirname, '../logs'));
        }
        await fsPromises.appendFile(path.join(__dirname, `../logs/${logFileName}`), logMessage);
    }
    catch (err) {
        console.error(err);
    }
}

const logger = (req, res, next) => {
    logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, 'reqLog.log');
    console.log(`${req.method} ${req.path}`);
    next();
}

module.exports = { logger, logEvents };