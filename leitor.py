import sys
import json
import uuid
from pdfminer.high_level import extract_pages
from pdfminer.layout import LTTextBoxHorizontal
# element in page_layout: x0, y0, x1, y1, width, height, bbox, _objs, index

filenames = sys.argv[1:]


newfile = open('./tmp_' + str(uuid.uuid4()), 'w')


def ler(filename):
    leitura = []
    i = 0
    leitura.append({"filename": filename})
    for page_layout in extract_pages(filename):
        leitura.append({"pg": i})
        i += 1
        for element in page_layout:
            if (isinstance(element, LTTextBoxHorizontal)):
                x = {
                    "x0": element.x0,
                    "y0": element.y0,
                    "x1": element.x1,
                    "y1": element.y1,
                    "width": element.width,
                    "txt": element.get_text()
                }
                leitura.append(x)
    return leitura


if len(filenames) == 1:
    json.dump(ler(filenames[0]), newfile)
else:
    json.dump(list(map(ler, filenames)), newfile)

newfile.close()
print(newfile.name)
