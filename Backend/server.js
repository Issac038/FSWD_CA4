const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()

const app = express()
app.use(express.json())
app.use(cors())

mongoose.connect(process.env.MONGO_URL)
    .then(()=>console.log("MongoDB connection successfull."))
    .catch(()=>console.log("MongoDB connection failed."))

const courseSchema = new mongoose.Schema({
    courseName:String
})

const Course = mongoose.model("courses",courseSchema)

const studentSchema = new mongoose.Schema({
    name:String,
    age:Number,
    email:String,
    course: {type:mongoose.Schema.Types.ObjectId,ref:"course",default:null}
})

const Student = mongoose.model("students",studentSchema)

app.get("/api/students",async(req,res)=>{
    const students = await Student.find().populate("course")
    res.json(students)
})

app.post("/api/students",async(req,res)=>{
    const student = new Student(req.body)
    await student.save()
    res.json(student)
})

app.put("/api/students/:id/courses",async(req,res)=>{
    const {id} = req.params
    const{courseId} = req.body
    const updatedStudent = await Student.findByIdAndUpdate(id,{course:courseId},{new:true}).populate("course")
    res.json(updatedStudent)
})

app.delete("/api/students/:id",async(req,res)=>{
    const {id} = req.params
    await Student.findByIdAndDelete(id)
    res.json({message:"User Deleted"})
})

app.listen(8080,()=>{
    console.log("Server is running on port 8080")
})