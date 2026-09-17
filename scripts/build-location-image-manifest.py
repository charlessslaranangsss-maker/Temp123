"""Reproduce the explicitly reviewed local image manifest. Never approve new files automatically.

Review IDs refer to work/qa/service-area-images/review-01..25.jpg, visually
inspected on 2026-09-16. Filename wording was NOT used to classify views.
The saved source inventory pins identities and hashes; changed files stop this job.
"""
from pathlib import Path
from PIL import Image, ImageOps
import hashlib, json

ROOT = Path.cwd()
INVENTORY = ROOT / 'audit/service-area-image-source-inventory.json'
OUT = ROOT / 'public/images/location-verified'
OUT.mkdir(parents=True, exist_ok=True)
rows = json.loads(INVENTORY.read_text(encoding='utf8'))
assert len(rows) == 149, 'New inventory requires a new visual review.'

# family, configuration, verified length in feet (None means unknown), stalls,
# default priority. Each model is isolated: a title never combines model sets.
GROUPS = {
 1: ('dishwashing','low-temperature',None,None,10),
 2: ('dishwashing','conveyor',30,None,40),
 3: ('dishwashing','high-temperature-conveyor',38,None,30),
 4: ('dishwashing','low-temperature',38,None,20),
 5: ('handwashing-trailer','single-bank',None,None,10),
 6: ('laundry-container','standard',20,None,10),
 7: ('laundry-trailer','unresolved-length',None,None,10),
 8: ('laundry-trailer','unresolved-length',None,None,20),
 9: ('shower-restroom-combination','standard',13,3,20),
10: ('shower-restroom-combination','standard',22,6,10),
11: ('shower-restroom-combination','standard',30,8,30),
12: ('mobile-kitchen','standard',24,None,10),
13: ('mobile-kitchen','standard',28,None,20),
14: ('mobile-kitchen','standard',38,None,30),
15: ('mobile-kitchen','bulk-combination',40,None,70),
16: ('mobile-kitchen','bulk',40,None,60),
17: ('mobile-kitchen','combination',40,None,50),
18: ('mobile-kitchen','standard',40,None,40),
19: ('refrigerated-trailer','unresolved-length',None,None,10),
20: ('shower-container','standard',20,5,10),
21: ('shower-trailer','with-handwashing-sinks',20,5,10),
22: ('contractor-accommodation','containerized',None,None,10),
23: ('vip-accommodation','private-room',None,None,10),
24: ('sleeper-container','two-room',None,None,10),
25: ('water-tank','portable-tanks',None,None,10),
}
EXTERIORS = {
1:[4],2:[1,2],5:[1,2,3],9:[1,2,4,5,7],10:[1,2,3,4,6],11:[1],12:[3],
13:[8],17:[4,5],19:[1,3,4],21:[2,3,4,5,6,7,8],22:[2,5],23:[9],
24:[2,3,4,6,7,9],25:[1,2,3,4,5],
}
DIAGRAMS = {16:[2,3,4,5,6,7],18:[4,5],23:[1,2]}
HELD = {
'02.01':'Residential/small-business background; no safe matching view.',
'02.02':'Residential/small-business background; no safe matching view.',
'05.01':'Two-bank configuration differs from the selected single-bank trailer; not combined.',
'08.01':'Near-duplicate laundry interior; conflicting 26-27 ft versus 30 ft model identity.',
'09.01':'Residential or ambiguous exterior setting.',
'09.02':'Near-duplicate exterior with residential or ambiguous setting.',
'09.04':'Residential or ambiguous exterior setting.',
'09.05':'Exterior setting not verified as commercial/institutional.',
'09.07':'Doorway view includes unverified residential/yard background.',
'10.03':'Outdoor setting not verified as commercial/institutional.',
'10.04':'Outdoor setting not verified as commercial/institutional.',
'11.01':'Outdoor setting not verified; no accepted interior.',
'13.04':'Exact duplicate of 13.01.',
'13.08':'House is visible behind the kitchen trailer.',
'15.01':'Exact duplicate of 15.03.',
'17.04':'Grass/yard exterior lacks verified commercial setting.',
'17.05':'Wooded/driveway exterior lacks verified commercial setting.',
'19.01':'Compact exterior cannot be tied to the interior or the stated 20 ft tier without model evidence.',
'19.03':'Mixed fleet/support-equipment composition, not an exact refrigerated trailer view.',
'19.04':'Exterior cannot be tied to the interior or the stated 20 ft tier without model evidence.',
'19.05':'Near-duplicate refrigerated interior; retain 19.02 only.',
'20.04':'Near-duplicate of the same shower-container view in 20.02.',
'21.03':'Composite callout repeats an already included shower interior/exterior.',
'21.06':'Composite callout repeats an already included sink/exterior view.',
'22.01':'Identical interior reused under contractor, VIP and sleeper labels; model association unresolved.',
'22.03':'Identical interior reused under contractor, VIP and sleeper labels; model association unresolved.',
'22.04':'Identical interior reused under contractor, VIP and sleeper labels; model association unresolved.',
'23.03':'Duplicate cross-category accommodation image; VIP identity unsupported.',
'23.04':'Duplicate cross-category accommodation image; VIP identity unsupported.',
'23.05':'Duplicate cross-category accommodation image; VIP identity unsupported.',
'23.06':'Communal multi-bunk layout is not a verified VIP/private-room configuration.',
'23.08':'Different bunk-room configuration; cannot associate with the private VIP room.',
'24.01':'Cross-category duplicate interior; not evidence of a wheeled sleeper trailer.',
'24.02':'Container transported on a separate flatbed; not a sleeper trailer.',
'24.03':'Composite of a container and a reused interior; exact association unverified.',
'24.04':'Container transported on a separate flatbed; not a sleeper trailer.',
'24.05':'Cross-category duplicate interior; not evidence of a wheeled sleeper trailer.',
'24.08':'Cross-category duplicate interior; not evidence of a wheeled sleeper trailer.',
'24.09':'Container transported on a separate flatbed; not a sleeper trailer.',
'25.01':'Single-tank close view not combined with a two-tank configuration.',
'25.03':'Kitchen trailer dominates a mixed-equipment composition.',
'25.04':'Kitchen trailer dominates a mixed-equipment composition.',
'25.05':'Different visible tank configuration; do not combine with selected two-tank view.',
}
ALTS = {
1:['Stainless worktable and storage racks inside a dishwashing trailer','Commercial dishwashing machine and loading table','Wash sinks and shelving inside a dishwashing trailer','Exterior of the enclosed dishwashing trailer','Multi-compartment wash sink and pre-rinse faucet','Utility sink beside dish storage racks','Wash, rinse and sanitize basins','Handwashing and pre-rinse station inside the dishwashing trailer'],
3:['Sink station inside the conveyor dishwashing trailer','Stainless washing line inside the conveyor dishwashing trailer','Open commercial dishwashing machine','Conveyor loading table and dishwashing machine','Dishwashing trailer aisle and washing stations','Stainless washing sinks and work surface','Handwashing and wash sinks inside the dishwashing trailer','Full washing line and aisle in the dishwashing trailer','Stainless worktable inside the dishwashing trailer','Washing stations along the dishwashing trailer aisle'],
4:['Storage shelving inside a dishwashing trailer','Dishwashing trailer aisle with sinks and worktables','Wash sinks and pre-rinse station','Stainless worktable inside the dishwashing trailer'],
5:['Two banks of externally accessible handwashing sinks','Exterior of a handwashing trailer with sinks under an awning','Angled exterior view of the handwashing sink trailer'],
6:['Laundry-container interior with stacked machines and a folding table','Stacked laundry machines inside the container','Opposite-end view of the laundry-container interior'],
7:['Stacked washing machines and dryers inside a laundry trailer'],
9:{3:'Toilet and shower enclosure inside a shower-restroom combination unit',6:'Toilet, sink and shower curtain inside the combination unit'},
10:{1:'Private entrances on a shower-restroom combination trailer inside a warehouse',2:'Exterior doors and steps of the combination trailer inside a warehouse',5:'Shower and toilet inside the combination trailer',6:'Opposite-side entrances on the combination trailer inside a warehouse',7:'Wash basin and mirror inside the shower-restroom combination trailer'},
12:['Gas range inside the mobile kitchen','Mobile kitchen interior with cooking line and shelving','Exterior service window on the mobile kitchen trailer','Preparation counter inside the mobile kitchen','Mobile kitchen aisle with stainless counters and equipment'],
13:{1:'Cooking range and ovens inside the mobile kitchen',2:'Cooking line and preparation area inside the mobile kitchen',3:'Multi-compartment sink inside the mobile kitchen',5:'Mobile kitchen interior with cooking and refrigeration equipment',6:'Preparation counter below the kitchen service window',7:'Mobile kitchen aisle and wash area',9:'Storage racks and preparation area inside the mobile kitchen'},
14:['Mobile kitchen interior with refrigeration and washing stations','Range, griddle and fryer inside the mobile kitchen'],
15:{2:'Bulk-combination kitchen interior with ovens and washing stations',3:'Steam kettle and stainless preparation table inside the bulk-combination kitchen',4:'Stacked commercial ovens inside the bulk-combination kitchen',5:'Sinks and ovens inside the bulk-combination kitchen',6:'Fryer and tilting skillet inside the bulk-combination kitchen',7:'Cooking and preparation area inside the bulk-combination kitchen'},
16:{1:'Fryer, range and ovens inside the bulk kitchen',8:'Steam kettle and tilting skillet inside the bulk kitchen',9:'Washing stations and ovens inside the bulk kitchen',10:'Pot-washing sink inside the bulk kitchen',11:'Cooking line inside the bulk kitchen',12:'Ranges and ovens inside the bulk kitchen',13:'Tilting skillets and preparation area inside the bulk kitchen',14:'Refrigeration and washing stations inside the bulk kitchen'},
17:{1:'Cooking line inside the combination kitchen trailer',2:'Range and griddle beneath the extraction hood',3:'Cooking and washing aisle inside the combination kitchen',6:'Stacked ovens inside the combination kitchen trailer',7:'Preparation area inside the combination kitchen trailer',8:'Three-compartment sink inside the combination kitchen trailer',9:'Stainless preparation table and shelving',10:'Range, griddle and worktable inside the combination kitchen'},
18:{1:'Griddle and range inside the mobile kitchen',2:'Range, griddle and fryer inside the mobile kitchen',3:'Multi-compartment wash sink inside the mobile kitchen',6:'Refrigeration units inside the mobile kitchen',7:'Handwashing station inside the mobile kitchen',8:'Stacked convection ovens inside the mobile kitchen',9:'Stainless preparation table inside the mobile kitchen',10:'Cooking and preparation aisle inside the mobile kitchen'},
19:{2:'Insulated refrigerated trailer interior with a ceiling-mounted cooling unit'},
20:{1:'Private shower stall inside the shower container',2:'Separate shower enclosures inside the shower container',3:'Shower-container stalls and shower fixtures'},
21:{1:'Private shower-only stall with overhead shower and hand shower',2:'Rear exterior of the shower-only trailer inside a warehouse',4:'External handwashing sinks at the rear of the shower trailer',5:'Private external entrances on the shower-only trailer',7:'Angled exterior view of the shower-only trailer inside a warehouse',8:'Externally accessible sinks and mirrors on the shower trailer'},
22:{2:'Exterior of containerized contractor accommodation units',5:'Containerized contractor accommodation around a shared outdoor area'},
23:{7:'Private accommodation room with a bed, seating, refrigerator and microwave',9:'Wheeled sleeper trailer with separate entrances and a visible bunk room'},
24:{6:'Front exterior of a two-room containerized sleeping unit',7:'Side exterior of the containerized sleeping unit'},
25:{2:'Two portable water storage tanks with hoses beside support equipment'},
}
models=[]
for group,(family,configuration,length,stalls,priority) in GROUPS.items():
    models.append(dict(id='model-'+str(group).zfill(2),family=family,configuration=configuration,lengthFt=length,stalls=stalls,priority=priority,sourceEvidence='Local source collection and visual review; published inventory supports dimensions only where unambiguous. Unknown dimensions are not inferred.'))
