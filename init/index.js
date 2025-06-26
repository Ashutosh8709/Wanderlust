const mongoose=require('mongoose');
const initData=require("./data.js");
const listing=require("../models/listing.js");
main().then(()=>{
    console.log("connected to DB");
})
.catch((err)=>{
    console.log(err);
});



async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

const initDB=async()=>{
    await listing.deleteMany({});
    initData.data=initData.data.map((obj)=>({...obj,owner:"6853b214a735feb488046ca3"}));
    await listing.insertMany(initData.data);
}

initDB();