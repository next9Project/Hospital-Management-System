const { NextResponse } = require("next/server");
const { verifyToken } = require("./lib/auth");

async function middleware(req) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  console.log("Token in Middleware:", token); // للتحقق من وصول التوكن

  if (!token) {
    console.log("No token, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const user = verifyToken(req);
  console.log("User from token:", user); // للتحقق من بيانات المستخدم

  if (!user || !["doctor", "nurse"].includes(user.role)) {
    console.log("Invalid user or role, redirecting to login");
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const response = NextResponse.next();
  response.headers.set("x-user", JSON.stringify(user));
  console.log("x-user set:", response.headers.get("x-user")); // للتحقق من الرأس
  return response;
}

module.exports = middleware;

module.exports.config = {
  matcher: ["/provider-dashboard/:path*"], // تأكد أن هذا يطابق مسار صفحتك
};