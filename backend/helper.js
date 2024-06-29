function sendResponse(res, data, statusCode = 200) {
    return res.status(statusCode).json({
        message: "Request successful.",
        data: data,
        error: null
    })
}

module.exports = {
    sendResponse
}