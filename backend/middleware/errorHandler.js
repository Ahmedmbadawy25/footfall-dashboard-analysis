const { logEvents } = require('./logger');

const errorHandler = (err, req, res, next) => {
    logEvents(`${err.name}\t${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`, 'errorLog.log');
    console.error(err.stack);

    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status(statusCode);

    res.json({message: err.message});
}

module.exports = errorHandler;