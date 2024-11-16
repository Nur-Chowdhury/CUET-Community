export const host = import.meta.env.MODE === "development" ? "http://localhost:5174" : "https://cuet-community.onrender.com";

export const updateUserRoute = `${host}/api/user/update`;
export const findUserByIdRoute = `${host}/api/user/findUserById`;
export const getAllCommentsRoute = `${host}/api/comment/getAllComments`;
export const signupRoute = `${host}/api/auth/signup`;
export const signinRoute = `${host}/api/auth/signin`;
export const findUsersRoute = `${host}/api/user/find/users`;
export const addMessageRoute = `${host}/api/messages/addMessage`;
export const commentRoute = `${host}/api/comment`;
export const postCreateRoute = `${host}/api/post/create`;
export const postRoute = `${host}/api/post`;
export const getPostsRoute = `${host}/api/post/getPosts`;
export const signoutRoute = `${host}/api/user/signout`;
export const getAllMessagesRoute = `${host}/api/messages/getAllMessages`;
