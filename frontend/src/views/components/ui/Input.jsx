import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function Input({ label, error, type = 'text', rightLabel, className = '', ...props }) {
  const [show, setShow] = useState(false);
  const isPassword = type === 'password';

  return (
    <div className="flex flex-col gap-1.5">
      {(label || rightLabel) && (
        <div className="flex items-center justify-between">
          {label && <label className="text-sm font-medium text-slate-300">{label}</label>}
          {rightLabel}
        </div>
      )}
      <div className="relative">
        <input
          type={isPassword && show ? 'text' : type}
          className={`w-full px-4 py-3 rounded-xl bg-slate-800 border text-slate-100 placeholder-slate-600 outline-none transition-all duration-150 focus:ring-2 ${
            error
              ? 'border-red-500/60 focus:ring-red-500/20 focus:border-red-500'
              : 'border-slate-700 focus:ring-orange-500/20 focus:border-orange-500'
          } ${isPassword ? 'pr-11' : ''} ${className}`}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((s) => !s)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors cursor-pointer"
          >
            {show ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
    </div>
  );
}
