from pathlib import Path
from PIL import Image, ImageDraw, ImageFont


WIDTH = 1280
HEIGHT = 760
PADDING_X = 42
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


def render_scene(visible_lines):
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)
    draw_window(draw)
    draw.text((PADDING_X, 98), "Workflow Pack Demo", font=TITLE_FONT, fill=ACCENT)
    draw.text((PADDING_X, 136), "structured workflow execution", font=FONT, fill=MUTED)

    y = 190
    for line in visible_lines:
        fill = TEXT
        if line.startswith("$"):
            fill = PROMPT
        elif line.startswith("##"):
            fill = ACCENT
        elif line.startswith("- "):
            fill = MUTED
        for wrapped_line in wrap_line(draw, line):
            draw.text((PADDING_X, y), wrapped_line, font=FONT, fill=fill)
            y += LINE_HEIGHT

    return image


def build_frames():
    frames = []
    durations = []
    for index in range(len(LINES)):
        visible = LINES[: index + 1]
        frames.append(render_scene(visible))
        durations.append(320 if LINES[index].startswith("$") else 250)
    for _ in range(5):
        frames.append(render_scene(LINES))
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
