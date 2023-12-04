exports.sendResponse = function (
  res,
  statusCode = 200,
  message = 'Success',
  data,
) {
  res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
  })
}

exports.sendError = function (
  res,
  error,
  statusCode = 500,
  message = 'Internal server error',
) {
  console.error(error) // Log the error to the console for debugging purposes
  res.status(statusCode).json({
    success: false,
    message: message,
    error: error instanceof Error ? error.message : error,
  })
}
