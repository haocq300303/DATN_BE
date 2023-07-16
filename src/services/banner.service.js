import Banner from "../models/banner.model";

export const getAll = async () => { 
    return Banner.find();
 };