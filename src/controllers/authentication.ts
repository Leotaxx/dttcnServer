import { getUserByEmail,createUser ,signOutUser} from '../db/users';
import express from 'express';
import { random,authentication } from '../helpers';
import { getInviteCodeStatus,setUsedCode } from '../db/inviteCodes';
export const login = async (req:express.Request,res:express.Response)=>{
    try{
        const { email, password} = req.body;

        if(!email||!password){
            return res.sendStatus(400);
        }
        const user = await getUserByEmail(email).select('+authentication.salt +authentication.password');
        if(!user){
            return res.sendStatus(400);
        }
        const expectedHash = authentication(user.authentication.salt, password);
        if(user.authentication.password!=expectedHash){
            return res.sendStatus(403);
        }
        const salt =random();
        user.authentication.sessionToken = authentication(salt,user._id.toString());
        await user.save();
        const cookieOptions = {
            path: '/',
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production', // Secure in production
            SameSite:"Lax",
             // Adjust according to your requirements
            // Dynamically set domain based on environment
            domain: process.env.NODE_ENV === 'production' ? 'montblanc.azurewebsites.net' : 'localhost'
        };
        
        res.cookie('LEO-REST-API', user.authentication.sessionToken,cookieOptions );
        return res.status(200).json(user);
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
};

export const register = async (req:express.Request,res:express.Response)=>{
    try{
        const{email,password,username,inviteCode} =req.body;
        if(!email||!password||!username||!inviteCode){
            return res.sendStatus(400);
        }
        const existingUser = await getUserByEmail(email);
        if(existingUser){
            return res.sendStatus(400);
        }
        const inviteCodeStatus= await getInviteCodeStatus(inviteCode);
        if(inviteCodeStatus!=='new'){
            return res.sendStatus(400);
        }

        const salt = random();
        const user = await createUser({
            email,
            username,
            authentication:{
                salt,
                password:authentication(salt,password),
            },
            inviteCode
        });
        setUsedCode(inviteCode);

        return res.status(200).json(user).end();
    }catch(error){
        console.log(error);
        return res.sendStatus(400);
    }
} ;
export const logout = async (req: express.Request, res: express.Response) => {
    try {
        // Example: Extracting userId from the request, adjust based on your auth strategy
        // This could be from a session token, a cookie, or directly from the request body
        const userId = req.body.userID; // Adjust this line based on how you're identifying the user

        if (!userId) {
            return res.status(400).send('A valid user ID is required to logout.');
        }

        // Call your existing signOutUser function
        await signOutUser(userId);

        // You might want to also clear client-side cookies or local storage here
        // if your session token or user ID is stored there, depending on your setup

        res.send('User logged out successfully.');
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).send('An error occurred during the logout process.');
    }
};