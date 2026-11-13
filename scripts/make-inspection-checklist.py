"""Build the two-page resource from the retained Focus Care article, no outside claims."""
import base64, hashlib, json, sys
from pathlib import Path
from fontTools.ttLib import TTFont as Font
from fontTools.varLib.instancer import instantiateVariableFont
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.colors import HexColor
from reportlab.lib.utils import simpleSplit

ROOT = Path(__file__).resolve().parents[1]
OUT = Path(sys.argv[1])
OUT.mkdir(parents=True, exist_ok=True)
for weight, name in [(400,'Inter'),(600,'Inter-Semibold')]:
    font=Font(ROOT/'design/assets/inter.woff2'); font.flavor=None
    if 'fvar' in font: font=instantiateVariableFont(font,{'wght':weight},inplace=False)
    path=OUT/(name+'.ttf'); font.save(path); pdfmetrics.registerFont(TTFont(name,str(path)))
pdf=OUT/'inspection-readiness-checklist.pdf'
c=canvas.Canvas(str(pdf),pagesize=(612,792),invariant=1)
c.setTitle('Inspection-readiness checklist | Focus Care')
c.setAuthor('Focus Care LLC')
INK='#101b30'; BODY='#43516a'; BLUE='#2157db'; BORDER='#dce5ef'
def text(x,y,value,size=9,font='Inter',color=BODY):
    c.setFillColor(HexColor(color)); c.setFont(font,size); c.drawString(x,y,value)
def wrap(value,x,y,width=500,size=9,leading=13,font='Inter',color=BODY):
    for line in simpleSplit(value,font,size,width): text(x,y,line,size,font,color); y-=leading
    return y
def header(page,title,sub):
    text(44,748,'Focus Care',13,'Inter-Semibold',BLUE)
    text(44,708,title,24,'Inter-Semibold',INK)
    wrap(sub,44,686,size=10,leading=15)
    c.setStrokeColor(HexColor(BORDER)); c.line(44,652,568,652)
    text(44,32,'focuscarellc.com  |  Inspection-readiness checklist  |  November 2026',8)
    text(540,32,f'{page} / 2',8)
def item(y,value):
    c.setStrokeColor(HexColor(BODY)); c.setLineWidth(.65); c.rect(46,y-2,8,8)
    return wrap(value,65,y,width=495,size=9,leading=12)-8
header(1,'Inspection-readiness checklist','A working review for Pennsylvania residential provider teams. Check the evidence you can find, then record gaps on page 2.')
text(44,629,'Site / programme: ____________________    Reviewer: ____________________    Date: __________',8.5)
sections=[
('Rights that fit the person',[
 'Find rights information in a format the person understands.',
 'Review restrictions against the ISP and documented rights-team review.',
 'Check whether staff can explain the rights of the people they support.']),
('Fire-safety evidence',[
 'Review individual evacuation plans and drill records across shifts and conditions.',
 'Locate documented smoke-detector checks and fire-extinguisher inspections.']),
('Medication records',[
 'Check medication-administration training certificates and renewal dates.',
 'Compare a medication log with prescriber orders and pharmacy labels.',
 'Review PRN notes for context, outcome and follow-up; check storage and expiry.']),
('Training that matches the work',[
 'Compare training evidence with the needs of the people each staff member supports.',
 'Check orientation completion against the first solo shift.',
 'Locate ISP-specific training evidence, not only an attendance signature.']),
('Physical site review',[
 'Review accessible hot-water temperatures and emergency-egress windows.',
 'Check storage of cleaning supplies and sharp objects.',
 'Note broken fixtures, lighting and other repairs that need follow-up.'])]
y=599
for title,items in sections:
    text(44,y,title,12,'Inter-Semibold',INK); y-=23
    for v in items:y=item(y,v)
    y-=10
y=wrap('Use this to organize a review, not to certify compliance. You confirm completion and review requirements. Tools support your oversight; they do not guarantee compliance. The provider makes the final decisions.',44,96,size=8.5,leading=12)
c.showPage()
header(2,'Turn missing evidence into follow-up.','For each unchecked item, note where the record should be, who will review it and when you will check again. Keep care information in your own approved systems.')
text(44,626,'Area / missing evidence',10,'Inter-Semibold',INK)
text(300,626,'Owner / next step',10,'Inter-Semibold',INK)
text(467,626,'Review date',10,'Inter-Semibold',INK)
c.setStrokeColor(HexColor(BORDER))
for y in [614,544,474,404,334]: c.line(44,y,568,y)
for x in [44,290,457,568]: c.line(x,334,x,614)
for y in [590,520,450,380]:
    text(55,y,'________________________________',8)
    text(55,y-23,'________________________________',8)
    text(301,y,'____________________',8)
    text(301,y-23,'____________________',8)
    text(468,y,'___________',8)
text(44,304,'Before you close the review',12,'Inter-Semibold',INK)
y=item(281,'Give each missing record or repair a named owner and a review date.')
y=item(y,'Keep required staff records, training evidence and renewal dates together.')
y=item(y,'Confirm completion and unresolved items through your provider review process.')
text(44,201,'Source reading',11,'Inter-Semibold',INK)
sources=[('5 Things Inspectors Look For That Most Providers Miss','https://focuscarellc.com/blog/5-things-inspectors-look-for'),('Inspection-readiness guide','https://focuscarellc.com/blog/odp-inspection-readiness-6400-compliance'),('Training and compliance workflow scope','https://focuscarellc.com/services/compliance')]
y=182
for label,url in sources:
    text(44,y,label,8.5); y-=13
    text(44,y,url,7.7,color=BLUE); c.linkURL(url,(44,y-2,568,y+9),relative=0); y-=19
wrap('This is a short operational checklist drawn from Focus Care articles and service guides. It is not a complete regulatory checklist or legal advice, and it does not promise an inspection outcome. The provider makes the final decisions.',44,76,size=8.5,leading=12)
c.save()
data=pdf.read_bytes()
manifest={'resourceKey':'inspection-readiness-v1','filename':pdf.name,'sha256':hashlib.sha256(data).hexdigest(),'bytes':len(data),'content':base64.b64encode(data).decode()}
(ROOT/'server/inspection-checklist.generated.json').write_text(json.dumps(manifest,separators=(',',':'))+'\n',encoding='utf-8')
dest=ROOT/'design/motion-led/assets/inspection-readiness-checklist.pdf'; dest.write_bytes(data)
print(json.dumps({k:v for k,v in manifest.items() if k!='content'}))
