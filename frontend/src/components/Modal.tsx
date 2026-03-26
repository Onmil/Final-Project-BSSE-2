import { useState } from "react";
import "./Modal.css";

interface ModalProps {
  type: "login" | "signup";
  onClose: () => void;
  onSwitch: (type: "login" | "signup") => void;
  onSuccess: (user: { name: string; email: string }) => void;
}

interface FormErrors {
  name?: string;
  email?: string;
  password?: string;
}

const registeredEmails: string[] = [];

function getPasswordStrength(password: string): { label: string; color: string; score: number } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;

  if (score <= 1) return { label: "Weak", color: "#e74c3c", score };
  if (score === 2) return { label: "Fair", color: "#f39c12", score };
  if (score === 3) return { label: "Good", color: "#2ecc71", score };
  return { label: "Strong", color: "#27ae60", score };
}

export default function Modal({ type, onClose, onSwitch, onSuccess }: ModalProps) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);

  const strength = getPasswordStrength(form.password);

  const validate = (): FormErrors => {
    const e: FormErrors = {};

    if (type === "signup" && !form.name.trim())
      e.name = "Full name is required.";

    if (!form.email.trim())
      e.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Enter a valid email address.";
    else if (type === "signup" && registeredEmails.includes(form.email.toLowerCase()))
      e.email = "This email is already used.";

    if (!form.password)
      e.password = "Password is required.";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters.";
    else if (type === "signup" && strength.score < 3)
      e.password = "Too weak — add uppercase letters and numbers.";

    return e;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    if (type === "signup") registeredEmails.push(form.email.toLowerCase());
    onSuccess({ name: form.name || form.email.split("@")[0], email: form.email });
  };

  const handleSwitch = (t: "login" | "signup") => {
    setForm({ name: "", email: "", password: "" });
    setErrors({});
    onSwitch(t);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>✕</button>

        <h2 className="modal-title">
          {type === "login" ? "Welcome Back" : "Create Account"}
        </h2>
        <p className="modal-subtitle">
          {type === "login"
            ? "Log in to continue your journey"
            : "Sign up and start exploring"}
        </p>

        <form onSubmit={handleSubmit} className="modal-form">
          {type === "signup" && (
            <div className="modal-field">
              <label>Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Peter Parker"
                value={form.name}
                onChange={handleChange}
                className={errors.name ? "input-error" : ""}
              />
              {errors.name && <span className="field-error">{errors.name}</span>}
            </div>
          )}

          <div className="modal-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="peterparker@gmail.com"
              value={form.email}
              onChange={handleChange}
              className={errors.email ? "input-error" : ""}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="modal-field">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className={errors.password ? "input-error" : ""}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((v) => !v)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}

            {type === "signup" && form.password.length > 0 && (
              <div className="strength-bar-wrap">
                <div className="strength-bar">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="strength-segment"
                      style={{ background: i <= strength.score ? strength.color : "#e0e0e0" }}
                    />
                  ))}
                </div>
                <span className="strength-label" style={{ color: strength.color }}>
                  {strength.label}
                </span>
              </div>
            )}
          </div>

          <button type="submit" className="modal-submit">
            {type === "login" ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="modal-switch">
          {type === "login" ? (
            <>Don't have an account?{" "}
              <span onClick={() => handleSwitch("signup")}>Sign up</span>
            </>
          ) : (
            <>Already have an account?{" "}
              <span onClick={() => handleSwitch("login")}>Log in</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}