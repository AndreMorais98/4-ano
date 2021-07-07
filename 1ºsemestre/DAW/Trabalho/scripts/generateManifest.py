import os,json
folder = "data/"
paths = [os.path.join(root,filename).replace(folder,"").replace("\\","/") for root, directories, filenames in os.walk(folder) for filename in filenames]
data = {}
data["ficheiros"] = paths
json.dump(data, open("manifesto.json", "w+", encoding='utf-8'),indent=4,ensure_ascii=False)
print("Ficheiro manifesto.json foi criado com sucesso.")