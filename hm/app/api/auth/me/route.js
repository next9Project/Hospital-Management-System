// import { NextResponse } from 'next/server';
// import  {connectDB}  from '@/app/lib/db';
// import User from '@/app/models/User';
// import jwt from 'jsonwebtoken';

// // Helper function to verify JWT token
// async function verifyToken(req) {
//   const cookies = req.cookies.get('token'); 
//   if (!cookies) {
//     return { success: false, message: 'No token provided', status: 401 };
//   }

//   const token = cookies.value;
//   try {
//     // Verify the JWT token
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     return { success: true, decoded };
//   } catch (error) {
//     return { success: false, message: 'Invalid or expired token', status: 401 };
//   }
// }

// export async function GET(req) {
//   try {
    
//     await connectDB();

//     // 2) Verify the JWT token using the helper function
//     const { success, decoded, message, status } = await verifyToken(req);
//     if (!success) {
//       return NextResponse.json({ success: false, message }, { status });
//     }

//     // 3) Fetch the user from the database
//     const user = await User.findById(decoded.userId).select('-password'); 
//     if (!user) {
//       return NextResponse.json(
//         { success: false, message: 'User not found' },
//         { status: 404 }
//       );
//     }

//     // 4) Return the user's data
//     return NextResponse.json({
//       success: true,
//       user: {
//         _id: user._id,
//         name: user.name,
//         email: user.email,
//         role: user.role,
//         phoneNumber: user.phone || '',
//         address: user.address || '',
//         profilePicture: user.profilePicture || '',
//       },
//     });
//   } catch (error) {
//     console.error('GET /me Error:', error);
//     return NextResponse.json(
//       { success: false, message: 'Server error' },
//       { status: 500 }
//     );
//   }
// }


import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(request) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({ userId: decoded.userId, role: decoded.role });
  } catch (error) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
}