models.append(dict(id='sleeper-four-room',family='sleeper-trailer',configuration='four-room',lengthFt=None,stalls=None,priority=10,sourceEvidence='Visible wheeled trailer and bunks; matching existing branded catalog labels four-room sleeper. No verified overall length.'))
models.append(dict(id='reefer-catalog',family='refrigerated-container',configuration='standard',lengthFt=40,stalls=None,priority=10,sourceEvidence='Existing catalog image visibly depicts a reefer container and labels it 8FT X 40FT. Low-resolution catalog reference, not a new photo.'))

def derivative(row):
    original=ROOT/'public'/row['src'].lstrip('/')
    assert hashlib.sha256(original.read_bytes()).hexdigest()==row['sha256'], 'Changed source requires visual re-review: '+row['src']
    with Image.open(original) as im:
        im.load()
        im=ImageOps.exif_transpose(im).convert('RGB')
        variants=[]
        for bound in (480,960):
            width=min(bound,im.width)
            height=round(im.height*width/im.width)
            name=row['sha256'][:20]+'-'+str(bound)+'.webp'
            target=OUT/name
            if not target.exists():
                im.resize((width,height),Image.Resampling.LANCZOS).save(target,'WEBP',quality=86,method=4)
            variants.append(('/images/location-verified/'+name,width,height))
        return dict(src=variants[-1][0],srcSet=', '.join(p+' '+str(w)+'w' for p,w,h in {v[1]:v for v in variants}.values()),width=variants[-1][1],height=variants[-1][2],thumbnail=variants[0][0])

