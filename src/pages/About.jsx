import { ArrowRight, ShieldCheck, Trophy } from "lucide-react";
import { Link } from "react-router-dom";

function About() {
  return (
    <main className="min-h-screen bg-[#070b0f] text-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/10">
        {/* Background glow */}
        <div className="absolute -left-32 top-20 h-72 w-72 rounded-full bg-lime-400/10 blur-3xl" />
        <div className="absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-lime-400/5 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-28">
          {/* Left */}
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-lime-400/20 bg-lime-400/10 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-lime-400">
              <Trophy size={14} />
              About Us
            </div>

            <h1 className="max-w-3xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Football predictions
              <span className="block text-lime-400">
                made simple.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-gray-400 sm:text-lg">
              We provide football predictions and match insights
              designed to help football fans make more informed
              decisions before every match.
            </p>

            <p className="mt-4 max-w-xl text-sm leading-7 text-gray-500">
              From major European leagues to exciting fixtures
              around the world, we bring predictions, confidence
              ratings and previous results together in one simple
              platform.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                to="/predictions"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-lime-300"
              >
                Explore Predictions
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/results"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-6 py-3.5 text-sm font-bold text-white transition hover:border-lime-400/30 hover:bg-white/[0.06]"
              >
                View Results
              </Link>
            </div>
          </div>

          {/* Right */}
          <div className="relative">
            <div className="rounded-3xl border border-white/10 bg-[#10171e] p-6 shadow-2xl shadow-black/30 sm:p-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-500">
                    Our Mission
                  </p>
                  <h2 className="mt-1 text-2xl font-black">
                    Better football insights.
                  </h2>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-lime-400/10 text-lime-400">
                  <ShieldCheck size={24} />
                </div>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <p className="text-sm font-bold text-white">
                    Clear Predictions
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Easy-to-understand predictions without unnecessary
                    complexity.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Multiple Leagues
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Follow predictions across some of football's
                    biggest competitions.
                  </p>
                </div>

                <div>
                  <p className="text-sm font-bold text-white">
                    Transparent Results
                  </p>
                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    We keep previous predictions and results available
                    so visitors can review our performance.
                  </p>
                </div>
              </div>

              <div className="mt-7 rounded-2xl border border-lime-400/10 bg-lime-400/5 p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-lime-400">
                  Our Philosophy
                </p>

                <p className="mt-2 text-sm leading-6 text-gray-400">
                  Football is unpredictable. Our goal is not to promise
                  guaranteed outcomes, but to provide useful analysis
                  and predictions based on available information.
                </p>
              </div>
            </div>
          </div>
        </div>
           </section>

      {/* Who We Are */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
            
            {/* Heading */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                Who We Are
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Built for people who
                <span className="block text-lime-400">
                  love the game.
                </span>
              </h2>
            </div>

            {/* Content */}
            <div className="space-y-5 text-sm leading-7 text-gray-400 sm:text-base">
              <p>
                We are a football prediction platform created for
                fans who want a simple place to discover match
                predictions, explore different leagues and follow
                previous results.
              </p>

              <p>
                Instead of making football information complicated,
                we focus on presenting predictions in a clear and
                easy-to-understand format. Every prediction comes
                with a confidence rating to give visitors additional
                context before making their own decisions.
              </p>

              <p>
                Our platform covers some of the biggest football
                competitions and continues to grow as we bring more
                leagues, teams and predictions to the community.
              </p>

              <div className="border-l-2 border-lime-400/40 pl-5">
                <p className="font-semibold text-white">
                  Our goal is simple:
                </p>

                <p className="mt-1">
                  Give football fans a better way to discover,
                  follow and review football predictions.
                </p>
              </div>
            </div>
          </div>
        </div>
            </section>

      {/* What We Offer */}
      <section className="border-b border-white/10 bg-[#070b0f]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          
          {/* Section Heading */}
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              What We Offer
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Everything you need to
              <span className="text-lime-400"> follow the game.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              We bring useful football prediction features together
              in one simple and easy-to-use platform.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Daily Predictions */}
            <div className="group rounded-2xl border border-white/10 bg-[#10171e] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                ⚽
              </div>

              <h3 className="mt-6 text-lg font-black text-white">
                Daily Predictions
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Discover football predictions for selected matches
                and stay updated before kickoff.
              </p>
            </div>

            {/* Multiple Leagues */}
            <div className="group rounded-2xl border border-white/10 bg-[#10171e] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                🏆
              </div>

              <h3 className="mt-6 text-lg font-black text-white">
                Multiple Leagues
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Follow predictions across major football leagues
                and competitions in one place.
              </p>
            </div>

            {/* Confidence Ratings */}
            <div className="group rounded-2xl border border-white/10 bg-[#10171e] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                📊
              </div>

              <h3 className="mt-6 text-lg font-black text-white">
                Confidence Ratings
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Each prediction can include a confidence rating
                that provides additional context.
              </p>
            </div>

            {/* Results Tracking */}
            <div className="group rounded-2xl border border-white/10 bg-[#10171e] p-6 transition duration-300 hover:-translate-y-1 hover:border-lime-400/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lime-400/10 text-2xl">
                📈
              </div>

              <h3 className="mt-6 text-lg font-black text-white">
                Results Tracking
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Review previous predictions and see their recorded
                results after matches are completed.
              </p>
            </div>

          </div>
        </div>
      </section>
            {/* Our Approach */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">

            {/* Left */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
                Our Approach
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight sm:text-4xl">
                Predictions backed by
                <span className="block text-lime-400">
                  football insight.
                </span>
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                Football matches can be unpredictable. That's why
                our approach focuses on studying available information
                and presenting predictions in a clear and responsible
                way.
              </p>

              <div className="mt-8">
                <Link
                  to="/predictions"
                  className="inline-flex items-center gap-2 rounded-xl bg-lime-400 px-6 py-3.5 text-sm font-black text-black transition hover:bg-lime-300"
                >
                  See Our Predictions
                  <ArrowRight size={17} />
                </Link>
              </div>
            </div>

            {/* Right */}
            <div className="space-y-4">

              {/* Step 1 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#10171e] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
                  01
                </div>

                <div>
                  <h3 className="font-black text-white">
                    Match Information
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    We consider relevant information surrounding the
                    fixture before presenting a prediction.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#10171e] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
                  02
                </div>

                <div>
                  <h3 className="font-black text-white">
                    Football Analysis
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Team performances, form and other available
                    football information can help shape our view
                    of a match.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#10171e] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
                  03
                </div>

                <div>
                  <h3 className="font-black text-white">
                    Clear Prediction
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    We turn our assessment into a straightforward
                    prediction that is easy for visitors to understand.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex gap-4 rounded-2xl border border-white/10 bg-[#10171e] p-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-lime-400 text-sm font-black text-black">
                  04
                </div>

                <div>
                  <h3 className="font-black text-white">
                    Track The Result
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-gray-500">
                    Once a match is completed, the recorded result
                    can be reviewed on our results page.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>
            {/* Why Choose Us */}
      <section className="border-b border-white/10 bg-[#070b0f]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
              Why Choose Us
            </p>

            <h2 className="mt-3 text-3xl font-black sm:text-4xl">
              Simple. Clear.
              <span className="text-lime-400"> Transparent.</span>
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500 sm:text-base">
              Everything is designed to make following football
              predictions easier and more enjoyable.
            </p>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {/* Card 1 */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl">
                ✓
              </div>

              <h3 className="mt-5 text-lg font-black">
                Easy to Understand
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Our predictions are presented clearly so you can
                quickly understand what we're predicting for each
                fixture.
              </p>
            </div>

            {/* Card 2 */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl">
                🔎
              </div>

              <h3 className="mt-5 text-lg font-black">
                Transparent Results
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                Completed predictions remain available so visitors
                can review our recorded results.
              </p>
            </div>

            {/* Card 3 */}
            <div className="rounded-2xl border border-white/10 bg-[#10171e] p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-lime-400/10 text-xl">
                🌍
              </div>

              <h3 className="mt-5 text-lg font-black">
                Growing Coverage
              </h3>

              <p className="mt-3 text-sm leading-6 text-gray-500">
                We continue to expand our coverage with more
                leagues, teams and football predictions.
              </p>
            </div>
          </div>
        </div>
      </section>
            {/* Responsible Prediction Notice */}
      <section className="border-b border-white/10 bg-[#0a1015]">
        <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <div className="rounded-3xl border border-yellow-400/10 bg-yellow-400/[0.03] p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-yellow-400/10 text-xl">
                ⚠️
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-yellow-400">
                  Responsible Prediction
                </p>

                <h2 className="mt-2 text-xl font-black text-white sm:text-2xl">
                  Football is unpredictable.
                </h2>

                <p className="mt-3 text-sm leading-7 text-gray-400">
                  Our predictions are based on our assessment of
                  available football information and should be viewed
                  as opinions rather than guaranteed outcomes.
                  No prediction can guarantee the result of a football
                  match.
                </p>

                <p className="mt-3 text-sm leading-7 text-gray-500">
                  If you choose to use our predictions when making
                  betting decisions, please do so responsibly and
                  within your means.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
            {/* Final CTA */}
      <section className="relative overflow-hidden bg-[#070b0f]">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-lime-400/10 blur-3xl" />

        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:py-24">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime-400">
            Get Started
          </p>

          <h2 className="mt-3 text-3xl font-black sm:text-4xl lg:text-5xl">
            Ready to explore
            <span className="block text-lime-400">
              today's predictions?
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-gray-500 sm:text-base">
            Explore our latest football predictions, discover
            different leagues and review previous results.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              to="/predictions"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-lime-400 px-7 py-3.5 text-sm font-black text-black transition hover:bg-lime-300"
            >
              View Predictions
              <ArrowRight size={17} />
            </Link>

            <Link
              to="/results"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-7 py-3.5 text-sm font-bold text-white transition hover:border-lime-400/30 hover:bg-white/[0.06]"
            >
              Check Results
            </Link>
          </div>
        </div>
      </section>
    
    </main>

    
  );
}

export default About;