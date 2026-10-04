import json,re,statistics as st,datetime
from itertools import groupby
rows=json.load(open("data/all_videos.json"))
TODAY=datetime.date(2026,10,4)
cats={
 "Челлендж «только с оружием»":r"только с|only|дигл|deagle|ssg|муха|scout|дробаш|револьвер|аугом|\bцз\b|тапами|вантап",
 "Время-челлендж (24ч / 7 дней / N дней)":r"24\s?ч|24 час|7 дней|\d+ дн|72 час|за месяц|14 дней",
 "Серия «Путь/С нуля до X ELO»":r"путь|с нуля|дорога до|с 1500|road|kz путь",
 "Про-игроки / стримеры / топы":r"про-игрок|про игрок|стример|топ-игрок|популярн|брата ивана",
 "Социальный эксперимент / розыгрыш":r"притворил|дал \d|управля|тайно|девуш|стримерш|стандоффер|задонат|донач|вызвал|позвал|угадай|уверен что",
 "Гайды / «как апнуть» / советы":r"как |почему|гайд|тренировк|ты не|используй|99%|апнешь",
 "Читеры / VAC / токсики":r"читер|вак|vac|токсик|руинер|психи|нытик|чсв",
 "Премьер / 25-30k рейтинг":r"премьер|25\.000|30\.000|прем",
 "KZ / паркур / мувмент":r"kz|паркур|мувмент|прыжк",
}
def tag(t):
    t=t.lower(); return [c for c,p in cats.items() if re.search(p,t)]
long=[r for r in rows if r["format"]!="Shorts"]
med={}
for h,g in groupby(rows,key=lambda r:r["handle"]):
    g=list(g); L=[r["views"] for r in g if r["format"]!="Shorts"]; S=[r["views"] for r in g if r["format"]=="Shorts"]
    med[h]=st.median(L) if L else 1
    top=sorted(g,key=lambda r:-r["views"])[:20]
    print(f"{h:16} subs={g[0]['subs']:>6} n={len(g):>3} long={len(L):>3} shorts={len(S):>3} medLong={int(med[h]):>7} medShort={int(st.median(S)) if S else '-':>6} top1={top[0]['views']} views/subs(top20 avg)={sum(r['views'] for r in top)/len(top)/g[0]['subs']:.2f} like%={100*sum(r['likes'] for r in top)/max(1,sum(r['views'] for r in top)):.2f} com/1k={1000*sum(r['comments'] for r in top)/max(1,sum(r['views'] for r in top)):.2f}")
for r in rows: r["x"]=r["views"]/med[r["handle"]]; r["tags"]=tag(r["title"])
print("\n--- Темы (только длинные, x = просмотры / медиана канала)")
for c in cats:
    xs=[r["x"] for r in long if c in r["tags"]]
    if xs: print(f"{c:45} n={len(xs):>3} median_x={st.median(xs):.2f} mean_x={st.mean(xs):.2f}")
xs=[r["x"] for r in long if not r["tags"]]; print("без тегов", len(xs), round(st.median(xs),2))
print("\n--- Длительность (длинные)")
for lo,hi in [(0,8*60),(8*60,15*60),(15*60,20*60),(20*60,30*60),(30*60,45*60),(45*60,10**6)]:
    xs=[r for r in long if lo<=r["duration"]<hi]
    if xs: print(f"{lo//60}-{hi//60} мин n={len(xs)} median_x={st.median([r['x'] for r in xs]):.2f} median_views={int(st.median([r['views'] for r in xs]))}")
print("\n--- Title features (long)")
def caps(t):
    l=[c for c in t if c.isalpha()]; return sum(c.isupper() for c in l)/max(1,len(l))
for name,f in [("caps>60%",lambda t:caps(t)>0.6),("скобки ()",lambda t:"(" in t),("многоточие ..",lambda t:".." in t),("число ELO/LVL",lambda t:re.search(r"elo|эло|lvl|лвл",t.lower())),("FACEIT в названии",lambda t:re.search(r"faceit|фейсит",t.lower())),("часть/#N/серия через ' - '",lambda t:re.search(r" - |—|часть|#\d",t.lower()))]:
    a=[r["x"] for r in long if f(r["title"])]; b=[r["x"] for r in long if not f(r["title"])]
    print(f"{name:28} yes n={len(a)} med={st.median(a):.2f} | no n={len(b)} med={st.median(b) if b else 0:.2f}")
print("\n--- Последние 90 дней: топ по x (длинные)")
rec=[r for r in long if (TODAY-datetime.date.fromisoformat(r["date"])).days<=90]
for r in sorted(rec,key=lambda r:-r["x"])[:25]: print(f"{r['x']:5.1f}x {r['views']:>7} {r['handle']:14} {r['date']} {r['duration']//60}м {r['title']}")
print("\n--- Shorts vs long by channel: sum views")
for h,g in groupby(rows,key=lambda r:r["handle"]):
    g=list(g); s=sum(r["views"] for r in g if r["format"]=="Shorts"); l=sum(r["views"] for r in g if r["format"]!="Shorts")
    if s: print(h, "shorts", s, "long", l)
print("\n--- Год публикации vs просмотры (все каналы, long)")
for y in (2022,2023,2024,2025,2026):
    a=[r for r in long if r["date"].startswith(str(y))]
    if a: print(y,len(a),sum(r["views"] for r in a))
print("\n--- weekday of top-20s")
import collections
tops=[]
for h,g in groupby(rows,key=lambda r:r["handle"]): tops+=sorted(g,key=lambda r:-r["views"])[:20]
print(collections.Counter(datetime.date.fromisoformat(r["date"]).strftime("%a") for r in tops))
print("lang:", collections.Counter("ru" if re.search("[а-яА-Я]",r["title"]) else "en" for r in rows))
