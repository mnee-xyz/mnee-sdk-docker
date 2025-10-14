export const errorHandler = (err, req, res, next) => {
    console.log(err)
    const statusCode = err.statusCode || err.status || 500;
    res.status(statusCode).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  };
  