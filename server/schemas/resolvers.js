const { AuthenticationError } = require('apollo-server-express');
const { User } = require('../models');
const { signToken } = require('../utils/auth');

const resolvers = {
    Query: {
        // getSingleUser: async (_, {username}) => {
        //     return await User.findOne({username})        
        //     .populate('savedBooks');
        // },
        me: async (_, __, context) => {
            if (context.user) {
                return await User.findOne(
                    {_id: context.user._id}
                ).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        }
    },

    Mutation: {
        addUser: async (_, {username, email, password}) => {
            const user = await User.create({username, email, password});
            const token = signToken(user);
            return { token, user};
        },
        login: async (_, {email, password}) => {
            const user = await User.findOne({email});

            if(!user){
                throw new AuthenticationError('No user with this email found!');
            }

            const corretPw = await user.isCorrectPassword(password);

            if(!corretPw){
                throw new AuthenticationError('Incorrect password!');
            }

            const token = signToken(user);
            return { token, user};
        },
        saveBook: async (_, {authors, description, bookId, image, link, title}, context) => {
            if (context.user){
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$addToSet: {savedBooks: {authors, description, bookId, image, link, title}}},
                    {new: true}
                ).populate('savedBooks');
            }
            throw new AuthenticationError('You need to be logged in!');
        },
        removeBook: async (_, {bookId}, context)=>{
            if( context.user){
                return await User.findOneAndUpdate(
                    {_id: context.user._id},
                    {$pull: {savedBooks: {bookId: bookId}}},
                    {new: true}
                ).populate('savedBooks');
            }
        }
    }
}

module.exports = resolvers;