import mongoose from 'mongoose';

const database = () => mongoose.connect("mongodb+srv://ayushsingh200506_db_user:jeEYekF16AtwtFI5@namastenode.5bdtfo6.mongodb.net/devTinder");

export default database;