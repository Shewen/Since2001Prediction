import { ArrowRight, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

function Contact() {
  return (
    <main className="min-h-screen bg-[#070b0f] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Background glow */}
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-lime-400/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">

            {/* Label */}
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-lime-400">
              <MessageCircle size={14} />
              Contact Us
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Let's talk
              <span className="block text-lime-400">
                football.
              </span>
            </h1>

            {/* Description */}
            <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              Have a question, suggestion or want to get in touch?
              We'd love to hear from you.
            </p>

            <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-gray-500">
              Whether you have feedback about our predictions,
              want to report an issue or simply want to say hello,
              feel free to reach out.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <Link
                to="/predictions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-lime-300"
              >
                Explore Predictions
                <ArrowRight size={17} />
              </Link>
            </div>

          </div>
        </div>
      </section>
            {/* Contact Information */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">

          {/* Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              Get In Touch
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              We'd love to hear
              <span className="text-lime-400"> from you.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Choose the easiest way to reach us. We're always open
              to questions, feedback and suggestions.
            </p>
          </div>

          {/* Contact Cards */}
          <div className="mx-auto mt-12 grid max-w-5xl gap-5 md:grid-cols-3">

            {/* Email */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                ✉️
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                Email Us
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Have a question or need help?
              </p>

              <p className="mt-4 text-sm font-bold text-lime-400">
                hello@yourwebsite.com
              </p>
            </div>

            {/* WhatsApp */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                💬
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                WhatsApp
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Prefer a quick conversation?
              </p>

              <a
  href="https://wa.me/14378381403"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-block text-sm font-bold text-lime-400 transition hover:text-lime-300"
>
  +1 437 838 1403
</a>
            </div>

            {/* Feedback */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6 text-center transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                💡
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                Feedback
              </h3>

              <p className="mt-2 text-sm leading-6 text-gray-500">
                Have an idea to improve the platform?
              </p>

              <p className="mt-4 text-sm font-bold text-lime-400">
                Share Your Ideas
              </p>
            </div>

          </div>
        </div>
      </section>
            {/* Contact Form */}
      <section className="bg-[#070b0f]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">

            {/* Left Content */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                Send a Message
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Have something
                <span className="block text-lime-400">
                  to tell us?
                </span>
              </h2>

              <p className="mt-5 max-w-md text-sm leading-7 text-gray-500 sm:text-base">
                Send us a message and let us know how we can help.
                Whether it's a question, suggestion or feedback,
                we're happy to hear from you.
              </p>

              <div className="mt-8 rounded-2xl border border-lime-400/10 bg-lime-400/[0.03] p-5">
                <p className="text-sm font-bold text-white">
                  Before you send
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Please provide enough information in your message
                  so we can understand your question and respond
                  appropriately.
                </p>
              </div>
            </div>

            {/* Form */}
            <div className="rounded-3xl border border-white/10 bg-[#10171e] p-6 sm:p-8">
              <form className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Your Name
                  </label>

                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-lime-400/40 focus:bg-white/[0.05]"
                  />
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Email Address
                  </label>

                  <input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-lime-400/40 focus:bg-white/[0.05]"
                  />
                </div>

                {/* Subject */}
                <div>
                  <label
                    htmlFor="subject"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Subject
                  </label>

                  <input
                    id="subject"
                    type="text"
                    placeholder="What is your message about?"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-lime-400/40 focus:bg-white/[0.05]"
                  />
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-2 block text-sm font-bold text-white"
                  >
                    Message
                  </label>

                  <textarea
                    id="message"
                    rows="6"
                    placeholder="Write your message..."
                    className="w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-600 transition focus:border-lime-400/40 focus:bg-white/[0.05]"
                  />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-lime-300"
                >
                  Send Message
                  <ArrowRight size={17} />
                </button>

              </form>
            </div>

          </div>
        </div>
      </section>
            {/* Direct Contact CTA */}
      <section className="border-t border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="relative overflow-hidden rounded-3xl border border-lime-400/10 bg-[#10171e] p-8 text-center sm:p-10 lg:p-12">

            {/* Glow */}
            <div className="absolute left-1/2 top-0 h-48 w-48 -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl" />

            <div className="relative">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-lime-400/10 text-2xl">
                💬
              </div>

              <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                Need a Quick Response?
              </p>

              <h2 className="mt-3 text-3xl font-black sm:text-4xl">
                Let's connect
                <span className="text-lime-400"> directly.</span>
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
                If you have a quick question or would rather chat
                directly, you can reach us through WhatsApp.
              </p>

              <div className="mt-7">
                <a
  href="https://wa.me/14378381403"
  target="_blank"
  rel="noopener noreferrer"
  className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-7 py-3.5 text-sm font-black text-black transition hover:bg-lime-300"
>
  💬 Chat on WhatsApp
</a>
              </div>

              <p className="mt-4 text-xs text-gray-600">
                We're happy to hear from you.
              </p>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}

export default Contact;