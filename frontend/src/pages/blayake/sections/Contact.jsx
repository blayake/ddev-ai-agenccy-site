import { useCallback, useState } from "react";
import axios from "axios";
import { ArrowRight } from "lucide-react";
import { Magnetic } from "@/components/Cursor";
import { API } from "@/pages/blayake/data";

const FIELD_CLS =
  "w-full bg-white/[0.03] border border-white/[0.08] focus:border-white/40 outline-none rounded-2xl px-5 py-4 text-white placeholder:text-white/30 transition-colors";

const INITIAL_FORM = { name: "", email: "", phone: "", message: "" };

function ContactHeader() {
  return (
    <div className="text-center">
      <div className="font-mono-tech text-[10px] uppercase tracking-[0.32em] text-white/40 mb-5">
        / Let's build
      </div>
      <h2 className="font-display font-black text-5xl md:text-7xl tracking-tighter leading-[0.92] text-balance">
        Let's build the <br /> <span className="text-white/40 italic font-medium">future.</span>
      </h2>
      <p className="mt-6 text-white/60 max-w-md mx-auto leading-relaxed">
        Drop your details below and we'll get back to you within 24 hours.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3 font-mono-tech text-[11px] uppercase tracking-[0.22em]">
        <a
          href="mailto:teamblayake.agency@gmail.com"
          data-cursor="hover"
          data-testid="contact-email"
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 hover:text-white hover:border-white/25 transition"
        >
          teamblayake.agency@gmail.com
        </a>
        <a
          href="https://x.com/blayake"
          target="_blank"
          rel="noopener noreferrer"
          data-cursor="hover"
          data-testid="contact-x"
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 text-white/80 hover:text-white hover:border-white/25 transition"
        >
          @blayake on X
        </a>
      </div>
    </div>
  );
}

function StatusLine({ state, msg }) {
  return (
    <div
      className="text-center font-mono-tech text-[10px] uppercase tracking-[0.22em] min-h-[1rem]"
      data-testid="form-status"
    >
      {state === "success" && <span className="text-emerald-400">{msg}</span>}
      {state === "error" && <span className="text-red-400">{msg}</span>}
    </div>
  );
}

function buildPayload(form) {
  return {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: form.phone.trim() || null,
    message: form.message.trim() || null,
  };
}

export default function Contact() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState({ state: "idle", msg: "" });

  const update = useCallback(
    (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value })),
    []
  );

  const submit = useCallback(
    async (e) => {
      e.preventDefault();
      setStatus({ state: "loading", msg: "" });
      try {
        await axios.post(`${API}/leads`, buildPayload(form));
        setStatus({ state: "success", msg: "Got it. We'll be in touch within 24 hours." });
        setForm(INITIAL_FORM);
      } catch (err) {
        const detail = err?.response?.data?.detail;
        const msg = typeof detail === "string" ? detail : "Something went wrong. Please try again.";
        setStatus({ state: "error", msg });
      }
    },
    [form]
  );

  return (
    <section id="contact" className="relative py-28 md:py-40 px-6 md:px-12 max-w-4xl mx-auto">
      <ContactHeader />
      <form
        onSubmit={submit}
        className="mt-14 glass rounded-3xl p-6 md:p-8 space-y-4"
        data-testid="contact-form"
      >
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Full Name</label>
          <input required value={form.name} onChange={update("name")} className={FIELD_CLS} placeholder="e.g. Julian Anderson" data-testid="form-name" data-cursor="hover" />
        </div>
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Email Address</label>
          <input required type="email" value={form.email} onChange={update("email")} className={FIELD_CLS} placeholder="julian@visionary.ai" data-testid="form-email" data-cursor="hover" />
        </div>
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">Phone Number</label>
          <input type="tel" value={form.phone} onChange={update("phone")} className={FIELD_CLS} placeholder="+1 (415) 867-5309" data-testid="form-phone" data-cursor="hover" />
        </div>
        <div>
          <label className="block font-mono-tech text-[10px] uppercase tracking-[0.22em] text-white/50 mb-2">What are you trying to build?</label>
          <textarea rows={3} value={form.message} onChange={update("message")} className={`${FIELD_CLS} resize-none`} placeholder="A quick line about your idea, stack, or stuck-point." data-testid="form-message" data-cursor="hover" />
        </div>
        <Magnetic strength={0.12} className="block w-full">
          <button
            type="submit"
            disabled={status.state === "loading"}
            data-testid="form-submit"
            data-cursor="hover"
            className="w-full inline-flex items-center justify-center gap-2 bg-white text-black font-semibold px-6 py-4 rounded-full hover:bg-white/90 disabled:opacity-50 transition-all"
          >
            {status.state === "loading" ? "Sending…" : "Submit Request"}
            {status.state !== "loading" && <ArrowRight className="w-4 h-4" />}
          </button>
        </Magnetic>
        <StatusLine state={status.state} msg={status.msg} />
      </form>
    </section>
  );
}
