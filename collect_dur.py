import json,glob,urllib.request,concurrent.futures as cf
def dur(vid):
    body={"context":{"client":{"clientName":"WEB_REMIX","clientVersion":"1.20260901.01.00","hl":"en"}},"videoId":vid}
    for a in range(3):
        try:
            req=urllib.request.Request("https://www.youtube.com/youtubei/v1/player?prettyPrint=false",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
            d=json.loads(urllib.request.urlopen(req,timeout=30).read())
            v=d.get("videoDetails",{}).get("lengthSeconds")
            if v: return vid,int(v)
        except Exception: pass
    return vid,None
fs=[f for f in glob.glob("data/raw/next/*.json")]
rs={f:json.load(open(f)) for f in fs}
todo=[r["id"] for r in rs.values() if not r.get("flat_duration")]
with cf.ThreadPoolExecutor(6) as ex: res=dict(ex.map(dur,todo))
for f,r in rs.items():
    if r["id"] in res: r["flat_duration"]=res[r["id"]]; json.dump(r,open(f,"w"),ensure_ascii=False)
print(len(todo), sum(1 for v in res.values() if v is None))
