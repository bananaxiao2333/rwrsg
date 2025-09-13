import logging
import xml.etree.ElementTree as ET
import os
import json

logger = logging.getLogger('logger')
logger.setLevel(logging.DEBUG)
console_handler = logging.StreamHandler()
console_handler.setLevel(logging.DEBUG)
file_handler = logging.FileHandler('logs/logger.log')
file_handler.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
console_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)
logger.addHandler(console_handler)
logger.addHandler(file_handler)

logger.info('Prog start')
rwrWeaponFileList = os.listdir('./data/weapons')
rwrWeaponTreeList = []
for fileName in rwrWeaponFileList:
    try:
        rwrWeaponTreeList.append(ET.parse('./data/weapons/'+fileName))
    except Exception as e:
        logger.debug("{}|{}".format(fileName,e))
rwrTransKeyPairList = {}
for item in ET.parse('./data/misc_text_vanilla.xml').findall('.//text'):
    attr = item.attrib
    try:
        rwrTransKeyPairList[attr['key']] = attr['text']
    except Exception as e:
        logger.debug("{}|{}".format(item.attrib,e))
ret = []
recordedList = []
keyList = []
for weaponTree in rwrWeaponTreeList:
    tree = ET.ElementTree(weaponTree)
    try:
        specAttr = tree.find('.//specification').attrib
        if specAttr['name'] not in rwrTransKeyPairList:
            continue
        if specAttr['name'] in recordedList:
            continue
        ret.append({**specAttr,'key':specAttr['name'],'cnName':rwrTransKeyPairList[specAttr['name']]})
        recordedList.append(specAttr['name'])
        for key in specAttr:
            if key not in keyList:
                keyList.append(key)
    except Exception as e:
        logger.warning('{}'.format(e))
logger.debug(ret)
with open("weaponAttrList.json", "w") as json_file:
    json.dump(ret, json_file)