export const host = import.meta.env.MODE === "development" ? "http://localhost:5174" : "https://cuet-community.onrender.com";

export const updateUserRoute = `/api/user/update`;
export const findUserByIdRoute = `/api/user/findUserById`;
export const getAllCommentsRoute = `/api/comment/getAllComments`;
export const signupRoute = `/api/auth/signup`;
export const signinRoute = `/api/auth/signin`;
export const findUsersRoute = `/api/user/find/users`;
export const addMessageRoute = `/api/messages/addMessage`;
export const commentRoute = `$/api/comment`;
export const postCreateRoute = `/api/post/create`;
export const postRoute = `/api/post`;
export const getPostsRoute = `/api/post/getPosts`;
export const signoutRoute = `/api/user/signout`;
export const getAllMessagesRoute = `/api/messages/getAllMessages`;
