import { clerkClient } from "@clerk/express"; 

const protectEducator = async (req, res, next) => {
    try {
        if (!req.auth) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        const authObj = typeof req.auth === "function" ? req.auth() : req.auth;
        const userId = authObj && authObj.userId;
        const sessionClaims = authObj && authObj.sessionClaims;

        if (!userId) {
            console.error("protectEducator: missing userId on request");
            return res.status(401).json({ error: "Unauthorized" });
        }

        // Prefer session claims to avoid extra API calls
        const roleFromClaims = sessionClaims && sessionClaims.publicMetadata && sessionClaims.publicMetadata.role;
        if (roleFromClaims) {
            if (roleFromClaims !== "educator") {
                return res.status(403).json({ error: "Access denied. Educator role required." });
            }
            return next();
        }

        // Fallback: fetch user from Clerk (userId validated above)
        const user = await clerkClient.users.getUser(userId);
        const role = user && user.publicMetadata && user.publicMetadata.role;
        if (role !== "educator") {
            return res.status(403).json({ error: "Access denied. Educator role required." });
        }

        return next();
    } catch (error) {
        console.error("Auth Middleware error:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export default protectEducator;
// import { clerkClient } from "@clerk/express"; 

// const protectEducator = async(req, res, next) => {
//     try {
//         const { userId } = req.auth().userId;
//         const user = await clerkClient.users.getUser(userId);
//         console.log("User role from metadata:", user.publicMetadata.role);
//         console.log(user.publicMetadata.role);
//         if(user.publicMetadata.role !== 'educator') {
//             return res.status(403).json({ error: "Access denied. Educator role required." });
//         }

//         next();
//     } catch (error) {
//         console.error("Auth Middleware error:", error);
//         return res.status(500).json({ error: "Internal server error" });
//     }
// };
// export default protectEducator;