import { User } from '../../model/schema'

export async function createUserDB(data: any){
    try {
        const newUser = await User.create(data)
        return {
            success: true,
            data: newUser
        }
    } catch (err) {
        return {
            success: false,
            message: err
        }
    }
}

export async function getUserSingle(param: any){
    let payload = {}
    try {
        const user = await User.find(param)
        return {
            success: true,
            data: user
        }
    } catch (err) {
        return {
            success: false,
            message: err
        }
    }
}