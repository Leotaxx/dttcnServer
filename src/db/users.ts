import mongoose,{Document,Schema} from "mongoose";

export interface IUser extends Document{
    email:string;
    username:string;
    authentication:{
        password:string;
        salt:string;
        sessionToken?:string;
    }
    inviteCode:string;
    
    
}


const UserSchema = new mongoose.Schema(
    {
        email:{type:String,required:true},
        username:{type :String ,required:true}, 
        authentication:{
            password:{type:String,required:true,select:false},
            salt:{type:String,required:true,select:false},
            sessionToken:{type:String,select:false},
        },
        inviteCode:{type:String,required:true,select:false}
        
    }
);

export const UserModel = mongoose.model<IUser>('User',UserSchema);
export const getUsers = ()=>UserModel.find();
export const getUserByEmail = (email:string)=>UserModel.findOne({email});
export const getUserBySessionToken=(sessionToken:string)=>UserModel.findOne({'authentication.sessionToken':sessionToken});
export const getUserById=(id:string)=>UserModel.findById(id)
export const createUser=(values:Record<string, any>)=>new UserModel(values).save().then((user)=>user.toObject());
export const deleteUserById = async (userId: string) => {
    try {
        // Find the user and their associated cars
        const user = await UserModel.findById(userId).exec();
        if (!user) {
            console.log('User not found');
            return; // or handle this case as needed
        }
 
        // Delete the user
        await UserModel.findByIdAndDelete(userId);
        console.log('User and their cars have been successfully deleted');
    } catch (error) {
        console.error('Error deleting user:', error.message);
        // Handle the error appropriately
    }
};
export const updateUserById=(id:string,values:Record<string,any>)=>UserModel.findByIdAndUpdate(id,values);

export const signOutUser = async (userId: string): Promise<void> => {
    try {
      await UserModel.findByIdAndUpdate(userId, { 'authentication.sessionToken': null });
      console.log('User successfully signed out');
    } catch (error) {
      console.error('Error signing out user:', error.message);
      // Handle the error appropriately
    }
  };