images=[]
for row in rows:
    group,index=map(int,row['id'].split('.'))
    family=GROUPS[group][0]
    view='diagram' if index in DIAGRAMS.get(group,[]) else 'exterior' if index in EXTERIORS.get(group,[]) else 'interior'
    reason=HELD.get(row['id'],'')
    if view=='diagram': reason='Supporting diagram/product illustration, not verified facility photography.'
    altset=ALTS.get(group,{})
    alt=altset.get(index,'') if isinstance(altset,dict) else altset[index-1] if index<=len(altset) else ''
    model='model-'+str(group).zfill(2)
    if row['id']=='23.09': family,model='sleeper-trailer','sleeper-four-room'
    if not alt and not reason: raise ValueError('Missing reviewed alt '+row['id'])
    image={**row,'original':row['src'],'family':family,'model':model,'view':view,'status':'withheld' if reason else 'approved','reason':reason,'alt':alt,'reviewedVisually':True,'evidence':'Fresh local contact-sheet visual inspection plus source inventory; filenames are not classification evidence.'}
    if not reason: image.update(derivative(row))
    images.append(image)

# Supplemental pre-existing catalog assets were also inspected directly.
supplemental=[
 ('catalog-reefer','/images/catalog/refrigerated-containers-960.webp','refrigerated-container','reefer-catalog','exterior','Refrigerated shipping container with an end-mounted cooling unit',''),
 ('catalog-restroom','/images/catalog/restroom-trailers-960.webp','ada-combination','unverified','exterior','','Combination image is not restroom-only; ADA configuration/access details and setting are not independently verified.'),
 ('catalog-sleeper','/images/catalog/mobile-sleep-trailers-960.webp','sleeper-trailer','sleeper-four-room','exterior','','Branded reference corroborates 23.09; duplicate view is not added to the carousel.'),
 ('catalog-shower','/images/catalog/shower-trailer-960.webp','shower-trailer','model-21','interior','','Category-approved derivative of the same shower view as 21.01; do not duplicate.'),
]
for ident,src,family,model,view,alt,reason in supplemental:
    path=ROOT/'public'/src.lstrip('/')
    with Image.open(path) as im: width,height=im.size
    row=dict(id=ident,src=src,group='supplemental-catalog',width=width,height=height,bytes=path.stat().st_size,sha256=hashlib.sha256(path.read_bytes()).hexdigest())
    image={**row,'original':src,'family':family,'model':model,'view':view,'status':'withheld' if reason else 'approved','reason':reason,'alt':alt,'reviewedVisually':True,'evidence':'Direct visual inspection of existing catalog asset.'}
    if not reason: image.update(derivative(row))
    images.append(image)

