const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || "Some Error",
    });
  }
};
export { asyncHandler };
