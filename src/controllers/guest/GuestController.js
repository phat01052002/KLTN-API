import GuestService from "../../services/GuestService.js";

class GuestController {
    initRoutes(app) {
        app.get('/api/product/:id', this.findProductById); // Không yêu cầu authenticate
    }

    async findProductById(req, res) {
        const productId = req.params.id; 

        try {
            console.log(`Fetching product with ID: ${productId}`);
            const product = await GuestService.findProductById(productId);
            
            if (product) {
                return res.status(200).json(product);
            } else {
                return res.status(404).json({ message: 'Sản phẩm không tìm thấy' });
            }
        } catch (e) {
            console.error(e.message);
            return res.status(500).json({ message: 'Đã xảy ra lỗi' });
        }
    }
}

export default new GuestController();