# Apply explicit, review-ID-scoped owner approvals after the original visual review.
# Keeping this in the generator prevents regeneration from silently losing April's decisions.
policy = json.loads((ROOT/'content/equipment-photo-policy.json').read_text(encoding='utf8'))
approved_by_id = {a['id']: a for a in policy['approvals']}
trailer_approval = approved_by_id['april-20ft-refrigerated-trailer-all']
container_approval = approved_by_id['april-20ft-refrigerated-container-inside']
sleeper_approval = approved_by_id['april-two-stall-sleeper-inside']
for model in models:
    if model['id'] == trailer_approval['modelId']:
        model.update(lengthFt=20, configuration=trailer_approval['configuration'], sourceEvidence=trailer_approval['basis'])
models.extend([
    dict(id=container_approval['modelId'], family='refrigerated-container', configuration=container_approval['configuration'], lengthFt=20, stalls=None, priority=5, sourceEvidence=container_approval['basis']),
    dict(id=sleeper_approval['modelId'], family='sleeper-trailer', configuration=sleeper_approval['configuration'], lengthFt=None, stalls=2, priority=5, sourceEvidence=sleeper_approval['basis']),
])
approved_alts = {
    '19.01': 'Enclosed refrigerated trailer exterior with side access door',
    '19.02': 'Insulated refrigerated interior with metal walls and a ceiling-mounted cooling unit',
    '19.03': 'Refrigeration support units beside a shared loading and access walkway',
    '19.04': 'Refrigerated trailer exterior beside a commercial building',
    '19.05': 'Opposite-end view of the insulated refrigerated interior and cooling equipment',
    '24.01': 'Bunk-bed sleeping-room interior in the two-stall sleeper reference set',
    '24.08': 'Doorway view of the bunk-bed room in the two-stall sleeper reference set',
}
for image in images:
    approval = trailer_approval if image['id'] in trailer_approval['reviewIds'] else sleeper_approval if image['id'] in sleeper_approval['reviewIds'] else None
    if not approval:
        continue
    original_row = next(r for r in rows if r['id'] == image['id'])
    image.update(status='approved', reason='', family=approval['family'], model=approval['modelId'], alt=approved_alts[image['id']], approvalId=approval['id'], verificationBasis='owner-approved-reference', evidence=approval['basis'])
    image.update(derivative(original_row))
