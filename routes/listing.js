const express=require('express');
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync.js");
const {listingSchema, reviewSchema}=require("../schema.js");
const ExpressError=require("../utils/ExpressError.js");
const listing=require("../models/listing.js");
const {isLoggedIn, isOwner}=require("../middleware.js");

const listingController=require("../controllers/listings.js");
const multer=require('multer');
const {storage}=require("../cloudConfig.js");
const upload=multer({storage});

const validateListing=(req,res,next)=>{
    let {error}= listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400,error);
    }
    else{
        next();
    }
};

router.get("/",wrapAsync(listingController.index));

router.get("/new",isLoggedIn,wrapAsync(listingController.renderNewForm));

router.get("/:id",wrapAsync(listingController.showListing));

router.post("/",isLoggedIn,upload.single("image"),validateListing,wrapAsync(listingController.createListing));

router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

router.put("/:id",isLoggedIn,isOwner,upload.single("listing[image]"),wrapAsync(listingController.updateListing));

router.delete("/:id",isLoggedIn,isOwner,wrapAsync(listingController.deleteListing));

module.exports=router;