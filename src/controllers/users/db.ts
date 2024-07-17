import { User } from '../../model/schema'

export async function createUserDB(data: any){
    try {
        const newUser = await User.create(data)
        console.log(newUser)
        return {
            status: "Success",
            data: newUser
        }
    } catch (err) {
        return {
            status: "Failed",
            message: err
        }
    }
}