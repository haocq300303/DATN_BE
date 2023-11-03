import Banner from "../models/banner.model";

export const getAll = async () => { 
    return Banner.find();
 };
 export const getById = async (bannerId) => {
    return Banner.findById(bannerId);
}

 export const createDT = async (data) => {
          const banner = new Banner(data);
        return await banner.save();
 }

 export const update = async (banner) => {
    const {id, ...body} = banner;
    return await Banner.findByIdAndUpdate(banner.id, body, {new: true});
 }

 export const remove = async (bannerId) => {
    return await Banner.findByIdAndDelete(bannerId);
}