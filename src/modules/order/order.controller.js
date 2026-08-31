import { orderService } from "./order.service.js";
const createOrder = async (req, res) => {
    try {
        const body = req.body;
        const result = await orderService.createOrder(body);
        res.status(200).json({
            message: "order created successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to create order!",
            error: error.message
        });
    }
};
const getAllOrders = async (req, res) => {
    try {
        const { id, role, email } = req?.user ?? {};
        // console.log(`user: ${id}, role: ${role}, email: ${email}`)
        const data = {
            id: id,
            role: role,
            email: email
        };
        const result = await orderService.getAllOrders(data);
        // console.log(result);
        res.status(200).json({
            message: "order retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve order!",
            error: error.message
        });
    }
};
const getSingleOrder = async (req, res) => {
    try {
        const { id } = req?.params;
        const result = await orderService.getSingleOrder(id);
        res.status(200).json({
            message: "order retrieved successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to retrieve order!",
            error: error.message
        });
    }
};
const updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req?.body;
        const user = req?.user;
        if (!user) {
            return res.status(401).json({
                message: "User not authenticated"
            });
        }
        const { role, id, email } = user;
        const result = await orderService.updateOrderStatus(orderId, role, id, email, status);
        res.status(200).json({
            message: "order status updated successfully!",
            data: result
        });
    }
    catch (error) {
        res.status(400).json({
            message: "failed to update order status!",
            error: error.message
        });
    }
};
export const orderController = {
    createOrder,
    getAllOrders,
    updateOrderStatus,
    getSingleOrder
};
