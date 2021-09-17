import * as bcrypt from 'bcrypt'

export const hash = (password) => {
    try {
        return bcrypt.hashSync(password,10)
    } catch (error) {
        console.log(error)
    }
}