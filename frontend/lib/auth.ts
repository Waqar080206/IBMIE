import {
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  UserCredential,
} from "firebase/auth";

import { auth, googleProvider } from "./firebase";

function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    switch ((error as { code: string }).code) {
      case "auth/email-already-in-use":
        return "An account with this email already exists.";

      case "auth/invalid-email":
        return "Please enter a valid email address.";

      case "auth/invalid-credential":
      case "auth/wrong-password":
      case "auth/user-not-found":
        return "Incorrect email or password.";

      case "auth/weak-password":
        return "Password must be at least 6 characters long.";

      case "auth/too-many-requests":
        return "Too many attempts. Please try again later.";

      case "auth/popup-closed-by-user":
        return "Google sign-in was cancelled.";

      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";

      default:
        return "Something went wrong. Please try again.";
    }
  }

  return "Something went wrong. Please try again.";
}

export async function signInWithGoogle(): Promise<UserCredential> {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function signUpWithEmail(
  email: string,
  password: string,
  displayName?: string
): Promise<UserCredential> {
  try {
    const credential =
      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

    if (displayName) {
      await updateProfile(credential.user, {
        displayName,
      });
    }

    return credential;
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<UserCredential> {
  try {
    return await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export async function logout(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error) {
    throw new Error(getErrorMessage(error));
  }
}

export { auth };

