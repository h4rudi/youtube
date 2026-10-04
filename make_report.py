"""Builds report.html and cs2_competitors.xlsx from data/all_videos.json."""
import json, re, html, statistics as st
from itertools import groupby
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment
from openpyxl.utils import get_column_letter

rows = json.load(open("data/all_videos.json"))
ORDER = ["hhakuu", "TenfRly", "3cotni", "NK3YX", "kingsteping", "вифейв", "Limb111", "zenpai1337",
         "wwhysoempty", "decemberv1bes", "lazwyy_31", "ronnyaa", "DuraCS", "tolkorisk", "lilnise_fam"]
by = {h: list(g) for h, g in groupby(rows, key=lambda r: r["handle"])}
URLS = {h: f"https://www.youtube.com/@{h}" for h in ORDER}
URLS["вифейв"] = "https://www.youtube.com/@%D0%B2%D0%B8%D1%84%D0%B5%D0%B9%D0%B2"


def dur(s):
    h, m, sec = s // 3600, s % 3600 // 60, s % 60
    return f"{h}:{m:02d}:{sec:02d}" if h else f"{m}:{sec:02d}"


def n(v):
    return f"{v:,}".replace(",", " ")


def ddmm(d):
    y, m, dd = d.split("-")
    return f"{dd}.{m}.{y}"


channels = []
for h in ORDER:
    g = by[h]
    top = sorted(g, key=lambda r: -r["views"])[:20]
    longs = [r["views"] for r in g if r["format"] != "Shorts"]
    channels.append(dict(handle=h, name=g[0]["channel"].strip(), subs=g[0]["subs"], total=len(g),
                         shorts=sum(r["format"] == "Shorts" for r in g),
                         med=int(st.median(longs)) if longs else 0, top=top,
                         top_views=sum(r["views"] for r in top),
                         likes=sum(r["likes"] for r in top), comments=sum(r["comments"] for r in top)))

# ---------- Excel ----------
wb = Workbook()
ws = wb.active
ws.title = "Сводка"
hdr_fill = PatternFill("solid", fgColor="1F2A33")
hdr_font = Font(bold=True, color="FFFFFF")
ws.append(["Канал", "Хэндл", "Подписчики", "Видео на канале", "Из них Shorts", "Медиана просмотров (длинные)",
           "Топ-1 просмотры", "Сумма просмотров топ-20", "Лайки/просмотры топ-20, %", "Комментарии на 1000 просмотров"])
for c in channels:
    ws.append([c["name"], "@" + c["handle"], c["subs"], c["total"], c["shorts"], c["med"], c["top"][0]["views"],
               c["top_views"], round(100 * c["likes"] / c["top_views"], 2), round(1000 * c["comments"] / c["top_views"], 2)])
cols = ["#", "Дата публикации", "Название", "Формат", "Длина", "Просмотры", "Лайки", "Комментарии", "Ссылка"]
for c in channels:
    s = wb.create_sheet(c["handle"][:31])
    s.append(cols)
    for i, r in enumerate(c["top"], 1):
        s.append([i, ddmm(r["date"]), r["title"], r["format"], dur(r["duration"]), r["views"], r["likes"],
                  r["comments"], r["url"]])
alls = wb.create_sheet("Все видео")
alls.append(["Канал", "Дата", "Название", "Формат", "Длина, сек", "Просмотры", "Лайки", "Комментарии", "Ссылка"])
for r in rows:
    alls.append([r["handle"], r["date"], r["title"], r["format"], r["duration"], r["views"], r["likes"], r["comments"], r["url"]])
for s in wb.worksheets:
    for cell in s[1]:
        cell.fill, cell.font = hdr_fill, hdr_font
        cell.alignment = Alignment(wrap_text=True, vertical="center")
    s.freeze_panes = "A2"
    for i, col in enumerate(s.columns, 1):
        w = max(len(str(c.value or "")) for c in col)
        s.column_dimensions[get_column_letter(i)].width = min(max(8, w + 2), 70)
wb.save("cs2_competitors.xlsx")

# ---------- HTML ----------
def bars(items, unit="×"):
    mx = max(v for _, v, _ in items)
    out = []
    for label, v, note in items:
        out.append(f'<div class="bar-row" title="{html.escape(label)}: {v:.2f}{unit} · {html.escape(note)}">'
                   f'<span class="bar-label">{html.escape(label)}</span>'
                   f'<span class="bar-track"><span class="bar-fill" style="width:{100 * v / mx:.1f}%"></span></span>'
                   f'<span class="bar-val">{v:.2f}{unit}</span><span class="bar-note">{html.escape(note)}</span></div>')
    return "\n".join(out)


topics = [("Про-игроки и стримеры в кадре", 3.68, "22 видео"),
          ("Социальный эксперимент / подмена ролей", 2.83, "23 видео"),
          ("Ограничение оружия: «только дигл / SSG / тапы»", 2.07, "17 видео"),
          ("Челлендж по времени: 24 ч / 7 дней / 30 дней", 1.47, "33 видео"),
          ("Серия «Путь до… / С нуля до X ELO»", 1.26, "113 видео"),
          ("Гайды и «как апнуть»", 1.01, "36 видео"),
          ("Читеры / VAC / токсики", 1.00, "17 видео"),
          ("Premier / 25–30 тыс. рейтинга", 0.93, "14 видео")]
