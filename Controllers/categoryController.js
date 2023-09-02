import {Categorymodel} from '../Models/categoryModel.js'


const getAllcategories=async(req,res)=>{
    try {
        const categories = await Categorymodel.find()
        if (categories.length===0){
            res.status(200).json({message:"No categories found",categories})

        }
        else{
            res.status(200).json({categories})
        }
    } catch (error) {
        res.status(500).json({ error: "An error occurred while fetching categories." });
        
    }
}
export {getAllcategories}