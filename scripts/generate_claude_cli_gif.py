from pathlib import Path

from demo_terminal import render_terminal

LINES = [
    "> /plugin marketplace add pickens117/marketing-agent",
    "> /plugin install marketing-ai-enablement-plugin@marketing-agent-marketplace",
    "> /campaign-brief Launch a new AI reporting feature for mid-market SaaS marketing teams",
    "## Key message",
    "Faster reporting clarity without sacrificing analyst control.",
    "> /linkedin-ad-plan Promote our new AI reporting feature to VP Marketing and demand gen leaders",
    "## Recommended formats",
    "Single image, document ads, and short product video tests.",
    "## Ad copy variants",
    "Variant 1: pain-led hook.",
    "Variant 2: credibility and trust angle.",
    "> /meta-ad-plan Generate awareness and leads for our new AI reporting feature launch",
    "## Placement guidance",
    "Start broad, then narrow based on conversion quality and frequency.",
    "> /prompt-improve Write five LinkedIn posts about our product launch.",
    "## Improved prompt",
    "Write five differentiated LinkedIn posts for VP Marketing audiences...",
]
def build_frames():
    frames = []
    durations = []
    for index in range(len(LINES)):
        visible = LINES[: index + 1]
        frames.append(render_terminal("Claude CLI Workflow", visible, cursor=True))
        durations.append(320 if LINES[index].startswith(">") else 250)
    for _ in range(5):
        frames.append(render_terminal("Claude CLI Workflow", LINES))
        durations.append(450)
    return frames, durations


def main():
    output = Path("docs/assets/claude-cli-workflow.gif")
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
