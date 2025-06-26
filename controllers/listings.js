const listing=require("../models/listing");



module.exports.index=async (req,res)=>{
    const listings=await listing.find({});
    res.render("listings/index.ejs",{listings});
};

module.exports.renderNewForm=async(req,res)=>{
        res.render("listings/new.ejs");
};


module.exports.showListing=async (req,res)=>{
    let{id} =req.params;
    const list=await listing.findById(id).populate({path:"reviews",populate:{path:"author"},}).populate("owner");
    if(!list){
        req.flash("error","Listing you requested for does not exist");
        res.redirect("/listings");
    }
    else{
    res.render("listings/show.ejs",{list});}
};


module.exports.createListing=async(req,res,next)=>{
    let url=req.file.path;
    let filename=req.file.filename;
    let{title,description,image,price, country, location}=req.body;
        const newListing=new listing(
            {
                title:title,
                description:description,
                image:image,
                price:price,
                country:country,
                location:location,
                reviews:[],
            }
        );
        // if(!newListing.title){
        //     throw new ExpressError(400,"Title is missing!");
        // }
        // if(!newListing.description){
        //     throw new ExpressError(400,"Description is missing!");
        // }
        // if(!newListing.location){
        //     throw new ExpressError(400,"Location is missing!");
        // }
        newListing.owner=req.user.id;
        newListing.image={url,filename};
        await newListing.save();
        req.flash("success","New Listing Created!");
        res.redirect("/listings");
};


module.exports.renderEditForm=async (req,res)=>{
    let{id}=req.params;
    const list=await listing.findById(id);
    res.render("listings/edit.ejs",{list});
};

module.exports.updateListing=async (req,res)=>{
    if(!req.body.listing){
        throw new ExpressError(400,"Send valid data for listing");
    }
    let {id}=req.params;
    let list=await listing.findByIdAndUpdate(id,{...req.body.listing});
    if(typeof req.file !== "undefined"){
    let url=req.file.path;
    let filename=req.file.filename;
    list.image={url,filename};
    await list.save();
    }
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
};

module.exports.deleteListing=async (req,res)=>{
    let {id}=req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
};