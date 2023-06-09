import db from '@/lib/db'
import User from '@/models/User'
import bcrypt from 'bcrypt'
import { NextResponse } from 'next/server'

export const POST = async (req) => {

    await db()

    const { name, email, password: pass } = await req.json()

    const isExisting = await User.findOne({ email })

    if (isExisting) {
        return new NextResponse("User already exist", {status: 409})
    }

    const hashedPassword = await bcrypt.hash(pass, 10)

    const account = Math.floor(Math.pow(10, 9) + Math.random() * (Math.pow(10, 10) - Math.pow(10, 9) - 1))

    const balance = 100000

    const key = generateSecretKey(16)

    console.log(key)
    
    const newUser = await User({
        name,
        email,
        password: hashedPassword,
        account,
        balance,
        key,
    })

    try {
       
        await newUser.save()
        
        return new NextResponse("User has been created", {status: 201})


       
    } catch (err) {
        return new NextResponse(err.message, {status: 500})
    }

   

}

function generateSecretKey(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let secretKey = '';
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    secretKey += charset[randomIndex];
  }
  
  return secretKey;
}