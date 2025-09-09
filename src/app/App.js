import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, UserButton } from "@clerk/clerk-react";

import { SignInPage, SignUpPage } from "./auth";

function Home() {
  return (
    <div>
      <h1>NASA Space App</h1>
      <SignedIn>
        <p>Welcome back!</p>
        <UserButton />
      </SignedIn>
      <SignedOut>
        <p>You are signed out. Please sign in or sign up.</p>
      </SignedOut>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign-in/*" element={<SignInPage />} />
        <Route path="/sign-up/*" element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}
