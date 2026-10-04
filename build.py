import json,glob,re,datetime,csv
names={"%D0%B2%D0%B8%D1%84%D0%B5%D0%B9%D0%B2":"вифейв"}
lists=json.load(open("data/raw/lists.json"))
def num(s):
    if s is None: return 0
    s=s.replace(",","").replace(" views","").replace(" view","").strip()
    m=re.match(r"([\d.]+)\s*([KM]?)",s)
    if not m: return None
    v=float(m.group(1)); v*= {"K":1e3,"M":1e6,"":1}[m.group(2)]
    return int(v)
def date(s):
    s=re.sub(r"^(Premiered|Streamed live on|Started streaming on|Published on)\s*","",s).strip()
    return datetime.datetime.strptime(s,"%b %d, %Y").date().isoformat()
rows=[]
orig=json.load(open("data/raw/orig_titles.json"))
for f in glob.glob("data/raw/next/*.json"):
    r=json.load(open(f))
    meta=lists[r["handle"]]["videos"]
    rows.append(dict(handle=names.get(r["handle"],r["handle"]),channel=meta["channel"],subs=meta.get("channel_follower_count"),
      id=r["id"],format="Shorts" if r["tab"]=="shorts" else ("Стрим" if r["tab"]=="streams" else "Видео"),
      title=orig.get(r["id"]) or r["title"],date=date(r["date"]),views=num(r["views_raw"]),likes=r["likes"] or 0,
      comments=num(r["comments_raw"]),comments_off=r["has_comments_disabled"],duration=r["flat_duration"],
      url=("https://www.youtube.com/shorts/" if r["tab"]=="shorts" else "https://www.youtube.com/watch?v=")+r["id"]))
rows.sort(key=lambda x:(x["handle"].lower(),-x["views"]))
json.dump(rows,open("data/all_videos.json","w"),ensure_ascii=False,indent=1)
with open("data/all_videos.csv","w",newline="") as fh:
    w=csv.DictWriter(fh,fieldnames=list(rows[0].keys())); w.writeheader(); w.writerows(rows)
print(len(rows), set(r["comments_raw"] for r in [json.load(open(f)) for f in glob.glob("data/raw/next/*.json")] if r["comments_raw"] and not r["comments_raw"].isdigit()))
