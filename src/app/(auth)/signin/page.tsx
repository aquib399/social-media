import SignInForm from "./signInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In",
};

export default function SignInPage() {
  return (
    <>
      <SignInForm />
    </>
  );
}