shared_interior = next(i for i in images if i['id'] == container_approval['sourceReviewId'])
images.append({**shared_interior, 'id': container_approval['reviewIds'][0], 'family': 'refrigerated-container', 'model': container_approval['modelId'], 'approvalId': container_approval['id'], 'verificationBasis': 'owner-approved-shared-interior', 'evidence': container_approval['basis']})

# Client-name selection delegated by Charles. Every additional use stays explicitly
# scoped and labelled as a reference; names do not independently prove specs.
for approval in policy.get("delegatedSelection", {}).get("additionalApprovals", []):
    model = next((m for m in models if m["id"] == approval["modelId"]), None)
    if model is None:
        model = dict(id=approval["modelId"], stalls=None)
        models.append(model)
    model.update(family=approval["family"], configuration=approval["configuration"],
                 lengthFt=approval["lengthFt"], priority=approval["priority"],
                 sourceEvidence=approval["basis"])
    for image in images:
        if image["id"] not in approval["reviewIds"]:
            continue
        image.update(status="approved", reason="", family=approval["family"],
                     model=approval["modelId"], alt=approval["alts"][image["id"]],
                     approvalId=approval["id"], verificationBasis="client-named-reviewed-reference",
                     evidence=approval["basis"])
        image.update(derivative({**image, "src": image["original"]}))

# Opening with a whole-space interior makes the kitchen easier to understand.
for image in images:
    if image["model"] == "model-12":
        image["displayOrder"] = {"12.05": 1, "12.02": 2, "12.04": 3, "12.01": 4, "12.03": 5}.get(image["id"], 99)
    if image["model"] == "model-01":
        # Identify the washing function before detail views of worktables.
        image["displayOrder"] = {"01.02": 1, "01.03": 2}.get(image["id"], 99)

# Individually reviewed additions are separate from the pinned original inventory.
# Do not auto-approve files, merge models, or modify the original 149-file review.
additions = json.loads((ROOT/'content/equipment-photo-additions.json').read_text(encoding='utf8'))
for model in additions['models']:
    assert not any(m['id'] == model['id'] for m in models), 'Duplicate model ID'
    models.append(model)
for image in additions['images']:
    assert image['reviewedVisually'] and image['status'] == 'approved'
    assert not any(i['id'] == image['id'] for i in images), 'Duplicate review ID'
    assert any(m['id'] == image['model'] and m['family'] == image['family'] for m in models)
    assert image['view'] in ('interior', 'exterior')
    images.append({**image, **derivative({**image, 'src': image['original']})})

# Hard reject repeated byte-identical assets within an approved model.
seen=set()
for image in images:
    if image['status']!='approved': continue
    key=(image['model'],image['sha256'])
    assert key not in seen, 'Duplicate approved image '+image['id']
    seen.add(key)
# Store each model's images in presentation order, as well as enforcing it in
# the resolver and renderer. Names never override visually classified views.
# Identity, hashes, categories, captions, approvals and holds are unchanged.
model_order = {model['id']: index for index, model in enumerate(models)}
view_rank = {'interior': 0, 'detail': 1, 'exterior': 2, 'plan': 3, 'diagram': 3}
images.sort(key=lambda image: (model_order.get(image['model'], len(models)),
                              image['model'], view_rank[image['view']],
                              image.get('displayOrder', 99), image['id']))
manifest=dict(version=5,reviewedAt='2026-09-16',selectionPolicy='At least one suitable photo is sufficient. Client-named visually reviewed references and specific April approvals are recorded in equipment-photo-policy.json; later reviewed sources in equipment-photo-additions.json. Single-family/model carousels; broad titles use separately labelled options, not mixed galleries.',models=models,images=images)
(ROOT/'content/verified-equipment-images.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf8')
print(json.dumps(dict(classified=len(images),localSourceImages=len(rows)+len(additions['images']),newSourceImages=len(additions['images']),supplemental=len(supplemental),approved=sum(i['status']=='approved' for i in images),withheld=sum(i['status']=='withheld' for i in images),models=len(models)),indent=2))
