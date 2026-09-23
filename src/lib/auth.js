import { account } from "./appwrite";

export async function login(email, password) {
  return account.createEmailPasswordSession(email, password);
}

export async function getCurrentUser() {
  try {
    return await account.get();
  } catch {
    return null;
  }
}

export async function logout() {
  return account.deleteSession("current");
}