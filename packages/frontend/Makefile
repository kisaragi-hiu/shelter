../../data/normalized.json:
	cd ../../data && $(MAKE) normalized.json

data: ../../data/normalized.json

dev: data
	bunx astro dev

# build:
# 	bunx astro check && bunx astro build

build: data
	bunx astro build
