from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


WIDTH = 1280
HEIGHT = 760
PADDING_X = 42
PADDING_Y = 34
LINE_HEIGHT = 24
FONT_SIZE = 18
TITLE_SIZE = 28
BACKGROUND = "#0b1020"
PANEL = "#11182b"
TEXT = "#d7e3ff"
MUTED = "#8ea4d2"
ACCENT = "#7bdff6"
PROMPT = "#9cffb1"
WINDOW = "#1a2440"


def load_font(size: int):
    candidates = [
        "/System/Library/Fonts/SFNSMono.ttf",
        "/System/Library/Fonts/Supplemental/Menlo.ttc",
        "/System/Library/Fonts/Supplemental/Courier New.ttf",
    ]
    for candidate in candidates:
        path = Path(candidate)
        if path.exists():
            return ImageFont.truetype(str(path), size=size)
    return ImageFont.load_default()


FONT = load_font(FONT_SIZE)
TITLE_FONT = load_font(TITLE_SIZE)
TEXT_WIDTH = WIDTH - (PADDING_X * 2) - 36


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


def draw_window(draw: ImageDraw.ImageDraw):
    draw.rounded_rectangle((24, 22, WIDTH - 24, HEIGHT - 22), radius=24, fill=PANEL, outline=WINDOW, width=2)
    draw.rounded_rectangle((24, 22, WIDTH - 24, 76), radius=24, fill=WINDOW)
    draw.rectangle((24, 52, WIDTH - 24, 76), fill=WINDOW)
    dots = ["#ff6b6b", "#ffd166", "#4cd964"]
    for index, color in enumerate(dots):
        x = 52 + index * 24
        draw.ellipse((x, 38, x + 12, 50), fill=color)


def wrap_line(draw: ImageDraw.ImageDraw, line: str):
    if not line:
        return [""]

    words = line.split(" ")
    wrapped = []
    current = words[0]

    for word in words[1:]:
      candidate = f"{current} {word}"
      bbox = draw.textbbox((0, 0), candidate, font=FONT)
      if bbox[2] <= TEXT_WIDTH:
          current = candidate
      else:
          wrapped.append(current)
          current = word

    wrapped.append(current)
    return wrapped


def render_scene(label: str, visible_lines):
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)
    draw_window(draw)
    draw.text((PADDING_X, 98), label, font=TITLE_FONT, fill=ACCENT)
    draw.text((PADDING_X, 136), "marketing-agent demo", font=FONT, fill=MUTED)

    y = 190
    for line in visible_lines:
        fill = TEXT
        if line.startswith("$") or line.startswith(">"):
            fill = PROMPT
        elif line.startswith("##"):
            fill = ACCENT
        for wrapped_line in wrap_line(draw, line):
            draw.text((PADDING_X, y), wrapped_line, font=FONT, fill=fill)
            y += LINE_HEIGHT

    return image


def build_frames():
    frames = []
    durations = []

    for scene in SCENES:
        lines = scene["lines"]
        for line_index in range(len(lines)):
            visible = lines[: line_index + 1]
            frames.append(render_scene(scene["label"], visible))
            durations.append(260 if not lines[line_index].startswith("$") and not lines[line_index].startswith(">") else 340)
        for _ in range(4):
            frames.append(render_scene(scene["label"], lines))
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