durs = [("до 8 мин", 0.10, "70 видео · медиана 3,5 тыс."),
        ("8–15 мин", 1.02, "118 видео · 16,7 тыс."),
        ("15–20 мин", 1.43, "77 видео · 35,3 тыс."),
        ("20–30 мин", 1.10, "75 видео · 21,4 тыс."),
        ("30–45 мин", 1.86, "21 видео · 54,7 тыс."),
        ("45+ мин", 2.53, "3 видео · 152 тыс.")]

overview = "\n".join(
    f'<tr><td><a href="#{c["handle"]}">{html.escape(c["name"])}</a><span class="muted"> @{html.escape(c["handle"])}</span></td>'
    f'<td class="num">{n(c["subs"])}</td><td class="num">{c["total"]}</td><td class="num">{n(c["med"])}</td>'
    f'<td class="num">{n(c["top"][0]["views"])}</td><td class="num">{c["top"][0]["views"] / c["subs"]:.1f}</td>'
    f'<td class="num">{100 * c["likes"] / c["top_views"]:.1f}%</td></tr>' for c in channels)

notes = {
    "hhakuu": "Самый крупный. Авторитет топ-1 FACEIT: серия «Путь в топ-100» + разборы «почему ты плохо играешь». Самый высокий уровень вовлечения (3,7% лайков).",
    "TenfRly": "Длинные челленджи 15–77 мин. Хиты: «7 дней в изоляции», «апнул 30 000», «24 ч только с SSG». Серия «Проклятие 3500» держит базу.",
    "3cotni": "Чемпион по пиковым охватам (702 тыс.). Формула: я + про-игроки/стримеры + провокация. Shorts дают около 15% просмотров канала.",
    "NK3YX": "Чистые челленджи с ограничением: дигл 24 ч, тапы 7 дней, ЦЗ, револьвер. Ролики 22–38 мин.",
    "kingsteping": "9 роликов, медиана 49 тыс. Скопировал формат «только дигл / только SSG» на 3500 ELO и обогнал оригинал.",
    "вифейв": "Ниша KZ / паркур / мувмент. Лучший процент лайков (4,1%). Конкуренции почти нет.",
    "Limb111": "Серия «Путь до 10 лвла» плюс короткие смешные Shorts по 6–10 секунд (на Shorts приходится 43% просмотров).",
    "zenpai1337": "Повторил тему «только дигл»: первая версия собрала 1,2 тыс., перезапуск с новой упаковкой — 25,7 тыс. Рекордные 7,3 комментария на 1000 просмотров.",
    "wwhysoempty": "Ставка на людей: девушки, читеры, американский FACEIT. Серия «С нуля до топ-1000» на уровне медианы канала.",
    "decemberv1bes": "1 150 подписчиков и 309 тыс. на ролике «5 LVL, но им управляет 3000 ELO». Пример того, что сильная идея набирает охват без базы подписчиков.",
    "lazwyy_31": "Формат «7 дней с …» (дигл, префаеры, муха) приносит 6–15 тыс. при 384 подписчиках.",
    "ronnyaa": "345 подписчиков и 53,7 тыс. на «Путь в топ-100 KZ — начало»: первый выпуск серии в незанятой нише.",
    "DuraCS": "Один ролик «С нуля до 3к ELO — начало»: 8,7 тыс. Вход в перегретую серию.",
    "tolkorisk": "Только «С нуля до 3к ELO», 12 выпусков по 0,6–9 тыс. Потолок шаблонной серии.",
    "lilnise_fam": "Больше всего контента (78), просмотры в основном из мемных Shorts. Длинные ролики: медиана около 300.",
}

tables = []
for c in channels:
    trs = "\n".join(
        f'<tr><td class="num muted">{i}</td><td class="num">{ddmm(r["date"])}</td>'
        f'<td class="title"><a href="{r["url"]}">{html.escape(r["title"])}</a></td>'
        f'<td><span class="chip {"chip-s" if r["format"] == "Shorts" else ""}">{r["format"]}</span></td>'
        f'<td class="num">{dur(r["duration"])}</td><td class="num strong">{n(r["views"])}</td>'
        f'<td class="num">{n(r["likes"])}</td><td class="num">{n(r["comments"])}</td></tr>'
        for i, r in enumerate(c["top"], 1))
    cnt = f"топ-20 из {c['total']}" if c["total"] > 20 else f"все {c['total']} видео (меньше 20 на канале)"
    tables.append(f'''<section class="channel" id="{c["handle"]}">
<header class="ch-head"><div><h3>{html.escape(c["name"])}</h3>
<a class="muted" href="{URLS[c["handle"]]}">@{html.escape(c["handle"])}</a></div>
<dl class="ch-stats"><div><dt>подписчики</dt><dd>{n(c["subs"])}</dd></div><div><dt>медиана просм.</dt><dd>{n(c["med"])}</dd></div><div><dt>в таблице</dt><dd>{cnt}</dd></div></dl></header>
<p class="ch-note">{html.escape(notes[c["handle"]])}</p>
<div class="scroll"><table class="vt"><thead><tr><th>#</th><th>Дата</th><th>Название</th><th>Формат</th><th>Длина</th><th>Просмотры</th><th>Лайки</th><th>Комм.</th></tr></thead>
<tbody>{trs}</tbody></table></div></section>''')

nav = " ".join(f'<a class="navchip" href="#{c["handle"]}">{html.escape(c["name"])}</a>' for c in channels)

page = open("report_template.html").read()
page = (page.replace("{{TOPICS}}", bars(topics)).replace("{{DURS}}", bars(durs)).replace("{{OVERVIEW}}", overview)
        .replace("{{NAV}}", nav).replace("{{TABLES}}", "\n".join(tables)))
open("report.html", "w").write(page)
print("ok")
