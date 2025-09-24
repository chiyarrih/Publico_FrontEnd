import { useState } from "react";
import { Link } from "react-router-dom";

/**
 * SIGNUP PAGE (friendly and explicit)
 * - First/Last name, email, password + confirm
 * - Role choice
 * - T&C checkbox
 * - Clear handlers and small checks
 */

type Role = "citizen" | "agency";

interface SignupForm {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: Role;
  agree: boolean;
}

export default function SignupPage() {
  const [form, setForm] = useState<SignupForm>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "citizen",
    agree: false,
  });

  const updateField = (name: keyof SignupForm, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [name]: value }));

  const onTextChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField(e.target.name as keyof SignupForm, e.target.value);

  const onCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField(e.target.name as keyof SignupForm, e.target.checked);

  const onRoleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateField("role", e.target.value as Role);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // polite, human checks
    if (!form.firstName || !form.lastName) {
      alert("Please enter your first and last name.");
      return;
    }
    if (form.password !== form.confirmPassword) {
      alert("Passwords don’t match. Please try again.");
      return;
    }
    if (!form.agree) {
      alert("Please agree to the Terms and Conditions to continue.");
      return;
    }

    // 👉 TODO: call your signup API here
    // await axios.post('/auth/signup', form)
    console.log("Signup payload:", form);
  };

  return (
    <div className="min-h-screen grid place-items-center bg-blue-50">
      <main className="bg-white w-full max-w-md rounded-lg shadow p-8">
        <p className="text-center text-blue-700 font-semibold mb-3">Publico</p>
        <h1 className="text-center text-xl font-bold text-gray-800 mb-6">
          Create an Account
        </h1>

        <form onSubmit={onSubmit} className="space-y-4" aria-label="Signup form">
          {/* NAME ROW */}
          <div className="flex gap-2">
            <label className="w-1/2">
              <span className="sr-only">First Name</span>
              <input
                className="w-full border rounded-md p-2 focus:outline-blue-500"
                name="firstName"
                placeholder="First Name"
                value={form.firstName}
                onChange={onTextChange}
                autoComplete="given-name"
                required
              />
            </label>

            <label className="w-1/2">
              <span className="sr-only">Last Name</span>
              <input
                className="w-full border rounded-md p-2 focus:outline-blue-500"
                name="lastName"
                placeholder="Last Name"
                value={form.lastName}
                onChange={onTextChange}
                autoComplete="family-name"
                required
              />
            </label>
          </div>

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

          {/* PASSWORDS */}
          <label className="block">
            <span className="sr-only">Password</span>
            <input
              className="w-full border rounded-md p-2 focus:outline-blue-500"
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={onTextChange}
              autoComplete="new-password"
              required
            />
          </label>

          <label className="block">
            <span className="sr-only">Confirm Password</span>
            <input
              className="w-full border rounded-md p-2 focus:outline-blue-500"
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={onTextChange}
              autoComplete="new-password"
              required
            />
          </label>

           {/* ROLE PICKER */}
          <fieldset className="flex flex-col gap-2 text-sm">
            <legend className="sr-only">Sign up as</legend>
            <span className="mb-1 font-medium text-gray-700">I am creating an account as a:</span>
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

          {/* TERMS */}
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              name="agree"
              checked={form.agree}
              onChange={onCheckboxChange}
              required
            />
            <span>
              I agree to the <a className="text-blue-600 hover:underline">Terms and Conditions</a>
            </span>
          </label>

          {/* SUBMIT */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>

        {/* LINK TO LOGIN */}
        <p className="text-center text-sm mt-4">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
