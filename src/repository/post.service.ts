 import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, where } from "firebase/firestore";
// import { Post } from "@/types";
import { db } from "../firebaseConfig";

interface Post {
  id?: string; // Optional as Firestore assigns this automatically
  name: string;
  description: string;
  parentId: string | null;
}

const COLLECTION_NAME = "posts";

export const createPost = async (post: Post) => {
  try {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), post);
    return docRef.id; // Return the ID of the newly created document
  } catch (error) {
    console.error("Error adding document: ", error);
    throw error;
  }
};

export const getPosts = async () => {
  try {
    const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export const getPostByParentId = async (id: string) => {
  try {
    const q = query(collection(db, COLLECTION_NAME), where("parentId", "==", id));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Post));
  } catch (error) {
    console.error("Error getting documents: ", error);
    throw error;
  }
};

export const getPost = async (id: string) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return { id: docSnapshot.id, ...docSnapshot.data() } as Post;
    } else {
      throw new Error("employee not found");
    }
  } catch (error) {
    console.error("Error getting document: ", error);
    throw error;
  }
};

export const deletePost = async (id: string) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error("Error deleting document: ", error);
    throw error;
  }
};
