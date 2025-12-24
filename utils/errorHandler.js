// utils/errorHandler.js
function handleError(res, err, status = 500) {
    console.error(err);
    res.status(status).json({ error: err.message });
}

module.exports = { handleError };