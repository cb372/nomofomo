# make dummy data for inclusion in the main page; this is a script for future reference

import json
import random
import colorsys
import time

def randtitle():
	return random.choice([
		"Net neutrality: FCC votes on the future of the internet",
"Coutts bank under investigation over Swiss tax evasion",
"Letter: Oliver Rackham's winning ways",
"Milan fashion week sees brands offer a more restrained glamour",
"Patients should have right to choose where they die, says care inquiry",
"Emma Thompson and Greg Wise: a new mission for the latter-day Chartists",
"French police investigate mystery drone flights over central Paris",
"It Follows review - sexual dread fuels a modern horror classic",
"Arsenal must get back to basics after Champions League lesson from Monaco | Jonathan Wilson",
"Pauline Fisk obituary"
		])

def randcolour():
	(r,g,b) = colorsys.hsv_to_rgb(random.random(), 0.8, 0.9)
	return '#%02x%02x%02x'%(int(r*255), int(g*255), int(b*255))

print(json.dumps([dict(id="id%02x"%i, colour=randcolour(), title=randtitle(), time=int(time.mktime((2015,2,17+i/4,(i%4)*6,0,0,0,0,0))), importance=random.randint(0,10), text="test") for i in range(40)]))