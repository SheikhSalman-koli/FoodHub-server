import { auth as betterAuth } from '../lib/auth.js';
export var userRole;
(function (userRole) {
    userRole["CUSTOMER"] = "CUSTOMER";
    userRole["PROVIDER"] = "PROVIDER";
    userRole["ADMIN"] = "ADMIN";
})(userRole || (userRole = {}));
const auth = (...roles) => {
    return async (req, res, next) => {
        try {
            const session = await betterAuth.api.getSession({
                headers: req.headers
            });
            if (!session) {
                return res.status(403).json({
                    success: false,
                    message: 'you are not authorized!'
                });
            }
            if (!session?.user.emailVerified) {
                return res.status(403).json({
                    success: false,
                    message: 'Email verification required, Please verify your email!'
                });
            }
            // console.log(session);
            req.user = {
                id: session?.user.id,
                email: session?.user.email,
                name: session?.user.name,
                role: session?.user.role,
                emailVerified: session?.user.emailVerified
            };
            req.session = {
                id: session?.session.id
            };
            if (roles?.length && !roles.includes(req?.user?.role)) {
                return res.status(403).json({
                    success: false,
                    message: 'you are not authorized!'
                });
            }
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
export default auth;
