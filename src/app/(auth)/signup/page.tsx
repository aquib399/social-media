import SignUpForm from "./signUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign Up",
};

export default function SignUpPage() {
  return (
    <>
      <SignUpForm />
    </>
  );
}
