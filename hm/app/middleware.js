// const { NextResponse } = require("next/server");
// const jwt = require("jsonwebtoken");

// async function middleware(req) {
//   // استخراج التوكن من Cookie
//   const token = req.cookies.get("token")?.value;
//   console.log("Token from Cookie in Middleware:", token);

//   if (!token) {
//     console.log("No token found, redirecting to login");
//     return NextResponse.redirect(new URL("/login", req.url));
//   }

//   try {
//     // التحقق من التوكن
//     const user = jwt.verify(token, process.env.JWT_SECRET);
//     console.log("User decoded from token:", user);

//     if (!user || !["doctor", "nurse"].includes(user.role)) {
//       console.log("Invalid user or role, redirecting to login");
//       return NextResponse.redirect(new URL("/login", req.url));
//     }

//     // تعيين بيانات المستخدم في الرأس
//     const response = NextResponse.next();
//     response.headers.set("x-user", JSON.stringify(user));
//     console.log("x-user header set:", response.headers.get("x-user"));
//     return response;
//   } catch (error) {
//     console.error("Token verification failed:", error.message);
//     return NextResponse.redirect(new URL("/login", req.url));
//   }
// }

// module.exports = middleware;

// module.exports.config = {
//   matcher: ["/provider-dashboard/:path*"], // تأكد من تطابق المسار
// };