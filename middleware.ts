import { withAuth } from "next-auth/middleware";
import { UserRole } from "@/lib/enums";

export default withAuth({
  callbacks: {
    authorized({ token, req }) {
      if (!token) return false;
      const pathname = req.nextUrl.pathname;
      if (pathname.startsWith("/employee")) {
        return token.role === UserRole.EMPLOYEE || token.role === UserRole.ADMIN;
      }
      if (pathname.startsWith("/client")) {
        return token.role === UserRole.CLIENT || token.role === UserRole.ADMIN;
      }
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/client/:path*", "/employee/:path*", "/certificates/:path*"],
};
