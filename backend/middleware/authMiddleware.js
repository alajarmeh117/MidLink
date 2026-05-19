const jwt = require("jsonwebtoken");

exports.authenticateToken = (req, res, next) => {
  // 🔥 التعديل السحري: اقرأ توكن المريض "أو" توكن الدكتور
  const token = req.cookies["Patient Token"] || req.cookies["Doctor Token"];

  if (!token) {
    return res.status(401).json({ message: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // هاد رح يخزن بيانات الدكتور أو المريض حسب مين اللي فايت
    next();
  } catch (error) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
};
