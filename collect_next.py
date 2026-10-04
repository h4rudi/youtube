import json, re, os, time, urllib.request, concurrent.futures as cf
d=json.load(open("data/raw/lists.json"))
os.makedirs("data/raw/next",exist_ok=True)
jobs=[]
for ch,tabs in d.items():
    for tab,pl in tabs.items():
        for e in (pl or {}).get("entries",[]):
            jobs.append((ch,tab,e))
def post(ep,body):
    req=urllib.request.Request(f"https://www.youtube.com/youtubei/v1/{ep}?prettyPrint=false",data=json.dumps(body).encode(),headers={"Content-Type":"application/json"})
    return urllib.request.urlopen(req,timeout=30).read().decode()
ctx={"client":{"clientName":"WEB","clientVersion":"2.20260901.00.00","hl":"en","gl":"US"}}
def get(j):
    ch,tab,e=j; vid=e["id"]; p=f"data/raw/next/{vid}.json"
    if os.path.exists(p): return vid,"cached"
    for a in range(3):
        try:
            s=post("next",{"context":ctx,"videoId":vid})
            r={"id":vid,"handle":ch,"tab":tab,"title":e.get("title"),"flat_views":e.get("view_count"),"flat_duration":e.get("duration")}
            m=re.search(r'along with ([\d,]+) other',s); r["likes"]=int(m.group(1).replace(",","")) if m else None
            if r["likes"] is None:
                m=re.search(r'"accessibilityText":"([\d,]+) likes?"',s); r["likes"]=int(m.group(1).replace(",","")) if m else None
            m=re.search(r'"dateText":\{"simpleText":"([^"]*)"',s); r["date"]=m.group(1) if m else None
            m=re.search(r'"contextualInfo":\{"runs":\[\{"text":"([^"]*)"',s); r["comments_raw"]=m.group(1) if m else None
            m=re.search(r'"viewCount":\{"videoViewCountRenderer":\{"viewCount":\{"simpleText":"([^"]*)"',s); r["views_raw"]=m.group(1) if m else None
            m=re.search(r'"description":\{"runs":(\[.*?\])\}',s)
            r["has_comments_disabled"]= "Comments are turned off" in s
            open(f"data/raw/next/{vid}.raw","w").write(s)
            json.dump(r,open(p,"w"),ensure_ascii=False); return vid,"ok"
        except Exception as ex:
            err=str(ex); time.sleep(3)
    return vid,"FAIL "+err
with cf.ThreadPoolExecutor(6) as ex:
    res=list(ex.map(get,jobs))
print(len(res), sum(1 for _,s in res if s!="FAIL"), [r for r in res if r[1].startswith("FAIL")][:5])
