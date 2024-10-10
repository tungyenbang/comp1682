const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { generalAccessToken, generalRefreshToken } = require("./JwtService");

const createUser = (newUser) => {
    return new Promise(async (resolve, reject) => {

        const { name, email, password, confirmPassword, phone } = newUser
        try {
            const checkUser = await User.findOne({ email: email })
            if (checkUser !== null) {
                resolve({
                    status: 'ERR',
                    message: 'the email is already '                
                })
            }
            const hash = bcrypt.hashSync(password, 10)
            
            const createUser = await User.create({
                name, 
                email, 
                password: hash,  

                phone
            })
            if(createUser){
                resolve({
                    status: 'OK',
                    message: 'success',
                    data: createUser
                }) 
            }
            
        } catch (e) {
            reject(e);
        }

    })
}

const loginUser = (userLogin) => {
    return new Promise(async (resolve, reject) => {

        const { name, email, password, confirmPassword, phone } = userLogin;
        try {
            const checkUser = await User.findOne({ email: email })
            if (checkUser === null) {
                resolve({
                    status: 'ERR',
                    message: 'the user is not defined'                
                })
            }
            const comparePassword = bcrypt.compareSync(password, checkUser.password)
            if (!comparePassword){
                resolve({
                            status: 'ERR',
                            message: 'the password is incorrect',
                        }) 
            } 

            const access_token = await generalAccessToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })

            const refresh_token = await generalRefreshToken({
                id: checkUser.id,
                isAdmin: checkUser.isAdmin
            })


            resolve({
                status: 'OK',
                message: 'Successfully login',
                access_token,
                refresh_token
            }) 
            
            
            // const createUser = await User.create({
            //     name, 
            //     email, 
            //     password: hash,  

            //     phone
            // })
            // if(createUser){
            //     resolve({
            //         status: 'OK',
            //         message: 'success',
            //         data: createUser
            //     }) 
            // }
            
        } catch (e) {
            reject(e);
        }

    })
}

const updateUser = (id, data) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id: id});
            console.log('checkUser', checkUser)
            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'the user is not defined'                
                })
            }

            const updateUser = await User.findByIdAndUpdate(id, data, {new: true});

            resolve({
                status: 'OK',
                message: 'Successfully login',
                data: updateUser
            }) 
            
            
        } catch (e) {
            reject(e);
        }

    })
}

const deleteUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id: id});

            if (checkUser === null) {
                resolve({
                    status: 'OK',
                    message: 'the user is not defined'                
                })
            }

            await User.findByIdAndDelete(id);

            resolve({
                status: 'OK',
                message: 'Delete is Successfully',
            }) 
            
            
        } catch (e) {
            reject(e);
        }

    })
}

const getAllUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const checkUser = await User.findOne({_id: id});

            const allUser = await User.find()

            resolve({
                status: 'OK',
                message: 'Successfully',
                data: allUser
            }) 
            
            
        } catch (e) {
            reject(e);
        }

    })
}


const getDetailsUser = (id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({_id: id});

            if (user === null) {
                resolve({
                    status: 'OK',
                    message: 'the user is not defined'                
                })
            }


            resolve({
                status: 'OK',
                message: 'SUCESS',
                data: user
            }) 
            
            
        } catch (e) {
            reject(e);
        }

    })
}




module.exports = {
    createUser,
    loginUser,
    updateUser,
    deleteUser,
    getAllUser,
    getDetailsUser
}