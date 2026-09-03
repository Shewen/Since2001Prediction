import { Link } from "react-router-dom";


function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05080b]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
  to="/"
  className="text-lg font-black tracking-tight text-white"
>
  Since<span className="text-lime-400">2001</span>Prediction
</Link>

            <p className="mt-4 max-w-xs text-sm leading-6 text-gray-500">
              Football predictions, match analysis and insights from leagues
              around the world.
            </p>

            <div className="mt-5 flex gap-3">
  <a
    href="#"
    aria-label="Facebook"
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-gray-500 transition hover:border-lime-400/30 hover:text-lime-400"
  >
    f
  </a>

  <a
    href="#"
    aria-label="Instagram"
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-gray-500 transition hover:border-lime-400/30 hover:text-lime-400"
  >
    IG
  </a>

  <a
    href="#"
    aria-label="Twitter"
    className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-xs font-bold text-gray-500 transition hover:border-lime-400/30 hover:text-lime-400"
  >
    X
  </a>
</div>
          </div>

          {/* Platform */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Platform
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/predictions"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Predictions
              </Link>

              <Link
                to="/leagues"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Leagues
              </Link>

              <Link
                to="/results"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Results
              </Link>

              <Link
                to="/tips"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Football Tips
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Company
            </h3>

            <div className="mt-4 flex flex-col gap-3">
              <Link
                to="/about"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                About Us
              </Link>

              <Link
                to="/contact"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Contact
              </Link>

              <a
                href="#"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Privacy Policy
              </a>

              <a
                href="#"
                className="text-sm text-gray-500 transition hover:text-lime-400"
              >
                Terms of Use
              </a>
            </div>
          </div>

          {/* Disclaimer */}
          <div>
            <h3 className="text-sm font-bold text-white">
              Important
            </h3>

            <p className="mt-4 text-sm leading-6 text-gray-500">
              Predictions and statistics are provided for informational and
              entertainment purposes only. Past performance does not
              guarantee future results.
            </p>
          </div>

        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} Since2001Prediction. All rights reserved.
          </p>

          <p>
            Football predictions & analysis
          </p>
        </div>

      </div>
    </footer>
  );
}

export default Footer;