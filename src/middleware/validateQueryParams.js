export const validateQueryParams = (allowedParams = []) => {
    return (req, res, next) => {
      const queryKeys = Object.keys(req.query);
  
      const invalidParams = queryKeys.filter(
        key => !allowedParams.includes(key)
      );
  
      if (invalidParams.length > 0) {
        return res.status(400).json({
          success: false,
          message: `Invalid query parameter(s): ${invalidParams.join(", ")}. Allowed parameters: ${allowedParams.join(", ")}.`,
        });
      }
  
      next();
    };
};