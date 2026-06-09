from __future__ import annotations

import html
import re
from html.parser import HTMLParser
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import (
    ListFlowable,
    ListItem,
    PageBreak,
    Paragraph,
    Preformatted,
    SimpleDocTemplate,
    Spacer,
    Table,
    TableStyle,
)


ROOT = Path(__file__).resolve().parent
HTML_PATH = ROOT / "holland-app-documentation.html"
PDF_PATH = ROOT / "holland-app-documentation.pdf"


def clean_text(value: str) -> str:
    value = html.unescape(value)
    value = re.sub(r"\s+", " ", value)
    return value.strip()


class DocumentationParser(HTMLParser):
    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.in_body = False
        self.skip_depth = 0
        self.current_tag: str | None = None
        self.current_class = ""
        self.buffer: list[str] = []
        self.blocks: list[tuple[str, str | list[list[str]]]] = []
        self.table_rows: list[list[str]] | None = None
        self.current_row: list[str] | None = None
        self.current_cell: list[str] | None = None
        self.list_items: list[str] = []
        self.in_list = False

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attrs_dict = dict(attrs)
        class_name = attrs_dict.get("class", "") or ""

        if tag == "body":
            self.in_body = True
            return
        if not self.in_body:
            return
        if tag in {"style", "script"}:
            self.skip_depth += 1
            return
        if self.skip_depth:
            return

        if tag == "br":
            self.buffer.append("\n")
            return
        if tag == "table":
            self.flush_text_block()
            self.table_rows = []
            return
        if tag == "tr" and self.table_rows is not None:
            self.current_row = []
            return
        if tag in {"td", "th"} and self.current_row is not None:
            self.current_cell = []
            return
        if tag in {"ul", "ol"}:
            self.flush_text_block()
            self.in_list = True
            self.list_items = []
            return
        if tag == "li" and self.in_list:
            self.current_tag = "li"
            self.buffer = []
            return

        block_tags = {"h1", "h2", "h3", "p", "pre"}
        selected_divs = {
            "cover-eyebrow",
            "cover-title",
            "cover-sub",
            "cover-meta",
            "chapter-num",
            "callout",
            "takeaway-label",
        }
        if tag in block_tags or (tag == "div" and any(c in class_name.split() for c in selected_divs)):
            self.flush_text_block()
            self.current_tag = tag if tag != "div" else class_name.split()[0]
            self.current_class = class_name
            self.buffer = []

    def handle_endtag(self, tag: str) -> None:
        if tag == "body":
            self.flush_text_block()
            self.in_body = False
            return
        if not self.in_body:
            return
        if tag in {"style", "script"} and self.skip_depth:
            self.skip_depth -= 1
            return
        if self.skip_depth:
            return

        if tag in {"td", "th"} and self.current_cell is not None and self.current_row is not None:
            self.current_row.append(clean_text("".join(self.current_cell)))
            self.current_cell = None
            return
        if tag == "tr" and self.current_row is not None and self.table_rows is not None:
            if any(self.current_row):
                self.table_rows.append(self.current_row)
            self.current_row = None
            return
        if tag == "table" and self.table_rows is not None:
            self.blocks.append(("table", self.table_rows))
            self.table_rows = None
            return
        if tag == "li" and self.current_tag == "li":
            item = clean_text("".join(self.buffer))
            if item:
                self.list_items.append(item)
            self.current_tag = None
            self.buffer = []
            return
        if tag in {"ul", "ol"} and self.in_list:
            if self.list_items:
                self.blocks.append(("list", self.list_items[:]))
            self.in_list = False
            self.list_items = []
            return
        if self.current_tag and tag in {"h1", "h2", "h3", "p", "pre", "div"}:
            self.flush_text_block()

    def handle_data(self, data: str) -> None:
        if not self.in_body or self.skip_depth:
            return
        if self.current_cell is not None:
            self.current_cell.append(data)
        elif self.current_tag:
            self.buffer.append(data)

    def flush_text_block(self) -> None:
        if not self.current_tag:
            return
        text = "\n".join(line.rstrip() for line in "".join(self.buffer).splitlines()).strip()
        compact = clean_text(text)
        if compact:
            self.blocks.append((self.current_tag, text if self.current_tag == "pre" else compact))
        self.current_tag = None
        self.current_class = ""
        self.buffer = []


