# Regenerates app icons, splash and Play Store graphics. Requires Pillow: python3 scripts/generate-brand-assets.py
from PIL import Image, ImageDraw, ImageFilter, ImageFont
import os
R = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..") + "/"
SS = 4
BG = (11, 11, 13)
GOLD = (212, 175, 55)

# gem geometry, centred on (0,0), in "1024 icon" units
TL, TM, TR = (-150, -323), (0, -323), (150, -323)
GL, GA, GB, GR = (-292, -77), (-68, -77), (68, -77), (292, -77)
BT = (0, 323)
FACETS = [
    ((TL, GL, GA), (240, 208, 106)), ((TL, TM, GA), (250, 224, 130)),
    ((TM, GA, GB), (228, 192, 80)),  ((TM, TR, GB), (236, 202, 94)),
    ((TR, GR, GB), (205, 166, 52)),  ((GL, GA, BT), (212, 175, 55)),
    ((GA, GB, BT), (188, 151, 40)),  ((GB, GR, BT), (160, 125, 30)),
]
SEAMS = [(TL, GA), (TM, GA), (TM, GB), (TR, GB), (GL, GR), (GA, BT), (GB, BT)]

def gem_layer(size, cx, cy, scale, mono=False):
    """RGBA layer with the gem; seams are cut out as transparency."""
    W = size[0] * SS, size[1] * SS
    k = scale * SS
    tf = lambda p: (cx * SS + p[0] * k, cy * SS + p[1] * k)
    col = Image.new("RGBA", W, (0, 0, 0, 0))
    mask = Image.new("L", W, 0)
    dc, dm = ImageDraw.Draw(col), ImageDraw.Draw(mask)
    for pts, c in FACETS:
        pts = [tf(p) for p in pts]
        dc.polygon(pts, fill=(255, 255, 255, 255) if mono else c + (255,))
        dm.polygon(pts, fill=255)
    for a, b in SEAMS:
        dm.line([tf(a), tf(b)], fill=0, width=round(12 * k))
    col.putalpha(mask)
    return col.resize(size, Image.LANCZOS)

def background(size, cx, cy, radius, strength=70):
    W = size[0] * SS, size[1] * SS
    img = Image.new("RGB", W, BG)
    glow = Image.new("L", W, 0)
    r = radius * SS
    ImageDraw.Draw(glow).ellipse((cx*SS - r, cy*SS - r, cx*SS + r, cy*SS + r), fill=strength)
    glow = glow.filter(ImageFilter.GaussianBlur(radius * SS * 0.42))
    img.paste(Image.new("RGB", W, GOLD), mask=glow)
    return img.resize(size, Image.LANCZOS).convert("RGBA")

def full_icon(n):
    s = n / 1024
    bg = background((n, n), n/2, n*0.49, 330*s)
    bg.alpha_composite(gem_layer((n, n), n/2, n*0.495, s))
    return bg

# app icon (iOS/legacy) + store icon + favicon
full_icon(1024).convert("RGB").save(R + "assets/images/icon.png", optimize=True)
full_icon(512).save(R + "store/play-store-icon-512.png", optimize=True)
full_icon(64).save(R + "assets/images/favicon.png", optimize=True)

# Android adaptive icon: gem kept inside the 66% safe zone (radius ~313px)
AS = 0.62
background((1024, 1024), 512, 505, 300).save(R + "assets/images/android-icon-background.png", optimize=True)
gem_layer((1024, 1024), 512, 512, AS).save(R + "assets/images/android-icon-foreground.png", optimize=True)
gem_layer((1024, 1024), 512, 512, AS, mono=True).save(R + "assets/images/android-icon-monochrome.png", optimize=True)

# splash (transparent, splash bg colour comes from app.json)
gem_layer((512, 512), 256, 256, 512/1024 * 1.4).save(R + "assets/images/splash-icon.png", optimize=True)

# Play Store feature graphic 1024x500, no alpha
FW, FH = 1024, 500
fg = background((FW, FH), 250, 250, 240, strength=55)
fg.alpha_composite(gem_layer((FW, FH), 250, 250, 0.5))
d = ImageDraw.Draw(fg)
F = "/usr/share/fonts/truetype/liberation/"
title = ImageFont.truetype(F + "LiberationSerif-Bold.ttf", 96)
sub = ImageFont.truetype(F + "LiberationSans-Regular.ttf", 34)
tag = ImageFont.truetype(F + "LiberationSans-Bold.ttf", 22)
x = 470
lines = ["The AI Power Stack for", "solo business owners"]
d.text((x, 130), "T R E A S U R E R A T E", font=tag, fill=GOLD)
d.text((x - 4, 160), "Back Office", font=title, fill=(245, 242, 234))
d.line([(x, 278), (x + 70, 278)], fill=GOLD, width=3)
for i, line in enumerate(lines):
    d.text((x, 298 + i * 44), line, font=sub, fill=(232, 226, 212))
fg.convert("RGB").save(R + "store/play-feature-graphic-1024x500.png", optimize=True)
