import jwt from "jsonwebtoken";

// ✅ Middleware to verify if user is authenticated (from cookie or header)
export const verifyToken = (req, res, next) => {
  try {
    let token;

    // Check for token in cookies
    if (req.cookies && req.cookies.access_token) {
      token = req.cookies.access_token;
    }

    // Check for token in Authorization header
    else if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    // If token not found
    if (!token) {
      return res
        .status(403)
        .json({ success: false, message: "No token provided" });
    }

    // ✅ Verify token and attach to request
    const decodedVerified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decodedVerified;

    next(); // Proceed to controller
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized", error: error.message });
  }
};

// ✅ Middleware to verify if user is admin
export const verifyAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user || req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: Admin privileges required",
      });
    }
    next();
  });
};

// ✅ Middleware to verify if user has specific roles
export const verifyRole = (roles) => {
  return (req, res, next) => {
    verifyToken(req, res, () => {
      if (!req.user || !roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ success: false, message: "Access denied: Insufficient role" });
      }
      next();
    });
  };
};
