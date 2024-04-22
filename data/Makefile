.ONESHELL:

wget := wget --quiet --show-progress --continue

data: 73242-避難收容處所點位檔.csv

73242-避難收容處所點位檔.csv:
	$(wget) -O "$@" "https://data.moi.gov.tw/MoiOD/System/DownloadFile.aspx?DATA=11B80A14-C09A-4877-B892-C3E3F75BC2FB"
	echo "請手動用 LibreOffice 轉換 $@ 的編碼…"
