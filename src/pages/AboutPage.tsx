import Seo from '../components/Seo';
import AboutHeroGraphic from '../components/AboutHeroGraphic';
import OurProcess from '../components/OurProcess';
import Team from '../components/Team';

export default function AboutPage() {
  return (
    <>
      <Seo
        title="About B2W"
        description="Learn how B2W works and who leads strategy, implementation, and technical delivery."
      />
      <section className="mx-auto max-w-7xl px-6 pb-24 pt-36">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.75fr)] lg:items-end">
          <div className="max-w-4xl">
            <p className="text-xs font-mono uppercase tracking-[0.26em] text-neutral-400">About</p>
            <h1 className="mt-5 text-5xl font-medium tracking-tight text-neutral-950 md:text-7xl md:leading-[0.92]">
              Built for operators who need better systems, not more noise.
            </h1>
            <p className="mt-6 max-w-3xl text-lg leading-8 text-neutral-600">
              B2W started as a way to close the gap between business strategy, technical execution, and day-to-day
              operations. We work with owners and operators who know value is being lost in process friction,
              disconnected tools, and unclear follow-through, then turn that mess into something structured, usable,
              and easier to run.
            </p>
            <p className="mt-6 max-w-3xl text-base leading-8 text-neutral-600">
              Our background spans engineering, product design, finance, infrastructure, and robotics. That mix is the
              point. We do the front-end diagnostic work, define the intervention clearly, and then lead the right
              combination of specialists, subcontractors, and technical builders to get the work shipped.
            </p>
          </div>

          <div className="space-y-8 border-l border-neutral-200 pl-0 lg:pl-8">
            <AboutHeroGraphic />

            <div className="grid gap-8 sm:grid-cols-3 lg:grid-cols-1">
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-400">What We Do</p>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  Audit operations, scope improvements, and turn ideas into working systems, assets, and delivery plans.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-400">How We Work</p>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  Start with diligence, remove ambiguity, and staff engagements with people who can own execution.
                </p>
              </div>
              <div>
                <p className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-400">Why B2W</p>
                <p className="mt-3 text-sm leading-7 text-neutral-600">
                  We combine operator judgment with technical depth so strategy does not die between planning and launch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <OurProcess />
      <Team />
      <section id="join-team" className="mx-auto max-w-7xl px-6 py-32">
        <div className="border-t border-neutral-200 pt-12 md:pt-16">
          <div className="max-w-3xl">
            <p className="text-xs font-mono uppercase tracking-[0.26em] text-neutral-400">Join B2W</p>
            <h2 className="mt-5 text-4xl font-medium tracking-tight text-neutral-950 md:text-6xl">
              Build with us as a subcontractor, specialist, or project lead.
            </h2>
            <p className="mt-6 text-base leading-8 text-neutral-600 md:text-lg">
              We are always looking for strong operators, engineers, and creative specialists who can take ownership,
              work directly with real business constraints, and help lead delivery. Some engagements need trusted
              subcontractors. Others need engineers who can run technical workstreams and help shape projects from scope
              through launch.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            <div className="border border-neutral-200 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-400">Subcontractors</p>
              <p className="mt-4 text-lg font-medium tracking-tight text-neutral-950">Specialists we can plug into delivery.</p>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Designers, developers, analysts, operators, marketers, and domain experts who can own a clear slice of work.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-400">Engineers</p>
              <p className="mt-4 text-lg font-medium tracking-tight text-neutral-950">Builders who can turn scope into systems.</p>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Full-stack, data, and AI engineers who are comfortable with ambiguity, client context, and shipping useful tools.
              </p>
            </div>
            <div className="border border-neutral-200 p-6">
              <p className="text-xs font-mono uppercase tracking-[0.22em] text-neutral-400">Project Leads</p>
              <p className="mt-4 text-lg font-medium tracking-tight text-neutral-950">People who can run the work and the room.</p>
              <p className="mt-3 text-sm leading-7 text-neutral-600">
                Operators who can manage clients, coordinate contributors, and keep execution aligned with the actual business goal.
              </p>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap gap-4">
            <a
              href="mailto:info@b2w-ai.com?subject=Joining%20B2W"
              className="inline-flex min-h-12 items-center border border-black px-5 py-3 text-base font-medium text-black transition-colors hover:bg-black hover:text-white"
            >
              Contact us about joining
            </a>
            <a
              href="mailto:info@b2w-ai.com?subject=B2W%20Partnership%20or%20Subcontracting"
              className="inline-flex min-h-12 items-center border-b border-black px-5 py-3 text-base font-medium text-black transition-colors hover:text-neutral-600"
            >
              Introduce your practice
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