def make_styles():
    base = getSampleStyleSheet()
    brand = colors.HexColor("#1B365D")
    near_black = colors.HexColor("#141413")
    olive = colors.HexColor("#5e5d59")

    return {
        "cover_eyebrow": ParagraphStyle(
            "cover_eyebrow",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=9,
            leading=12,
            textColor=brand,
            alignment=TA_CENTER,
            spaceAfter=18,
        ),
        "cover_title": ParagraphStyle(
            "cover_title",
            parent=base["Title"],
            fontName="Times-Roman",
            fontSize=34,
            leading=38,
            textColor=near_black,
            alignment=TA_CENTER,
            spaceAfter=14,
        ),
        "cover_sub": ParagraphStyle(
            "cover_sub",
            parent=base["Normal"],
            fontName="Helvetica",
            fontSize=12,
            leading=17,
            textColor=olive,
            alignment=TA_CENTER,
            spaceAfter=120,
        ),
        "chapter": ParagraphStyle(
            "chapter",
            parent=base["Normal"],
            fontName="Helvetica-Bold",
            fontSize=8,
            leading=11,
            textColor=brand,
            spaceBefore=10,
            spaceAfter=5,
        ),
        "h1": ParagraphStyle(
            "h1",
            parent=base["Heading1"],
            fontName="Times-Roman",
            fontSize=22,
            leading=26,
            textColor=near_black,
            borderColor=brand,
            borderWidth=0,
            leftIndent=0,
            spaceAfter=10,
        ),
        "h2": ParagraphStyle(
            "h2",
            parent=base["Heading2"],
            fontName="Times-Roman",
            fontSize=15,
            leading=18,
            textColor=near_black,
            spaceBefore=15,
            spaceAfter=6,
        ),
        "h3": ParagraphStyle(
            "h3",
            parent=base["Heading3"],
            fontName="Times-Roman",
            fontSize=12,
            leading=15,
            textColor=colors.HexColor("#3d3d3a"),
            spaceBefore=10,
            spaceAfter=4,
        ),
        "body": ParagraphStyle(
            "body",
            parent=base["BodyText"],
            fontName="Times-Roman",
            fontSize=10,
            leading=14.8,
            textColor=near_black,
            spaceAfter=7,
        ),
        "callout": ParagraphStyle(
            "callout",
            parent=base["BodyText"],
            fontName="Times-Roman",
            fontSize=10,
            leading=14.8,
            leftIndent=10,
            borderColor=brand,
            borderWidth=0.8,
            borderPadding=7,
            backColor=colors.HexColor("#faf9f5"),
            spaceBefore=6,
            spaceAfter=8,
        ),
        "mono": ParagraphStyle(
            "mono",
            parent=base["Code"],
            fontName="Courier",
            fontSize=8,
            leading=11,
            backColor=colors.HexColor("#faf9f5"),
            borderColor=colors.HexColor("#e5e3d8"),
            borderWidth=0.4,
            borderPadding=6,
            spaceBefore=6,
            spaceAfter=8,
        ),
    }


def paragraph(text: str, style: ParagraphStyle) -> Paragraph:
    text = html.escape(text).replace("&lt;code&gt;", "<font name='Courier'>").replace("&lt;/code&gt;", "</font>")
    text = text.replace("&lt;span class=&quot;hl&quot;&gt;", "<font color='#1B365D'>").replace("&lt;/span&gt;", "</font>")
    return Paragraph(text, style)


def build_pdf() -> None:
    parser = DocumentationParser()
    parser.feed(HTML_PATH.read_text(encoding="utf-8"))
    styles = make_styles()

    doc = SimpleDocTemplate(
        str(PDF_PATH),
        pagesize=A4,
        rightMargin=22 * mm,
        leftMargin=22 * mm,
        topMargin=20 * mm,
        bottomMargin=22 * mm,
        title="Dokumentasi Produk Holland Test",
        author="Kami",
    )

    story = []
    for kind, value in parser.blocks:
        if isinstance(value, list):
            if kind == "table":
                rows = [[Paragraph(html.escape(cell), styles["body"]) for cell in row] for row in value]
                if not rows:
                    continue
                table = Table(rows, repeatRows=1)
                table.setStyle(
                    TableStyle(
                        [
                            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#faf9f5")),
                            ("TEXTCOLOR", (0, 0), (-1, 0), colors.HexColor("#4d4c48")),
                            ("LINEBELOW", (0, 0), (-1, 0), 1, colors.HexColor("#1B365D")),
                            ("LINEBELOW", (0, 1), (-1, -1), 0.25, colors.HexColor("#e5e3d8")),
                            ("VALIGN", (0, 0), (-1, -1), "TOP"),
                            ("LEFTPADDING", (0, 0), (-1, -1), 5),
                            ("RIGHTPADDING", (0, 0), (-1, -1), 5),
                            ("TOPPADDING", (0, 0), (-1, -1), 4),
                            ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
                        ]
                    )
                )
                story.append(table)
                story.append(Spacer(1, 6))
            elif kind == "list":
                items = [ListItem(paragraph(item, styles["body"])) for item in value]
                story.append(ListFlowable(items, bulletType="bullet", leftIndent=15))
                story.append(Spacer(1, 5))
            continue

        text = clean_text(value)
        if not text:
            continue
        if kind == "cover-eyebrow":
            story.append(Spacer(1, 92))
            story.append(paragraph(text, styles["cover_eyebrow"]))
        elif kind == "cover-title":
            story.append(paragraph(text, styles["cover_title"]))
        elif kind == "cover-sub":
            story.append(paragraph(text, styles["cover_sub"]))
        elif kind == "cover-meta":
            story.append(paragraph(text, styles["body"]))
            story.append(PageBreak())
        elif kind == "chapter-num":
            if story:
                story.append(PageBreak())
            story.append(paragraph(text, styles["chapter"]))
        elif kind == "h1":
            story.append(paragraph(text, styles["h1"]))
        elif kind == "h2":
            story.append(paragraph(text, styles["h2"]))
        elif kind == "h3":
            story.append(paragraph(text, styles["h3"]))
        elif kind == "pre":
            story.append(Preformatted(value, styles["mono"]))
        elif kind in {"callout", "takeaway-label"}:
            story.append(paragraph(text, styles["callout"]))
        else:
            story.append(paragraph(text, styles["body"]))

    doc.build(story)


if __name__ == "__main__":
    build_pdf()
