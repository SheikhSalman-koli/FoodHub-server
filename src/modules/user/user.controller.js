import { userService } from "./user.service.js";
const getAllUsers = async (req, res) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            message: "users retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve users!",
            error: error.message
        });
    }
};
const getAUsers = async (req, res) => {
    try {
        const { id } = req?.params;
        const result = await userService.getSingleUser(id);
        res.status(200).json({
            message: "user retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve user!",
            error: error.message
        });
    }
};
const updateProfile = async (req, res) => {
    try {
        const { id } = req?.params;
        const { name, image, phone, deliveryAddress } = req.body;
        const updatedDate = { id, name, image, phone, deliveryAddress };
        const result = await userService.updateProfile(id, updatedDate);
        res.status(200).json({
            message: "Profile updated successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to update user!",
            error: error.message
        });
    }
};
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req?.params;
        const { status } = req?.body;
        const result = await userService.updateUserStatus(id, status);
        res.status(200).json({
            success: true,
            message: `User status updated to ${status}!`,
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to update user!",
            error: error.message
        });
    }
};
const changePassword = async (req, res) => {
    try {
        const { currentPassword, confirmPassword } = req.body;
        const { id } = req?.params;
        const currentSessionId = req?.session?.id;
        await userService.changePassword({
            userId: id,
            currentSessionId,
            currentPassword,
            confirmPassword
        });
        res.status(200).json({
            success: true,
            message: "Password changed successfully!",
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve users!",
            error: error.message
        });
    }
};
export const userController = {
    getAllUsers,
    getAUsers,
    updateProfile,
    updateUserStatus,
    changePassword
};
