import { serverError } from "../formatResponse/serverError";
import * as StatisticalService from "../services/statistical.service";

class StatisticalController {
    async revenueByYear(req, res) {
        const year = Number(req.query.year) || Number(new Date().getFullYear());
        const pitchUser = req.query.pitch_user || null;
        try {
            const revenue = await StatisticalService.getRevenueByYear(year, pitchUser);

            res.json({
                message: "Lấy dữ liệu thống kê thành công",
                data: { year, ...revenue },
            });
        } catch (error) {
            res.status(500).json(serverError(error.message));
        }
    }

    async revenueByMonth(req, res) {
        const month = Number(req.params.month) || 1;
        const pitchUser = req.query.pitch_user || null;
        const startTime = req.query.start_time || 1;
        const endTime = req.query.end_time || 31;
        const year = req.query.year || 2023;

        const query = {
            month,
            pitchUser,
            startTime,
            year,
            endTime,
        };
        try {
            const revenue = await StatisticalService.getRevenueByMonth(query);
            const total = revenue?.reduce((a, b) => a + b.totalPrice, 0) || 0;
            res.json({
                message: "Lấy dữ liệu thống kê thành công",
                data: { month, pitchUser, startTime, endTime, total, days: revenue },
            });
        } catch (error) {
            res.status(500).json(serverError(error.message));
        }
    }
    async booking(req, res) {}
}

export default new StatisticalController();
