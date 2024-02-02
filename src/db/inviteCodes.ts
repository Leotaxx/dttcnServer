import mongoose ,{Document,Schema}from 'mongoose';


interface InviteCode extends Document{
    inviteCode:string;
    inviteCodeStatus:string;
    
}
const inviteCodeSchema = new mongoose.Schema({
    inviteCode:{type:String},
    inviteCodeStatus:{type:String}
})


    

export const InviteCodeModel = mongoose.model<InviteCode>('inviteCode',inviteCodeSchema);

export const getCars=()=>InviteCodeModel.find();
export const getInviteCodeStatus = async (inviteCode: string): Promise<String | null> => {
    try {
      const invite = await InviteCodeModel.findOne({ inviteCode: inviteCode });
      return invite ? invite.inviteCodeStatus : null;
    } catch (error) {
      console.error('Error fetching invite code status:', error);
      throw error; // Rethrow or handle as needed
    }
  };
export const setUsedCode = async (inviteCode: string): Promise<void> => {
    try {
      const invite = await InviteCodeModel.findOne({ inviteCode: inviteCode });
  
      if (!invite) {
        console.error(`Invite code '${inviteCode}' not found.`);
        throw new Error('Invite code not found');
      }
  
      invite.inviteCodeStatus = "used";
      await invite.save(); // Save the updated document
    } catch (error) {
      console.error('Error updating invite code status:', error);
      throw error; // Rethrow or handle as needed
    }
  };
  

export const createInviteCode = (value:Record<string,any>)=> new InviteCodeModel(value).save().then((inviteCode)=>inviteCode.toObject());


export default InviteCodeModel;