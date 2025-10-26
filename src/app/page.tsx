import EquipmentCatalog from "@/components/EquipmentCatalog";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100">
      <main className="mx-auto flex max-w-6xl flex-col gap-16 px-6 pb-24 pt-20 md:gap-20 md:px-8 lg:px-10">
        <section className="relative overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 px-8 py-16 text-white md:px-14 md:py-20">
          <div className="relative z-10 flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
            <div className="max-w-xl space-y-6">
              <p className="text-xs font-semibold uppercase tracking-[0.4em] text-sky-300/80">
                CiviRent
              </p>
              <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
                Civil engineering equipment rentals, deployed on your promised
                date.
              </h1>
              <p className="text-base text-slate-200">
                Secure high-uptime machines, calibrated instruments, and
                field-hardened crews in one platform. Confirm availability in
                minutes and release payment securely through Razorpay.
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full border border-slate-500/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-200">
                  Pan-India Logistics
                </span>
                <span className="rounded-full border border-slate-500/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-200">
                  24x7 Field Support
                </span>
                <span className="rounded-full border border-slate-500/40 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.26em] text-slate-200">
                  Razorpay Trusted
                </span>
              </div>
            </div>
            <div className="grid w-full max-w-sm gap-6 rounded-3xl border border-white/10 bg-white/5 p-6 text-left backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-200">
                Fleet Metrics
              </p>
              <div className="space-y-4 text-sm text-slate-100">
                <div>
                  <p className="text-3xl font-semibold">200+</p>
                  <p className="text-xs uppercase tracking-[0.24em] text-slate-300">
                    Active machines
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-lg font-semibold">18</p>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-200">
                      Cities
                    </p>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3">
                    <p className="text-lg font-semibold">2.5 hrs</p>
                    <p className="text-[0.7rem] uppercase tracking-[0.3em] text-slate-200">
                      Avg response
                    </p>
                  </div>
                </div>
                <p className="text-xs text-slate-300">
                  Run leaner sites with telemetry-backed maintenance,
                  auto-servicing schedules, and consolidated invoices.
                </p>
              </div>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_top_right,_rgba(56,189,248,0.35),_transparent_55%),radial-gradient(circle_at_bottom_left,_rgba(248,250,252,0.25),_transparent_60%)]" />
        </section>

        <section className="space-y-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-500">
              Select Equipment
            </p>
            <h2 className="mt-2 text-3xl font-semibold text-slate-900">
              Real-time availability, industry-grade fleet.
            </h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-600">
              Explore earthmoving, concrete, surveying, and compaction assets.
              Every unit ships with digital inspection sheets, trained operators,
              and onsite onboarding by CiviRent engineers.
            </p>
          </div>

          <EquipmentCatalog />
        </section>

        <section className="grid gap-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-900/5 md:grid-cols-3">
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              Seamless Cashflow
            </p>
            <h3 className="text-xl font-semibold text-slate-900">
              Razorpay backed collections
            </h3>
            <p className="text-sm text-slate-600">
              Split rental, fuel advance, and operator charges into milestone
              payments. Auto-reminders keep finance aligned.
            </p>
          </div>
          <ul className="space-y-4 text-sm text-slate-700">
            <li className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              Instant Razorpay order creation with GST-ready invoices.
            </li>
            <li className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              Secure UPI, net-banking, and corporate card acceptance.
            </li>
            <li className="rounded-3xl border border-slate-200 bg-slate-50 px-5 py-4">
              Settlement confirmation loops in the on-ground dispatch team.
            </li>
          </ul>
          <div className="rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 to-slate-800 p-6 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-200">
              Operations Desk
            </p>
            <p className="mt-2 text-sm text-slate-200">
              Need multi-unit deployment? Drop us a mail at{" "}
              <a
                href="mailto:ops@civirent.in"
                className="font-semibold underline underline-offset-4"
              >
                ops@civirent.in
              </a>{" "}
              with GA drawings. We revert with fleet sizing and phasing plan in
              12 hours.
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
