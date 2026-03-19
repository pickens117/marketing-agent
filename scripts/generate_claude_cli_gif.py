from pathlib import Path

from PIL import Image, ImageDraw

from demo_terminal import (
    BACKGROUND,
    BORDER,
    CONTENT_WIDTH,
    CURSOR,
    FONT,
    HEADER,
    HEIGHT,
    MARGIN_X,
    MARGIN_Y,
    TERMINAL,
    TEXT,
    WARNING,
    WIDTH,
    wrap_line,
)


TITLE = "Claude Code"
WORKSPACE = "/Users/stephenpickens/Development/marketing-agent"
CONTENT_X = 64
CONTENT_Y = 118
LINE_HEIGHT = 30
BUBBLE_PADDING_X = 18
BUBBLE_PADDING_Y = 14
COMPOSER_HEIGHT = 76
COMPOSER_Y = HEIGHT - 112
BODY_BOTTOM = COMPOSER_Y - 28
PROMPT = "#8be28b"
MUTED = "#9ea7b3"
ACCENT = "#f3d19c"
USER_BUBBLE = "#1a1f28"
ASSISTANT_BUBBLE = "#141820"


EVENTS = [
    ("user", "/plugin marketplace add pickens117/marketing-agent"),
    ("assistant", "Added marketplace `marketing-agent-marketplace` from pickens117/marketing-agent."),
    ("user", "/plugin install marketing-ai-enablement-plugin@marketing-agent-marketplace"),
    ("assistant", "Installed `marketing-ai-enablement-plugin` and loaded its commands for this repo."),
    ("user", "/campaign-brief Launch a new AI reporting feature for mid-market SaaS marketing teams"),
    ("assistant", "Campaign brief ready.\n## Audience\nMid-market SaaS marketing leaders who need faster, more reliable reporting.\n## Core message\nReporting clarity without sacrificing analyst control."),
    ("user", "/linkedin-ad-plan Promote our new AI reporting feature to VP Marketing and demand gen leaders"),
    ("assistant", "LinkedIn plan drafted.\n## Recommended formats\nSingle image, document ads, and short product video tests.\n## First CTA\nBook a demo."),
    ("user", "/meta-ad-plan Generate awareness and leads for our new AI reporting feature launch"),
    ("assistant", "Meta plan drafted.\n## Placement guidance\nStart with feeds and reels, then narrow based on lead quality.\n## Creative angle\nMake manual reporting pain visible fast."),
]


def draw_header(draw: ImageDraw.ImageDraw):
    draw.rounded_rectangle(
        (MARGIN_X, MARGIN_Y, WIDTH - MARGIN_X, HEIGHT - MARGIN_Y),
        radius=18,
        fill=TERMINAL,
        outline=BORDER,
        width=2,
    )
    draw.rounded_rectangle(
        (MARGIN_X, MARGIN_Y, WIDTH - MARGIN_X, 84),
        radius=18,
        fill=HEADER,
    )
    draw.rectangle((MARGIN_X, 66, WIDTH - MARGIN_X, 84), fill=HEADER)

    draw.text((CONTENT_X, 34), TITLE, font=FONT, fill=TEXT)
    workspace_label = f"workspace: {WORKSPACE}"
    bbox = draw.textbbox((0, 0), workspace_label, font=FONT)
    draw.text((WIDTH - MARGIN_X - 24 - (bbox[2] - bbox[0]), 34), workspace_label, font=FONT, fill=MUTED)


