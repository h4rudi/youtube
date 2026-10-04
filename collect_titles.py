import json,urllib.request,concurrent.futures as cf
rows=json.load(open("data/all_videos.json"))
def t(r):
    for a in range(3):
        try:
            d=json.loads(urllib.request.urlopen(f"https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v={r['id']}&format=json",timeout=30).read())
            return r["id"],d["title"]
        except Exception: pass
    return r["id"],None
with cf.ThreadPoolExecutor(8) as ex: res=dict(ex.map(t,rows))
json.dump(res,open("data/raw/orig_titles.json","w"),ensure_ascii=False)
print(sum(1 for v in res.values() if v is None), sum(1 for r in rows if res[r["id"]] and res[r["id"]]!=r["title"]))
