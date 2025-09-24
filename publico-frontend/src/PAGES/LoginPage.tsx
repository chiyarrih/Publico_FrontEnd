import { useState } from "react";
import { Link } from "react-router-dom";

type Role = "citizen" | "agency";

interface LoginForm {
  email: string;
  password: string;
  role: Role;
  remember: boolean;
}

export default function LoginPage() {
  // keep all form state in one place so it's easy to read
  
  const [form, setForm] = useState<LoginForm>({
    email: "",
    password: "",
    role: "citizen",
    remember: false,
  });

  // tiny helpers so our JSX stays clean
  const updateField = (name: keyof LoginForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  // one handler for text inputs (email/password)
  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField(e.target.name as keyof LoginForm, e.target.value);

  // two tiny helpers for checkbox and radio for clarity
  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField(e.target.name as keyof LoginForm, e.target.checked);

  const onRoleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField("role", e.target.value as Role);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // very light guardrails; keep UX friendly
    if (!form.email || !form.password) {
      alert("Please enter your email and password.");
      return;
    }

    // 👉 TODO: call your login API here
    // await axios.post('/auth/login', form)
    console.log("Login payload:", form);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-blue-50">
      <main className="bg-white w-full max-w-md rounded-lg shadow p-8">
        {/* tiny brand line to match your mock */}
        <p className="text-center text-blue-700 font-semibold mb-3">Publico</p>
        <h1 className="text-center text-xl font-bold text-gray-800 mb-6">
          Log In to Publico
        </h1>

        <form onSubmit={onSubmit} className="space-y-4" aria-label="Login form">
          {/* EMAIL */}
          <label className="block">
            <span className="sr-only">Email</span>
            <input
              className="w-full border rounded-md p-2 focus:outline-blue-500"
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={onTextChange}
              autoComplete="email"
              required
            />
          </label>

          {/* PASSWORD */}
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              className="w-full border rounded-md p-2 focus:outline-blue-500"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onTextChange}
              autoComplete="current-password"
              required
            />
          </label>

           {/* ROLE PICKER */}
          <fieldset className="flex flex-col gap-2 text-sm">
            <legend className="sr-only">Login as</legend>
            <span className="mb-1 font-medium text-gray-700">I am:</span>
            <div className="flex items-center gap-6">
              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="citizen"
                  checked={form.role === "citizen"}
                  onChange={onRoleChange}
                />
                <span>Citizen</span>
              </label>

              <label className="inline-flex items-center gap-2">
                <input
                  type="radio"
                  name="role"
                  value="agency"
                  checked={form.role === "agency"}
                  onChange={onRoleChange}
                />
                <span>Agency Representative</span>
              </label>
            </div>
          </fieldset>

          {/* REMEMBER / FORGOT */}
          <div className="flex items-center justify-between text-sm">
            <label className="inline-flex items-center gap-2">
              <input
                type="checkbox"
                name="remember"
                checked={form.remember}
                onChange={onCheckboxChange}
              />
              <span>Remember me</span>
            </label>

            {/* wire this up later */}
            <button type="button" className="text-blue-600 hover:underline">
              Forgot password?
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Log In
          </button>
        </form>

        {/* LINK TO SIGNUP */}
        <p className="text-center text-sm mt-4">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </main>
    </div>
  );
}
