import db from './database/dbPrepare.js';
import { GraphQLError } from 'graphql';
import {v4 as uuidv4} from 'uuid';

const resolvers = {
    Query: {
        task: async () => {
            try {
                let my_list:any[] = [];
                await new Promise((resolve, reject) => {
                    db.each("SELECT * FROM task", (err, row) => {
                        if (err) {
                            reject(err);
                        }
                        my_list.push(row);
                    }, resolve);
                });
                return my_list;
            } catch (e) {
                throw new GraphQLError("Something Went Wrong");
            }
        }
    },
    Mutation: {
        addTask: async (_: any, { description, completed }: any) => {
            try {
                const id = uuidv4();
                await new Promise<void>((resolve, reject) => {
                    db.run("INSERT INTO task (id, description, completed) VALUES (?, ?, ?);", [id, description, completed], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                return { id, description, completed };
            } catch (e) {
                console.log(e);
                throw new GraphQLError("Something Went Wrong");
            }
        },
        updateTask: async (_: any, { id, description, completed }: any) => {
            try {
                await new Promise<void>((resolve, reject) => {
                    db.run("UPDATE task SET description = ?, completed = ? WHERE id = ?;", [description, completed, id], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                return { id, description, completed };
            } catch (e) {
                console.log(e);
                throw new GraphQLError("Something Went Wrong");
            }
        },
        deleteTask: async (_: any, { id }: any) => {
            try {
                await new Promise<void>((resolve, reject) => {
                    db.run("DELETE FROM task WHERE id = ?;", [id], (err) => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
                return { id };
            } catch (e) {
                console.log(e);
                throw new GraphQLError("Something Went Wrong");
            }
        }
    }
}

export default resolvers;
