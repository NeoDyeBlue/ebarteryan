/**
 * Sends an error response in json format
 * @param {import('next').NextApiRequest} req - req
 * @param {import('next').NextApiResponse} res - res
 * @param {string} errorMessage
 * @param {number} code - HTTP response status code
 * @param {Object} error - error object
 */

export function errorResponse(
  req,
  res,
  errorMessage = "Something went wrong",
  code = 500,
  error = {}
) {
  res.status(code).json({
    code,
    errorMessage,
    error,
    data: null,
    success: false,
  });
}

/**
 * Sends a success response in json format
 * @param {import('next').NextApiRequest} req - req
 * @param {import('next').NextApiResponse} res - res
 * @param {Object} data
 * @param {number} code
 */

export function successResponse(req, res, data, code = 200) {
  res.send({
    code,
    data,
    success: true,
  });
}
