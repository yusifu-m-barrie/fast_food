// import {Account, Avatars, Client, Databases, ID, Query, Storage} from "react-native-appwrite";
// import {CreateUserParams, GetMenuParams, SignInParams} from "@/type";
//
//
// export const appwriteConfig = {
//     endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
//     projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
//     platform: "com.ayon.fastfood",
//     databaseId: '6887a29c000e2bcc1b6e',
//     bucketId: '6887df6f0008bc667e6b',
//     userCollectionId: '6887a2bc003b81e441a4',
//     categoriesCollectionId: '6887da230011cbcab5cb',
//     menuCollectionId: '6887db2b002440d0f80f',
//     customizationsCollectionId: '6887dd39001eca9a8b83',
//     menuCustomizationsCollectionId: '6887de3f002243c88c74'
// }
//
// export const client = new Client();
//
// client
//     .setEndpoint(appwriteConfig.endpoint)
//     .setProject(appwriteConfig.projectId)
//     .setPlatform(appwriteConfig.platform)
//
// export const account = new Account(client);
// export const databases = new Databases(client);
// export const storage = new Storage(client);
// const avatars = new Avatars(client);
//
// export const createUser = async ({ email, password, name }: CreateUserParams) => {
//     try {
//         const newAccount = await account.create(ID.unique(), email, password, name)
//         if(!newAccount) throw Error;
//
//         await signIn({ email, password });
//
//         const avatarUrl = avatars.getInitialsURL(name);
//
//         return await databases.createDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.userCollectionId,
//             ID.unique(),
//             { email, name, accountId: newAccount.$id, avatar: avatarUrl }
//         );
//     } catch (e) {
//         throw new Error(e as string);
//     }
// }
//
// export const signIn = async ({ email, password }: SignInParams) => {
//     try {
//         const session = await account.createEmailPasswordSession(email, password);
//     } catch (e) {
//         throw new Error(e as string);
//     }
// }
//
// export const getCurrentUser = async () => {
//     try {
//         const currentAccount = await account.get();
//         if(!currentAccount) throw Error;
//
//         const currentUser = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.userCollectionId,
//             [Query.equal('accountId', currentAccount.$id)]
//         )
//
//         if(!currentUser) throw Error;
//
//         return currentUser.documents[0];
//     } catch (e) {
//         console.log(e);
//         throw new Error(e as string);
//     }
// }
//
// export const getMenu = async ({ category, query }: GetMenuParams) => {
//     try {
//         const queries: string[] = [];
//
//         if(category) queries.push(Query.equal('categories', category));
//         if(query) queries.push(Query.search('name', query));
//
//         const menus = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.menuCollectionId,
//             queries,
//         )
//
//         return menus.documents;
//     } catch (e) {
//         throw new Error(e as string);
//     }
// }
//
// export const getCategories = async () => {
//     try {
//         const categories = await databases.listDocuments(
//             appwriteConfig.databaseId,
//             appwriteConfig.categoriesCollectionId,
//         )
//
//         return categories.documents;
//     } catch (e) {
//         throw new Error(e as string);
//     }
// }

import {
    Account,
    Avatars,
    Client,
    Databases,
    ID,
    Query,
    Storage,
} from "react-native-appwrite";
import {
    CreateUserParams,
    GetMenuParams,
    SignInParams,
} from "@/type";

export const appwriteConfig = {
    endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT!,
    projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!,
    platform: "com.ayon.fastfood",
    databaseId: "6887a29c000e2bcc1b6e",
    bucketId: "6887df6f0008bc667e6b",
    userCollectionId: "6887a2bc003b81e441a4",
    categoriesCollectionId: "6887da230011cbcab5cb",
    menuCollectionId: "6887db2b002440d0f80f",
    customizationsCollectionId: "6887dd39001eca9a8b83",
    menuCustomizationsCollectionId: "6887de3f002243c88c74",
};

export const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint)
    .setProject(appwriteConfig.projectId)
    .setPlatform(appwriteConfig.platform);

export const account = new Account(client);
export const databases = new Databases(client);
export const storage = new Storage(client);
const avatars = new Avatars(client);

export const createUser = async ({
                                     email,
                                     password,
                                     name,
                                 }: CreateUserParams) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, name);
        if (!newAccount) throw Error;

        await signIn({ email, password });

        const avatarUrl = avatars.getInitialsURL(name);

        return await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                email,
                name,
                accountId: newAccount.$id,
                avatar: avatarUrl,
            }
        );
    } catch (e) {
        throw new Error(e as string);
    }
};

export const signIn = async ({ email, password }: SignInParams) => {
    try {
        await account.createEmailPasswordSession(email, password);
    } catch (e) {
        throw new Error(e as string);
    }
};

export const logout = async () => {
    try {
        await account.deleteSession("current");
    } catch (e) {
        throw new Error(e as string);
    }
};

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal("accountId", currentAccount.$id)]
        );

        if (!currentUser || currentUser.documents.length === 0) throw Error;

        return currentUser.documents[0];
    } catch (e) {
        console.log(e);
        throw new Error(e as string);
    }
};

export const updateUserProfile = async (docId: string, updatedFields: any) => {
    try {
        return await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            docId,
            updatedFields
        );
    } catch (e) {
        throw new Error(e as string);
    }
};

export const uploadAvatar = async (file: File | Blob) => {
    try {
        const uploaded = await storage.createFile(
            appwriteConfig.bucketId,
            ID.unique(),
            file
        );

        return storage.getFilePreview(appwriteConfig.bucketId, uploaded.$id);
    } catch (e) {
        throw new Error(e as string);
    }
};

export const getMenu = async ({ category, query }: GetMenuParams) => {
    try {
        const queries: string[] = [];

        if (category) queries.push(Query.equal("categories", category));
        if (query) queries.push(Query.search("name", query));

        const menus = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.menuCollectionId,
            queries
        );

        return menus.documents;
    } catch (e) {
        throw new Error(e as string);
    }
};

export const getCategories = async () => {
    try {
        const categories = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.categoriesCollectionId
        );

        return categories.documents;
    } catch (e) {
        throw new Error(e as string);
    }
};
