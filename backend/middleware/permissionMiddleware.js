const User = require('../models/UserModel');

const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = await User.findById(req.user._id).populate('roles');

            // Admin users bypass permission checks
            if (req.user.isAdmin) {
                return next();
            }

            // Check if user has the required permission through any of their roles
            const hasRequiredPermission = user.roles.some(role =>
                role.permissions.includes(requiredPermission)
            );

            if (!hasRequiredPermission) {
                return res.status(403).json({
                    message: `Permission denied: ${requiredPermission} is required`
                });
            }

            next();
        } catch (error) {
            res.status(500).json({ message: 'Server Error', error: error.message });
        }
    };
};

module.exports = { hasPermission };