.ONESHELL:

.DEFAULT_GOAL := normalized.json

wget := wget --quiet --show-progress --continue

RAW := raw/12849-避難收容處所開設情形.xml
RAW += raw/32259-桃園市-桃園市避難收容所.csv
RAW += raw/73242-避難收容處所點位檔.csv
RAW += raw/86415-高雄市-因應各項災害避難收容場所一覽表.json
RAW += raw/159491-花蓮縣-避難收容所位置及收容人數.csv

raw/12849-避難收容處所開設情形.xml:
	$(wget) --no-check-certificate -O "$@" "https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=ABEEA328-61FC-4340-9A90-8E5EF6A9870A"

raw/32259-桃園市-桃園市避難收容所.csv:
	$(wget) -O "$@" "https://data.tycg.gov.tw/opendata/datalist/datasetMeta/download?id=247820e9-0bb6-4ff9-a34e-f1df72d8b296&rid=2235c67b-c155-4c97-92ee-d062987c81f8"

raw/73242-避難收容處所點位檔.csv:
	$(wget) -O "$@" "https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=11B80A14-C09A-4877-B892-C3E3F75BC2FB"
	echo "請手動用 LibreOffice 轉換 $@ 的編碼…"

raw/86415-高雄市-因應各項災害避難收容場所一覽表.json:
	$(wget) -O "$@" "https://api.kcg.gov.tw/api/service/Get/76409999-d13e-4cb2-814c-61444ac45d12"

raw/159491-花蓮縣-避難收容所位置及收容人數.csv:
	$(wget) -O "$@" "https://ws.hl.gov.tw/001/Upload/518/relfile/23071/104507/06d69a72-7241-4738-b20e-a7e915057295.csv"

normalized.json: $(RAW) $(wildcard *.ts)
	bun normalize.ts

.PHONY: raw
raw: $(RAW)

.PHONY: data
data: normalized.json
