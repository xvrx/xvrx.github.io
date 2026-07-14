import InspectScene from "@/components/InspectScene";
import ScrollToBlog from "@/components/ScrollToBlog";
import Typer from "@/components/Typer";
import { HomeIntro } from "@/components/reveals";

export default function Home() {
  return (
    <main className="home">
      <HomeIntro />
      <InspectScene />

      <section className="dossier" aria-label="Introduction">
        <p className="eyebrow eyebrow-red">FIELD DOSSIER — SUBJECT PROFILE</p>
        <h1>
          <Typer
            startDelay={1100}
            speed={24}
            segments={[
              { text: "Sometimes, the hands of fate " },
              { text: "must be forced.", className: "typer-em" },
              { text: " ⚡" },
            ]}
          />
        </h1>
        <p className="dossier-body">
          <Typer
            startDelay={2900}
            speed={11}
            segments={[
              {
                text: "Impulsive thoughts, proposals, and applied bullshitology — filed from inside the machine.",
              },
            ]}
          />{" "}
          <a
            href="https://www.youtube.com/watch?v=kx_G2a2hL6U&t=20s"
            target="_blank"
            rel="noreferrer"
          >
            more information
          </a>
          .
        </p>
        <div className="dossier-actions">
          <a
            className="cta cta-ghost"
            href="https://maps.app.goo.gl/q7caddVe4V3DjfCT6"
            target="_blank"
            rel="noreferrer"
          >
            Field office <span className="cta-arrow" aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="dossier-operator">
          <img
            src="https://avatars.githubusercontent.com/u/85608673?s=88&u=c2ee040195b1c9c08fdb687e9461b202a9b86cd2&v=4"
            alt="azrael"
            width={40}
            height={40}
          />
          <div>
            <span className="operator-name">OPERATOR — AZRAEL</span>
            <span className="operator-role">clearance: impulsive</span>
          </div>
        </div>
      </section>

      <ScrollToBlog />
    </main>
  );
}
