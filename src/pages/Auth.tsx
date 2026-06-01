import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

export default function Auth() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

const handleSignup = async () => {
  try {
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      console.error(error);
      alert(error.message);
      return;
    }

    // Create matching profile row
    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: data.user.id,
            username: email.split("@")[0],
          },
        ]);

      if (profileError) {
        console.error(profileError);
      }
    }

    alert("Signup successful!");
    navigate("/todos");

  } catch (err) {
    console.error(err);
    alert("Signup failed");
  } finally {
    setLoading(false);
  }
};

  const handleLogin = async () => {
    try {
      setLoading(true);

      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      console.log("LOGIN DATA:", data);

      if (error) {
        console.error("LOGIN ERROR:", error.message);
        alert(error.message);
        return;
      }

      alert("Login successful!");

      // Redirect after login
      navigate("/todos");
    } catch (err) {
      console.error(err);
      alert("Something went wrong during login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="bg-[#111827] p-8 rounded-2xl w-[400px] border border-gray-800 shadow-2xl">

        <h1 className="text-3xl font-bold mb-2 text-center">
          Study Together
        </h1>

        <p className="text-gray-400 text-center mb-6">
          Login or create your account
        </p>

        <input
          type="email"
          placeholder="Enter email"
          className="w-full p-3 mb-4 rounded-lg bg-[#1f2937] outline-none border border-gray-700"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Enter password"
          className="w-full p-3 mb-6 rounded-lg bg-[#1f2937] outline-none border border-gray-700"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleSignup}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 transition-all p-3 rounded-lg mb-4 disabled:opacity-50"
        >
          {loading ? "Loading..." : "Sign Up"}
        </button>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 transition-all p-3 rounded-lg disabled:opacity-50"
        >
          {loading ? "Loading..." : "Login"}
        </button>
      </div>
    </div>
  );
}