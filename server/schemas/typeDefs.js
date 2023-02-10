const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Book {
        _id: ID!
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type User {
        _id: ID!
        username: String!
        email: String!
        bookCount: Int
        savedBooks: [Book]
    }

    type Auth {
        token: ID!
        user: User
    }

    input BookInput {
        authors: [String]
        description: String!
        bookId: String!
        image: String
        link: String
        title: String!
    }

    type Query {
       # getUsers: [User]
       # getSingleUser(username: String!): User
        me: User
    }

    type Mutation {
        addUser(username: String!, email: String!, password: String!): Auth
        login(email: String!, password: String!): Auth        
        # saveBook(input: BookInput!): User
        saveBook(authors: [String], description: String!, bookId: String!, image: String, link: String, title: String! ): User
        removeBook(bookId: String!): User
    }
`;

module.exports = typeDefs;