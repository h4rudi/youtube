import json, subprocess, os, concurrent.futures as cf
d=json.load(open("data/raw/lists.json"))
os.makedirs("data/raw/meta",exist_ok=True)
jobs=[]
for ch,tabs in d.items():
    for tab,pl in tabs.items():
        for e in (pl or {}).get("entries",[]):
            jobs.append((ch,tab,e["id"]))
def get(j):
    ch,tab,vid=j
    p=f"data/raw/meta/{vid}.json"
    if os.path.exists(p): return vid,"cached"
    for attempt in range(3):
        r=subprocess.run(["yt-dlp","--skip-download","--no-warnings","-J",f"https://www.youtube.com/watch?v={vid}"],capture_output=True,text=True)
        if r.returncode==0:
            m=json.loads(r.stdout)
            keep={k:m.get(k) for k in ["id","title","upload_date","timestamp","duration","view_count","like_count","comment_count","description","tags","categories","channel","channel_follower_count","was_live","live_status","width","height","media_type","chapters","language"]}
            keep["tab"]=tab; keep["handle"]=ch
            json.dump(keep,open(p,"w"),ensure_ascii=False)
            return vid,"ok"
    return vid,"FAIL "+r.stderr[-200:]
print(len(jobs))
with cf.ThreadPoolExecutor(6) as ex:
    for i,(vid,s) in enumerate(ex.map(get,jobs)):
        if s!="ok" or i%50==0: print(i,vid,s,flush=True)
