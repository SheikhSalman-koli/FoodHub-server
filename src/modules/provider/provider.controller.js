import { providerService } from "./provider.service.js";
const createProvider = async (req, res) => {
    try {
        const body = req.body;
        const result = await providerService.createProvider(body);
        res.status(200).json({
            success: true,
            message: "provider created successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to create provider!",
            error: error.message
        });
    }
};
const getAllProvider = async (req, res) => {
    try {
        const result = await providerService.getAllProvider();
        res.status(200).json({
            message: "provider retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve provider!",
            error: error.message
        });
    }
};
const getSingleProvider = async (req, res) => {
    try {
        const { id } = req?.params;
        const result = await providerService.getSingleProvider(id);
        res.status(200).json({
            message: "provider retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve provider!",
            error: error.message
        });
    }
};
const getProviderByEmail = async (req, res) => {
    try {
        const { email } = req?.params;
        const result = await providerService.getProviderByEmail(email);
        res.status(200).json({
            message: "provider retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve provider!",
            error: error.message
        });
    }
};
const updateProvider = async (req, res) => {
    try {
        const { id } = req?.params;
        const result = await providerService.updateProvider(id, req.body);
        res.status(200).json({
            message: "provider updated successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to update provider!",
            error: error.message
        });
    }
};
export const providerController = {
    createProvider,
    getAllProvider,
    getSingleProvider,
    getProviderByEmail,
    updateProvider
};
