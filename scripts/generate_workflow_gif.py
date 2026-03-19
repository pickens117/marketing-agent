from pathlib import Path

from demo_terminal import render_terminal

LINES = [
    "$ npm run agent -- --workflow-list",
    "- campaign-brief: structured campaign brief",
    "- linkedin-ad-plan: LinkedIn ad planning with format, placement, copy, and measurement guidance",
    "- meta-ad-plan: Meta ad planning with format, placement, creative, and measurement guidance",
    "$ npm run agent -- --workflow linkedin-ad-plan --out outputs/linkedin-plan.md \"Create a LinkedIn ad plan for our AI reporting feature.\"",
    "Saved output to outputs/linkedin-plan.md",
    "$ npm run agent -- --workflow experiment-plan --chain \"Design tests for our LinkedIn and Meta ad variants.\"",
    "## Objective",
    "Test creative and message variants across paid social channels.",
    "## Variants",
    "Variant A: analyst-control angle.",
    "Variant B: time-to-insight angle.",
    "## Metrics and thresholds",
    "CTR, landing page CVR, and lead quality thresholds.",
]
def build_frames():
    frames = []
    durations = []
    for index in range(len(LINES)):
        visible = LINES[: index + 1]
        frames.append(render_terminal("Workflow Pack Demo", visible, cursor=True))
        durations.append(320 if LINES[index].startswith("$") else 250)
    for _ in range(5):
        frames.append(render_terminal("Workflow Pack Demo", LINES))
        durations.append(450)
    return frames, durations


def main():
    output = Path("docs/assets/workflow-pack-demo.gif")
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
