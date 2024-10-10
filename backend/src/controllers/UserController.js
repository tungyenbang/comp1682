const UserService = require('../services/UserService')
const JwtService = require('../services/JwtService')

const createUser = async (req, res) => {
    try {
        console.log(req.body)
        const {name, email, password, confirmPassword, phone} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if(!email || !password || !confirmPassword)  {
            return res.status(200).json({
                status: 'ERR',
                message: 'Input required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input email '
            })
        } else if(password !== confirmPassword) {
            return res.status(200).json({
                status: 'ERR',
                message: 'the password is equal to the confirm password'
            })
        }
        console.log('isCheckEmail', isCheckEmail)
        const response = await UserService.createUser(req.body) 
        return res.status(200).json(response)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const loginUser = async (req, res) => {
    try {
        console.log(req.body)
        const {email, password} = req.body
        const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
        const isCheckEmail = reg.test(email)
        if(!email || !password )  {
            return res.status(200).json({
                status: 'ERR',
                message: 'Input required'
            })
        } else if (!isCheckEmail) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The input email '
            })
        } 
        console.log('isCheckEmail', isCheckEmail)
        const response = await UserService.loginUser(req.body) 
        const {refresh_token, ...newReponse} = response
        res.cookie('refresh_token', refresh_token, ({
            httpOnly: true,
            secure: false,
            samesite: 'strict'
        }))
        return res.status(200).json(newReponse)
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const updateUser = async (req, res) => {
    try {
        const userId = req.params.id
        const data = req.body
        if (!userId){
            return res.status(200).json({
                status: 'ERR',
                message: "The user is required "
        })}
        console.log('userId', userId)
        const response = await UserService.updateUser(userId, data) 
        return res.status(200).json(response)
    
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const deleteUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId){
            return res.status(200).json({
                status: 'ERR',
                message: "The user is required "
        })}
        const response = await UserService.deleteUser(userId) 
        return res.status(200).json(response)
    
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const getAllUser = async (req, res) => {
    try {
        const response = await UserService.getAllUser() 
        return res.status(200).json(response)
    
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const getDetailsUser = async (req, res) => {
    try {
        const userId = req.params.id
        if (!userId){
            return res.status(200).json({
                status: 'ERR',
                message: "The user is required "
        })}
        const response = await UserService.getDetailsUser(userId) 
        return res.status(200).json(response)
    
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const refreshToken = async (req, res) => {
    try {
        const token = req.cookies.refresh_token
        if (!token){
            return res.status(200).json({
                status: 'ERR',
                message: "The token is required "
        })}
        const response = await JwtService.refreshToken(token) 
        return res.status(200).json(response)
    
    } catch (err) {
        return res.status(404).json({message: err});
    }
}

const logoutUser = async (req, res) => {
    try {
        res.clearCookie('refresh_token')

        return res.status(200).json({
            status: 'OK',
            message: 'Logged out'
        })
    
    } catch (err) {
        return res.status(404).json({message: err});
    }
}



module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser,
    refreshToken,
    logoutUser
}