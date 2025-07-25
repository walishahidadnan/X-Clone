import { aj } from "../config/arcjet.js";

export const arcjetMiddleware = async(req, res, next) => {
    try{
        const decision = await aj.protect(req, {
            requested: 1,
        });
        if(decision.isDenied()){
            if(decision.reason.isRateLimit()){
                return res.status(429).json({
                    error: "Too Many Requests",
                    message: "Rate limit exceeded. Please try again later.",
                });
            } else if( decision.reason.isBot()){
                return res.status(403).json({
                    error: "Bot access denied",
                    message: "Automated access is not allowed ",
                });
            } else {
                return res.status(403).json({
                    error: "Forbidden",
                    message: "Access denied by security reason.",
                });
            }
        }

        if(decision.results.some((results) => results.reason.isBot() && results.reason.isSpoofed())){
            return res.status(403).json({
                error: "Spoofed bot access denied",
                message: "Access from spoofed bots is not allowed.",
            })
        }

        next();

    }catch (error){
        console.log("Arcjet middleware error:", error);
        
        next();
    }
};