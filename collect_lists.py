import json, subprocess, sys, concurrent.futures as cf
chans = ["zenpai1337","wwhysoempty","hhakuu","tolkorisk","kingsteping","lilnise_fam","Limb111","3cotni","decemberv1bes","%D0%B2%D0%B8%D1%84%D0%B5%D0%B9%D0%B2","TenfRly","DuraCS","ronnyaa","NK3YX","lazwyy_31"]
def run(ch, tab):
    url=f"https://www.youtube.com/@{ch}/{tab}"
    r=subprocess.run(["yt-dlp","--flat-playlist","-J",url],capture_output=True,text=True)
    if r.returncode!=0: return ch,tab,None,r.stderr[-300:]
    return ch,tab,json.loads(r.stdout),None
jobs=[(c,t) for c in chans for t in ("videos","shorts","streams")]
out={}
with cf.ThreadPoolExecutor(8) as ex:
    for ch,tab,d,err in ex.map(lambda a: run(*a), jobs):
        out.setdefault(ch,{})[tab]=d
        n=len(d.get("entries",[])) if d else 0
        print(ch,tab,n,(err or "").strip()[:150],flush=True)
json.dump(out,open("data/raw/lists.json","w"),ensure_ascii=False)
