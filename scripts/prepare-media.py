from PIL import Image
from pathlib import Path
import subprocess,imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe()
out=Path('src/assets');out.mkdir(exist_ok=True)
for name in ['focus','vertical_mode','horisontal_mode','gql_multi_queries','gql_var_form','gql_schema','gql_autocomplete','dynamic_vars','timeline']:
 im=Image.open('assets/'+name+'.png').convert('RGB')
 im.crop((110,75,3474,2120)).save(out/(name+'.webp'),quality=90)
 # Feature crops retain the original UI; remove workspace sidebar for legibility.
 if name.startswith('gql_') or name in ['dynamic_vars','timeline']:
  im.crop((755,260,3474,2120)).save(out/(name+'-detail.webp'),quality=92)
Image.open('assets/hero.png').convert('RGB').save(out/'hero.webp',quality=86)
im=Image.open('assets/tracing.png').convert('RGB');im.crop((60,55,3440,2110)).save(out/'tracing.webp',quality=90)
for name,t in [('compose',0),('inspect',2),('adjust',4)]:
 subprocess.run([ff,'-y','-ss',str(t),'-i','assets/hero.mp4','-frames:v','1',str(out/(name+'.png'))],capture_output=True,check=True)
 im=Image.open(out/(name+'.png'));im.save(out/(name+'.webp'),quality=92);(out/(name+'.png')).unlink()
subprocess.run([ff,'-y','-ss','5.3','-i','assets/jpath.mp4','-frames:v','1',str(out/'filter.png')],capture_output=True,check=True)
im=Image.open(out/'filter.png');im.crop((470,275,2350,1370)).save(out/'filter.webp',quality=92);(out/'filter.png').unlink()
for name in ['hero','tracing']:
 subprocess.run([ff,'-y','-i','assets/'+name+'.mp4','-vf','scale=1920:-2,fps=30','-c:v','libx264','-preset','slow','-crf','23','-an','-movflags','+faststart','public/media/'+name+'.mp4'],capture_output=True,check=True)
 print(name,Path('public/media/'+name+'.mp4').stat().st_size)

# Preserve the request / response area at a readable scale on small screens.
(out/'mobile').mkdir(exist_ok=True)
for name in ['compose','inspect','adjust','focus','vertical_mode','horisontal_mode']:
 im=Image.open(out/(name+'.webp'))
 left,top=(470,75) if name in ['compose','inspect','adjust'] else (640,180)
 im.crop((left,top,im.width,im.height)).save(out/'mobile'/(name+'.webp'),quality=92)

for name in ['hero','tracing']:
 subprocess.run([ff,'-y','-i','assets/'+name+'.mp4','-vf','scale=960:-2,fps=24','-c:v','libx264','-preset','slow','-crf','24','-an','-movflags','+faststart','public/media/'+name+'-mobile.mp4'],capture_output=True,check=True)
