import moment from "moment";
import querystring from "qs";
import crypto from "crypto";
import { serverError } from "../formatResponse/serverError";
import PaymentModel from "../models/payment.model";
import "dotenv/config";

const sortObject = (obj) => {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
};

const config = {
    vnp_TmnCode: "NRQRJA4J",
    vnp_HashSecret: "GLQYEDNCQMOQNNTMBWMPAAEDPWTWLFOH",
    vnp_Url: "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
    vnp_Api: "https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
    vnp_ReturnUrl: "http://localhost:8080/api/vnpay/vnpay_ipn",
};

class PayMentController {
    createUrl(req, res) {
        try {
            const { bank_code: bankCode = "", user_bank, user_receiver, price_received, total_received, vnp_OrderInfo, language = "vn" } = req.body;
            let date = new Date();
            let createDate = moment(date).format("YYYYMMDDHHmmss");

            let ipAddr =
                req.headers["x-forwarded-for"] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;

            let tmnCode = config.vnp_TmnCode;
            let secretKey = config.vnp_HashSecret;
            let vnpUrl = config.vnp_Url;
            let returnUrl = config.vnp_ReturnUrl + `?user_bank=${user_bank}&user_receiver=${user_receiver}&total_received=${total_received}`;
            let orderId = moment(date).format("DDHHmmss");
            console.log(price_received);

            let currCode = "VND";
            let vnp_Params = {};
            vnp_Params["vnp_Version"] = "2.1.0";
            vnp_Params["vnp_Command"] = "pay";
            vnp_Params["vnp_TmnCode"] = tmnCode;
            vnp_Params["vnp_Locale"] = language;
            vnp_Params["vnp_CurrCode"] = currCode;
            vnp_Params["vnp_TxnRef"] = orderId;
            vnp_Params["vnp_OrderInfo"] = vnp_OrderInfo + orderId;
            vnp_Params["vnp_OrderType"] = "other";
            vnp_Params["vnp_Amount"] = price_received * 100;
            vnp_Params["vnp_ReturnUrl"] = returnUrl;
            vnp_Params["vnp_IpAddr"] = ipAddr;
            vnp_Params["vnp_CreateDate"] = createDate;
            if (bankCode !== null && bankCode !== "") {
                vnp_Params["vnp_BankCode"] = bankCode;
            }

            vnp_Params = sortObject(vnp_Params);

            let signData = querystring.stringify(vnp_Params, { encode: false });

            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
            vnp_Params["vnp_SecureHash"] = signed;
            vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

            return res.status(200).json({ url_redierct: vnpUrl, url_return: config.vnp_ReturnUrl });
        } catch (error) {
            res.status(500).json(serverError(error.message));
        }
    }

    async getDataReturn(req, res, next) {
        try {
            let vnp_Params = req.query;
            let secureHash = vnp_Params["vnp_SecureHash"];

            let orderId = vnp_Params["vnp_TxnRef"];
            let rspCode = vnp_Params["vnp_ResponseCode"];

            delete vnp_Params["vnp_SecureHash"];
            delete vnp_Params["vnp_SecureHashType"];

            const { user_bank, user_receiver, total_received, ...obj } = vnp_Params;
            vnp_Params = sortObject(obj);
            let secretKey = config.vnp_HashSecret;

            let signData = querystring.stringify(vnp_Params, { encode: false });
            let hmac = crypto.createHmac("sha512", secretKey);
            let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");

            let paymentStatus = "0";

            let checkOrderId = true;
            let checkAmount = true;
            if (secureHash === signed) {
                //kiểm tra checksum
                if (checkOrderId) {
                    if (checkAmount) {
                        if (paymentStatus == "0") {
                            if (rspCode == "00") {
                                const isMatch = await PaymentModel.findOne({ code: vnp_Params["vnp_TxnRef"] });

                                if (!isMatch) {
                                    const newPayment = await PaymentModel.create({
                                        user_bank,
                                        user_receiver,
                                        price_received: vnp_Params["vnp_Amount"] / 100,
                                        total_received: total_received,
                                        code: vnp_Params["vnp_TxnRef"],
                                        message: vnp_Params["vnp_OrderInfo"],
                                        payment_method: "banking",
                                        status: "success",
                                    });
                                    res.redirect(
                                        process.env.NODE_URL_CLIENT +
                                            `/checkout?mode=order&code=${vnp_Params["vnp_TxnRef"]}&payment_id=${newPayment._id}`
                                    );
                                }
                            } else {
                                res.redirect(process.env.NODE_URL_CLIENT + "/checkout");
                            }
                        } else {
                            res.status(200).json({ RspCode: "02", Message: "This order has been updated to the payment status" });
                        }
                    } else {
                        res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
                    }
                } else {
                    res.status(200).json({ RspCode: "01", Message: "Order not found" });
                }
            } else {
                res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
            }
        } catch (error) {
            res.status(500).json(serverError(error.message));
        }
    }
}

export default new PayMentController();