def draw_bubble(draw: ImageDraw.ImageDraw, role: str, text: str, y: int):
    max_width = CONTENT_WIDTH - 72
    wrapped_lines: list[str] = []
    for line in text.split("\n"):
        wrapped_lines.extend(wrap_line(draw, line))

    line_width = 0
    for line in wrapped_lines:
        bbox = draw.textbbox((0, 0), line, font=FONT)
        line_width = max(line_width, bbox[2] - bbox[0])

    bubble_width = min(max_width, line_width + (BUBBLE_PADDING_X * 2))
    bubble_height = (len(wrapped_lines) * LINE_HEIGHT) + (BUBBLE_PADDING_Y * 2) - 8
    is_user = role == "user"
    x = CONTENT_X + (CONTENT_WIDTH - bubble_width if is_user else 0)
    bubble_color = USER_BUBBLE if is_user else ASSISTANT_BUBBLE

    draw.rounded_rectangle(
        (x, y, x + bubble_width, y + bubble_height),
        radius=16,
        fill=bubble_color,
        outline=BORDER,
        width=1,
    )

    label = "You" if is_user else "Claude"
    label_color = PROMPT if is_user else ACCENT
    draw.text((x + BUBBLE_PADDING_X, y + 10), label, font=FONT, fill=label_color)

    text_y = y + 34
    for line in wrapped_lines:
        fill = TEXT
        if line.startswith("## "):
            fill = ACCENT
        draw.text((x + BUBBLE_PADDING_X, text_y), line, font=FONT, fill=fill)
        text_y += LINE_HEIGHT

    return bubble_height + 16


def draw_composer(draw: ImageDraw.ImageDraw, text: str = ""):
    draw.rounded_rectangle(
        (CONTENT_X, COMPOSER_Y, WIDTH - CONTENT_X, COMPOSER_Y + COMPOSER_HEIGHT),
        radius=18,
        fill=HEADER,
        outline=BORDER,
        width=1,
    )
    prompt_text = f"> {text}" if text else "> "
    draw.text((CONTENT_X + 18, COMPOSER_Y + 22), prompt_text, font=FONT, fill=TEXT)
    bbox = draw.textbbox((CONTENT_X + 18, COMPOSER_Y + 22), prompt_text, font=FONT)
    cursor_x = bbox[2] + 4
    draw.rectangle((cursor_x, COMPOSER_Y + 24, cursor_x + 12, COMPOSER_Y + 46), fill=CURSOR)
    hint = "Enter to send  •  / for commands"
    draw.text((WIDTH - CONTENT_X - 284, COMPOSER_Y + 22), hint, font=FONT, fill=MUTED)


def render_scene(event_count: int, composer_text: str = ""):
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)
    draw_header(draw)

    transcript = EVENTS[:event_count]
    bubble_specs = []
    for role, text in transcript:
        max_width = CONTENT_WIDTH - 72
        wrapped_lines: list[str] = []
        for line in text.split("\n"):
            wrapped_lines.extend(wrap_line(draw, line))
        line_width = 0
        for line in wrapped_lines:
            bbox = draw.textbbox((0, 0), line, font=FONT)
            line_width = max(line_width, bbox[2] - bbox[0])
        bubble_width = min(max_width, line_width + (BUBBLE_PADDING_X * 2))
        bubble_height = (len(wrapped_lines) * LINE_HEIGHT) + (BUBBLE_PADDING_Y * 2) - 8
        bubble_specs.append((role, text, bubble_width, bubble_height))

    total_height = sum(height + 16 for _, _, _, height in bubble_specs)
    y = max(CONTENT_Y, BODY_BOTTOM - total_height)
    for role, text, _, _ in bubble_specs:
        y += draw_bubble(draw, role, text, y)

    draw_composer(draw, composer_text)
    return image


def build_frames():
    frames = [render_scene(0, "/plugin marketplace add pickens117/marketing-agent")]
    durations = [500]

    for index in range(1, len(EVENTS) + 1):
        composer_text = ""
        if index < len(EVENTS) and EVENTS[index][0] == "user":
            composer_text = EVENTS[index][1]
        frames.append(render_scene(index, composer_text))
        durations.append(520 if EVENTS[index - 1][0] == "assistant" else 360)

    for _ in range(5):
        frames.append(render_scene(len(EVENTS)))
        durations.append(460)

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
