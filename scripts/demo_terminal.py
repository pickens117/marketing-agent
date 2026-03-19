from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


WIDTH = 1280
HEIGHT = 760
MARGIN_X = 28
MARGIN_Y = 22
TERMINAL_TOP = 74
CONTENT_X = 56
CONTENT_Y = 112
CONTENT_WIDTH = WIDTH - (CONTENT_X * 2)
CONTENT_HEIGHT = HEIGHT - CONTENT_Y - 44
FONT_SIZE = 20
LINE_HEIGHT = 28
BACKGROUND = "#111318"
TERMINAL = "#0d1117"
HEADER = "#161b22"
BORDER = "#30363d"
TEXT = "#e6edf3"
MUTED = "#8b949e"
PROMPT = "#7ee787"
ACCENT = "#79c0ff"
WARNING = "#d2a8ff"
CURSOR = "#f2cc60"


def load_font(size: int):
    candidates = [
        "/System/Library/Fonts/Supplemental/SF Mono Regular.otf",
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


def draw_terminal_frame(draw: ImageDraw.ImageDraw, title: str):
    draw.rounded_rectangle(
        (MARGIN_X, MARGIN_Y, WIDTH - MARGIN_X, HEIGHT - MARGIN_Y),
        radius=18,
        fill=TERMINAL,
        outline=BORDER,
        width=2,
    )
    draw.rounded_rectangle(
        (MARGIN_X, MARGIN_Y, WIDTH - MARGIN_X, TERMINAL_TOP),
        radius=18,
        fill=HEADER,
    )
    draw.rectangle((MARGIN_X, TERMINAL_TOP - 18, WIDTH - MARGIN_X, TERMINAL_TOP), fill=HEADER)

    dots = ["#ff5f57", "#febc2e", "#28c840"]
    for index, color in enumerate(dots):
        x = MARGIN_X + 22 + index * 22
        draw.ellipse((x, 38, x + 12, 50), fill=color)

    title_bbox = draw.textbbox((0, 0), title, font=FONT)
    title_width = title_bbox[2] - title_bbox[0]
    draw.text(((WIDTH - title_width) / 2, 34), title, font=FONT, fill=MUTED)


def wrap_line(draw: ImageDraw.ImageDraw, text: str):
    if not text:
        return [""]

    words = text.split(" ")
    lines = []
    current = words[0]

    for word in words[1:]:
        candidate = f"{current} {word}"
        bbox = draw.textbbox((0, 0), candidate, font=FONT)
        if bbox[2] - bbox[0] <= CONTENT_WIDTH:
            current = candidate
        else:
            lines.append(current)
            current = word

    lines.append(current)
    return lines


def token_color(text: str):
    if text.startswith("$ ") or text.startswith("> "):
        return PROMPT
    if text.startswith("## "):
        return ACCENT
    if text.startswith("- "):
        return WARNING
    if text.startswith("Saved ") or text.startswith("Bootstrapped "):
        return ACCENT
    return TEXT


def flatten_lines(draw: ImageDraw.ImageDraw, lines: list[str]):
    flattened: list[tuple[str, str]] = []
    for line in lines:
        color = token_color(line)
        for wrapped in wrap_line(draw, line):
            flattened.append((wrapped, color))
    return flattened


def render_terminal(title: str, lines: list[str], cursor: bool = False):
    image = Image.new("RGB", (WIDTH, HEIGHT), BACKGROUND)
    draw = ImageDraw.Draw(image)
    draw_terminal_frame(draw, title)

    flattened = flatten_lines(draw, lines)
    max_lines = CONTENT_HEIGHT // LINE_HEIGHT
    visible = flattened[-max_lines:]

    y = CONTENT_Y
    for index, (line, color) in enumerate(visible):
        draw.text((CONTENT_X, y), line, font=FONT, fill=color)
        if cursor and index == len(visible) - 1:
            bbox = draw.textbbox((CONTENT_X, y), line, font=FONT)
            cursor_x = bbox[2] + 4
            draw.rectangle((cursor_x, y + 3, cursor_x + 12, y + LINE_HEIGHT - 5), fill=CURSOR)
        y += LINE_HEIGHT

    return image
