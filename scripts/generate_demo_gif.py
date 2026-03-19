from pathlib import Path

from demo_terminal import render_terminal


SCENES = [
    {
        "label": "Node CLI Workflow",
        "lines": [
            "$ npm run bootstrap:company",
            "Bootstrapped company starter files to docs/company",
            "$ npm run agent -- --workflow campaign-brief --out outputs/launch-brief.md \"Create a launch brief for our new feature.\"",
            "Saved output to outputs/launch-brief.md",
            "$ npm run agent -- --workflow linkedin-ad-plan \"Create a LinkedIn ad plan for our AI reporting feature.\"",
            "## Objective",
            "Drive demo requests from VP Marketing and demand gen leaders.",
            "## Recommended formats",
            "Single image, document ads, and short product video tests.",
            "## Placement guidance",
            "Prioritize feed placements and desktop-friendly creative hierarchy.",
        ],
    },
    {
        "label": "Claude CLI Workflow",
        "lines": [
            "> /plugin marketplace add pickens117/marketing-agent",
            "> /plugin install marketing-ai-enablement-plugin@marketing-agent-marketplace",
            "> /campaign-brief Launch a new AI reporting feature for mid-market SaaS marketing teams",
            "## Key message",
            "Faster reporting clarity without sacrificing analyst control.",
            "> /linkedin-ad-plan Promote our new AI reporting feature to VP Marketing and demand gen leaders",
            "## Ad copy variants",
            "Variant 1: pain-led hook.",
            "Variant 2: credibility and trust angle.",
            "> /meta-ad-plan Generate awareness and leads for our new AI reporting feature launch",
            "## Placement guidance",
            "Start broad, then narrow based on conversion quality and frequency.",
        ],
    },
]
def build_frames():
    frames = []
    durations = []

    for scene in SCENES:
        lines = scene["lines"]
        for line_index in range(len(lines)):
            visible = lines[: line_index + 1]
            frames.append(render_terminal(scene["label"], visible, cursor=True))
            durations.append(280 if not lines[line_index].startswith("$") and not lines[line_index].startswith(">") else 360)
        for _ in range(4):
            frames.append(render_terminal(scene["label"], lines))
            durations.append(420)

    return frames, durations


def main():
    output = Path("docs/assets/marketing-agent-workflow.gif")
    output.parent.mkdir(parents=True, exist_ok=True)
    frames, durations = build_frames()
    frames[0].save(
        output,
        save_all=True,
        append_images=frames[1:],
        duration=durations,
        loop=0,
        optimize=False,
    )
    print(f"Saved {output}")


if __name__ == "__main__":
    main()
