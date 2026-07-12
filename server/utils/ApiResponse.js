class ApiResponse {
  static success(res, message = "Success", data = null, code = 200) {
    return res.status(code).json({
      success: true,
      message,
      data,
    });
  }

 static paginated(res, data, page, limit, total, message = "Success") {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / limit),
    },
  });
}
  static error(res, message = "Error", code = 500) {
    return res.status(code).json({
      success: false,
      message,
    });
  }
}

module.exports = ApiResponse;