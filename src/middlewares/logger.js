const logger = (req, res, next) => {
    // Record the start time of the request
    const start = Date.now();

    // Log the incoming request details
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - Started`);

    // Capture response details after the response is sent
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    // Call the next middleware or route handler
    next();
};

module.exports = logger;
